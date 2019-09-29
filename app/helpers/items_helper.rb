module ItemsHelper
  def generate_qrcode item
    RQRCode::QRCode.new(create_infor_qrcode(item))
      .as_png.resize(300, 300)
      .to_data_url
  end

  def create_infor_qrcode item
    "Tên sản phẩm: #{item.name} \n" +
    "Số lượng: #{item.amount} \n" +
    "Đơn giá: #{item.unit_price}"
  end
end
