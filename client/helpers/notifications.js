Notifications = new Meteor.Collection(null);

notifyError = function(message) {
	notify('danger', message);
}

notifyWarning = function(message) {
	notify('warning', message);
}

notifyInfo = function(message) {
	notify('info', message);
}

notifySuccess = function(message) {
	notify('success', message);
}

notify = function(type, message) {
	Notifications.insert({
		type: type,
		message: message
	});
}