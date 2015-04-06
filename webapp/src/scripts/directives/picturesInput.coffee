angular.module 'nuca'

.directive "picturesInput", [ () ->
  restrict: "E"
  require: "?ngModel"

  scope:
    ngModel: "="

  templateUrl: "scripts/directives/picturesInput.html"

  replace: false

  link: (scope, element, attrs) ->

]

