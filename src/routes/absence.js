var express = require('express');
var router = express.Router();
const AbsenceController = require('../controller/absence.controller');

/* GET login view */
router.get('/', function(req, res, next) {
    AbsenceController.getAbsenceIndex(req, res, next);
});

router.get('/management', function(req, res, next) {
    AbsenceController.getAbsenceManagement(req, res, next);
});

router.post('/create', function(req, res, next) {
    AbsenceController.createAbsence(req, res, next);
}) 

router.post('/absenceProcessing', function(req, res, next) {
    AbsenceController.absenceProcessing(req, res, next);
}) 
module.exports = router;