rdcp.uploaderAdapter = [];

rdcp.uploaderDefaults = {
    autoUpload: true,
    url: '!service/file/~java/Uploader.upload',
    dataType: 'json',
    add: function (e, data) {
        var container = rdcp.id($(data.fileInput[0]).attr("id")).parent().parent().parent();
        var fileList = $(container.find(".SR_uploadFileList ul")[0]);
        var fileContainerTmpl =
            "<li class='SR_uploadFileBox'>" +
                "<div class='SR_uploadFileBoxBtn'>" +
                "<div class='SR_imgName'>" +
                "<h2>${fileName}</h2>" +
                "</div>" +
                "</div>" +
                "<div class='SR_uploadImg'>" +
                "<img />" +
                "</div>" +
                "<div class='SR_progressBar'>" +
                "<div class='SR_progressBarIng0'></div>" +
                "</div>" +
                "</li>";

        var fileContainer = $.tmpl(fileContainerTmpl, {fileName: data.files[0].name});
        data.fileContainer = fileContainer;
        fileList.append(fileContainer);
        data.submit();
    },
    progress: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 10, 10);
        data.fileContainer.find(".SR_progressBar div").removeClass().addClass("SR_progressBarIng" + progress);
    },
    done: function (e, data) {
        var file;
        if (data.jqXHR.responseText)
            file = rdcp.str2json(data.jqXHR.responseText)[0];
        else
            file = data._response.result[0];

        var url = file.url;
        var thumbURL = file.thumbURL;
        var delURL = file.delUrl;
        var baseURL = $("base").attr("href");
        data.fileContainer.find("img").attr("src", baseURL + thumbURL).click(function () {
            window.open(baseURL + url);
        });
        var del = $("<input class='SR_uploaderDel' type='button' />");
        del.on("click",function () {
            if (confirm("确定要删除文件吗？"))
                rdcp.request(delURL, {}, function () {
                    $(data.fileContainer).remove();
                });
        }).appendTo(data.fileContainer.find(".SR_uploadFileBoxBtn"));
    },
    fail: function (e, data) {
        alert("文件上传失败");
        data.fileContainer.remove();
    }
};

rdcp.uploader = function (id, params, p) {
    var settings = rdcp.extend({}, rdcp.uploaderDefaults, p);
    settings = rdcp.adapt(settings, rdcp.uploaderAdapter);
    settings.formData = params;

    settings.done = function (e, data) {
        rdcp.uploaderDefaults.done(e, data);
        if (settings.onSuccess)
            settings.onSuccess(rdcp.str2json(data.jqXHR.responseText)[0]);
    };

    var selectorId = id + "Selector";
    var container = rdcp.id(id).addClass("SR_uploaderContainer");
    var containerTmpl =
        "<div class='SR_uploadHeader'>" +
            "<div class='SR_uploaderSelector fileinput-button'>" +
            "<input id='${selectorId}' name='files[]' type='file' class='file' multiple />" +
            "</div>" +
            "</div>" +
            "<div class='SR_uploadFileList files'>" +
            "<ul></ul>" +
            "</div>";
    container.append($.tmpl(containerTmpl, {selectorId: selectorId}))
    container.find("#" + selectorId).fileupload(settings);
};
