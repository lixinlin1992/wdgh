<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%
    String path = request.getContextPath();
    String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
    String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
    basePath = basePath.substring(0,7)+basePath.substring(7).replace("//","/");
    String curUserName = LoginUserSession.getLoginUserInfo() == null ? "null" : LoginUserSession.getLoginUserInfo().getName();
    request.setAttribute("_basePath", basePath);
    request.setAttribute("_curUserId", curUserName);
%>
<base href="${_basePath}"/>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>

<link href="themes/default/css/sunrise.css" rel="stylesheet" type="text/css"/>
<link href="themes/default/css/common.css" rel="stylesheet" type="text/css"/>
<link href="themes/default/css/commonbtn.css" rel="stylesheet" type="text/css"/>
<%--
    tablecontent.css跟easyui样式有冲突暂停使用
    <link href="themes/new_metro_default/css/tablecontent.css" rel="stylesheet" type="text/css"/>
--%>
<script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
<script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
<input type="hidden" id="curUserId" value="${_curUserId}"/>
<script type="text/javascript">
var _serverBasePath = "<%=basePath%>";
</script>