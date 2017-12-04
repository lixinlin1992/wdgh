<%--
  Created by IntelliJ IDEA.
  User: sunjiaxin
  Date: 2017/6/25
  Time: 10:57
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" import="com.sunrise.framework.core.LoginUserSession" pageEncoding="UTF-8" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%
    String path = request.getContextPath();
    String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
    String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
    String curUserName = LoginUserSession.getLoginUserInfo() == null ? "null" : LoginUserSession.getLoginUserInfo().getName();
    request.setAttribute("_basePath", basePath);
    request.setAttribute("_curUserId", curUserName);
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <base href="${_basePath}"/>
    <r:include resource="!rdcp/pages/listBase.jsp"/>
    <script type="text/javascript" src="!gh/wechat/~/scripts/legalQuestionAdd.js"></script>
    <title>编写提问</title>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
    <link href="!gh/wechat/css/main.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/style.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/shake.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/animate.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="!gh/wechat/js/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="!gh/wechat/js/wo.js"></script>
    <script type="text/javascript" src="!comm/~/scripts/getParamsFromPaCode.js"></script>
    <script type="text/javascript" src="scripts/editor/kindeditor.js"></script>
    <link href="!service/file/~/css/editfile.css" rel="stylesheet" type="text/css"/>
    <%
        String account ="";
        boolean isLogin  = false;
        SysPUser user = (SysPUser) session.getAttribute(LoginUserSession.UserSession_Key);
        if(user != null)
        {
            account = request.getParameter("account")==null?user.getAccount():request.getParameter("account");
            isLogin = true ;
        }
    %>
</head>
<body style="background-color: #fff !important;">
<div class="warpe">
    <div class="head">
        <a href="!gh/wechat/~/pages/legalAid.jsp" class="return"><i class="icon-chevron-left"></i>返回</a>
        提问<a href="javascript:void(0);" onclick="submitQuestion(<%=isLogin%>)" class="search animated fadeInRight" style="font-size: 1.4rem;">提交</a>
    </div>
    <div class="edit_t">
        <input id="title" type="text" placeholder="请填写标题">
        <textarea id="content" rows="12" placeholder="问题详细描述"></textarea>
    </div>
</div>

</body>
</html>
