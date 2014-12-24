var validatePasswordConfirmation = function(t) {
	var password = t.find('#account-password').value
	, password_confirmation = t.find('#account-password-confirmation').value

	if (password_confirmation.length >= password.length &&
		password_confirmation != password) {
		$('#password-confirmation-error').html('Password and password confirmation are not same').show();
		return;
	} else {
		$('#password-confirmation-error').html('').hide();
	}
}

Template.registerForm.events({
	'submit #register-form': function(e, t) {
		e.preventDefault();

		var email = t.find('#account-email').value
		, password = t.find('#account-password').value
		, password_confirmation = t.find('#account-password-confirmation').value

		if (password != password_confirmation) {
			notifyError('Password and password confirmation are not same');
			return;
		}

		Accounts.createUser({ email: email, password: password },
			function(err) {
				if (err) {
					notifyError('Failed to sign up');
				} else {
					Router.go('absenceIndex');
				}
			}
		);
	},

	'keyup #account-password-confirmation': function(e, t) {
		validatePasswordConfirmation(t);
	},

	'keyup #account-password': function(e, t) {
		validatePasswordConfirmation(t);
	}
});