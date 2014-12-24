Template.adminHolidayIndex.helpers({
	holidays: function() {
		return Holidays.find();
	}
});

Template.adminHolidayIndex.events({
	'click #new-holiday-button': function(e, t) {
		$('#newHolidayModal').modal('show');
	},

	'click a.edit_holiday': function(e, t) {
		var holidayId = e.target.attributes['data-id'].value;

		var holiday = Holidays.findOne({ _id: holidayId });

		$('#edit_holiday_name').val(holiday.name);
		$('#edit_holiday_actual_date').val(formatDate(holiday.actualDate));
		$('#edit_holiday_replacement_date').val(formatDate(holiday.replacementDate));

		$('#edit_holiday_id').val(holidayId);

		$('#editHolidayModal').modal('show');
	},

	'click a.delete_holiday': function(e, t) {
		var holidayId = e.target.attributes['data-id'].value;

		if (confirm("Are you sure you want to remove this holiday?")) {
			Holidays.remove(holidayId);
			notifySuccess("A holiday has been removed successfully.");
		} 
	},

	'change #new-holiday-file': function(e, t) {
		var files = t.find('#new-holiday-file').files;
		Papa.parse(files[0], {
			header: true,
			skipEmptyLines: true,
			complete: function(result) {
				if (result.errors.length > 0) {
					for (var i = 0; i < result.errors.length; ++i) {
						notifyError(result.errors[i].message);
					}
				} else {
					for (var i = 0; i < result.data.length; ++i) {
						// check for year, if exists in database, warn!!!
						Holidays.insert({
							name: result.data[i]['name'],
							actualDate: moment(result.data[i]['actual'], 'DD/MM/YYYY').toDate(),
							replacementDate: result.data[i]['replacement'] === '' ?
								'' : moment(result.data[i]['replacement'], 'DD/MM/YYYY').toDate(),
							submittedAt: moment().toDate()
						});
					}
					notifySuccess('Holiday list has been imported successfully.');
				}
			}
		});
	},
});

Template.adminHolidayIndex.rendered = function() {
	this.$('#new_holiday_actual_date').datepicker({
		format: "MM dd, yyyy",
		todayBtn: "linked",
		calendarWeeks: true,
		todayHighlight: true
	});

	this.$('#new_holiday_replacement_date').datepicker({
		format: "MM dd, yyyy",
		todayBtn: "linked",
		daysOfWeekDisabled: "0,6",
		calendarWeeks: true,
		todayHighlight: true
	});

	this.$('#edit_holiday_actual_date').datepicker({
		format: "MM dd, yyyy",
		todayBtn: "linked",
		calendarWeeks: true,
		todayHighlight: true
	});

	this.$('#edit_holiday_replacement_date').datepicker({
		format: "MM dd, yyyy",
		todayBtn: "linked",
		daysOfWeekDisabled: "0,6",
		calendarWeeks: true,
		todayHighlight: true
	});
}