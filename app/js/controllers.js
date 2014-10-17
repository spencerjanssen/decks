'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('SetsController', function($scope, $http, Sets) {
        $scope.sets = Sets.getsetlist.query();
    })
    .controller('SetController', function($scope, $routeParams, $http, Sets) {
        $scope.set = Sets.getset.get({setcode: $routeParams.setcode}, function(){
            $scope.cards = $scope.set.cards;
            $scope.page.setTitle('Set: ' + $routeParams.setcode);
        });
    })
    .controller('PickOrderController', function($scope, $routeParams, $http,
                                                Sets, Sorter) {
        function yielder(c){
            $scope.results.push(c);
        }

        function comparer(x, y, cont){
            $scope.leftcard = x;
            $scope.rightcard = y;
            currentcont = cont;
            return '';
        };

        function finished(){
            $scope.sortdone = true;
        }

        $scope.clicked = function(b){
            var c = currentcont;
            currentcont = 'not a function';
            return c(b);
        };
        var currentcont;
        $scope.results = new Array();
        $scope.sortdone = false;

        $scope.imageOf = function(card){
            if(!card){
                return undefined;
            }
            return 'http://mtgimage.com/set/' + $scope.set.code + '/'
                   + card.imageName + '.jpg';
        }


        $scope.set = Sets.getset.get({setcode: $routeParams.setcode}, function(){
            $scope.cards = $scope.set.cards;
            $scope.page.setTitle('Set: ' + $routeParams.setcode);
            Sorter($scope.set.cards, yielder, comparer, finished)
        });
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
    .controller('QuerySearchController', function($scope, $location, Sets) {
        function dothesearch(){
            $scope.cards = Sets.querysearch.query({query: $scope.query});
        }
        if($location.search().q){
            $scope.query = $location.search().q;
            dothesearch();
        } else {
            $scope.query = '';
        }

        $scope.dosearch = function(){
            $location.search('q', $scope.query)
        }
        $scope.$on('$routeUpdate', function(next, current){
            dothesearch();
        });
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
    .controller('CardlistController', function($scope){
        $scope.displayModes =
            [ {name: 'Simple', pageAt: 1000}
            , {name: 'Detailed', pageAt: 100}
            , {name: 'Spoiler', pageAt: 20}
            ]
        $scope.currentMode = $scope.displayModes[0];
        $scope.currentPage = 1;
    })
;
