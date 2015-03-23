angular.module 'nuca.controllers'

.controller 'AccomodationsController', ['$scope', '$modal', 'API', 'toastr', ($scope, $modal, API, toastr) ->

  loadAccomodations = () ->
    API.Accomodation.query { }, (data) ->
      $scope.accomodations = data

  $scope.openAccomodationPopUp = (acc) ->
    modalInstance = $modal.open
      templateUrl: 'views/accomodations/accomodation_popup.html'
      controller: 'AccomodationPopUpController'
      resolve:
        popUpParam: () -> { acc: acc }
    modalInstance.result.then (msg) ->
      toastr.success msg
      loadAccomodations()
  
  $scope.delete = (acc) ->
    return if !confirm('Sunteti sigur ca doriti sa eliminati aceasta cazare?')
    API.Accomodation.delete {id: acc.id}, (data) ->
      toastr.success 'Cazare eliminata cu success'
      loadAccomodations()

  loadAccomodations()
]
