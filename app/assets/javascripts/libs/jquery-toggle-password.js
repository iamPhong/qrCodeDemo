/*! jQuery TogglePassword
* ================
* Simple jQuery toggle password plugin for Lawson project
*
* @Author  NamNV609
* @Support <https://github.com/namnv609>
* @Email   <namnv609@gmail.com>
* @version 1.0.0
* @license MIT <http://opensource.org/licenses/MIT>
*/

(function($) {
  "use strict";

  $.fn.togglePassword = function(options) {
    var pluginOptions = $.extend({
      targetElement: ""
    }, options);

    this.each(function() {
      $(this).on("click", function() {
        var $targetElement = $(pluginOptions.targetElement);
        var elementType = $targetElement.prop("type") === "password" ? "text" : "password";

        $targetElement.prop("type", elementType);
      })
    });
  }
}(jQuery));
