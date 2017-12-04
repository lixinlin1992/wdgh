<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
<title>任务-运行中</title>
<head>
<jsp:include page="/pages/framework/base.jsp" />
<jsp:include page="/pages/bpm/activiti/public/baseBpmPage.jsp" />
<script type="text/javascript" src="pages/bpm/activiti/bpm-trace/task-running-list.js"></script>
</head>
<body>
	<jsp:include page="/pages/navbar.jsp" />
	<jsp:include page="../public/procInst-delete.jsp" />
	<jsp:include page="/pages/bpm/activiti/public/oper-info.jsp" />
	<!-- 查询当前业务FORM -->
	<form name="QueryForm" onsubmit="GRID.reload('runningList');return false;">
		<div class="barquerycontent" align="center">
			<table class="content_List">
				<tr>
					<td align="right" class="contenttd" width="200px">流程名称：</td>
					<td align="left"><input type="text" name="procDefName" class="textbox_css" /></td>
					<td align="right" class="contenttd" width="200px">流程定义编号：</td>
					<td align="left"><input type="text" name="procDefID" class="textbox_css"
						value="<%=request.getParameter("procDefId") == null ? "" : request.getParameter("procDefId")%>" /></td>
					<td><input class="btnquery_mouseout" onMouseOver="this.className='btnquery_mouseover'"
						onMouseOut="this.className='btnquery_mouseout'" type="submit" value="" /></td>
				</tr>
			</table>
		</div>
	</form>
	<div align="center">
		<table id="runningList"></table>
		<div id="listPagerdt"></div>
	</div>
</body>
</html>
