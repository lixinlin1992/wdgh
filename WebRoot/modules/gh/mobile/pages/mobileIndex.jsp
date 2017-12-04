<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html>
<head>
    <link rel="shortcut icon" type="image/x-icon" href="pages/images/favicon.ico" media="screen" />
    <meta name ="renderer" content="webkit">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=2.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
    <title>武汉大学工会</title>
    <base href="<%=basePath%>">
    <link href="!gh/mobile/css/bootstrap.min.css" tppabs="!gh/mobile/css/bootstrap.min.css" rel="stylesheet">
    <link href="!gh/mobile/css/main.css" tppabs="!gh/mobile/css/main.css" rel="stylesheet">
    <link href="!gh/mobile/css/css.css" tppabs="!gh/mobile/css/css.css" rel="stylesheet">
    <script type="text/javascript" src="!gh/mobile/scripts/jquery.min.js"></script>
    <script src="!gh/mobile/scripts/bootstrap.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
</head>
<body style="margin:0;padding:1">
   <r:include resource="!gh/mobile/~/pages/header.jsp"/>
   <r:include resource="!gh/mobile/~/pages/index.jsp"/>
   <r:include resource="!gh/mobile/~/pages/footer.jsp"/>
</body>
</html>