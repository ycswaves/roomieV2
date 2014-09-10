Template.createGroup.events({
	'submit #createGroupForm': function(e, t){
		e.preventDefault();
		var today = new Date();
		var uid = Meteor.userId();
		var memberList = new Array();
		memberList.push(uid);
		var group = {
			groupName: t.find('input[name=groupName]').value,
		  creator: uid,
		  members: memberList,
		  createdAt: today,
		  description: ""
		}
		group._id = Groups.insert(group, function(err, result){
			if(err){
				var errList = Groups.simpleSchema().namedContext().invalidKeys();
				Session.set("errList", errList);
				//console.log(errList);
				//todo: handle err
			}
		});

		var belong = {
			groupId: group._id,
			userId: uid,
			dateJoined: today
		}
		BelongGroups.insert(belong, function(err, result){
			if(err){
				var errList = Groups.simpleSchema().namedContext().invalidKeys();
				Session.set("errList", errList);
				//console.log(errList);
				//todo: handle err
			}
			else{
				Router.go('dashboard');
			}
		});
		return false;
	},

	'submit #joinGroupForm': function(e, t){
		e.preventDefault();
		var today = new Date();
		var application = {
			fromId: Meteor.userId(),
			groupId: t.find('input[name=groupId]').value,
		  toId: t.find('input[name=creatorId]').value,
		  status: "pending",
		  date: today
		};

		JoinApplications.insert(application, function(err, result){
			if(err){
				var errList = JoinApplications.simpleSchema().namedContext().invalidKeys();
				$.pnotify({
				    title: "Apply to join failed",
				    text: "",
				    type: "error",
				    history: false
				});
				console.log(errList);
				//todo: handle err
			}
			else{
				$.pnotify({
				    title: "Application Sent",
				    text: "You will join the group once your application is approved",
				    type: "success",
				    history: false
				});
				console.log('success');
			}
		});
		return false;
	}
});

Template.createGroup.helpers({
	formStatus: function(){
		return Session.get("errList");
	},
	groupList: function(){
		return Groups.find();
	},
	isMember: function(uid, memberList){
		return (memberList.indexOf(uid) != -1);
	}
});


