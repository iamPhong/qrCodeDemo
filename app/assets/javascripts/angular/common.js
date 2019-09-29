'use strict';

angular.module('commonLib', []);

angular.module('commonLib')
  .factory('common', ['$http', '$q', function($http, $q){
    return {
      ajaxCall: function(method, url, params, cache) {
        var def = $q.defer();
        // var spinner = angular.element('#spinner');
        var hostNamePrefix = $("#hostNamePrefix").attr("href");
        var formData = {method: method, url: url, cache: cache};
        // if (params && !params.isSpinnerRemoved) {
        //   spinner.removeClass('ng-hide');
        // }

        if (hostNamePrefix) {
          formData.url = hostNamePrefix + url;
        }

        var dataParam = {params: params};
        if (_.includes(HIDDEN_PARAM_METHODS, method)) {
          dataParam = {data: params};
        }
        formData = _.merge(formData, dataParam);
        $http(formData)
          .then(function(res) {
            def.resolve(res);
            // if ($http.pendingRequests.length === 0) {
            //   spinner.addClass('ng-hide');
            // };
          }, function(err) {
            def.reject(err);
            // if ($http.pendingRequests.length === 0) {
            //   spinner.addClass('ng-hide');
            // };
          })
        window.ajax_loading = true;
        return def.promise;
      }
    }}
  ])

window.defaultConfig = function($httpProvider, $locationProvider, $qProvider) {
  var csrfTokenElm = document.getElementsByName('csrf-token'),
      csrfToken = csrfTokenElm[0] ? csrfTokenElm[0].content : '';
  $httpProvider.defaults.headers.common.Accept = 'application/json';
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  $httpProvider.defaults.headers.post['X-CSRF-Token'] = csrfToken;
  $httpProvider.defaults.headers.put['X-CSRF-Token'] = csrfToken;
  $httpProvider.defaults.headers.delete = {'X-CSRF-Token': csrfToken};

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false,
    rewriteLinks: false //disables url rewriting for relative links
  });

  $qProvider.errorOnUnhandledRejections(false);
}

//hide spinner when DOM loaded successfully
window.onload = function(e){
  // if (window.ajax_loading) return;
  $('#spinner').addClass('ng-hide');
}
