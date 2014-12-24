Template.claimForm.helpers({
	claimTypes: function() {
		return [ 'fuel', 'toll', 'medical', 'communication', 'accessories',
				'utilities', 'project', 'others' ];
	},

	thisMonthClaims: function() {
		var d = new Date();
		var start = new Date(d.getFullYear(), d.getMonth(), 1);
		var end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
		return Claims.find({ userId: Meteor.userId(), date: { $gte: start, $lt: end } });
	}
});

Template.claimForm.events({
	'change #claim_type': function(e, t) {
		var selectedValue = $(e.target).find(':selected').text();

		if (selectedValue === 'others') {
			$('#claim_description_label').show();
			$('#claim_description').show();
		} else {
			$('#claim_description_label').hide();
			$('#claim_description').hide();
		}
	},

	'submit form': function(e, t) {
		e.preventDefault();

		var files = t.find('#claim_attachments').files;
		var fileObjs = [];
		for (var i = 0; i < files.length; i++) {
			// console.log(files[i].name);
			fileObjs[i] = ClaimAttachments.insert(files[i]);
		}

		var claim = {
			userId: Meteor.userId(),
			type: t.find('#claim_type').value,
			description: t.find('#claim_description').value,
			date: moment(t.find('#claim_date').value, 'MMMM DD, YYYY').toDate(),
			amount: t.find('#claim_amount').value, // to float
			remark: t.find('#claim_remark').value,
			status: 'pending',
			submittedAt: new Date(),
			attachments: fileObjs,
		}

		// Validation
		// - check description not blank if type is specified as 'others'
		// - check claim amount > 0

		Claims.insert(claim, function(err) {
			if (err)
				notifyError(err);
			else
				notifySuccess('Your claim has been submitted');
		});
	},
});

Template.claimForm.rendered = function() {
	$('#claim_description_label').hide();
	$('#claim_description').hide();

	this.$('#claim_date').datepicker({
		format: "MM dd, yyyy",
		todayBtn: "linked",
		calendarWeeks: true,
		todayHighlight: true
	});
}