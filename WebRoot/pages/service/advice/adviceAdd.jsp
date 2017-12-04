<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
	<title>投诉与建议</title>
	<head>
		<jsp:include page="/pages/framework/base.jsp" />
		<link href="themes/default/css/public.css" rel="stylesheet"
			type="text/css" />
		<link href="themes/default/css/publicform.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript" src="scripts/sunrise/common.js"></script>
		<script type="text/javascript" src="scripts/datePicker/WdatePicker.js"></script>
		<script type="text/javascript">
			$(function(){
				CORE.loadSelect('type_id','DS_SYS_CODE_LABEL_VALUE',{data:'code_table=SYS_A_ADVICE&code_field=TYPE_ID'});
				});
				function addAdvice(){
					CORE.submitForm("DS_FRAMEWORK_SERVICE_ADVICE_ADD","adviceForm",{},function(){CORE.info("添加成功！");});
					document.adviceForm.reset();
				}
		</script>
	</head>
	<body style="padding: 0; margin: 0">
		<jsp:include page="/pages/navbar.jsp" />
		<div class="modules">
			<div class="barquery">
				<div class="barquerycenter">
					投诉与建议
				</div>
			</div>
			<div  align="center">
				<form name="adviceForm">
					<table align="center">
						<tr class="formRow">
							<td align="right" class="formLabel">
								投诉与建议主题：
							</td>
							<td class="formField" align="left">
								<input type="text" name="title" id="title" style="width: 200px">
							</td>
						</tr>
						<tr class="formRow">
							<td align="right" class="formLabel">
								投诉与建议类型：
							</td>
							<td class="formField" align="left">
								<select name="type_id" id="type_id" style="width: 90px;">
									<option value="">
										--请选择--
									</option>
								</select>
							</td>
						</tr>
						<tr class="formRow">
							<td class="formLabel" align="right">
								投诉与建议内容：
							</td>
							<td class="formField" align="left">
								<textarea cols="30" rows="5" name="content" id="content"></textarea>
							</td>
						</tr>
						<tr>
							<td colspan=2 align=center>
								<input name='btnfunction' class='btnfunctionout' value='提交'
									type='button' onclick="addAdvice();" />
							</td>
						</tr>
					</table>
				</form>
				</div>
	</body>
</html>
