'use strict';

var config = browser.params;
var UserModel = require(config.serverConfig.root + '/server/api/user/user.model').default;

describe('Search for a user', function() {
  var page;

  var loadPage = function() {
    let promise = browser.get(config.baseUrl + '/login');
    page = require('../../login.po');
    return promise;
  };

  var searchPage = function() {
    let promise = browser.get(config.baseUrl + '/');
    page = require('./search.po');
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
      .then(loadPage);
  });

  after(function() {
    return UserModel.remove();
  });


  describe('with local auth', function() {

    it('should login a user and redirecting to "/"', function() {
      page.login(testUser)
        .then(function(){
          console.log('promisified')
        })

      var navbar = require('../../components/navbar/navbar.po');

      browser.getCurrentUrl().should.eventually.equal(config.baseUrl + '/');
      navbar.navbarAccountGreeting.getText().should.eventually.equal('Hello ' + testUser.name);
    });


  });
});
