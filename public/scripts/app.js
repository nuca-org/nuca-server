var NUCA;

if (!NUCA) {
  NUCA = {};
}

NUCA.util = {};

NUCA.util.deepProp = function(obj, propName) {
  var itemVal, subKey, subKeys, _i, _len;
  subKeys = propName.split('.');
  itemVal = null;
  for (_i = 0, _len = subKeys.length; _i < _len; _i++) {
    subKey = subKeys[_i];
    itemVal = (itemVal || obj)[subKey];
  }
  return itemVal;
};

Array.prototype.where = function(query) {
  var hit;
  if (typeof query === "function") {
    return this.filter(query);
  }
  if (typeof query === "object") {
    hit = Object.keys(query).length;
    return this.filter(function(item) {
      var key, match, val;
      match = 0;
      for (key in query) {
        val = query[key];
        if (NUCA.util.deepProp(item, key) === val) {
          match += 1;
        }
      }
      if (match === hit) {
        return true;
      } else {
        return false;
      }
    });
  }
  if (!query) {
    return this;
  }
  return [];
};

Array.prototype.first = function(query) {
  return this.where(query)[0];
};

Array.prototype.firstOrDefault = function(query) {
  return this.where(query)[0] || {};
};

Array.prototype.count = function(query) {
  return this.where(query).length;
};

Array.prototype.any = function(query) {
  if (this.where(query).length) {
    return true;
  } else {
    return false;
  }
};

Array.prototype.all = function(query) {
  if (this.where(query).length === this.length) {
    return true;
  } else {
    return false;
  }
};

Array.prototype.contains = function(item) {
  return this.indexOf(item) !== -1;
};

String.prototype.contains = function(text) {
  return this.indexOf(text) !== -1;
};

String.prototype.startsWith = function(text) {
  return this.indexOf(text) === 0;
};

String.prototype.endsWith = function(text) {
  return this.indexOf(text, this.length - text.length) !== -1;
};

var NUCA;

if (!NUCA) {
  NUCA = {};
}

angular.module('nuca', ['ngResource', 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'angularMoment', 'toastr', 'ui.utils', 'uiGmapgoogle-maps', 'ui.bootstrap.datetimepicker', 'nuca.config', 'nuca.constants', 'nuca.services', 'nuca.login', 'nuca.controllers']);

angular.module('nuca.config', []);

angular.module('nuca.constants', []);

angular.module('nuca.services', ['ngResource', 'nuca.config', 'nuca.constants']);

angular.module('nuca.login', ['nuca.services']);

angular.module('nuca.controllers', []);

angular.module('nuca.controllers').controller('HomeController', ['$scope', 'API', 'toastr', function($scope, API, toastr) {}]);

angular.module('nuca.controllers').controller('MainController', [
  '$scope', '$location', '$window', '$modal', 'toastr', 'Config', 'Const', 'Login', 'API', function($scope, $location, $window, $modal, toastr, Config, Const, Login, API) {
    var initMain;
    $scope.Config = Config;
    $scope.Const = Const;
    $scope.Login = Login;
    $scope.copyrightYear = (new Date()).getFullYear();
    $scope.genders = [
      {
        name: 'Nu stiu'
      }, {
        id: Const.Gender.Male,
        name: 'Mascul'
      }, {
        id: Const.Gender.Female,
        name: 'Femela'
      }
    ];
    $scope.statuses = [
      {
        name: 'Oricare'
      }, {
        id: Const.Status.New,
        name: 'Noi'
      }, {
        id: Const.Status.Confirmed,
        name: 'Confirmate'
      }, {
        id: Const.Status.Transport,
        name: 'Transport'
      }, {
        id: Const.Status.Accomodated,
        name: 'Cazare'
      }, {
        id: Const.Status.Returned,
        name: 'Returnate'
      }
    ];
    $scope.goto = function(target) {
      return $location.path(target);
    };
    $scope.getCurrentPath = function() {
      return $location.path().toLowerCase();
    };
    $scope.$on('Services:responseError', function(event, error) {
      return toastr.error('Server Error <br/>' + error.status + ' ' + error.statusText);
    });
    initMain = function() {
      return $scope.isAdmin = true;
    };
    return initMain();
  }
]);

