require 'test_helper'

class ExpenseTest < ActiveSupport::TestCase
  def setup
    @expense = {
      :reason => "Eating",
      :spent_on => DateTime.now,
      :amount => 100.50,
      :user_id => 1
    }
  end
  
  # def test_should_have_a_reason
  #   exp = Expense.new(@expense.merge(:reason => nil))
  #   assert !exp.valid?,"Expense should have a reason."
  # end
  
  def test_should_have_a_non_nil_amount
    exp = Expense.new(@expense.merge(:amount => nil))
    assert !exp.valid?,"Expense should have an non-nil amount."
  end
  
  def test_expense_should_have_a_non_nil_user_id
    exp = Expense.new(@expense.merge(:user_id => nil))
    assert !exp.valid?,"Expense should have a non nil integer."    
  end
  # def test_should_have_an_amount_greater_than_zero
  #   exp = Expense.new(@expense.merge(:amount => 0.0))
  #   assert !exp.valid?,"Expense should have an amount greater than zero."
  # end
  
  def test_should_have_a_valid_spent_on
    exp = Expense.new(@expense.merge(:spent_on => "0.0"))
    assert !exp.valid?,"Expense should have a valid spent_on"
  end
  
  def test_should_accept_a_valid_expense
    exp = Expense.new(@expense)
    assert exp.valid?,"Expense should accept a valid expense"
  end
  
  def test_start_date_should_return_beginning_date
    date = Expense.start_date(12, 2008)
    assert_equal date, "2008-12-01"
  end
  
  def test_end_date_should_return_month_ending_date
    date = Expense.end_date(12, 2008)
    assert_equal date, "2008-12-31"
  end
  
  def test_start_date_should_return_correctly_for_a_leap_year
    date = Expense.start_date(2, 2008)
    assert_equal date, "2008-02-01"
  end
  
  def test_expense_should_only_return_the_correct_user_related_expenses
    exp = Expense.new(@expense.merge(:spent_on => "0.0"))
  end
  
  def test_is_valid_year?
    assert !Expense.send(:is_valid_year?, 200),"Year should be in the format YYYY"    
    assert !Expense.send(:is_valid_year?, 200),"Year should be in the format YYYY"    
    assert !Expense.send(:is_valid_year?, 00),"Year should be in the format YYYY"    
    assert !Expense.send(:is_valid_year?, 0),"Year should be in the format YYYY"    
    assert !Expense.send(:is_valid_year?, "nil"),"Year should be in the format YYYY"    
    assert !Expense.send(:is_valid_year?, nil),"Year should be in the format YYYY"    
  end

  def test_is_valid_year?
    assert Expense.send(:is_valid_year?, 2000) 
  end
  
  def test_is_valid_year?
    assert !Expense.send(:is_valid_month?, 200),"month needs to be an integer between 1 and 12" 
    assert !Expense.send(:is_valid_month?, 200),"month needs to be an integer between 1 and 12"   
    assert !Expense.send(:is_valid_month?, 00),"month needs to be an integer between 1 and 12"    
    assert !Expense.send(:is_valid_month?, 0),"month needs to be an integer between 1 and 12" 
    assert !Expense.send(:is_valid_month?, "nil"),"month needs to be an integer between 1 and 12"    
    assert !Expense.send(:is_valid_month?, nil),"month needs to be an integer between 1 and 12"   
  end
  
  def test_is_valid_year?
    assert Expense.send(:is_valid_month?, 2) 
  end
  
  def test_start_date_should_return_a_correcty_formatted_date_in_the_YYYY_MM_DD_format
    assert_equal Expense.start_date( 2, 2008 ), "2008-02-01"
  end
  
  def test_start_date_should_return_nil_incase_of_an_incorrect_month_or_year
    assert_nil Expense.start_date( 21, 2008 )
  end
  
  def test_end_date_should_return_a_correcty_formatted_date_in_the_YYYY_MM_DD_format
    assert_equal Expense.end_date( 3, 2008 ), "2008-03-31"
  end
  
  def test_end_date_should_return_nil_incase_of_an_incorrect_month_or_year
    assert_nil Expense.end_date( 21, 2008 )
  end
  
end
