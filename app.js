var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var config = require('./config'); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ProjectsRouter = require('./routes/ProjectsRouter')
var Employees = require('./models/employees');
var EmpDetails = require('./models/empDetails');
var Projects = require('./models/projects');

//Routers
var EmployeeRouter = require('./routes/EmpDetailsRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const dbUrl = config.mongoUrl;
const conn = mongoose.connect(dbUrl);

conn.then((db) => {
  console.log('Connected to database server.');
}, (err) => {
  console.log(err);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/emp', EmployeeRouter);
app.use('/projects', ProjectsRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
