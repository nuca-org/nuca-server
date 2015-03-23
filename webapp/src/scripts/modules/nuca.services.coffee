angular.module 'nuca.services'

.factory 'API', ["$resource", "Config", ($resource, Config) ->
  
  mappings = [
    # hospital
    { name: 'SterilizationReq', url: 'sterilization_req.json' }
    { name: 'Accomodation', url: 'accomodations.json' }
  ]
 
  createService = (name, url) ->
    return $resource Config.apiHost + url, {},
        update:
          method: "PUT"
        add:
          method: "POST"
        annihilate:
          method: "DELETE"
        query:  
          method:'GET'
          isArray: true  
  
  api = {}

  for mapping in mappings
    api[mapping.name] = createService(mapping.name, mapping.url)

  return api
]

.factory 'DataHandler', ['$q', 'API', ($q, API) ->
  # DataHandler is used to make the initial queries of a controller.
  # It uses the Angular $q promissed/defered implementation to query
  # data which takes time to load from the database
  # Not using this will cause unexpected headaches
  # Can also be used to update the data inside the database.
  return {
    #this method is used to change null id's passed to select lists into undefined, to avoid empty items creation
    #vice versa as well to give the ability on the user to set null (as undefined is ignored by the server)
    uiSanitizeIds: (data, sanitize) ->
      for prop of data
        if (prop.endsWith('_id'))
          data[prop] ?= (if sanitize then undefined else null)
      return
      
    # klass - the resource
    # method - the method on the $resource the $q service should call
    # params - params for the query
    makePromise: (klass, method, params, data) ->
      d = $q.defer()
      @uiSanitizeIds(data, false)
      klass[method](params, data
      , (result) => 
        @uiSanitizeIds(result, true)
        d.resolve(result)
      , (error) => 
        d.reject(error)
      )
      d.promise

    process: (array, callback, callbackErr) ->
      promiseArray = []

      for model in array
        continue if !model
        model[2] ?= {}
        model[3] ?= {}
        model[4] ?= {}
        promiseArray.push @makePromise(model[0], model[1], model[2], model[3], model[4])

      $q.all(promiseArray).then(callback, callbackErr)
  }
]

.config ['$httpProvider', ($httpProvider) ->
  $httpProvider.interceptors.push ['$q', '$rootScope', ($q, $rootScope) ->
    responseError: (error) ->
      status = error.status
      if status isnt 401
        $rootScope.$broadcast 'Services:responseError', error
      $q.reject error
  ]
]




