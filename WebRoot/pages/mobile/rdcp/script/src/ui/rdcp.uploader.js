rdcp.uploaderAdapter = [];

rdcp.uploaderDefaults = {
    autoUpload: true,
    showProcessBar: true,
    showThumbImg: true,
    minFileSize: 0,
    maxFileSize: 10 * 1024 * 1024,
    maxFileCount: 0, /*上传文件数量限制，0 表示不限制*/
    fileSizeMsg: "上传文件大小超出限制",
    url: '!service/file/~java/Uploader.upload',
    acceptFileTypes: [],
    acceptFileTypesMsg: '不允许上传该类型文件',
    dataType: 'json',
    progress: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 10, 10);
        data.fileContainer.find(".SR_progressBar div").removeClass().addClass("SR_progressBarIng" + progress);
    },
    done: function (e, data, onDelete) {
        var file;
        if (data.jqXHR.responseText && data.jqXHR.responseText != "undefined")
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

        var del = $("<input class='SR_uploaderDel' type='button'  title='点击 删除文件'>");
        del.on("click", function () {
            if (confirm("确定要删除文件吗？")) {
                rdcp.request(delURL, {}, function () {
                    $(data.fileContainer).remove();
                    if (onDelete)
                        onDelete(file);
                });
            }
        }).appendTo(data.fileContainer.find(".SR_uploadFileBoxBtn"));
    },
    fail: function (e, data) {
        alert("文件上传失败："+data.jqXHR.responseText);
        data.fileContainer.remove();
    }
};

