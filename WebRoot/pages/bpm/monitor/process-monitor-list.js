var process_monitor_list_params = {
    colModel : [ {
        name : '流程实例ID',
        index : 'procinst_id',
        width : "10%",
        hidden : true,
        align : "center",
        sortable : false,
        formatoptions : {}
    }, {
        name : '流程定义编号',
        index : 'proc_def_id',
        width : "10%",
        hidden : false,
        align : "center",
        sortable : false,
        formatoptions : {}
    },{
        name : '流程名称',
        index : 'proc_name',
        width : "10%",
        align : "center",
        sortable : false,
        formatoptions : {}
    },{
        name : '流程启动用户',
        index : 'apply_user_name',
        width : "10%",
        align : "center",
        sortable : false,
        formatoptions : {}
    },{
        name : '开始时间',
        index : 'start_time',
        width : "12%",
        align : "center",
        sortable : false,
        formatoptions : {}
    }, {
        name : '结束时间',
        index : 'end_time',
        width : "10%",
        align : "center",
        sortable : false,
        formatoptions : {}
    }, {
        name : '撤销状态',
        index : 'status',
        width : "10%",
        align : "center",
        sortable : false,
        hidden : true,
        formatoptions : {}
    }, {
        name : '操作',
        index : '',
        width : "10%",
        align : "center",
        sortable : false,
        formatter : operation,
        formatoptions : {}
    }],
    caption : "任务委托列表",
    edit : true,
    multiselect : false,
    width : "100%",
    pager : "#listPagerdt"
};

function operation(cellValue,option,rowObject){
    var button = "";
    if(rowObject['status'] == 1){
        button = "<a href='javascript:void(0);' onclick='processRevoked(\""+rowObject['procinst_id']+"\",\""+rowObject['business_key']+"\")'>撤销</a>";
    }

    var url = "pages/bpm/monitor/process-detail-monitor-list.jsp?proInstId="+rowObject['procinst_id'];
    button += "  <a href='"+url+"' >流程查看</a>";
    return button;
}

/**
 * 流程撤销
 * @param procinstId
 */
var processRevoked = function(procinstId,bussinessKey){
    CORE.confirm("确定要撤销["+bussinessKey+"]这个流程吗?",function(){
        CORE.request("DS_PROCESS_REVOKE",{data:"procInstId="+procinstId},function(body,header){
            if(header.code == 0){
                CORE.tip(body);
                GRID.reload("processMonitorList");
            }
        });
    });
};


$(function(){
    GRID.create("#processMonitorList","DS_PROCESS_MONITOR_LIST",process_monitor_list_params,"");
});