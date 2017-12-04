//审核稿件列表参数--start
var params = {
    fitColumns: true,
    rownumbers:true,
    // onClickRow: getFactorRow,
    columns: [
        [
            {
                field: 'OPT',
                title: '操作',
                sortable: false,
                align: 'center',
                width: 100,
                formatter: function (cell, row, index) {
                    var del='';
                    if(row.STATUS==1){
                        del = '<a class="btn_view" href="javascript:void(0);"  onclick="view(\'' + row.ACCOUNT + '\');">预览</a>'+'<a class="btn_edit" href="javascript:void(0);"  onclick="quit(\'' + row.ACCOUNT + '\');">退会</a>';
                    }else if(row.STATUS==3){
                        del = '<a class="btn_view" href="javascript:void(0);"  onclick="view(\'' + row.ACCOUNT + '\');">预览</a>'+'<a class="btn_edit" href="javascript:void(0);"  onclick="recover(\'' + row.ACCOUNT + '\');">恢复会籍</a>';
                    }
                    return del;
                }
            },
            {field: 'ACCOUNT', title: '工号', sortable: false, align: 'center', width: 100},
            {field: 'NAME', title: '姓名', sortable: false, align: 'center', width: 80},
            {field: 'TRADE_STATUS', title: '会籍状态', sortable: false, align: 'center', width: 80},
            {field: 'INTRADE_DATE', title: '入会时间', sortable: false, align: 'center', width: 80},
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
            rdcp.grid('listdt', '!gh/tradeManage/~query/Q_QUIT_MANAGE_LIST', "searchForm", params);
});
function changeList(){
    rdcp.grid('listdt', '!gh/tradeManage/~query/Q_QUIT_MANAGE_LIST', "searchForm", params);
}
//预览稿件
function view(account) {
    //标签页ID
    var tabId = "viewInfo";
    //标签页TILE
    var title = "查看会籍信息";
    //标签页url
    var url = "!gh/tradeManage/~/pages/userTradeInfo.jsp?option=viewInfo&user_account="+account;
    OpenTab(tabId, title, url);
    //window.open("!property/culturePropaganda/~/pages/addHistory.jsp?option=edit&history_id=" + history_id);
}
function quit(account) {
    $.messager.confirm('确认操作', '确定将该会员退会？', function(r)
    {
        if (r)
        {
            rdcp.form.submit("searchForm", {url: "!gh/tradeManage/~query/Q_QUIT_OPERATE"+ "?account="+account+"&status="+3,
                success: function (data) {
                    if (data.header.code == 0) {
                        $.messager.alert('提示', '退会成功！', 'info');
                        rdcp.grid.reload("listdt");
                    } else {
                        $.messager.alert('提示', '退会失败！', 'error');
                    }
                }
            });
        }
    });
}

function recover(account){
        $.messager.confirm('确认操作', '确定恢复该会员会籍？', function(r)
        {
            if (r)
            {
                rdcp.form.submit("searchForm", {url: "!gh/tradeManage/~query/Q_QUIT_OPERATE"+ "?account="+account+"&status="+1,
                    success: function (data) {
                        if (data.header.code == 0) {
                            $.messager.alert('提示', '恢复成功！', 'info');
                            rdcp.grid.reload("listdt");
                        } else {
                            $.messager.alert('提示', '恢复失败！', 'error');
                        }
                    }
                });
            }
        });
}


