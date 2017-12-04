<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="com.sunrise.framework.core.ApplicationManager" %>
<%@taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <r:include resource="!rdcp/~/pages/base.jsp"/>
    <link href="themes/default/css/loginorange.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript" src="themes/default/js/iepngfix_tilebg.js"></script>
    <title><%=ApplicationManager.getSystemName()%>
    </title>
    <script type="text/javascript">
        rdcp.ready(function () {
            if (top.location.href != location.href) {
                top.location.href = location.href;
                return;
            }

            document.loginForm.loginName.focus();
        });

        function loginsys() {
            if ($("#loginName").val() == "" || $("#loginName").val() == null) {
                alert("用户名不能为空");
                return;
            }
            else if ($("#password").val() == "" || $("#password").val() == null) {
                alert("密码不能为空");
                return;
            }
            else if ($("#validateCode").val() == "" || $("#validateCode").val() == null) {
                alert("验证码不能为空");
                return;
            }
            else {
                rdcp.request("DS_USER_LOGIN", rdcp.id("loginForm_id").serialize(), function (data) {
                    if (data.header.code == 0) {
                        window.location = "${_basePath}";
                    } else {
                        //CORE.info(megstr);
                        alert(data.header.message + "，" + data.body.content);
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
<!--LOGO摆放处22---Begin-->

<body class="loginBg">
<div class="loginHeaderSpace"></div>

<form method="post" name="loginForm" id="loginForm_id" onsubmit="loginsys(); return false;">
    <div class="loginBox">
        <div class="inputBox">
            <ul>
                <li class="userName"><input name="loginName" id="loginName" type="text" /></li>
                <li class="passWord"><input name="password" id="password" type="password" /></li>
                <li>
                    <div class="identifyingCode"><input name="validateCode" id="validateCode" class="proofinput"
                                                        type="text" /></div>
                    <div class="inputIdentifyingCode">
                        <div class="identifyingCodeImg"><img
                                src="framework.do?ds=DS_FRAMEWORK_SECURITY_VALIDATE_CODE&r=<%=new SimpleDateFormat("yyyyMMddkkmmss").format(new Date()) %>>"
                                id="vimg" onclick="reGetImage()" /></div>
                    </div>
                </li>
                <li><a class="loginBtn" href="#" onclick="loginsys();"></a><a class="cancelBtn" href="#"
                                                                              onclick="$('#password').val('');"></a>
                </li>
            </ul>
        </div>
        <input type="hidden" name="terminal" value="WEB" />
        <input type="submit" value="submit" style="width:0px;height: 0px;" />

        <div class="loginFooter">
            <!--
                <p>湖南物业管理系统 CopyRight2014©版权所有 广州市森锐电子科技有限公司</p>
             -->
        </div>
    </div>
</form>

<div class="loginMark"></div>
</body>
</html>