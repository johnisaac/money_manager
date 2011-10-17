class CreateExpenses < ActiveRecord::Migration
  def change
    create_table :expenses do |t|
      t.string :reason
      t.datetime :spent_on
      t.float :amount

      t.timestamps
    end
  end
end
