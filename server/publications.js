Meteor.publish('absences', function() {
	return Absences.find();
});

Meteor.publish('holidays', function() {
	return Holidays.find();
});

Meteor.publish('absence_balances', function() {
	return AbsenceBalances.find();
});

Meteor.publish('roles', function() {
	return Roles.find();
});

Meteor.publish('users', function() {
	return Meteor.users.find();
});

Meteor.publish('claims', function() {
	return Claims.find();
});

Meteor.publish('claim_attachments', function() {
	return ClaimAttachments.find();
})