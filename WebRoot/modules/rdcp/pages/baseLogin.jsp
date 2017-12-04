<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%
String path = request.getContextPath();
String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
String curUserName = LoginUserSession.getLoginUserInfo() == null ? "null" : LoginUserSession.getLoginUserInfo().getName();
request.setAttribute("_basePath", basePath);
request.setAttribute("_curUserId", curUserName);
%>
<base href="${_basePath}"/>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>

<link href="themes/default/css/sunrise.css" rel="stylesheet" type="text/css"/>
<link href="themes/default/css/common.css" rel="stylesheet" type="text/css"/>
<link href="themes/default/css/main.css" rel="stylesheet" type="text/css"/>
<link href="themes/default/css/module.css" rel="stylesheet" type="text/css"/>
<link href="themes/default/css/searchtable.css" rel="stylesheet" type="text/css"/>
<link href="themes/default/css/form.css" rel="stylesheet" type="text/css"/>
<link href="themes/default/css/btn.css" rel="stylesheet" type="text/css"/>
<link href="themes/default/css/orangeinputtable.css" rel="stylesheet" type="text/css" />
<%--
    tablecontent.css跟easyui样式有冲突暂停使用
    <link href="themes/new_metro_default/css/tablecontent.css" rel="stylesheet" type="text/css"/>
--%>
<link href="themes/default/css/btn.css" rel="stylesheet" type="text/css"/>
<script type="text/javascript" src="!rdcp/script/src/rdcpPhone.js"></script>
<input type="hidden" id="curUserId" value="${_curUserId}"/>