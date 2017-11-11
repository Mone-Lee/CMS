//用户权限相关：注册、登录
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./authSqlMapping');

var url = require('url');

var moment = require('moment');
var _ = require('lodash');
var Lockr = require('Lockr');

//使用链接池，提升性能
var pool = mysql.createPool($util.extend({}, $conf.mysql));

// 向前台返回JSON方法的简单封装
var jsonWrite = function(res, ret) {
	if (typeof ret === 'undefined') {
		res.json({
			code: '1',
			msg: '操作失败'
		});
	} else {
		res.json(ret);
	}
};


module.exports = {
	//用户注册
	register: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			//获取前台页面传过来的参数
			var id = req.body.id,
				name = req.body.name;
			//建立连接，向表中插入值
			connection.query('SELECT * FROM user WHERE id = "' + id + '";', function(err, result) {
				if (result.length > 0) {
					result = {
						code: 1,
						msg: '用户已存在'
					};
					return;
				} else {
					var now = moment().format("YYYY-MM-DD HH:mm:ss");
					connection.query($sql.insert, [id, name, now], function(err, result) {
						if (result) {
							result = {
								code: 200,
								msg: '增加成功'
							};
						}
						return;
					});
				}
			});
		});
	},

	//授权
	authorization: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			var param = req.body;

			var pathname = url.parse(req.url).pathname.split('/');
			console.log(pathname[1]);

			if (pathname[1] == 'normalRegister') {
				console.log(param.id);
				connection.query($sql.normalCreate, param.id, function(err, result) {
					if (result) {
						result = {
							code: 200,
							msg: '增加成功'

						};
					}
					// 以json形式，把操作结果返回给前台页面
					jsonWrite(res, result);

					// 释放连接 
					connection.release();
				})
			} else if (pathname[1] == 'adminRegister') {
				connection.query($sql.adminCreate, param.id, function(err, result) {
					if (result) {
						result = {
							code: 200,
							msg: '增加成功'

						};
					}
					// 以json形式，把操作结果返回给前台页面
					jsonWrite(res, result);

					// 释放连接 
					connection.release();
				})
			}
		})
	},

	//登录
	login: function(req, res, next) {
		// var session = req.session;
		var id = req.body.id,
			password = req.body.password,
			privilege_id = req.body.privilege_id;
		pool.getConnection(function(err, connection) {
			connection.query('SELECT * FROM user WHERE id = "' + id + '";', function(err, result) {
				if (result.length == 0) {
					result = {
						code: 1,
						msg: '用户不存在'
					};
					jsonWrite(res, result);
					connection.release();
				} else if (result[0].password != password) {
					result = {
						code: 1,
						msg: '密码错误'
					};
					jsonWrite(res, result);
					connection.release();
				} else {
					connection.query('SELECT * FROM user_privilege WHERE user_id = "' + id + '";', function(err, result) {
						// console.log(result[0].privilege_id);
						if (result[0].privilege_id == privilege_id) {

							//记录登录者信息
							var user = {
								'user_id': id,
								'user_privilege': privilege_id
							};
							// req.session.user = user;

							result = {
								code: 200,
								msg: '登录成功',
							};
						} else {
							result = {
								code: 1,
								msg: '登录权限错误'
							};
						}
						jsonWrite(res, result);
						connection.release();
					});
				}
			});
		});
	}

};