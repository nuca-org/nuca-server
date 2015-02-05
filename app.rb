require 'ki'

class SterilizationReq < Ki::Model
  #requires :cat
  #requires :status_details
end

class Cat < Ki::Model
  #required :accomodation_id
end

class StatusDetails < Ki::Model
end

# get current free places for accomodation
# for each sterilization request get number of cats with accomodation_id
# where status details with status acknowledged has date 3 days before
class Accomodations < Ki::Model
end

class User < Ki::Model
  # 'admin', 'nuca', 'area manager'
end