Template.userNew.events({
	'submit form': function(e, t) {
		e.preventDefault();

		var user = {
			email: t.find('#new_user_email').value,
			password: t.find('#new_user_password').value,
			username: t.find('#new_user_username').value,
			profile: {
				firstname: t.find('#new_user_firstname').value,
				lastname: t.find('#new_user_lastname').value,
				roleId: Roles.findOne({ name: 'user' })._id
			}
		};

		Accounts.createUser(user, function(err) {
			$('userNewModal').hide();
			if (err) {
				notifyError('Failed to sign up');
			}
		});
	}
});