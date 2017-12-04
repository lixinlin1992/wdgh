/**
 * Created by lh on 2014/9/28.
 */
//历史文化列表参数--start
var params = {
    fitColumns: true,
    // onClickRow: getFactorRow,
    columns: [
        [
            {
                field: 'OPT',
                title: '操作',
                sortable: false,
                align: 'center',
                width: 180,
                formatter: function (cell, row, index) {
                    var btns = '<a class="btn_view" href="javascript:void(0);"  onclick="viewLeaguer(\'' + row.ACCOUNT + '\');">查看</a>';
                    if(row.TRADE_STATUS=="已入会")
                       btns += '&nbsp;<a class="btn_delete" href="javascript:void(0);"  onclick="delLeaguer(\'' + row.ACCOUNT + '\');">退会</a>';
                    else if(row.TRADE_STATUS=="已退会")
                        btns += '&nbsp;<a class="btn_refresh" href="javascript:void(0);"  onclick="recoverLeaguer(\'' + row.ACCOUNT + '\');">恢复</a>';
                    return  btns;
                }
            },
            {field: 'ACCOUNT', title: '工号', sortable: false, align: 'center', width: 150},
            {field: 'NAME', title: '姓名', sortable: false, align: 'center', width: 150},
            {field: 'DEPT_NAME', title: '所属工会', sortable: false, align: 'center', width: 150},
            {field: 'TRADE_STATUS', title: '会籍状态', sortable: false, align: 'center', width: 100},
            {field: 'INTRADE_DATE', title: '入会时间', sortable: false, align: 'center', width: 150},
            {field: 'LEAGUER_NO', title: '会员编号', sortable: false, align: 'center', width: 150}
        ]
    ]
};
//校园文化列表参数--end
/**
 * rdcp.JS框架初始化
 */
rdcp.ready(function () {
    //生成表格rdcp.grid(tableId,url,formName,表格参数)
    rdcp.grid('listdt', '!gh/tradeManage/~query/Q_TRADE_MANAGE_LIST', "searchForm", params);

});
function viewLeaguer(account){
    var tabId = "viewLeaguer";
    var title = "查看会员信息";
    //标签页url
    var url = "!gh/tradeManage/~/pages/userTradeInfo.jsp?account="+account;
    OpenTab(tabId, title, url);
}
function delLeaguer(account){
    $("#account").val(account);
    rdcp.dialog(auditDlgOpts);
}
function recoverLeaguer(account){
    rdcp.request("!gh/tradeManage/~query/Q_TRADE_STATUS_UPDATE",{"account":account},function(data){
        if(data==1){
            $.messager.alert("提示","操作成功!","info");
            rdcp.grid.reload("listdt");
        }
    });
}
var auditDlgOpts = {
    title: "退会",
    id: "delTradeDlg",
    width: "400",
    height: "250",
    parentwidth: true,
    modal: true,
    buttons: [
        {
          text:"提交",
          handler: function() {
              var trade_memo = $("#trade_memo").val();
              var account = $("#account").val();
              if(trade_memo==""||trade_memo==null){
                  $.messager.alert("提示","请输入退会理由!","info");
                  return;
              }
              rdcp.request("!gh/tradeManage/~query/Q_TRADE_STATUS_UPDATE",{"account":account,"trade_memo":trade_memo},function(data){
                  if(data==1){
                      $.messager.alert("提示","操作成功!","info");
                      rdcp.grid.reload("listdt");
                      $("#delTradeDlg").dialog("close");
                  }
              });
          }
        },
        {
            text: '取消',
            handler: function () {
                $("#delTradeDlg").dialog("close");
            }
        }
    ]
};