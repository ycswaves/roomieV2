//publish function first Params is used by subscription
Meteor.publish('userData', function () {
	if(!Meteor.users) return;
    return Meteor.users.find();
});

Meteor.publish('bills', function(){
	return Bills.find();
});

Meteor.publish('belongGroups', function(){
	return BelongGroups.find();
});

Meteor.publish('groups', function(){
	return Groups.find();
});

Meteor.publish('joinApplications', function(){
	return JoinApplications.find();
});