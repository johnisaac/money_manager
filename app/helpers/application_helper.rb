module ApplicationHelper
  def is_valid_spent_on(object, attribute)
    begin
       Date.parse(record["spent_on"])
     rescue
       object.errors[:spent_on] << " should be valid."
     end
  end
end
