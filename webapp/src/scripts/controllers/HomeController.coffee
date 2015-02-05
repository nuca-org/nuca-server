angular.module 'nuca.controllers'

.controller 'HomeController', ['$scope', 'API', ($scope, API) ->
  $scope.date = new Date()

  $scope.daiUna = () ->

    entry = 
      name: 'Corhas'
      location: 
        address1: 'Corhas'
        address2: 'Corhas2'

    API.Hospital.add entry, () ->
      alert('aaaaa')
]
