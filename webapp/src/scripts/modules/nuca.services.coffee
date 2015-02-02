angular.module 'nuca.services'

.factory 'API', ["$resource", "Config", ($resource, Config) ->
  
  mappings = [
    # user
    { name: 'User', url: 'api/users/:id.json' }
    { name: 'UserLogged', url: 'api/user/:id.json' }
    { name: 'UserProfile', url: 'api/users/:user_id/profiles/:id.json' }
    { name: 'UserUniqueEmail', url: 'api/unique_email.json' }
    { name: 'UserChangePassword', url: 'api/users/:id/change_password.json' }
  
    # generic data
    { name: 'ResourceLinkrCode', url: 'api/:resource_type/:resource_id/linkr_code.json' }
    { name: 'ResourceAddress', url: 'api/:resource_type/:resource_id/addresses/:id.json' }

    # global data
    { name: 'Dashboard', url: 'api/dashboard/:profile_type_id.json' }
    { name: 'AgeGroup', url: 'api/age_groups.json' }
    { name: 'ClubType', url: 'api/club_types.json' }
    { name: 'ProfileType', url: 'api/profile_types.json' }
    { name: 'Country', url: 'api/countries.json' }
    { name: 'Language', url: 'api/languages.json' }
    { name: 'Address', url: 'api/addresses/:id.json' }
    { name: 'NotificationTemplate', url: 'api/notification_templates.json' }
    { name: 'SportLicenseCategory', url: 'api/sports/:sport_id/license_categories.json' }
    { name: 'SportFieldPosition', url: 'api/sports/:sport_id/field_positions.json' }
    { name: 'Segment', url: 'api/segments.json' }
    { name: 'SportInterest', url: 'api/sport_interests.json' }
    { name: 'SportFacility', url: 'api/sport_facilities/:id.json' }
    { name: 'ProfileSnapshot', url: 'api/profile_snapshots/:id.json' }
  
    # structure
    { name: 'Structure', url: 'api/structures/:id.json' }
    { name: 'StructureSportFacility', url: 'api/structures/:structure_id/sport_facilities/:id.json' }
   
    #sport
    { name: 'Sport', url: 'api/sports.json' }
    { name: 'SportSeason', url: 'api/sports/:sport_id/seasons.json' }
    { name: 'SportSeasonCurrent', url: 'api/sports/:sport_id/season.json' }

    # event
    { name: 'Event', url: 'api/events/:id.json' }
    { name: 'EventInstance', url: 'api/event_instances.json' }
    { name: 'EventEventInstance', url: 'api/events/:event_id/event_instances/:id.json' }
    { name: 'EventStatus', url: 'api/event_statuses.json' }
    { name: 'EventType', url: 'api/event_types.json' }
    { name: 'EventCancellationType', url: 'api/event_cancellation_types.json' }

    # team
    { name: 'Team', url: 'api/teams/:id.json' }
  
    # profile
    { name: 'Profile', url: 'api/profiles/:id.json' }
    { name: 'ProfilePermissionType', url: 'api/profiles/:profile_id/permission_types.json' }
    { name: 'ProfileProfileData', url: 'api/profiles/:profile_id/profile_data/:id.json' }

    # invitation #TODO probably will be renamed

    # message
    { name: 'Message', url: 'api/messages/:id.json' }
    { name: 'MessageMarkAsRead', url: 'api/messages/:id/mark_as_read.json' }
    
    # invitation
    { name: 'Invitation', url: 'api/invitations/:id.json' }
    { name: 'InvitationActivate', url: 'api/invitations/:id/activate.json' }

    # page size
    { name: 'PageSizes', url: 'api/page_sizes.json' }

    # JSON Web Token
    { name: 'JWT', url: 'api/jwt.json' }
  
    # Password Reset
    { name: 'ResetPassword', url: 'api/reset_password.json' }
    { name: 'ResetPasswordToken', url: 'api/reset_password/token.json' }
    { name: 'RecoverPassword', url: 'api/recover_password.json' }
  ]
 
  createService = (name, url) ->
    return $resource Config.apiHost + url, {},
        update:
          method: "PATCH"
        add:
          method: "POST"
        annihilate:
          method: "DELETE"
  
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




