'use strict';

angular.module('pocFe.item', [])

.controller('ItemController', ['$scope', '$http', function($scope, $http) {

  $scope.items = [];

  $http.get('/api/chipmunk?resource=item')
    .success(function (data, status) {
      $scope.items = data.data;
    })
    .error(function (data, status) {
      $scope.items = [];
    });

  $scope.addItem = function() {
    var value = $scope.itemValue;

    $http.post('/api/chipmunk?resource=item', {value: value})
      .success(function (data, status) {
        $scope.items.push(data.data)
      })
      .error(function (data, status) {

      });
  };
}]);
