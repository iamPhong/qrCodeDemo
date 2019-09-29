class PaymentsController < ApplicationController
  before_action :authenticate_user!

  def create
    payment = Payment.new
    payment.item_id = params[:item_id]
    payment.type_payment = params[:commit]
    payment.user_id = current_user.id
    payment.amount = params[:amount]
    payment.status = "request"
    payment.save
    redirect_to item_payment_path(item_id: payment.item_id, id: payment.id)
  end

  def show
    payment = Payment.find(params[:id])
    timestamp = ServerTime.now
    token = Digest::MD5.hexdigest(generate_info(payment, timestamp.to_i.to_s))
    payment.update_attributes(token_created_at: timestamp)
    infor = "#{request.original_url}/payment_qrcode?token=#{token}"
    puts infor
    @qr = RQRCode::QRCode.new(infor)
      .as_png.resize(500, 500)
      .to_data_url
  end

  def payment_qrcode
    payment = Payment.where(id: params[:id], user_id: current_user.id)
    payment = payment.where.not(status: ["success", "reject"]).first
    return render "token_invalid" if !payment.present?
    if !token_expired(payment.token_created_at) &&
      check_valid_token(payment, params[:token])
      @target_payment = payment
      render "payment_qrcode"
    else
      render "token_invalid"
    end
  end

  def confirm_payment
    payment = Payment.find(params[:id])
    item = payment.item
    if token_expired(payment.token_created_at)
      @error = "Token expired"
    else
      my_wallet = current_user.wallets.first
      if !my_wallet.present?
        @error = "My wallet is blank. Please input money"
        return render "payment_complete"
      end
      new_cash = my_wallet.cash - payment.amount * payment.item.unit_price
      if new_cash < 0
        @error = "Your wallet does not have enough money"
        return render "payment_complete"
      end
      new_amount_item = item.amount - payment.amount
      ActiveRecord::Base.transaction do
        my_wallet.update_attributes(cash: new_cash)
        payment.update_attributes(status: "success")
        item.update_attributes(amount: new_amount_item)
        @success = "Payment Complete!!"
      end
    end
    render "payment_complete"
  rescue ActiveRecord::RecordInvalid
    @error = "Payment Not Complete"
    render "payment_complete"
  end

  def reject_payment
    payment = Payment.find(params[:id])
    payment.update_column(:status, "reject")
    redirect_to root_path
  end

  private
  def generate_info payment, timestamp
    infor = current_user.email + payment.item.name + payment.amount.to_s
      + payment.item.unit_price.to_s + timestamp
    infor
  end

  def check_valid_token payment, token
    infor = current_user.email + payment.item.name + payment.amount.to_s
      + payment.item.unit_price.to_s + payment.token_created_at.to_i.to_s
    Digest::MD5.hexdigest(infor) == token
  end

  def token_expired token_created_at
    (ServerTime.now - token_created_at) > 5.minutes
  end
end
