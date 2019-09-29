class CreateWallets < ActiveRecord::Migration[5.1]
  def change
    create_table :wallets do |t|
      t.references :user, foreign_key: true
      t.integer :cash

      t.timestamps
    end
  end
end
