Template.loginForm.events({
	'submit #login-form': function(e, t) {
		e.preventDefault();

		var email = t.find('#login-email').value
		, password = t.find('#login-password').value;

		Meteor.loginWithPassword(email, password, function(err) {
			if (err) {
				notifyError('Failed to sign in');
			} else {
				Router.go('absenceIndex');
			}
		});
	}
});