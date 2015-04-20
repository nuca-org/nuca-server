angular.module 'nuca.controllers'

.controller 'RequestsMapController', ['$scope', 'API', ($scope, API) ->

  $scope.filter = {}
  
  $scope.mapControl = {}
  $scope.map = 
    center: 
      latitude: 46.766667
      longitude: 23.58333300000004
    zoom: 17
    markers: []

  #---------------------
  #-- Load Methods -----
  #---------------------
  
  loadAccomodations = () ->
    API.Accomodation.query { }, (data) ->
      $scope.accomodations = data
      loadMarkersFromAccomodations()

  searchRequests = () ->
    param = {}
    param.reporter_name = $scope.filter.reporter_name if $scope.filter.reporter_name
    param.status = $scope.filter.status if $scope.filter.status

    API.Request.query param, (data) ->
      $scope.requests = data
      loadMarkersFromRequests()

  loadMarkersFromAccomodations = () ->
    #remove all previous
    $scope.map.markers = $scope.map.markers.where (m) -> m.type != $scope.Const.MarkerType.Accomodation
    for acc in $scope.accomodations
      marker =
        id: acc.id
        location: acc.location,
        title: acc.name
        type: $scope.Const.MarkerType.Accomodation
        icon: 'imgs/blue-dot.png'
        

      $scope.map.markers.push marker
  
  loadMarkersFromRequests = () ->
    #remove all previous
    $scope.map.markers = $scope.map.markers.where (m) -> m.type != $scope.Const.MarkerType.Request
    for request in $scope.requests
      marker =
        id: request.id
        location: request.location
        title: request.reporter_name
        type: $scope.Const.MarkerType.Request

      $scope.map.markers.push marker
    

  #---------------------
  #------ Events -------
  #---------------------
  $scope.$watch 'filter', (newValue, oldValue) ->
    searchRequests()
  , true #deep watch

  loadAccomodations()
  searchRequests()
]
