// 任务实例
var taskBean;

/**
 * 操作类型:<br>
 * 当用户点击“保存”或“”提交“按钮的时候，会修改这个变量的值<br>
 * 当值为“save”的时候，执行完保存操作后什么都不做。<br>
 * 当值为“submit”的时候，执行完保存操作后，如果需要弹出选环节的对话框，刚弹出。<br>
 * save:保存表单；<br>
 * submit:保存表单，提交流程；<br>
 */
var operType;

$(function () {

    // 初始化页面按钮事件
    initBtnsEvent();

    // 初始化页面事件
    initPageEvent();

    //iframe自适应事件
    $("#businessPageFrame").load(function () {
        $(this).height($(this).contents().height() + 20);
        //$(this).width($(this).contents().width());
    });
});

/**
 * 初始化页面按钮事件
 */
function initBtnsEvent() {
    $('a[name="viewProcessPictureBtns"]').click(function () {
        BPM.showTaskTraceWin($("#taskId").val());
    });
    $('a[name="windowCloseBtns"]').click(function () {
        window.close();
    });
    $('a[name="saveBusinessBtns"]').click(function () {
        saveBusinessForm("save");
    });
    $('a[name="subimtProcessBtns"]').click(function () {
        saveBusinessForm("submit");
    });
}

/**
 * 初始化页面事件
 */
function initPageEvent() {
    var taskId = $("#taskId").val();

    // 获取当前任务属性数据，生成业务页面
    BPM.getTaskBeanData(taskId, function (taskBeanObj, header) {
        switch (header.code) {
            case 2001:
                CORE.infoDlg({title: "系统提示", message: "任务已经不存在，请尝试刷新页面。按确定关闭窗口", buttons: {"确定": function () {
                    window.close();
                }}});
                return;
            case 2002:
                CORE.infoDlg({title: "系统提示", message: "您没权限操作该任务，按确定关闭窗口", buttons: {"确定": function () {
                    window.close();
                }}});
                return;
        }

        // 如果taskBeanObj == undefined
        // 那么应该是用户刷新了浏览器，流程实例已经被删除
        // 则重新发起一个流程实例，并跳转到新任务的处理页面
        if (taskBeanObj == undefined) {
            CORE.confirm("查找任务数据失败，请确认任务是否已经过期或者您是否有权处理该任务。");
//            var procDefId = $("#procDefId").val();
//            BPM.startProcess(procDefId, function (taskBean) {
//                BPM.showTaskHandleWin(taskBean.procDefId, taskBean.taskId, window);
//            });
        } else {
            taskBean = taskBeanObj;
            loadBusinessFrame();
        }

        //初始化流程回退按钮
        initFallBackBtn();
    });

    // 离开页面时判断，如果用户没有保存业务数据则删除流程数据
    /*
     $(window).bind('beforeunload', function () {
     return onTaskHandleWindowClose();
     });
     */
}

function loadBusinessFrame() {
    var businessPageUrl = taskBean.curActivity.businessPage;
    var businessKey = taskBean.procInstBean.businessKey;
    var procInstId = taskBean.procInstBean.procInstId;
    var _taskId = taskBean.taskId;

    var data = "procInstId=" + procInstId + "&taskId=" + _taskId;

    if (businessKey != undefined) {
        //删除流程实例ID
        data += "&businessKey=" + businessKey.replace(procInstId + ":", "");
    }

    // 如果url没有?，则在最后另上?
    if (businessPageUrl.indexOf("?") < 0) {
        businessPageUrl += "?";
    }

    // 如果url有参数，如：a.jsp?a=1,则在最后加上&
    if (businessPageUrl.indexOf("&") > -1) {
        businessPageUrl += "&";
    }

    businessPageUrl += data;

    $("#businessPageFrame").attr("src", businessPageUrl);
}


/**
 * 业务表单提交完成之后的回调函数，由业务页面进行调用
 * @param status 业务表单的处理结果，true/false，这个参数必填
 * @param businessKey 业务数据的主键，可传入空值
 * @param formData 表单数据，可以不传入，但格式必需为 {"a":"","b":""}
 */
var businessFormSavedCallBack = function (status, businessKey, formData, params) {
    CORE.tip(status ? "处理成功" : "处理失败");
    //将表单数据提交到后台进行保存
    //组织数据
    var _tmp_bpm_Bean = {
        "taskBean": taskBean, //复制任务实例数据
        "businessHandleSuc": status,
        "businessKey": (businessKey == undefined ? "" : (taskBean["procInstId"] + ":" + businessKey)),
        "businessVariables": (formData == undefined || formData == null) ? {} : formData
    };
    BPM.saveTaskData(CORE.json2str(_tmp_bpm_Bean), function (result) {
        //如果只是点击了保存按钮，则不进行触发，只将业务数据保存到流程中即可
        if ("submit" == operType)
            onBusinessFormSaved(_tmp_bpm_Bean, params);
    });
};

/**
 * 保存业务表单
 */
