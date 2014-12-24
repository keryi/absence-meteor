Template.holidayNew.events({
	'submit form': function(e, t) {
		e.preventDefault();

		var name = t.find('#new_holiday_name').value;
		var actualDate = t.find('#new_holiday_actual_date').value;
		var replacementDate = t.find('#new_holiday_replacement_date').value;

		actualDate = moment(actualDate, 'MMMM DD, YYYY').toDate();
		replacementDate = moment(actualDate, 'MMMM DD, YYYY').toDate();
		/* Client side validation */

		if (name === '') {
			notifyError("Holiday's name can't be blank");
			return;
		}

		if (actualDate === '') {
			notifyError("Actual date for holiday can't be blank");
			return;
		}

		Holidays.insert({
			name: name,
			actualDate: actualDate,
			replacementDate: replacementDate,
			submittedAt: moment().toDate()
		}, function(err) {
			if (err) {
				notifyError(err);
			} else {
				$('#newHolidayModal').modal('hide');
			}
		});
	}
});