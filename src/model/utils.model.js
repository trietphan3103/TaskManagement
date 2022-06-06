const con_config = require("../connection.js");
const sql = require('mssql');

exports.checkExistUser = async (req, username) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`SELECT * FROM USERS WHERE user_name = ${username}`
        await sql.close()
    } catch (err) {
        console.log(err)
    }
    
    if(result.rowsAffected == 1) {
        return true;
    }
    return false;
}

exports.getCurrentPhongBan = async (req, username) => {

    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`SELECT phong_ban_id FROM USERS
        WHERE user_name = ${username}`
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    return result.recordset[0].phong_ban_id
}


exports.getRoleFromUsername = async (req, username) => {

    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`SELECT user_role FROM USERS
        WHERE user_name = ${username}`
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    return result.recordset[0].user_role
}

exports.getIdFromUsername = async (req, username) => {

    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`SELECT user_id FROM USERS WHERE user_name = ${username} and active = 1`
        await sql.close()
    } catch (err) {
        console.log(err)
    }
    if(result && result.rowsAffected > 0) {
        return result.recordset[0].user_id
    } else {
        return null
    }

};

exports.checkDirector = async (req, username) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result
    let user_role = "Director"

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT * FROM USERS WHERE user_name = ${username} and user_role = ${user_role}
        `
        await sql.close()

    } catch (err) {
        console.log(err)
    }

    if(result && result.rowsAffected > 0) {
        return result.rowsAffected == 1;
    } else {
        return false
    }

}

exports.checkManager = async (req, username) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result
    let user_role = "Director"

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT * FROM USERS WHERE user_name = ${username} and status = 1 and user_role != ${user_role}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    return result.rowsAffected == 1;
}

exports.checkNormalEmployee = async (req, username) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result
    let user_role = "Director"

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT * FROM USERS WHERE user_name = ${username} and status = 0 and user_role != ${user_role}
        `
        await sql.close()
    } catch (err) {
        console.log(err)
    }

    return result.rowsAffected == 1;
}
