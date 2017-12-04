<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
<title>流程管理</title>
<head>
<jsp:include page="/pages/framework/base.jsp" />
<jsp:include page="/pages/bpm/activiti/public/baseBpmPage.jsp" />
<script type="text/javascript" src="pages/bpm/activiti/bpm-admin/deployment-list.js"></script>
</head>
<body>
	<jsp:include page="/pages/navbar.jsp" />
	<jsp:include page="../public/process-deploy.jsp" />
	<!-- 查询当前业务FORM -->
	<form name="QueryForm" onsubmit="GRID.reload('processList');return false;">
		<div class="barquerycontent" align="center">
			<table class="content_List">
				<tr>
					<td align="right" class="contenttd" width="200px">流程编号：</td>
					<td align="left"><input type="text" name="deployID" class="textbox_css" />
					<td align="right" class="contenttd" width="200px">流程定义名称：</td>
					<td align="left"><input type="text" name="procDefName" class="textbox_css" />
					<td align="right" class="contenttd" width="200px">流程定义编码：</td>
					<td align="left"><input type="text" name="procDefKey" class="textbox_css" /></td>
					<td><input class="btnquery_mouseout" onMouseOver="this.className='btnquery_mouseover'"
						onMouseOut="this.className='btnquery_mouseout'" type="submit" value="" /></td>
					<td><a class="btn_add" href="javascript:void(0);" onclick="openProcessDeployFormDialog();" title="部署流程">部署</a></td>
				</tr>
			</table>
		</div>
	</form>
	<div align="center">
		<table id="processList"></table>
		<div id="listPagerdt"></div>
	</div>
    <form name="BPM_LAUNCH" action="" method="post">
        <input type="hidden" name="drivenInfo">
        <input type="hidden" name="procDefId">
        <input type="hidden" name="businessKey">
    </form>
</body>
</html>
