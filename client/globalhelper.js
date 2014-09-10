Handlebars.registerHelper('getUsernameById', function(uid) {
	var user = Meteor.users.findOne({_id: uid});
	if(!user.username){
		return user.profile.name;
	}
	return user.username;
});

// Handlebars.registerHelper('groupInfo', function() {
// 	var uid = Meteor.userId();
// 	var groupInfo = BelongGroups.findOne(
// 										{userId: uid}, 
// 										{userId: 0} //not select userID
// 									);
// 	return Groups.findOne({_id: groupInfo.groupId});
// });

Handlebars.registerHelper('formatDate', function(date) {
	var formattedDate = date.getFullYear()+"-"
											+ (date.getMonth()+1)+"-"
											+ date.getDate()+" "
											+ formatDigit(date.getHours())+":"
											+ formatDigit(date.getMinutes())+":"
											+ formatDigit(date.getSeconds());
	return formattedDate;
});

function formatDigit(num){
	var formatted = (num >= 10)? num : '0'+num;
	return formatted;
}