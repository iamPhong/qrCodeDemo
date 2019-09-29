class WalletsController < ApplicationController
  before_action :authenticate_user!
  def index
    @my_wallet = Wallet.find_by(user_id: params[:user_id])
  end

  def new
    @wallet = Wallet.new
  end

  def create
    @wallet = Wallet.new wallet_params
    @wallet.user_id = current_user.id
    @wallet.save
    redirect_to user_wallets_path(current_user.id)
  end

  private
  def wallet_params
    params.require(:wallet).permit :cash, :card_name, :card_number
  end
end
