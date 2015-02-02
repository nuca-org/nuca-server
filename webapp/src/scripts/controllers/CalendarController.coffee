angular.module 'nuca.controllers'

.controller 'CalendarController', ['$scope', 'API', ($scope, API) ->
  $scope.date = new Date()
]
