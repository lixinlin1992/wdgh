/**
 * Created by lh on 2014/9/28.
 */
var trade_status;
var is_trademanger = false;
var is_schoolmanager = false;
var params = {
    fitColumns: false,
    // onClickRow: getFactorRow,
    columns: [
        [
            {field: 'APPLY_ID', title: 'APPLY_ID', hidden: true, sortable: false, align: 'center', width: 0},
            {
                field: 'OPT',
                title: '操作',
                sortable: false,
                align: 'center',
                width: 180,
                formatter: function (cell, row, index) {
                    var btns = '<a class="btn_view" href="javascript:void(0);"  onclick="viewTradeApply(\'' + row.APPLY_ID + '\');">查看</a>';
                    if((is_trademanger&&row.APPLY_STATUS=="二级工会管理员审核")||(is_schoolmanager&&row.APPLY_STATUS=="校工会管理员审核"))
                    btns += '&nbsp;<a class="btn_processor" href="javascript:void(0);"  onclick="auditTradeApply(\'' + row.APPLY_ID + '\',\''+row.APPLY_STATUS_ID+'\');">审核</a>';
                    return  btns;
                }
            },
            {field: 'APPLY_STATUS_ID', title: '当前申请状态', hidden:true},
            {field: 'APPLY_STATUS', title: '当前申请状态', sortable: false, align: 'center', width: 200},
            {field: 'ACCOUNT', title: '申请人工号', sortable: false, align: 'center', width: 150},
            {field: 'USER_NAME', title: '申请人名称', sortable: false, align: 'center', width: 150},
            {field: 'DEPT_NAME', title: '所属工会', sortable: false, align: 'center', width: 150},
            {field: 'APPLY_TIME', title: '申请时间', sortable: false, align: 'center', width: 150}
        ]
    ]
};
//校园文化列表参数--end
/**
 * rdcp.JS框架初始化
 */
rdcp.ready(function () {
    //生成表格rdcp.grid(tableId,url,formName,表格参数)
    rdcp.request("!gh/tradeManage/~query/Q_LOAD_USER_BASE_INFO",{},function(data){
        trade_status = data.body.rows[0].TRADE_STATUS;
        for(var i=0;i<data.body.rows.length;i++){
            if(data.body.rows[i].USER_GROUP_CODE=='tradeManager')
                is_trademanger = true;
            if(data.body.rows[i].USER_GROUP_CODE=='schoolManager')
                is_schoolmanager = true;
        }
        if(trade_status!="1")
          $("#btn_add").show();
        rdcp.grid('listdt', '!gh/tradeManage/~query/Q_TRADE_APPLY_LIST', "searchForm", params);
    });
});
function applyToTrade(){
    var tabId = "applyToTrade";
    var title = "申请入会";
    var url = "!gh/tradeManage/~/pages/applyToTrade.jsp?option=add";
    OpenTab(tabId, title, url);
}
function viewTradeApply(apply_id){
    var tabId = "view";
    var title = "查看入会申请";
    //标签页url
    var url = "!gh/tradeManage/~/pages/applyToTrade.jsp?option=view&apply_id="+apply_id;
    OpenTab(tabId, title, url);
}
function auditTradeApply(apply_id,apply_status){
    $("#apply_status").val(apply_status);
    $("#apply_id").val(apply_id);
    $("#audit_code").html(apply_status==1?"二级工会管理员审核":"校工会管理员审核");
    rdcp.dialog(auditDlgOpts);
}

var auditDlgOpts = {
    title: "审核入会申请",
    id: "auditDlg",
    width: "400",
    height: "230",
    parentwidth: true,
    modal: true,
    buttons: [
        {
          text:"提交",
          handler: function() {
              rdcp.form.submit("audit_form", {
                  url: "!gh/tradeManage/~query/Q_AUDIT_TRADE_APPLY" ,
                  success: function (data) {
                      $.messager.alert('提示', '审核成功！', 'info',function () {
                      });
                      $("#auditDlg").dialog("close");
                      rdcp.grid.reload('listdt');
                  }
              }, {"mask": true});
          }
        },
        {
            text: '取消',
            handler: function () {
                $("#auditDlg").dialog("close");
            }
        }
    ]
};