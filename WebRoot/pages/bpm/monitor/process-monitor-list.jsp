<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <jsp:include page="/pages/framework/base.jsp" />
    <jsp:include page="/pages/bpm/activiti/public/baseBpmPage.jsp" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <script type="text/javascript" src="pages/bpm/monitor/process-monitor-list.js"></script>
<title>任务监控</title>
</head>
<body>
	<jsp:include page="/pages/navbar.jsp" />

    <div align="center">
        <table id="processMonitorList"></table>
        <div id="listPagerdt"></div>
    </div>
</body>
</html>