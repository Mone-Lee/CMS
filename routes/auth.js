var express = require('express');
var router = express.Router();

var authDao = require('../dao/authDao');

// 普通用户注册
router.post('/normalRegister', function(req, res, next) {
	authDao.register(req, res, next);
	authDao.authorization(req, res, next);
});

//管理员注册
router.post('/adminRegister', function(req, res, next) {
	authDao.register(req, res, next);
	authDao.authorization(req, res, next);
});

//用户登录
router.post('/login', function(req, res, next) {
	authDao.login(req, res, next);
})

module.exports = router;