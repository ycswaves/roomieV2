Meteor.methods({
	updateBillItem: function(billId, oldVal, newVal, type){
		var updatedField = ('name' == type) ? 
			{ _id: billId, "details.itemName": oldVal}
		   :{ _id: billId, "details.itemPrice": oldVal*1};
		var setNewVal = ('name' == type) ? 
			 { "details.$.itemName": newVal}
		    :{ "details.$.itemPrice": newVal*1};                      
		Bills.update( updatedField,
			{ $set: setNewVal }, 
			function(err, result){
				if(err){
					var errList = Bills.simpleSchema().namedContext().invalidKeys();
					console.log(errList);
					//todo: handle err
				}
			}
		);
	},

	updateBillPayStatus: function(billId, payerId, newValue){
		Bills.update( { _id: billId, "notify.payerId": payerId},
      				  { $set: {"notify.$.hasPaid": newValue} }, 
      					function(err, result){
      						if(err){
								var errList = Bills.simpleSchema().namedContext().invalidKeys();
								console.log(errList);
								//todo: handle err
							}
      			 		}
      				);
	}
});