/**
 * Created by lh on 2014/9/28.
 */
//基站列表
var params = {
    fitColumns: true,
    // onClickRow: getFactorRow,
    columns: [
        [
            {
                field: 'WO_ID',
                title: '操作',
                sortable: false,
                align: 'center',
                width: 80,
                formatter: function (cell, row, index) {
                    var edit = '<a class="btn_view" href="javascript:void(0);"  onclick="viewWorkOrder(\''  + row.WO_ID +'\',\''  + row.OBJECT_ID +'\');">查看</a>';
                    if(row["CURR_STATUS"] != '已结束' && row["NUM"] == "3")  //工单未结束且该工单的任务记录条数为3，也就是该工单在发单人的下一个接单人中
                        edit += " " + '<a class="btn_view" href="javascript:void(0);"  onclick="endWorkOrder(\''  + row.TASK_ID +'\',\''  + row.OBJECT_ID +'\');">撤回</a>';
                    return edit;
                }
            },
            {field: 'ID', title: '工单号', sortable: false, align: 'center', width: 30},
            {field: 'CURR_STATUS', title: '当前状态', sortable: false, align: 'center', width: 80},
            {field: 'WO_TYPE', title: '流程名称', sortable: false, align: 'center', width: 80},
            {field: 'WO_TITLE', title: '工单标题', sortable: false, align: 'left', width: 250},
            {field: 'NOTE', title: '工单备注', sortable: false, align: 'center', width: 80}
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
    rdcp.grid('listdt', '!property/base/~query/workFlow/Q_WORK_ORDERS_HISTORY_LIST', "conditionForm", params);
});

function viewWorkOrder(woId,obj) {

    openHandleForm(woId,obj);

}

function openHandleForm(woId,obj) {
    url = "!property/base/~/pages/workFlow/viewWorkForm.jsp?woId=" + woId +"&objId="+obj;
    var tabId = "handleWorkForm" + woId;//tab唯一性
    var title = "工单处理记录";//选项卡标题名字
    OpenTab(tabId, title, url);
}

function endWorkOrder(task_id,object_id)
{
    $.messager.confirm("提示","您确定要撤回该工单吗？",function(r){
        if(r)
        {
            rdcp.request("!property/base/~query/workFlow/Q_ROLL_BACK_WORK_ORDER",{task_id:task_id},function(data)
            {
                if(data.body.ds_for_exe != undefined && data.body.ds_for_exe != "")
                {
                    rdcp.request(data.body.ds_for_exe,{"objectId":object_id},function(){
                        $.messager.alert("提示","工单撤回成功","info");
                    });
                }else{
                    $.messager.alert("提示","工单撤回成功","info");
                }
                rdcp.grid.reload("listdt");
            });
        }
    })
}