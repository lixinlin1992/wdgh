<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.service.security.FunctionHelper" %>
<%@ page import="com.sunrise.foundation.utils.StringUtil" %>
<%@ page import="java.util.List" %>
<%@ page import="com.sunrise.service.security.entity.SysPFunction" %>
<%--
File: functionCheck.jsp
User: kinz
Date: 11-11-22 上午10:01


--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>授权检查页面</title>
    <base href="<%="http://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+"/"%>">
</head>
<%
    SysPUser user = LoginUserSession.getLoginUserInfo();
    Long userId = StringUtil.getLong(request.getParameter("user_id"));
    if(userId == null)
        userId = user.getId();

    String code = request.getParameter("code");

    //FunctionHelper.loadUserFunctions(userId,false,true);
    FunctionHelper.loadAllFunctions();
    List<SysPFunction> funcs = FunctionHelper.getFunctions(code);

    out.println("Func Count: "+funcs.size()+"<br>");
    for(SysPFunction f:funcs){
        out.println(f.getName()+"     -     "+f.getCode()+"<br>");
    }
%>
<body>

</body>
</html>