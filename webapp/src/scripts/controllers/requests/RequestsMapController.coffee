angular.module 'nuca.controllers'

.controller 'RequestsMapController', ['$scope', 'API', ($scope, API) ->

  $scope.mapControl = {}
  $scope.map = 
    center: 
      latitude: 46.766667
      longitude: 23.58333300000004
    zoom: 17
]
