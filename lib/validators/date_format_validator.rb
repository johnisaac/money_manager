class DateFormatValidator < ActiveModel::Validator
  def validate(record)
    begin
      spent_on = record[:spent_on].to_s.split
      spent_on.pop
      Date.parse( spent_on.join(" ") )
    rescue
      record.errors[:spent_on] << " should be a valid date."
    end
  end
end