rdcp.uploader = function (id, params, p) {
    var settings = rdcp.extend({}, rdcp.uploaderDefaults, p);
    settings = rdcp.adapt(settings, rdcp.uploaderAdapter);
    settings.formData = params;

    settings.done = function (e, data) {
        rdcp.uploaderDefaults.done(e, data, settings.onDelete);
        var orderNum = data.fileContainer.find(".orderNum")[0].value;
        if (settings.onSuccess) {
            if (data.jqXHR.responseText && data.jqXHR.responseText != "undefined") {
                settings.onSuccess(rdcp.str2json(data.jqXHR.responseText)[0], orderNum);
            } else {
                settings.onSuccess(data._response.result[0], orderNum);
            }
        }

    };

    settings.onDelete = function(file){
        //container.find(".SR_uploadFileList ul li.addImgBtnBox").show();
        $("#"+id+"_li").removeAttr("style");
        //$("#"+id+"_li").css("position","relative");
    };

    settings.init = function () {
        if (!settings.fileIds)
            return;
        var fileList = $(container.find(".SR_uploadFileList ul")[0]);
        var showProcessBar = settings.showProcessBar == true ? "" : "style=display:none;";
        var showThumbImg = settings.showThumbImg == true ? "" : "style=display:none;";
        rdcp.request("!service/file/~java/Downloader.getFileInfo", {
            id: settings.fileIds
        }, function (data) {
            rdcp.each(data, function () {
                var fileContainerTmpl =
                        "<li class='SR_uploadFileBox'>" +
                        "   <div class='SR_uploadFileBoxBtn'>" +
                        "       <input class='SR_uploaderDel' type='button' />" +
                        "       <div class='SR_imgName'>" +
                        "           <h2>${fileName}</h2>" +
                        "       </div>" +
                        "   </div>" +
                        "   <div class='SR_uploadImg' ${showThumbImg}>" +
                        "       <img src='${thumbImgUrl}'/>" +
                        "   </div>" +
                        "   <div class='SR_progressBar' ${showProcessBar}>" +
                        "       <div class='SR_progressBarIng0'></div>" +
                        "   </div>" +
                        "</li>";
                var fileContainer = $.tmpl(fileContainerTmpl, {
                    fileName: this.name,
                    thumbImgUrl: this.thumbURL,
                    showProcessBar: showProcessBar,
                    showThumbImg: showThumbImg
                });
                var file = this;
                var delUrl = this.delUrl;
                fileContainer.find(".SR_progressBar div").removeClass().addClass("SR_progressBarIng10");
                fileContainer.find(".SR_uploaderDel").on("click", function () {
                    if (confirm("确定要删除文件吗？")) {
                        rdcp.request(delUrl, {}, function () {
                            $(fileContainer).remove();
                            if (settings.onDelete)
                                settings.onDelete(file);
                        });
                    }
                });
                fileList.append(fileContainer);
                if (settings.maxFileCount != 0 && settings.maxFileCount <= fileList.find("li").length - 1) {
                    fileList.find("li.addImgBtnBox").hide();
                }
            });
        });

    };

    settings.add = function (e, data) {
        var container = rdcp.id($(data.fileInput[0]).attr("id")).parent().parent().parent().parent().parent();
        var fileList = $(container.find(".SR_uploadFileList ul")[0]);
        var showProcessBar = settings.showProcessBar == true ? "" : "style=display:none;";
        var showThumbImg = settings.showThumbImg == true ? "" : "style=display:none;";

        if (settings.acceptFileTypes && settings.acceptFileTypes.length) {
            var fName = data.files[0].name;
            var fType = fName.substr(fName.lastIndexOf(".") + 1, fName.length);
            var isAccept = false;
            rdcp.each(settings.acceptFileTypes, function () {
                if (this.toLowerCase() == fType.toLowerCase())
                    isAccept = true;
            });

            if (!isAccept) {
                $.messager.alert("错误", settings.acceptFileTypesMsg, "error");
                return;
            }
        }
        if (data.files[0].size > settings.maxFileSize || data.files[0].size < settings.minFileSize) {
            $.messager.alert("错误", settings.fileSizeMsg, "error");
            return;
        }

        var fileContainerTmpl =
                "<li class='SR_uploadFileBox'>" +
                "   <div class='SR_uploadFileBoxBtn'>" +
                "       <div class='SR_imgName'>" +
                "           <h2>${fileName}</h2>" +
                "       </div>" +
                "   </div>" +
                "   <div class='SR_uploadImg' ${showThumbImg}>" +
                "       <img />" +
                "       <input class='orderNum' type='hidden' value='" +
                (fileList.find('.SR_uploadFileBox').length - 1) + "' />" +
                "   </div>" +
                "   <div class='SR_progressBar' ${showProcessBar}>" +
                "       <div class='SR_progressBarIng0'></div>" +
                "   </div>" +
                "</li>";


        var fileContainer = $.tmpl(fileContainerTmpl,
                {fileName: data.files[0].name, showProcessBar: showProcessBar, showThumbImg: showThumbImg});
        data.fileContainer = fileContainer;
        //fileList.append(fileContainer);
        fileList.prepend(fileContainer);
        data.submit();
        //如果设置了只能上传一个文件，则隐藏上传按钮
        if (settings.maxFileCount != 0 && settings.maxFileCount <= fileList.find("li").length - 1) {
            //fileList.find("li.addImgBtnBox").hide();//不要这样隐藏，会造成上传后整个页面的按钮失灵
            $("#"+id+"_li").attr("style","position:absolute;left:-99999px;");
        }
    };

    var selectorId = id + "Selector";
    var container = rdcp.id(id).addClass("SR_uploaderContainer");
    var containerTmpl =
        //"<div class='SR_uploadHeader'>" +
        //"<div class='SR_uploaderSelector fileinput-button'>" +
        //"<input id='${selectorId}' name='files[]' type='file' class='file' multiple />" +
        //"</div>" +
        //"</div>" +
            "<div class='SR_uploadFileList files'>" +
            "   <ul>" +
            "       <li id='"+id+"_li' class='SR_uploadFileBox addImgBtnBox'>" +
            "           <a class='addImgBtn' href='javascript://'> " +
            "               <input id='${selectorId}' name='files[]' type='file' class='bigfile' multiple='multiple'>" +
            "           </a>" +
            "       </li>" +
            "   </ul>" +
            "</div>";
    container.append($.tmpl(containerTmpl, {selectorId: selectorId}));
    container.find("#" + selectorId).fileupload(settings);
    settings.init();
};