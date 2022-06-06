const con_config = require("../connection.js");
const sql = require('mssql');

exports.getListEmployee = async (req, username) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT * FROM USERS 
            WHERE phong_ban_id = (  SELECT phong_ban_id 
                                    FROM USERS
                                    WHERE user_name = ${username})
            AND user_name != ${username}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected > 0) {
        return result.recordset
    } else {
        return false
    }
}

exports.getTaskDetail = async (req, task_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        WITH difference_inseconds AS (
            SELECT
                task_id,
                (DATEDIFF(SECOND, GETDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'SE Asia Standard Time', thoi_gian_deadline) + 7*60*60) AS seconds
            FROM task
        ),
        differences AS (
            SELECT
            difference_inseconds.*,
            seconds % 60 AS seconds_part,
            seconds % 3600 AS minutes_part,
            seconds % (3600 * 24) AS hours_part
            FROM difference_inseconds
            ),
        time_cal AS (
            select 
                task_id,
                FLOOR(seconds / 3600 / 24) as  days,
                FLOOR(hours_part / 3600) as hours,
                FLOOR(minutes_part / 60) as minutes
            FROM differences
        )
        SELECT *, TASK.task_id as task_new_id,
            TASK.mo_ta as task_mo_ta
        FROM TASK 
        INNER JOIN USERS ON TASK.nguoi_thuc_hien_id = USERS.user_id 
        INNER JOIN PHONG_BAN ON USERS.phong_ban_id = PHONG_BAN.phong_ban_id
        INNER JOIN time_cal on time_cal.task_id = task.task_id
        where task.task_id = ${task_id}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected > 0) {
        return result.recordset[0]
    } else {
        return false
    }
}

exports.getTaskHistory = async (req, task_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT history_id, task_id, task_status, note, mo_ta_nop, 
        convert(varchar, cast(CREATED_ON AS Date), 103) AS created_on, 
        file_history, file_task_nop from HISTORY where task_id = ${task_id} 
        order by created_on desc
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    return result.recordset
}

exports.getTaskHistoryDetail = async (req, history_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT history_id,task_id, task_status,
         note, mo_ta_nop, convert(varchar, cast(CREATED_ON AS Date), 103) AS created_on, 
         file_history, file_task_nop from HISTORY where history_id = ${history_id}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected > 0) {
        return result.recordset
    } else {
        return false
    }
}

exports._getListTaskByStatus = async (req, curr_user_id, status) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        WITH difference_inseconds AS (
            SELECT
                task_id,
                DATEDIFF(SECOND, GETDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'SE Asia Standard Time', thoi_gian_deadline) + 7*60*60 AS seconds
            FROM task
        ),
        differences AS (
            SELECT
            difference_inseconds.*,
            seconds % 60 AS seconds_part,
            seconds % 3600 AS minutes_part,
            seconds % (3600 * 24) AS hours_part
            FROM difference_inseconds
            ),
        time_cal AS (
            select 
                task_id,
                FLOOR(seconds / 3600 / 24) as  days,
                FLOOR(hours_part / 3600) as hours,
                FLOOR(minutes_part / 60) as minutes
            FROM differences
        )
        SELECT *, TASK.task_id as task_new_id,
            TASK.mo_ta as task_mo_ta
        FROM TASK 
        INNER JOIN USERS ON TASK.nguoi_thuc_hien_id = USERS.user_id 
        INNER JOIN PHONG_BAN ON USERS.phong_ban_id = PHONG_BAN.phong_ban_id
        INNER JOIN time_cal on time_cal.task_id = task.task_id
        where PHONG_BAN.phong_ban_id = (Select phong_ban_id from USERS u where u.user_id = ${curr_user_id}) and TASK.status= ${status} order by task.task_id desc
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected > 0) {
        return result.recordset
    } else {
        return false
    }
}

exports.checkExistedTask = async (req, task_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT * FROM TASK WHERE task_id = ${task_id}`
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected > 0) {
        return result.recordset
    } else {
        return false
    }
}

exports.checkExistedHistory = async (req, history_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT * FROM HISTORY WHERE history_id = ${history_id}`
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected > 0) {
        return result.recordset
    } else {
        return false
    }
}

