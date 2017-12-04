<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" import="java.util.*" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%
    String path = request.getContextPath();
    String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
    String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
    String id = request.getParameter("id");
    String type = request.getParameter("type");
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
	<script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="!gh/wechat/~/js/idangerous.swiper.min.js"></script>
	<script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
</head>
<script type="text/javascript">
var id= "<%=id%>";
var type = "<%=type%>";
rdcp.ready(function(){
  $(".return").click(function(){
        history.back(-2);
  });
  if(type == "1")
    $("#head_div").append("公示公告");
  else
    $("#head_div").append("捐赠信息");
  loadNotices();
},rdcp.defaultLoadModules2);
function loadNotices(){
  rdcp.request("!gh/wechat/~java/Dbjz.getNotices",{"id":id},function(data){
    if(data.header.code == 0){
      var t = data.body.rows[0];
      $("#title").append(t.title);
      $("#copy_from").append("来自"+t.copy_from);
      $("#put_time").append(t.put_time);
      $("#content").append(t.content);
    }
    else{
      $.messager.alert("错误",data.errorMsg,"error");
    }
  });
}
</script>
<body style="background-color: #fff !important;">
<div class="warpe">
    <div class="head old-head2" id="head_div">
        <a href="#" class="return"><i class="icon-chevron-left"></i>返回</a>
        <%--<a href="#" id="sc_bth" class="search"><i class="icon-home"></i>&nbsp;</a>--%>
    </div>
    <div class="main">
        <div class="finance">
            <ul>
                <li class="animated fadeIn clear_border">
                    <a>
                        <p id="title"></p>
                        <p><span class="puff_left" id="copy_from"></span><span class="puff_right" id="put_time"></span> </p>
                        <div class="fin_txt" id="content">
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>
</html>

<script type="text/javascript">

</script>