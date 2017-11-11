var express = require('express');
var path = require('path');

var session = require('express-session');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var webpack = require('webpack');
var webpackConfig = require('./build/webpack.conf');


var app = express(); // 创建一个express实例
var server = app.listen(3000);
var io = require('socket.io').listen(server);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var compiler = webpack(webpackConfig); // 调用webpack并把配置传递过去
// 使用 webpack-dev-middleware 中间件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
	publicPath: '/',
	stats: {
		colors: true,
		chunks: false
	}
});

var SerialPort = require('serialport');
var port = new SerialPort('COM7');

// port.open(function(err) {
// 	if (err) {
// 		console.log('failed to open:' + err);
// 	} else {
// 		console.log('open');
// 		port.on('data', function(data) {
// 			console.log('data received:' + data);
// 			var newPortData = '';
// 			var int8 = new Int8Array(data);
// 			console.log(int8);
// 			for (var i = 0; i < int8.length; i++) {
// 				// console.log(int8[i]);
// 				newPortData += Math.abs(int8[i]).toString();
// 			}
// 			console.log('Data: ' + newPortData);

// 		});
// 		port.write("ls\n", function(err, results) {
// 			console.log('err: ' + err);
// 			console.log('results: ' + results)
// 		})
// 	}
// })

port.on('open', function() {
	// port.write('main screen turn on', function(err) {
	// 	if (err) {
	// 		return console.log('Error on write: ', err.message);
	// 	}
	// 	console.log('message written');
	// });
	console.log('open!');
});

// open errors will be emitted as an error event
port.on('error', function(err) {
	console.log('Error: ', err.message);
	// io.sockets.emit('errorMsg', err.message);
})

io.sockets.on('connection', function(socket) {
	// If socket.io receives message from the client browser then 
	// this call back will be executed.
	socket.on('message', function(msg) {
		console.log('connection:' + msg);
		socket.emit('new message', msg);
	});

	socket.on('errorMsg', function(msg) {
		console.log('errorMsg:' + msg);
	});

	// If a web browser disconnects from Socket.IO then this callback is called.
	socket.on('disconnect', function() {
		console.log('disconnected');
	});
});

port.on('data', function(data) {

	console.log(typeof data);

	var newPortData = '';
	var int8 = new Int8Array(data);
	console.log(int8);
	for (var i = 0; i < int8.length; i++) {
		// console.log(int8[i]);
		newPortData += Math.abs(int8[i]).toString();
	}
	console.log('Data: ' + newPortData);
	io.sockets.emit('new message', newPortData);
});


var users = require('./routes/users');
app.use('/users', users);

var auth = require('./routes/auth');
app.use('/home', auth);

var common = require('./routes/common');
app.use('/home/c', common);

var admin = require('./routes/admin');
app.use('/admin/c', admin);

app.use(express.static(path.join(__dirname, 'public')));


var history = require('connect-history-api-fallback');
app.use(history());

app.use(devMiddleware);
app.use(require("webpack-hot-middleware")(compiler));



module.exports = app;