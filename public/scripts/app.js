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

angular.module('nuca', ['ngResource', 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'angularMoment', 'toastr', 'nuca.config', 'nuca.constants', 'nuca.services', 'nuca.login', 'nuca.controllers']);

angular.module('nuca.config', []);

angular.module('nuca.constants', []);

angular.module('nuca.services', ['ngResource', 'nuca.config', 'nuca.constants']);

angular.module('nuca.login', ['nuca.services']);

angular.module('nuca.controllers', []);

angular.module('nuca.controllers').controller('HomeController', [
  '$scope', 'API', function($scope, API) {
    return $scope.date = new Date();
  }
]);

angular.module('nuca.controllers').controller('MainController', [
  '$scope', '$location', '$window', '$modal', 'toastr', 'Config', 'Constants', 'Login', 'API', function($scope, $location, $window, $modal, toastr, Config, Constants, Login, API) {
    var initMain;
    $scope.Config = Config;
    $scope.Constants = Constants;
    $scope.Login = Login;
    $scope.copyrightYear = (new Date()).getFullYear();
    $scope.goto = function(target) {
      return $location.path(target);
    };
    $scope.getCurrentPath = function() {
      return $location.path().toLowerCase();
    };
    $scope.$on('Services:responseError', function(event, error) {
      return toastr.error($translate.instant('MESSAGES.SERVER_ERROR', {
        error: '<br/>' + error.status + ' ' + error.statusText
      }));
    });
    initMain = function() {
      var i;
      return i = 0;
    };
    return initMain();
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
]).config([
  '$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
    return $locationProvider.hashPrefix('!');
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
]);

angular.module('nuca.config').constant('Config', {
  apiHost: '/',
  presetAdminLogin: false,
  googleAnalyticsAccount: 'UA-55626287-1',
  facebookAppId: '1499870690291074'
});

angular.module('nuca.constants').constant('Constants', {
  DOMO: {
    Pending: 0,
    Confirmed: 1,
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
        name: 'User',
        url: 'api/users/:id.json'
      }, {
        name: 'UserLogged',
        url: 'api/user/:id.json'
      }, {
        name: 'UserProfile',
        url: 'api/users/:user_id/profiles/:id.json'
      }, {
        name: 'UserUniqueEmail',
        url: 'api/unique_email.json'
      }, {
        name: 'UserChangePassword',
        url: 'api/users/:id/change_password.json'
      }, {
        name: 'ResourceLinkrCode',
        url: 'api/:resource_type/:resource_id/linkr_code.json'
      }, {
        name: 'ResourceAddress',
        url: 'api/:resource_type/:resource_id/addresses/:id.json'
      }, {
        name: 'Dashboard',
        url: 'api/dashboard/:profile_type_id.json'
      }, {
        name: 'AgeGroup',
        url: 'api/age_groups.json'
      }, {
        name: 'ClubType',
        url: 'api/club_types.json'
      }, {
        name: 'ProfileType',
        url: 'api/profile_types.json'
      }, {
        name: 'Country',
        url: 'api/countries.json'
      }, {
        name: 'Language',
        url: 'api/languages.json'
      }, {
        name: 'Address',
        url: 'api/addresses/:id.json'
      }, {
        name: 'NotificationTemplate',
        url: 'api/notification_templates.json'
      }, {
        name: 'SportLicenseCategory',
        url: 'api/sports/:sport_id/license_categories.json'
      }, {
        name: 'SportFieldPosition',
        url: 'api/sports/:sport_id/field_positions.json'
      }, {
        name: 'Segment',
        url: 'api/segments.json'
      }, {
        name: 'SportInterest',
        url: 'api/sport_interests.json'
      }, {
        name: 'SportFacility',
        url: 'api/sport_facilities/:id.json'
      }, {
        name: 'ProfileSnapshot',
        url: 'api/profile_snapshots/:id.json'
      }, {
        name: 'Structure',
        url: 'api/structures/:id.json'
      }, {
        name: 'StructureSportFacility',
        url: 'api/structures/:structure_id/sport_facilities/:id.json'
      }, {
        name: 'Sport',
        url: 'api/sports.json'
      }, {
        name: 'SportSeason',
        url: 'api/sports/:sport_id/seasons.json'
      }, {
        name: 'SportSeasonCurrent',
        url: 'api/sports/:sport_id/season.json'
      }, {
        name: 'Event',
        url: 'api/events/:id.json'
      }, {
        name: 'EventInstance',
        url: 'api/event_instances.json'
      }, {
        name: 'EventEventInstance',
        url: 'api/events/:event_id/event_instances/:id.json'
      }, {
        name: 'EventStatus',
        url: 'api/event_statuses.json'
      }, {
        name: 'EventType',
        url: 'api/event_types.json'
      }, {
        name: 'EventCancellationType',
        url: 'api/event_cancellation_types.json'
      }, {
        name: 'Team',
        url: 'api/teams/:id.json'
      }, {
        name: 'Profile',
        url: 'api/profiles/:id.json'
      }, {
        name: 'ProfilePermissionType',
        url: 'api/profiles/:profile_id/permission_types.json'
      }, {
        name: 'ProfileProfileData',
        url: 'api/profiles/:profile_id/profile_data/:id.json'
      }, {
        name: 'Message',
        url: 'api/messages/:id.json'
      }, {
        name: 'MessageMarkAsRead',
        url: 'api/messages/:id/mark_as_read.json'
      }, {
        name: 'Invitation',
        url: 'api/invitations/:id.json'
      }, {
        name: 'InvitationActivate',
        url: 'api/invitations/:id/activate.json'
      }, {
        name: 'PageSizes',
        url: 'api/page_sizes.json'
      }, {
        name: 'JWT',
        url: 'api/jwt.json'
      }, {
        name: 'ResetPassword',
        url: 'api/reset_password.json'
      }, {
        name: 'ResetPasswordToken',
        url: 'api/reset_password/token.json'
      }, {
        name: 'RecoverPassword',
        url: 'api/recover_password.json'
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
