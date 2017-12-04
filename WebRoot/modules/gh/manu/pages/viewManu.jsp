<%@ page language="java" import="com.sunrise.framework.core.LoginUserSession" pageEncoding="UTF-8" %>
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
    <script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
    <script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
    <link href="!service/file/~/css/editfile.css" rel="stylesheet" type="text/css">
    <title>预览稿件</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link href="themes/default/css/index.css" rel="stylesheet" type="text/css">
    <link href="!gh/index/~/css/reset.css" rel="stylesheet" />
    <link href="!gh/index/~/css/list.css" rel="stylesheet" />
    <%
        String manu_id = request.getParameter("manu_id");
    %>
</head>
<body>
<div class="content f-l" style="width:100%;">
    <div class="g-article-con" style="width:80%; margin:0 auto;" id="content">
    </div>
</div>
<i class="clear"></i>
<!--列表页内容区 End-->
<div class="clearfix"></div>
</body>
<script type="text/javascript">
    //获取history_id
    var manu_id = "<%=manu_id%>";
    //获取服务器根路径
    var serverBasePath = "<%=basePath%>";
    rdcp.ready(function () {
        rdcp.request('!gh/manu/~query/Q_GET_MANU_INFO', 'manu_id=' + manu_id, function (data) {
            var obj = data.body;
            var html = "";
            html +="<h1>"+obj.company+"</h1>";
            html += "<p class='g-article-data'>作者一:"+obj.author_one+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;作者二:"
                +obj.author_two+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;作者三:"+obj.author_three+"</p>";
            html += "<div class='g-article-content'>"+obj.content+"</div>";
            $("#content").html(html);
        });
    });
</script>
</html>
