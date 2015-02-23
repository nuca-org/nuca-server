angular.module 'nuca'

.directive "locationInput", ["uiGmapGoogleMapApi", (uiGmapGoogleMapApi) ->
  restrict: "E"
  require: "?ngModel"

  scope:
    ngModel: "="

  templateUrl: "scripts/directives/locationInput.html"

  replace: false

  link: (scope, element, attrs, formCtl) ->

    scope.ngModel ?= {latitude: 0, longitude: 0}
    
    reverseGeocode = () ->
      uiGmapGoogleMapApi.then (maps) ->
        geocoder = new maps.Geocoder()
        latlng = new maps.LatLng(scope.marker.coords.latitude, scope.marker.coords.longitude)
        geocoder.geocode {'latLng': latlng}, (results, status) ->
          if status == google.maps.GeocoderStatus.OK 
            scope.$apply () ->
              scope.window.content = results[0].formatted_address if results[0]
          else
            console.log "Geocoder failed due to: " + status
      
    scope.$watch 'ngModel', reverseGeocode, true

    scope.map = 
      center: 
        latitude: 46.766667
        longitude: 23.58333300000004
      zoom: 17
      events:
        click: (map, eventName, args) ->
          scope.$apply () ->
            scope.ngModel.latitude = args[0].latLng.lat()
            scope.ngModel.longitude = args[0].latLng.lng()

    scope.marker = 
      id: 0
      options: 
        draggable: true
      coords: scope.ngModel
      events:
        dragend: (marker, eventName, args) ->

    scope.window =
      options:
        visible: true
  
    scope.searchbox = 
      events: 
        places_changed: (searchBox) ->
          place = searchBox.getPlaces()[0]
          return if !place
          scope.ngModel.latitude = place.geometry.location.lat()
          scope.ngModel.longitude = place.geometry.location.lng()
          #center map to location with a copy of the current position
          scope.map.center = angular.copy scope.marker.coords

    navigator.geolocation.getCurrentPosition (pos) ->
      scope.$apply () ->
        scope.map.center = { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
        return
]