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