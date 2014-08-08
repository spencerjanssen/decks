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
    $routeProvider.when('/view1',
        {templateUrl: 'partials/partial1.html',
         controller: 'MyCtrl1',
         title: 'View 1'});
    $routeProvider.when('/view2',
        {templateUrl: 'partials/partial2.html',
         controller: 'MyCtrl2',
         title: 'View 2'});
    $routeProvider.when('/sets',
        {templateUrl: 'partials/sets.html',
         controller: 'SetsController',
         title: 'Sets'});
    $routeProvider.when('/advsearch',
        {templateUrl: 'partials/advsearch.html',
         controller: 'AdvSearchController',
         title: 'Search'});
    $routeProvider.when('/set/:setcode',
        {templateUrl: 'partials/set.html',
         controller: 'SetController',
         title: 'Set View'});
    $routeProvider.when('/card/:cardname',
        {templateUrl: 'partials/card.html',
         controller: 'CardController',
         title: 'Card View'});
    $routeProvider.otherwise({redirectTo: '/view1'});
}]).run(['$rootScope', function($rootScope) {
    $rootScope.page = {
        setTitle: function(title) {
            this.title = title;
        }
    }
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        $rootScope.page.title = current.$$route.title || 'No Title';
    });
}]);
