function notifyAbsenceApplicationStatus(status, id) {
	var absence = Absences.findOne({ _id: id });

	var applicant = Meteor.users.findOne({ _id: absence.userId });
	var applicantEmail = applicant.emails[0].address;

	var adminRoleId = Roles.findOne({ name: 'admin' })._id;
	var adminEmail = Meteor.users.findOne({
		'profile.roleId': adminRoleId
	}).emails[0].address;

	var emailContext = {
		applicant: applicant.username,
		startDate: absence.startDate.toDateString(),
		endDate: absence.endDate.toDateString(),
		type: absence.type,
		status: status
	};

	var emailHtml = Blaze.toHTMLWithData(
		Template.absenceStatus, emailContext);

	var applicantEmail = Meteor.users.findOne({
		_id: absence.userId
	}).emails[0].address;

	Meteor.call('sendEmail',
		new Array(applicantEmail),
		adminEmail,
		'[' + status.toUpperCase() + ']Absence Application',
		emailHtml);
}

Template.adminAbsenceIndex.events({
	'click a.absence_approve': function(e, t) {
		var id = e.target.attributes['data-id'].value;

		Meteor.call('approveAbsence', id, function(err) {
			if (err) {
				notifyError(err);
			} else {
				notifyAbsenceApplicationStatus('approved', id);
			}
		});
	},

	'click a.absence_reject': function(e, t) {
		var id = e.target.attributes['data-id'].value;

		Meteor.call('rejectAbsence', id, function(err) {
			if (err) {
				notifyError(err);
			} else {
				notifyAbsenceApplicationStatus('rejected', id);
			}
		});
	},
});
