angular.module 'nuca.controllers'

.controller 'AccomodationPopUpController', ['$scope', '$modalInstance', 'API', 'DataHandler', 'popUpParam', ($scope, $modalInstance, API, DataHandler, popUpParam) ->

  $scope.acc = angular.copy(popUpParam.acc || {})
  $scope.addNew = !popUpParam.acc?

  $scope.save = () ->

    messagePosts = []
    messagePosts.push [API.Accomodation, 'add', {}, $scope.acc] if $scope.addNew
    messagePosts.push [API.Accomodation, 'update', { id: $scope.acc.id }, $scope.acc] if !$scope.addNew

    DataHandler.process messagePosts, (data) ->
      action = if $scope.addNew then 'adaugata' else 'modificata'
      $modalInstance.close("Cazare #{action} cu succes")

  $scope.cancel = () ->
    $modalInstance.dismiss('cancel')

]
