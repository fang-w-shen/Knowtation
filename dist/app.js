(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
angular.module('myApp', ['ngRoute']);

angular.module('myApp').config(function ($routeProvider) {
    let isAuth = (AuthFactory,$location,$route) => {
        return new Promise((resolve,reject)=>{
            let truth = AuthFactory.isAuthenticated();
            if (truth){
                resolve();
            } else {

            $location.url("/home");
                
            }
        });
    };

    $routeProvider
        .when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'AuthCtrl'
        }).when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'AuthCtrl'
        }).when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'AuthCtrl'
        }).when('/notes', {
            templateUrl: 'partials/notelist.html',
            controller: "NoteCtrl"
        }).when('/notes/:notetask/edit', {
            templateUrl: 'partials/edit.html',
            controller: "EditCtrl",
            resolve: {isAuth}
        }).when('/new', {
            templateUrl: 'partials/new.html',
            controller: 'addNote',
            resolve: {isAuth}
        })
        .otherwise('/home');
}).run(function(firebaseInfo) {
  firebase.initializeApp(firebaseInfo);
});
},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
"use strict";
angular.module('myApp').controller("EditCtrl", function($q,$http,$scope,$route, NotesFactory,$window, $location, firebaseInfo,AuthFactory,$routeParams){

  let key = $routeParams.notetask;
  console.log("what is my DAMN KEY",key);
  function showNote() {
      $q( (resolve, reject) => {
            $http.get(`${firebaseInfo.databaseURL}/notes/${key}.json`)
            .then((itemObject) => {
              $scope.note = [];
                $scope.note.push(itemObject.data);
                resolve($scope.note);
                })
                .catch((error) => {
                    reject(error);
                });
            }).then((singlenote)=>{

                $scope.note= singlenote;
                $(".progress").css("visibility","hidden");
            });
  }
  showNote();


  $scope.editNote = function(note) {
    NotesFactory.editNote(key,note).then(()=>{
      $location.url("/notes");
      $(".progress").css("visibility","hidden");
    });
    
  };

});
},{}],4:[function(require,module,exports){
"use strict";
angular.module('myApp').controller("addNote", function($scope, NotesFactory, $location, AuthFactory){

  $scope.title = "Add Note";
  $scope.submitButtonText = "Add New Note";
  let user = firebase.auth().currentUser;
  $scope.note = {
    "description": '',
    task: "",
    uid: user.uid,
    email: user.email,
    time:timeStamp()
  };

  $scope.addNote = function(note){
    
    NotesFactory.addNote(note)
    .then((data) => {
      $location.url("/notes");
    });
  };

  function timeStamp() {
  // Create a date object with the current time
    var now = new Date();

  // Create an array with the current month, day and time
    var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];

  // Create an array with the current hour, minute and second
    var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];

  // Determine AM or PM suffix based on the hour
    var suffix = ( time[0] < 12 ) ? "AM" : "PM";

  // Convert hour from military time
    time[0] = ( time[0] < 12 ) ? time[0] : time[0];

  // If hour is 0, set it to 12
    time[0] = time[0] || 12;

  // If seconds and minutes are less than 10, add a zero
    for ( var i = 0; i < 3; i++ ) {
      if ( time[i] < 10 ) {
        time[i] = "0" + ""+time[i];
      }
    }

  // Return the formatted string
    return date.join("/") + " " + time.join(":") + " " + suffix;
  }

});
},{}],5:[function(require,module,exports){
"use strict";
angular.module('myApp').controller("NoteCtrl", function($q,$http,$scope,$route, NotesFactory,$window, $location, firebaseInfo,AuthFactory,$routeParams){
  let userId = firebase.auth().currentUser.uid;
  $scope.title = "Notes";


  $scope.showNotes = function(){
    $(".progress").css("visibility","visible");
    NotesFactory.fetchFirebase(userId)
    .then((data) => {
      if (Object.keys(data).length === 0) {
        $(".addingnewnote").css("visibility","visible");
      }else {
        $(".addingnewnote").css("visibility","hidden");
      }
      $scope.notes=[];
      $scope.notes.push(data);
      let keys = Object.keys($scope.notes[0]);
      keys.forEach((item)=>{
        $scope.notes[0][item].key = item;
      });
      $scope.notes= Object.values($scope.notes[0]);
      $(".progress").css("visibility","hidden");  
    });
  };

  $scope.deleteNote = function(id){
    $(".progress").css("visibility","visible");
    NotesFactory.deleteNote(id)
    .then((data) => {
      $route.reload();
    });
  };

  $scope.showEditNote = function(key){
    
    $(".progress").css("visibility","visible");
    $location.url("/notes/"+$routeParams.notetask+"/edit");
 

  };



  $scope.showNotes();
});
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
"use strict";
angular.module('myApp').factory("NotesFactory", function($q, $http, firebaseInfo){

    const fetchFirebase = function(user){
        let notes = [];
        return $q( (resolve, reject) => {
            $http.get(`${firebaseInfo.databaseURL}/notes.json?orderBy="uid"&equalTo="${user}"`)
            .then((itemObject) => {
                notes = itemObject.data;
                resolve(notes);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    const deleteNote = function(id){
        $(".progress").css("visibility","visible");
        return $q( (resolve, reject) => {
            $http.delete(`${firebaseInfo.databaseURL}/notes/${id}.json`)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };

    const addNote = (note) =>{
        if (firebase.auth().currentUser) {
            $(".progress").css("visibility","visible");
            let newnote = JSON.stringify(note);
            return $q( (resolve, reject) => {
                $http.post(`${firebaseInfo.databaseURL}/notes.json`,newnote)
                .then((response) => {
       
                    resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }
    };

    const editNote = function(id, obj) {
        $(".progress").css("visibility","visible");
        return $q((resolve, reject) => {
            let newObj = JSON.stringify(obj);
            $http.patch(`${firebaseInfo.databaseURL}/notes/${id}.json`, newObj)
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };
    return {fetchFirebase,addNote,deleteNote,editNote};
});
},{}],8:[function(require,module,exports){
"use strict";
angular.module('myApp').constant("firebaseInfo", {
    apiKey: "AIzaSyC2bozLg5VCXBkYaHxXAP5VNdD8KZaQw9I",
    authDomain: "user-notes-5a838.firebaseapp.com",
    databaseURL: "https://user-notes-5a838.firebaseio.com",
    projectId: "user-notes-5a838",
    storageBucket: "user-notes-5a838.appspot.com",
    messagingSenderId: "749303934346"
});

},{}]},{},[1,2,3,4,5,6,7,8]);
