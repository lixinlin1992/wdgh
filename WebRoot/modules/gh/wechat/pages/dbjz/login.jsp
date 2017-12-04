<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" import="java.util.*" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%
    String path = request.getContextPath();
    String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
    String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
    request.setAttribute("_basePath", basePath);
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
<script type="text/javascript">
rdcp.ready(function(){
});
function loginDbjz(){
  var userAccount = $("#userAccount").val();
  var userName = $("#userName").val();
  if(userAccount == null || userAccount == ""){
     $.messager.alert("提示","请输入人事号","info");
     return;
  }
  if(userName == null || userName == ""){
	 $.messager.alert("提示","请输入姓名","info");
	 return;
  }
  rdcp.request("!gh/wechat/~java/Dbjz.login",{"userName":userName,"userAccount":userAccount},function(data){
    if(data.header.code == 0){
      if(data.body=="-1"){
        $.messager.alert("提示","信息错误，请确认后再输入!","info");
      }
      else if(data.body=="1"){
        window.location.href="!gh/wechat/~/pages/dbjz/index.jsp";
      }
    }
    else{
      $.messager.alert("提示","请求失败，请稍后重试!","error");
    }
  });
}
$(".return").click(function(){
    history.back(-1);
});
</script>
<body style="background-color: #fff !important;">
<div class="warpe g-dbjz">
	<div class="head">
		<a href="!gh/wechat/~/pages/ghmenu.jsp" class="return"><i class="icon-chevron-left"></i> 返回</a>
		大病救助-登录
	</div>
	<div class="main">
		<div class="regall">
			<div class="reginput">
				<input type="text" placeholder="人事号" id="userAccount" name="userAccount">
			</div>
			<div class="reginput">
				<input type="text" placeholder="姓名" id="userName" name="userName">
			</div>
			<div class="id_bth inersest_bth animated bounceIn" style="margin-top: 2rem;">
				<a href="javascript:void(0);" onclick="loginDbjz();">登 录</a>
			</div>
		</div>
	</div>
</div>
</body>
</html>