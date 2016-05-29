'use strict';

angular.module('nodeApp')
  .config(function($stateProvider) {
    $stateProvider.state('main', {
      url: '/',
      template: '<main></main>'
    });
  });
