var BPM = {
    version: "0.1",
    syscode: "RDCP"// 业务系统编码
};

/**
 * 显示成功信息
 *
 * @param info
 *            成功信息
 */
BPM.showSucInfo = function (info) {
    info = info == undefined ? "操作成功" : info;

    $("#operSucDiv").html(info);
    $("#operSucDiv").show("slow");
    setTimeout(function () {
        $('#operSucDiv').hide("slow");
    }, 5000);
};

/**
 * 显示失败信息
 *
 * @param info
 *            失败信息
 */
BPM.showFailInfo = function (info) {
    info = info == undefined ? "操作失败" : info;

    $("#operFailDiv").html(info);
    $("#operFailDiv").show("slow");
    setTimeout(function () {
        $('#operFailDiv').hide("slow");
    }, 5000);
};

/**
 * 重新加载任务处理页面，一般在保存任务后由业务调用该方法
 *
 * @param win
 *            业务的window
 * @param businessKey
 *            业务保存后的主键
 */
BPM.reloadTaskHandleFrame = function (win, businessKey) {
    var curLocation = win.location;
    var toLocation = curLocation += "&businessKey=" + businessKey;
    win.location = toLocation;
};

/**
 * 把字符串中所有\n换成<br>
 *
 * @param string
 *            需要替换的字符串
 */
BPM.replaceAllWrap = function (string) {
    while (string.indexOf("\n") > -1) {
        string = string.replace("\n", "<br>");
    }
    return string;
};

/**
 * 根据任务ID，更新流程的businessKey
 *
 * @param procInstId
 *            流程实例ID
 */
BPM.updateBusinessKeyByTaskId = function (taskId, businessKey, onUpdated) {
    CORE.request("DS_UPDATE_BUSINESSKEY_BY_TASKID", {
        data: "taskId=" + taskId + "&businessKey=" + businessKey
    }, function (data) {
        onUpdated(data);
    });
};

/**
 * 删除流程实例
 *
 * @param procInstId
 *            流程实例ID
 */
BPM.delProcInst = function (procInstId, reason, onDeleted) {
    CORE.request("DS_DEL_PROCINST", {
        data: "procInstId=" + procInstId + "&reason=" + reason
    }, function (data) {
        onDeleted(data);
    });
};

/**
 * 删除流程部署
 *
 * @param deployId
 *            流程部署ID
 */
BPM.unDeployProcess = function (deployId) {
    CORE.request("DS_UNDEPLOY_PROCESS", {
        data: "deployId=" + deployId
    }, function (data) {
        GRID.reload('processList');
        CORE.info("删除完成");
    });
};

/**
 * 启动流程
 * @param opts
 * 选项说明
 * procDefId    :
 * procDefKey   :
 * businessKey  :
 * onStarted    :
 * params       :
 */
