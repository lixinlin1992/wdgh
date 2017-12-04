/**
 * Created by lh on 2014/9/28.
 */
//历史文化列表参数--start
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
                    var edit = '<a class="btn_edit" href="javascript:void(0);"  onclick="editInfoDiffusion(\'' + row.ID + '\');">修改</a>';
                    var view = '<a class="btn_view" href="javascript:void(0);"  onclick="viewHistory(\'' + row.ID + '\');">预览</a>';
                    var del = '<a class="btn_delete" href="javascript:void(0);"  onclick="delInfoDiffusion(\'' + row.ID + '\');">删除</a>';
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
//校园文化列表参数--end
/**
 * rdcp.JS框架初始化
 */
rdcp.ready(function () {
    //生成表格rdcp.grid(tableId,url,formName,表格参数)
    rdcp.grid('listdt', '!gh/staffService/~query/Q_STAFF_SERVICE_LIST', "searchForm", params);

});

function addInfoDiffusion(){
    //标签页ID
    var tabId = "addInfoDiffusion";
    //标签页TILE
    var title = "发布教工服务信息";
    //标签页url
    var url = "!gh/info/~/pages/infoDiffusionForm.jsp?option=add";
    OpenTab(tabId, title, url);
    //window.open("!property/culturePropaganda/~/pages/addHistory.jsp?option=add");
}
//修改校园文化
function editInfoDiffusion(id){
    //标签页ID
    var tabId = "editInfoDiffusion";
    //标签页TILE
    var title = "修改教工服务信息";
    //标签页url
    var url = "!gh/info/~/pages/infoDiffusionForm.jsp?option=edit&id="+id;
    OpenTab(tabId, title, url);
    //window.open("!property/culturePropaganda/~/pages/addHistory.jsp?option=edit&history_id=" + history_id);
}
//删除历史文化
function delInfoDiffusion(id){
    $.messager.confirm("警告", "您确定要删除该条数据吗？",
        function (yesBtn) {
            if(yesBtn) {
                rdcp.request("!gh/staffService/~query/Q_DEL_STAFF_SERVICE", "id="+id, function(data){
                    $.messager.alert('提示', "删除成功！", 'info');
                    rdcp.grid.reload('listdt');
                });
            }
    });
    //window.open("!property/culturePropaganda/~/pages/addHistory.jsp?option=edit&history_id=" + history_id);
}

//预览历史文化
function viewHistory(history_id){
    window.open("!property/culturePropaganda/~/pages/previewHistory.jsp?history_id=" + history_id);
}
