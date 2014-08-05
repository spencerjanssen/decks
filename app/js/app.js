'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.when('/sets', {templateUrl: 'partials/sets.html', controller: 'SetsController'});
  $routeProvider.when('/advsearch', {templateUrl: 'partials/advsearch.html', controller: 'AdvSearchController'});
  $routeProvider.when('/set/:setcode', {templateUrl: 'partials/set.html', controller: 'SetController'});
  $routeProvider.when('/card/:cardname', {templateUrl: 'partials/card.html', controller: 'CardController'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
