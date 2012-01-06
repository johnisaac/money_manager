class Expense < ActiveRecord::Base  
  belongs_to :user
  validates_presence_of :spent_on, :user_id
  validates_numericality_of :amount
  validates :spent_on, :date_format => true
  MONTHS_OF_THE_YEAR = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]
  
  def self.get_expense( user_id, month, year)
    # use the month and the year
    # month is an integer from 1 to 12
    # year is an integer of format YYYY
    # retrieve the start from and end date of the month using the MONTHS_OF_THE_YEAR
    # use these dates to retrieve the expenses between the start date and end date in combination with the year
    # return the returned the expenses.
    month = Integer(month)
    year = Integer(year)
    
    raise "month needs to be an integer between 1 and 12" if( month < 1 ) and ( month > 12 )
    raise "year needs to be in the format YYYY" if( year =~ /\d{4}/i )
    
    begin
      Expense.where({ :user_id => user_id, :spent_on => Expense.start_date( month, year )..Expense.end_date( month, year ) })
    rescue
      nil
    end
  end
  
  def is_leap_year?(month, year)
    if year%400==0 and year%100==0 and year%4==0 and month==2
      return true
    else
      return false
    end
  end
  
  def self.start_date( month, year )
    return Time.parse("#{year}-#{month}-01").to_s.split(" ")[0] if is_valid_date?( month, year )
    return nil
  end
  
  def self.end_date( month, year )
    
    return nil if !is_valid_date?( month, year )
    if month == 2
      return Time.parse("#{year}-#{month}-29").to_s.split(" ")[0]
    else
      return Time.parse("#{year}-#{month}-#{MONTHS_OF_THE_YEAR[month-1]}").to_s.split(" ")[0]
    end
  end
  
  private
  def self.is_valid_date?( month, year )
    is_valid_year?( year ) and is_valid_month?( month )
  end
  
  def self.is_valid_year?(year)
    begin
      year = Integer(year)
      return false if year.nil? or ( year < 1000 or year > 9999 )
      return true
    rescue
      return false
    end
  end
  
  def self.is_valid_month?(month)
    begin
      month = Integer(month)
      return false if month.nil? or ( month < 1 or month > 12)
      return true
    rescue
      return false
    end
  end
end
