<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
<title>测试流程发起</title>
<head>
<jsp:include page="/pages/framework/base.jsp" />
<jsp:include page="/pages/bpm/activiti/public/baseBpmPage.jsp" />
<script type="text/javascript">
	$(function() {
	});

	function saveBusinessForm() {
		$("#businessForm").saveBusinessForm({
			ds : "DS_TEST_SAVE_BUSINESS_FROM",
			onSubmitCallBack : function(data) {
			}
		});
	}
</script>
</head>
<body>
	<!-- 	<fieldset> -->
	<!-- 		<legend>请假流程发起</legend> -->
	<!-- 业务表单的ID一定要为businessForm,并且把bussinessForm.submit()写到bussinessForm.onclick()函数里面 -->
	<!-- 		framework.do?ds=DS_TEST_BUSINESS_FROM_SUBMIT -->

	<form id="businessForm" name="businessForm">
		<div class="barquerycontent" align="center">
			<table class="content_List">
				<tr>
					<td align="right" class="contenttd" width="100px">开始日期：</td>
					<td align="left"><input type="text" id="startDate" name="startDate" class="textbox_css" style="width: 50%" />
				<tr>
					<td align="right" class="contenttd" width="100px">结束日期：</td>
					<td align="left"><input type="text" id="endDate" name="endDate" class="textbox_css" style="width: 50%" />
				</tr>
				<tr>
					<td align="right" class="contenttd" width="100px" rowspan="2">请假原因：</td>
					<td align="left" colspan="3"><textarea id="reason" name="reason" style="width: 95%; height: 150px;"></textarea></td>
				</tr>
			</table>
		</div>
	</form>
	<!-- 	</fieldset> -->
</body>
</html>
