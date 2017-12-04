//审核稿件列表参数--start
var params = {
    fitColumns: true,
    rownumbers:true,
    // onClickRow: getFactorRow,
    columns: [
        [
            {field: 'ID', title: 'ID', hidden: true, sortable: false, align: 'center', width: 0},
            {
                field: 'OPT',
                title: '审核',
                sortable: false,
                align: 'center',
                width: 100,
                formatter: function (cell, row, index) {
                    var del = '<a class="btn_view" href="javascript:void(0);"  onclick="viewManu(\'' + row.ID + '\');">预览</a>'+'<a class="btn_edit" href="javascript:void(0);"  onclick="examineManu(\'' + row.ID + '\');">审核</a>';
                    return del;
                }
            },
            {field: 'DEPT_NAME', title: '单位', sortable: false, align: 'center', width: 100},
            {field: 'COMPANY', title: '标题', sortable: false, align: 'center', width: 100},
            {field: 'NAME', title: '投稿人', sortable: false, align: 'center', width: 80},
            {field: 'STATE', title: '状态', sortable: false, align: 'center', width: 80,
                formatter: function(value, row, index){
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
/*            {field: 'REMARKS', title: '审稿意见', sortable: false, align: 'center', width: 100},*/
            {field: 'AUTHOR_ONE', title: '作者一', sortable: false, align: 'center', width: 80},
            {field: 'AUTHOR_TWO', title: '作者二', sortable: false, align: 'center', width: 80},
            {field: 'AUTHOR_THREE', title: '作者三', sortable: false, align: 'center', width: 80},
            /*            {field: 'CREATE_USER', title: '创建人', sortable: false, align: 'center', width: 100},*/
            {field: 'CREATE_TIME', title: '创建时间', sortable: false, align: 'center', width: 80}
        ]
    ]
};
//稿件管理列表参数--end
/**
 * rdcp.JS框架初始化
 */
rdcp.ready(function () {
    //生成表格rdcp.grid(tableId,url,formName,表格参数)
    rdcp.grid('listdt', '!gh/manu/~query/Q_EXAMINEMANU_LIST', "searchForm", params);

});

//预览稿件
function viewManu(manu_id) {
    //标签页ID
    var tabId = "viewManu";
    //标签页TILE
    var title = "预览信息";
    //标签页url
    var url = "!gh/manu/~/pages/viewManu.jsp?manu_id=" + manu_id;
    OpenTab(tabId, title, url);
    //window.open("!property/culturePropaganda/~/pages/addHistory.jsp?option=edit&history_id=" + history_id);
}
function examineManu(manu_id) {
    $("#manu_id").val(manu_id);
    rdcp.dialog(dlgOpts);
}

var dlgOpts = {
    title: "稿件审核",
    id: "dialog",
    width: "450",
    height: "200",
    parentwidth: true,
    modal: true,
    buttons: [
        {
            text: '确定',
            handler: function () {
                var state = $("#state").val();
                var remarks=$("#remarks").val().trim();
                if (state == 0) {
                    $.messager.alert('提示', '请输入审核结果！', 'info');
                    return false;
                }else if(state==4&&(remarks.length==0||remarks==null)){
                    $.messager.alert('提示', '请输入审核意见！', 'info');
                    return false;
                }
                rdcp.form.submit("examineManuForm", {url: "!gh/manu/~query/Q_EXAMINEMANU",
                    success: function (data) {
                        if (data.header.code == 0) {
                            $("#dialog").dialog("close");
                            $.messager.alert('提示', '稿件审核成功！', 'info');
                            $("#remarks").attr("value","");
                            rdcp.grid.reload("listdt");
                        } else {
                            $.messager.alert('提示', '稿件审核失败！', 'error');
                        }
                    }
                });

            }
        },
        {
            text: '取消',
            handler: function () {
                $("#dialog").dialog("close");
                $("#remarks").attr("value","");
            }
        }
    ]
};

