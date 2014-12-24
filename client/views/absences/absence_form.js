var validateStartAndEndDates = function() {
	var startDate = document.getElementById('absence_start_date').value;
	var endDate = document.getElementById('absence_end_date').value;
	startDate = moment(startDate, "MMMM DD, YYYY");
	endDate = moment(endDate, "MMMM DD, YYYY");

	if (endDate < startDate)
		return false;

	// Calculate duration
	// list the dates in array,
	// reject weekend (saturday, sunday)
	// reject holiday (reject replacement, not actual, but actual on weekend, so do nothing)

	var range = endDate.diff(startDate, 'days');
	var duration = range;

	var holidays = Holidays.find({ year: (new Date()).getFullYear() }).fetch();
	var holidayWeekNums = _.map(holidays, function(holiday) {
		var m = moment(holiday.date);
		return m.isoWeekday();
	});

	for (var i = 0; i <= range; i++) {
		var weekNum = startDate.add(i, 'days').isoWeekday();
		if (weekNum == 6 || weekNum == 7) {
			duration -= 1;
		} else if (_.include(holidayWeekNums, weekNum)) {
			duration -= 1;
		}
	}
	
	$("#absence_duration").val(duration);
	return true;
}

Template.absenceForm.events({
	'submit form': function(e, t) {
		e.preventDefault();

		if (validateStartAndEndDates()) {
			// Process form
			var startDate = t.find('#absence_start_date').value;
			var endDate = t.find('#absence_end_date').value;
			var reason = t.find('#absence_reason').value;
			var type = t.find('#absence_type').value;
			var duration = t.find('#absence_duration').value;

			var absenceId = Absences.insert({
				type: type,// Annual, Sick, Marriage, etc
				userId: Meteor.userId(),
				startDate: startDate,
				endDate: endDate,
				reason: reason,
				submittedAt: moment().format('MMMM Do YYYY, dddd, h:mm:ss a'),
				status: 'pending'// Pending, Approved, Rejected
			}, function(err) {
				if (err) {
					notifyError(err);
				} else {
					notifySuccess('Your application for absence is being processed.');
					Router.go('absenceIndex');
				}
			});
		} else {
			notifyError('Error! Something wrong with your start date and end date');
		}
	},
});

Template.absenceForm.helpers({
	absenceBalances: function() {
		return AbsenceBalances.find();
	},

	absenceTypes: function() {
		return ['annual', 'marriage', 'maternity', 'sick', 'hospitalization'];
	}
});

Template.absenceForm.rendered = function() {
	this.$('#absence_start_date').datepicker({
		format: "MM dd, yyyy",
		todayBtn: "linked",
		daysOfWeekDisabled: "0,6",
		calendarWeeks: true,
		todayHighlight: true
	});

	this.$('#absence_end_date').datepicker({
		format: "MM dd, yyyy",
		todayBtn: "linked",
		daysOfWeekDisabled: "0,6",
		calendarWeeks: true,
		todayHighlight: true
	}).on('hide', function(e){
        validateStartAndEndDates();
    });
}