Template.dashboardLayout.events({
	'click li.sidebar-item a': function(e) {
		var nodes = document.querySelectorAll(".sidebar-item");
		for (var i = nodes.length - 1; i >= 0; i--) {
			if (nodes[i].className.indexOf('sidebar-action') > -1) {
				continue;
			}
			nodes[i].className = "sidebar-item";
		}
		$(e.target).parent().addClass("active");
	},

	'click #menu-toggle': function(e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
	},

	'click #signout': function(e) {
		e.preventDefault();
		Meteor.logout(function(err) {
			if (err) {
				notifyError("Failed to logout");
			} else {
				Router.go('landingIndex');
			}
		});
	}
});

var isRole = function(roleName) {
	var roleId = Meteor.user().profile.roleId;
	var role = Roles.findOne({ _id: roleId });
	return role.name === roleName;
}

UI.registerHelper('isAdmin', function() {
	return isRole('admin');
});

UI.registerHelper('isApprover', function() {
	return isRole('approver');
});
