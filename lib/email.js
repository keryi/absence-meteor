Meteor.methods({
	sendEmail: function(to, from, subject, html) {
		check([to], [Array]);
		check([from, subject, html], [String]);

		this.unblock();

		Email.send({
			to: to,
			from: from,
			subject: subject,
			html: html
		});
	}
});