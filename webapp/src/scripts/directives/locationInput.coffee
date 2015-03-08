angular.module 'nuca'

.directive "locationInput", ["uiGmapGoogleMapApi", (uiGmapGoogleMapApi) ->
  restrict: "E"
  require: "?ngModel"

  scope:
    ngModel: "="

  templateUrl: "scripts/directives/locationInput.html"

  replace: false

  controller: ($scope, $element, $attrs) ->

    $scope.searchbox = 
      events: 
        places_changed: (searchBox) ->
          place = searchBox.getPlaces()[0]
          return if !place
          setModel place.geometry.location
          #center map to location with a copy of the current position
          $scope.map.center = angular.copy $scope.ngModel

    $scope.map = 
      center: 
        latitude: 46.766667
        longitude: 23.58333300000004
      zoom: 17
      events:
        click: (map, eventName, args) ->
          $scope.$apply () ->
            setModel args[0].latLng

    $scope.marker = 
      id: 0
      options: 
        draggable: true
      coords: $scope.ngModel# || {latitude: 0, longitude: 0}
      events:
        dragend: (marker, eventName, args) ->

    $scope.window =
      options:
        visible: true

    setModel = (latLng) ->
      $scope.ngModel ?= {}
      $scope.ngModel.latitude = latLng.lat()
      $scope.ngModel.longitude = latLng.lng()

    reverseGeocode = () ->      
      return if !$scope.ngModel
      uiGmapGoogleMapApi.then (maps) ->
        geocoder = new maps.Geocoder()
        latlng = new maps.LatLng($scope.ngModel.latitude, $scope.ngModel.longitude)
        geocoder.geocode {'latLng': latlng}, (results, status) ->
          if status == google.maps.GeocoderStatus.OK 
            $scope.$apply () ->
              $scope.window.content = results[0].formatted_address if results[0]
          else
            console.log "Geocoder failed due to: " + status
      
    $scope.$watch 'ngModel', (newValue, oldValue) ->
      #preset values if they were not initially set
      if !$scope.marker.coords && newValue
        $scope.marker.coords = newValue
        $scope.map.center = angular.copy newValue
      reverseGeocode()      
    , true

    navigator.geolocation.getCurrentPosition (pos) ->
      $scope.$apply () ->
        $scope.map.center = { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
        return
]

