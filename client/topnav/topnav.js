Template.topNav.helpers({
	systemNotice: function(){
		return JoinApplications.find({toId:Meteor.userId()});
	},

	joinedGroups: function(){
		return Groups.find({members: Meteor.userId()});
	}
});

Template.topNav.events({
	'click #logoutBtn': function(e, t){
		e.preventDefault();
		Meteor.logout();
		Router.go('/');
	},

	'submit #joinApprove': function(e, t){
		e.preventDefault();
		var today = new Date();
    var gid = t.find('input[name=groupId]').value
       ,uid = t.find('input[name=userId]').value
     ,msgid = t.find('input[name=msgId]').value;

		Groups.update( {_id: gid},    //insert user into the group
			{ $addToSet: {members: uid} }
		);

		var belong = {
			groupId: gid,
			userId: uid,
			dateJoined: today
		}
		BelongGroups.insert(belong, function(err, result){
			if(err){
				var errList = Groups.simpleSchema().namedContext().invalidKeys();
				//Session.set("errList", errList);
				console.log(errList);
				//todo: handle err
			}
			else{
				console.log("BelongGroups insert success");
				//Router.go('dashboard');
			}
		}); 

		JoinApplications.remove({_id: msgid}); //delete the join apply
	},

	'click #joinDeny': function(e, t){
		e.preventDefault();
		var msgid = t.find('input[name=msgId]').value;
		JoinApplications.remove({_id: msgid}); //delete the join apply
	}
})