const Users = require('../model/users.model')
const Utils = require('../model/utils.model')
const Departments = require('../model/department.model')
const formidable = require('formidable')
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path');
const moment = require('moment')


exports.getDetailView = async (req, res, next) => {
    let username = await req.session.username
    if(!username) {
        res.redirect('/utils/login')
        return 
    }

    let isDirector = await Utils.checkDirector(req, username)
    if(!isDirector) {
        res.redirect('/utils/403')
        return 
    }

    let userDetail_id = req.query.user_id
    
    let departments;
    let userInfo;
    let dayOff
    let userDetailInfo;
    let users;
    let user_id = await Utils.getIdFromUsername(req, username)
    let isNormalEmployee = await Utils.checkNormalEmployee(req, username)
    let isManager = await Utils.checkManager(req, username)
    if(user_id) {
        departments = await Departments._get_list_departments(req)
        users = await Users._get_list_users(req)
        userInfo = await Users.getUserInfo(req, username)
        userDetailInfo = await Users.getUserInfoById(req, userDetail_id)
        dayOff = await Users.getDayOffUsed(req, userDetail_id)
    }

    res.render("users/detail", { layout: "layouts/main", isDirector: isDirector
                                                    , isNormalEmployee: isNormalEmployee
                                                    , isManager: isManager
                                                    , departments: departments
                                                    , dayUsed: dayOff
                                                    , userInfo: userInfo 
                                                    , userDetailInfo: userDetailInfo 
                                                    , status: req.query.status 
                                                    , moment: moment
                                                    , users: users    
                                                    , title: 'User Detail' });
}

exports.getCurrentUserDetailView = async (req, res, next) => {
    let username = await req.session.username
    if(!username) {
        res.redirect('/utils/login')
        return 
    }
    
    let departments;
    let userInfo;
    let dayOff
    let userDetailInfo;
    let users;
    let user_id = await Utils.getIdFromUsername(req, username)
    let isNormalEmployee = await Utils.checkNormalEmployee(req, username)
    let isManager = await Utils.checkManager(req, username)
    let isDirector = await Utils.checkDirector(req, username)
    if(user_id) {
        departments = await Departments._get_list_departments(req)
        users = await Users._get_list_users(req)
        userInfo = await Users.getUserInfo(req, username)
        userDetailInfo = await Users.getUserInfoById(req, user_id)
        dayOff = await Users.getDayOffUsed(req, user_id)
    }

    res.render("users/currentUserDetail", { layout: "layouts/main", isDirector: isDirector
                                                    , isNormalEmployee: isNormalEmployee
                                                    , isManager: isManager
                                                    , departments: departments
                                                    , dayUsed: dayOff
                                                    , userInfo: userInfo 
                                                    , userDetailInfo: userDetailInfo 
                                                    , status: req.query.status 
                                                    , moment: moment
                                                    , users: users    
                                                    , title: 'User Detail' });
}

exports.getManagementView = async (req, res, next) => {
    let username = await req.session.username
    if(!username) {
        res.redirect('/utils/login')
        return 
    }

    let isDirector = await Utils.checkDirector(req, username)
    if(!isDirector) {
        res.redirect('/utils/403')
        return 
    }
    
    let departments;
    let userInfo;
    let users;
    let user_id = await Utils.getIdFromUsername(req, username)
    let isNormalEmployee = await Utils.checkNormalEmployee(req, username)
    let isManager = await Utils.checkManager(req, username)
    if(user_id) {
        departments = await Departments._get_list_departments(req)
        users = await Users._get_list_users(req)
        userInfo = await Users.getUserInfo(req, username)
    }

    res.render("users/management", { layout: "layouts/main", isDirector: isDirector
                                                    , isNormalEmployee: isNormalEmployee
                                                    , isManager: isManager
                                                    , departments: departments
                                                    , userInfo: userInfo 
                                                    , status: req.query.status 
                                                    , users: users    
                                                    , title: 'User Management' });
}

