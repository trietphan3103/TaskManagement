const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('express-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const utilsRouter = require('./routes/utils');
const absenceRouter = require('./routes/absence');
const taskRouter = require('./routes/task');

const app = express();

// view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts)
app.set('views', path.join(__dirname, 'views'));
app.set('layout', './layouts/main')
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cookieParser('admin'));
app.use(session({
    secret: 'secret_pw',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 20*60*1000 }
}));
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/utils', utilsRouter);
app.use('/absence', absenceRouter);
app.use('/task', taskRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.redirect("/utils/404")
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
