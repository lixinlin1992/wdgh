<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
	<title>采购审核</title>
	<head>
		<jsp:include page="/pages/framework/base.jsp" />
		<link href="themes/default/css/style.css" rel="stylesheet"
			type="text/css">
		<link href="themes/default/css/public.css" rel="stylesheet"
			type="text/css" />
		<link href="themes/default/css/publicform.css" rel="stylesheet"
			type="text/css" />
		<script type="text/javascript" src="scripts/sunrise/common.js"></script>
		<script type="text/javascript" src="scripts/datePicker/WdatePicker.js"></script>
		<script type="text/javascript">
			//初始化
			$(function(){
				
			});
			//提交表单
			function submitForm(){
		 		parent.getNextActivity();		
//				CORE.submitForm("DS_WORKFLOW_STEP2","testform",{},function(){
//				});
			}
	</script>
	</head>

	<body style="padding: 0; margin: 0">
		<div align="center" width="100%" height="100%">
			<form name="testform">
				产品名:<input name="name" type="text"/>
				<br>
				单价:<input name="price" type="text"/>
				<br>
				数量:<input name="count" type="text"/>
				<br>
				<input type="button" value="提交" onclick="submitForm()">
			</form>
		</div>	
	</body>
</html>