Tracker.autorun(function() {
	if (Session.get('loading'))
		$('#overlay').show();

	if (!Session.get('loading'))
		$('#overlay').hide();
});