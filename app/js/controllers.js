'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('SetsController', function($scope, $http, Sets) {
        $scope.sets = Sets.getsetlist.query();
    })
    .controller('SetController', function($scope, $routeParams, $http, Sets) {
        $scope.cards = Sets.getset.query({setcode: $routeParams.setcode});
        // TODO actually look up set info and display nice name
        $scope.set = {setname: $routeParams.setcode};
        $scope.page.setTitle('Set: ' + $routeParams.setcode);
    })
    .controller('CardController', function($scope, $routeParams, $http, Sets) {
        $scope.card = Sets.getcard.get({card: $routeParams.cardname});
        $scope.page.setTitle('Card: ' + $routeParams.cardname);
        $scope.imageOf = function(card){
            if(!card){
                return undefined;
            }
            return 'http://mtgimage.com/card/' + card.imageName + '.jpg';
        }
    })
    .controller('AdvSearchController', function($scope, Sets) {
        $scope.search = function(q){
            $scope.cards = Sets.searchcards.update({}, q);
        }
    })
    .controller('QuerySearchController', function($scope, Sets) {
        $scope.search = function(q){
            $scope.cards = Sets.querysearch.query({query: q});
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