angular.module('nuca.controllers').controller('AccomodationPopUpController', [
  '$scope', '$modalInstance', 'API', 'DataHandler', 'popUpParam', function($scope, $modalInstance, API, DataHandler, popUpParam) {
    $scope.acc = angular.copy(popUpParam.acc || {});
    $scope.addNew = popUpParam.acc == null;
    $scope.save = function() {
      var messagePosts;
      messagePosts = [];
      if ($scope.addNew) {
        messagePosts.push([API.Accomodation, 'add', {}, $scope.acc]);
      }
      if (!$scope.addNew) {
        messagePosts.push([
          API.Accomodation, 'update', {
            id: $scope.acc.id
          }, $scope.acc
        ]);
      }
      return DataHandler.process(messagePosts, function(data) {
        var action;
        action = $scope.addNew ? 'adaugata' : 'modificata';
        return $modalInstance.close("Cazare " + action + " cu succes");
      });
    };
    return $scope.cancel = function() {
      return $modalInstance.dismiss('cancel');
    };
  }
]);

angular.module('nuca.controllers').controller('AccomodationsController', [
  '$scope', '$modal', 'API', 'toastr', function($scope, $modal, API, toastr) {
    var loadAccomodations;
    loadAccomodations = function() {
      return API.Accomodation.query({}, function(data) {
        return $scope.accomodations = data;
      });
    };
    $scope.openAccomodationPopUp = function(acc) {
      var modalInstance;
      modalInstance = $modal.open({
        templateUrl: 'views/accomodations/accomodation_popup.html',
        controller: 'AccomodationPopUpController',
        resolve: {
          popUpParam: function() {
            return {
              acc: acc
            };
          }
        }
      });
      return modalInstance.result.then(function(msg) {
        toastr.success(msg);
        return loadAccomodations();
      });
    };
    $scope["delete"] = function(acc) {
      if (!confirm('Sunteti sigur ca doriti sa eliminati aceasta cazare?')) {
        return;
      }
      return API.Accomodation["delete"]({
        id: acc.id
      }, function(data) {
        toastr.success('Cazare eliminata cu succes');
        return loadAccomodations();
      });
    };
    return loadAccomodations();
  }
]);

angular.module('nuca.controllers').controller('ConfirmRequestController', [
  '$scope', '$routeParams', 'toastr', 'API', function($scope, $routeParams, toastr, API) {
    var loadRequest;
    loadRequest = function() {
      return API.Request.query({
        id: $routeParams.id
      }, function(data) {
        return $scope.request = data[0];
      });
    };
    $scope.removeCat = function(cat) {
      var idx;
      if (!confirm('Sunteti sigur ca doriti sa stergeti aceasta inregistrare?')) {
        return;
      }
      idx = $scope.request.cats.indexOf(cat);
      return $scope.request.cats.splice(idx, 1);
    };
    $scope.addCat = function() {
      return $scope.request.cats.push({});
    };
    $scope.updateRequest = function() {
      if (!confirm('Sunteti sigur ca doriti sa trimiteti mai departe aceasta cerere?')) {
        return;
      }
      $scope.editForm.$setPristine();
      return API.Request.update({
        id: $routeParams.id
      }, $scope.request, function(data) {
        toastr.success('Cerere trimisa cu succes');
        return $scope.goto('/');
      });
    };
    return loadRequest();
  }
]);

angular.module('nuca.controllers').controller('NewRequestController', [
  '$scope', 'API', function($scope, API) {
    $scope.request = {
      status: $scope.Const.Status.New,
      cats: [{}]
    };
    return $scope.createRequest = function() {
      return API.Request.add($scope.request, function(data) {
        return $scope.goto('/confirmare_cerere/' + data.id);
      });
    };
  }
]);

