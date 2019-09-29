(function($) {
  var $statusElm = $("#admin-export");
  var $lastIssueDate = $("#success-issue-date");
  var $btnDownload = $("#btnDownload");
  var isExporting = false;
  var STAFF_ENTRIES_MODEL = "entries";
  var PAYMENT_REQUEST_MODEL = "payment_requests"
  var STAFF_WORK_CONDITION_MODEL = "staff_work_conditions"
  var MAX_FAILED_REQUEST = 10;
  var failedRequestNumber = 0;

  $.asyncDownload = function(e, modelName, paramsExport, export_type, additionParams, router) {
    e.preventDefault();

    if (isExporting) {
      showModalWarning(I18n.t("admin.staff.export.exporting"),
        I18n.t("admin.staff.export.wait_message"));
    } else {
      isExporting = true;
      if (router !== undefined) {
        var url = "/" + modelName + "/" + router
      } else {
        var url = "/" + modelName + "/export"
      }

      $.ajax({
        url: url,
        dataType: "json",
        data: _.merge({search: paramsExport}, additionParams)
      }).done(function(response, status, xhrOpts) {
        if (status === "success") {
          if (modelName === STAFF_ENTRIES_MODEL && response.is_have_op_confirm_staff) {
            showModalWarning(I18n.t("admin.staff.export.cant_export"),
              I18n.t("admin.staff.export.dont_have_op_confirm_staff"));
            isExporting = false;
          } else if (modelName === PAYMENT_REQUEST_MODEL && response.status == false) {
            showModalWarning(I18n.t("admin.staff.export.cant_export"), response.message);
            isExporting = false;
          } else {
            jobId = response.jid;
            screenType = response.model_name;
            var intervalName = "job_" + jobId;
            $statusElm.toggleClass("hidden");

            window[intervalName] = setInterval(function() {
              getExportJobStatus(jobId, intervalName, modelName, export_type, screenType, additionParams);
            }, 5000);
          };
        };
      }).fail(function(err) {});
    };
  };

  function getExportJobStatus(jobId, intervalName, modelName, export_type, screenType, additionParams) {
    var exportName = "";
    if (modelName == "arrange_billings" && additionParams) {
      var downloadType = I18n.t("admin.arrange_billings.registration_history.history_" + additionParams["registration_history"]);
      exportName =  [I18n.t("admin.arrange_billings.title"), downloadType].join("_");
    };
    $.ajax({
      method: "POST",
      url: "/" + modelName + "/export_status",
      data: {
        job_id: jobId
      }
    }).done(function(response, status, xhrOpts) {
      if (modelName === PAYMENT_REQUEST_MODEL && response.status === "cancel") {
        deleteIntervalJob(intervalName);
        $statusElm.toggleClass("hidden");
        showModalWarning(I18n.t("admin.staff.export.cant_export"),
          I18n.t("admin.staff.export.cant_export"));
        isExporting = false;
        return;
      }
      if (status === "success") {
        var percentage = response.percentage;
        var $progressElm = $("div[role=progressbar]", $statusElm);
        setProgressPercentage($progressElm, percentage);

        if (response.status === "complete") {
          setProgressPercentage($progressElm, "100");
          setTimeout(function() {
            deleteIntervalJob(intervalName);
            $statusElm.toggleClass("hidden").trigger("hiddenProgress");
            setProgressPercentage($progressElm, "0");
            var exportUrl = "/" + modelName + "/export_download" + "." + export_type + "?id=" + jobId;
            if (screenType) {
              exportUrl += "&model_name=" + screenType;
            };
            if (exportName) {
              exportUrl += "&export_name=" + exportName;
            };
            if (modelName === STAFF_WORK_CONDITION_MODEL){
              exportFileToPublic(modelName, jobId);
            }else{
              $(location).attr("href", exportUrl);
            };
            if (modelName === STAFF_ENTRIES_MODEL) {
              setTimeout(function() {$("#staff-search").trigger("click");}, 5000)
            } else if (modelName === PAYMENT_REQUEST_MODEL){
              setTimeout(function() {$(".btn-search-payment").trigger("click");}, 500)
            } else {
              $(".btn-search-order").trigger("click");
            };
          }, 500);
        } else if ((response.status === "retrying" || response.status === "queued") && response.percentage == null) {
          failedRequestNumber += 1;

          if (failedRequestNumber >= MAX_FAILED_REQUEST) {
            showModalWarning(I18n.t("admin.staff.export.timed_out_title"), I18n.t("admin.staff.export.timed_out_message"));
            deleteIntervalJob(intervalName);
            $statusElm.addClass("hidden").trigger("hiddenProgress");
          }
        }
      } else {
        deleteIntervalJob(intervalName);
      };
    }).fail(function(err) {
      deleteIntervalJob(intervalName);
    });
  };

  function exportFileToPublic(modelName, jobId) {
    $.ajax({
      method: "POST",
      url: "/" + modelName + "/export_to_public",
      data: {
        jid: jobId
      }
    }).done(function(response, status, xhrOpts) {
      if (status === "success" && response.status) {
        $btnDownload.removeClass("hidden");
        $lastIssueDate.val(response.success_at);
      } else {
        showModalWarning("", I18n.t("admin.staff.export.cant_export_work_condition"));
      }
    }).fail(function(err) {
      showModalWarning("", I18n.t("admin.staff.export.cant_export_work_condition"));
    });
  }

  function deleteIntervalJob(intervalName) {
    clearInterval(window[intervalName]);
    delete window[intervalName];
    isExporting = false;
    failedRequestNumber = 0;
  };

  function setProgressPercentage($progressElm, percentage) {
    $progressElm.attr("aria-valuenow", percentage)
      .css("width", percentage + "%")
      .text(percentage + "%");
  };

  function showModalWarning(titleName, bodyName) {
    $("#modal-title-export-name").text(titleName);
    $("#modal-body-export-name").text(bodyName);
    $("#export-in-progress-dialog").modal("show");
  };
}(jQuery));
