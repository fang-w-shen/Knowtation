"use strict";
angular.module('myApp', ['ngRoute']);
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
    
angular.module('myApp').config(function ($routeProvider) {
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
            controller: "NoteCtrl",
            resolve: {isAuth}
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