import  React from 'react';
var UserProfile = (function() {
  var email = "";
  var u_address = "";
  var login = false;
  var getEmail = function() {
    return email;    // Or pull this from cookie/localStorage
  };

  var setEmail = function(name) {
    email = name;     
    // Also set this in cookie/localStorage
  };
  var setAccount = function(address){
     u_address = address;
  };
  var getAccount = function(){
    return u_address;
  };

  var setLogin = function(value){
    login = value;
 };
 var getLogin= function(){
   return login;
 };

  
  return {
    getEmail: getEmail,
    setEmail: setEmail,
    getAccount:getAccount,
    setAccount:setAccount,
    setLogin:setLogin,
    getLogin:getLogin,
  }

})();

export default UserProfile;