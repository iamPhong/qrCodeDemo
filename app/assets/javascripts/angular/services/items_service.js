"use strict";
angular.module("qrCodeApp")
  .factory("itemsService", ["common", itemsService]);

function itemsService(common) {
  var functions = {
    getListItems: getListItems
  }

  return functions;

  function getListItems() {
    return common.ajaxCall("GET", "/items");
  }
}
