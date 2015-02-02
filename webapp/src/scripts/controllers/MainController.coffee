angular.module 'nuca.controllers'

.controller 'MainController', ['$scope', '$location', '$window', '$modal', 'toastr', 'Config', 'Constants', 'Login', 'API', ($scope, $location, $window, $modal, toastr, Config, Constants, Login, API) ->

  #map the Login object to our controller to use it in the View and sub-controllers
  $scope.Config = Config
  $scope.Constants = Constants  
  $scope.Login = Login
  $scope.copyrightYear = (new Date()).getFullYear();
  
  #---------------------
  #-- Util -------------
  #---------------------
  $scope.goto = (target) ->
    $location.path target

  $scope.getCurrentPath = () ->
    $location.path().toLowerCase()

  $scope.$on 'Services:responseError', (event, error) ->
    toastr.error $translate.instant 'MESSAGES.SERVER_ERROR', {error: '<br/>' + error.status + ' ' + error.statusText}

  #---------------------
  #-- Main -------------
  #---------------------

  initMain = () ->
    i = 0
 
  initMain()
]
