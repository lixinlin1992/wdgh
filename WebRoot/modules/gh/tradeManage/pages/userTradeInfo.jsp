<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
<title>修改密码</title>
<head>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <script type="text/javascript" src="!org/user/~/scripts/userModifyPass.js"></script>
    <%
        String account;
        SysPUser user = (SysPUser) session.getAttribute(LoginUserSession.UserSession_Key);
        account = request.getParameter("account")==null?user.getAccount():request.getParameter("account");
        String option = request.getParameter("option");
        String apply_id = request.getParameter("apply_id");
        String user_account = request.getParameter("user_account");
    %>
    <script type="text/javascript">
        var option = "<%=option%>";
        var apply_id = "<%=apply_id%>";
        var user_account = "<%=user_account%>";
    </script>
</head>
<body style="padding: 0; margin: 0">

<div class="SR_Space">
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">查看信息</div>
        <div class="SR_moduleRight">
        </div>
    </div>
    <div class="SR_inputTable">
        <div class="SR_inputTableContent">
            <form name="trade_form" id="trade_form" method="post">
                <h4 style="margin-top: 0px">基本信息</h4>
                <table border="0">
                    <tr>
                        <td align="right" class="SR_inputTitle" style="width:100px">工号:</td>
                        <td>
                            <input type="text" id="account" name="account" class="SR_pureInput" readonly style="width:200px"/>
                        </td>
                        <td align="right" class="SR_inputTitle" style="width:100px">姓名:</td>
                        <td>
                            <input type="text" id="name" name="name" class="SR_pureInput" readonly style="width:200px"/>
                        </td>
                        <td align="right" class="SR_inputTitle" style="width:100px">性别:</td>
                        <td>
                            <select id="sex" name="sex" style="width:200px">
                              <option value="-1">--请选择--</option>
                              <option value="1">男</option>
                              <option value="0">女</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="SR_inputTitle" style="width:100px">出生年月:</td>
                        <td>
                            <input type="text" id="birthday" name="birthday" class="SR_pureInput" style="width:200px"/>
                        </td>
                        <td align="right" class="SR_inputTitle" style="width:100px">政治面貌:</td>
                        <td>
                            <select id="political_status" name="political_status" style="width:200px">
                               <option value="-1">--请选择--</option>
                            </select>
                        </td>
                        <td align="right" class="SR_inputTitle" style="width:100px">民族:</td>
                        <td>
                            <input type="text" id="nation" name="nation" class="SR_pureInput" style="width:200px"/>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="SR_inputTitle" style="width:100px">电子邮箱:</td>
                        <td>
                            <input type="text" id="email" name="email" class="SR_pureInput" style="width:200px"/>
                        </td>
                        <td align="right" class="SR_inputTitle" style="width:100px">证件类型:</td>
                        <td>
                            <select id="card_type" name="card_type" style="width:200px">
                               <option value="-1">--请选择--</option>
                               <option value="1">身份证</option>
                               <option value="2">一卡通</option>
                            </select>
                        </td>
                        <td align="right" class="SR_inputTitle" style="width:100px">证件号:</td>
                        <td>
                            <input type="text" id="card_no" name="card_no" class="SR_pureInput" style="width:200px"/>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="SR_inputTitle" style="width:100px">学历:</td>
                        <td>
                            <select id="qualifications" name="qualifications" style="width:200px">
                               <option value="-1">--请选择--</option>
                            </select>
                        </td>
                        <td align="right" class="SR_inputTitle" style="width:100px">学位:</td>
                        <td>
                            <select id="degree" name="degree" style="width:200px">
                                <option value="-1">--请选择--</option>
                            </select>
                        </td>
                        <td align="right" class="SR_inputTitle" style="width:100px">岗位:</td>
                        <td>
                            <input type="text" id="post" name="post" class="SR_pureInput" style="width:200px"/>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="SR_inputTitle" style="width:100px">职务职称:</td>
                        <td>
                            <input type="text" id="duties" name="duties" class="SR_pureInput" style="width:200px"/>
                        </td>

                        <td align="right" class="SR_inputTitle" style="width:100px">手机号:</td>
                        <td>
                            <input type="text" id="tele_phone" name="tele_phone" class="SR_pureInput" style="width:200px"/>
                        </td>
                        <td align="right" class="SR_inputTitle" style="width:100px">备注:</td>
                        <td colspan="3">
                            <textarea id="memo" name="memo" rows="5" style="width:200px"></textarea>
                        </td>
                    </tr>
                </table>
                <h4 style="margin-top: 0px">会藉信息</h4>
                <table border="0">
                    <tr>
                        <td align="right" class="SR_inputTitle" style="width:100px">会籍状态:</td>
                        <td>
                            <input id="trade_status" name="trade_status" style="width:200px">
                        </td>
                        <td align="right" class="SR_inputTitle" style="width:100px">会员编号:</td>
                        <td>
                            <input type="text" id="leaguer_no" name="leaguer_no" class="SR_pureInput" style="width:200px"/>
                        </td>
                        <td align="right" class="SR_inputTitle" style="width:100px">编制类型:</td>
                        <td>
                            <select id="leaguer_type" name="leaguer_type" style="width: 200px">
                                <option value="-1">--请选择--</option>
                                <option value="1">--编制人员--</option>
                                <option value="2">--非编制人员--</option>
                                <option value="3">--类型3--</option>
                                <option value="4">--类型4--</option>
                                <option value="5">--类型5--</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="SR_inputTitle" style="width:100px">所属工会:</td>
                        <td>
                            <select id="dept_id" name="dept_id" style="width:200px">
                               <option value="-1">--请选择--</option>
                            </select>
                        </td>
                        <td align="right" class="SR_inputTitle" style="width:100px" id="intrade_date_btn">入会时间:</td>
                        <td>
                            <input type="text" id="intrade_date" name="intrade_date" class="SR_pureInput" style="width:200px"/>
                        </td>
                    </tr>
                </table>
                <h4 style="margin-top: 0px" id="apply_info">申请信息</h4>
                <table border="0" id="apply_info_table">
                    <tr>
                        <td align="right" class="SR_inputTitle" style="width:100px">申请时间:</td>
                        <td>
                            <input id="apply_time" name="apply_time" style="width:200px">
                        </td>
                        <td align="right" class="SR_inputTitle" style="width:100px" id="reason_btn">退会原因:</td>
                        <td id="reason_td">
                            <textarea id="reason" name="reason" rows="5" style="width:200px"></textarea>
                        </td>
                        <td align="right" class="SR_inputTitle" style="width:100px"></td>
                        <td >
                            <input style="width:200px;visibility: hidden;">
                        </td>
                    </tr>
                </table>
            </form>
        </div>
    </div>
