angular.module 'nuca.controllers'

.controller 'SterilizationReq2Controller', ['$scope', '$routeParams', 'API', ($scope, $routeParams, API) ->

  loadRequest = () ->
    API.SterilizationReq.query { id: $routeParams.id }, (data) ->
      $scope.sterilizationReq = data[0]


  $scope.removeCat = (cat) ->
    if confirm('Sunteti sigur ca doriti sa stergeti aceasta inregistrare?')
      idx = $scope.sterilizationReq.cats.indexOf(cat)
      $scope.sterilizationReq.cats.splice(idx, 1)

  $scope.addCat = () ->
    $scope.sterilizationReq.cats.push {}

  $scope.updateRequest = () ->
    API.SterilizationReq.update { id: $routeParams.id }, $scope.sterilizationReq, (data) ->
      console.log data


  loadRequest()
]
