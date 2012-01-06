class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :first_name, :null => false
      t.string :last_name
      t.string :email
      t.string :omniauth_id, :null => false
      t.string :provider, :null => false
      t.timestamps
    end
  end
end
