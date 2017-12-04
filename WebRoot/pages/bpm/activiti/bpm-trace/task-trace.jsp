<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
<title>运行中任务管理</title>
<head>
<jsp:include page="/pages/framework/base.jsp" />
<script type="text/javascript" src="pages/bpm/activiti/bpm-trace/task-trace.js"></script>
</head>
<body>
	<input type="hidden" id="taskId" name="taskId" value="<%=request.getParameter("taskId")%>">
	<img id="processDiagramImg" src="" />
</body>
</html>
