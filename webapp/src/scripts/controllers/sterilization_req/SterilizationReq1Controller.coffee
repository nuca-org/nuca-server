angular.module 'nuca.controllers'

.controller 'SterilizationReq1Controller', ['$scope', 'API', ($scope, API) ->

  $scope.sterilizationReq = 
    cats: [{}]

  $scope.removeCat = (cat) ->
    if confirm('Sunteti sigur ca doriti sa stergeti aceasta inregistrare?')
      idx = $scope.sterilizationReq.cats.indexOf(cat)
      $scope.sterilizationReq.cats.splice(idx, 1)

  $scope.addCat = () ->
    $scope.sterilizationReq.cats.push {}

  $scope.createRequest = () ->
    API.SterilizationReq.add $scope.sterilizationReq, (data) ->
      $scope.goto('/confirmare_cerere/' + data.id)

]