exports.createUser = async (req, res, next) => {
    exceptionTranslation = {
        "Error": "C?? l???i ???? x???y ra, vui l??ng th??? l???i l???n n???a",
        "Empty field": "Vui l??ng ??i???n ?????y ????? th??ng tin",
        "sdt length condition": "S??? ??i???n tho???i ph???i c?? 10 s???",
        "Username condition": "T??n t??i kho???n ph???i c?? ??t nh???t 5 ch??? c??i, nhi???u nh???t 20 ch??? c??i v?? kh??ng c?? kho???ng tr???ng",
        "max_leader_condition": "V?????t qu?? s??? l?????ng tr?????ng ph??ng, m???i ph??ng t???i ??a 1 tr?????ng ph??ng",
        "user_role_condition": "Ng?????i d??ng kh??ng ????? quy???n ????? th???c hi???n thao t??c n??y",
    };

    let session_username = await req.session.username
    if(!session_username) {
        res.redirect('/utils/login')
        return 
    }

    let isDirector = await Utils.checkDirector(req, session_username)
    if(!isDirector) {
        res.statusCode = 403
        res.end(exceptionTranslation['user_role_condition'])
        return 
    }

    const {ho_ten, user_name, ngay_sinh, gioi_tinh, phong_ban_id, status, sdt} = req.body

    if(!ho_ten || 
        !user_name ||
        !ngay_sinh ||
        !gioi_tinh ||
        !phong_ban_id ||
        !status ||
        !sdt
    ) {
        res.statusCode = 422
        res.end(exceptionTranslation["Empty field"])
        return 
    }

    let checkExistUser = await Utils.checkExistUser(req, user_name)

    // Check existed user
    if(checkExistUser) {
        res.statusCode = 409
        res.end("Username ???? t???n t???i vui l??ng ch???n username kh??c")
        return 
    }

    let checkExistedPhone = await Users.checkExistedPhone(req, sdt)

    // Check existed phone number
    if(checkExistedPhone) {
        res.statusCode = 409
        res.end("S??? ??i???n tho???i ???? ???????c s??? d???ng")
        return 
    }

    let checkRoleCreate = await Users.checkRoleCreate(req, phong_ban_id)

    if(checkRoleCreate && status == 1) {
        res.statusCode = 422
        res.end("Hi???n ???? c?? tr?????ng ph??ng cho ph??ng ban n??y")
        return
    }
    
    // Check length phone
    if(sdt.length !== 10) {
        res.statusCode = 422
        res.end(exceptionTranslation["sdt length condition"])
        return
    }

    // Check length username
    if(user_name.length < 5 || user_name.length > 20) {
        res.statusCode = 422
        res.end(exceptionTranslation["Username condition"])
        return
    }

    let password = bcrypt.hashSync(user_name, 10)
    let user_role = "Employee"
    let create_fields = [ho_ten, user_name, ngay_sinh, gioi_tinh, phong_ban_id, status, sdt, password, user_role]

    let createUser = await Users.createUser(req, create_fields)

    if(createUser) {
        res.statusCode = 200
        res.end("Success")
        return
    } else {
        res.statusCode = 500
        res.end(exceptionTranslation["Error"])
        return
    }
}

exports.disableUser = async (req, res, next) => {
    exceptionTranslation = {
        "Error": "C?? l???i ???? x???y ra, vui l??ng th??? l???i l???n n???a",
        "Empty field": "Vui l??ng ??i???n ?????y ????? th??ng tin",
        "user_role_condition": "Ng?????i d??ng kh??ng ????? quy???n ????? th???c hi???n thao t??c n??y",
    };

    let session_username = await req.session.username
    if(!session_username) {
        res.redirect('/utils/login')
        return 
    }

    let isDirector = await Utils.checkDirector(req, session_username)
    if(!isDirector) {
        res.statusCode = 403
        res.end(exceptionTranslation['user_role_condition'])
        return 
    }

    const user_name = req.body.user_name

    if(!user_name) {
        res.statusCode = 422
        res.end(exceptionTranslation["Empty field"])
        return 
    }

    let checkExistUser = await Utils.checkExistUser(req, user_name)

    // Check existed user
    if(!checkExistUser) {
        res.statusCode = 404
        res.end("T??i kho???n kh??ng t???n t???i")
        return 
    }

    let disableUser = await Users.disableUser(req, user_name)

    if(disableUser) {
        res.statusCode = 200
        res.end("Success")
        return
    } else {
        res.statusCode = 500
        res.end(exceptionTranslation["Error"])
        return
    }
}

