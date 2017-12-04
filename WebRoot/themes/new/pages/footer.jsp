<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="com.sunrise.framework.core.ApplicationManager" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
  <head>
    <base href="<%=basePath%>"/>
    <link rel="stylesheet" type="text/css" href="themes/default/css/public.css"/>
    <title></title>
   </head>
<body>
		<div id="footer"> <%=ApplicationManager.getSystemName() %>  CopyRight2009&copy;版权所有 广州市森锐电子科技有限公司 </div>
</body>
</html>
