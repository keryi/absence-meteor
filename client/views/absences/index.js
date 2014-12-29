Template.absenceIndex.helpers({
	absences: function() {
		var currentYear = new Date().getFullYear();
		var start = new Date(currentYear, 0, 1);
		var end = new Date(currentYear + 1, 11, 31);
		return Absences.find({ startDate: { $gte: start, $lte: end } });
	}
});