angular.module('nuca.controllers').controller('RequestsMapController', [
  '$scope', 'API', function($scope, API) {
    var loadAccomodations, loadMarkersFromAccomodations, loadMarkersFromRequests, searchRequests;
    $scope.filter = {};
    $scope.mapControl = {};
    $scope.map = {
      center: {
        latitude: 46.766667,
        longitude: 23.58333300000004
      },
      zoom: 17,
      markers: []
    };
    loadAccomodations = function() {
      return API.Accomodation.query({}, function(data) {
        $scope.accomodations = data;
        return loadMarkersFromAccomodations();
      });
    };
    searchRequests = function() {
      var param;
      param = {};
      if ($scope.filter.reporter_name) {
        param.reporter_name = $scope.filter.reporter_name;
      }
      if ($scope.filter.status) {
        param.status = $scope.filter.status;
      }
      return API.Request.query(param, function(data) {
        $scope.requests = data;
        return loadMarkersFromRequests();
      });
    };
    loadMarkersFromAccomodations = function() {
      var acc, marker, _i, _len, _ref, _results;
      $scope.map.markers = $scope.map.markers.where(function(m) {
        return m.type !== $scope.Const.MarkerType.Accomodation;
      });
      _ref = $scope.accomodations;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        acc = _ref[_i];
        marker = {
          id: acc.id,
          location: acc.location,
          title: acc.name,
          type: $scope.Const.MarkerType.Accomodation,
          icon: 'imgs/blue-dot.png'
        };
        _results.push($scope.map.markers.push(marker));
      }
      return _results;
    };
    loadMarkersFromRequests = function() {
      var marker, request, _i, _len, _ref, _results;
      $scope.map.markers = $scope.map.markers.where(function(m) {
        return m.type !== $scope.Const.MarkerType.Request;
      });
      _ref = $scope.requests;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        request = _ref[_i];
        marker = {
          id: request.id,
          location: request.location,
          title: request.reporter_name,
          type: $scope.Const.MarkerType.Request
        };
        _results.push($scope.map.markers.push(marker));
      }
      return _results;
    };
    $scope.$watch('filter', function(newValue, oldValue) {
      return searchRequests();
    }, true);
    loadAccomodations();
    return searchRequests();
  }
]);

angular.module('nuca').directive("datetimeInput", function() {
  return {
    restrict: "E",
    require: "?ngModel",
    scope: {
      ngModel: "="
    },
    templateUrl: "scripts/directives/datetimeInput.html",
    replace: true,
    link: function(scope, element, attrs, ctrl) {
      scope.status = {
        open: false
      };
      scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        return scope.status.open = !scope.status.open;
      };
      return scope.clear = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        return ctrl.$setViewValue(null);
      };
    }
  };
});

angular.module('nuca').directive("locationInput", [
  "$timeout", "uiGmapGoogleMapApi", function($timeout, uiGmapGoogleMapApi) {
    return {
      restrict: "E",
      require: "?ngModel",
      scope: {
        ngModel: "="
      },
      templateUrl: "scripts/directives/locationInput.html",
      replace: false,
      controller: function($scope, $element, $attrs) {
        var reverseGeocode, setModel;
        $scope.searchbox = {
          events: {
            places_changed: function(searchBox) {
              var place;
              place = searchBox.getPlaces()[0];
              if (!place) {
                return;
              }
              setModel(place.geometry.location);
              return $scope.map.center = angular.copy($scope.ngModel);
            }
          }
        };
        $scope.mapControl = {};
        $scope.map = {
          center: {
            latitude: 46.766667,
            longitude: 23.58333300000004
          },
          zoom: 17,
          events: {
            click: function(map, eventName, args) {
              return $scope.$apply(function() {
                return setModel(args[0].latLng);
              });
            }
          }
        };
        $scope.marker = {
          id: 0,
          options: {
            draggable: true
          },
          coords: $scope.ngModel || {
            latitude: 0,
            longitude: 0
          },
          events: {}
        };
        $scope.window = {
          options: {
            visible: true
          }
        };
        setModel = function(latLng) {
          if ($scope.ngModel == null) {
            $scope.ngModel = {};
          }
          $scope.ngModel.latitude = latLng.lat();
          $scope.ngModel.longitude = latLng.lng();
          return $scope.$parent.editForm.$setDirty();
        };
        reverseGeocode = function() {
          if ($scope.ngModel == null) {
            return;
          }
          return uiGmapGoogleMapApi.then(function(maps) {
            var geocoder, latlng, loadMap;
            loadMap = true;
            geocoder = new maps.Geocoder();
            latlng = new maps.LatLng($scope.ngModel.latitude, $scope.ngModel.longitude);
            return geocoder.geocode({
              'latLng': latlng
            }, function(results, status) {
              if (status === maps.GeocoderStatus.OK) {
                return $scope.$apply(function() {
                  if (results[0]) {
                    return $scope.window.content = results[0].formatted_address;
                  }
                });
              } else {
                return console.log("Geocoder failed due to: " + status);
              }
            });
          });
        };
        $scope.$watch('ngModel', function(newValue, oldValue) {
          if ($scope.marker.coords.latitude === 0 && newValue) {
            $scope.marker.coords = newValue;
            $scope.map.center = angular.copy(newValue);
          }
          return reverseGeocode();
        }, true);
        if ($scope.ngModel != null) {
          $scope.map.center = angular.copy($scope.ngModel);
        }
        return $timeout(function() {
          if ($scope.mapControl.refresh != null) {
            return $scope.mapControl.refresh($scope.ngModel);
          }
        });

        /*
        Temorarly remove geolocation, not stable
        navigator.geolocation.getCurrentPosition (pos) ->
          $scope.$apply () ->
            return if $scope.ngModel #do not center if we already have a marked zone
            $scope.map.center = { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
            return
         */
      }
    };
  }
]);

