Template.passwordRecovery.events({
	'submit #recovery-form': function(e, t) {
		e.preventDefault();
		
		var email = trimInput(t.find('#recovery-email').value);

		if (isNotEmpty(email) && isEmail(email)) {
			Accounts.forgotPassword({ email: email }, function(err) {
				if (err) {
					notifyError('Faied to send password recovery email!');
				} else {
					notifyInfo('Email sent. Please check your email');
				}
			});
		}
	},
});
