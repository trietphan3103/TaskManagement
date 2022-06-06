var express = require('express');
var router = express.Router();
const UsersController = require('../controller/users.controller.js');

/* GET phimManagement view */
router.get('/management', function(req, res, next) {
  UsersController.getManagementView(req, res, next);
});

router.get('/detail', function(req, res, next) {
  UsersController.getDetailView(req, res, next);
});

router.get('/currentUserDetail', function(req, res, next) {
  UsersController.getCurrentUserDetailView(req, res, next);
});

router.post('/create', function(req, res, next) {
  UsersController.createUser(req, res, next);
});

router.post('/updateUser', function(req, res, next) {
  UsersController.updateUser(req, res, next);
});

router.post('/disableUser', function(req, res, next) {
  UsersController.disableUser(req, res, next);
});

router.post('/disableUser', function(req, res, next) {
  UsersController.disableUser(req, res, next);
});

router.post('/resetDefaultPassword', function(req, res, next) {
  UsersController.resetDefaultPassword(req, res, next);
});

router.post('/updatePassword', function(req, res, next) {
  UsersController.updatePassword(req, res, next);
});

router.post('/userUpdatePassword', function(req, res, next) {
  UsersController.userUpdatePassword(req, res, next);
});

router.post('/updateAvatar', function(req, res, next) {
  UsersController.updateAvatar(req, res, next);
});

module.exports = router;