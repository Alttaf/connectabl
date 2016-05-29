'use strict';

angular.module('nodeApp.auth', ['nodeApp.constants', 'nodeApp.util', 'ngCookies', 'ui.router'])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
