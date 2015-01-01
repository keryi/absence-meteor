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
		var currentYear = new Date().getFullYear();
		var absence = Absences.findOne({ _id: absenceId });
		var currentYearBalance = AbsenceBalances.findOne({
			type: absence.type,
			userId: absence.userId,
			year: currentYear
		});

		var newAbsenceBalance = currentYearBalance.count - absence.duration;

		if (currentYearBalance.count == 0) {
			throw new Meteor.Error(absence.type + ' absence balance is zero');
		} else if (newAbsenceBalance <= 0) {
			throw new Meteor.Error('Absence applied exceed absence balance');
		}

		Absences.update({ _id: absenceId }, { $set: {
			status: 'approved'
		}}, function(err) {
			if (err) {
				throw err;
			}
		});

		AbsenceBalances.update({ _id: currentYearBalance._id }, { $set: {
			count: newAbsenceBalance
		}}, function(err) {
			if (err) {
				// revert Absence status
				Absences.update({ _id: absenceId }, { $set: {
					status: 'pending'
				}});
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