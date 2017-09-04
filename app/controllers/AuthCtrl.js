"use strict";
angular.module('myApp').controller("AuthCtrl", function($scope, $location, AuthFactory,$window) {
  $scope.auth = {};
  $scope.loggedIn = false;
  $scope.registerUser = function(registerNewUser) {
    AuthFactory.registerWithEmail(registerNewUser).then(function(didRegister) {
   		$(".progress").css("visibility","hidden");
     	$scope.logIn(registerNewUser);
     	$scope.$apply();
    });
  };

  $scope.logIn = function(loginNewUser){
    AuthFactory.authenticate(loginNewUser).then(function(didLogin){
      $scope.login = {};
      $scope.register = {};
      $location.path("/notes");
      $scope.$apply();
    });
  };
  
  $scope.loginGoogle = function(){
        AuthFactory.authWithProvider()
            .then(result => {
                let user = result.user.uid;
                $location.path('/notes');
                $(".progress").css("visibility","hidden");
                $scope.$apply();
            })
            .catch(error => console.log("google login error", error.message, error.code));
    };

  $scope.logoutUser = function(){
    AuthFactory.logout();
    $location.url('/home');
  };

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $scope.loggedIn = true;
      $(".progress").css("visibility","hidden");
      $scope.$apply();
    } else {
      $scope.loggedIn = false;
      $(".progress").css("visibility","hidden");
      $scope.$apply();
    }
  });

});