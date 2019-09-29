(function() {
  angular.module('qrCodeApp', ['ngAnimate', 'toaster', 'ui.bootstrap',
    'monospaced.qrcode', 'ngMessages', 'infinite-scroll'])
    .config(['$httpProvider', '$locationProvider', '$qProvider', defaultConfig])
})();
