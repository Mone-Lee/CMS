//实现与MYSQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./adminSqlMapping');

var moment = require('moment');
var _ = require('lodash');

//使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, $conf.mysql));

//向前台返回JSON方法的简单封装
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

var freeze = function(user_id) {
	var userId = user_id;
	pool.getConnection(function(err, connection) {
		connection.query($sql.freeze, userId, function(err, result) {
			if (result) {
				result = true;
				console.log('冻结用户：' + result);
			}
		})
	})
};

var unfreeze = function(user_id) {
	var userId = user_id;
	pool.getConnection(function(err, connection) {
		connection.query($sql.unfreeze, userId, function(err, result) {
			if (result) {
				result = true;
				console.log('解冻用户：' + result);
			}
		})
	})
};

module.exports = {
	//普通用户
	//获取用户个人信息
	getUserMsg: function(req, res, next) {
		var userId = req.params.userId; // 为了拼凑正确的sql语句，这里要转下整数
		pool.getConnection(function(err, connection) {
			connection.query($sql.getUserMsg, userId, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			});
		});
	},
	//获取用户的借还信息
	getLendingMsg: function(req, res, next) {
		var userId = req.params.id; // 为了拼凑正确的sql语句，这里要转下整数
		pool.getConnection(function(err, connection) {
			connection.query($sql.getLendingMsg, userId, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			});
		});
	},

	//更改个人信息
	updateUserMsg: function(req, res, next) {
		// var userId = req.session.userId;
		var id = req.body.id
		var name = req.body.name;
		var password = req.body.password;
		var email = req.body.email;
		var phone_number = req.body.phone_number;
		// var userId = req.session.user.userId;
		if (name == '' || password == '') {
			result = {
				msg: '姓名和密码不能为空'
			}
			jsonWrite(res, result);
			connection.release();
		} else {
			pool.getConnection(function(err, connection) {
				connection.query($sql.updateUserMsg, [name, password, email, phone_number, id], function(err, result) {
					if (result.affectedRows > 0) {
						result = {
							msg: '更新成功'
						}
					} else {
						result = {
							msg: '更新失败'
						}
					}
					jsonWrite(res, result);
					connection.release();
				});
			});
		}
	},

	//续借物件
	renew: function(req, res, next) {
		var id = req.body.id;
		pool.getConnection(function(err, connection) {
			connection.query($sql.renewObject, id, function(err, result) {
				result = {
					code: '0',
					msg: '续借成功'
				}
				jsonWrite(res, result);
				connection.release();
			});
		})
	},

	//管理员
	//用户管理
	//获取所有普通用户信息
	getAllNormalUserMsg: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			connection.query($sql.getAllNormalUserMsg, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			});
		});
	},

	//删除用户
	deleteUser: function(req, res, next) {
		var id = req.params.id;
		pool.getConnection(function(err, connection) {
			connection.query($sql.deleteUserPrivilege, id, function(err, result) {
				console.log(result);
			});
			connection.query($sql.deleteUser, id, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			});
		});
	},

	//批量删除用户
	deleteUserBatch: function(req, res, next) {
		var deleteBatch = req.body.deleteBatch;
		var idList = [];
		_(deleteBatch).forEach(function(n) {
			_.forEach(n, function(n, key) {
				if (key == 'id') {
					idList.push(n);
				}
			});
		});

		console.log('idList:' + idList);

		var deleteUserPrivilege = "delete from user_privilege where user_id in ( ";
		for (var i = 0; i < idList.length - 1; i++) {
			deleteUserPrivilege = deleteUserPrivilege + idList[i] + ",";
		}
		deleteUserPrivilege = deleteUserPrivilege + idList[idList.length - 1] + ")";

		var deleteUser = "delete from user where id in ( ";
		for (var i = 0; i < idList.length - 1; i++) {
			deleteUser = deleteUser + idList[i] + ",";
		}
		deleteUser = deleteUser + idList[idList.length - 1] + ")";


		pool.getConnection(function(err, connection) {
			connection.query(deleteUserPrivilege, function(err, result) {
				console.log(result);
			})
			connection.query(deleteUser, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			})
		})
	},


	//获取所有管理员信息
	getAllAdminUserMsg: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			connection.query($sql.getAllAdminUserMsg, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			});
		});
	},
	//获取所有借还信息并更新过期信息、冻结过期用户(lending,overdue,freeze)
	updateAllLendingMsg: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			connection.query($sql.getAllLendingMsg, function(err, result) {
				for (var i = 0; i < result.length; i++) {
					var item = result[i];
					(function(item) {
						var now = moment().format("YYYY-MM-DD HH:mm:ss");
						console.log('当前时间：' + now);
						var return_time = moment(item.return_time).format("YYYY-MM-DD HH:mm:ss");
						console.log('应当归还时间：' + return_time);
						//如果当前时间超过了应当归还时间（过期未还）
						if (item.status == 0 && moment(now).isAfter(return_time)) {
							// console.log(item);
							//修改当前借还记录的status
							connection.query($sql.updateLendingStatus, [1, item.id], function(err, result) {
								// console.log(item);
								console.log('更新借还信息状态');
								//插入过期信息到表overdue
								connection.query($sql.insertOverdueMsg, [item.user_id, item.object_id], function(err, result) {
									console.log('插入过期信息到表overdue');
								});
								//获取过期obejct的name
								connection.query($sql.getObjectName, item.object_id, function(err, result) {
									connection.query($sql.insertFreezeMsg, [item.user_id, item.user_name, item.object_id, result[0].name], function(err, result) {
										console.log('插入过期信息到表freeze');
									})
								})
							})
							freeze(item.user_id);
						}
					})(item);
				}
				jsonWrite(res, result);
				connection.release();
			});
		});
	},


	//分类管理
	//新增物件分类
	addClassification: function(req, res, next) {
		var name = req.body.name;
		pool.getConnection(function(err, connection) {
			connection.query('select * from object_classification', function(err, result) {
					console.log(result);
					var hasClass = _.filter(result, function(item) {
						return item.name === name;
					});
					if (hasClass.length === 0) {
						connection.query($sql.addClassification, name, function(err, result) {
							jsonWrite(res, result);
							connection.release();
						})
					} else {
						result = {
							code: '-1',
							msg: '该分类已存在'
						}
						jsonWrite(res, result);
						connection.release();
					}
				})
				// connection.query($sql.addClassification, name, function(err, result) {
				// 	jsonWrite(res, result);
				// 	connection.release();
				// })
		})
	},
	//修改分类名称
	updateClassification: function(req, res, next) {
		var id = req.params.id;
		var name = req.body.name;
		pool.getConnection(function(err, connection) {
			connection.query($sql.updateClassification, [name, id], function(err, result) {
				jsonWrite(res, result);
				connection.release();
			})
		})
	},
	//删除物件分类
	deleteClassification: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			var id = req.params.id;
			console.log('id:' + id);
			connection.query('select * from item', function(err, result) {
				console.log('itemList:')
				console.log(result);
				// console.log(_.some(result, 'item_id', id));
				var findClass = false;
				for (var i = 0; i < result.length; i++) {
					// console.log(result[i].item_id);
					if (result[i].object_classification_id == id) {
						findClass = true;
						break;
					}
				}
				if (findClass) {
					result = {
						code: '-1',
						msg: '该分类下有物件，请先把物件移动到其它分类名下'
					}
					jsonWrite(res, result);
					connection.release();
				} else {
					connection.query($sql.deleteClassification, id, function(err, result) {
						console.log(result);
						jsonWrite(res, result);
						connection.release();
					})
				}
			})
		})
	},


	//资产管理
	//获取所有物件信息
	getAllObject: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			connection.query($sql.getAllObject, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			})
		})
	},
	//获取单个object的信息
	getObjectMsg: function(req, res, next) {
		var id = req.params.id;
		pool.getConnection(function(err, connection) {
			connection.query($sql.getObjectMsg, id, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			})
		})
	},
	//编辑object
	editObject: function(req, res, next) {
		var id = req.params.id;
		var item_id = req.body.item_id;
		pool.getConnection(function(err, connection) {
			connection.query($sql.editObject, [item_id, id], function(err, result) {
				jsonWrite(res, result);
				connection.release();
			})
		})
	},
	//新增物件
	addObject: function(req, res, next) {
		var id = req.body.id;
		var item_id = req.body.item_id;
		pool.getConnection(function(err, connection) {
			connection.query($sql.addObject, [id, item_id], function(err, result) {
				jsonWrite(res, result);
				connection.release();
			})
		})
	},
	//删除物件
	deleteObject: function(req, res, next) {
		var id = req.params.id;
		pool.getConnection(function(err, connection) {
			connection.query($sql.deleteObject, id, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			})
		})
	},
	//批量删除object
	deleteObjectBatch: function(req, res, next) {
		var deleteBatch = req.body.deleteBatch;
		var idList = [];
		_(deleteBatch).forEach(function(n) {
			_.forEach(n, function(n, key) {
				if (key == 'id') {
					idList.push(n);
				}
			});
		});

		console.log('idList:' + idList);

		var deleteSql = "delete from object where id in ( ";
		for (var i = 0; i < idList.length - 1; i++) {
			deleteSql = deleteSql + idList[i] + ",";
		}
		deleteSql = deleteSql + idList[idList.length - 1] + ")";

		pool.getConnection(function(err, connection) {
			connection.query(deleteSql, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			})
		})
	},
	//归还object
	returnObject: function(req, res, next) {
		var ids = req.body.returnIds;
		var returnTime = moment().format("YYYY-MM-DD HH:mm:ss");
		pool.getConnection(function(err, connection) {
			connection.query($sql.getAllLendingMsg, function(err, result) {
				for (var i = 0; i < result.length; i++) {
					if (result[i].status !== 2) {
						var item = result[i];
						(function(item) {
							for (var j = 0; j < ids.length; j++) {
								if (item.object_id == ids[j]) {
									//更新lending表
									connection.query($sql.updateLending, [2, returnTime, item.id], function(err, result) {
										//更新object表
										connection.query('select * from object where id =' + item.object_id, function(err, result) {
											if (result.length > 0) {
												connection.query($sql.updateObject, [0, item.object_id], function(err, result) {});
											}
										});
										//删除过期信息(如果存在)
										connection.query('select * from freeze where object_id =' + item.object_id, function(err, result) {
											if (result.length > 0) {
												var user_id = result[0].user_id;
												connection.query($sql.deleteOverdue, item.object_id, function(err, result) {
													connection.query('select * from freeze where user_id =' + user_id, function(err, result) {
														if (result == '') {
															unfreeze(user_id);
														}
													})
												})
											}
										});
									})
								}
							}
						})(item);
					}
				}
				jsonWrite(res, result);
				connection.release();
			});
		});
	},
	//出借object
	lendObject: function(req, res, next) {
		var user_id = req.body.user_id;
		var user_name = req.body.user_name;
		var objectIds = req.body.objectIds;
		var createdTime = moment().format("YYYY-MM-DD HH:mm:ss");
		var returnTime = moment(createdTime).add(1, 'months').format("YYYY-MM-DD HH:mm:ss");
		console.log('createdTime:' + createdTime + ' returnTime:' + returnTime);
		pool.getConnection(function(err, connection) {
			for (var i = 0; i < objectIds.length; i++) {
				console.log(objectIds[i]);
				var object_id = objectIds[i];
				connection.query($sql.lendObject, [user_id, user_name, object_id, returnTime, createdTime], function(err, result) {
					// jsonWrite(res, result);
					// connection.release();
					console.log(result);
				});
				connection.query($sql.updateObject, [1, object_id], function(err, result) {
					// jsonWrite(res, result);
					// connection.release();
					console.log(result);
				});
			}

		})
	},
	//送修object
	repairObject: function(req, res, next) {
		var user_id = req.body.user_id;
		var user_name = req.body.user_name;
		var repairIds = req.body.repairIds;
		var createdTime = moment().format("YYYY-MM-DD HH:mm:ss");
		var finish_time = moment(createdTime).add(1, 'months').format("YYYY-MM-DD HH:mm:ss");
		console.log('createdTime:' + createdTime + ' finish_time:' + finish_time);
		pool.getConnection(function(err, connection) {
			for (var i = 0; i < repairIds.length; i++) {
				console.log(repairIds[i]);
				var object_id = repairIds[i];
				connection.query($sql.repairObject, [user_id, user_name, object_id, finish_time, createdTime], function(err, result) {
					// jsonWrite(res, result);
					// connection.release();
					console.log(result);
				});
				connection.query($sql.updateObject, [2, object_id], function(err, result) {
					// jsonWrite(res, result);
					// connection.release();
					console.log(result);
				});
			}

		})
	},


	//逾期项管理
	//获取所有逾期项
	getAllOverdue: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			connection.query($sql.getAllOverdue, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			});
		});
	},


};