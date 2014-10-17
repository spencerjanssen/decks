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

decksServices.factory('Sorter', function(){
    // this is a max heap, that is parent > child

    function leftchild(i){
        return 2*(i+1)-1;
    }

    function rightchild(i){
        return 2*(i+1);
    }

    function swap(arr, i, j){
        var x = arr[i];
        arr[i] = arr[j];
        arr[j] = x;
    }

    function heapsort(arr, yielder, comp, cont){
        function heapingdown (i, cont){
            heapdown(arr, comp, i, function(){
                if(i==0) return cont();
                else return heapingdown(i-1, cont);
            });
        }
        function popping(cont){
            if(arr.length == 0) return cont();
            else {
                yielder(arr[0]);
                heappop(arr, comp, function() { popping(cont) });
            }
        }
        heapingdown(arr.length-1, function(){ popping(cont); });
    }

    // comp(x, y, cont) == cont(x > y)
    function heapdown(arr, comp, i, cont){
        var j = leftchild(i);
        var k = rightchild(i);
        var largest = i;
        function gcomp(x, y, cont){
            if(y >= arr.length) cont(true)
            else comp(arr[x], arr[y], cont);
        }
        gcomp(largest, j, function(jsmall){
            if(!jsmall) largest = j;
            gcomp(largest, k, function(ksmall){
                if(!ksmall) largest = k;
                if(largest != i) {
                    swap(arr, i, largest);
                    return heapdown(arr, comp, largest, cont);
                } else {
                    return cont();
                }
            });
        })
    }

    function heappop(arr, comp, cont){
        if(arr.length <= 1) {
            arr.pop();
            return cont();
        } else {
            arr[0] = arr.pop();
            return heapdown(arr, comp, 0, cont);
        }
    }

    return function(cardlist, yielder, comp, finished){
        heapsort(cardlist, yielder, comp, finished);
    };
});
