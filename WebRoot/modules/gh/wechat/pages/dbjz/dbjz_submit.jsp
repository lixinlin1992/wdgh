<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" import="java.util.*" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.bean.DbjzMember" %>
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
	<title>大病救助</title>
	<link href="!gh/wechat/~/css/main.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/style.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/shake.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
	<script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
	<script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>

<%--<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="com.bean.DbjzMember" %>
<%@taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>

	<r:include resource="!rdcp/~/pages/listBase.jsp"/>


		<meta charset="UTF-8">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
		<meta content="telephone=no" name="format-detection" />
		<title>大病救助</title>
		<link href="!gh/wechat/~/css/main.css" rel="stylesheet" type="text/css">
		<link href="!gh/wechat/~/css/style.css" rel="stylesheet" type="text/css">
		<link href="!gh/wechat/~/css/shake.css" rel="stylesheet" type="text/css">
		<link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
		<link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">
		<link href="!gh/wechat/~/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
		<script type="text/javascript" src="!gh/wechat/~/js/jquery-1.8.3.min.js"></script>
		<script type="text/javascript" src="!gh/wechat/~/js/wo.js"></script>
		<script type="text/javascript" src="!gh/wechat/~/js/idangerous.swiper.min.js"></script>--%>
<%
	DbjzMember member = (DbjzMember)request.getSession().getAttribute("dbjzMember");
%>
	<script type="text/javascript">
        var account = '<%=member.getAccount()%>';
        var con = "";
        rdcp.ready(function () {

            rdcp.request("!gh/wechat/~java/Dbjz.dbjzSubmit", {"number": account}, function (data) {
                if (data.body.total == 0) {
                    con += "<div class='M_no'><p><img src='!gh/wechat/~/img/icon_bq.png'>您还没有提交相关申请</p>";
                    $("#wrape").html(con);
                }else
                {
                    con +="<div class='main'><div class='finance' ><ul>";
                    var dataObj = data.body.rows;
                    $.each(dataObj, function (index, item) {
                        con += "<li class='animated fadeInRight'><p>"+item.title+
                            "</p><p><span class='puff_left'>"+item.status+
                            "</span><span class='puff_right'>"+item.createtime+
                            "</span> </p></a> </li>";
                    });
                    con += "</ul></div></div></div>";
                    $("#wrape").html(con);

                }
            });
        });




	</script>
</head>
<body>
<div class="warpe" >
	<div class="reveal-modal-bg dis_none"></div>
	<div class="head">
		<a href="!gh/wechat/~/pages/dbjz/index.jsp" class="return"><i class="icon-chevron-left"></i> 返回</a>
		申请列表
	</div>
	<span id = "wrape">

	</span>
</div>


</body>
</html>