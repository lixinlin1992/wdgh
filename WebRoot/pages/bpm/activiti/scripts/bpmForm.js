(function ($) {
    $.fn.saveBusinessForm = function (options) {

        var businessForm = $(this);
        var businessFormId = businessForm.attr("id");
        var businessFormDiv = businessFormId + "_BPM_DIV";
        var businessFormFrame = businessFormId + "_BPM_FRAME";

        var defaultOpts = {
            display:"none",
            width:"0px",
            height:"0px",
            isReloadBusinessFrameOnSubmitBack:true,
            onSubmitCallBack:null
        };

        var opts = $.extend(defaultOpts, options);

        if (!opts.ds) {
            var info = "请至少传入参数ds,该表单会提交到ds如：<br /><br />";
            info += "$('#businessForm').submitBpmForm({<br />";
            info += "<font color='red'>ds : 'DS_TEST_BUSINESS_FROM_SUBMIT'</font><br />";
            info += "});<br />";
            CORE.info(info);
            return;
        }

        if (!document.getElementById(businessFormDiv)) {

            var businessKey = parent.taskBean.procInstBean.businessKey;
            var procInstId = parent.taskBean.procInstBean.procInstId;
            businessKey = businessKey == undefined ? "" : businessKey;

            var html = "<input type='hidden' name='ds' value='" + opts.ds + "' />";
            html += "<input type='hidden' name='businessKey' value='" + businessKey + "' />";
            html += "<input type='hidden' name='procInstId' value='" + procInstId + "' />";
            html += "<div id=" + businessFormDiv + " style='display:" + opts.display + "'>";
            html += "<iframe id='" + businessFormFrame + "' name='" + businessFormFrame + "'>";
            html += "</iframe>";
            html += "</div>";
            businessForm.append(html);

            businessForm.attr("action", "framework.do");
            businessForm.attr("method", "post");
            businessForm.attr("target", businessFormFrame);

        }

        // 提交表单
        businessForm.submit();

        // 等待iframe是否加载完成，每100毫秒判断一次
        var interval = null;
        interval = window.setInterval(function () {
            var data = $("#" + businessFormFrame).contents().find("body").html();
            if (data != "") {
                //kinz add 2012-11-02  去除无用的信息，返回的数据只允许JSON格式
                data = data.toString().replace(/<\/?pre>/g, "");
                data = data.toString().replace(/<pre style="word-wrap: break-word; white-space: pre-wrap;">/g, "");

                // 清除定时器
                window.clearInterval(interval);
                var bpmDataBean = CORE.str2json(data).body;
                if (bpmDataBean.businessHandleSuc == true && bpmDataBean.businessKey != undefined) {

                    // 如果返回的business有值，则更新父页面的taskBean.procInstBean.businessKey
                    // 如果父页面的taskBean的businessKey为空，当用户刷新更关闭任务处理页面时会删除流程实例
                    // 如果设置了businessKey，证明用户已经点击“保存”按钮，则不会删除流程实例
                    window.parent.taskBean.procInstBean.businessKey = bpmDataBean.businessKey;
                    bpmDataBean.taskBean = window.parent.taskBean;
                    BPM.saveTaskData(CORE.json2str(bpmDataBean), function () {
                        // 当iframe加载完成，调用父页面的onBusinessFormSubmitted();
                        window.parent.onBusinessFormSaved(bpmDataBean);
                        opts.onSubmitCallBack(bpmDataBean);

                        // 业务表单提交完成后自动刷新
                        if (opts.isReloadBusinessFrameOnSubmitBack) {
                            BPM.reloadTaskHandleFrame(window, bpmDataBean.businessKey);
                        }
                    });

                } else {
                    CORE.info("在返回值中找不到关联业务表的主键'<font color='red'>_businessKey</font>'<br />请返回该主键。");
                }
            }
        }, 100);
    };
})(jQuery);
