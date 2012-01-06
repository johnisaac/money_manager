class User < ActiveRecord::Base
  has_many :expenses
  
  validates_presence_of :provider, :omniauth_id, :first_name
  
  def self.create_or_login_user( env )
    begin    
      provider = retrieve_provider( env )
      uid = retrieve_uid( env )
      name = split_name( env )
      user = User.find_by_omniauth_id( uid )
      if user.nil?
        return create_user( provider, uid, name ) 
      else
        return { :user => user }
      end
    rescue Exception => e
      return nil
    end
  end
  
  def self.create_user( provider, uid, name ) 
    begin
      user = load_user_data( provider, uid, name )
      if user.save
        return { :message => "User is saved.", :user => user }
      else
        return nil
      end
    rescue
      return nil
    end
  end
  
  private
  def self.load_user_data( provider, uid, name )
    user = User.new
    user.provider = provider
    user.first_name = name[:first_name]
    user.last_name = name[:last_name]
    user.omniauth_id = uid
    return user
  end
  
  def self.retrieve_provider( env )
    return env["provider"]  unless env["provider"].nil?
    return nil
  end
  
  def self.retrieve_uid( env )
    return env["uid"] unless env["uid"].nil?
    return nil
  end
  
  def self.split_name( env )
    return nil if env["info"]["name"].nil?
    name = env["info"]["name"]
    name = name.split(" ")
    first_name = name.shift
    last_name = name.join(" ")

    return {
      :first_name => first_name,
      :last_name => last_name
    }
  end
end