angular.module('nuca').directive("picturesInput", [
  function() {
    return {
      restrict: "E",
      require: "?ngModel",
      scope: {
        ngModel: "="
      },
      templateUrl: "scripts/directives/picturesInput.html",
      replace: false,
      link: function(scope, element, attrs) {}
    };
  }
]);

angular.module('nuca').config([
  '$routeProvider', function($routeProvider) {
    var angularRedirect, resolveAuth;
    resolveAuth = {
      auth: [
        '$q', '$location', 'Const', 'Login', function($q, $location, Const, Login) {

          /*
          if !Login.isAuthenticated() && Const.IsAuthPage($location.path())
            if $location.path() != '/' 
              Login.redirectToLogin(true)
            else
              $location.path '/coming_soon' #send to coming soon if the user requested the root '/'
            
            return $q.reject authenticated: false
           */
        }
      ]
    };
    angularRedirect = function(current, path, search) {
      if (search.goto) {
        return "/" + search.goto;
      } else {
        return "/";
      }
    };
    $routeProvider.when('/', {
      controller: 'HomeController',
      templateUrl: 'views/home.html',
      redirectTo: angularRedirect,
      resolve: resolveAuth,
      label: 'Home'
    });
    $routeProvider.when('/administrare/cazari', {
      controller: 'AccomodationsController',
      templateUrl: 'views/accomodations/accomodations.html',
      resolve: resolveAuth
    });
    $routeProvider.when('/cerere_noua', {
      controller: 'NewRequestController',
      templateUrl: 'views/requests/new_request.html'
    });
    $routeProvider.when('/confirmare_cerere/:id', {
      controller: 'ConfirmRequestController',
      templateUrl: 'views/requests/confirm_request.html'
    });
    $routeProvider.when('/administrare/harta', {
      controller: 'RequestsMapController',
      templateUrl: 'views/requests/requests_map.html',
      resolve: resolveAuth
    });
    return $routeProvider.otherwise({
      redirectTo: '/'
    });
  }
]).config([
  'toastrConfig', function(toastrConfig) {
    return angular.extend(toastrConfig, {
      allowHtml: true,
      closeButton: false,
      closeHtml: "<button>&times;</button>",
      containerId: "toast-container",
      extendedTimeOut: 1000,
      iconClasses: {
        error: "toast-error",
        info: "toast-info",
        success: "toast-success",
        warning: "toast-warning"
      },
      messageClass: "toast-message",
      positionClass: "toast-bottom-right",
      tapToDismiss: true,
      timeOut: 5000,
      titleClass: "toast-title",
      toastClass: "toast"
    });
  }
]).filter('html', [
  '$sce', function($sce) {
    return function(input) {
      return $sce.trustAsHtml(input);
    };
  }
]).run([
  '$rootScope', '$location', '$anchorScroll', 'amMoment', function($rootScope, $location, $anchorScroll, amMoment) {
    amMoment.changeLocale('ro');
    return $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
      $location.hash('top-content');
      $anchorScroll();
      return $location.hash('');
    });
  }
]).config(function(uiGmapGoogleMapApiProvider) {
  return uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyB16sGmIekuGIvYOfNoW9T44377IU2d2Es',
    v: '3.17',
    libraries: 'places'
  });
});

