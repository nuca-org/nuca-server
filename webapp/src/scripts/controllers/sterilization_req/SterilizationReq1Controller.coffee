angular.module 'nuca.controllers'

.controller 'SterilizationReq1Controller', ['$scope', 'API', ($scope, API) ->

  $scope.sterilizationReq = 
    cats: [{}]

  $scope.removeCat = (cat) ->
    if confirm('Sunteti sigur ca doriti sa eliminati aceasta pisica')
      idx = $scope.sterilizationReq.cats.indexOf(cat)
      $scope.sterilizationReq.cats.splice(idx, 1)

  $scope.addCat = () ->
    $scope.sterilizationReq.cats.push {}
]
