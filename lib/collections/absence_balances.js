AbsenceBalances = new Meteor.Collection('absence_balances');

AbsenceBalances.allow({
	insert: function(userId, doc) {
		return isAdmin(userId);
	},

	update: function(userId, doc, fieldNames, modifier) {
		return isAdmin(userId);
	}
});