Rails.application.routes.draw do
  devise_for :users
  resources :items do
    resources :payments do
      member do
        get "payment_qrcode"
        get "confirm_payment"
        get "reject_payment"
      end
    end
  end

  resources :users do
    resources :wallets
  end

  root "items#index"
end
