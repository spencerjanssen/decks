'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.

var decksServices = angular.module('myApp.services', ['ngResource']);

decksServices.factory('Sets', function($resource){
    var setlist = $resource('api/sets.json');
    var specificset = $resource('api/set/:setcode.json');
    var specificcard = $resource('api/card/:card.json');
    var searchcards = $resource('api/search', null,
                                {update: {method: 'PUT',
                                          isArray: true}})
    var querysearch = $resource('api/querysearch/:query.json');
    return {getsetlist: setlist,
            getset: specificset,
            getcard: specificcard,
            searchcards: searchcards,
            querysearch: querysearch
           };
});
