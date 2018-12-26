<%@ page language="java" import="com.sunrise.framework.core.LoginUserSession" pageEncoding="UTF-8" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%
	String path = request.getContextPath();
	String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
	String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
	String curUserName = LoginUserSession.getLoginUserInfo() == null ? "null" : LoginUserSession.getLoginUserInfo().getName();
	request.setAttribute("_basePath", basePath);
	String json = request.getParameter("json");
	String signature = request.getParameter("signature");
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
</head>
<body style="background-color: #fff !important;">
<form name='payFrom' method='post' action=''>
	<input type='hidden' name='json' value=''>
	<input type='hidden' name='signature' value=''>
</form>
<script type="text/javascript">
    rdcp.ready(function(){

    });
</script>
</body>
</html>