function saveBusinessForm(type) {
    operType = type;
    if (!window.frames["businessPageFrame"].saveBusinessForm) {
        var pageLocation = window.frames["businessPageFrame"].window.location.toString();
        var pageName = pageLocation.substring(pageLocation.lastIndexOf("/") + 1);
        var info = "在<font color='red'>" + pageName + "</font>页面没找到saveBusinessForm(callback) 方法<br />";
        info += "请添加该方法并在表单<font color='red'>验证成功</font>后调用$('#form').saveBusinessForm() 自动保存表单; <br>" +
                "或者在成功保存表单之后调用回调函数，callback回调接收参数({status,buskey,formdata})。";
        CORE.info(info);
    } else {
        window.frames["businessPageFrame"].saveBusinessForm(businessFormSavedCallBack);
    }

}

/**
 * 简单的完成任务的调用
 * @param taskId
 * @param selectedActivities
 * @private
 */
function _completeTask(taskId, selectedActivities, params) {
    BPM.completeTask(taskId, selectedActivities, params, function (result, header) {
        if (header.code != 0) {
            CORE.error("操作失败", CORE.json2str(result));
        } else {
            //提交成功，关闭页面
            CORE.infoDlg({title: "系统提示", message: "任务处理完成，点击确定关闭窗口", buttons: {"确定": function () {
                window.close();
            }}});
        }
    });
}

/**
 * 当业务表单保存完成后的回调函数,该方法名字不能改，由bpmForm.js调用
 *
 * @param bpmDataBean
 *            业务表单保存后返回的数据
 */
function onBusinessFormSaved(bpmDataBean, params) {
    if (bpmDataBean.businessHandleSuc) {
        //BPM.showSucInfo(bpmDataBean.businessFeedBackInfo);
//        CORE.tip(bpmDataBean.businessFeedBackInfo == undefined ? "操作成功" : bpmDataBean.businessFeedBackInfo);
        // 如果用户执行的是“提交”操作，则调用流程引擎接口驱动下一环节
        if (operType == "submit") {
            CORE.request("DS_GET_TASK_BEAN_DATA_FOR_DRIVEN",
                    {data: "taskId=" + bpmDataBean.taskBean.taskId + (params ? ("&" + params) : "")},
                    function (data) {
                        switch (data.drivenInfoBean["drivenState"]) {
                            case 1:
                            {
                                CORE.tip("流程无法驱动，请确保已经按照要求填写表单。");
                                return;
                            }
                            case 2:
                            {
                                //当前用户不能向下驱动流程，提示完成后关闭窗口
                                _completeTask(bpmDataBean.taskBean.taskId, [], params);
                                return;
                            }
                            case 3:
                            {
                                CORE.infoDlg({title: "系统提示", message: "无法完成当前任务，原因：" +
                                        data.drivenInfoBean["drivenMessage"]});
                                return;
                            }
                        }
                        //TODO: 在这里要检测是否可以驱动到下一步，如果不可以驱动，则不弹出选环节和选人的对话框
                        // BPM.showActivitySelectDialog(bpmDataBean.taskBean.taskId);
                        BPM.ActivitySelector.create({
                            "taskBean": data.taskBean,
                            "drivenInfo": data.drivenInfoBean
                        });
                        BPM.ActivitySelector.showDialog({"nextActivities": data.drivenInfoBean.nextActivities, "activitySelectedCallBack": function (selectedActivity) {
                            //选中环节后提交到后台进行提交（这里返回的数据已经经过简单的校验）
                            _completeTask(bpmDataBean.taskBean.taskId, selectedActivity, params);
                        }});
                    });
        }

    } else {
        //BPM.showFailInfo(bpmDataBean.businessFeedBackInfo);
//        CORE.tip(bpmDataBean.businessFeedBackInfo == undefined ? "操作失败" : bpmDataBean.businessFeedBackInfo);
    }

}

/**
 * 当页面关闭时，如果没有保存业务数据，删除流程实例
 */
function onTaskHandleWindowClose() {
    var businessKey = taskBean.procInstBean.businessKey;
    if (businessKey == undefined) {
        BPM.delProcInst(taskBean.procInstId, "业务数据未保存，系统自动删除", function (data) {
            return;
        });
    }
    return;
}

/**
 * 初始化流程回退按钮
 */
function initFallBackBtn(){
    if(taskBean.canFallBack == true){
        var fallBackBtn = "<a href=\"javascript:void(0)\" name=\"fallBackProcessBtns\" title=\"流程回退\" class=\"btn_undo\">回退</a>";
        $('a[name="subimtProcessBtns"]').after(fallBackBtn);
        $('a[name="fallBackProcessBtns"]').click(function () {
            fallBackFun();
        });
    }
}

/**
 * 流程回退处理函数
 */
function fallBackFun(){
    var taskId = taskBean.taskId;
    CORE.request("DS_ACTIVITY_FALLBACK",{data:"taskId="+taskId},function(body,header){
        if(header.code == 0){
            if(body.drivenState == 3){
                CORE.info(body.drivenMessage);
            }else{
                CORE.infoDlg({title: "系统提示", message: "流程回退完成，点击确定关闭窗口", buttons: {"确定": function () {
                    window.close();
                }}});
            }
        }else{
            CORE.error("流程回退失败",body);
        }
    });
}
