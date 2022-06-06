const Users = require('../model/users.model')
const Task = require('../model/task.model')
const Utils = require('../model/utils.model')
const moment = require('moment')
const fs = require('fs')
const path = require('path');

exports.getTaskManagement = async (req, res, next) => {
    let username = await req.session.username
    if(!username) {
        res.redirect('/utils/login')
        return
    }

    let isDirector = await Utils.checkDirector(req, username)
    let isManager = await Utils.checkManager(req, username)
    if(!isManager) {
        res.redirect('/utils/403')
        return 
    }

    let userInfo
    let user_id = await Utils.getIdFromUsername(req, username)
    let isNormalEmployee = await Utils.checkNormalEmployee(req, username)

    let listTaskStatus1
    let listTaskStatus2
    let listTaskStatus3
    let listTaskStatus4
    let listTaskStatus5
    let listTaskStatus6

    let listEmployee = await Task.getListEmployee(req, username)

    if(user_id) {
        userInfo = await Users.getUserInfo(req, username)
        listTaskStatus1 = await Task._getListTaskByStatus(req, user_id, 1)
        listTaskStatus2 = await Task._getListTaskByStatus(req, user_id, 2)
        listTaskStatus3 = await Task._getListTaskByStatus(req, user_id, 3)
        listTaskStatus4 = await Task._getListTaskByStatus(req, user_id, 4)
        listTaskStatus5 = await Task._getListTaskByStatus(req, user_id, 5)
        listTaskStatus6 = await Task._getListTaskByStatus(req, user_id, 6)
    }


    res.render("task/management", { layout: "layouts/main"
                                                    , userInfo: userInfo
                                                    , listEmployee: listEmployee
                                                    , listTaskStatus1: listTaskStatus1
                                                    , listTaskStatus2: listTaskStatus2
                                                    , listTaskStatus3: listTaskStatus3
                                                    , listTaskStatus4: listTaskStatus4
                                                    , listTaskStatus5: listTaskStatus5
                                                    , listTaskStatus6: listTaskStatus6
                                                    , isDirector: isDirector
                                                    , isManager: isManager
                                                    , isNormalEmployee: isNormalEmployee
                                                    , status: req.query.status 
                                                    , moment: moment
                                                    , title: 'Task Management' });
}

exports.getTaskIndex = async (req, res, next) => {
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

    let userInfo
    let user_id = await Utils.getIdFromUsername(req, username)
    let isNormalEmployee = await Utils.checkNormalEmployee(req, username)
    let isManager = await Utils.checkManager(req, username)

    let listTaskStatus1
    let listTaskStatus2
    let listTaskStatus3
    let listTaskStatus4
    let listTaskStatus5
    let listTaskStatus6

    if(user_id) {
        userInfo = await Users.getUserInfo(req, username)
        listTaskStatus1 = await Task._getListTaskByStatus(req, user_id, 1)
        listTaskStatus2 = await Task._getListTaskByStatus(req, user_id, 2)
        listTaskStatus3 = await Task._getListTaskByStatus(req, user_id, 3)
        listTaskStatus4 = await Task._getListTaskByStatus(req, user_id, 4)
        listTaskStatus5 = await Task._getListTaskByStatus(req, user_id, 5)
        listTaskStatus6 = await Task._getListTaskByStatus(req, user_id, 6)
    }


    res.render("task/taskIndex", { layout: "layouts/main"
                                                    , userInfo: userInfo
                                                    , listTaskStatus1: listTaskStatus1
                                                    , listTaskStatus2: listTaskStatus2
                                                    , listTaskStatus3: listTaskStatus3
                                                    , listTaskStatus4: listTaskStatus4
                                                    , listTaskStatus5: listTaskStatus5
                                                    , listTaskStatus6: listTaskStatus6
                                                    , isDirector: isDirector
                                                    , isManager: isManager
                                                    , isNormalEmployee: isNormalEmployee
                                                    , status: req.query.status 
                                                    , moment: moment
                                                    , title: 'Task Index' });
}

exports.getTaskDetail = async (req, res, next) => {
    let task_id = req.body.task_id
    if(!task_id) {
        res.statusCode = 422
        res.end("Vui lòng truyền id của task muốn lấy thông tin")
        return
    }
    
    let checkExistedTask = await Task.checkExistedTask(req, task_id)
    if(!checkExistedTask) {
        res.statusCode = 422
        res.end("Không tồn tại task với id yêu cầu")
        return
    }
    
    let taskDetail = await Task.getTaskDetail(req, task_id)

    if(taskDetail) {
        res.statusCode = 200
        res.json(taskDetail)
        return
    } else {
        res.statusCode = 500
        res.end(exceptionTranslation["Error"])
        return
    }
}

