Meteor.startup(function () {
	smtp = {
		username: 'user@example.com',
		password: 'password',
		server:   'smtp.mail.com',
		port: 587
	}

	process.env.MAIL_URL = 'smtp://' +
		encodeURIComponent(smtp.username) +
		':' + encodeURIComponent(smtp.password) +
		'@' + encodeURIComponent(smtp.server) +
		':' + smtp.port;
});