angular.module('nuca.config').constant('Config', {
  apiHost: '/',
  presetAdminLogin: false,
  googleAnalyticsAccount: 'UA-55626287-1',
  facebookAppId: '1499870690291074'
});

angular.module('nuca.constants').constant('Const', {
  Gender: {
    Male: 0,
    Female: 1
  },
  Status: {
    New: 1,
    Confirmed: 2,
    Transport: 3,
    Accomodated: 4,
    Returned: 5
  },
  MarkerType: {
    Accomodation: 1,
    Reuquest: 2
  }
});

angular.module('nuca.login').factory('Login', [
  '$window', '$location', '$rootScope', '$q', 'Const', 'API', 'DataHandler', function($window, $location, $rootScope, $q, Const, API, DataHandler) {
    var login;
    login = {
      TODO: "implement"
    };
    return login;
  }
]);

angular.module('nuca.services').factory('API', [
  "$resource", "Config", function($resource, Config) {
    var api, createService, mapping, mappings, _i, _len;
    mappings = [
      {
        name: 'Request',
        url: 'requests.json'
      }, {
        name: 'Accomodation',
        url: 'accomodations.json'
      }
    ];
    createService = function(name, url) {
      return $resource(Config.apiHost + url, {}, {
        update: {
          method: "PUT"
        },
        add: {
          method: "POST"
        },
        annihilate: {
          method: "DELETE"
        },
        query: {
          method: 'GET',
          isArray: true
        }
      });
    };
    api = {};
    for (_i = 0, _len = mappings.length; _i < _len; _i++) {
      mapping = mappings[_i];
      api[mapping.name] = createService(mapping.name, mapping.url);
    }
    return api;
  }
]).factory('DataHandler', [
  '$q', 'API', function($q, API) {
    return {
      uiSanitizeIds: function(data, sanitize) {
        var prop;
        for (prop in data) {
          if (prop.endsWith('_id')) {
            if (data[prop] == null) {
              data[prop] = (sanitize ? void 0 : null);
            }
          }
        }
      },
      makePromise: function(klass, method, params, data) {
        var d;
        d = $q.defer();
        this.uiSanitizeIds(data, false);
        klass[method](params, data, (function(_this) {
          return function(result) {
            _this.uiSanitizeIds(result, true);
            return d.resolve(result);
          };
        })(this), (function(_this) {
          return function(error) {
            return d.reject(error);
          };
        })(this));
        return d.promise;
      },
      process: function(array, callback, callbackErr) {
        var model, promiseArray, _i, _len;
        promiseArray = [];
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          model = array[_i];
          if (!model) {
            continue;
          }
          if (model[2] == null) {
            model[2] = {};
          }
          if (model[3] == null) {
            model[3] = {};
          }
          if (model[4] == null) {
            model[4] = {};
          }
          promiseArray.push(this.makePromise(model[0], model[1], model[2], model[3], model[4]));
        }
        return $q.all(promiseArray).then(callback, callbackErr);
      }
    };
  }
]).config([
  '$httpProvider', function($httpProvider) {
    return $httpProvider.interceptors.push([
      '$q', '$rootScope', function($q, $rootScope) {
        return {
          responseError: function(error) {
            var status;
            status = error.status;
            if (status !== 401) {
              $rootScope.$broadcast('Services:responseError', error);
            }
            return $q.reject(error);
          }
        };
      }
    ]);
  }
]);
