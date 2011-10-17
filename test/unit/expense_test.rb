require 'test_helper'

class ExpenseTest < ActiveSupport::TestCase
  def setup
    @expense = {
      :reason => "Eating",
      :spent_on => Time.now,
      :amount => 100.50
    }
  end
  
  def test_should_have_a_reason
    exp = Expense.new(@expense.merge(:reason => nil))
    #assert_invvalid? exp
  end
end
