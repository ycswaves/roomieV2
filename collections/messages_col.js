Messages = new Meteor.Collection("messages");

var Schema = {};

Schema.Messages = new SimpleSchema({
    fromId: {
        type: String,
        label: "from user id"
    },
    toId: {
        type: String,
        label: "to user id"
    },
    message: {
        type: String,
        label: "message content"
    },
    link: {
        type: String,
        label: "link",
        optional: true
    },
    isRead: {
        type: Boolean,
        label: "if the message is read or not"
    },
    date: {
        type: Date,
        label: "date the message is sent"
    }
});

Messages.attachSchema(Schema.Messages);

Messages.allow({
    insert: function(userId) {
        return !! userId;
    }
});