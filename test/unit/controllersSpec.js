'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(module('myApp.controllers'));
  beforeEach(module('myApp.services'));
  beforeEach(module('ngRoute'));

  // add page.title to root scope, since some controllers expect it
  var titlescope = { page: {setTitle: function(title) {
      this.title = title;
  }}};

  it('should ....', inject(function($controller) {
    var ctl = $controller('SetController', { $scope: titlescope });
    expect(ctl).toBeDefined();
  }));

  it('should ....', inject(function($controller) {
    var ctl = $controller('SetsController', { $scope: titlescope });
    expect(ctl).toBeDefined();
  }));

  it('should ....', inject(function($controller) {
    var ctl = $controller('CardController', { $scope: titlescope });
    expect(ctl).toBeDefined();
  }));

  it('should ....', inject(function($controller) {
    var ctl = $controller('AdvSearchController', { $scope: titlescope });
    expect(ctl).toBeDefined();
  }));

  it('should ....', inject(function($controller) {
    var ctl = $controller('QuerySearchController', { $scope: titlescope });
    expect(ctl).toBeDefined();
  }));

  it('should ....', inject(function($controller) {
    var ctl = $controller('HeaderController', { $scope: titlescope });
    expect(ctl).toBeDefined();
  }));
});
