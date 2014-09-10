// group(s) a user belongs to
BelongGroups = new Meteor.Collection("belongGroups");

var Schema = {};

Schema.BelongGroups = new SimpleSchema({
    groupId: {
        type: String,
        label: "group id"
    },
    userId: {
        type: String,
        label: "user id",
        unique: true
    },
    dateJoined: {
        type: Date,
        label: "date the user joined this group"
    }
})

BelongGroups.attachSchema(Schema.BelongGroups);


BelongGroups.allow({
    insert: function(userId) {
        return !! userId;
    },
    update: function(userId) {
        return !! userId;
    }
});