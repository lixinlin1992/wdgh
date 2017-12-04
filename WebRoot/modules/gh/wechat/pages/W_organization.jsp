<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2017/6/23
  Time: 12:40
  To change this template use File | Settings | File Templates.
--%>

<%@ page import="java.util.List" %>
<!--
Created by IntelliJ IDEA.
User: sunjiaxin
Date: 2017/6/21
Time: 7:52
To change this template use File | Settings | File Templates.
-->
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
    <title>社团组织</title>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
    <script type="text/javascript" src="!gh/manu/~/scripts/manuManage.js"></script>
    <link href="!comm/css/addTable.css" rel="stylesheet" type="text/css">
    <link href="!service/file~/css/editfile.css" rel="stylesheet" type="text/css"/>
    <link href="!gh/wechat/css/main.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/style.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/shake.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/animate.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="!gh/wechat/js/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="!gh/wechat/js/wo.js"></script>
    <script type="text/javascript" src="!gh/wechat/~/scripts/W_organization.js"></script>
</head>
<r:include resource="!comm/~/pages/commOrg.jsp"/>
<body style="background-color: #fff !important;">
<div class="warpe">
    <div class="head">
        <a href="!gh/wechat/~/pages/W_organizationDevelop.jsp" class="return"><i class="icon-chevron-left"></i>返回 </a>
        社团组织
    </div>
   <%-- <div class="tabs my_tab4">
        <a href="!gh/wechat/~/pages/W_activity.jsp" hidefocus="true" >文体活动</a>
        <a href="!gh/wechat/~/pages/W_organization.jsp" hidefocus="true" class="active">社团建设</a>
        <a href="!gh/wechat/~/pages/W_movie.jsp" hidefocus="true">电影消息</a>
        <a href="!gh/wechat/~/pages/W_suzhituozhan.jsp" hidefocus="true" >素质拓展</a>
    </div>--%>

    <div class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide">
                <div class="content-slide">
                    <div id="main_list" class="main">
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>
<script type="text/javascript" src="!gh/wechat/~/js/idangerous.swiper.min.js"></script>

</body>
</html>