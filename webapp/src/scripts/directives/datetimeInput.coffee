angular.module 'nuca'

.directive "datetimeInput", () ->
  restrict: "E"
  require: "?ngModel"

  scope:
    ngModel: "="

  templateUrl: "scripts/directives/datetimeInput.html"
  replace: true

  link: (scope, element, attrs, ctrl) ->
    scope.status =
      open: false

    scope.open = ($event) ->
      $event.preventDefault()
      $event.stopPropagation()

      scope.status.open = !scope.status.open

    scope.clear = ($event) ->
      $event.preventDefault()
      $event.stopPropagation()

      ctrl.$setViewValue null


