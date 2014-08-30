'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'ui.bootstrap',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/sets',
        {templateUrl: 'partials/sets.html',
         controller: 'SetsController',
         title: 'Sets'});
    $routeProvider.when('/advsearch',
        {templateUrl: 'partials/advsearch.html',
         controller: 'AdvSearchController',
         title: 'Search'});
    $routeProvider.when('/querysearch',
        {templateUrl: 'partials/querysearch.html',
         controller: 'QuerySearchController',
         title: 'Query',
         reloadOnSearch: false});
    $routeProvider.when('/set/:setcode',
        {templateUrl: 'partials/set.html',
         controller: 'SetController',
         title: 'Set View'});
    $routeProvider.when('/card/:cardname',
        {templateUrl: 'partials/card.html',
         controller: 'CardController',
         title: 'Card View'});
    $routeProvider.otherwise({redirectTo: '/sets'});
}]).run(['$rootScope', function($rootScope) {
    $rootScope.page = {
        setTitle: function(title) {
            this.title = title;
        }
    }
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        $rootScope.page.setTitle(current.$$route.title || 'No Title');
    });
}]);
