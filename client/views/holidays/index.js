Template.holidayIndex.helpers({
	currentYearHolidays: function() {
		var currentYear = new Date().getFullYear();
		return getHolidaysByYear(currentYear);
	},

	nextYearHolidays: function() {
		var nextYear = new Date().getFullYear() + 1;
		return getHolidaysByYear(nextYear);
	},
});