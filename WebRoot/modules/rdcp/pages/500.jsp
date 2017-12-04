<%--
File: 500
User: kinz
Date: 13-12-17 下午3:40
Module: rdcp

--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false"
         isErrorPage="true" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>内部错误</title>
    <r:include resource="!rdcp/~/pages/base.jsp"/>
    <link href="themes/default/rdcp/css/error_page.css" rel="stylesheet" type="text/css"/>
</head>
<body>
<div class="sr_insideWrong">
    <div class="wrongList">
        <div class="noticeMessage">
            <h1>很抱歉，你的请求无法处理！</h1>
        </div>
        <div class="noticeMessage">
            <p><%=exception == null ? "系统异常" : exception.getMessage()%>
            </p>

            <h2>请和管理员联系，或者稍后再试</h2>
        </div>
    </div>
</div>
</body>
</html>