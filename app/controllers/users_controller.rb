class UsersController < ApplicationController
  def new

  end

  def create
    user = User.create_or_login_user(env['omniauth.auth'])
    if !user.nil?
      load_session( user ) 
      redirect_to expenses_path
    else
      redirect_to new_user_path
    end
  end
  
  def edit
  end

  def show
  end
  
  def sign_out
    session[:first_name] = nil
    session[:last_name] = nil
    session[:id] = nil
    redirect_to new_user_path
  end
end
