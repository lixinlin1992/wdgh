<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2018/12/24
  Time: 19:12
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="com.sunrise.framework.core.ApplicationManager" %>
<%@page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
    <meta content="telephone=no" name="format-detection" />
    <title>支付成功</title>
    <link href="!gh/wechat/~/css/main.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/~/css/style.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/~/css/shake.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/~/css/idangerous.swiper.css rel="stylesheet" type="text/css">
    <script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
    <script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
    <script type="text/javascript" src="!gh/wechat/~/js/wo.js"></script>
    <style type="text/css">
        .aStyle{
            margin-top: 10px;
            text-align: center;
            font-weight: 900;
        }

        }
    </style>
</head>
<body>
<div class="main">
    <div class="postall margin_top clear_border">
        <div class="post_img post_img02 animated bounceIn">
            <img class="g-dyxx-detailimg" src="!gh/wechat/img/xax.png">
        </div>
        <div class="post_m">
            <p class="color-red" align="center">支付成功</p>
            <p class="color-red" align="center">感谢您的爱心</p>
        </div>
        <div>
            <a class="aStyle" href="!/gh/wechat/~/pages/xax-detail.jsp" onclick="js_method()">>>>返回首页<<<</a>
        </div>
    </div>
</div>
</body>
</html>
