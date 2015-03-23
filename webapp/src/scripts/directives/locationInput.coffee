angular.module 'nuca'

.directive "locationInput", ["$timeout", "uiGmapGoogleMapApi", ($timeout, uiGmapGoogleMapApi) ->
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

    $scope.mapControl = {}

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
      coords: $scope.ngModel || {latitude: 0, longitude: 0}
      events: {}
        #dragend: (marker, eventName, args) ->

    $scope.window =
      options:
        visible: true

    setModel = (latLng) ->
      $scope.ngModel ?= {}
      $scope.ngModel.latitude = latLng.lat()
      $scope.ngModel.longitude = latLng.lng()
      #hack to set the form dirty, could not link ngModel 
      #because we are using controller for google maps
      $scope.$parent.editForm.$setDirty()

    reverseGeocode = () -> 
      return if !$scope.ngModel?
      uiGmapGoogleMapApi.then (maps) ->
        loadMap = true
        geocoder = new maps.Geocoder()
        latlng = new maps.LatLng($scope.ngModel.latitude, $scope.ngModel.longitude)
        geocoder.geocode {'latLng': latlng}, (results, status) ->
          if status == maps.GeocoderStatus.OK 
            $scope.$apply () ->
              $scope.window.content = results[0].formatted_address if results[0]
          else
            console.log "Geocoder failed due to: " + status
      
    $scope.$watch 'ngModel', (newValue, oldValue) ->
      #preset values if they were not initially set
      if $scope.marker.coords.latitude == 0 && newValue
        $scope.marker.coords = newValue
        $scope.map.center = angular.copy newValue
      reverseGeocode()
    , true
    
    $scope.map.center = angular.copy $scope.ngModel if $scope.ngModel?
    #fix problem if the map was hidden on load by refreshing
    $timeout () ->
      $scope.mapControl.refresh($scope.ngModel) if $scope.mapControl?

    ###
    Temorarly remove geolocation, not stable
    navigator.geolocation.getCurrentPosition (pos) ->
      $scope.$apply () ->
        return if $scope.ngModel #do not center if we already have a marked zone
        $scope.map.center = { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
        return
    ###
]

