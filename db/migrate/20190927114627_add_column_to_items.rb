class AddColumnToItems < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :amount, :integer
    add_column :items, :infor, :string
    add_column :items, :unit_price, :integer
  end
end
