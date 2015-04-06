angular.module 'nuca.controllers'

.controller 'NewRequestController', ['$scope', 'API', ($scope, API) ->

  $scope.request = 
    cats: [{}]

  $scope.createRequest = () ->
    API.Request.add $scope.request, (data) ->
      $scope.goto('/confirmare_cerere/' + data.id)
]
