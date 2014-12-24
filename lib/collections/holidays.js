Holidays = new Meteor.Collection('holidays');

Holidays.allow({
	insert: function(userId, doc) {
		return isAdmin(userId);
	},

	update: function(userId, doc, fieldNames, modifier) {
		return isAdmin(userId);
	},

	remove: function(userId, doc) {
		return isAdmin(userId);
	}
});