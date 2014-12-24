UI.registerHelper('statusLabel', function(status) {
	if (status === 'pending') {
		return 'warning';
	} else if (status == 'approved') {
		return 'success';
	} else { // Rejected
		return 'danger';
	}
});