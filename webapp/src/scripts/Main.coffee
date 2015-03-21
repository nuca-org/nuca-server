NUCA = {} if !NUCA

angular.module 'nuca', [
    'ngResource'
    'ngRoute'
    'ngAnimate'
    'ui.bootstrap'
    'angularMoment'
    'toastr'
    'ui.utils'
    'uiGmapgoogle-maps'
    'ui.bootstrap.datetimepicker'
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
