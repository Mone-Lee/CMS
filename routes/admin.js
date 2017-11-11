var express = require('express');
var router = express.Router();

var adminDao = require('../dao/adminDao');

var sendMail = require('../conf/mail');

/*普通用户*/
router.get('/getUserMsg/:userId', function(req, res, next) {
	// if (!req.session.user) {
	// 	console.log('请先登录');
	// } else {
	// 	console.log(req.session.user);
	adminDao.getUserMsg(req, res, next);
	// }

});

//获取用户个人借还信息
router.get('/getLendingMsg/:id', function(req, res, next) {
	adminDao.getLendingMsg(req, res, next);
});

//更新用户个人信息
router.post('/updateUserMsg', function(req, res, next) {
	adminDao.updateUserMsg(req, res, next);
});

//续借物件
router.post('/renew', function(req, res, next) {
	adminDao.renew(req, res, next);
});



//管理员
/*用户管理*/
router.get('/getAllAdminUserMsg', function(req, res, next) {
	adminDao.getAllAdminUserMsg(req, res, next);
})



router.get('/updateAllLendingMsg', function(req, res, next) {
	adminDao.updateAllLendingMsg(req, res, next);
})



/*分类管理*/
router.post('/addClassification', function(req, res, next) {
	adminDao.addClassification(req, res, next);
});

router.post('/updateClassification/:id', function(req, res, next) {
	adminDao.updateClassification(req, res, next);
});

router.post('/deleteClassification/:id', function(req, res, next) {
	adminDao.deleteClassification(req, res, next);
});


/*资产管理*/
router.get('/getAllObject', function(req, res, next) {
	adminDao.getAllObject(req, res, next);
});

router.get('/getObjectMsg/:id', function(req, res, next) {
	adminDao.getObjectMsg(req, res, next);
});

//编辑object
router.post('/editObject/:id', function(req, res, next) {
	adminDao.editObject(req, res, next);
});

//添加object
router.post('/addObject', function(req, res, next) {
	adminDao.addObject(req, res, next);
});

//删除object
router.post('/deleteObject/:id', function(req, res, next) {
	adminDao.deleteObject(req, res, next);
});

//批量删除object
router.post('/deleteObjectBatch', function(req, res, next) {
	adminDao.deleteObjectBatch(req, res, next);
});

//归还object
router.post('/returnObject', function(req, res, next) {
	adminDao.returnObject(req, res, next);
});

//出借object
router.post('/lendObject', function(req, res, next) {
	adminDao.lendObject(req, res, next);
});

//送修object
router.post('/repairObject', function(req, res, next) {
	adminDao.repairObject(req, res, next);
});


/*逾期项管理*/
router.get('/getAllOverdue', function(req, res, next) {
	adminDao.getAllOverdue(req, res, next);
});

router.post('/sendMail', function(req, res, next) {
	var receivers = req.body.receivers;
	var subject = req.body.subject;
	var html = req.body.html;
	console.log('receivers:' + receivers);
	console.log('subject:' + subject);
	console.log('html:' + html);
	if (sendMail(receivers, subject, html)) {
		res.json({
			code: '0',
			msg: '发送成功'
		});
	}
});


/*用户管理*/
router.get('/getAllNormalUserMsg', function(req, res, next) {
	adminDao.getAllNormalUserMsg(req, res, next);
});

//删除用户
router.post('/deleteUser/:id', function(req, res, next) {
	adminDao.deleteUser(req, res, next);
});

//批量删除用户
router.post('/deleteUserBatch', function(req, res, next) {
	adminDao.deleteUserBatch(req, res, next);
});

module.exports = router;