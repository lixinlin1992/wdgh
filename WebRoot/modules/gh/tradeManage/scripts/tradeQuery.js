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
            {field: 'DEPT_NAME', title: '所属工会', sortable: false, align: 'center', width: 100},
            {field: 'ACCOUNT', title: '工号', sortable: false, align: 'center', width: 60},
            {field: 'NAME', title: '姓名', sortable: false, align: 'center', width: 60},
            {field: 'SEX', title: '性别', sortable: false, align: 'center', width: 80},
            {field: 'CARD_NO', title: '证件号', sortable: false, align: 'center', width: 80},
            {field: 'LEAGUER_TYPE', title: '会员类型', sortable: false, align: 'center', width: 50},
            {field: 'TRADE_STATUS', title: '会籍状态', sortable: false, align: 'center', width: 80},
            {field: 'INTRADE_DATE', title: '入会时间', sortable: false, align: 'center', width: 60},
            {field: 'LEAGUER_NO', title: '会员编号', sortable: false, align: 'center', width: 60}
        ]
    ]
};
//校园文化列表参数--end
/**
 * rdcp.JS框架初始化
 */
rdcp.ready(function () {
    //初始化单位下拉框
    rdcp.request("!gh/manu/~query/Q_LOAD_DEPT_LIST",{},function(data) {
        var p = data.body.rows;
        for (var i = 0; i < data.body.rows.length; i++) {
            var html = "<option value='" + data.body.rows[i].ID+ "'>" + data.body.rows[i].NAME+ "</option>";
            $("#dept_id").append(html);
        }
    });
    //查询用户角色和所在单位
    rdcp.request("!gh/tradeManage/~query/Q_GET_USER_INFO",{},function(data) {
        var p = data.body;
        var deptId=p.dept_id;
        $("#user_dept_id").val(p.dept_id);
        if(deptId==null||deptId.length==0){
            //生成空白表格
            rdcp.grid('listdt', '', "", params);
        }else if(deptId!=1){
            $("#dept_se").css("display","none");
            $("#dept_btn").css("display","none");
            var options=document.getElementById("dept_id").options;
            //var options=$("#dept_id").options;
            for(var i=0;i<options.length;i++){
                if(options[i].value==deptId){
                    options[i].selected=true;
                    break;
                }
            }
            //生成表格rdcp.grid(tableId,url,formName,表格参数)
            rdcp.grid('listdt', '!gh/tradeManage/~query/Q_TRADE_LIST', "searchForm", params);
        }else{
            rdcp.grid('listdt', '!gh/tradeManage/~query/Q_TRADE_LIST', "searchForm", params);
        }
    });
});
function viewLeaguer(account){
    var tabId = "viewLeaguer";
    var title = "查看会员信息";
    //标签页url
    var url = "!gh/tradeManage/~/pages/userTradeInfo.jsp?account="+account;
    OpenTab(tabId, title, url);
}

function tableReLoad(){
    var userDeptId= $("#user_dept_id").val();
    if(userDeptId==null||userDeptId.length==0){
        rdcp.grid('listdt', '', "", params);
    }else{
        rdcp.grid('listdt', '!gh/tradeManage/~query/Q_TRADE_LIST', "searchForm", params);
    }
}

function downExcel(){
    var userDeptId= $("#user_dept_id").val();
    if(userDeptId==null||userDeptId.length==0){
        $.messager.alert("提示", "无信息可导出！", "info");
    }else{
        rdcp.goto('!gh/tradeManage/~query/Q_TRADE_LIST',{params:'result=excel&fileName=会员信息导出',form:'searchForm'});
    }
}