'use strict';

var config = browser.params;

describe('Main View', function() {
  var page;

  beforeEach(function() {
    let promise = browser.get(config.baseUrl + '/');
    page = require('./main.po');
    return promise;
  });

  it('should include jumbotron with correct data', function() {
    page.h1El.getText().should.eventually.equal('Connectabl');
    page.imgEl.getAttribute('src').should.eventually.match(/buddies(\.[a-zA-Z0-9]*)?\.png$/);
  });
});
