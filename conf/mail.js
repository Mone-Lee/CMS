var nodemailer = require('nodemailer'),
	// config = require('./config'),
	smtpTransport = nodemailer.createTransport({
		// host: "smtp.qq.com", // 主机
		// secureConnection: true, // 使用 SSL加密
		// port: 465, // SMTP 端口
		host: "smtp.163.com",
		secureConnection: true,
		port: 465,
		// service: 'QQ',
		auth: {
			user: "mone_lee@163.com", // 账号
			pass: "753951AB" // 密码
		}
	});
/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
var sendMail = function(recipient, subject, html) {

	smtpTransport.sendMail({
		from: 'mone_lee@163.com',
		to: recipient.join(','),
		subject: subject,
		html: html

	}, function(error, response) {
		if (error) {
			console.log(error);
			return false;
		} else {
			console.log('发送成功')
			return true;
		}

	});
}

module.exports = sendMail;