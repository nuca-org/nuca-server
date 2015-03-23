angular.module 'nuca.controllers'

.controller 'MainController', ['$scope', '$location', '$window', '$modal', 'toastr', 'Config', 'Constants', 'Login', 'API', ($scope, $location, $window, $modal, toastr, Config, Constants, Login, API) ->

  #map the Login object to our controller to use it in the View and sub-controllers
  $scope.Config = Config
  $scope.Constants = Constants  
  $scope.Login = Login
  $scope.copyrightYear = (new Date()).getFullYear();
  
  $scope.genders = [
    {name: 'Nu stiu'}
    {id:'M', name: 'Mascul'}
    {id:'F', name: 'Femela'}
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
