var formatDate = function(datetime) {
	if (moment(datetime).isValid()) {
		return moment(datetime).format('MMMM DD, YYYY');
	} else {
		return '';
	}
	
}

var formatDatetime = function(datetime) {
	return moment(datetime).format('MMMM Do YYYY, dddd, h:mm:ss a');
}

UI.registerHelper('formatDate', formatDate);
UI.registerHelper('formatDatetime', formatDatetime);