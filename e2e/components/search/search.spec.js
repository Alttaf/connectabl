'use strict';

var config = browser.params;
var UserModel = require(config.serverConfig.root + '/server/api/user/user.model').default;

describe('Search for a user', function() {
  var page;
  var serPage;

  var loadPage = function() {
    let promise = browser.get(config.baseUrl + '/login');
    page = require('../../account/login/login.po');
    return promise;
  };

  var searchPage = function() {
    let promise = browser.get(config.baseUrl + '/');
    browser.debugger();
    serPage = require('./search.po');
    return promise;
  };

  var testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test'
  };

  var testUserA = {
    name: 'Ay',
    email: 'testa@example.com',
    password: 'test'
  };
  var testUserB = {
    name: 'Be',
    email: 'testb@example.com',
    password: 'test'
  };

  before(function() {
    return UserModel
      .remove()
      .then(function() {
        return UserModel.create(testUser);
      })
      .then(function() {
        return UserModel.create(testUserA);
      })
      .then(function() {
        return UserModel.create(testUserB);
      })
      .then(loadPage)
      .then(searchPage)
  });

  after(function() {
    return UserModel.remove();
  });


  describe('with local auth', function() {

    it('should login a user and redirecting to "/"', function() {

       page.login(testUser);

      var navbar = require('../../components/navbar/navbar.po');

      browser.getCurrentUrl().should.eventually.equal(config.baseUrl + '/');
      navbar.navbarAccountGreeting.getText().should.eventually.equal('Hello ' + testUser.name);



    });

      it('should find only the searched for user "/"', function() {

       serPage.search({name:'Be'})
      //  element.all(by.css('.search-result')).then(function(items) {
      //   items.length.should.eventually.equal(1);
      // });
  // browser.wait(changed, 5 * 1000, 'Server should start within 5 seconds');
 browser.driver.sleep(10000);

        var elements = element.all(protractor.By.css('article'));
    elements.count().should.eventually.equal(1);


    });






  });
});
