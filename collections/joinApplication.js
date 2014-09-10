JoinApplications = new Meteor.Collection("joinApplications");

var Schema = {};
Schema.JoinApplications = new SimpleSchema({
    fromId: {
        type: String,
        label: "applicant user id"
    },
    toId: {
        type: String,
        label: "group creator user id"
    },
    groupId: {
        type: String,
        label: "id of the group that user applys to join"
    },
    status: {
        type: String,
        label: "application status",
        allowedValues: ["pending","denied"]
    },
    date: {
        type: Date,
        label: "date the application is sent"
    }
});

JoinApplications.attachSchema(Schema.JoinApplications);


JoinApplications.allow({
    insert: function(userId) {
        return !! userId;
    },
    update: function(userId) {
        return !! userId;
    },
    remove: function(userId) {
        return !! userId;
    }
});


