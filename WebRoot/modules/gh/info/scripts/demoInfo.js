/**
 * Created by dlz on 2017/6/19.
 */
//工会概况列表参数--start
var params = {
    fitColumns: true,
    rownumbers:true,
    // onClickRow: getFactorRow,
    columns: [
        [
            {field: 'ID', title: 'ID', hidden: true, sortable: false, align: 'center', width: 0},
            {
                field: 'OPT',
                title: '操作',
                sortable: false,
                align: 'center',
                width: 180,
                formatter: function (cell, row, index) {
                    var edit = '<a class="btn_edit" href="javascript:void(0);"  onclick="editDemoInfo(\'' + row.ID + '\');">修改</a>';
                    var del = '<a class="btn_delete" href="javascript:void(0);"  onclick="delDemoInfo(\'' + row.ID + '\');">删除</a>';
                    return  edit+ "&nbsp;" + del;
                }
            },
            {field: 'TITLE', title: '信息标题', sortable: false, align: 'center', width: 420},
            {field: 'TYPE', title: '信息类别', sortable: false, align: 'center', width: 80},
            {field: 'VIEW_TIMES', title: '阅读次数', sortable: false, align: 'center', width: 80},
            {field: 'CREATE_TIME', title: '创建时间', sortable: false, align: 'center', width: 100},
            {field: 'CREATE_USER', title: '创建人', sortable: false, align: 'center', width: 100}
        ]
    ]
};
//工会概况列表参数--end
/**
 * rdcp.JS框架初始化
 */
rdcp.ready(function () {
    //生成表格rdcp.grid(tableId,url,formName,表格参数)
    rdcp.grid('listdt', '!gh/info/~query/Q_DEMO_INFO_LIST', "searchForm", params);

});
//添加工会概况
function addDemoInfo(){
    //标签页ID
    var tabId = "addDemoInfo";
    //标签页TILE
    var title = "发布信息";
    //标签页url
    var url = "!gh/info/~/pages/demoInfoForm.jsp?option=add";
    OpenTab(tabId, title, url);
}
//修改工会概况
function editDemoInfo(info_id){
    //标签页ID
    var tabId = "editDemoInfo";
    //标签页TILE
    var title = "修改信息";
    //标签页url
    var url = "!gh/info/~/pages/demoInfoForm.jsp?option=edit&info_id="+info_id;
    OpenTab(tabId, title, url);
}
//删除工会概况
function delDemoInfo(info_id){
    $.messager.confirm("警告", "您确定要删除该条数据吗？",
        function (yesBtn) {
            if(yesBtn) {
                rdcp.request("!gh/info/~query/Q_DEL_DEMO_INFO", "info_id="+info_id, function(data){
                    $.messager.alert('提示', "删除成功！", 'info');
                    rdcp.grid.reload('listdt');
                });
            }
    });
}
