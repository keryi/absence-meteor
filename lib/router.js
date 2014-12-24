Router.configure({
	notFoundTemplate: 'notFound',
	waitOn: function() {
		return [
			Meteor.subscribe('absences'),
			Meteor.subscribe('holidays'),
			Meteor.subscribe('absence_balances'),
			Meteor.subscribe('roles'),
			Meteor.subscribe('users'),
			Meteor.subscribe('claims'),
			Meteor.subscribe('claim_attachments'),
		];
	},
	progressSpinner: false,
});

Router.map(function() {
	this.route('landingIndex', {
		path: '/',
		layoutTemplate: 'landingLayout',
		progress: false,
	});

	this.route('registerForm', {
		path: 'signup',
		layoutTemplate: 'landingLayout'
	});

	this.route('loginForm', {
		path: 'signin',
		layoutTemplate: 'landingLayout'
	});

	this.route('passwordRecovery', {
		path: 'recover',
		layoutTemplate: 'landingLayout'
	});

	this.route('passwordReset', {
		path: '/reset-password/:token',
		layoutTemplate: 'landingLayout'
	});

	this.route('absenceIndex', {
		path: 'absences',
		layoutTemplate: 'dashboardLayout',
		data: function() {
			return Absences.find({ userId: Meteor.user });
		}
	});

	this.route('absenceForm', {
		path: 'absences/apply',
		layoutTemplate: 'dashboardLayout',
		data: function() {
			return [
				Absences.find({ userId: Meteor.user }),
				AbsenceBalances.find(
					{
						userId: Meteor.user,
						year: moment().format('YYYY')
					})
			];
		}
	});

	this.route('absenceCalendar', {
		path: 'absences/calendar',
		layoutTemplate: 'dashboardLayout',
		data: function() {
			return Absences.find();
		}
	});

	this.route('holidayIndex', {
		path: 'holidays',
		layoutTemplate: 'dashboardLayout',
		data: function() {
			return Holidays.find({ year: moment().format('YYYY') });
		}
	});

	this.route('adminUserIndex', {
		path: 'admin/users',
		layoutTemplate: 'dashboardLayout'
	});

	this.route('adminHolidayIndex', {
		path: 'admin/holidays',
		layoutTemplate: 'dashboardLayout'
	});

	AdminAbsenceController = RouteController.extend({
		template: 'adminAbsenceIndex',
		increment: 10,
		limit: function() {
			return parseInt(this.params.limit) || this.increment;
		},
		status: function() {
			return this.params.status || 'pending';
		},
		findSelector: function() {
			if (this.params.status == 'all') {
				return {};
			}
			return { status: this.status() };
		},
		findOptions: function() {
			return { sort: { submittedAt: -1 }, limit: this.limit() };
		},
		data: function() {
			return { absences: Absences.find(this.findSelector(),
				this.findOptions()) };
		}
	});

	AdminClaimController = RouteController.extend({
		template: 'adminClaimIndex',
		increment: 10,
		limit: function() {
			return parseInt(this.params.limit) || this.increment;
		},
		status: function() {
			return this.params.status || 'pending';
		},
		findSelector: function() {
			if (this.params.status == 'all') {
				return {};
			}
			return { status: this.status() };
		},
		findOptions: function() {
			return { sort: { submittedAt: -1 }, limit: this.limit() };
		},
		data: function() {
			return { claims: Claims.find(this.findSelector(),
				this.findOptions()) };
		}
	})

	this.route('adminAbsenceIndex', {
		path: 'admin/absences/:status?',
		layoutTemplate: 'dashboardLayout',
		controller: AdminAbsenceController
	});

	this.route('claimIndex', {
		path: 'claims',
		layoutTemplate: 'dashboardLayout',
		data: function() {
			return Claims.find({ userId: Meteor.userId() });
		}
	});

	this.route('claimForm', {
		path: 'claims/new',
		layoutTemplate: 'dashboardLayout',
	});

	this.route('adminClaimIndex', {
		path: 'admin/claims/:status?',
		layoutTemplate: 'dashboardLayout',
		controller: AdminClaimController,
	});

	this.route('userProfile', {
		path: 'accounts/profile',
		layoutTemplate: 'dashboardLayout',
		data: function() {
			return {
				user: Meteor.user()
			};
		}
	});
});

var isAdmin = function(roleId) {
	return Roles.findOne({ _id: roleId }).name === 'admin';
}

var isApprover = function(roleId) {
	return Roles.findOne({ _id: roleId }).name === 'approver';
}

var rootPath = function() {
	if (isAdmin(Meteor.user().profile.roleId) ||
		isApprover(Meteor.user().profile.roleId)) {
		this.layout('dashboardLayout');
		this.render('adminAbsenceIndex');		
	} else {
		this.layout('dashboardLayout');
		this.render('absenceIndex');
	}
}

var requireSignin = function() {
	if (!Meteor.userId()) {
		if (Meteor.loggingIn()) {
			rootPath();
		} else {
			this.layout('landingLayout');
			this.render('landingIndex');
		}
	} else {
		this.next();
	}
}

Router.onBeforeAction(requireSignin);