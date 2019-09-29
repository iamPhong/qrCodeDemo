class AddColumnToWallets < ActiveRecord::Migration[5.1]
  def change
    add_column :wallets, :card_name, :string
    add_column :wallets, :card_number, :string
  end
end
