<%--
File: 404.jsp
User: kinz
Date: 13-12-17 下午3:34
Module:  rdcp

--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false"
         isErrorPage="true" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%response.setStatus(HttpServletResponse.SC_NOT_FOUND);%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>页面没找到</title>
    <r:include resource="!rdcp/~/pages/base.jsp"/>
    <link href="themes/default/rdcp/css/error_page.css" rel="stylesheet" type="text/css"/>
</head>
<body>
<div class="sr_fofWrong">
    <div class="wrongList">
        <div class="noticeMessage">
            <h1>很抱歉，无法找到你要访问的资源！</h1>
        </div>
        <div class="noticeMessage">
            <p><%=exception == null ? "资源不存在" : exception.getMessage()%>
            </p>

            <h2>请向系统管理员提交出现此操作的详细步骤</h2>
        </div>
    </div>
</div>
</body>
</html>