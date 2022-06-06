const con_config = require("../connection.js");
const sql = require('mssql');

exports._get_list_proccessed_absence_future_current_user = async (req, user_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT *, DATEDIFF(day, ABSENCE.ngay_bat_dau, ABSENCE.ngay_ket_thuc) + 1 as so_ngay_nghi  
            from ABSENCE
            where nguoi_tao_id = ${user_id}
                    and ngay_bat_dau > cast(GETDATE() AS Date)
                    and status = 1 
            order by ngay_bat_dau asc
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

exports._get_list_waiting_absence_of_manager = async(req) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT ABSENCE.*, USERS.ho_ten 
            FROM ABSENCE,USERS 
            WHERE USERS.status = 1 
                    and ABSENCE.nguoi_tao_id = USERS.user_id  
                    and ABSENCE.status = 0 
            order by ABSENCE.created_on desc
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

exports._get_list_waiting_absence_of_deparment = async(req, phong_ban_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT ABSENCE.*, USERS.ho_ten 
            FROM ABSENCE,USERS 
            WHERE USERS.phong_ban_id = ${phong_ban_id}  
                    and ABSENCE.nguoi_tao_id = USERS.user_id  
                    and ABSENCE.status = 0 
            order by ABSENCE.created_on desc
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

exports._get_list_proccessed_absence_of_manager = async(req) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT ABSENCE.*, USERS.ho_ten 
        FROM ABSENCE,USERS 
        WHERE USERS.status = 1 
                and ABSENCE.nguoi_tao_id = USERS.user_id  
                and ABSENCE.status != 0 
        order by ABSENCE.created_on desc
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

exports._get_list_proccessed_absence_of_deparment = async(req, phong_ban_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT ABSENCE.*, USERS.ho_ten 
            FROM ABSENCE,USERS 
            WHERE USERS.phong_ban_id = ${phong_ban_id} 
                    and ABSENCE.nguoi_tao_id = USERS.user_id  
                    and ABSENCE.status != 0 
            order by ABSENCE.created_on desc
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


exports._get_list_today_absence = async (req) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT ABSENCE.*, DATEADD(day, 1, cast(GETDATE() AS Date)) as ngay_quay_lai,  USERS.*,PHONG_BAN.ten_phong 
            from ABSENCE,USERS, PHONG_BAN 
            where ABSENCE.nguoi_tao_id = USERS.user_id 
                    and USERS.phong_ban_id = PHONG_BAN.phong_ban_id 
                    and ABSENCE.ngay_bat_dau <= cast(GETDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'SE Asia Standard Time' AS Date)
                    and ABSENCE.ngay_ket_thuc >= cast(GETDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'SE Asia Standard Time' AS Date)
            order by ngay_bat_dau desc;
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

exports._get_list_absence_current_user = async (req, user_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT ABSENCE.*, USERS.ho_ten 
        from ABSENCE, USERS 
        where ABSENCE.nguoi_tao_id = USERS.user_id 
                and nguoi_tao_id = ${user_id} 
        order by ngay_bat_dau desc
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

exports.createAbsence = async (req, ngay_bat_dau, ngay_ket_thuc, ly_do, nguoi_tao_id, nguoi_duyet_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        INSERT INTO ABSENCE(ngay_bat_dau, ngay_ket_thuc, ly_do, nguoi_tao_id, nguoi_duyet_id)
        VALUES(${ngay_bat_dau},${ngay_ket_thuc},${ly_do},${nguoi_tao_id},${nguoi_duyet_id});
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

exports.getNumWaitingAbsence = async (req, nguoi_tao_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        select count(*) from ABSENCE where nguoi_tao_id = ${nguoi_tao_id} and status = 0
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected > 0) {
        return result.recordset[0]['']
    } else {
        return false
    }
}

exports.getNumCurrentAbsence = async (req, nguoi_tao_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        select count(*) from ABSENCE where nguoi_tao_id = ${nguoi_tao_id} and (DATEDIFF(DAY, GETDATE(), ngay_duyet)) < 7
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected > 0) {
        return result.recordset[0]['']
    } else {
        return false
    }
}

exports.updateAbsenceFile = async (req, file_path, insert_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        UPDATE ABSENCE SET tap_tin = ${file_path} WHERE absence_id = ${insert_id}
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

exports.updateAbsenceStatus = async (req, status, absence_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        UPDATE ABSENCE SET status = ${status}, ngay_duyet = GETDATE() WHERE absence_id = ${absence_id}
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