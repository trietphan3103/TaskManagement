var express = require('express');
var router = express.Router();
const UtilsController = require('../controller/utils.controller');

/* GET login view */
router.get('/login', function(req, res, next) {
    UtilsController.getLogin(req, res, next);
});

// POST login
router.post('/login', (req, res, next) => {
    UtilsController.postLogin(req, res, next)
})

/* GET signup view */
router.get('/signup', function(req, res, next) {
    UtilsController.getSignup(req, res, next);
});


// POST signup
router.post('/signup', (req, res, next) => {
    UtilsController.postSignup(req, res, next)
})


// Logout Router
router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

router.get('/403', (req, res, next) => {
    res.render('utils/error403', { layout: "layouts/main", title: '403 error page' })
})

router.get('/404', (req, res, next) => {
    res.render('utils/error404', { layout: "layouts/main", title: '404 error page' })
})

module.exports = router;