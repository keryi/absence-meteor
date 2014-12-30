function getHolidaysByYear(year) {
	var start = new Date(year, 0, 1);
	var end = new Date(year, 11, 31);
	return Holidays.find({ actualDate: { $gte: start, $lte: end } });
}

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