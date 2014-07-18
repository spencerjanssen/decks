'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('MyCtrl1', ['$scope', function($scope) {

    }])
    .controller('MyCtrl2', ['$scope', function($scope) {

    }])
    .controller('SetsController', function($scope, $http, Sets) {
        console.log('sets controller loaded');
        console.log(Sets);
        $scope.sets = Sets.getsetlist.query();
  })
    .controller('SetController', function($scope, $routeParams, $http, Sets) {
        console.log('set controller loaded');
        $scope.cards = Sets.getset.query({setname: $routeParams.setcode});
  })
  ;
