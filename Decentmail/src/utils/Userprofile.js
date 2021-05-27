import  React from 'react';
var UserProfile = (function() {
  var email = "";
  var u_address = "";
  var getEmail = function() {
    return email;    // Or pull this from cookie/localStorage
  };

  var setEmail = function(name) {
    email = name;     
    // Also set this in cookie/localStorage
  };
  var setAccount = function(address){
     u_address = address;
  }
  var getAccount = function(){
    return u_address;
  }

  return {
    getEmail: getEmail,
    setEmail: setEmail,
    getAccount:getAccount,
    setAccount:setAccount,
  }

})();

export default UserProfile;