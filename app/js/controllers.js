'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('MyCtrl1', ['$scope', function($scope) {

    }])
    .controller('MyCtrl2', ['$scope', function($scope) {

    }])
    .controller('SetsController', function($scope, $http) {
        console.log('sets controller loaded');
        $http.get('api/sets.json').success(function(data){
            $scope.sets = data
        });
  })
  ;
