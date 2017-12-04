<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" import="java.util.*" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.bean.YftkUser" %>
<%
    String path = request.getContextPath();
    String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
    String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
    YftkUser user = (YftkUser)request.getSession().getAttribute("YftkUser");
    int user_id = user.getUser_id();
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
	<title>内心独白</title>
	<link href="!gh/wechat/~/css/main.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/style.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/shake.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/datetime/mobiscroll.custom-3.0.0.min.css" rel="stylesheet" type="text/css">
	<!--<link href="!gh/wechat/~/css/datetime/bootstrap.css" rel="stylesheet" type="text/css">-->
	<script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
    <script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
    <script type="text/javascript" src="!gh/wechat/~/js/datetime/mobiscroll.custom-3.0.0.min.js"></script>
    <!--<r:include resource="!gh/wechat/~/pages/base/datetime.jsp"/>-->
</head>
<script type="text/javascript">
var user_id = <%=user_id%>;
rdcp.ready(function(){
  rdcp.form.load("user_form","!gh/wechat/~java/YftkAction.getUserInfo2",{"user_id":user_id},function(data){
    var t = data.body;
    $("#note").val(t.note);
  });
  $(".return").click(function(){
      history.back(-2);
  });
},rdcp.defaultLoadModules2);
function save(){
  var note = $("#note").val();
  rdcp.request("!gh/wechat/~java/YftkAction.updateField",{"user_id":user_id,"note":note},function(data){
    if(data.header.code=="0"){
      alert("资料修改成功!");
      window.location.href = "!gh/wechat/~/pages/yftk/U_center.jsp";
    }
    else{
      alert("资料修改失败!");
    }
  });
}
</script>
<body style="background-color: #fff !important;">
<div class="warpe">
    <div class="head">
        <a href="javascript:void(0);" class="return"><i class="icon-chevron-left"></i>返回</a>
        内心独白
    </div>
    <div class="edit_t">
        <textarea rows="8" placeholder="我的内心独白，字数要求20~1000" id="note" name="note"></textarea>
    </div>
  <div class="id_bth inersest_bth animated bounceIn">
        <a href="javascript:void(0);" onclick="save();">保存</a>
    </div>
</div>
</body>
</html>