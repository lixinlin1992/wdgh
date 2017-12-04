<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
	<title>信息公告</title>
	<head>
		<jsp:include page="/pages/framework/base.jsp" />
		<script type="text/javascript" src="scripts/sunrise/common.js"></script>
		<script type="text/javascript" src="scripts/datePicker/WdatePicker.js"></script>
		<script type="text/javascript">
		$(function(){
			var announcement_callback = function(msg){
				$("#title1").html(msg.title);
				$("#name").html(msg.name);
				$("#start_date").html(msg.start_date);
				$("#content").html(unescape(msg.content));
			};
			var attachment_callback = function(msg){
				for(var i=0;i<msg.item.length;i++){
	        		$("#attachments").append("<tr><td>"+
						"<a href='framework.do?ds=DS_FRAMEWORK_SERVICE_DOWNLOAD&id="+msg.item[i].id+"'>"+msg.item[i].name+"</a>"+
						"</td></tr>");
				}
			}
			CORE.request("DS_FRAMEWORK_SERVICE_NOTICE_DETAIL_LIST",{data:'ftl=_ftl&noticeId='+$("#noticeId").val()},announcement_callback);
			CORE.request("DS_FRAMEWORK_SERVICE_NOTICE_ATTACHMENT_LIST",{data:'ftl=_ftl&noticeId='+$("#noticeId").val()},attachment_callback);
		});
		</script>
	</head>
	<body style="padding: 0; margin: 0">
		<table>
			<tr>
				<td valign="top" valign="top">附件:</td>
				<td valign="top">
					<table id="attachments"></table>
				</td>
			</tr>
		</table>
		<form name="delTitleFrom">
			<input type="hidden" name="noticeId"
				value="<%=request.getParameter("noticeId")%>"
				id="noticeId" />
		</form>
		<table align="center" width="600">
			<tr>
				<td align="center">
					<span id="title1"></span>
					<hr>
				</td>
			</tr>
			<tr align="right">
				<td align="right">
					(通告发布者：
					<font color="#FF0000"><span id="name"></span> </font> 于
					<font color="#FF0000"><span id="start_date"></span> </font> 发布)
				</td>
			</tr>
			<tr>
				<td>
					<span id="content"></span>
				</td>
			</tr>
		</table>
	</body>
</html>
