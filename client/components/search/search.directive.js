'use strict';

angular.module('nodeApp')
  .directive('search', () => ({
    templateUrl: 'components/search/search.html',
    restrict: 'E',
    controller: 'SearchController',
    controllerAs: 'ser'
  }));
