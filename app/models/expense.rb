class Expense < ActiveRecord::Base  
  validates_presence_of :reason, :amount
  validates_numericality_of :amount, :greater_than => 0.0
  validates :spent_on, :date_format => true
end
