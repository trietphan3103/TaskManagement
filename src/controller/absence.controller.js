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
        "Error": "Có lỗi đã xảy ra, vui lòng thử lại lần nữa",
        "Empty field": "Vui lòng điền đầy đủ thông tin",
        "absence_create_conditon": "Không thể tạo đơn xin nghỉ phép mới do bạn đang có đơn nghỉ phép khác chờ duyệt hoặc bạn có đơn nghỉ phép đã duyệt trong vòng 7 ngày gần đây",
        'The INSERT statement conflicted with the CHECK constraint "check_ABSENCE_date". The conflict occurred in database "CSDLPT", table "dbo.ABSENCE".': "Ngày kết thúc phải lớn hơn ngày bắt đầu và ngày bắt đầu phải lớn hơn ngày hiện tại",
        "absence_exceed_max_conditon": "Số ngày nghỉ vượt quá số lượng cho phép",
        "absence_role_condition": "Giám đốc không cần tạo đơn nghỉ phép",
        "File error condition": "File bị lỗi, vui lòng chọn file khác",
        "File extension condition": "File sai định dạng",
        "File size condition": "Vui lòng chọn file nhỏ hơn 5M"
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
        res.end('Ngày bắt đầu phải lớn hơn ngày hiện tại')
        return
    }
    if(d_end < d_start) {
        res.statusCode = 422
        res.end('Ngày kết thúc phải lớn hơn ngày bắt đầu')
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
        "Error": "Có lỗi đã xảy ra, vui lòng thử lại lần nữa",
        "absence_process_role_condition": "Người dùng không đủ quyền để thực hiện thao tác này",
        "absence_process_date_condition": "Ngày duyệt phải sớm hơn ngày bắt đầu và sớm hơn hoặc bằng ngày tạo",
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
        res.end("Thiếu thông tin")
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