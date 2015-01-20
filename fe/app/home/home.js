'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {

  var renderPage = function (data) {
    $scope.isAuth = false;
    if (data.name !== undefined && data.id !== undefined) {
      $scope.isAuth = true;
      $scope.name = data.name;
      $scope.id = data.id;
    }
  };

  $http.get('/api/auth').success(function (data, status, headers, config) {
    renderPage(data);
  });

  $scope.logout = function () {
    $http.post('/api/auth', {action: 'logout'}).success(function (data, status, headers, config) {
      $scope.isAuth = false;
    });
  };

  $scope.login = function () {
    $http.post('/api/auth', {action: 'login'}).success(function (data, status, headers, config) {
      $window.location.href = data;
    });
  };

}]);