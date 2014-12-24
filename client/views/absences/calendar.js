Template.absenceCalendar.rendered = function() {
	$('#calendar').fullCalendar({
		editable: false,
		events: absenceEvents(),
	});
}

var absenceEvents = function() {
	return Absences.find().fetch().map(function(absence) {
		var user = Meteor.users.findOne({ _id: absence.userId });

		return {
			title: user.profile.firstname + ' is on ' + absence.type + ' absence',
			allDay: true,
			start: moment(absence.startDate, 'MMMM DD, YYYY').format('YYYY-MM-DD'),
			end: moment(absence.endDate, 'MMMM DD, YYYY').format('YYYY-MM-DD')
		}
	});
}