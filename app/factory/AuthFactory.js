"use strict";
angular.module('myApp').factory("AuthFactory", function($q, $http, $rootScope, firebaseInfo) {
  let currentUserData = null;
//Firebase: Determine if user is authenticated.
  let isAuthenticated = () => {
      return firebase.auth().currentUser ? true : false;
  };

//Firebase: Return email, UID for user that is currently logged in.
  let getUser = () => {
    return firebase.auth().currentUser;
  };

// Kills browser cookie with firebase credentials
  let logout = () => {
    $(".progress").css("visibility","visible");
    return firebase.auth().signOut();
  };

//Firebase: Use input credentials to authenticate user.
  let authenticate = (credentials) => {
    return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password);
  };

//Firebase: Register a new user with email and password
  let registerWithEmail = (user) => {
    $(".progress").css("visibility","visible");
    return firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
  };

  const provider = new firebase.auth.GoogleAuthProvider();
  const authWithProvider = function(){
        $(".progress").css("visibility","visible");
        return firebase.auth().signInWithPopup(provider);
    };

  return {isAuthenticated, getUser, logout, registerWithEmail, authenticate,authWithProvider};
});