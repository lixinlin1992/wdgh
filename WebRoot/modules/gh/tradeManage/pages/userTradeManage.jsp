<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
<title>个人会籍管理</title>
<head>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <%
        String account;
        SysPUser user = (SysPUser) session.getAttribute(LoginUserSession.UserSession_Key);
        account = request.getParameter("account")==null?user.getAccount():request.getParameter("account");
    %>
    <script type="text/javascript">

    </script>
</head>
<style>
.tbBtn{
  width: 60px;
}
.tbBtn1{
    width: 200px;
}
</style>
<body style="padding: 0; margin: 0">

<div class="SR_Space">
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">会藉状态</div>
        <div class="SR_moduleRight">
            <a id="apply_to_trade" class="btn_add" href="javascript:void(0);" onclick="applyToTrade()">申请入会</a>
            <a id="apply_to_quit" class="btn_cancel" href="javascript:void(0);" onclick="applyToQuit()">申请退会</a>
        </div>
    </div>
    <div align="center">
        <!-- 搜索标头开始-->
        <div class="SR_searchTableBox">
                <div class="barquerycontent">
                    <table>
                        <tr>
                            <td style="width: 60px;">
                                会藉状态 :
                            </td>
                            <td id="status" name="trade_status" ></td>
                            <td style="display: none;font-color:red" id="notice">
                                <font color="red">提示:因超过六个月未缴纳会费导致被退会，请及时补交所欠会费！</font>
                            </td>
                        </tr>
                    </table>
                </div>
        </div>
    </div>
    <div class="SR_moduleBox" id="trade_info_title">
        <div class="SR_moduleTitle">会藉信息</div>
        <div class="SR_moduleRight">
            <a id="btn_view" class="btn_view" href="javascript:void(0);" onclick="viewTradeInfo()">查看详细信息</a>
            <a id="btn_edit" class="btn_edit" href="javascript:void(0);" onclick="editTradeInfo()">编辑会藉信息</a>
        </div>
    </div>
    <div align="center" id="trade_info_con">
        <!-- 搜索标头开始-->
        <div class="SR_searchTableBox">
            <div class="barquerycontent">
                <table border="0">
                    <tr>
                        <td align="left" style="width: 60px;">工号:</td>
                        <td id="account" name="account" style="width: 200px;"></td>
                        <td align="left" style="width: 60px;">姓名:</td>
                        <td id="name" name="name" style="width: 200px;"></td>
                        <td align="left" style="width: 60px;">性别:</td>
                        <td id="sex" name="sex" style="width: 200px;"></td>
                        <td align="left" style="width: 60px;">入会状态:</td>
                        <td id="trade_status" name="trade_status" style="width: 200px;"></td>
                    </tr>
                    <tr>
                        <td align="left" style="width: 60px;">所属工会:</td>
                        <td id="dept_name" name="dept_name" style="width: 200px;"></td>
                        <td align="left" style="width: 60px;">入会时间:</td>
                        <td id="intrade_date" name="intrade_date" style="width: 200px;" ></td>
                        <td align="left" style="width: 60px;">会员编号:</td>
                        <td id="leaguer_no" name="leaguer_no" style="width: 200px;"></td>
                        <td align="left" style="width: 60px;">会员类型:</td>
                        <td id="leaguer_type" name="leaguer_type" style="width: 200px;"></td>
                    </tr>
                    <tr>
                </table>
            </div>
        </div>
    </div>
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">申请记录</div>
        <div class="SR_moduleRight">
        </div>
    </div>
    <div class="SR_tableContentBox">
        <form name="recordForm" id="recordForm" style="display: none" onsubmit="return false;">
            <input type="hidden" name="account1" id="account1">
        </form>
        <table id="listdt"></table>
    </div>
    <div id="dialog" style="display: none;padding:0px !important;">
        <div class="SR_Space">
            <div class="SR_inputTable">
                <div class="SR_inputTableContent">
                    <form name="quitForm" id="quitForm" onsubmit="return false;">
                        <table>
                            <input type="hidden" name="user_account" id="user_account">
                            <tr>
                                <td class="SR_inputTitle">
                                    退会原因：
                                </td>
                                <td>
                                    <textarea id="reason" name="reason" style="width: 240px;height:45px"></textarea>
                                </td>&nbsp;
                            </tr>
                        </table>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript">
