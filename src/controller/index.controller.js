const Users = require('../model/users.model')
const Absence = require('../model/absence.model')
const Utils = require('../model/utils.model')
const moment = require('moment')

exports.getIndexView = async (req, res, next) => {
    let username = req.session.username
    if(!username) {
        res.redirect('/utils/login')
        return
    }

    let absenceFuture
    let absenceToday
    let userInfo
    let dayOff
    let user_id = await Utils.getIdFromUsername(req, username)
    let isDirector = await Utils.checkDirector(req, username)
    let isNormalEmployee = await Utils.checkNormalEmployee(req, username)
    let isManager = await Utils.checkManager(req, username)
    if(user_id) {
        absenceFuture = await Absence._get_list_proccessed_absence_future_current_user(req, user_id)
        absenceToday = await Absence._get_list_today_absence(req)
        userInfo = await Users.getUserInfo(req, username)
        dayOff = await Users.getDayOffUsed(req, user_id)
    }

    res.render("index", { layout: "layouts/main", absenceFuture: absenceFuture
                                                    , absenceToday: absenceToday
                                                    , userInfo: userInfo
                                                    , dayUsed: dayOff
                                                    , isDirector: isDirector
                                                    , isNormalEmployee: isNormalEmployee
                                                    , moment: moment
                                                    , isManager: isManager
                                                    , title: 'Home page' });
}