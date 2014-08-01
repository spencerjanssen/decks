'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.

var decksServices = angular.module('myApp.services', ['ngResource']);

decksServices.value('version', '0.1');

decksServices.factory('Sets', function($resource){
    var setlist = $resource('api/sets.json');
    var specificset = $resource('api/set/:setcode.json');
    return {getsetlist: setlist, getset: specificset};
});
