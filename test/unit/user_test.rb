require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def setup
    @user = Factory(:user)
    @env = {
      "info" => {
        "name" => "John Felix"
      },
      "provider" => "twitter",
      "uid" => "222440997"
    }
  end
  
  test "user should not be created when the provider is nil" do
    user = User.create_or_login_user( @env.merge({ "provider" => nil }) )
    assert_nil user, "User is not valid when the provider is nil."
  end
  
  test "user should not be created when the first name is nil" do
    user = User.create_or_login_user( @env.merge({ "info" => {
      "name" => nil 
    }}))
    assert_nil user, "User object is not valid when the name is nil."
  end

  test "user should not be created when the last name is nil" do
    user = User.create_or_login_user( @env.merge({ "info" => {
      "name" => "John" 
    }}))
    assert_not_nil user, "User object is not valid when the last name is nil."
  end
  
  test "name with spaces should be split into first name and last name" do
    split_name = User.send(:split_name, @env)
    assert_equal "John", split_name[:first_name]
    assert_equal "Felix", split_name[:last_name]
  end
  
  test "a_new_user_should_be_created_with_valid_details" do
    user = User.create_or_login_user( @env )
    assert_not_nil user
  end
  
  test "create user should return a message 'User is saved' when a valid user is saved" do
    user = User.create_user("twitter","1231sd313",{:first_name => "Felix" })
    assert_equal user[:message],"User is saved."
    assert_not_nil user[:user]
  end
  
  test "create user should return nil when an invalid user is saved" do
    user = User.create_user("twitter",nil ,{:first_name => "Felix" })
    assert_nil user
    
    user = User.create_user(nil,"132131" ,{:first_name => "Felix" })
    assert_nil user
    
    user = User.create_user("twitter", "12312323",nil)
    assert_nil user
    
    user = User.create_user("twitter",nil ,{ :first_name => nil, :last_name => "Felix" })
    assert_nil user
  end
  
  test "load user data should return the user object with valid input details" do
    user = User.send( :load_user_data, "twitter","13231231", {:first_name => "Felix" })
    assert user.kind_of?User
  end
  
  test "load user data should return the user object with invalid input details" do
    user = User.send( :load_user_data, "twitter", nil, {:first_name => "Felix" })
    assert user.kind_of?User
  end
  
  test "retrieve provider should return the provider when it is not nil" do
    provider = User.send( :retrieve_provider, @env)
    assert_equal "twitter", provider,"Provider value should be retrieved correctly."
  end
  
  test "retrieve provider should return the provider as nil when it is nil" do
    provider = User.send( :retrieve_provider, @env.merge({"provider"=>nil}))
    assert_nil provider,"Provider value should be retrieved correctly."
  end
  
  test "retrieve omniauth_uid should return the omniauth_uid when it is not nil" do
    uid = User.send( :retrieve_uid, @env)
    assert_equal "222440997", uid,"omniauth_uid value should be retrieved correctly."
  end
  
  test "retrieve omniauth_uid should return the omniauth_uid as nil when it is nil" do
    uid = User.send( :retrieve_uid, @env.merge({"uid"=>nil}))
    assert_nil uid,"omniauth_uid value should be retrieved correctly."
  end
end
