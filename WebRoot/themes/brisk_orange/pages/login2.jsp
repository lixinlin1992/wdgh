<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="com.sunrise.framework.core.ApplicationManager" %>
<%@taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <r:include resource="!rdcp/~/pages/base.jsp"/>
    <link href="themes/brisk_orange/css/style.css" rel="stylesheet" type="text/css" />
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
        $(function(){
            $('.loginbox').css({'position':'absolute','left':($(window).width()-692)/2});
        	$(window).resize(function(){
            $('.loginbox').css({'position':'absolute','left':($(window).width()-692)/2});
            })
        });
         function loginsys() {
            if ($("#loginName").val() == "" || $("#loginName").val() == null|| $("#loginName").val() == "用户名") {
                alert("用户名不能为空");
                return;
            }
            else if ($("#password").val() == "" || $("#password").val() == null|| $("#password").val() == "密码") {
                alert("密码不能为空");
                return;
            }
            else {
                rdcp.request("DS_USER_LOGIN", rdcp.id("loginForm_id").serialize(), function (data) {
                    if (data.header.code == 0) {
                        window.location = "${_basePath}pages/index.jsp";
                    } else {
                        //CORE.info(megstr);
                        alert(data.header.message + "，" + data.body.content);
                    }
                });
            }

        }

    </script>
</head>
<!--LOGO摆放处22---Begin-->

<body style="background-color:#e70606; background-image:url(themes/brisk_orange/images/login/light.png); background-repeat:no-repeat; background-position:center top; overflow:hidden;">
<div class="logintop">
    <span>欢迎登录后台管理界面平台</span>
    <ul>
      <li><a href="pages/home.jsp">回首页</a></li>
      <li><a href="#">帮助</a></li>
      <li><a href="#">关于</a></li>
    </ul>
</div>
<form id="loginForm_id" name="loginForm">
    <div class="loginbody">
      <span class="systemlogo"></span>
      <div class="loginbox">
          <ul>
            <li><input id="loginName" name="loginName" type="text" class="loginuser" value="用户名" onclick="JavaScript:this.value=''"/></li>
            <li><input id="password"  name="password" type="text" class="loginpwd" value="密码" onclick="JavaScript:this.value=''"/></li>
            <li><input name="" type="button" class="loginbtn" value="登录"  onclick="loginsys();"  />
            <!--<label><input name="" type="checkbox" value="" checked="checked" />记住密码</label>
            <label><a href="#">忘记密码？</a></label></li>-->
          </ul>
       </div>
    </div>
</form>
<div class="loginbm">版权所有  2017 <a href="javascript:void(0);">武汉大学信息中心</a></div>
</body>
</html>