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