var validateStartAndEndDates = function() {
	var startDate = document.getElementById('absence_start_date').value;
	var endDate = document.getElementById('absence_end_date').value;
	startDate = moment(startDate, "MMMM DD, YYYY");
	endDate = moment(endDate, "MMMM DD, YYYY");

	if (endDate < startDate) {
		document.getElementById('absence_start_date').value = '';
		document.getElementById('absence_end_date').value = '';
		return false;
	}

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
			var startDate = moment(t.find('#absence_start_date').value, 'MMMM DD, YYYY').toDate();
			var endDate = moment(t.find('#absence_end_date').value, 'MMMM DD, YYYY').toDate();
			var reason = t.find('#absence_reason').value;
			var type = t.find('#absence_type').value;
			var duration = t.find('#absence_duration').value;
			var duration_type = 'full'; // default to full day absence
			if (t.find('#absence_duration_type_half_day').checked) {
				duration_type = 'half';
				endDate = startDate;
				duration = 0.5;
			}

			var absenceId = Absences.insert({
				type: type,// Annual, Sick, Marriage, etc
				userId: Meteor.userId(),
				startDate: startDate,
				endDate: endDate,
				duration_type: duration_type,
				duration: duration,
				reason: reason,
				submittedAt: moment().toDate(),
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

	"change [name='absence_duration']": function(e, t) {
		e.preventDefault();

		if (t.find('#absence_duration_type_full_day').checked) {
			document.getElementById('absence_end_date').value = '';
			document.getElementById('absence_end_date').disabled = false;
			document.getElementById('absence_duration').value = '';
		}

		if (t.find('#absence_duration_type_half_day').checked) {
			document.getElementById('absence_end_date').value =
				document.getElementById('absence_start_date').value;
			document.getElementById('absence_end_date').disabled = true;
			document.getElementById('absence_duration').value = 0.5;
		}
	}

});

Template.absenceForm.helpers({
	absenceBalances: function() {
		return AbsenceBalances.find();
	},

	absenceTypes: function() {
		return Object.keys(ABSENCE_DEFAULT_BALANCES);
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
        if (!validateStartAndEndDates()) {
        	notifyError('Error! Something wrong with your start date and end date');
        }
    });
}