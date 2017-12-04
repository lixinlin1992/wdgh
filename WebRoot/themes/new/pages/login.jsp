<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="java.text.SimpleDateFormat" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=gb2312"/>
    <jsp:include page="/pages/framework/base.jsp"/>
    <title>森锐-快速开发平台</title>
    <script type="text/javascript">
        $(function() {
            if (top.location.href != location.href){
                top.location.href = location.href;
                return;
            }

            document.loginForm.loginName.focus();
            document.loginForm.loginName.value="admin";
            document.loginForm.password.value = "123";
            document.loginForm.validateCode.value = "88888";
            loginsys();
        });

        function cheackFrom() {
            if ($("#loginName").val() == "" || $("#loginName").val() == null) {
                CORE.info("用户名不能为空,请登录");
                return false;
            }
            else if ($("#password").val() == "" || $("#password").val() == null) {
                return false;
            }

        }

        function loginsys() {
            if ($("#loginName").val() == "" || $("#loginName").val() == null) {
                CORE.info("用户名不能为空,请输入");
                return;
            }
            else if ($("#password").val() == "" || $("#password").val() == null) {
                CORE.info("密码不能为空,请输入");
                return;
            }
            else if ($("#validateCode").val() == "" || $("#validateCode").val() == null) {
                CORE.info("验证码不能为空,请输入");
                return;
            }
            else {
                CORE.submitForm("DS_USER_LOGIN", "loginForm", {},
                        function(body, heard) {
                            var megstr = unescape(heard.message + "," + body);
                            var suc = heard.code;
                            if (suc == 0) {
                                //window.location.reload();
                                window.location
                                        .href = "${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}";
                            } else {
                                CORE.info(megstr);
                            }
                        });
            }

        }
        function reGetImage() {
            imgurl = "framework.do?ds=DS_FRAMEWORK_SECURITY_VALIDATE_CODE&r=" + new Date();
            $("#vimg").attr("src", imgurl);
        }

    </script>
</head>
<body style="background:url(themes/default/images/index_010.gif) repeat-x; overflow:hidden;">
<div style=" width:1018px;margin:0 auto;">
    <form method="post" name="loginForm" id="loginForm" onsubmit="loginsys();return false;">
        <table width="1018" height="100%" border="0" cellpadding="0" cellspacing="0" align="center">
            <tr>
                <td colspan="3" background="themes/default/images/index_01.gif" width="1018" height="192">
                    <img src="themes/default/images/bale.png"/></td>
            </tr>
            <tr>
                <td background="themes/default/images/index_02.gif" width="334" height="190">
                    <img src="themes/default/images/bale.png"/></td>
                <td background="themes/default/images/index_03.jpg" width="371" height="190">
                    <table border="0" style="margin-top:40px; margin-left:80px;">
                        <tr height="30">
                            <td>用户名：</td>
                            <td><input name="loginName" type="text" class="inputtext" value="" id="loginName"></td>
                        </tr>
                        
                        <tr height="30">
                            <td>密&nbsp;&nbsp;码：</td>
                            <td><input name="password" id="password" type="password" value="" class="inputtext"></td>
                        </tr>
                        
                        <tr height="30">
                            <td>验证码：</td>
                            <td><input name="validateCode" id="validateCode" type="text" class="inputvail" style="width:70px;"><img
                                    src="framework.do?ds=DS_FRAMEWORK_SECURITY_VALIDATE_CODE&r=<%=new SimpleDateFormat("yyyyMMddkkmmss").format(new Date()) %>>"
                                    id="vimg" onclick="reGetImage()"></td>
                        </tr>
                        
                        <tr height="30">
                            <td colspan="2" align="center">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input
                                    type="submit" value="登录" class="btn">&nbsp;&nbsp;&nbsp;<input
                                    name="" type="button" value="重置" class="btn" onclick="$('#password').val('');"></td>
                        </tr>

                    </table>
                </td>
                <td background="themes/default/images/index_04.gif" width="313" height="190">
                    <img src="themes/default/images/bale.png"/></td>
            </tr>
            <tr>
                <td colspan="3" background="themes/default/images/index_05.gif" width="1018" height="255">
                    <img src="themes/default/images/bale.png"/></td>
            </tr>
        </table>
    </form>
</div>
</body>
</html>