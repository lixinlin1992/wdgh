<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%
    String path = request.getContextPath();
    String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
    String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
    request.setAttribute("_basePath", basePath);
%>
<base href="${_basePath}"/>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<script src="!gh/wechat/~/js/datetime/jquery-1.11.1.min.js"></script>
<script src="!gh/wechat/~/js/datetime/mobiscroll.core.js"></script>
<script src="!gh/wechat/~/js/datetime/mobiscroll.widget.js"></script>
<script src="!gh/wechat/~/js/datetime/mobiscroll.scroller.js"></script>
<script src="!gh/wechat/~/js/datetime/mobiscroll.util.datetime.js"></script>
<script src="!gh/wechat/~/js/datetime/mobiscroll.datetimebase.js"></script>
<script src="!gh/wechat/~/js/datetime/mobiscroll.widget.ios.js"></script>
<script src="!gh/wechat/~/js/datetime/mobiscroll.i18n.zh.js"></script>
<link href="!gh/wechat/~/css/datetime/mobiscroll.animation.css" rel="stylesheet" type="text/css" />
<link href="!gh/wechat/~/css/datetime/mobiscroll.widget.css" rel="stylesheet" type="text/css" />
<link href="!gh/wechat/~/css/datetime/mobiscroll.widget.ios.css" rel="stylesheet" type="text/css" />
<link href="!gh/wechat/~/css/datetime/mobiscroll.scroller.css" rel="stylesheet" type="text/css" />
<link href="!gh/wechat/~/css/datetime/mobiscroll.scroller.ios.css" rel="stylesheet" type="text/css" />
