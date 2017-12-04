var COMMON = {};

COMMON.upload = function (options, callback) {
    $.ajaxFileUpload({
        url:options['url'],
        formName:options['formName'],
        dataType:options['dataType'] || 'json',

        success:options['success'] || function (data, status) {
            if (callback == undefined) {
                if (data.header.code != 0 && data.header.code <= 2000) {
                    CORE.error(data.header.message, unescape(data.body.toString()));
                } else {
                    CORE.info("上传成功");
                }
            } else {
                if (data.header.code != 0 && data.header.code <= 2000) {
                    CORE.error(data.header.message, unescape(data.body.toString()));
                } else {
                    callback(data.body, data.header);
                }
            }
        },
        error:options['error'] || function (data, status, e) {
            CORE.error("上传失败", unescape(e.stack));
            jQuery('body').hideLoading();
        },
        complete:options['complete'] || function () {
            //jQuery('body').hideLoading();
        }
    });
};