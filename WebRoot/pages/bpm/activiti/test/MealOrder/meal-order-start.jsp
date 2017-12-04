<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
<title>订餐流程发起</title>
<head>
<jsp:include page="/pages/framework/base.jsp" />
<jsp:include page="/pages/bpm/activiti/public/baseBpmPage.jsp" />
<link href="pages/bpm/activiti/test/MealOrder/css/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="pages/bpm/activiti/test/MealOrder/scripts/meal-order.js"></script>
<script type="text/javascript">
	$(function() {
		getMenuList();
		var mealOrderId = $("#mealOrderId").val();
		if (mealOrderId != "null") {
			loadBusinessForm(mealOrderId);
		}
	});

	function loadBusinessForm(mealOrderId) {
		CORE.request("DS_GET_MEAL_ORDER_BY_ID", {
			data : "mealOrderId=" + mealOrderId,
		}, function(data) {
			$("#applyUserName").html(data.rows[0].cell[0]);
			$("#applyTime").html(data.rows[0].cell[1]);
			$("#applyNote").html(BPM.replaceAllWrap(data.rows[0].cell[2]));
			$("#note").val(data.rows[0].cell[2]);
			$("#OrderDetail").show();
		});
	}

	function saveBusinessForm() {
		$("#businessForm").saveBusinessForm({
			ds : "DS_SAVE_MEAL_ORDER",
			onSubmitCallBack : function(data) {
			}
		});
	}
</script>
</head>
<body>
	<input type="hidden" id="mealOrderId" value="<%=request.getParameter("businessKey")%>" />
	<fieldset id="MenuList">
		<legend>菜单列表</legend>
	</fieldset>
	<fieldset id="OrderDetail" style="display: none;">
		<legend>订单明细</legend>
		<table>
			<tr>
				<td><label>订单发起：</label></td>
				<td><a href="javascript:void(0)"><font id="applyUserName" color="blue"></font></a></td>
			</tr>
			<tr>
				<td><label>发起时间：</label></td>
				<td><a href="javascript:void(0)"><font id="applyTime" color="blue"></font></a></td>
			</tr>
			<tr>
				<td valign="top"><label>订单备注：</label></td>
				<td><font id="applyNote" color="blue"></font></td>
			</tr>
		</table>
	</fieldset>
	<fieldset id="OrderNote">
		<legend>订单备注</legend>
		<form id="businessForm" name="businessForm">
			<textarea id="note" name="note" style="width: 100%; height: 80px;"></textarea>
		</form>
	</fieldset>
</body>
</html>
