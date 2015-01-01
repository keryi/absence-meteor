getHolidaysByYear = function (year) {
	var start = new Date(year, 0, 1);
	var end = new Date(year, 11, 31);
	return Holidays.find({ actualDate: { $gte: start, $lte: end } });
}