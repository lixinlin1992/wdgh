<%--
User: Larry
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
    <title>test</title>
    <link href="!gh/wechat/css/main.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/style.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/shake.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/animate.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
    <script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
    <script>
        function noFunc(){
            var orderno = "G"+ordertime() + Math.floor(Math.random()*90000+10000);
            $("#orderno").val(orderno);
        }
        function ordertime() {
            var date=new Date();
            var y = date.getFullYear().toString();
            var m = ("0"+(date.getMonth() + 1).toString()).slice(-2);
            var d = ("0"+date.getDate().toString()).slice(-2);
            var hour = ("0"+ date.getHours().toString()).slice(-2);
            var minutes = ("0"+ date.getMinutes().toString()).slice(-2);
            var seconds = ("0"+ date.getSeconds().toString()).slice(-2);
            return  y  + m + d + hour + minutes + seconds;
        }

    </script>
</head>
<body>
    <form>
        <input type="text" id="orderno" name="orderno" value="" placeholder="订单号">
        <a href="javascript:void(0)" onclick="noFunc()" >立即捐款</a>
    </form>
</body>
</html>
