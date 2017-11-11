//普通用户与管理员通用接口
//实现与MYSQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./commonSqlMapping');

var _ = require('lodash');

// 使用连接池，提升性能
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

module.exports = {
	//获取所有物件项信息
	getAllItem: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			//'select a.name,object_classification.name as object_classification,object_classification.id as object_classification_id,a.abstract,b.usable,b.lend,b.repair from (select id,name,abstract,object_classification_id from item ) a join (select item_id,sum(case when status = 0 then 1 else 0 end) as usable,sum(case when status = 1 then 1 else 0 end) as lend,sum(case when status = 2 then 1 else 0 end) as repair from object group by item_id ) b on a.id=b.item_id INNER JOIN object_classification on a.object_classification_id = object_classification.id';
			connection.query($sql.getAllItem, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			})
		})

	},

	//获取所有物件项分类
	getAllClassification: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			//'select id,name from object_classification'
			connection.query($sql.getAllClassification, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			})
		})
	},

	// //按分类获取物件项
	// getItemByClassification: function(req, res, next) {
	// 	pool.getConnection(function(err, connection) {
	// 		if (req.query) {
	// 			var id = +req.query.classificationId;
	// 			connection.query($sql.getItemByClassification, id, function(err, result) {
	// 				jsonWrite(res, result);
	// 				connection.release();
	// 			})
	// 		}
	// 	})
	// },

	//搜索物件项
	// queryItem: function(req, res, next) {
	// 	pool.getConnection(function(err, connection) {
	// 		if (req.query) {
	// 			var q = req.body.q;
	// 			connection.query($sql.queryItem, q, function(err, result) {
	// 				jsonWrite(res, result);
	// 				connection.release();
	// 			})
	// 		}

	// 	})
	// },

	//按物件项名获取所有物件
	getItemDetail: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			var name = req.params.name;
			connection.query($sql.getItemDetail, name, function(err, result) {
				console.log(result);
				results = {
					item: {
						id: result[0].item_id,
						name: result[0].name,
						content: result[0].content,
						object_classification_name: result[0].object_classification_name,
					},
					objects: result
				}
				jsonWrite(res, results);
				connection.release();
			})
		})
	},

	//获取单个item信息
	getItemMsg: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			var id = req.params.id;
			connection.query($sql.getItemMsg, id, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			})
		})

	},

	//编辑item信息
	editItem: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			var id = req.params.id;
			// alert(id);
			var name = req.body.name;
			var abstract = req.body.abstract;
			var content = req.body.content;
			var object_classification_id = req.body.object_classification_id;
			var object_classification_name = req.body.object_classification_name;
			connection.query($sql.editItem, [name, abstract, content, object_classification_id, id], function(err, result) {
				jsonWrite(res, result);
				connection.release();
			})
		})
	},

	getItemList: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			connection.query($sql.getItemList, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			})
		})

	},

	addItem: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			var name = req.body.name;
			var abstract = req.body.abstract;
			var content = req.body.content;
			var object_classification_id = req.body.object_classification_id;
			connection.query($sql.addItem, [name, abstract, content, object_classification_id], function(err, result) {
				console.log(result);
				jsonWrite(res, result);
				connection.release();
			})
		})
	},

	deleteItem: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			var id = req.params.id;
			console.log('id:' + id);
			connection.query('select * from object', function(err, result) {
				console.log('objectList:')
				console.log(result);
				// console.log(_.some(result, 'item_id', id));
				var findItem = false;
				for (var i = 0; i < result.length; i++) {
					// console.log(result[i].item_id);
					if (result[i].item_id == id) {
						findItem = true;
						break;
					}
				}
				if (findItem) {
					result = {
						code: '-1',
						msg: '该物件下有资产，请先把资产移动到其它物件名下'
					}
					jsonWrite(res, result);
					connection.release();
				} else {
					connection.query($sql.deleteItem, id, function(err, result) {
						console.log(result);
						jsonWrite(res, result);
						connection.release();
					})
				}
			})
		})
	},

};