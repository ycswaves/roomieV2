//publish function first Params is used by subscription
Meteor.publish('userData', function () {
	if(!Meteor.users) return;
    return Meteor.users.find();
});

Meteor.publish('bills', function(){
	if(!Bills) return;
	return Bills.find();
});

Meteor.publish('belongGroups', function(){
	if(!BelongGroups) return;
	return BelongGroups.find();
});

Meteor.publish('groups', function(){
	if(!Groups) return;
	return Groups.find();
});

Meteor.publish('joinApplications', function(){
	if(!JoinApplications) return;
	return JoinApplications.find();
});