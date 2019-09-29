module GenerateQrCode
  def get_qrcode_png item
    RQRCode::QRCode.new(create_infor_qrcode(item))
  end

  def create_infor_qrcode item
    "Tên sản phẩm: #{item.name} \n" +
    "Số lượng: #{item.amount}" +
    "Đơn giá: #{item.unit_price}"
  end
end
