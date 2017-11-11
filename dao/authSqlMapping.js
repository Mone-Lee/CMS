// dao/authSqlMapping.js
// CRUD SQL语句
var user = {
	insert: 'INSERT INTO user(id,name,created_at) VALUES(?,?,?)',
	normalCreate: 'INSERT INTO user_privilege(user_id,privilege_id) VALUES (?, 1)',
	adminCreate: 'INSERT INTO user_privilege(user_id,privilege_id) VALUES (?, 2)',
};

module.exports = user;