<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="com.sunrise.framework.core.ApplicationManager" %>
<%@taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <r:include resource="!rdcp/~/pages/base.jsp"/>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>欢迎登录后台管理系统</title>
    <link href="themes/brisk_orange/css/style.css" rel="stylesheet" type="text/css" />
    <script language="javascript" src="themes/brisk_orange/js/cloud.js" type="text/javascript"></script>

    <script language="javascript">
        $(function(){
            $('.loginbox').css({'position':'absolute','left':($(window).width()-692)/2});
            $(window).resize(function(){
                $('.loginbox').css({'position':'absolute','left':($(window).width()-692)/2});
            });
        });
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

    </script>
</head>
<body style="background-color:#39a1f6; background-image:url(themes/brisk_orange/images/login/light.png); background-repeat:no-repeat; background-position:center top; overflow:hidden;">
<div id="mainBody">
    <div id="cloud1" class="cloud"></div>
    <div id="cloud2" class="cloud"></div>
</div>
<div class="logintop">
    <span>欢迎登录后台管理界面平台</span>
    <ul>
        <li><a href="#">回首页</a></li>
        <li><a href="#">帮助</a></li>
        <li><a href="#">关于</a></li>
    </ul>
</div>
<div class="loginbody">
    <span class="systemlogo"></span>
    <form method="post" name="loginForm" id="loginForm_id" onsubmit="loginsys(); return false;">
        <input type="hidden" id="validateCode" name="validateCode" value="888888"/>
        <div class="loginbox">
            <ul>
                <li><input id="loginName" name="loginName" type="text" class="loginuser" value="" onclick="JavaScript:this.value=''"/></li>
                <li><input id="password" name="password" type="text" class="loginpwd" value="密码" onclick="JavaScript:this.value=''"/></li>
                <li><input name="" type="button" class="loginbtn" value="登录"  onclick="loginsys();"  /><label><input name="" type="checkbox" value="" checked="checked" />记住密码</label><label><a href="#">忘记密码？</a></label></li>
            </ul>
        </div>
    </form>
</div>
<div class="loginbm">版权所有  2016 <a href="http://www.uimaker.com">新洲区文化局</a>智慧旅游平台</div>
<div class="loginMark"></div>
</body>
</html>
