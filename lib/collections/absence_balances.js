AbsenceBalances = new Meteor.Collection('absence_balances');

AbsenceBalances.allow({
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

Meteor.methods({
	defaultBalance: function() {
		Meteor.users.find().fetch().forEach(function(user) {
			console.log("Generating absence balance for user " + user.username);
			for (type in ABSENCE_DEFAULT_BALANCES) {
				var currentYearAbsenceBalance = AbsenceBalances.findOne({
					year: new Date().getFullYear(),
					userId: user._id,
					type: type
				});

				if (currentYearAbsenceBalance) {
					console.log("Absence balance of type " + type + " for user "
						+ user.username + " already exists");
				} else {
					AbsenceBalances.insert({
						year: new Date().getFullYear(),
						userId: user._id,
						type: type,
						count: ABSENCE_DEFAULT_BALANCES[type],
					}, function(err) {
						if (err) {
							throw err;
						}
					});
				}
			}
			
		});
	}
});