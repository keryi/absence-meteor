AbsenceBalances = new Meteor.Collection('absence_balances');

AbsenceBalances.allow({
	insert: function(userId, doc) {
		return isAdmin(userId);
	}
});