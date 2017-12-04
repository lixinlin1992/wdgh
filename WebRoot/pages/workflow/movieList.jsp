<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
    SysPUser user = (SysPUser) session.getAttribute(LoginUserSession.UserSession_Key);
    int isLogin = 0;
    if(user != null){
        isLogin = 1;
    }
%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=GB2312">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>武汉大学工会</title>
    <link rel="shortcut icon" href="!property/index/~/images/logo_16.ico" type="image/x-icon" />
    <base href="<%=basePath%>">
    <script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
    <script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
</head>
<body style="margin:0;padding:1">
   <r:include resource="!gh/index/~/pages/header.jsp"/>
   <r:include resource="!gh/index/~/pages/movieList.jsp"/>
   <r:include resource="!gh/index/~/pages/footer.jsp"/>
</body>
<script type="text/javascript">
</script>
</html>