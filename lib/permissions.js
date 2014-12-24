isAdmin = function(userId) {
	var role = Roles.findOne(
		{
			_id:  Meteor.users.findOne({ _id: userId }).profile.roleId
		});
	return role.name === 'admin' || role.name === 'approver';
}