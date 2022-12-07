var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
const nocache = require('nocache')
// const client = require("twilio")(AC11481d769dab8ca4d0b1deb9264547f4, df7819843ec0d0e863893f24729d0cfd);
const dotenv = require('dotenv').config();


const multer=require('multer')
var hbs=require('express-handlebars');
var app = express();
// var fileupload=require('express-fileupload')
var db=require('./confi/connection')
var session=require('express-session')

var Handlebars=require('handlebars')

// view engine setup
// app.use(client())
app.use(nocache())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialDir:__dirname+'/views/partials/'}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(fileupload())
app.use(session({secret:"key",cookie:{maxAge:6000000}}))

// resgisterHelpers
Handlebars.registerHelper('multiply',(value,value2)=>{
  return (parseInt(value)*parseInt(value2))
})
Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

Handlebars.registerHelper('isCancelled',(value)=>{
  return value == 'canceled' ? true : false
})
Handlebars.registerHelper('isDispatched',(value)=>{
  return value == 'dispatched' ? true : false
})
Handlebars.registerHelper('isDelivered',(value)=>{
  return value == 'delivered' ? true : false
})
Handlebars.registerHelper('isShipped',(value)=>{
  return value == 'shipped' ? true : false
})
Handlebars.registerHelper('returnSuccess',(value)=>{
  return value == 'returnApproved' ? true : false
})
Handlebars.registerHelper('returnApp',(value)=>{
  return value == 'returnApproved' ? true : false
})



Handlebars.registerHelper('barStatus',(value)=>{
  return value == 'placed' ? true : false
})
Handlebars.registerHelper('barStatus1',(value)=>{
  return value == 'dispatched' ? true : false
})
Handlebars.registerHelper('barStatus2',(value)=>{
  return value == 'shipped' ? true : false
})
Handlebars.registerHelper('barStatus3',(value)=>{
  return value == 'delivered' ? true : false
})
Handlebars.registerHelper('barStatus4',(value)=>{
  return value == 'canceled' ? true : false
})
Handlebars.registerHelper('walle',(value)=>{
  return value == 'Debited' ? true : false
})
Handlebars.registerHelper('sales',(value)=>{
  return value == 'canceled' ? true : false
})
Handlebars.registerHelper('stock',(value)=>{
  return value <=0 ? true : false
})
Handlebars.registerHelper('isReturn',(value)=>{
  return value =='returnRequest' ? true : false
})
Handlebars.registerHelper('returnRequest',(value)=>{
  return value =='returnRequest' ? true : false
})



Handlebars.registerHelper('for', function(from, to, incr, block) {
  var accum = '';
  for(var i = from; i < to; i += incr)
      accum += block.fn(i);
  return accum;
})

Handlebars.registerHelper('review',(value)=>{
  return value == 'delivered' ? true : false
})

db.connect((err)=>{
  if(err)
  console.log("connection error"+err);
  else console.log();('database connected')
})
app.use('/', usersRouter);
app.use('/admin', adminRouter);
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
