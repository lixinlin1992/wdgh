<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
	<title>个人信息管理</title>
	<head>
		<jsp:include page="/pages/framework/base.jsp" />
		<script type="text/javascript" src="scripts/sunrise/common.js"></script>
		<script type="text/javascript">
		$(function(){
		 CORE.loadForm("DS_USER_INFO","UserInfoManageForm",{ruleId : "SYS_P_USERINFOMANAGE",data:"&ftl=_ftl"});
		});
		function manageUserInfo()
		{
			//alert($("#name").val());
			CORE.submitForm("DS_USER_INFO_EDIT","UserInfoManageForm",{data:'ftl=_ftl'},function(){CORE.info("成功提交！");});
			//CORE.info("成功提交！");
		}
		</script>
	</head>
	<body style="padding: 0; margin: 0">
		<jsp:include page="/pages/navbar.jsp" />
		<div class="modules">
			<div class="barquery">
				<div class="barqueryleft">
				</div>
				<div class="barquerycenter">
					个人信息管理
				</div>
				<div class="barqueryright"></div>
			</div>
			<div class="barquerycontent" style="padding: 10px;" align="center">
				<form name="UserInfoManageForm">
					<table align="center">
						<tr>
							<td align="right">
								用户名称：
							</td>
							<td>
								<input type="text" name="name" id="name" style="width: 200px">
							</td>
						</tr>
						<tr>
							<td align="right">
								手机号码：
							</td>
							<td>
								<input type="text" name="mobile_phone" id="mobile_phone"
									style="width: 200px">
							</td>
						</tr>
						<tr>
							<td align="right">
								电子邮箱：
							</td>
							<td>
								<input type="text" name="email" id="email" style="width: 200px">
							</td>
						</tr>
						<tr>
							<td align="right">
								用户工号：
							</td>
							<td>
								<input type="text" name="account" id="account"
									style="width: 200px" disabled='disabled'>
							</td>
						</tr>
						<tr>
							<td align="right">
								用户组：
							</td>
							<td>
								<input type="text" name="groupName" id="groupName"
									style="width: 200px" disabled='disabled'>
							</td>
						</tr>
						<tr>
							<td colspan=2 align=center>
								<input name='btnfunction' class='btnfunctionout' value='提交'
									type='button' onclick="manageUserInfo();" />
							</td>
						</tr>
					</table>
				</form>
			</div>
	</body>
</html>
