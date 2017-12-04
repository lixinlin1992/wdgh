<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" import="java.util.*" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%@ page import="com.bean.DbjzMember" %>
<%
    String path = request.getContextPath();
    String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
    String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
    DbjzMember member = (DbjzMember)request.getSession().getAttribute("dbjzMember");
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
	<title>个人信息</title>
	<link href="!gh/wechat/~/css/main.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/style.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/shake.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
</head>
<script type="text/javascript">
$(document).ready(function(){
    $(".return").click(function(){
        history.back(-1);
    });
});
</script>
<body style="background-color: #fff !important;">
<div class="warpe">
    <div class="head">
        <a href="javascript:void(0);" class="return"><i class="icon-chevron-left"></i>返回</a>
        <a href="javascript:void(0);" class="search"><i class="icon-home"></i> &nbsp;</a>
        个人信息
    </div>
    <div class="inter_add">
        <ul>
            <%--<li class="animated bounceInLeft">
                <a href="#">
                    <span class="puff_left">头像</span>
                    <span class="puff_right"><img src="!gh/wechat/~/img/banner.jpg"> </span>
                </a>
            </li>--%>
            <li class="animated bounceInRight">
                <a href="javascript:void(0);">
                    <span class="puff_left">姓名</span>
                    <span class="puff_right"><font><%=member.getName()%></font></span>
                </a>
            </li>
            <li class="animated bounceInLeft">
                <a href="javascript:void(0);">
                    <span class="puff_left">性别</span>
                    <span class="puff_right"><font><%=member.getSex()%></font></span>
                </a>
            </li>
            <li class="animated bounceInRight">
                <a href="javascript:void(0);">
                    <span class="puff_left">人事号</span>
                    <span class="puff_right"><font><%=member.getAccount()%></font></span>
                </a>
            </li>
             <li class="animated bounceInRight">
                <a href="javascript:void(0);">
                    <span class="puff_left">所在单位</span>
                    <span class="puff_right"><font><%=member.getGh()%></font></span>
                </a>
            </li>
            <li class="animated bounceInLeft ">
                <a href="javascript:void(0);">
                    <span class="puff_left">入校工作时间</span>
                    <span class="puff_right"><font><%=member.getRxsj()%></font></span>
                </a>
            </li>
            <li class="animated bounceInLeft ">
                <a href="javascript:void(0);">
                    <span class="puff_left">入会时间</span>
                    <span class="puff_right"><font><%=member.getRhsj()%></font></span>
                </a>
            </li>
            <li class="animated bounceInLeft ">
                <a href="javascript:void(0);">
                    <span class="puff_left">补助情况</span>
                    <span class="puff_right"><font><%=member.getBzqk()==null?"":member.getBzqk()%></font></span>
                </a>
            </li>
        </ul>
    </div>
</div>
</body>
</html>