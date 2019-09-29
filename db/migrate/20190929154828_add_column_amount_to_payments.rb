class AddColumnAmountToPayments < ActiveRecord::Migration[5.1]
  def change
    add_column :payments, :amount, :integer
  end
end
