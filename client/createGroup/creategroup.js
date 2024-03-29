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
		    description: t.find('textarea[name=groupDesc]').value || ''
		}
		group._id = Groups.insert(group, function(err, result){
			if(err){
				var errList = Groups.simpleSchema().namedContext().invalidKeys();
				Session.set("errList", errList);
				console.log(errList);
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
				console.log(err);
				var errList = Groups.simpleSchema().namedContext().invalidKeys();
				Session.set("errList", errList);
				console.log(errList);
				//todo: handle err
			}
			else{
				Router.go('dashboard', {_id: group._id});
			}
		});


		// set default group to this new created group
		Meteor.call('setDefaultGroup', uid, group._id,
                  function (err, msg){
                    if(err){
                      //handle error
                      console.log(err);
                    }
                  }); 

		return false;
	},

	'submit .joinGroupForm': function(e, t){
		e.preventDefault();
		var thisForm = $(this)[0];
		var today = new Date();
		var application = {
			fromId: Meteor.userId(),
			groupId: thisForm._id,
		    toId: thisForm.creator,
		    status: "pending",
		    date: today
		};

		JoinApplications.insert(application, function(err, result){
			if(err){
				var errList = JoinApplications.simpleSchema().namedContext().invalidKeys();
				ErminiNotify.add('Apply to join failed');
				// $.pnotify({
				//     title: "Apply to join failed",
				//     text: "",
				//     type: "error",
				//     history: false
				// });
				console.log(errList);
				//todo: handle err
			}
			else{
				ErminiNotify.add('Application Sent', 'You will join the group once your application is approved');
				// $.pnotify({
				//     title: "Application Sent",
				//     text: "You will join the group once your application is approved",
				//     type: "success",
				//     history: false
				// });
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


