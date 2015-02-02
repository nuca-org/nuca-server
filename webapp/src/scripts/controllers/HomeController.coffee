angular.module 'nuca.controllers'

.controller 'HomeController', ['$scope', 'API', ($scope, API) ->
  $scope.date = new Date()
]
