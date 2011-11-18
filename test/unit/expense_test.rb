require 'test_helper'

class ExpenseTest < ActiveSupport::TestCase
  def setup
    @expense = {
      :reason => "Eating",
      :spent_on => DateTime.now,
      :amount => 100.50
    }
  end
  
  def test_should_have_a_reason
    exp = Expense.new(@expense.merge(:reason => nil))
    assert !exp.valid?,"Expense should have a reason."
  end
  
  def test_should_have_a_non_nil_amount
    exp = Expense.new(@expense.merge(:amount => nil))
    assert !exp.valid?,"Expense should have an non-nil amount."
  end
  
  def test_should_have_an_amount_greater_than_zero
    exp = Expense.new(@expense.merge(:amount => 0.0))
    assert !exp.valid?,"Expense should have an amount greater than zero."
  end
  
  def test_should_have_a_valid_spent_on
    exp = Expense.new(@expense.merge(:spent_on => "0.0"))
    assert !exp.valid?,"Expense should have a valid spent_on"
  end
  
  def test_should_accept_a_valid_expense
    exp = Expense.new(@expense)
    puts exp.inspect
    assert exp.valid?,"Expense should accept a valid expense"
  end
  
  def test_start_date_should_return_beginning_date
    date = Expense.start_date(12, 2008)
    assert date == "2008-12-01"
  end
  
  def test_end_date_should_return_month_ending_date
    date = Expense.end_date(12, 2008)
    assert date == "2008-12-31"
  end
end
