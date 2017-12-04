<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
<title>流程处理页面</title>
<head>
<jsp:include page="/pages/framework/base.jsp" />
<jsp:include page="/pages/bpm/activiti/public/baseBpmPage.jsp" />
<script type="text/javascript" src="pages/bpm/activiti/bpm-admin/task-handle.js"></script>
</head>
<body>
	<div class="processRootDiv">
		<jsp:include page="/pages/bpm/activiti/public/oper-info.jsp" />
		<div class="baseDataDiv">
			<ul>
				<li><input id="taskId" type="hidden" value="<%=request.getParameter("taskId")%>" /></li>
			</ul>

		</div>
		<div class="processOperDiv">
				<a href="javascript:void(0)" name="viewProcessPictureBtns" title="查看流程图" class="btn_view">查看流程图</a>
				<a href="javascript:void(0)" name="saveBusinessBtns" title="保存表单数据并驱动流程" class="btn_save">保存</a>
				<a href="javascript:void(0)" name="subimtProcessBtns" title="保存表单数据并驱动流程" class="btn_commit">提交</a>
				<a href="javascript:void(0)" name="windowCloseBtns" title="不保存数据并关闭本窗口" class="btn_delete">取消</a>
		</div>
        <%--<div class="processOperDivHolder">--%>
        <%--</div>--%>
		<div class="processFormDiv">
			<iframe id="businessPageFrame" name="businessPageFrame" width="100%" height="380px" frameborder="0" src=""></iframe>
		</div>
	</div>
</body>
</html>
