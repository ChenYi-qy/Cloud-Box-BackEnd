#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('cloud-box-backend-develop:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

//socket.io通信，transports这里需要加上websocket，否则会跨域
var io = require('socket.io')(server, {
  transports: ['websocket'] })

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// 引入消息处理函数
var msgHandler = require('../test')
const {closeRGB} = require("../test");
//客户端发起连接时触发
io.on('connection', (socket) => {

  socket.on('typeOneInstruction',  function (mode,brightness,speed)  {

    let hex_Mode = parseInt(mode,16);
    let hex_Brightness = parseInt(brightness,16);
    let hex_Speed = parseInt(speed,16);
    console.log(mode + "  " + brightness + "  " + speed)


    msgHandler.sendData(hex_Mode,hex_Brightness,hex_Speed);

    // 成功后响应AA
    socket.emit('successfulCall', { msg: 'AA' })
  })


  socket.on('typeTwoInstruction', (data) => {
    console.log(data)

    // 成功后响应AA
    socket.emit('successfulCall', { msg: 'AA' })
  })

  socket.on('typeThreeInstruction', (data) => {
    console.log(data)
    // 成功后响应AA
    })

  socket.on('closeRGB', function () {
    closeRGB();

    // 成功后响应AA
    socket.emit('successfulCall', { msg: 'AA' })
  })
})
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
