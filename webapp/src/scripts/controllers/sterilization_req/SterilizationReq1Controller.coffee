angular.module 'nuca.controllers'

.controller 'SterilizationReq1Controller', ['$scope', 'API', ($scope, API) ->

  $scope.request = 
    cats: [{}]

  $scope.createRequest = () ->
    API.SterilizationReq.add $scope.request, (data) ->
      $scope.goto('/confirmare_cerere/' + data.id)
]
