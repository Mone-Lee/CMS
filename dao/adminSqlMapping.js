//CRUD SQL语句
var admin = {
	//普通用户
	getUserMsg: 'SELECT id,name,password,email,phone_number from user where id=?',
	getLendingMsg: 'select a.user_id,a.object_id,item.`name`,a.`status`,a.renew,a.return_time from ( (SELECT * from lending where user_id = ?)a INNER JOIN object ON a.object_id = object.id INNER JOIN item ON object.item_id = item.id)',
	updateUserMsg: 'update user set name=?, password=?, email=?, phone_number=? where id=?',
	// getRenewObject: 'select id,user_id,object_id,status,renew from lending where object_id=?',
	renewObject: 'update lending set renew = 1,return_time= date_add(now(), interval 1 month),updated_at = now() where object_id = ?',

	//管理员
	//用户管理
	getAllNormalUserMsg: 'select * from user INNER JOIN user_privilege ON `user`.id = user_privilege.user_id where privilege_id = 1',
	getAllAdminUserMsg: 'select * from user INNER JOIN user_privilege ON `user`.id = user_privilege.user_id where privilege_id = 2',

	deleteUserPrivilege: 'delete from user_privilege where user_id=?',
	deleteUser: 'delete from user where id=?',

	getAllLendingMsg: 'select * from lending',
	updateLendingStatus: 'update lending set status = ? where id = ?',
	insertOverdueMsg: 'insert into overdue(id,user_id,object_id) values(0,?,?)',

	insertFreezeMsg: 'insert into freeze(id,user_id,user_name,object_id,object_name) values (0,?,?,?,?)',
	getObjectName: 'select name from (select object_id ,item.`name`from lending INNER JOIN object ON lending.object_id = object.id INNER JOIN item ON object.item_id = item.id) a where a.object_id = ?',

	freeze: 'update user set active = 1 where id = ?',
	unfreeze: 'update user set active = 0 where id = ?',

	// 分类管理
	addClassification: 'INSERT INTO object_classification(id,name) VALUES(0,?)',
	updateClassification: 'update object_classification set name=? where id = ?',
	deleteClassification: 'delete from object_classification where id=?',


	//资产管理
	getAllObject: 'select object.id,item.`name` as object_name,item.abstract,item.object_classification_id,object_classification.`name` as classification_name,object.`status` from object INNER JOIN item on object.item_id=item.id INNER JOIN object_classification on item.object_classification_id = object_classification.id',
	getObjectMsg: 'select object.id,item.name,item.object_classification_id,object_classification.name as object_classification_name,item.abstract,item.content,object.status from object INNER JOIN item on object.item_id = item.id INNER JOIN object_classification on object_classification.id = item.object_classification_id where object.id = ?',
	editObject: 'update object set item_id=? where id = ?',
	addObject: 'insert into object(id,item_id) values(?,?)',
	deleteObject: 'delete from object where id = ?',
	updateLending: 'update lending set status = ?,updated_at = ? where id = ?',
	updateObject: 'update object set status = ? where id = ?',
	deleteOverdue: 'delete from freeze where object_id = ?',
	lendObject: 'insert into lending(id,user_id,user_name,object_id,return_time,created_at) values(0,?,?,?,?,?)',
	repairObject: 'insert into repair(id,user_id,user_name,object_id,finish_time,created_at) values(0,?,?,?,?,?)',

	//逾期项管理
	getAllOverdue: 'select user.id,user.name,user.email,user.phone_number,lending.object_id,item.name as object_name,lending.return_time from user INNER JOIN lending on lending.user_id = user.id INNER JOIN object ON lending.object_id = object.id INNER JOIN item on object.item_id = item.id where lending.status = 1',


};



module.exports = admin;