BPM.startProcess = function (opts) {
    if (opts == undefined || (!opts["procDefId"] && !opts["procDefKey"])) {
        CORE.error("无法启动流程", "必需提供必要的参数才能启动流程。");
        return;
    }

    //如果没有提供ID而是提供了流程定义的KEY，则先查询出ID
    if (!opts["procDefId"]) {
        //根据流程Key获取最新的流程定义信息
        CORE.request("DS_GET_PROCDEF_BY_KEY", {data: "procDefKey=" + opts["procDefKey"]}, function (data, header) {
            if (header.code != 0) {
                CORE.error("启动流程失败", "由于获取流程定义失败，没法启动流程。");
            } else {
                opts["procDefId"] = data["procDefId"];
                BPM.startProcess(opts);
            }
        });
        return;
    }

    //获取流程驱动的相关信息，必要的话显示人员选择界面
    CORE.request("DS_GET_DRIVEN_INFO_FOR_LAUNCH",
            {data: "procDefId=" + opts["procDefId"] + (opts["params"] ? ("&" + opts["params"]) : "")},
            function (data,header) {
                if(header.code != 0){
                    CORE.error("启动流程失败",((header["message"]==undefined || header["message"]=="")?"请稍后再试":header["message"]));
                    return;
                }
                BPM.ActivitySelector.create({
                    "taskBean": {"taskId": "-1", "curActivity": {"id": "StartEvent", "name": "启动新的流程"}},
                    "drivenInfo": data.drivenInfoBean
                });
                BPM.ActivitySelector.showDialog({"nextActivities": data.drivenInfoBean.nextActivities, "activitySelectedCallBack": function (selectedActivities) {
                    //选人完成，启动流程
                    var _drivenInfoBean = {
                        "selectedNextActivities": selectedActivities
                    };
                    var $launchForm = $(eval("document.BPM_LAUNCH_FORM___"));
                    if ($launchForm.length == 0) {
                        $launchForm = $("<form name='BPM_LAUNCH_FORM___'>" +
                                "<input type='hidden' name='procDefId'>" +
                                "<input type='hidden' name='businessKey'>" +
                                "<input type='hidden' name='drivenInfo'>" +
                                "</form>");
                        $("body").append($launchForm);
                    }
                    $launchForm.find("input[name='drivenInfo']").val(CORE.json2str(_drivenInfoBean));
                    $launchForm.find("input[name='procDefId']").val(opts["procDefId"]);
                    $launchForm.find("input[name='businessKey']").val(opts["businessKey"] ? opts["businessKey"] : "");
                    CORE.submitForm("DS_START_PROCESS", "BPM_LAUNCH_FORM___",
                            {data: (opts["params"] ? opts["params"] : "")}, function (data, header) {
                                if (header.code != 0) {
                                    if(header.code != 0){
                                        CORE.error("启动流程失败",((header["message"]==undefined || header["message"]=="")?"请稍后再试":header["message"]));
                                        return;
                                    }
                                } else {
                                    CORE.tip("流程已经发起");
                                    //检查是否存在 taskId，如果存在，则表明当前用户有新流程的待办，进入待办任务处理页面
                                    if (data["taskId"] != undefined) {
                                        alert(data["taskId"]);
                                        BPM.showTaskHandleWin(data["taskId"]);
                                    }
                                    if (opts["onStarted"])
                                        opts["onStarted"](data);
                                }
                            });
                }});
            });
};

/**
 * 根据流程的定义的键来启动流程，将使用流程的最新版本
 * @param procDefKey 流程定义Key
 * @param businessKey 业务对象Key
 * @param onProcessStarted 启动完成回调方法
 * @param params 在启动是需要提交的参数
 */
BPM.startProcessByKey = function (procDefKey, businessKey, onProcessStarted, params) {
    BPM.startProcess({
        procDefKey: procDefKey,
        businessKey: businessKey,
        onStarted: onProcessStarted,
        params: params
    });
};

/**
 * 启动流程实例
 *
 * @param procDefId
 *            流程实例ID
 */
BPM.startProcessById = function (procDefId, businessKey, onProcessStarted, params) {
    BPM.startProcess({
        procDefId: procDefId,
        businessKey: businessKey,
        onStarted: onProcessStarted,
        params: params
    });
};

/**
 * 保存任务数据
 *
 * @param data
 *            json格式的数据-到后台会把数据转成Map<String, Object>格式
 */
BPM.saveTaskData = function (businessJsonData, onSaved) {
    CORE.request("DS_SAVE_TASK_DATA", {
        data: "businessJsonData=" + UrlEncode(businessJsonData)
    }, function (result, header) {
        switch (header.code) {
            case 2001:
                CORE.tip("由于任务不存在，无法保存任务数据");
                break;
            case 2002:
                CORE.tip("您没权限操作该任务，因此不能保存任务数据");
                break;
            case 0:
                if (onSaved != undefined)
                    onSaved(result);
        }
    });
};

/**
 * 打开环节选择对话框
 *
 * @param dialogId
 * @param taskBean
 *
 */
BPM.showActivitySelectDialog = function (taskId, dialogId, dialogOptions) {
    var opts = {};
    var dialogDivId = dialogId == undefined ? "bpmActivitySelectorDialog" : dialogId;
    $("#" + dialogDivId).html("");
    $("#" + dialogDivId).bpmActiviySelector(taskId);
    var defaultDialogOptions = {
        title: "环节选择",
        width: "600",
        height: "400",
        modal: true,
        bgiframe: true,
        resizable: false,
        buttons: {
            '取消': function () {
                $("#" + dialogDivId).dialog("close");
            },
            '提交': function () {
            }
        }
    };
    opts = $.extend(defaultDialogOptions, dialogOptions);
    $("#" + dialogDivId).dialog(opts);

};
/**
 * 打开责任人选择对话框
 *
 * @param taskBean
 * @param activityBean
 * @param dialogOptions
 *
 */
