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
</head>
<body style="padding: 0; margin: 0">
<%
    SysPUser user = (SysPUser) session.getAttribute(LoginUserSession.UserSession_Key);
%>

<div class="SR_Space">
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">
            修改密码
        </div>
        <div class="SR_moduleRight"></div>
    </div>
    <div class="SR_inputTable">
        <div class="SR_inputTableContent">
            <form name="modifyPass" id="modifyPass" method="post">
                <table>
                    <tr>
                        <td align="right" class="SR_inputTitle">会员帐号:</td>
                        <td>
                            <!--  <input id="memberId" name="memberId" type="text" value=<%=user.getAccount()%>> -->
                            <%=user.getAccount()%>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="SR_inputTitle">旧密码:</td>
                        <td>
                            <input id="oldPassword" name="oldPassword" class="SR_pureInput" type="password"><font
                                color="red"><span
                                id="oldvalid"/></font>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="SR_inputTitle">新密码:</td>
                        <td>
                            <input id="newPassword" name="newPassword" class="SR_pureInput" type="password"
                                   onfocus="onChange()"><font
                                color="red"><span id="newvalid"/></font>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="SR_inputTitle">确认密码:</td>
                        <td>
                            <input id="newPassword1" name="newPassword1" class="SR_pureInput" type="password"
                                   onblur="valiinput()"><font
                                color="red"><span id="valid"/></font>
                        </td>
                    </tr>
                    <tr>
                        <td align="right">
                            <input name="btnfunction" class="btnfunctionout" value="确定"
                                   type="button" onclick="SubmitModifyPass()"/>
                        </td>
                        <td >
                            <input name="btnfunction" class="btnfunctionout" value="重置" style="margin-left: 30px"
                                   type="reset"/>
                        </td>
                    </tr>
                </table>
            </form>
        </div>
    </div>
</div>
</body>
</html>
