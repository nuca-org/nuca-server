angular.module 'nuca.controllers'

.controller 'SterilizationReq1Controller', ['$scope', 'API', ($scope, API) ->

  $scope.sterilizationReq = 
    cats: [{}]

  $scope.removeCat = (cat) ->
    if confirm('Sunteti sigur ca doriti sa eliminati aceasta pisica')
      idx = $scope.sterilizationReq.cats.indexOf(cat)
      $scope.sterilizationReq.cats.splice(idx, 1)

  $scope.addCat = () ->
    $scope.sterilizationReq.cats.push {}


  #google maps stuff, to be directived up :)
  $scope.selected =
    options:
      visible: false
    templateurl:'window.tpl.html'
    templateparameter: {}
  
  $scope.map = 
    center: 
      latitude: 40.1451
      longitude: -99.6680
    zoom: 17
    markers: [],
    idkey: 'place_id',

  $scope.options = 
    scrollwheel: false
  
  events =
    places_changed: (searchBox) ->
      places = searchBox.getPlaces()

      if places.length == 0
        return
      # For each place, get the icon, place name, and location.
      newMarkers = []
      bounds = new (google.maps.LatLngBounds)

      place = places[0]

      if place
        # Create a marker for place.
        marker = 
          id: places.indexOf(place)
          place_id: place.place_id
          name: place.name
          latitude: place.geometry.location.lat()
          longitude: place.geometry.location.lng()
          options: visible: false
          templateurl: 'window.tpl.html'
          templateparameter: place
        newMarkers.push marker
        bounds.extend place.geometry.location
        #center map to location
        $scope.map.center = { latitude: marker.latitude, longitude: marker.longitude }

      $scope.map.bounds =
        northeast:
          latitude: bounds.getNorthEast().lat()
          longitude: bounds.getNorthEast().lng()
        southwest:
          latitude: bounds.getSouthWest().lat()
          longitude: bounds.getSouthWest().lng()

      _.each newMarkers, (marker) ->

        marker.closeClick = ->
          $scope.selected.options.visible = false
          marker.options.visble = false
          $scope.$apply()

        marker.onClicked = () ->
          $scope.selected.options.visible = false
          $scope.selected = marker
          $scope.selected.options.visible = true
          return

        return
      $scope.map.markers = newMarkers
      #$scope.searchbox.options.visible = false;
      return
  
  $scope.searchbox = 
    template: 'searchbox.tpl.html'
    events: events

  navigator.geolocation.getCurrentPosition (pos) ->
    $scope.map.center = { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
    return
  , (error) ->
    alert 'Unable to get location: ' + error.message
    return
]

.controller 'WindowCtrl', ['$scope', ($scope) ->
  $scope.place = {}
  $scope.showPlaceDetails = (param) ->
    $scope.place = param
]