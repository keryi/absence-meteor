Absences = new Meteor.Collection('absences');

Absences.allow({
	insert: function(userId, doc) {
		return true;
	},

	update: function(userId, doc, fieldNames, modifier) {
		return true;
	}
});

Meteor.methods({
	approveAbsence: function(absenceId) {
		Absences.update({ _id: absenceId }, { $set: {
			status: 'approved'
		}}, function(err) {
			if (err) {
				throw err;
			}
		});
	},

	rejectAbsence: function(absenceId) {
		Absences.update({ _id: absenceId }, { $set: {
			status: 'rejected'
		}}, function(err) {
			if (err) {
				throw err;
			}
		});
	}
})