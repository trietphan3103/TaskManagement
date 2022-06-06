var express = require('express');
var router = express.Router();
const IndexController = require('../controller/index.controller.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  IndexController.getIndexView(req, res, next);
});

module.exports = router;
