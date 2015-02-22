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

angular.module('nuca', ['ngResource', 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'angularMoment', 'toastr', 'ui.utils', 'uiGmapgoogle-maps', 'nuca.config', 'nuca.constants', 'nuca.services', 'nuca.login', 'nuca.controllers']);

angular.module('nuca.config', []);

angular.module('nuca.constants', []);

angular.module('nuca.services', ['ngResource', 'nuca.config', 'nuca.constants']);

angular.module('nuca.login', ['nuca.services']);

angular.module('nuca.controllers', []);

angular.module('nuca.controllers').controller('HomeController', [
  '$scope', 'API', 'toastr', function($scope, API, toastr) {
    $scope.date = new Date();
    return $scope.daiUna = function() {
      var entry;
      entry = {
        reporter_name: 'Corhas'
      };
      return API.SterilizationReq.add(entry, function(data) {
        return alert('aaaaa');
      });
    };
  }
]);

angular.module('nuca.controllers').controller('MainController', [
  '$scope', '$location', '$window', '$modal', 'toastr', 'Config', 'Constants', 'Login', 'API', function($scope, $location, $window, $modal, toastr, Config, Constants, Login, API) {
    var initMain;
    $scope.Config = Config;
    $scope.Constants = Constants;
    $scope.Login = Login;
    $scope.copyrightYear = (new Date()).getFullYear();
    $scope.genders = [
      {
        name: 'Nu stiu'
      }, {
        id: 'M',
        name: 'Mascul'
      }, {
        id: 'F',
        name: 'Femela'
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
      var i;
      return i = 0;
    };
    return initMain();
  }
]);

angular.module('nuca.controllers').controller('SterilizationReq1Controller', [
  '$scope', 'API', function($scope, API) {
    var events;
    $scope.sterilizationReq = {
      cats: [{}]
    };
    $scope.removeCat = function(cat) {
      var idx;
      if (confirm('Sunteti sigur ca doriti sa eliminati aceasta pisica')) {
        idx = $scope.sterilizationReq.cats.indexOf(cat);
        return $scope.sterilizationReq.cats.splice(idx, 1);
      }
    };
    $scope.addCat = function() {
      return $scope.sterilizationReq.cats.push({});
    };
    $scope.selected = {
      options: {
        visible: false
      },
      templateurl: 'window.tpl.html',
      templateparameter: {}
    };
    $scope.map = {
      center: {
        latitude: 40.1451,
        longitude: -99.6680
      },
      zoom: 17,
      markers: [],
      idkey: 'place_id'
    };
    $scope.options = {
      scrollwheel: false
    };
    events = {
      places_changed: function(searchBox) {
        var bounds, marker, newMarkers, place, places;
        places = searchBox.getPlaces();
        if (places.length === 0) {
          return;
        }
        newMarkers = [];
        bounds = new google.maps.LatLngBounds;
        place = places[0];
        if (place) {
          marker = {
            id: places.indexOf(place),
            place_id: place.place_id,
            name: place.name,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            options: {
              visible: false
            },
            templateurl: 'window.tpl.html',
            templateparameter: place
          };
          newMarkers.push(marker);
          bounds.extend(place.geometry.location);
          $scope.map.center = {
            latitude: marker.latitude,
            longitude: marker.longitude
          };
        }
        $scope.map.bounds = {
          northeast: {
            latitude: bounds.getNorthEast().lat(),
            longitude: bounds.getNorthEast().lng()
          },
          southwest: {
            latitude: bounds.getSouthWest().lat(),
            longitude: bounds.getSouthWest().lng()
          }
        };
        _.each(newMarkers, function(marker) {
          marker.closeClick = function() {
            $scope.selected.options.visible = false;
            marker.options.visble = false;
            return $scope.$apply();
          };
          marker.onClicked = function() {
            $scope.selected.options.visible = false;
            $scope.selected = marker;
            $scope.selected.options.visible = true;
          };
        });
        $scope.map.markers = newMarkers;
      }
    };
    $scope.searchbox = {
      template: 'searchbox.tpl.html',
      events: events
    };
    return navigator.geolocation.getCurrentPosition(function(pos) {
      $scope.map.center = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      };
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });
  }
]).controller('WindowCtrl', [
  '$scope', function($scope) {
    $scope.place = {};
    return $scope.showPlaceDetails = function(param) {
      return $scope.place = param;
    };
  }
]);

angular.module('nuca').config([
  '$routeProvider', function($routeProvider) {
    var angularRedirect, resolveAuth;
    resolveAuth = {
      auth: [
        '$q', '$location', 'Constants', 'Login', function($q, $location, Constants, Login) {

          /*
          if !Login.isAuthenticated() && Constants.IsAuthPage($location.path())
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
    $routeProvider.when('/new_request', {
      controller: 'SterilizationReq1Controller',
      templateUrl: 'views/sterilization_req/sterilization_req1.html',
      resolve: resolveAuth,
      label: 'BREADCRUMBS'
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
  '$rootScope', '$location', '$anchorScroll', function($rootScope, $location, $anchorScroll) {
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

angular.module('nuca.constants').constant('Constants', {
  Sex: {
    Mascul: 0,
    Femela: 1,
    Rejected: 2
  }
});

angular.module('nuca.login').factory('Login', [
  '$window', '$location', '$rootScope', '$q', 'Constants', 'API', 'DataHandler', function($window, $location, $rootScope, $q, Constants, API, DataHandler) {
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
        name: 'SterilizationReq',
        url: 'sterilization_req.json'
      }
    ];
    createService = function(name, url) {
      return $resource(Config.apiHost + url, {}, {
        update: {
          method: "PATCH"
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
