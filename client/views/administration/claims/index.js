Template.adminClaimIndex.events({
	'click a.claim_approve': function(e, t) {
		var id = e.target.attributes['data-id'].value;

		Meteor.call('approveClaim', id, function(err) {
			if (err) {
				notifyError(err);
			}
		});
	},

	'click a.claim_reject': function(e, t) {
		var id = e.target.attributes['data-id'].value;

		Meteor.call('rejectClaim', id, function(err) {
			if (err) {
				notifyError(err);
			}
		});
	},
})