exports.getTaskHistory = async (req, res, next) => {
    let task_id = req.query.task_id
    if(!task_id) {
        res.statusCode = 422
        res.end("Vui lòng truyền id của task muốn lấy thông tin")
        return
    }
    
    let checkExistedTask = await Task.checkExistedTask(req, task_id)
    if(!checkExistedTask) {
        res.statusCode = 422
        res.end("Không tồn tại task với id yêu cầu")
        return
    }
    
    let TaskHistory = await Task.getTaskHistory(req, task_id)

    if(TaskHistory) {
        res.statusCode = 200
        res.json(TaskHistory)
        return
    } else {
        res.statusCode = 500
        res.end("Something wents wrong")
        return
    }
}

exports.getTaskHistoryDetail = async (req, res, next) => {
    let history_id = req.query.history_id
    if(!history_id) {
        res.statusCode = 422
        res.end("Vui lòng truyền id của task muốn lấy thông tin")
        return
    }
    
    let checkExistedHistory = await Task.checkExistedHistory(req, history_id)
    if(!checkExistedHistory) {
        res.statusCode = 422
        res.end("Không tồn tại task với id yêu cầu")
        return
    }
    
    let TaskHistoryDetail = await Task.getTaskHistoryDetail(req, history_id)

    if(TaskHistoryDetail) {
        res.statusCode = 200
        res.json(TaskHistoryDetail)
        return
    } else {
        res.statusCode = 500
        res.end("Something wents wrong")
        return
    }
}

