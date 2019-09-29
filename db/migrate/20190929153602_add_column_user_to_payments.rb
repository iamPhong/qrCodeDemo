class AddColumnUserToPayments < ActiveRecord::Migration[5.1]
  def change
    add_reference :payments, :user, foreign_key: true
  end
end
