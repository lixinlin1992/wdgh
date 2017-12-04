/**
 * Created by lh on 2014/10/24.
 */

rdcp.ready(function () {

    /*
     * 初始化工单办理表单
     * */
    initHandleWorkFlowForm();
    /*
     * 加载工单历史
     * */
    loadHandleHistory($("#woId").val());
    /*
     * 加载工单对象表单
     * */
    loadObjectForm($("#taskId").val());
});

/*
 * 初始化工单办理表单
 * */
function initHandleWorkFlowForm() {
    document.handleWorkOrderForm.reset();
    $("#workOrderId").val("");
    $("#curr_node_id").val("");
    $("#next_step_man_id").val("");

    var taskId = $("#taskId").val();

    /*
     * 根据taskId加载工单处理表单
     * */
    rdcp.form.load("handleWorkOrderForm", '!property/base/~query/workFlow/Q_LOAD_HANDLE_FORM_BY_TASK_ID', {"taskId": taskId}, function (data) {
        //加载当前流程环节的下一步处理结果的集合
        rdcp.dropdown2('handle_result', '!property/base/~query/workFlow/Q_LOAD_FLOWS_BY_TASK_ID?taskId=' + taskId, {loadComplete: function () {
            if($("#handle_result").val()=='-1'){
                return;
            }
            initNextStepManByResultAndTaskId($("#handle_result").val(), taskId, function () {
            });

        }});

    });


}

/*
 * 根据当前任务id和当前任务的处理结果联动初始化下一步接单人下拉框
 * */
function initNextStepManByResultAndTaskId(handleResult, taskId, callback) {
    $('#next_step_man').combobox({
        url: '!property/base/~query/workFlow/Q_LOAD_NEXT_MAN_BY_RESULT?flowId=' + handleResult + '&taskId=' + taskId,
        valueField: 'id',
        textField: 'text',
        mode: 'remote',
        onSelect: function (rec) {
            $('#next_step_man_id').val(rec.id);
            $('#next_step_man').val(rec.text);
        },
        onLoadSuccess: function () {
            $('#next_step_man_id').val('');
            $('#next_step_man').val('');
            if (callback != '' && callback != null) {
                callback();
            }

        }
    });
}

/*
 * 提交处理结果
 * */
function submitWorkOrder() {
    rdcp.request('!property/base/~query/workFlow/Q_NEXT_WORK_FLOW', rdcp.id("handleWorkOrderForm").serialize(),
        function (data) {
            rdcp.unmask($(document.body));
            var suc = data.header.code;
            if (0 == suc) {
                afterSubmitWorkFlow(data.body.objectId, function () {

                    $.messager.alert("提示", "处理成功！", 'info',function(){
                        CloseTab('handleWorkForm' + $('#taskId').val(), '处理工单');
                    });

                });
            }
        }, {mask: true});
}

function afterSubmitWorkFlow(objectId, callback) {
    rdcp.request('!property/base/~query/workFlow/Q_GET_EXE_DS_BY_FLOW_ID', {"flowId": $("#handle_result").val()}, function (data) {
        rdcp.unmask($(document.body));
        if (0 == data.header.code) {

            if (data.body.exeurl != '') {
//                alert(data.body.exeurl);
                rdcp.request(data.body.exeurl, {"objectId": objectId}, function (data) {
                    rdcp.unmask($(document.body));
                    if (0 == data.header.code) {
                        if (callback == null) {
                            return;
                        }
                        callback();
                    }
                }, {mask: true});

            } else {
                if (callback == null) {
                    return;
                }
                callback();
            }

        }
    }, {mask: true});

}

/*
 * 加载工单历史
 * */
function loadHandleHistory(woId) {
    rdcp.request('!property/base/~query/workFlow/Q_LOAD_WO_HANDLE_HISTORY', {"woId": woId},
        function (data) {
            rdcp.unmask($(document.body));
            var suc = data.header.code;
            var rows = data.body.rows;
            if (0 == suc) {
                for (var i = 0; i < rows.length; i++) {
                    $("#span_handleHistory").append("<p>&nbsp;&nbsp;&nbsp;&nbsp;" + rows[i].HANDLER + "-[" + rows[i].HANDLETIME + "]-" + rows[i].NODENAME + "-" + rows[i].HANDLERESULT + "-" + rows[i].HANDLENOTE + "</p>");
                }
            }
        }, {mask: true});
}

/*
 * 加载对象表单
 * */
function loadObjectForm(taskId) {
    /*
     * 获取当前环节配置的表单jsp
     * */
    rdcp.request('!property/base/~query/workFlow/Q_WF_GET_NODE_FORM_URL', {"taskId":taskId}, function (data) {
        rdcp.unmask($(document.body));
        if (0 == data.header.code) {
            var formUrl = data.body.formurl;
            if(formUrl!=''&&formUrl!=null&&formUrl!=undefined){
                rdcp.load("span_objectForm", formUrl, '', {
                        onLoad: function(){ initForm();}
                    }
                );
            }
        }
    }, {mask: true});

}

document.onkeydown = function()
{

    var oEvent = window.event;
    if (oEvent.keyCode == 67 && oEvent.ctrlKey) {
//        alert("你按下了ctrl+c");
        submitWorkOrder();
    }

}