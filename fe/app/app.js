'use strict';

// Declare app level module which depends on views, and components
angular.module('pocFe', [
  'ngRoute',
  'pocFe.home',
  'pocFe.item'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
