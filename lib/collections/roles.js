Roles = new Meteor.Collection('roles');

Roles.allow({
	insert: function() {
		return isAdmin(userId);
	}
});