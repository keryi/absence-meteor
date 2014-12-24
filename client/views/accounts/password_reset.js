Template.passwordReset.events({
	'submit #new-password-form': function(e, t) {
		e.preventDefault();

		var password = t.find('#new-password').value;
		var passwordConfirm = t.find('#confirm-new-password').value;

		if (isNotEmpty(password) && isValidPassword(password) &&
			password == passwordConfirm) {
			Accounts.resetPassword(Session.get('resetPassword'), password, function(err) {
				Session.set('resetPassword', null);
				if (err) {
					notifyError('Password reset error!\n' + err);
				} else {
					notifySuccess('Your password has been reset. You may sign in with your new password');
					
				}
			});
		}
	}
});

if (Accounts._resetPasswordToken) {
	Session.set('resetPassword', Accounts._resetPasswordToken);
}
