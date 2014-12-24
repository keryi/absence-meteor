Template.holidayEdit.events({
	'submit form': function(e, t) {
		e.preventDefault();

		var id = t.find('#edit_holiday_id').value;
		var name = t.find('#edit_holiday_name').value;
		var actualDate = t.find('#edit_holiday_actual_date').value;
		var replacementDate = t.find('#edit_holiday_replacement_date').value;

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

		Holidays.update({ _id: id }, { $set: {
			name: name,
			actualDate: actualDate,
			replacementDate: replacementDate,
			submittedAt: moment().toDate()
		}}, function(err) {
			if (err) {
				notifyError(err);
			} else {
				$('#editHolidayModal').modal('hide');
			}
		});
	}
});