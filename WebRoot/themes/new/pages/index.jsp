<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sunrise.framework.core.ApplicationManager" %>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title><%=ApplicationManager.getSystemName() %></title>
<base href="<%=basePath%>">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>

<frameset framespacing="0" border="0" frameborder="NO" cols="*" rows="64,*,20" scrolling="auto">
<frame name="header" noresize=""  src="pages/header.jsp" scrolling="no"> </frame>
<frame name="main" noresize=""  src="pages/main.jsp" scrolling="no"> </frame>
<frame name="foot" noresize=""  src="pages/footer.jsp" scrolling="no"> </frame>
</frameset><noframes></noframes>

<body>
<div type="hidden" id="_msg_info_div" name="_msg_info_div"></div>
</body>
</html>