exports.createTask = async (req, res, next) => {
    let exceptionTranslation = {
        "Ten task length condition": "Độ dài tối đa của tên task là 50 kí tự",
        "Mo ta length condition": "Độ dài tối đa của mô tả là 2550 kí tự",
        "Error": "Something went wrong, please try again later",
        "Deadline condition": "Hạn nộp phải sau hôm nay",
        "user_role_condition": "Người dùng không đủ quyền để thực hiện thao tác này",
        "File error condition": "File bị lỗi, vui lòng chọn file khác",
        "File extension condition": "File sai định dạng",
        "File size condition": "Vui lòng chọn file nhỏ hơn 5M"
    };

    let session_username = await req.session.username
    if(!session_username) {
        res.redirect('/utils/login')
        return 
    }

    let isManager = await Utils.checkManager(req, session_username)
    if(!isManager) {
        res.statusCode = 403
        res.end(exceptionTranslation['user_role_condition'])
        return 
    }

    let nguoi_tao_id = await Utils.getIdFromUsername(req, session_username)

    let {ten_task, thoi_gian_deadline, mo_ta, nguoi_thuc_hien_id} = req.body

    if(!ten_task ||
        !thoi_gian_deadline ||
        !mo_ta ||
        !nguoi_thuc_hien_id    
    ) {
        res.statusCode = 422
        res.end("Vui lòng nhập đầy đủ thông tin")
        return
    }

    // Check file
    if(req.files &&
        req.files.task_create_file
    ) {
        let task_create_file = req.files.task_create_file
        // check file size
        if(task_create_file.size > 5000000) {
            res.statusCode = 422
            res.end(exceptionTranslation["File size condition"])
            return
        }

        // check file extension
        if(path.extname(task_create_file.name) == '.exe' || path.extname(task_create_file.name) == '.sh') {
            res.statusCode = 422
            res.end(exceptionTranslation["File extension condition"])
            return
        }
    }

    // check length
    if(ten_task.length > 50) {
        res.statusCode = 422
        res.end(exceptionTranslation["Ten task length condition"])
        return
    }

    if(mo_ta.length > 2550) {
        res.statusCode = 422
        res.end(exceptionTranslation["Mo ta length condition"])
        return
    }

    // check Date
    let d_deadline = new Date(thoi_gian_deadline)
    let d_now = new Date()
    if(d_now > d_deadline) {
        res.statusCode = 422
        res.end(exceptionTranslation["Deadline condition"])
        return
    }

    thoi_gian_deadline = new Date(thoi_gian_deadline).toISOString().slice(0, 19).replace('T', ' ')

    let createTask = await Task.createTask(req, nguoi_tao_id, nguoi_thuc_hien_id, ten_task, mo_ta, thoi_gian_deadline)

    if(createTask ) {
        let insert_id = createTask.id.toString()
        if(req.files &&
            req.files.task_create_file
        ) {
            let task_create_file = req.files.task_create_file
            if (!fs.existsSync(path.join(__dirname,'../','public','files','task','task_giao', insert_id))) {
                fs.mkdirSync(path.join(__dirname,'../','public','files','task','task_giao', insert_id))
            }

            let file_path = path.join(__dirname,'../','public','files','task','task_giao', insert_id, task_create_file.name)
            let upload_error
            task_create_file.mv(file_path, err => {
                if(err) {
                    upload_error = err
                }
            })
            let db_file_path = '/files/task/task_giao/'+insert_id+'/'+task_create_file.name
            if(!upload_error) {
                let updateTaskFile = await Task.updateTaskFile(req, db_file_path, insert_id)
                if(updateTaskFile) {
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

exports.taskStart = async (req, res, next) => {
    let task_id = req.body.task_id

    if(!task_id) {
        res.statusCode = 422
        res.end("Vui lòng truyền id của task")
        return
    }
    
    let checkExistedTask = await Task.checkExistedTask(req, task_id)
    if(!checkExistedTask) {
        res.statusCode = 422
        res.end("Không tồn tại task với id yêu cầu")
        return
    }

    let updateTaskStatus = await Task.updateTaskStatus(req, 2, task_id)
    if(updateTaskStatus) {
        res.statusCode = 200
        res.end("Success")
        return
    } else {
        res.statusCode = 500
        res.end(exceptionTranslation["Error"])
        return
    }
}

exports.taskCancel = async (req, res, next) => {
    let task_id = req.body.task_id

    if(!task_id) {
        res.statusCode = 422
        res.end("Vui lòng truyền id của task")
        return
    }
    
    let checkExistedTask = await Task.checkExistedTask(req, task_id)
    if(!checkExistedTask) {
        res.statusCode = 422
        res.end("Không tồn tại task với id yêu cầu")
        return
    }

    let updateTaskStatus = await Task.updateTaskStatus(req, 3, task_id)
    if(updateTaskStatus) {
        res.statusCode = 200
        res.end("Success")
        return
    } else {
        res.statusCode = 500
        res.end(exceptionTranslation["Error"])
        return
    }
}

exports.taskSubmit = async (req, res, next) => {

    exceptionTranslation = {
        "Mo ta nop length condition": "Độ dài tối đa của mô tả là 2550 kí tự",
        "Error": "Something went wrong, please try again later",
        "User condition": "Không được submit task của người khác",
        "File error condition": "File bị lỗi, vui lòng chọn file khác",
        "File extension condition": "File sai định dạng",
        "File size condition": "Vui lòng chọn file nhỏ hơn 5M",
        "Existed task condition": "Không tồn tại task có ID cần nộp"
    };

    let session_username = await req.session.username
    if(!session_username) {
        res.redirect('/utils/login')
        return 
    }

    let {task_id, mo_ta_nop} = req.body

    if(!task_id ||
        !mo_ta_nop   
    ) {
        res.statusCode = 422
        res.end("Vui lòng nhập đầy đủ thông tin")
        return
    }

    // Check file
    if(req.files &&
        req.files.task_submit_file
    ) {
        let task_submit_file = req.files.task_submit_file
        // check file size
        if(task_submit_file.size > 5000000) {
            res.statusCode = 422
            res.end(exceptionTranslation["File size condition"])
            return
        }

        // check file extension
        if(path.extname(task_submit_file.name) == '.exe' || path.extname(task_submit_file.name) == '.sh') {
            res.statusCode = 422
            res.end(exceptionTranslation["File extension condition"])
            return
        }
    }
    
     // check length
    if(mo_ta_nop.length > 2550) {
        res.statusCode = 422
        res.end(exceptionTranslation["Mo ta nop length condition"])
        return
    }

    let checkExistedTask = await Task.checkExistedTask(req, task_id)
    if(!checkExistedTask) {
        res.statusCode = 422
        res.end("Không tồn tại task với id yêu cầu")
        return
    }

    let db_file_path = ''
    // upload file
    if(req.files &&
        req.files.task_submit_file
    ) {
        let task_submit_file = req.files.task_submit_file
        if (!fs.existsSync(path.join(__dirname,'../','public','files','task','task_nop', task_id))) {
            fs.mkdirSync(path.join(__dirname,'../','public','files','task','task_nop', task_id))
        }

        let file_path = path.join(__dirname,'../','public','files','task','task_nop', task_id, task_submit_file.name)
        let upload_error
        task_submit_file.mv(file_path, err => {
            if(err) {
                upload_error = err
            }
        })
        db_file_path = '/files/task/task_nop/'+task_id+'/'+task_submit_file.name
        if(upload_error) {
            res.statusCode = 500
            res.end("Lỗi upload file")
            return
        }
    } 

    let taskSubmit = await Task.taskSubmit(req, mo_ta_nop, db_file_path, task_id)

    if(taskSubmit ) {
        res.statusCode = 200
        res.end("Success")
        return
    } else {
        res.statusCode = 500
        res.end(exceptionTranslation["Error"])
        return
    }
}

exports.taskReject = async (req, res, next) => {

    let exceptionTranslation = {
        "Existed task condition": "Không tồn tại task có ID cần nộp",
        "Empty field": "Vui lòng điền đầy đủ thông tin",
        "Error": "Something went wrong, please try again later",
        "File extension condition": "File sai định dạng",
        "File size condition": "Vui lòng chọn file nhỏ hơn 5M"
    };

    let session_username = await req.session.username
    if(!session_username) {
        res.redirect('/utils/login')
        return 
    }

    let isManager = await Utils.checkManager(req, session_username)
    if(!isManager) {
        res.statusCode = 403
        res.end(exceptionTranslation['user_role_condition'])
        return 
    }

    let {task_id, feedback, thoi_gian_deadline} = req.body

    if(!task_id ||
        !feedback ||
        ! req.files ||
        !req.files.task_reject_file
    ) {
        res.statusCode = 422
        res.end("Vui lòng nhập đầy đủ thông tin")
        return
    }

    let task_reject_file = req.files.task_reject_file
    // check file size
    if(task_reject_file.size > 5000000) {
        res.statusCode = 422
        res.end(exceptionTranslation["File size condition"])
        return
    }

    // check file extension
    if(path.extname(task_reject_file.name) == '.exe' || path.extname(task_reject_file.name) == '.sh') {
        res.statusCode = 422
        res.end(exceptionTranslation["File extension condition"])
        return
    }
    
    //  Check existed task
    let checkExistedTask = await Task.checkExistedTask(req, task_id)
    if(!checkExistedTask) {
        res.statusCode = 422
        res.end("Không tồn tại task với id yêu cầu")
        return
    }

    if(thoi_gian_deadline) {
        // check Date
        let d_deadline = new Date(thoi_gian_deadline)
        let d_now = new Date()
        if(d_now > d_deadline) {
            res.statusCode = 422
            res.end("Deadline phải sau hôm nay")
            return
        }
        thoi_gian_deadline = new Date(thoi_gian_deadline).toISOString().slice(0, 19).replace('T', ' ')

        let updateDeadline = await Task.updateDeadline(req, thoi_gian_deadline, task_id)

        if(!updateDeadline) {
            res.statusCode = 500
            res.end("Lỗi update deadline")
            return
        }
    }

    let updateTaskStatus = await Task.updateTaskStatus(req, 5, task_id)
    if(!updateTaskStatus) {
        res.statusCode = 500
        res.end("Lỗi update status reject")
        return
    }

    let taskInfo = await Task.getTaskInfo(req, task_id)

    let mo_ta_nop_history = taskInfo.mo_ta_nop
    let file_task_nop = taskInfo.tap_tin_nop
    let note_history = feedback


    let createHistory = await Task.createHistory(req, task_id, note_history, mo_ta_nop_history, file_task_nop)

    if(createHistory ) {
        let insert_id = createHistory.id.toString()
        if(req.files &&
            req.files.task_reject_file
        ) {
            let task_reject_file = req.files.task_reject_file
            if (!fs.existsSync(path.join(__dirname,'../','public','files','history', insert_id))) {
                fs.mkdirSync(path.join(__dirname,'../','public','files','history', insert_id))
            }
            
            let file_path = path.join(__dirname,'../','public','files','history', insert_id, task_reject_file.name)
            let upload_error
            task_reject_file.mv(file_path, err => {
                if(err) {
                    upload_error = err
                }
            })
            let db_file_path = '/files/history/'+insert_id+'/'+task_reject_file.name
            if(!upload_error) {
                let updateHistoryFile = await Task.updateHistoryFile(req, db_file_path, insert_id)
                if(updateHistoryFile) {
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

exports.taskAsignBack = async (req, res, next) => {
    let task_id = req.body.task_id

    if(!task_id) {
        res.statusCode = 422
        res.end("Vui lòng truyền id của task")
        return
    }
    
    let checkExistedTask = await Task.checkExistedTask(req, task_id)
    if(!checkExistedTask) {
        res.statusCode = 422
        res.end("Không tồn tại task với id yêu cầu")
        return
    }

    let updateTaskStatus = await Task.updateTaskStatus(req, 2, task_id)
    if(updateTaskStatus) {
        res.statusCode = 200
        res.end("Success")
        return
    } else {
        res.statusCode = 500
        res.end(exceptionTranslation["Error"])
        return
    }
}

exports.taskApprove = async (req, res, next) => {

    let exceptionTranslation = {
        "Existed task condition": "Không tồn tại task có ID cần nộp",
        "Empty field": "Vui lòng điền đầy đủ thông tin",
        "Error": "Something went wrong, please try again later",
    };

    let session_username = await req.session.username
    if(!session_username) {
        res.redirect('/utils/login')
        return 
    }

    let isManager = await Utils.checkManager(req, session_username)
    if(!isManager) {
        res.statusCode = 403
        res.end(exceptionTranslation['user_role_condition'])
        return 
    }

    let {task_id, muc_do_hoan_thanh} = req.body

    if(!task_id ||
        !muc_do_hoan_thanh
    ) {
        res.statusCode = 422
        res.end("Vui lòng nhập đầy đủ thông tin")
        return
    }

    //  Check existed task
    let checkExistedTask = await Task.checkExistedTask(req, task_id)
    if(!checkExistedTask) {
        res.statusCode = 422
        res.end("Không tồn tại task với id yêu cầu")
        return
    }


    let taskApprove = await Task.taskApprove(req, muc_do_hoan_thanh,task_id)
    if(!taskApprove) {
        res.statusCode = 500
        res.end("Lỗi update status complete")
        return
    }

    let taskInfo = await Task.getTaskInfo(req, task_id)

    let mo_ta_nop_history = taskInfo.mo_ta_nop
    let file_task_nop = taskInfo.tap_tin_nop


    let createHistoryComplete = await Task.createHistoryComplete(req, task_id, mo_ta_nop_history, file_task_nop)

    if(createHistoryComplete ) {
        res.statusCode = 200
            res.end("Success")
            return
    } else {
        res.statusCode = 500
        res.end(exceptionTranslation["Error"])
        return
    }
}

exports.updateTask = async (req, res, next) => {
    let exceptionTranslation = {
        "Ten task length condition": "Độ dài tối đa của tên task là 50 kí tự",
        "Mo ta length condition": "Độ dài tối đa của mô tả là 2550 kí tự",
        "Error": "Something went wrong, please try again later",
        "Deadline condition": "Hạn nộp phải sau hôm nay",
        "user_role_condition": "Người dùng không đủ quyền để thực hiện thao tác này",
        "File error condition": "File bị lỗi, vui lòng chọn file khác",
        "File extension condition": "File sai định dạng",
        "File size condition": "Vui lòng chọn file nhỏ hơn 5M"
    };

    let session_username = await req.session.username
    if(!session_username) {
        res.redirect('/utils/login')
        return 
    }

    let isManager = await Utils.checkManager(req, session_username)
    if(!isManager) {
        res.statusCode = 403
        res.end(exceptionTranslation['user_role_condition'])
        return 
    }

    let {task_id, thoi_gian_deadline, mo_ta} = req.body

    if(!task_id ||
        !thoi_gian_deadline ||
        !mo_ta  
    ) {
        res.statusCode = 422
        res.end("Vui lòng nhập đầy đủ thông tin")
        return
    }

    // check Date
    let d_deadline = new Date(thoi_gian_deadline)
    let d_now = new Date()
    if(d_now > d_deadline) {
        res.statusCode = 422
        res.end(exceptionTranslation["Deadline condition"])
        return
    }

    thoi_gian_deadline = new Date(thoi_gian_deadline).toISOString().slice(0, 19).replace('T', ' ')

    let updateTask = await Task.updateTask(req, task_id, thoi_gian_deadline, mo_ta)

    if(updateTask ) {
        res.statusCode = 200
        res.end("Success")
        return
    } else {
        res.statusCode = 500
        res.end(exceptionTranslation["Error"])
        return
    }
        
}