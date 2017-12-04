<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
 <%
    String proInstId = request.getParameter("proInstId");
 %>
<html>
<head>
    <jsp:include page="/pages/framework/base.jsp" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <script type="text/javascript" src="pages/bpm/monitor/process-detail-monitor-list.js"></script>
    <title>流程任务监控</title>
</head>
<body>
	<jsp:include page="/pages/navbar.jsp" />
    <script type="text/javascript">
        function goBack(){
            window.location.href="pages/bpm/monitor/process-monitor-list.jsp";
        }
    </script>
    <a class="btn_undo" href="javascript:void(0);" onclick="goBack()">返回</a>
     <div >
        <form name="processDetailMonitorForm">
            <input type="hidden" name="proInstId" value="<%=proInstId%>">
        </form>
     </div>
    <div align="center">
        <table id="processDetailMonitorList"></table>
        <div id="listPagerdt"></div>
    </div>
</body>
</html>