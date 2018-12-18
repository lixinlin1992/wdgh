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
</head>
<body style="background-color: #fff !important;">
<form id="pay_form" action="gatewayWeb" method="post">
	<input type="text" name="business_channel" value="yxsf" placeholder="支付业务渠道">
	<input type="text" name="orderno" value="L2017070713473921478" placeholder="订单号">
	<input type="text" name="amt" value="0.1" placeholder="支付金额">
	<input type="text" name="feename" value="赵敏正在缴费，缴费金额：0.1元" placeholder="支付项目名称">
	<input type="text" name="accounttype" value="cust_no" placeholder="账号类型">
	<input type="text" name="name" value="赵敏" placeholder="姓名">
	<input type="text" name="custno" value="2016001" placeholder="学号">
	<input type="text" name="back_notify_url" value="http://localhost/wdgh/!gh/wechat/~java/PayService.receivePayStatus" placeholder="后台通知地址">
	<input type="text" name="front_notify_url" value="http://localhost/wdgh/!gh/wechat/~/pages/success.jsp" placeholder="前端支付成功返回地址">
	<input type="button" onclick="submitPay();" value="提交">
</form>
<script type="text/javascript">
rdcp.ready(function(){

});
function submitPay(){
	rdcp.form.submit("pay_form", {url: "!gh/wechat/~java/PayService.pay" , success: function (data) {

		}
	}, {"mask": true});
}
</script>
</body>
</html>