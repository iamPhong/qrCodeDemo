/*! SimpleDataTable
* ================
* Simple data table for Lawson project
*
* @Author  NamNV609
* @Support <https://github.com/namnv609>
* @Email   <namnv609@gmail.com>
* @version 1.0.0
* @license MIT <http://opensource.org/licenses/MIT>
*/

(function($) {
  "use strict";
  var requestData = "";

  $.simpleDataTable = function(options, attachEventPaginateOnly) {
    var settings = $.extend({
      tbodySelector: ".table tbody",
      trTemplateSelector: "#tbody-tpl",
      requestUrl: "",
      requestData: "",
      dataKey: "data",
      paginationSelector: "ul.pagination",
      totalPagesKey: "total_pages",
      pageItemTemplateSelector: "#page-item-tpl",
      currentPageKey: "page",
      pageActiveClass: "active",
      nextPageText: "&rsaquo;",
      prevPageText: "&lsaquo;",
      noRecordTemplateSelector: "#no-record-tpl",
      firstPageText: "&laquo;",
      lastPageText: "&raquo;",
      attachEventPaginateOnly: false,
      totalRecordSelector: "",
      showLoading: false,
      loadingSelector: "#loading-screen",
      loadingHiddenClass: "hidden"
    }, options);
    var FIRST_PAGE_NUMBER = 1;
    requestData = settings.requestData;

    function generateTableData(response) {
      var $trTemplate = $($(settings.trTemplateSelector).html());
      var $noRecordTemplate = $($(settings.noRecordTemplateSelector).html());
      var resData = response[settings.dataKey];

      $(settings.tbodySelector).empty();
      $(settings.totalRecordSelector).html(response.total);

      if (resData.length) {
        $.each(resData, function(idx, data) {
          var $trElement = $trTemplate.clone();
          $("[data-key]", $trElement).each(function() {
            var dataKey = $(this).data("key");
            var elementHref = $(this).attr("href");

            if (elementHref) {
              $(this).attr("href", buildElementHref(elementHref, data));
            }

            $(this).text(data[dataKey]);
          })

          $trElement.appendTo(settings.tbodySelector);
        });
      } else {
        $noRecordTemplate.appendTo(settings.tbodySelector);
      }
    }

    function generatePagination(responseData) {
      var totalPages = responseData[settings.totalPagesKey];
      var $paginationElement = $(settings.paginationSelector);
      var currentPage = responseData[settings.currentPageKey];

      $paginationElement.empty();

      if (totalPages > FIRST_PAGE_NUMBER) {
        var pageItemStr = $(settings.pageItemTemplateSelector).html();
        var $firstPageItem = $(pageItemStr.replace(/\{page\}/, FIRST_PAGE_NUMBER));
        var $lastPageItem = $(pageItemStr.replace(/\{page\}/, totalPages));

        $firstPageItem.removeClass("{activeClass}").addClass("first")
          .find("a").html(settings.firstPageText);
        $lastPageItem.removeClass("{activeClass}").addClass("last")
          .find("a").html(settings.lastPageText);

        if (currentPage > FIRST_PAGE_NUMBER && currentPage <= totalPages) {
          $paginationElement.prepend($firstPageItem);
          addNextAndPrevPageItem((currentPage - 1), $paginationElement);
        }

        for (var page = FIRST_PAGE_NUMBER; page <= totalPages; page++) {
          var pageActiveClass = (page == currentPage ? settings.pageActiveClass : "");
          var pageItem = pageItemStr.replace(/\{page\}/g, page)
            .replace(/\{activeClass\}/g, pageActiveClass);

          $paginationElement.append(pageItem);
        }

        if (currentPage < totalPages) {
          addNextAndPrevPageItem((currentPage + 1), $paginationElement, true);
          $paginationElement.append($lastPageItem)
        }
      }
    }

    function addNextAndPrevPageItem(page, appendToElement, isNext) {
      var $pageItem = $($(settings.pageItemTemplateSelector).html().replace(/\{page\}/g, page));
      $pageItem.find("a").html(isNext ? settings.nextPageText : settings.prevPageText);

      $pageItem.removeClass("{activeClass}").appendTo(appendToElement);
    }

    function responseHandler(responseData) {
      generateTableData(responseData);
      generatePagination(responseData);
    }

    function sendXhrRequest(extraRequestParams) {
      $.ajax({
        beforeSend: function() {
          if (settings.showLoading) {
            $(settings.loadingSelector).removeClass(settings.loadingHiddenClass);
          }
        },
        complete: function() {
          if (settings.showLoading) {
            $(settings.loadingSelector).addClass(settings.loadingHiddenClass);
          }
        },
        url: settings.requestUrl,
        data: requestData + extraRequestParams,
        success: responseHandler
      });
    }

    function buildElementHref(href, dataObj) {
      var placeholders = href.match(/(?!\{)\w+(?=\})/g);

      if (placeholders) {
        placeholders.forEach(function(placeholder) {
          var placeholderRegEx = new RegExp("\\{" + placeholder + "\\}", "g");
          href = href.replace(placeholderRegEx, dataObj[placeholder]);
        });
      }

      return href;
    }

    if (attachEventPaginateOnly) {
      $(settings.paginationSelector).on("click", "li a", function(e) {
        e.preventDefault();

        var currentHref = $(this).attr("href");
        var page = currentHref.match(/(?!page\=)[0-9]+/);
        page = (page ? page[0] : FIRST_PAGE_NUMBER);
        var requestData = {
          page: page
        };

        sendXhrRequest("&" + $.param(requestData))
      });
    } else {
      sendXhrRequest("");
    }
  }
}(jQuery));
