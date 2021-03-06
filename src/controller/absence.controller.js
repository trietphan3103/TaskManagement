const Users = require('../model/users.model')
const Absence = require('../model/absence.model')
const Utils = require('../model/utils.model')
const moment = require('moment')
const fs = require('fs')
const path = require('path');

exports.getAbsenceIndex = async (req, res, next) => {
    let username = await req.session.username
    if(!username) {
        res.redirect('/utils/login')
        return 
    }

    let isDirector = await Utils.checkDirector(req, username)
    if(isDirector) {
        res.redirect('/utils/403')
        return 
    }
    
    let absenceFuture
    let absenceCurrent
    let userInfo
    let dayOff
    let user_id = await Utils.getIdFromUsername(req, username)
    let isNormalEmployee = await Utils.checkNormalEmployee(req, username)
    let isManager = await Utils.checkManager(req, username)
    if(user_id) {
        absenceFuture = await Absence._get_list_proccessed_absence_future_current_user(req, user_id)
        absenceCurrent = await Absence._get_list_absence_current_user(req, user_id)
        userInfo = await Users.getUserInfo(req, username)
        dayOff = await Users.getDayOffUsed(req, user_id)
    }

    res.render("absence/absenceIndex", { layout: "layouts/main", absenceFuture: absenceFuture
                                                    , absenceCurrent: absenceCurrent
                                                    , userInfo: userInfo
                                                    , dayUsed: dayOff
                                                    , isDirector: isDirector
                                                    , isNormalEmployee: isNormalEmployee
                                                    , status: req.query.status 
                                                    , moment: moment
                                                    , isManager: isManager
                                                    , title: 'Absence Index' });
}

exports.getAbsenceManagement = async (req, res, next) => {
    let username = await req.session.username
    if(!username) {
        res.redirect('/utils/login')
        return
    }

    let isNormalEmployee = await Utils.checkNormalEmployee(req, username)
    if(isNormalEmployee) {
        res.redirect('/')
        return
    }

    let waitingAbsence
    let processedAbsence
    let isDirector = await Utils.checkDirector(req, username)
    if(isDirector) {
        waitingAbsence = await Absence._get_list_waiting_absence_of_manager(req)
        processedAbsence = await Absence._get_list_proccessed_absence_of_manager(req)
    } else {
        waitingAbsence = await Absence._get_list_waiting_absence_of_deparment(req, req.session.con_option)
        processedAbsence = await Absence._get_list_proccessed_absence_of_deparment(req, req.session.con_option)
    }
    
    let userInfo
    let user_id = await Utils.getIdFromUsername(req, username)
    let isManager = await Utils.checkManager(req, username)
    if(user_id) {
        userInfo = await Users.getUserInfo(req, username)
    }

    res.render("absence/management", { layout: "layouts/main"
                                                    , userInfo: userInfo
                                                    , isDirector: isDirector
                                                    , isNormalEmployee: isNormalEmployee
                                                    , waitingAbsence: waitingAbsence
                                                    , processedAbsence: processedAbsence
                                                    , status: req.query.status 
                                                    , moment: moment
                                                    , isManager: isManager
                                                    , title: 'Absence Management' });
}

