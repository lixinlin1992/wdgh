//稿件管理列表参数--start
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
                    var re = '<a class="btn_view" href="javascript:void(0);"  onclick="viewManu(\'' + row.ID + '\');">预览</a>';
                    var submit = '<a class="btn_commit" href="javascript:void(0);"  onclick="submitManu(\'' + row.ID + '\');">提交审核</a>';
                    var del = '<a class="btn_delete" href="javascript:void(0);"  onclick="delManu(\'' + row.ID + '\');">删除</a>';
                    if(row.STATE==-1||row.STATE==2||row.STATE==4){
                        re=re+submit+'<a class="btn_edit" href="javascript:void(0);"  onclick="editManu(\'' + row.ID + '\');">修改</a>'
                    }
                    if(row.STATE==-1) {
                        re +=del;
                    }
                    return re;
                }
            },
            {field: 'TITLE', title: '标题', sortable: false, align: 'center', width: 100},
            {field: 'DEPT_NAME', title: '单位', sortable: false, align: 'center', width: 90},
            {field: 'STATE', title: '状态', sortable: false, align: 'center', width: 80,
                formatter: function(value, row, index){
                    if (value == -1) {
                        return "新建"
                    }
                    if (value == 0) {
                        return "已提交"
                    }
                    else if (value == 1) {
                        return "通过审核"
                    }
                    else if (value == 2) {
                        return "未通过审核"
                    }
                    else if (value == 3) {
                        return "通过审批"
                    }
                    else if (value == 4) {
                        return "未通过审批"
                    }
                }},
            {field: 'REMARKS', title: '审稿意见', sortable: false, align: 'center', width: 80},
            {field: 'AUTHOR_ONE', title: '作者一', sortable: false, align: 'center', width: 60},
            {field: 'AUTHOR_TWO', title: '作者二', sortable: false, align: 'center', width: 60},
            {field: 'AUTHOR_THREE', title: '作者三', sortable: false, align: 'center', width: 60},
            {field: 'NAME', title: '投稿人', sortable: false, align: 'center', width: 60},
            {field: 'CREATE_TIME', title: '创建时间', sortable: false, align: 'center', width: 70}
        ]
    ]
};
//稿件管理列表参数--end
/**
 * rdcp.JS框架初始化
 */
rdcp.ready(function () {
    //生成表格rdcp.grid(tableId,url,formName,表格参数)
    /*    rdcp.request("!gh/manu/~query/Q_LOAD_DEPT_LIST",{},function(data) {
            var p = data.body.rows;
            for (var i = 0; i < data.body.rows.length; i++) {
                var html = "<option value='" + data.body.rows[i].ID+ "'>" + data.body.rows[i].NAME+ "</option>";
                $("#dept_id").append(html);
            }
        });*/
    rdcp.grid('menu_list', '!gh/manu/~query/Q_MANU_LIST', "searchForm", params);

});
//添加稿件管理方法
function addManu() {
    //标签页ID
    var tabId = "addManu";
    //标签页TILE
    var title = "发布信息";
    //标签页url
    var url = "!gh/manu/~/pages/manuForm.jsp?option=add";
    OpenTab(tabId, title, url);
    //window.open("!property/culturePropaganda/~/pages/addHistory.jsp?option=add");
}
//修改稿件管理
function editManu(manu_id) {
    //标签页ID
    var tabId = "editManu";
    //标签页TILE
    var title = "修改信息";
    //标签页url
    var url = "!gh/manu/~/pages/manuForm.jsp?option=edit&manu_id=" + manu_id;
    OpenTab(tabId, title, url);
    //window.open("!property/culturePropaganda/~/pages/addHistory.jsp?option=edit&history_id=" + history_id);
}
//预览稿件
function viewManu(manu_id) {
    //标签页ID
    var tabId = "viewManu"+manu_id;
    //标签页TILE
    var title = "预览信息";
    //标签页url
    var url = "!gh/manu/~/pages/viewManu.jsp?tag=1&&manu_id=" + manu_id;
    OpenTab(tabId, title, url);
    //window.open("!property/culturePropaganda/~/pages/addHistory.jsp?option=edit&history_id=" + history_id);
}

//删除历史文化
function delManu(manu_id) {
    $.messager.confirm("警告", "您确定要删除该条数据吗？",
        function (yesBtn) {
            if (yesBtn) {
                rdcp.request("!gh/manu/~query/Q_DEL_MANU", "manu_id=" + manu_id, function (data) {
                    $.messager.alert('提示', "删除成功！", 'info');
                    rdcp.grid.reload('menu_list');
                });
            }
        });
    //window.open("!property/culturePropaganda/~/pages/addHistory.jsp?option=edit&history_id=" + history_id);
}

function submitManu(manu_id){
    rdcp.request("!gh/manu/~query/Q_EXAMINEMANU",{"state":0,"remarks":"","manu_id":manu_id},function(data){
        if (data.header.code == 0) {
            $.messager.alert('提示', '提交审核成功！', 'info');
            rdcp.grid.reload("menu_list");
        } else {
            $.messager.alert('提示', '提交审核失败！', 'error');
        }
    });
}

parent.refreshGrid = function(){
    rdcp.grid.reload("menu_list");
}