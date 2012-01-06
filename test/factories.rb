FactoryGirl.define do
  factory :user do
    first_name "John"
    last_name "Felix"
    email "felix1985@gmail.com"
    omniauth_id "212240997"
    provider "twitter"
    created_at "2012-01-03 00:00:00"
    updated_at "2012-01-03 00:00:00"
  end

  factory :expense do
    id 1
    reason "Freelance Work"
    spent_on "2012-01-03 00:00:00"
    amount "2000"
    created_at "2012-01-03 00:00:00"
    updated_at "2012-01-03 00:00:00"
    user_id 1
  end
end