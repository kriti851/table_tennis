var createError = require('http-errors');
const sequelize = require('./config/db');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const fileUpload = require('express-fileupload');
require("dotenv").config();
var cors = require("cors");
const { Server } = require("socket.io");
const io = new Server();
var indexRouter = require('./routes/index');
var apiRouter = require("./routes/api/index");
var adminApiRouter = require("./routes/admin");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
// app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,)));

app.use(cors());

sequelize    
  .authenticate()    
  .then(() => {    
    console.log('Connection has been established successfully.');    
  })    
  .catch(err => {    
    console.error('Unable to connect to the database:', err);    
  });    

app.use('/', indexRouter);
app.use("/api/", apiRouter);
app.use("/admin/", adminApiRouter);

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


app.get('/', (req, res) => {
  res.sendFile(__dirname+'/index.html');
});
// const approuter = require("./routes/customer");
// app.use('/customer',approuter);



const server = require('http').createServer(app);
io.on("connection", (socket) => {
  socket.on("send-message", async (data) => {
    io.emit("receive-message",data);
  });
  socket.on("player-send-message-admin", async (data) => {
    io.emit("player-receive-message-admin",data);
  });
 
});
io.listen(server,{
  cors: {
    origin: "*",
    credentials: false
  }
});

module.exports = app;




