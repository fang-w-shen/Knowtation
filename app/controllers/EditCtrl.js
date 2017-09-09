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