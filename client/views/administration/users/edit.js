Template.userEdit.events({
	'submit form': function(e, t) {
		e.preventDefault();

		var id = t.find('#edit_user_id').value;
		var email = t.find('#edit_user_email').value;
		var username = t.find('#edit_user_username').value;
		var firstname = t.find('#edit_user_firstname').value;
		var lastname = t.find('#edit_user_lastname').value;
		var roleName = document.getElementById('edit_user_role').value;
		var roleId = Roles.findOne({ name: roleName })._id;

		Meteor.users.update({ _id: id }, { $set: {
			emails: new Array({ address: email, verified: false }),
			username: username,
			profile: {
				firstname: firstname,
				lastname: lastname,
				roleId: roleId
			}
		}}, function(err) {
			if (err) {
				notifyError(err);
			} else {
				$('#editUserModal').modal('hide');
			}
		});
	}
});

Template.userEdit.helpers({
	roles: function() {
		return Roles.find();
	}
});