BPM.showAssigneeSelectDialog = function (taskBean, activityBean, dialogOptions) {
    var opts = {};
    var dialogDivId = "bpmAssigneeSelectorDialog_" + activityBean.id;
    var $dialog = $("#" + dialogDivId);
    if ($dialog.html() == "") {
        $dialog.bpmAssigneeSelector(taskBean, activityBean);
    }

    var defaultDialogOptions = {
        title: "环节:\"" + activityBean.name + "\"责任人选择",
        width: "600",
        height: "400",
        modal: true,
        bgiframe: true,
        resizable: false,
        buttons: {
            '取消': function () {
                $("#" + dialogDivId).dialog("close");
            },
            '提交': function () {
            }
        }
    };
    opts = $.extend(defaultDialogOptions, dialogOptions);
    $("#" + dialogDivId).dialog(opts);

};

BPM.getAssigneeSelectorViewList = function (onGetBack) {
    CORE.request("DS_GET_BPM_ASSIGNEE_SELECTOR_VIEW_LIST", {}, onGetBack);
};

/**
 * 完成任务，并往下驱动流程
 *
 * @param taskId 任务实例ID
 * @param selectedActivitis 要驱动的下个环节和人员信息
 * @param onCompleted 回调事件
 */
BPM.completeTask = function (taskId, selectedActivities, params, onCompleted) {
    var _drivenInfoBean = {
        "selectedNextActivities": selectedActivities
    };
    CORE.request("DS_COPMPLETE_TASK", {
        //data : "businessJsonData=" + businessJsonData
        data: "taskId=" + taskId + "&drivenInfo=" + CORE.json2str(_drivenInfoBean) + (params ? ("&" + params) : "")
    }, function (result, header) {
        switch (header.code) {
            case 2001:
                CORE.tip("由于任务不存在，无法提交任务");
                break;
            case 2002:
                CORE.tip("您没权限操作该任务，因此不能提交任务");
                break;
            case 0:
                if (onCompleted != undefined)
                    onCompleted(result, header);
        }
    });
};

/**
 * 显示流程资源窗口
 *
 * @param deoployId
 *            流程部署ID
 * @param resourceName
 *            资源名称：如test.png、test.xml
 */
BPM.showProcessResourceWin = function (deoployId, resourceName) {
    var ds = "DS_GET_PROCESS_RESOURCE";
    var data = "deployId=" + deoployId + "&resourceName=" + resourceName;
    CORE.goToDS(ds, data, null, "_blank");
};

/**
 * 生成任务流程图追踪链接
 *
 * @param taskId
 *            任务ID
 * @param linkName
 *            链接的显示名字
 */
BPM.genTaskTraceLink = function (taskId, linkName) {
    var html = "";
    html += "<a href='javascript:void(0)' class='curActivityName' onclick='BPM.showTaskTraceWin(\"" + taskId + "\")'>";
    html += linkName;
    html += "</a>";
    return html;
};

/**
 * 显示任务流程图追踪窗口
 *
 * @param taskId
 *            任务ID
 */
BPM.showTaskTraceWin = function (taskId) {
    var url = $("#basePath").val() + "/pages/bpm/activiti/bpm-trace/task-trace.jsp?taskId=" + taskId;
    window.open(url);
};

/**
 * 打开任务处理窗口
 *
 * @param taskId
 *            任务ID
 * @param win
 *            打开窗口，如果不传该参数，则打开一个新窗口<br />
 *            如果传js的window对象，则在该window窗口中直接跳转链接
 */
BPM.showTaskHandleWin = function (taskId, win) {
    var url = $("#basePath").val() + "/pages/bpm/activiti/bpm-admin/task-handle.jsp?taskId=" + taskId;
    if (win != undefined) {
        win.location.href = url;
    } else {
        window.open(url);
    }
};

/**
 * 根据任务ID获取任务实例
 *
 * @param taskId
 *            任务ID
 */
BPM.getTaskBeanData = function (taskId, onCallBack) {
    CORE.request("DS_GET_TASK_BEAN_DATA", {
        data: "taskId=" + taskId
    }, function (taskBean, header) {
        onCallBack(taskBean, header);
    });
};
