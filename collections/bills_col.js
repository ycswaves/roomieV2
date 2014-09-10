Bills = new Meteor.Collection("bills");

var Schemas = {};

Schemas.BillDetailSchema = new SimpleSchema({
    itemName: {
        type: String,
    },
    itemPrice: {
        type: Number,
        decimal: true
    }
});

Schemas.BillNotifySchema = new SimpleSchema({
    payerId: {
        type: String,
    },
    hasPaid: {
        type: Boolean,
    }
});

Schemas.Bills = new SimpleSchema({
    groupId: {
        type: String,
        label: "id of the group that this bill goes to"
    },
    author: {
        type: String,
        label: "name of the author"
    },
    title: {
        type: String,
        label: "title of the bill"
    },
    details: {
        type: [Schemas.BillDetailSchema],
        label: "detail items of the bill"
    },
    dueDate: {
        type: String,
        label: "due date of the bill",
        optional: true
    },
    notify: {
        type: [Schemas.BillNotifySchema],
        label: "people to notify and their status"
    },
    addedAt: {
        type: Date,
        label: "date the bill is issued"
    }
});

Bills.attachSchema(Schemas.Bills);

Bills.allow({
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