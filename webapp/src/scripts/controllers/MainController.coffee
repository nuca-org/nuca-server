angular.module 'nuca.controllers'

.controller 'MainController', ['$scope', '$location', '$window', '$modal', 'toastr', 'Config', 'Const', 'Login', 'API', ($scope, $location, $window, $modal, toastr, Config, Const, Login, API) ->

  #map the Login object to our controller to use it in the View and sub-controllers
  $scope.Config = Config
  $scope.Const = Const  
  $scope.Login = Login
  $scope.copyrightYear = (new Date()).getFullYear();
  
  #---------------------
  #-- Drop Downs -------
  #---------------------
  $scope.genders = [
    { name: 'Nu stiu'}
    { id: Const.Gender.Male, name: 'Mascul'}
    { id: Const.Gender.Female, name: 'Femela'}
  ]

  $scope.statuses = [
    { name: 'Oricare' }
    { id: Const.Status.New, name: 'Noi' }
    { id: Const.Status.Confirmed, name: 'Confirmate' }
    { id: Const.Status.Transport, name: 'Transport' }
    { id: Const.Status.Accomodated, name: 'Cazare' }
    { id: Const.Status.Returned, name: 'Returnate' }
  ]

  #---------------------
  #-- Util -------------
  #---------------------
  $scope.goto = (target) ->
    $location.path target

  $scope.getCurrentPath = () ->
    $location.path().toLowerCase()

  $scope.$on 'Services:responseError', (event, error) ->
    toastr.error 'Server Error <br/>' + error.status + ' ' + error.statusText

  #---------------------
  #-- Main -------------
  #---------------------

  initMain = () ->
    $scope.isAdmin = true
 
  initMain()
]
