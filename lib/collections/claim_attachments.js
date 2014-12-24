var store = new FS.Store.FileSystem("claim", {
	path: '~/uploads/claim'
});

ClaimAttachments = new FS.Collection("claim_attachments", {
	stores: [store]
});

ClaimAttachments.allow({
	insert: function(userId, doc) {
		return true;
	},

	update: function(userId, doc, fieldNames, modifier) {
		return true;
	}
});