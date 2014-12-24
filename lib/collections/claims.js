Claims = new Meteor.Collection('claims');

Claims.allow({
	insert: function(userId, doc) {
		return true;
	},

	update: function(userId, doc, fieldNames, modifier) {
		return isAdmin(userId);
	}
});

Meteor.methods({
	approveClaim: function(claimId) {
		Claims.update({ _id: claimId }, { $set: {
			status: 'approved'
		}}, function(err) {
			if (err) {
				throw err;
			}
		});
	},

	rejectClaim: function(claimId) {
		Claims.update({ _id: claimId }, { $set: {
			status: 'rejected'
		}}, function(err) {
			if (err) {
				throw err;
			}
		});
	}
})