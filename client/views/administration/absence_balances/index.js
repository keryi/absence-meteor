Template.adminAbsenceBalanceIndex.events({
	'click a#generate_new_absence_balance': function(e, t) {
		Meteor.call('defaultBalance', function(err) {
			if (err) {
				notifyError(err);
			}
		});
	},

	'click a.edit_absence_balance': function(e, t) {
		var absenceBalanceId = e.target.attributes['data-id'].value;
		var absenceBalance = AbsenceBalances.findOne({ _id: absenceBalanceId });

		$('#edit_absence_balance_id').val(absenceBalanceId);
		$('#edit_absence_balance_count').val(absenceBalance.count);
		$('#editAbsenceBalanceModal').modal('show');
	},

	'click a.delete_absence_balance': function(e, t) {
		var absenceBalanceId = e.target.attributes['data-id'].value;

		if (confirm("Are you sure you want to remove this absence balance?")) {
			AbsenceBalances.remove(absenceBalanceId);
			notifySuccess("An absence balance has been removed successfully.");
		} 
	},
});

Template.absenceBalanceEdit.events({
	'submit form': function(e, t) {
		e.preventDefault();

		var id = t.find('#edit_absence_balance_id').value;
		var count = t.find('#edit_absence_balance_count').value;

		AbsenceBalances.update(
			{ _id: id },
			{ $set: { count: parseInt(count) } }, function(err) {
				if (err) {
					notifyError(err);
				} else {
					$('#editAbsenceBalanceModal').modal('hide');
				}
			}
		);
	}
});

function userName(userId) {
	var username = Meteor.users.findOne({ _id: userId }).username ||
		Meteor.users.findOne({ _id: userId }).email
	return username;
}

UI.registerHelper('userName', userName);