angular.module 'nuca.controllers'

.controller 'ConfirmRequestController', ['$scope', '$routeParams', 'toastr', 'API', ($scope, $routeParams, toastr, API) ->

  loadRequest = () ->
    API.Request.query { id: $routeParams.id }, (data) ->
      $scope.request = data[0]

  $scope.removeCat = (cat) ->
    return if !confirm('Sunteti sigur ca doriti sa stergeti aceasta inregistrare?')
    idx = $scope.request.cats.indexOf(cat)
    $scope.request.cats.splice(idx, 1)

  $scope.addCat = () ->
    $scope.request.cats.push {}

  $scope.updateRequest = () ->
    return if !confirm('Sunteti sigur ca doriti sa trimiteti mai departe aceasta cerere?')
    $scope.editForm.$setPristine()
    API.Request.update { id: $routeParams.id }, $scope.request, (data) ->
      toastr.success 'Cerere trimisa cu succes'
      $scope.goto '/'

  loadRequest()
]
