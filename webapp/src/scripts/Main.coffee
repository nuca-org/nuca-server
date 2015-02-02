NUCA = {} if !NUCA

angular.module 'nuca', [
    'ngResource'
    'ngRoute'
    'ngAnimate'
    'ui.bootstrap'
    'angularMoment'
    'toastr'
    #'facebook'
    'nuca.config'
    'nuca.constants'
    'nuca.services'
    'nuca.login'
    'nuca.controllers'
  ]

angular.module 'nuca.config', []
angular.module 'nuca.constants', []
angular.module 'nuca.services', ['ngResource', 'nuca.config', 'nuca.constants']
angular.module 'nuca.login', ['nuca.services']
angular.module 'nuca.controllers', []
