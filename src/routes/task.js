var express = require('express');
var router = express.Router();
const TaskController = require('../controller/task.controller');

router.get('/', function(req, res, next) {
    TaskController.getTaskIndex(req, res, next);
});

router.get('/management', function(req, res, next) {
    TaskController.getTaskManagement(req, res, next);
});

router.post('/getTaskDetail', function(req, res, next) {
    TaskController.getTaskDetail(req, res, next);
});

router.get('/getTaskHistory', function(req, res, next) {
    TaskController.getTaskHistory(req, res, next);
});

router.get('/getTaskHistoryDetail', function(req, res, next) {
    TaskController.getTaskHistoryDetail(req, res, next);
});

router.post('/create', function(req, res, next) {
    TaskController.createTask(req, res, next);
});

router.post('/taskStart', function(req, res, next) {
    TaskController.taskStart(req, res, next);
});

router.post('/taskCancel', function(req, res, next) {
    TaskController.taskCancel(req, res, next);
});

router.post('/taskSubmit', function(req, res, next) {
    TaskController.taskSubmit(req, res, next);
});

router.post('/taskReject', function(req, res, next) {
    TaskController.taskReject(req, res, next);
});

router.post('/taskAsignBack', function(req, res, next) {
    TaskController.taskAsignBack(req, res, next);
});

router.post('/taskApprove', function(req, res, next) {
    TaskController.taskApprove(req, res, next);
});

router.post('/taskUpdate', function(req, res, next) {
    TaskController.updateTask(req, res, next);
});

module.exports = router;
