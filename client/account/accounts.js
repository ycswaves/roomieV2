// Validators, helpers
//

// Trim Input
function trimInput(val) {
  return val.replace(/^\s*|\s*$/g, "");
}

// Validations
function isEmail(val, field) {
  if (val.indexOf('@') !== -1) {
      return true;
    } else {
      Session.set('displayMessage', 'Error & Please enter a valid email address.');
      return false;
    }
}

function isValidPassword(val, field) {
  if (val.length >= 6) {
    return true;
  } else {
    Session.set('displayMessage', 'Error & Your password should be 6 characters or longer.');
    return false;
  }
}

function isNotEmpty(val, field) {
  // if null or empty, return false
  if (!val || val === ''){
    Session.set('displayMessage', 'Error & Please fill in all required fields.');
    return false;
  }
  return true;
}

function isSame(val1, val2) {
  // if not the same the passwords
  if(val1 !== val2 ){
    Session.set('displayMessage', 'Error & Your passwords are not the same');
    return false;
  }
  return true;
}

function isValidName(val){
  userRegex = /^[-\w\.\$@\*\!]{1,30}$/;
  if(!val.match(userRegex)){
    Session.set('displayMessage', 'Error & invalid username');
    return false;
  }
  return true;
}

function getDefaultGroup(uid){
  if (Meteor.user().defaultGroup == undefined) {
    Meteor.call('updateDefaultGroup', uid, 
                  function (err, msg){
                    if(err){
                      //handle error
                      console.log(err);
                    }
                  });     
    return false;
  } else if (Meteor.user().defaultGroup == ''){
    return false;
  } else {
    return Meteor.user().defaultGroup;
  }
}

function loginSuccess(){
  var defaultGroup = getDefaultGroup(Meteor.userId());
  if (!!defaultGroup){
    console.log(defaultGroup);
    Router.go('dashboard',{_id:defaultGroup});
  } else {
    Router.go('/creategroup');
  }
}

// Login Form Helpers
Template.loginForm.helpers({
  loginStatus: function(){
    return Session.get('displayMessage');
  }
});


// Login Form Events
Template.loginForm.events({

  'submit #login-form' : function(e, t) {
    e.preventDefault();
    var username = trimInput(t.find('input[name=username]').value.toLowerCase())
      , password = t.find('input[name=password]').value;

    if (isNotEmpty(username, 'loginError')
        && isNotEmpty(password, 'loginError'))
    {
      Meteor.loginWithPassword(username, password, function(err){
        if (err && err.error === 403) {
          Session.set('displayMessage', 'Login Error: username or password is not correct.');
        } else {
          loginSuccess();
        }
      });
    }
    return false;
  },

  'click #forgot-password' : function(e, t) {
    Session.set('formView', 'passwordRecoveryForm');
  },

  'click #create-account' : function(e, t) {
    Session.set('formView', 'createAccountForm');
  },

  'click #facebookLogin' : function(e, t){
    e.preventDefault();
    Meteor.loginWithFacebook(function(err){
      if (err && err.error === 403) {
          Session.set('displayMessage', 'Login Error: username or password is not correct.');
      } else {
          loginSuccess();
      }
    });
  },

  // 'click #twitterLogin' : function(e, t){
  //   e.preventDefault();
  //   Meteor.loginWithTwitter(function(err){
  //     if (err && err.error === 403) {
  //         Session.set('displayMessage', 'Login Error: username or password is not correct.');
  //     } else {
  //       loginSuccess();
  //     }
  //   });
  // },

  'click #googleLogin' : function(e, t){
    e.preventDefault();
    Meteor.loginWithGoogle(function(err){
      if (err && err.error === 403) {
          Session.set('displayMessage', 'Login Error: username or password is not correct.');
      } else {
        console.log(hasGroup(Meteor.userId()));
        if (hasGroup(Meteor.userId())){
            Router.go('/dashboard');
          } else {
            Router.go('/creategroup');
          }
      }
    });
  }

});



// Create an account and login the user.
Template.signupForm.events({
  'submit #signupForm' : function(e, t) {
    e.preventDefault();
    var email = trimInput(t.find('input[name=email]').value.toLowerCase())
      , password = t.find('input[name=password]').value
      , password2 = t.find('input[name=passwordAgain]').value
      , username = t.find('input[name=username]').value;

    if (isNotEmpty(email, 'accountError')
        && isNotEmpty(password, 'accountError')
        && isEmail(email, 'accountError')
        && isValidPassword(password, 'accountError')
        && isSame(password,password2)
        && isNotEmpty(username,'accountError')
        && isValidName(username))
    {
      Accounts.createUser({username: username, email: email, password: password}, function(err){
        if (err && err.error === 403) {
          Session.set('displayMessage', 'Account Creation Error &' + err.reason);
        } else {
          Router.go('creategroup');
        }
      });
    }
    return false;
  }

});

Template.signupForm.helpers({
  signupStatus: function(){
    return Session.get('displayMessage');
  }
})
