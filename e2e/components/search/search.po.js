/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var SearchPage = function() {
  var form = this.form = element(by.css('.search-form'));
  form.name = form.element(by.model('ser.newUser'));
  form.submit = form.element(by.id('search-button'));

  this.search = function(data) {
    for (var prop in data) {
      var formElem = form[prop];
      if (data.hasOwnProperty(prop) && formElem && typeof formElem.sendKeys === 'function') {
        formElem.sendKeys(data[prop]);
      }
    }
   // var input = $('#someInput');
//form.submit..sendKeys(protractor.Key.ENTER);
form.submit.click();
    return form.submit.sendKeys(protractor.Key.ENTER);
  };
};

module.exports = new SearchPage();