exports.updateUser = async (req, res, next) => {
    exceptionTranslation = {
        "Error": "C?? l???i ???? x???y ra, vui l??ng th??? l???i l???n n???a",
        "Empty field": "Vui l??ng ??i???n ?????y ????? th??ng tin",
        "sdt length condition": "S??? ??i???n tho???i ph???i c?? 10 s???",
        "Username condition": "T??n t??i kho???n ph???i c?? ??t nh???t 5 ch??? c??i, nhi???u nh???t 20 ch??? c??i v?? kh??ng c?? kho???ng tr???ng",
        "max_leader_condition": "V?????t qu?? s??? l?????ng tr?????ng ph??ng, m???i ph??ng t???i ??a 1 tr?????ng ph??ng",
    };

    let session_username = await req.session.username
    if(!session_username) {
        res.redirect('/utils/login')
        return 
    }

    let isDirector = await Utils.checkDirector(req, session_username)
    if(!isDirector) {
        res.statusCode = 403
        res.end(exceptionTranslation['user_role_condition'])
        return 
    }

    const {ho_ten, ngay_sinh, gioi_tinh, status, sdt, user_id} = req.body

    if(!ho_ten || 
        !ngay_sinh ||
        !gioi_tinh ||
        !status ||
        !sdt ||
        !user_id
    ) {
        res.statusCode = 422
        res.end(exceptionTranslation["Empty field"])
        return 
    }

    let checkExistedPhoneExcept = await Users.checkExistedPhoneExcept(req, sdt, user_id)

    // Check existed phone number
    if(checkExistedPhoneExcept) {
        res.statusCode = 409
        res.end("S??? ??i???n tho???i ???? ???????c s??? d???ng")
        return 
    }
    
    // Check length phone
    if(sdt.length !== 10) {
        res.statusCode = 422
        res.end(exceptionTranslation["sdt length condition"])
        return
    }

    let update_fields = [ho_ten, ngay_sinh, gioi_tinh, status, sdt, user_id]

    let updateUser = await Users.updateUser(req, update_fields)

    if(updateUser) {
        res.statusCode = 200
        res.end("Success")
        return
    } else {
        res.statusCode = 500
        res.end(exceptionTranslation["Error"])
        return
    }

}

exports.resetDefaultPassword = async (req, res, next) => {
    exceptionTranslation = {
        "Error": "C?? l???i ???? x???y ra, vui l??ng th??? l???i l???n n???a",
        "Empty field": "Vui l??ng ??i???n ?????y ????? th??ng tin",
        "default_pass_condtion": "M???t kh???u ph???i kh??c v???i t??n ????ng nh???p",
        "user_role_condition": "Ng?????i d??ng kh??ng ????? quy???n ????? th???c hi???n thao t??c n??y",
    };

    let session_username = await req.session.username
    if(!session_username) {
        res.redirect('/utils/login')
        return 
    }

    let isDirector = await Utils.checkDirector(req, session_username)
    if(!isDirector) {
        res.statusCode = 403
        res.end(exceptionTranslation['user_role_condition'])
        return 
    }

    let user_name = req.body.user_name
    
    if(!user_name) {
        res.statusCode = 422
        res.end(exceptionTranslation["Empty field"])
        return 
    }
    
    let password = bcrypt.hashSync(user_name, 10)
 
    let resetDefaultPassword = await Users.resetDefaultPassword(req, user_name, password)

    if(resetDefaultPassword) {
        res.statusCode = 200
        res.end("Success")
        return
    } else {
        res.statusCode = 500
        res.end(exceptionTranslation["Error"])
        return
    }
}

exports.updatePassword = async (req, res, next) => {

    exceptionTranslation = {
        "Error": "C?? l???i ???? x???y ra, vui l??ng th??? l???i l???n n???a",
        "Empty field": "Vui l??ng ??i???n ?????y ????? th??ng tin",
        "invalid_password": "M???t kh???u kh??ng h???p l???",
        "password_lenght_condition": "M???t kh???u ??t nh???t ph???i c?? 5 k?? t???",
        "password_default_condiotion": "M???t kh???u m???i ph???i kh??c m???t kh???u m???c ?????nh",
    };

    let {username, new_password} = req.body

    if(!username || !new_password) {
        res.statusCode = 422
        res.end(exceptionTranslation["Empty field"])
        return 
    }

    if(new_password.length < 5) {
        res.statusCode = 422
        res.end(exceptionTranslation["password_lenght_condition"])
        return
    }

    // Check password default
    if(new_password == username) {
        res.statusCode = 422
        res.end(exceptionTranslation['password_default_condiotion'])
        return
    }

    new_password = bcrypt.hashSync(new_password, 10)
 
    let updatePassword = await Users.updatePassword(req, username, new_password)

    if(updatePassword) {
        res.statusCode = 200
        res.end("Success")
        req.session.username = username
        return
    } else {
        res.statusCode = 500
        res.end(exceptionTranslation["Error"])
        return
    }
}

