const Utils = require('../model/utils.model')
const Users = require('../model/users.model')
const bcrypt = require('bcrypt')

exports.getLogin = (req, res, next) => {
    if (req.session.username) {
        return res.redirect('/')
    }
    else { 
        res.render('utils/login', { layout: "layouts/main", title: 'Login page' })
        return 
    }
}

exports.postLogin = async (req, res, next) => {
    let username = req.body.username
    let password = req.body.password

    if(!password || !username) {
        res.statusCode = 422
        res.json({message: "Vui lòng nhập đầy đủ thông tin"})
        return;
    }

    let isExistUser = await Utils.checkExistUser(req, username)

    if(isExistUser) {
        let userInfo = await Users.getUserInfo(req, username)
        if(bcrypt.compareSync(password, userInfo.password)) {
            if(password === username) {
                res.statusCode = 200
                res.json({message: "Password need to update"})
                return;
            } else {
                req.session.username = username
                let phong_ban_id = await Utils.getCurrentPhongBan(req, username)
                if(phong_ban_id) {
                    req.session.con_option = phong_ban_id
                    res.statusCode = 200
                    res.json({message: "Sign in success"})
                    return;
                } else {
                    res.statusCode = 500
                    res.json({message: "Somethong went wrong, try again later"})
                    return;
                }
            }
        } else {
            res.statusCode = 403
            res.json({message: "Invalid username or password"})
            return;
        }
    } else {
        res.statusCode = 422
        res.json({message: "Invalid username"})
        return;
    }
}

