class Expense < ActiveRecord::Base  
  validates_presence_of :spent_on, :amount
  validates_numericality_of :amount
  validates :spent_on, :date_format => true
end
