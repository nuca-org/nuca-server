angular.module 'nuca.controllers'

.controller 'SterilizationReq2Controller', ['$scope', '$routeParams', 'API', ($scope, $routeParams, API) ->

  loadRequest = () ->
    API.SterilizationReq.query { id: $routeParams.id }, (data) ->
      $scope.request = data[0]

  $scope.removeCat = (cat) ->
    if confirm('Sunteti sigur ca doriti sa stergeti aceasta inregistrare?')
      idx = $scope.request.cats.indexOf(cat)
      $scope.request.cats.splice(idx, 1)

  $scope.addCat = () ->
    $scope.request.cats.push {}

  $scope.updateRequest = () ->
    API.SterilizationReq.update { id: $routeParams.id }, $scope.request, (data) ->
      console.log data

  $scope.openDatePicker = ($event) ->
    $event.preventDefault()
    $event.stopPropagation()
    $scope.date_opened = true

  loadRequest()
]
