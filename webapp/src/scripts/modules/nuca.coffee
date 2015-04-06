angular.module 'nuca'

.config ['$routeProvider', ($routeProvider) ->

  resolveAuth =
    auth: ['$q', '$location', 'Constants', 'Login', ($q, $location, Constants, Login) ->
      #another hack to skip auth on the activation page
      ###
      if !Login.isAuthenticated() && Constants.IsAuthPage($location.path())
        if $location.path() != '/' 
          Login.redirectToLogin(true)
        else
          $location.path '/coming_soon' #send to coming soon if the user requested the root '/'
        
        return $q.reject authenticated: false
      ###
    ]

  angularRedirect = (current, path, search) ->
    # hacks everywhere
    if search.goto
      # if we were passed in a search param, and it has a path
      # to redirect to, then redirect to that path
      return "/" + search.goto
    else
      # else just redirect back to this location
      # angular is smart enough to only do this once.
      return "/"

  $routeProvider.when '/', controller: 'HomeController', templateUrl: 'views/home.html', redirectTo: angularRedirect, resolve: resolveAuth, label: 'Home'
  #---- accomodations ------
  $routeProvider.when '/gestiune_cazari', controller: 'AccomodationsController', templateUrl: 'views/accomodations/accomodations.html', resolve: resolveAuth
  #---- sterilization requets ------
  $routeProvider.when '/cerere_noua', controller: 'NewRequestController', templateUrl: 'views/requests/new_request.html'
  $routeProvider.when '/confirmare_cerere/:id', controller: 'ConfirmRequestController', templateUrl: 'views/requests/confirm_request.html'
  

  $routeProvider.otherwise redirectTo: '/'
]

.config ['toastrConfig', (toastrConfig) ->
  angular.extend toastrConfig,
    allowHtml: true
    closeButton: false
    closeHtml: "<button>&times;</button>"
    containerId: "toast-container"
    extendedTimeOut: 1000
    iconClasses:
      error: "toast-error"
      info: "toast-info"
      success: "toast-success"
      warning: "toast-warning"

    messageClass: "toast-message"
    positionClass: "toast-bottom-right"
    tapToDismiss: true
    timeOut: 5000
    titleClass: "toast-title"
    toastClass: "toast"
]

# TODO sry the framework does not support non-angular routing for now

#.config ['$locationProvider', ($locationProvider) ->
  #$locationProvider.html5Mode(true)
  ## TODO evaluate if we need
  #$locationProvider.hashPrefix('!')
#]

#.config ['FacebookProvider', 'Config', (FacebookProvider, Config) ->
#  FacebookProvider.init Config.facebookAppId
#]

.filter 'html', ['$sce', ($sce) ->
  return (input) ->
    return $sce.trustAsHtml(input);
]

.run ['$rootScope', '$location', '$anchorScroll', 'amMoment', ($rootScope, $location, $anchorScroll, amMoment) ->
  
  amMoment.changeLocale('ro');
  #scroll back to the top of the content upon view change
  $rootScope.$on '$routeChangeSuccess', (newRoute, oldRoute) ->
    $location.hash('top-content');
    $anchorScroll(); 
    $location.hash('');
]

.config (uiGmapGoogleMapApiProvider) ->
    uiGmapGoogleMapApiProvider.configure
        key: 'AIzaSyB16sGmIekuGIvYOfNoW9T44377IU2d2Es',
        v: '3.17',
        libraries: 'places'

