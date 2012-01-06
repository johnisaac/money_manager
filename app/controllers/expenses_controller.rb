class ExpensesController < ApplicationController
  # GET /expenses
  # GET /expenses.json
  def index
 
  end

  # GET /expenses/1
  # GET /expenses/1.json
  def show
    @expense = Expense.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @expense }
    end
  end

  # GET /expenses/new
  # GET /expenses/new.json
  def new
    @expense = Expense.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @expense }
    end
  end

  # GET /expenses/1/edit
  def edit
    @expense = Expense.find(params[:id])
  end

  # POST /expenses
  # POST /expenses.json
  def create
    params[:expense][:user_id] = session[:id]
    @expense = Expense.new(params[:expense])
    
    respond_to do |format|
      if @expense.save!
        format.html { redirect_to @expense, notice: 'Expense was successfully created.' }
        format.json { render :json => @expense, :status => 200, location: @expense }
        format.js{ render :json => @expense, :status => 200 }
      else
        format.html { render action: "new" }
        format.json { render json: @expense.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /expenses/1
  # PUT /expenses/1.json
  def update
    @expense = Expense.find(params[:id])

    respond_to do |format|
      if @expense.update_attributes(params[:expense])
        format.html { render :json => @expense, notice: 'Expense was successfully updated.' }
        format.json { render :json => @expense, :status => 200, :location => @expense }
      else
        format.html { render action: "edit" }
        format.json { render json: @expense.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /expenses/1
  # DELETE /expenses/1.json
  def destroy
    @expense = Expense.find(params[:id])
    @expense.destroy

    respond_to do |format|
      format.html { redirect_to expenses_url }
      format.json { head :ok }
    end
  end
  
  def get_expenses
    @expenses = Expense.get_expense( session[:id], params["month"], params["year"]).order("spent_on desc").all

     respond_to do |format|
       format.html { render :json => @expenses }
     end
  end
  
end
