angular.module 'nuca.controllers'

.controller 'HomeController', ['$scope', 'API', 'toastr', ($scope, API, toastr) ->
  $scope.date = new Date()


  $scope.daiUna = () ->
    entry = 
      reporter_name: 'Corhas'

    API.SterilizationReq.add entry, (data) ->
      alert('aaaaa')
]
