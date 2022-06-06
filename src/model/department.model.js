const con_config = require("../connection.js");
const sql = require('mssql');

exports._get_list_departments = async (req) => {
    let option = 1
    if(req.session && req.session.con_option) {
        option = req.session.con_option
    }
    let result

    try {
        await sql.connect(con_config(option))
        result = await sql.query`
        SELECT * 
            FROM PHONG_BAN 
            WHERE ten_phong != N'Phòng giám đốc' 
            ORDER BY PHONG_BAN.phong_ban_id asc
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

