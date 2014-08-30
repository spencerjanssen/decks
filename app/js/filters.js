'use strict';

/* Filters */

angular.module('myApp.filters', []).filter("paginate",function(){
    return function(input, currentPage, pageAt){
        var i = pageAt * (currentPage-1);
        var j = i + pageAt;
        return input.slice(i, j)
    };
})
