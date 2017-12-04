<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%
	//role: 0==管理员   1==普通用户
	String role =  request.getParameter("role");
	boolean isAdmin = false;
	if(role != null && role.equals("0") ){
		isAdmin = true;
	}else{
		isAdmin = false;
	}
%>
<jsp:include page="/pages/framework/base.jsp" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>    
<script type="text/javascript" src="scripts/common/ztree.help.js"></script>
<script type="text/javascript" src="pages/bpm/delegate/task-delegate-list.js"></script>
<script type="text/javascript" src="scripts/service/user.help.js"></script>
<script type="text/javascript" src="scripts/service/datePicker.help.js"></script>
<title>Insert title here</title>
<script type="text/javascript">
	$(function(){
		<%
		if(isAdmin){
			out.println("displayFormUser(false);");
		}else{
			out.println("displayFormUser(true);");
		}
		%>
	});
</script>
</head>
<body>
	<jsp:include page="/pages/navbar.jsp" />
	<!-- 添加委托表单 -->
	<form name="addDelegateForm" onsubmit="addDelegate();return false;">
		<div class="barquerycontent" align="center">
			<table class="content_List">
				<tr>
					<td align="right" class="contenttd isAdmin" width="200px">委托人</td>
					<td align="left" class="isAdmin">
						<input type="text" id="add_fromUserName" placeholder="默认为当前用户" name="fromUserName" class="textbox_css" readonly="readonly" />
						<input type="hidden" id="add_fromUserId" name="fromUserId" class="textbox_css" />
					</td>
					<td align="left" class="isAdmin">
						<input type="button" value="选择" onclick="selectDelegateUser({id:'add_fromUserId',name:'add_fromUserName'});" />
					</td>
					<td align="right" class="contenttd" width="200px">被委托人</td>
					<td align="left">
						<input type="text" id="add_toUserName" name="toUserName" class="textbox_css" readonly="readonly"/>
						<input type="hidden" id="add_toUserId" name="toUserId" class="textbox_css" />
					</td>
					<td align="left">
						<input type="button" value="选择" onclick="selectDelegateUser({id:'add_toUserId',name:'add_toUserName'});" />
					</td>
					
					<td align="right" class="contenttd" width="200px">开始时间</td>
					<td align="left">
						<input type="text" id="add_startDate" name="startDate" class="textbox_css" onClick="WdatePicker();" />
					</td>
					
					
					<td align="right" class="contenttd" width="200px">结束时间</td>
					<td align="left">
						<input type="text" id="add_endDate" name="endDate" class="textbox_css" onClick="WdatePicker();" />
					</td>
					
					<td><input style="border: none;" class="btn_add" style="height: 20px" type="submit" value="添加委托" /></td>
				</tr>
			</table>
		</div>
	</form>
	
	<div align="center">
		<table id="delegateList"></table>
		<div id="listPagerdt"></div>
	</div>
	
	
	<!-- 修改委托表单 -->
	<div style="display:none" id="delegateEditorFormDialog">
		<form name="delegateEditorForm" id="delegateEditorForm">
	        <input type="hidden" name="delegateId" class="textbox_css"/>
	        <table align="center">
	            <tr class="formRow isAdmin">
	                <td class="formLabel">委托人：</td>
	                <td class="formField">
	                    <input type="text" id="editor_fromUserName" placeholder="默认为当前用户" name="fromUserName" class="textbox_css" readonly="readonly" />
						<input type="hidden" id="editor_fromUserId" name="fromUserId" class="textbox_css" />
						<input type="button" value="选择" onclick="selectDelegateUser({id:'editor_fromUserId',name:'editor_fromUserName'});" />
	                </td>
	            </tr>
	            <tr class="formRow">
	                <td class="formLabel">被委托人:</td>
	                <td class="formField">
	                    <input type="text" id="editor_toUserName" name="toUserName" class="textbox_css" readonly="readonly"/>
						<input type="hidden" id="editor_toUserId" name="toUserId" class="textbox_css" />
						<input type="button" value="选择" onclick="selectDelegateUser({id:'editor_toUserId',name:'editor_toUserName'});" />
	                </td>
	            </tr>
	            <tr class="formRow">
	                <td class="formLabel">开始时间：</td>
	                <td class="formField">
	                    <input type="text" id="editor_startDate" name="startDate" class="textbox_css" onClick="WdatePicker();" />
	                </td>
	            </tr>
	            <tr class="formRow">
	                <td class="formLabel">结束时间：</td>
	                <td class="formField">
	                   	<input type="text" id="editor_endDate" name="endDate" class="textbox_css" onClick="WdatePicker();" />
	                </td>
	            </tr>
	        </table>
	    </form>
    </div>
    
</body>
</html>