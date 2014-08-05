'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('MyCtrl1', ['$scope', function($scope) {

    }])
    .controller('MyCtrl2', ['$scope', function($scope) {

    }])
    .controller('SetsController', function($scope, $http, Sets) {
        console.log(Sets);
        $scope.sets = Sets.getsetlist.query();
  })
    .controller('SetController', function($scope, $routeParams, $http, Sets) {
        $scope.cards = Sets.getset.query({setcode: $routeParams.setcode});
        // TODO actually look up set info and display nice name
        $scope.set = {setname: $routeParams.setcode};
  })
    .controller('CardController', function($scope, $routeParams, $http, Sets) {
        $scope.card = Sets.getcard.get({card: $routeParams.cardname});
  })
    .controller('AdvSearchController', function($scope, Sets) {
        $scope.search = function(q){
            console.log('todo search call to API' + q);
        }
  })
    .controller('HeaderController', function($scope, $location){
        $scope.active = function(loc){
            if(loc == $location.path()){
                return 'active';
            } else {
                return '';
            }
        }
    })
  ;
