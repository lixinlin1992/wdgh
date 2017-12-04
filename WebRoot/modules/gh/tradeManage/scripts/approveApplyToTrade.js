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
                title: '审批',
                sortable: false,
                align: 'center',
                width: 100,
                formatter: function (cell, row, index) {
                    var del = '<a class="btn_view" href="javascript:void(0);"  onclick="view(\'' + row.APPLY_ID + '\');">预览</a>'+'<a class="btn_edit" href="javascript:void(0);"  onclick="approve(\'' + row.APPLY_ID + '\');">审批</a>';
                    return del;
                }
            },
            {field: 'APPLY_TIME', title: '申请时间', sortable: false, align: 'center', width: 100},
            {field: 'ACCOUNT', title: '工号', sortable: false, align: 'center', width: 100},
            {field: 'NAME', title: '姓名', sortable: false, align: 'center', width: 80},
            {field: 'TRADE_STATUS', title: '会籍状态', sortable: false, align: 'center', width: 80},
            {field: 'DEPT_NAME', title: '所属工会', sortable: false, align: 'center', width: 100},
            {field: 'CARD_NO', title: '证件号', sortable: false, align: 'center', width: 120},
            {field: 'TELE_PHONE', title: '电话', sortable: false, align: 'center', width: 100},
            {field: 'EMAIL', title: '邮箱', sortable: false, align: 'center', width: 100}
        ]
    ]
};
//稿件管理列表参数--end
/**
 * rdcp.JS框架初始化
 */
rdcp.ready(function () {

    rdcp.grid('listdt', '!gh/tradeManage/~query/Q_APPLY_TO_TRADE_LIST', "searchForm", params);


});

//预览稿件
function view(apply_id) {
    //标签页ID
    var tabId = "viewAdd";
    //标签页TILE
    var title = "预览入会申请";
    //标签页url
    var url = "!gh/tradeManage/~/pages/userTradeInfo.jsp?option=viewAdd&apply_id=" + apply_id;
    OpenTab(tabId, title, url);
    //window.open("!property/culturePropaganda/~/pages/addHistory.jsp?option=edit&history_id=" + history_id);
}
function approve(apply_id) {
    $("#apply_id").val(apply_id);
    rdcp.dialog(dlgOpts);
}

var dlgOpts = {
    title: "审批入会申请",
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
                if (state == -1) {
                    $.messager.alert('提示', '请选择审批结果！', 'info');
                    return false;
                }else if(state==0&&(remarks.length==0||remarks==null)){
                    $.messager.alert('提示', '请输入审批意见！', 'info');
                    return false;
                }
                rdcp.form.submit("auditForm", {url: "!gh/tradeManage/~query/Q_AUDIT_APPLY",
                    success: function (data) {
                        if (data.header.code == 0) {
                            $("#dialog").dialog("close");
                            $.messager.alert('提示', '审批成功！', 'info');
                            $("#remarks").attr("value","");
                            rdcp.grid.reload("listdt");
                        } else {
                            $.messager.alert('提示', '审批失败！', 'error');
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