exports.userUpdatePassword = async (req, res, next) => {

    exceptionTranslation = {
        "Error": "C?? l???i ???? x???y ra, vui l??ng th??? l???i l???n n???a",
        "Empty field": "Vui l??ng ??i???n ?????y ????? th??ng tin",
        "invalid_password": "M???t kh???u kh??ng h???p l???",
        "password_lenght_condition": "M???t kh???u ??t nh???t ph???i c?? 5 k?? t???",
    };

    let {curr_password, new_password} = req.body

    if(!curr_password || !new_password) {
        res.statusCode = 422
        res.end(exceptionTranslation["Empty field"])
        return 
    }

    let session_username = await req.session.username
    if(!session_username) {
        res.redirect('/utils/login')
        return 
    }

    let checkExistUser = await Utils.checkExistUser(req, session_username)

    // Check existed user
    if(!checkExistUser) {
        res.statusCode = 404
        res.end("T??i kho???n kh??ng t???n t???i")
        return 
    }

    let userInfo = await Users.getUserInfo(req, session_username)

    // Check existed user
    if(!userInfo || !bcrypt.compareSync(curr_password, userInfo.password) ) {
        res.statusCode = 422
        res.end(exceptionTranslation["invalid_password"])
        return 
    }

    if(new_password.length < 5) {
        res.statusCode = 422
        res.end(exceptionTranslation["password_lenght_condition"])
        return
    }

    new_password = bcrypt.hashSync(new_password, 10)
 
    let updatePassword = await Users.updatePassword(req, session_username, new_password)

    if(updatePassword) {
        res.statusCode = 200
        res.end("Success")
        return
    } else {
        res.statusCode = 500
        res.end(exceptionTranslation["Error"])
        return
    }
}

exports.updateAvatar = async (req, res, next) => {
    let exceptionTranslation = {
        "Ten task length condition": "????? d??i t???i ??a c???a t??n task l?? 50 k?? t???",
        "Mo ta length condition": "????? d??i t???i ??a c???a m?? t??? l?? 2550 k?? t???",
        "Error": "Something went wrong, please try again later",
        "Deadline condition": "H???n n???p ph???i sau h??m nay",
        "user_role_condition": "Ng?????i d??ng kh??ng ????? quy???n ????? th???c hi???n thao t??c n??y",
        "File error condition": "File b??? l???i, vui l??ng ch???n file kh??c",
        "File extension condition": "File sai ?????nh d???ng",
        "File size condition": "Vui l??ng ch???n file nh??? h??n 5M"
    };

    let session_username = await req.session.username
    if(!session_username) {
        res.redirect('/utils/login')
        return 
    }

    let user_id = await Utils.getIdFromUsername(req, session_username)
    user_id = user_id.toString()

    // Check file
    if(req.files &&
        req.files['profile-avatar-file']
    ) {
        let profile_avatar_file = req.files['profile-avatar-file']
        // check file size
        if(profile_avatar_file.size > 5000000) {
            res.statusCode = 422
            res.end(exceptionTranslation["File size condition"])
            return
        }

        // check file extension
        if(path.extname(profile_avatar_file.name) == '.exe' || path.extname(profile_avatar_file.name) == '.sh') {
            res.statusCode = 422
            res.end(exceptionTranslation["File extension condition"])
            return
        }

        if (!fs.existsSync(path.join(__dirname,'../','public','images','user_avt', user_id))) {
            fs.mkdirSync(path.join(__dirname,'../','public','images','user_avt', user_id))
        }

        let file_path = path.join(__dirname,'../','public','images','user_avt', user_id, profile_avatar_file.name)
        let upload_error
        profile_avatar_file.mv(file_path, err => {
            if(err) {
                upload_error = err
            }
        })
        let db_file_path = '/images/user_avt/'+user_id+'/'+profile_avatar_file.name
        if(!upload_error) {
            let updateAvatar = await Users.updateAvatar(req, db_file_path, user_id)
            if(updateAvatar) {
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
        res.statusCode = 422
        res.end("Kh??ng ????? th??ng tin")
        return
    }
        
}