Template.adminAbsenceBalanceIndex.helpers({
	// absenceBalances: function() {
	// 	var currentYear = new Date().getFullYear();
	// 	return AbsenceBalances.find({
	// 		year: currentYear
	// 	});
	// },


});

function userName(userId) {
	var username = Meteor.users.findOne({ _id: userId }).username ||
		Meteor.users.findOne({ _id: userId }).email
	return username;
}

UI.registerHelper('userName', userName);