
Template.billItem.helpers({
	totalAmount: function(itemArr, divideBy){
		var total = 0;
		for(var i=0; i<itemArr.length; i++){
			total += itemArr[i].itemPrice;
		}
		if(divideBy % 1 === 0 && divideBy != 0){
			return (total/divideBy).toFixed(2);
		}
		return total.toFixed(2);
	},

	isOwner: function(billId){
		var author = Bills.find({_id: billId},{author: 1}).fetch()[0].author;
		return ( author === Meteor.userId() );
	},

	showPayers: function(payerList){
		var payerIds = [];
  	for(var i=0; i<payerList.length; i++){
  		var user = Meteor.users.findOne({_id: payerList[i].payerId});
			if(!user.username){
				payerIds[i] = user.profile.name;
			} else {
				payerIds[i] = user.username;
			}
  	}
  	return payerIds.join(', ');
	},
});



/* x-edtibles  */
Template.billItem.rendered = function (){
	var billId = $(this.find('div.panel')).attr('data');

	// edit title
  $(this.find('#titleEdit.editable:not(.editable-click)')).editable('destroy').editable({
    validate: function(val){
      if($.trim(val) == ''){
        return 'This field is required';
      }
    },
    success: function(response, newValue) {
      Bills.update( { _id: billId },
      							{ $set: {title: newValue} }, 
      							function(err, result){
      								if(err){
												var errList = Bills.simpleSchema().namedContext().invalidKeys();
												console.log(errList);
												//todo: handle err
											}
      							}
      						);
      editSuccessNotice();
		}
	});

  //edit item name
  $(this.findAll('.itemNameEdit.editable:not(.editable-click)')).editable('destroy').editable({
    validate: function(val){
      if($.trim(val) == ''){
        return 'This field is required.';
      }
    },
    success: function(response, newValue) {
    	var oldVal = $(this).attr('data-oldvalue');
    	updateBillItem(billId, oldVal, newValue, 'name');       
    }
  });

  //edit item price
  $(this.findAll('.itemPriceEdit.editable:not(.editable-click)')).editable('destroy').editable({
    validate: function(val){
      if($.trim(val) == ''){
        return 'This field is required.';
      }
    },
    success: function(response, newValue) {
      var oldVal = $(this).attr('data-oldvalue');
    	updateBillItem(billId, oldVal, newValue, 'price');      
    }
  });

  // edit payer status
  $(this.findAll('.payStatusEdit.editable:not(.editable-click)')).editable('destroy').editable({
    validate: function(val){
      if($.trim(val) == ''){
        return 'This field is required.';
      }
    },
	  success: function(response, newValue) {
	    var payerId = $(this).attr('data-payerid');
	    var status = (newValue === "true");
	    console.log(newValue);
	    console.log(payerId+" "+status);
	    Meteor.call('updateBillPayStatus',billId, payerId, status, 
								function (err, msg){
									if(err){
										//handle error
										console.log(err+msg);
									}
									else{
										editSuccessNotice();
									}
								});            
    }
  });

  // edit toggle 
  $(this.findAll('.editable')).editable('disable');
}

Template.billItem.events({
  'click #table-edit': function(e,templ){
    $(templ.findAll('.editable')).editable('toggleDisabled');
  }
});

Template.billPage.events({
	'click #addBillBtn': function(e, t){
		$('#billToggle').toggle();
	}
});

Template.newBill.events({
	'click #addItemBtn': function(e, t){
		e.preventDefault();
		var newItemInput = 
		 '<div class="form-group">'
		  +'<label class="col-sm-2 control-label">Item</label>'
		  +'<div class="col-sm-5">'
		    +'<input type="text" class="form-control input-sm" name="itemName" placeholder="Item name">'
		  +'</div>'
		  +'<div class="input-group col-md-2" style="max-width:120px; margin-left:15px">'
				+'<span class="input-group-addon input-sm">$</span>'
				+'<input type="text" name="itemPrice" class="form-control input-sm">'
			+'</div>'
		+'</div>';
		$('#inputOnlyDiv').append(newItemInput);
	},
	'click #removeItemBtn': function(e, t){
		e.preventDefault();
		var itemCount = t.findAll('input[name=itemName]').length;
		if(itemCount > 1){
			$('#inputOnlyDiv .form-group:last-child').remove();
		}
	},

	'submit #newBillForm': function(e, t){
		e.preventDefault();
		var today = new Date();
		var uid = Meteor.userId();
		var billTitle = t.find('input[name=title]').value;
		// var billDue = t.find('input[name=dueDate]').value;
		var billDue = '';

		var itemNames = t.findAll('input[name=itemName]');
		var itemPrices = t.findAll('input[name=itemPrice]');
		var billDetails = [];
		for(var i=0; i<itemNames.length; i++) {
			var item = {
				itemName: itemNames[i].value,
				itemPrice: itemPrices[i].value
			};
      billDetails.push(item);
    }
    var payers = t.findAll('input[name=members]:checked');
		var payerList = [];
		var payerIDList = []; // for sending email later
		for(var i=0; i<payers.length; i++) {
			payerIDList[i] = payers[i].value;
			var payer = {
				payerId: payers[i].value,
				hasPaid: false
			};
      payerList.push(payer);
    }

    bill = {
    	groupId: Session.get('currentGroup'),
    	author: uid,
    	title: billTitle,
    	details: billDetails,
    	dueDate: billDue,
    	notify: payerList,
    	addedAt: today
    }

    Bills.insert(bill, function(err, result){
			if(err){
				var errList = Bills.simpleSchema().namedContext().invalidKeys();
				Session.set("errList", errList);
				console.log(errList);
				//todo: handle err
			}
			else{
				//console.log('bill insert success');
				$('#newBillForm')[0].reset();
				$('#billToggle').hide();
				var mailList = getUserEmail(payerIDList);
				var content = 'Here is the summary of the bill: <br>'
											+'<h2>'+billTitle+'</h2>'
											+'<table style="font-size:1.75em">';
				for (var i = 0; i < billDetails.length; i++){
					content += '<tr>'
											+'<td>'+billDetails[i].itemName+':&nbsp</td>'
											+'<td>$'+billDetails[i].itemPrice+'</td>'
										+'<tr>';
				}
				content += '</table><br>'+today+'<br>';
				content += 'For more details, please click <a href="http://roomie.meteor.com">here</a>' 
				Meteor.call('sendEmail',
										 mailList, //to
										'noreply@roomie.meteor.com',//from
										'You have a new bill',//subject
										 content, //content'
									function (err, msg){
                    if(err){
                      //handle error
                      console.log(err);
                    }else{
                    	console.log('email sent');
                    }
                  }
				);
			}
		});
	}

});

function editSuccessNotice(){
	$.pnotify({
    //title: 'Changes Saved!',
    text: 'Changes Saved!',
    type: 'success',
    history: false
  });  
}

function updateBillItem(billId, oldVal, newValue, type){
	Meteor.call('updateBillItem',billId, oldVal, newValue, type, 
    							function (err, msg){
    								if(err){
    									//handle error
    									console.log(err);
    								}
    								else{
    									editSuccessNotice();
    								}
    							});     
}

function getUserEmail (uidArr) {
    var users = Meteor.users.find({_id: {$in: uidArr}}).fetch();
    mailList = [];
    for (var i = 0; i < users.length; i++) {
      if(users[i].emails){
        mailList.push(users[i].emails[0].address);
      } else if (users[i].services.facebook){
        mailList.push(users[i].services.facebook.email);
      } else if (users[i].services.google){
        mailList.push(users[i].services.google.email);
      }
    };
    return mailList;   
}