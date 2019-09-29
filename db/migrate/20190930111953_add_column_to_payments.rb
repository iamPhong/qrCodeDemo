class AddColumnToPayments < ActiveRecord::Migration[5.1]
  def change
    add_column :payments, :token_created_at, :datetime
  end
end