exports.createTask = async (req, nguoi_tao_id, nguoi_thuc_hien_id, ten_task, mo_ta, thoi_gian_deadline) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        INSERT INTO TASK (nguoi_tao_id, nguoi_thuc_hien_id, 
            ten_task, mo_ta, status, muc_do_hoan_thanh, tap_tin, 
            thoi_gian_deadline, note) VALUES 
            (${nguoi_tao_id},${nguoi_thuc_hien_id},${ten_task},${mo_ta}, 1, 1, NULL, ${thoi_gian_deadline}, NULL);
        SELECT SCOPE_IDENTITY() AS id;
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected.length > 0) {
        return result.recordset[0]
    } else {
        return false
    }
}

exports.updateTaskFile = async (req, file_path, insert_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        UPDATE TASK SET tap_tin = ${file_path} WHERE task_id = ${insert_id}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected.length > 0) {
        return true
    } else {
        return false
    }
}

exports.updateTaskStatus = async (req, status, task_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        UPDATE TASK SET status = ${status} WHERE TASK.task_id = ${task_id}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected.length > 0) {
        return true
    } else {
        return false
    }
}

exports.taskSubmit = async (req, mo_ta_nop, tap_tin_nop, task_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        UPDATE TASK SET mo_ta_nop = ${mo_ta_nop}, tap_tin_nop = ${tap_tin_nop}, 
        thoi_gian_hoan_thanh = GETDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'SE Asia Standard Time', 
        status = 4 WHERE task_id = ${task_id};
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected.length > 0) {
        return true
    } else {
        return false
    }
}

exports.updateDeadline = async (req, thoi_gian_deadline, task_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        UPDATE TASK SET thoi_gian_deadline = ${thoi_gian_deadline} WHERE task_id = ${task_id}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected.length > 0) {
        return true
    } else {
        return false
    }
}

exports.getTaskInfo = async (req, task_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT * FROM TASK WHERE task_id = ${task_id}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected.length > 0) {
        return result.recordset[0]
    } else {
        return false
    }
}

exports.createHistory = async (req, task_id, note_history, mo_ta_nop_history, file_task_nop) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        INSERT INTO HISTORY
        (task_id, task_status, note, mo_ta_nop, file_history, file_task_nop) 
        values(${task_id}, -1, ${note_history}, ${mo_ta_nop_history}, null, ${file_task_nop});
        SELECT SCOPE_IDENTITY() AS id;
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected.length > 0) {
        return result.recordset[0]
    } else {
        return false
    }
}

exports.createHistoryComplete = async (req, task_id, mo_ta_nop_history, file_task_nop) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        INSERT INTO HISTORY
        (task_id, task_status, note, mo_ta_nop, file_history,file_task_nop)
         values(${task_id}, 1, null, ${mo_ta_nop_history}, null, ${file_task_nop})
        SELECT SCOPE_IDENTITY() AS id;
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected.length > 0) {
        return result.recordset[0]
    } else {
        return false
    }
}

exports.updateHistoryFile = async (req, file_path, insert_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        UPDATE HISTORY SET file_history = ${file_path} WHERE history_id =${insert_id}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected.length > 0) {
        return true
    } else {
        return false
    }
}

exports.taskApprove = async (req, muc_do_hoan_thanh, task_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        UPDATE TASK SET  status = 6, muc_do_hoan_thanh = ${muc_do_hoan_thanh} WHERE task_id = ${task_id}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected.length > 0) {
        return true
    } else {
        return false
    }
}

exports.updateTask = async (req, task_id, thoi_gian_deadline, mo_ta) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        UPDATE TASK SET thoi_gian_deadline = ${thoi_gian_deadline}, mo_ta = ${mo_ta}
        WHERE task_id = ${task_id}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected.length > 0) {
        return true
    } else {
        return false
    }
}