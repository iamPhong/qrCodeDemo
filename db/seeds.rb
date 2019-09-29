10.times do |n|
  name  = "Sản phẩm #{n+1}"
  amount = rand(1..20)
  infor = "Sản phẩm #{n+1}"
  unit_price = 1000 * n
  image = "item_#{n+1}.jpg"
  Item.create!(name:  name, amount: amount, infor: infor,
    unit_price: unit_price, image: image)
end
