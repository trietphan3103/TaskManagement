const con_config = require("../connection.js");
const sql = require('mssql');
const UtilsController = require('../controller/utils.controller')

exports.getUserInfo = async (req, username) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT USERS.*, PHONG_BAN.* FROM USERS, PHONG_BAN 
        WHERE USERS.phong_ban_id = PHONG_BAN.phong_ban_id and USERS.user_name = ${username}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected > 0) {
        return result.recordset[0]
    }else {
        return false
    }
    
}

exports.getUserInfoById = async (req, user_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT USERS.*, PHONG_BAN.* FROM USERS, PHONG_BAN 
        WHERE USERS.phong_ban_id = PHONG_BAN.phong_ban_id and USERS.user_id = ${user_id}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected > 0) {
        return result.recordset[0]
    }else {
        return false
    }
    
}

exports.getDayOffUsed = async(req, user_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT ISNULL(sum(DATEDIFF(day, ngay_bat_dau, ngay_ket_thuc)) + 1, 0) as day_used
        FROM ABSENCE
        WHERE nguoi_tao_id = ${user_id} and YEAR(ngay_bat_dau) = YEAR(GETDATE()) and status = 1;
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected > 0) {
        return result.recordset[0].day_used
    }else {
        return false
    }

}

exports._get_list_users = async(req) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT USERS.*, PHONG_BAN.ten_phong 
            FROM USERS, PHONG_BAN 
            WHERE USERS.phong_ban_id = PHONG_BAN.phong_ban_id 
                    and USERS.user_role != N'Director' 
                    and USERS.active = 1 
            order by USERS.user_id
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected > 0) {
        return result.recordset
    }else {
        return false
    }
}

exports.checkExistedPhone = async (req, sdt) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT * FROM USERS WHERE sdt = ${sdt}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }
    
    if(result.rowsAffected == 1) {
        return true;
    }
    return false;
} 

exports.checkExistedPhoneExcept = async (req, sdt, user_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT * FROM USERS WHERE sdt = ${sdt} and user_id != ${user_id}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }
    
    if(result.rowsAffected == 1) {
        return true;
    }
    return false;
} 

exports.createUser = async(req, create_field) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    const [ho_ten, user_name, ngay_sinh, gioi_tinh, phong_ban_id, status, sdt, password, user_role] = create_field    
    
    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        INSERT INTO USERS(ho_ten, user_name, ngay_sinh, 
            gioi_tinh, phong_ban_id, status, sdt, password, user_role, active)
            VALUES(${ho_ten}, ${user_name}, ${ngay_sinh}, ${gioi_tinh}, 
                ${phong_ban_id}, ${status}, ${sdt}, ${password}, ${user_role}, 1)
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }
    
    if(result && result.rowsAffected.length > 0) {
        return true;
    }
    return false;
}

exports.disableUser = async(req, user_name) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        UPDATE USERS SET USERS.active = 0 WHERE USERS.user_name = ${user_name}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }
    
    if(result && result.rowsAffected.length > 0) {
        return true;
    }
    return false;
}

exports.updateUser = async(req, update_field) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    const [ho_ten, ngay_sinh, gioi_tinh, status, sdt, user_id] = update_field    
    
    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        UPDATE USERS SET
            ho_ten = ${ho_ten},
            ngay_sinh = ${ngay_sinh},
            gioi_tinh = ${gioi_tinh}, 
            status = ${status},
            sdt = ${sdt}
        WHERE user_id = ${user_id}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }
    
    if(result && result.rowsAffected.length > 0) {
        return true;
    }
    return false;
}

exports.checkRoleCreate = async(req, phong_ban_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result
    
    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        select * 
        from USERS 
        where status = 1 and phong_ban_id = ${phong_ban_id}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    
    if(result && result.recordset.length > 0) {
        return true;
    }
    return false;
}



exports.resetDefaultPassword = async(req, user_name, password) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result
    
    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        UPDATE USERS set password = ${password} WHERE user_name = ${user_name}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }
    
    if(result && result.rowsAffected.length > 0) {
        return true;
    }
    return false;
}

exports.updatePassword = async(req, user_name, password) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result
    
    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        UPDATE USERS set password = ${password} WHERE user_name = ${user_name}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }
    
    if(result && result.rowsAffected.length > 0) {
        return true;
    }
    return false;
}

exports.getHeadDepartment = async(req) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result
    
    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT * FROM USERS WHERE status = 1
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }
    
    if (result && result.rowsAffected > 0) {
        return result.recordset[0]
    }else {
        return false
    } 
}

exports.getDayOffOnCreate = async(req, nguoi_tao_id, ngay_bat_dau) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        select ISNULL(sum(DATEDIFF(day, ngay_ket_thuc, ngay_bat_dau)) + 1, 0) as day_used
		from ABSENCE
		where nguoi_tao_id = ${nguoi_tao_id} and YEAR(ngay_bat_dau) = YEAR(${ngay_bat_dau}) and status = 1
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    if (result && result.rowsAffected > 0) {
        return result.recordset[0].day_used
    }else {
        return false
    }

}

exports.updateAvatar = async(req, db_file_path, user_id) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    
    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        UPDATE USERS SET anh_dai_dien = ${db_file_path} WHERE user_id = ${user_id}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }
    
    if(result && result.rowsAffected.length > 0) {
        return true;
    }
    return false;
}
