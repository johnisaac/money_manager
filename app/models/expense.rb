class Expense < ActiveRecord::Base  
  validates_presence_of :spent_on, :amount
  validates_numericality_of :amount
  validates :spent_on, :date_format => true
  MONTHS_OF_THE_YEAR = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]
  
  def self.get_expense( month, year)
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
      Expense.where(:spent_on => Expense.start_date( month, year )..Expense.end_date( month, year ) )
    rescue
      nil
    end
  end
  
  def is_leap_year?(month, year)
    if year%400 == 0 and year%100==0 and year%4==0 and month=2
      return true
    else
      return false
    end
  end
  
  def self.start_date( month, year )
    raise "month needs to be an integer between 1 and 12" if( month < 1 ) and ( month > 12 )
    raise "year needs to be in the format YYYY" if( year =~ /\d{4}/i )
    return Date.parse("#{year}-#{month}-01").beginning_of_day
  end
  
  def self.end_date( month, year )
    raise "month needs to be an integer between 1 and 12" if( month < 1 ) and ( month > 12 )
    if month == 2
      return Date.parse("#{year}-#{month}-29").end_of_day
    else
      return Date.parse("#{year}-#{month}-#{MONTHS_OF_THE_YEAR[month-1]}").end_of_day
    end
  end
end
