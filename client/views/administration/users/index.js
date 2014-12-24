Template.adminUserIndex.helpers({
	users: function() {
		console.log(Meteor.users.find().count());
		return Meteor.users.find();
	},

	roleName: function(roleId) {
		var role = Roles.findOne({ _id: roleId });
		return role.name;
	},

	formatEmail: function(emails) {
		return emails.map(function(email) {
			return email.address;
		}).join(',');
	}
});

Template.adminUserIndex.events({
	'click #new-user-button': function(e, t) {
		$('#newUserModal').modal('show');
	},

	'click a.edit_user': function(e, t) {
		var userId = e.target.attributes['data-id'].value;

		var user = Meteor.users.findOne({ _id: userId });

		$('#edit_user_email').val(user.emails[0].address);
		$('#edit_user_username').val(user.username);
		$('#edit_user_firstname').val(user.profile.firstname);
		$('#edit_user_lastname').val(user.profile.lastname);

		var role = Roles.findOne({ _id: user.profile.roleId }).name;
		$("#edit_user_role option[value='" + role + "']").attr("selected", "selected");

		$('#edit_user_id').val(userId);

		$('#editUserModal').modal('show');
	},

	'click a.delete_user': function(e, t) {
		notifyWarning("Sorry, we can't let u remove a user yet!");
	}
});