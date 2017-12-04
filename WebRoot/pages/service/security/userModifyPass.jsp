<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
<title>修改密码</title>
<head>
    <jsp:include page="/pages/framework/base.jsp"/>
    <link href="themes/default/css/style.css" rel="stylesheet"
          type="text/css">
    <link href="themes/default/css/public.css" rel="stylesheet"
          type="text/css"/>
    <link href="themes/default/css/publicform.css" rel="stylesheet"
          type="text/css"/>
    <script type="text/javascript" src="scripts/sunrise/common.js"></script>
    <script type="text/javascript">

        $(function() {
            //	CORE.loadRules("modifyPass","SYS_USERMODIFYPASS");
        });
        function SubmitModifyPass() {
            if ($("#oldPassword").attr("value") == null || $("#oldPassword").attr("value") == "") {
                $("#oldvalid").html("此项不能为空,请输入.");
            }
            else if ($("#newPassword").attr("value") == null || $("#newPassword").attr("value") == "") {
                $("#oldvalid").html("");
                $("#newvalid").html("此项不能为空,请输入.");
            }
            else if ($("#newPassword1").attr("value") == null || $("#newPassword1").attr("value") == "") {
                $("#oldvalid").html("");
                $("#newvalid").html("");
                $("#valid").html("此项不能为空,请输入.");
            }
            else if ($("#newPassword").attr("value") == $("#newPassword1").attr("value")) {
                $("#newvalid").html("");
                CORE.submitForm("DS_FRAMEWORK_SERVICE_SECURITY_MODIFY_USER_PASS", "modifyPass", {},
                        function(msg,header) {
                            CORE.info(unescape(header.message));
                        });
            }
            else {
                CORE.info("输入的新密码不一致!");
            }
        }

        //验证密码
        function valiinput() {
            if ($("#newPassword").attr("value") == $("#newPassword1").attr("value")) {
                $("#valid").html("");
            } else {
                $("#valid").html("输入的密码不一致,请重新输入");
                $("#newPassword").attr("value", "");
                $("#newPassword1").attr("value", "");
            }
        }

        //密码输入框重新获得焦点
        function onChange() {
            $("#newPassword1").attr("value", "");
        }
    </script>
</head>
<body style="padding: 0; margin: 0">
<%
    SysPUser user = (SysPUser)session.getAttribute(LoginUserSession.UserSession_Key);
%>
<jsp:include page="/pages/navbar.jsp"/>
<div class="modules">
    <div class="barquery">
        <div class="barqueryleft">
        </div>
        <div class="barquerycenter">
            修改密码
        </div>
        <div class="barqueryright"></div>
    </div>
    <div class="barquerycontent" style="padding: 10px;" align="center">
        <p align="center">

        <form name="modifyPass">
            <table>
                <tr>
                    <td align="right">会员帐号:</td>
                    <td>
                        <!--  <input id="memberId" name="memberId" type="text" value=<%=user.getAccount()%>> -->
                        <%=user.getAccount()%>
                    </td>
                </tr>
                <tr>
                    <td align="right">旧密码:</td>
                    <td>
                        <input id="oldPassword" name="oldPassword" type="password"><font color="red"><span
                            id="oldvalid"/></font>
                    </td>
                </tr>
                <tr>
                    <td align="right">新密码:</td>
                    <td>
                        <input id="newPassword" name="newPassword" type="password" onfocus="onChange()"><font
                            color="red"><span id="newvalid"/></font>
                    </td>
                </tr>
                <tr>
                    <td align="right">确认密码:</td>
                    <td>
                        <input id="newPassword1" name="newPassword1" type="password" onblur="valiinput()"><font
                            color="red"><span id="valid"/></font>
                    </td>
                </tr>
                <tr>
                    <td align="right">
                        <input name="btnfunction" class="btnfunctionout" value="确定"
                               type="button" onclick="SubmitModifyPass()"/>
                    </td>
                    <td>
                        <input name="btnfunction" class="btnfunctionout" value="重置"
                               type="reset"/>
                    </td>
                </tr>
            </table>

        </form>
    </div>
</div>
</body>
</html>
