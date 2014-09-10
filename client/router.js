Router.configure({
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading',
  layoutTemplate: 'layout'
});

var filters = {
  isLoggedIn: function() {
    if (!(Meteor.loggingIn() || Meteor.user())) {
      Router.go('home');
      pause(); 
    }
  }
}

Router.onBeforeAction(filters.isLoggedIn, {except: ['home','signup']});


Router.map(function () {
  this.route('home',{
  	path: '/',
  	template: 'loginForm'
  });

  this.route('signup',{
  	path: '/signup',
  	template: 'signupForm'
  });

  this.route('creategroup',{
    path: '/creategroup',
    template: 'createGroup'
  });

  this.route('dashboard',{
  	path: '/dashboard/:_id',
  	template: 'billPage',
    waitOn: function () {
      return Meteor.subscribe('bills');
    },
    action: function () {
      if (this.ready()){
        this.render();
      }
      else{
        this.render('loading');
      }
    },
    data: function () {
      var groupId = (this.params._id == '')? 
            Meteor.user().defaultGroup : this.params._id;
      if (groupId == '') {
        this.redirect('creategroup');
      };
      Session.set('currentGroup', groupId);
      templateData = { 
        bills: Bills.find({groupId: groupId},{sort: {addedAt: -1}}),
        groupInfo: Groups.findOne({_id:groupId}) 
      };
      return templateData;
    }
  });
  // matches all urls but doesn't get called until all previous routes have been tested
  // so in this case for invalid url
  this.route('notFound', {path: '*'});
});