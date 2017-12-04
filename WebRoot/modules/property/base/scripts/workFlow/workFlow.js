/**
 * Created by lh on 2014/9/26.
 */

/*
 * 处理工单开始时批量提交工单
 * 参数：processCode流程编码，不可为空
 * 参数：objectId流程针对的对象的id，如：创建基站物业审核流程发起时，objectId就是新创建的基站的id，不可为空
 * 参数：orderTitle实例标题，给创建的工单实例一个标题，可为空
 * 参数：note备注，可为空
 * @param callback 回掉函数工单执行成功后调用
 * */
function handleBatchSubmit(processCode, objectId, orderTitle, note, callback) {

    rdcp.request('!property/base/~query/workFlow/Q_START_WORK_FLOW', {processCode: processCode, objectId: objectId, orderTitle: orderTitle, note: note}, function (data) {
        rdcp.unmask($(document.body));
        if (0 == data.header.code) {

            rdcp.request('!property/base/~query/workFlow/Q_NEXT_WORK_FLOW',
                {
                    "taskId": data.body.taskId,
                    "handle_result": $("form[name='workFlowForm'] select[name='handle_result']").val(),
                    "next_step_man_id": $("form[name='workFlowForm'] input[name='next_step_man_id']").val(),
                    "handle_suggestion": $("form[name='workFlowForm'] textarea[name='handle_suggestion']").val()
                },
                function (data) {
                    rdcp.unmask($(document.body));
                    var suc = data.header.code;
                    if (0 == suc) {
                        afterSubmitWorkFlow(objectId, callback);
                    }
                }, {mask: true});
        }
    }, {mask: true});

}
/*
 * 根据流程编码初始化批量提交的form表单，仅仅在批量提交时使用
 * @param processCode流程的编号
 * */
function initBatchSubmitForm(processCode,callback) {
    document.workFlowForm.reset();
    //强制清空hidden的input
    $("#taskId").val("");
    $("#workOrderId").val("");
    $("#curr_node_id").val("");
    $("#next_step_man_id").val("");
    /*
     * 根据流程编码获取流程起始环节后的发起环节
     * */
    rdcp.form.load("workFlowForm", '!property/base/~query/workFlow/Q_GET_START_NODE_BY_PROCESS_CODE', {"processCode": processCode}, function (data) {
        //加载当前流程环节的下一步处理结果的集合
        rdcp.dropdown2('handle_result', '!property/base/~query/workFlow/Q_LOAD_FLOWS_BY_NODE_ID?nodeId=' + $("#curr_node_id").val(), {loadComplete: function () {

            initNextStepMan($("#handle_result").val(),'',function(){
                if(callback!=null&&callback!=""){
                    callback();
                }
                slideP.open("div_work_flow");
            });

        }});


    });

}
/*
 * 获取工单列表下一步处理人
 * */
function initNextStepMan(flowId, workOrderId,callback) {

    $('#next_step_man').combobox({
        url: '!property/base/~query/workFlow/Q_LOAD_NEXT_MAN?flowId=' + flowId + '&workOrderId=' + workOrderId,
        valueField: 'id',
        textField: 'text',
        mode: 'remote',
        onSelect: function (rec) {
            $('#next_step_man_id').val(rec.id);
            $('#next_step_man').val(rec.text);
        },
        onLoadSuccess: function () {
            if(callback!=''&&callback!=null){callback();}

        }
    });

}

/*
 * 提交工单
 * @param objectId实体id，如新增基站工单，则为基站id
 * @param callback工单处理成功之后回掉方法
 * */
function submitWorkFlow(objectId, callback) {
    //点击之后就移除该事件避免多次点击

    /*
     * 1、先根据流的id获取到流过该流时要执行的DS数据源的引用路径
     * 2、执行流过该流时需要执行的DS数据源
     * 3、驱动流程下一步
     * */

    rdcp.request('!property/base/~query/workFlow/Q_NEXT_WORK_FLOW', rdcp.id("workFlowForm").serialize(), function (data) {
        rdcp.unmask($(document.body));
        var suc = data.header.code;
        if (0 == suc) { //

            slideP.close();
            afterSubmitWorkFlow(objectId, callback);

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