class CreatePayments < ActiveRecord::Migration[5.1]
  def change
    create_table :payments do |t|
      t.references :item, foreign_key: true
      t.string :status
      t.string :type_payment
      t.string :status

      t.timestamps
    end
  end
end
