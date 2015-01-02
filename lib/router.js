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
		path: 'absences/year/:year?',
		layoutTemplate: 'dashboardLayout',
		data: function() {
			var year = this.params.year || new Date().getFullYear();
			var start = new Date(year, 0, 1);
			var end = new Date(year, 11, 31);
			return {
				absences: Absences.find(
				{
					userId: Meteor.userId(),
					startDate: { $gte: start, $lte: end }
				})
			};
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
	});

	AdminAbsenceBalanceController = RouteController.extend({
		template: 'adminAbsenceBalanceIndex',
		increment: 10,
		limit: function() {
			return parseInt(this.params.limit) || this.increment;
		},
		type: function() {
			return this.params.type || 'annual';
		},
		findSelector: function() {
			if (this.params.type == 'all') {
				return {};
			}
			return { type: this.type(), year: new Date().getFullYear() };
		},
		findOptions: function() {
			return { sort: { submittedAt: -1 }, limit: this.limit() };
		},
		data: function() {
			return { absenceBalances: AbsenceBalances.find(this.findSelector(),
				this.findOptions()) };
		}
	});

	this.route('adminAbsenceIndex', {
		path: 'admin/absences/:status?',
		layoutTemplate: 'dashboardLayout',
		controller: AdminAbsenceController
	});

	this.route('adminAbsenceBalanceIndex', {
		path: 'admin/absencebalances/:type?',
		layoutTemplate: 'dashboardLayout',
		controller: AdminAbsenceBalanceController
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

var requireSignin = function() {
	if (!Meteor.user()) {
		this.layout('landingLayout');
		this.render('landingIndex');
	} else {
		this.next();
	}
}

var requireAdmin = function() {
	if (!isAdmin(Meteor.user().profile.roleId) &&
		!isApprover(Meteor.user().profile.roleId)) {
		this.layout('landingLayout');
		this.render('notFound');
	} else {
		this.next();
	}
}

function pathAfterSigninOrSignup() {
	if (!Meteor.user()) {
		this.next();
	} else {
		if (isAdmin(Meteor.user().profile.roleId) ||
			isApprover(Meteor.user().profile.roleId)) {
			this.layout('dashboardLayout');
			this.render('adminAbsenceIndex');
		} else {
			var currentYear = new Date().getFullYear();
			this.layout('dashboardLayout');
			this.render('absenceIndex', {
				data: function() {
					var year = new Date().getFullYear();
					var start = new Date(year, 0, 1);
					var end = new Date(year, 11, 31);
					return {
						absences: Absences.find(
						{
							userId: Meteor.userId(),
							startDate: { $gte: start, $lte: end }
						})
					};
				}
			});
		}
	}
}

Router.onBeforeAction(requireSignin, {
	except: ['landingIndex', 'registerForm', 'loginForm',
		'passwordReset', 'passwordRecovery'],
});

Router.onBeforeAction(requireAdmin, {
	only: ['adminUserIndex', 'adminHolidayIndex', 'adminAbsenceIndex',
		'adminClaimIndex', 'adminAbsenceBalanceIndex'],
})

Router.onBeforeAction(pathAfterSigninOrSignup, {
	only: ['landingIndex'],
});
