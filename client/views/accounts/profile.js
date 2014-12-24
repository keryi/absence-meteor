Template.userProfile.events({
	'submit #edit_user_profile_form': function(e, t) {
		e.preventDefault();

		var username = t.find('#user_profile_username').value;
		var	firstname = t.find('#user_profile_firstname').value;
		var	lastname = t.find('#user_profile_lastname').value;

		Accounts.update({ _id: Meteor.userId() }, { $set: {
			username: username,
			profile: {
				firstname: firstname,
				lastname: lastname,
			}
		}}, function(err) {
			if (err) {
				notifyError(err);
			} else {
				notifySuccess('Your profile has been updated.');
			}
		});
	},

	'submit #user_profile_reset_password_form': function(e, t) {
		e.preventDefault();

		var oldPassword = t.find('#user_old_password').value;
		var newPassword = t.find('#user_new_password').value;

		Accounts.changePassword(oldPassword, newPassword, function(err) {
			if (err) {
				notifyError('Failed to change your password.');
			} else {
				notifySuccess('Your password has been changed.');
			}
		});
	}
});