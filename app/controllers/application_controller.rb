class ApplicationController < ActionController::Base
  #protect_from_forgery
  
  def load_session( user )
    session[:first_name] = user[:user][:first_name]
    session[:last_name] = user[:user][:last_name]
    session[:id] = user[:user][:id]
  end
  
  def user_signed_in?
    return false if session[:id].nil?
    return true
  end
   
  helper_method :load_session, :user_signed_in?
end
