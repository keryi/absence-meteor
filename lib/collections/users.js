Meteor.users.allow({
	update: function(userId, doc) {
		return isAdmin(userId);
	}
});