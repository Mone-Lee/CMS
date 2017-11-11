var express = require('express');
var router = express.Router();

var commonDao = require('../dao/commonDao');

//获取所有物件项信息
router.get('/getAllItem', function(req, res, next) {
	commonDao.getAllItem(req, res, next);
});

//获取所有物件的分类
router.get('/getAllClassification', function(req, res, next) {
	commonDao.getAllClassification(req, res, next);
});

// //按分类获取item
// router.get('/getItemByClassification', function(req, res, next) {
// 	commonDao.getItemByClassification(req, res, next);
// });

// //根据物件名筛选item
// router.post('/queryItem', function(req, res, next) {
// 	commonDao.queryItem(req, res, next);
// });

//获取item详情
router.get('/getItemDetail/:name', function(req, res, next) {
	commonDao.getItemDetail(req, res, next);
});

//获取单个item信息
router.get('/getItemMsg/:id', function(req, res, next) {
	commonDao.getItemMsg(req, res, next);
});

//编辑item信息
router.post('/editItem/:id', function(req, res, next) {
	commonDao.editItem(req, res, next);
});

//编辑item列表(简单的，无object信息)
router.get('/getItemList', function(req, res, next) {
	commonDao.getItemList(req, res, next);
});

//添加item
router.post('/addItem', function(req, res, next) {
	commonDao.addItem(req, res, next);
});

//添加item
router.post('/deleteItem/:id', function(req, res, next) {
	commonDao.deleteItem(req, res, next);
});



module.exports = router;