'use strict';

angular.module('pocFe.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'components/home/home.html',
    controller: 'HomeController'
  });
}])

.controller('HomeController', ['$scope', '$http', '$window', function($scope, $http, $window) {

  var renderPage = function (data) {
    $scope.isAuth = false;
    if (!angular.isUndefined(data.name) && !angular.isUndefined(data.id)) {
      $scope.isAuth = true;
      $scope.name = data.name;
      $scope.id = data.id;
    }
  };

  $http.get('/api/auth').success(function (data, status) {
    renderPage(data);
  });

  $scope.logout = function () {
    $http.post('/api/auth', {action: 'logout'}).success(function (data, status) {
      $scope.isAuth = false;
    });
  };

  $scope.login = function () {
    $http.post('/api/auth', {action: 'login'}).success(function (data, status) {
      $window.location.href = data;
    });
  };

}]);