</div>
<script type="text/javascript">
var account = "<%=account%>";
rdcp.ready(function(){
  rdcp.request("!gh/tradeManage/~query/Q_LOAD_TRADE_PARAM_CODE",{},function(data){
    var p = data.body.rows;
    for(var i=0;i<p.length;i++){
       var html = "<option value='"+p[i].CODE_NUM+"'>"+p[i].NAME+"</option>";
       $("#"+p[i].CODE).append(html);
    }
    if(option=="view"){
        $("#apply_info").hide();
        $("#apply_info_table").hide();
        rdcp.form.load("trade_form", "!gh/tradeManage/~query/Q_LOAD_USER_TRADE_INFO", {"account":account}, function (data) {

        });
    }else if(option=="viewAdd"){
        $("#intrade_date_btn").hide();
        $("#intrade_date").hide();
        $("#reason_td").hide();
        $("#reason_btn").hide();
        rdcp.form.load("trade_form", "!gh/tradeManage/~query/Q_LOAD_USER_APPLY_INFO", {"apply_id":apply_id}, function (data) {

        });
    }else if(option=="viewEdit"){
        $("#reason_btn").hide();
        $("#reason_td").hide();
        rdcp.form.load("trade_form", "!gh/tradeManage/~query/Q_LOAD_USER_APPLY_INFO", {"apply_id":apply_id}, function (data) {

        });
    }else if(option=="viewQuit"){
//        退会申请预览
        rdcp.form.load("trade_form", "!gh/tradeManage/~query/Q_LOAD_USER_APPLY_INFO", {"apply_id":apply_id}, function (data) {

        });
    }
    else if(option=="viewInfo"){
        $("#apply_info").hide();
        $("#apply_info_table").hide();
        rdcp.form.load("trade_form", "!gh/tradeManage/~query/Q_LOAD_USER_TRADE_INFO", {"account":user_account}, function (data) {

        });
    }
  });
});
</script>
</body>
</html>
