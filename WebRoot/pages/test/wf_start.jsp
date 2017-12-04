<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
	<title>发起采购流程</title>
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
	            CORE.submitForm("DS_WORKFLOW_STEP1", "testform", {}, function(body,head) {
	                CORE.goToDS('DS_REDIRECT_STARTPROCESS','activityId=usertask1&bussinessKey='+body.result+'&procDef=TestProcess',"testform",'_self');
	            });	
			}
	</script>
	</head>

	<body style="padding: 0; margin: 0"> 
		<div class="modules">
			<div class="barquery">
				<div id="list_title" class="barquerycenter">
					发起采购流程
				</div>            
			</div>
		</div>
		<div align="center" width="100%" height="100%">
			<form name="testform">
				货物名:<input name="name" type="text"/>
				<br>
				单价:<input name="price" type="text"/>
				<br>
				<input type="button" value="提交" onclick="submitForm()">
			</form>
		</div>	
	</body>
</html>