/**
 * Created by lh on 2014/9/28.
 */
//基站列表
var params = {
    fitColumns: true,
    // onClickRow: getFactorRow,
    columns: [
        [
            {field: 'TASK_ID', title: 'TASK_ID', hidden: true, sortable: false, align: 'center', width: 0},
            {field: 'OBJ_ID', title: 'OBJ_ID', hidden: true, sortable: false, align: 'center', width: 0},
            {
                field: 'WO_ID',
                title: '操作',
                sortable: false,
                align: 'center',
                width: 80,
                formatter: function (cell, row, index) {
                    var edit = '<a class="btn_edit" href="javascript:void(0);"  onclick="handleWorkOrder(\'' + row.TASK_ID + '\',\'' + row.WO_ID +'\',\''+row.OBJ_ID+ '\');">办理</a>';
                    return edit;
                }
            },
            {field: 'WO_TITLE', title: '工单标题', sortable: false, align: 'left', width: 420},
            {field: 'START_MAN', title: '发起人', sortable: false, align: 'center', width: 60},
            {field: 'WO_TYPE', title: '流程名称', sortable: false, align: 'center', width: 80},
            {field: 'NODE_NAME', title: '当前环节', sortable: false, align: 'center', width: 80},
            {field: 'START_TIME', title: '接单时间', sortable: false, align: 'center', width: 100}
        ]
    ]
};
/**
 * 初始化
 */
rdcp.ready(function () {
    /*
     * 初始化提交按钮调用的方法
     * */
    rdcp.grid('listdt', '!property/base/~query/workFlow/Q_WORK_ORDERS_TODO_LIST', "conditionForm", params);

});

function handleWorkOrder(taskId, woId,objId) {

    openHandleForm(taskId, woId,objId);

}

function openHandleForm(taskId, woId,objId) {
    url = "!property/base/~/pages/workFlow/handleWorkForm.jsp?taskId=" + taskId + "&woId=" + woId+"&objId="+objId;
    var tabId = "handleWorkForm" + taskId;//tab唯一性
    var title = "处理工单";//选项卡标题名字
    OpenTab(tabId, title, url);
}
