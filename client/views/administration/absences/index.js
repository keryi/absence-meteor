Template.adminAbsenceIndex.events({
	'click a.absence_approve': function(e, t) {
		var id = e.target.attributes['data-id'].value;

		Meteor.call('approveAbsence', id, function(err) {
			if (err) {
				notifyError(err);
			}
		});
	},

	'click a.absence_reject': function(e, t) {
		var id = e.target.attributes['data-id'].value;

		Meteor.call('rejectAbsence', id, function(err) {
			if (err) {
				notifyError(err);
			}
		});
	},
});
