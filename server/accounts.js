Meteor.startup(function() {
	Accounts.emailTemplates.siteName = "Absence System";
	Accounts.emailTemplates.from = "no-reply <admin@example.com>";

	Accounts.emailTemplates.resetPassword.subject = function(user) {
		return "Hmm, Forgot your password again huh..";
	};

	Accounts.emailTemplates.resetPassword.text = function(user, url) {
		return "Hi, Please click the link below to reset your password\n" +
			url + "\nNo Thanks.";
	};
});
