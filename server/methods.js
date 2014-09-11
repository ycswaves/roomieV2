Meteor.methods({
  sendEmail: function (to, from, subject, html) {
    check(to, Match.OneOf(String, [String]));
    check([from, subject, html], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      html: html
    });
  },

  defDefaultGroupAttr: function (uid) {
    Meteor.users.update({_id:uid},{$set:{defaultGroup:''}});
  },

  setDefaultGroup: function (uid, gid) {
    Meteor.users.update({_id:uid},{$set:{defaultGroup: gid}});
  }

});