exports.createAbsence = async (req, res, next) => {
    let exceptionTranslation = {
        "Error": "C?? l???i ???? x???y ra, vui l??ng th??? l???i l???n n???a",
        "Empty field": "Vui l??ng ??i???n ?????y ????? th??ng tin",
        "absence_create_conditon": "Kh??ng th??? t???o ????n xin ngh??? ph??p m???i do b???n ??ang c?? ????n ngh??? ph??p kh??c ch??? duy???t ho???c b???n c?? ????n ngh??? ph??p ???? duy???t trong v??ng 7 ng??y g???n ????y",
        'The INSERT statement conflicted with the CHECK constraint "check_ABSENCE_date". The conflict occurred in database "CSDLPT", table "dbo.ABSENCE".': "Ng??y k???t th??c ph???i l???n h??n ng??y b???t ?????u v?? ng??y b???t ?????u ph???i l???n h??n ng??y hi???n t???i",
        "absence_exceed_max_conditon": "S??? ng??y ngh??? v?????t qu?? s??? l?????ng cho ph??p",
        "absence_role_condition": "Gi??m ?????c kh??ng c???n t???o ????n ngh??? ph??p",
        "File error condition": "File b??? l???i, vui l??ng ch???n file kh??c",
        "File extension condition": "File sai ?????nh d???ng",
        "File size condition": "Vui l??ng ch???n file nh??? h??n 5M"
    };

    let session_username = await req.session.username
    if(!session_username) {
        res.redirect('/utils/login')
        return 
    }

    let isDirector = await Utils.checkDirector(req, session_username)
    if(isDirector) {
        res.statusCode = 403
        res.end(exceptionTranslation['absence_role_condition'])
        return 
    }

    let nguoi_tao_id = await Utils.getIdFromUsername(req, session_username)
    
    let nguoi_tao_info = await Users.getUserInfoById(req, nguoi_tao_id)

    let truong_phong = await Users.getHeadDepartment(req)

    let nguoi_duyet_id = '1'

    // init nguoi_tao and nguoi_duyet
    if(nguoi_tao_info.status == 1) {
        nguoi_duyet_id = '1'
    } else {
        nguoi_duyet_id = truong_phong.user_id
    }

    let {ngay_bat_dau, ngay_ket_thuc, ly_do} = req.body

    if(!nguoi_tao_id ||
        !ngay_bat_dau ||
        !ngay_ket_thuc ||
        !ly_do    
    ) {
        res.statusCode = 422
        res.end(exceptionTranslation["Empty field"])
        return
    }

    // Check file
    if(req.files &&
        req.files.absence_file
    ) {
        let absence_file = req.files.absence_file
        // check file size
        if(absence_file.size > 5000000) {
            res.statusCode = 422
            res.end(exceptionTranslation["File size condition"])
            return
        }

        // check file extension
        if(path.extname(absence_file.name) == '.exe' || path.extname(absence_file.name) == '.sh') {
            res.statusCode = 422
            res.end(exceptionTranslation["File extension condition"])
            return
        }
    }

    // check Date
    let d_start = new Date(ngay_bat_dau)
    let d_end = new Date(ngay_ket_thuc)
    let d_now = new Date()
    if(d_now >= d_start) {
        res.statusCode = 422
        res.end('Ng??y b???t ?????u ph???i l???n h??n ng??y hi???n t???i')
        return
    }
    if(d_end < d_start) {
        res.statusCode = 422
        res.end('Ng??y k???t th??c ph???i l???n h??n ng??y b???t ?????u')
        return
    }
    let diff = new Date(d_end.getTime() - d_start.getTime())
    diff = diff.getUTCDate() - 1

    let dayUsedOnCreate = await Users.getDayOffOnCreate(req, nguoi_tao_id, ngay_bat_dau)

    if(dayUsedOnCreate + diff > nguoi_tao_info.so_absence_max) {
        res.statusCode = 422
        res.end(exceptionTranslation["absence_exceed_max_conditon"])
        return
    }

    let numCurrentAbsence = await Absence.getNumCurrentAbsence(req, nguoi_tao_id)
    let numWaitingAbsence = await Absence.getNumWaitingAbsence(req, nguoi_tao_id)

    if(numCurrentAbsence >= 1 || numWaitingAbsence >= 1 ) {
        res.statusCode = 422
        res.end(exceptionTranslation["absence_create_conditon"])
        return
    }

    let createAbsence = await Absence.createAbsence(req, ngay_bat_dau, ngay_ket_thuc, ly_do, nguoi_tao_id, nguoi_duyet_id)

    if(createAbsence ) {
        let insert_id = createAbsence.id.toString()
        if(req.files &&
            req.files.absence_file
        ) {
            let absence_file = req.files.absence_file
            fs.mkdirSync(path.join(__dirname,'../','public','files','absence', insert_id))
            let file_path = path.join(__dirname,'../','public','files','absence', insert_id, absence_file.name)
            let upload_error
            absence_file.mv(file_path, err => {
                if(err) {
                    upload_error = err
                }
            })
            let db_file_path = '/files/absence/'+insert_id+'/'+absence_file.name
            if(!upload_error) {
                let updateAbsenceFile = await Absence.updateAbsenceFile(req, db_file_path, insert_id)
                if(updateAbsenceFile) {
                    res.statusCode = 200
                    res.end("Success")
                    return
                } else {
                    res.statusCode = 500
                    res.end(exceptionTranslation["Error"])
                    return
                }
            }
        } else {
            res.statusCode = 200
            res.end("Success")
            return
        }
    } else {
        res.statusCode = 500
        res.end(exceptionTranslation["Error"])
        return
    }
        
}

exports.absenceProcessing = async (req, res, next) => {
    exceptionTranslation = {
        "Error": "C?? l???i ???? x???y ra, vui l??ng th??? l???i l???n n???a",
        "absence_process_role_condition": "Ng?????i d??ng kh??ng ????? quy???n ????? th???c hi???n thao t??c n??y",
        "absence_process_date_condition": "Ng??y duy???t ph???i s???m h??n ng??y b???t ?????u v?? s???m h??n ho???c b???ng ng??y t???o",
    };

    let username = await req.session.username
    if(!username) {
        res.redirect('/utils/login')
        return
    }

    let isNormalEmployee = await Utils.checkNormalEmployee(req, username)
    if(isNormalEmployee) {
        res.statusCode = 422
        res.end(exceptionTranslation['absence_process_role_condition'])
        return
    }

    const {status, absence_id} = req.body

    if(!status ||
        !absence_id 
    ) {
        res.statusCode = 422
        res.end("Thi???u th??ng tin")
        return
    }

    let updateAbsenceStatus = await Absence.updateAbsenceStatus(req, status, absence_id)
    if(updateAbsenceStatus) {
        res.statusCode = 200
        res.end("Success")
        return
    } else {
        res.statusCode = 500
        res.end(exceptionTranslation["Error"])
        return
    }
}