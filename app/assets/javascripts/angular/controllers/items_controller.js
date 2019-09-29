"use strict";

angular.module("qrCodeApp").controller("itemsController", itemsController);

itemsController.$inject = ["$scope", "$location", "itemsService", "toaster"];

function itemsController($scope, $location, itemsService, toaster) {
  var vm = this;
  vm.$scope = $scope;

  vm.init = function() {
    itemsService.getListItems().then(function(res) {
      vm.items = res.items;
    })
  }
}