var account = "<%=account%>";
$("#account1").val(account);
$("#user_account").val(account);
var params = {
    fitColumns: true,
    rownumbers:true,
    // onClickRow: getFactorRow,
    columns: [
        [
            {field: 'APPLY_TIME', title: '申请时间', sortable: false, align: 'center', width: 100},
            {field: 'APPLY_TYPE', title: '申请类型', sortable: false, align: 'center', width: 80,
                formatter: function(value, row, index){
                    if (value == 0) {
                        return "入会";
                    }
                    else if (value == 1) {
                        return "会籍信息编辑";
                    }
                    else {
                        return "退会";
                    }
                }},
            {field: 'APPLY_STATUS', title: '申请状态', sortable: false, align: 'center', width: 80,
                formatter: function(value, row, index){
                    if (value == 0) {
                        return "驳回";
                    }
                    else if (value == 3) {
                        return "通过";
                    }
                    else {
                        return "审核中";
                    }
                }},
            {field: 'APPLY_REMARKS', title: '审核意见', sortable: false, align: 'center', width: 100}
        ]
    ]
};
rdcp.ready(function(){
    rdcp.form.load("trade_form", "!gh/tradeManage/~query/Q_GET_USER_TRADE_INFO", {"account":account}, function (data) {
        var p = data.body;
        if(p.trade_status==0||p.trade_status==2){
            $("#apply_to_quit").hide();
            $("#trade_info_title").hide();
            $("#trade_info_con").hide();
        }else if(p.trade_status==1){
            $("#apply_to_trade").hide();
        }else if(p.trade_status==3){
            $("#notice").css("display","");
            $("#apply_to_trade").hide();
            $("#apply_to_quit").hide();
            $("#trade_info_title").hide();
            $("#trade_info_con").hide();
        }
        $("#status").text(p.trade_status1);
        $("#account").text(p.account);
        $("#name").text(p.name);
        $("#sex").text(p.sex);
        $("#trade_status").text(p.trade_status1);
        $("#dept_name").text(p.dept_name);
        $("#intrade_date").text(p.intrade_date);
        $("#leaguer_no").text(p.leaguer_no);
        $("#leaguer_type").text(p.leaguer_type);
        $("#user_name").val(p.name);
        rdcp.grid('listdt', '!gh/tradeManage/~query/Q_USER_APPLY_LIST', "recordForm", params);
  });
    rdcp.form.load("trade_form","!gh/tradeManage/~query/Q_QUITED_USER_INFO", {"account":account}, function (data){
        var p = data.body;
        $("#card_no").val(p.card_no);
        $("#tele_phone").val(p.tele_phone);
        $("#dept_id").val(p.dept_id);
        $("#email").val(p.email);
    });
});
function cancel(){
   CloseTab("viewLeaguer", "查看会员信息");
}
function applyToQuit(){
    rdcp.request("!gh/tradeManage/~query/Q_GET_APPLY_NUM",{"account":account,"type":2},function(data) {
        var p = data.body;
        if(p.num>0){
            $.messager.alert("提示","用户已申请，请耐心等待结果！","info");
        }else{
            rdcp.dialog(dlgOpts);
        }
    });
}

var dlgOpts = {
    title: "申请退会",
    id: "dialog",
    width: "450",
    height: "200",
    parentwidth: true,
    modal: true,
    buttons: [
        {
            text: '确定',
            handler: function () {
                var reason = $("#reason").val().trim();
                if (reason.length==0) {
                    $.messager.alert('提示', '请输入退会原因！', 'info');
                    return false;
                }
                rdcp.form.submit("quitForm", {url: "!gh/tradeManage/~query/Q_APPLY_QUIT_TRADE",
                    success: function (data) {
                        if (data.header.code == 0) {
                            $("#dialog").dialog("close");
                            $.messager.alert('提示', '提交成功！', 'info');
                            rdcp.grid.reload("listdt");
                        } else {
                            $.messager.alert('提示', '提交失败！', 'error');
                        }
                    }
                });

            }
        },
        {
            text: '取消',
            handler: function () {
                $("#dialog").dialog("close");
            }
        }
    ]
};
function applyToTrade(){
    rdcp.request("!gh/tradeManage/~query/Q_GET_APPLY_NUM",{"account":account,"type":0},function(data) {
        var p = data.body;
        if(p.num>0){
            $.messager.alert("提示","用户已申请，请耐心等待结果！","info");
        }else{
            var tabId = "applyToTrade";
            var title = "申请入会";
            var url = "!gh/tradeManage/~/pages/applyToTrade.jsp?option=add";
            OpenTab(tabId, title, url);
        }
    });
    }
function editTradeInfo(){
    rdcp.request("!gh/tradeManage/~query/Q_GET_APPLY_NUM",{"account":account,"type":1},function(data) {
        var p = data.body;
        if(p.num>0){
            $.messager.alert("提示","用户已申请，请耐心等待结果！","info");
        }else{
            var tabId = "editTradeInfo";
            var title = "编辑会籍信息";
            var url = "!gh/tradeManage/~/pages/applyToTrade.jsp?option=edit";
            OpenTab(tabId, title, url);
        }
    });
}
function viewTradeInfo(){
    var tabId = "userTradeInfo";
    var title = "会籍信息";
    var url = "!gh/tradeManage/~/pages/userTradeInfo.jsp?option=view";
    OpenTab(tabId, title, url);
}
</script>
</body>
</html>
