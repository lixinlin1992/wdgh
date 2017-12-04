<%@ page language="java" import="com.sunrise.framework.core.LoginUserSession" pageEncoding="UTF-8" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%
    String path = request.getContextPath();
    String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
    String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
    String curUserName = LoginUserSession.getLoginUserInfo() == null ? "null" : LoginUserSession.getLoginUserInfo().getName();
    request.setAttribute("_basePath", basePath);
    request.setAttribute("_curUserId", curUserName);
%>

<base href="${_basePath}"/>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
	<meta charset="UTF-8">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
	<meta content="telephone=no" name="format-detection" />
	<title>登录</title>
	<link href="!gh/wechat/~/css/main.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/style.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/shake.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
	<script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
    <script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="!gh/wechat/~/scripts/login.js"></script>
</head>
<%
	String nextPage = ((String)request.getParameter("page") == null)?"ghmenu":(String)request.getParameter("page") ;
%>

<script type="text/javascript">
    var nextPage = "<%=nextPage%>";
</script>
<body style="background-color: #fff !important;">
<div class="warpe">
	<div class="head">
		<a href="!gh/wechat/~/pages/ghmenu.jsp" class="return"><i class="icon-chevron-left"></i> 返回</a>
		登录
	</div>
	<div class="main">
		<div class="regall">
<form method="post" name="loginForm" id="loginForm_id" onsubmit="loginsys(); return false;">
	<div class="reginput">
		<input type="text" placeholder="工号" id="loginName" name="loginName">
	</div>
	<div class="reginput">
		<input type="password" placeholder="密码" id="password" name="password">
	</div>
	<div class="id_bth inersest_bth animated bounceIn" style="margin-top: 2rem;">
		<a href="javascript:void(0);" onclick="loginsys(nextPage);">登 录</a>
	</div>
	<%--<div class="regTxt">
        <p> <a href="password.html" class="puff_right">忘记密码</a></p>
    </div>--%>
	</div>
	</div>
	</div>
	</body>
	</html>