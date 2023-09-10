var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/api/users');
var categoryRouter = require('./routes/api/category');
var comicsRouter = require('./routes/api/comics');
var roleRouter = require('./routes/api/role');
var chapterImgRouter = require('./routes/api/chapterImg');
var booksheIfRouter = require('./routes/api/booksheIf');
var historyRouter = require('./routes/api/history');
var menuRouter = require('./routes/api/menu');

// 中间件
const checkTokenMiddleware = require('./middlewares/checkTokenMiddleware')
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 请求地址带有/api的都需要通过中间件
app.use('/api', checkTokenMiddleware)

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/api', categoryRouter);
app.use('/', comicsRouter);
app.use('/api', roleRouter);
app.use('/api', chapterImgRouter);
app.use('/api', booksheIfRouter);
app.use('/api', historyRouter);
app.use('/api', menuRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
  // next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
