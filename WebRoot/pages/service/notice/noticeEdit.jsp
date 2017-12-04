<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
	<title>信息公告</title>
	<head>
		<jsp:include page="/pages/framework/base.jsp" />
		<link href="themes/default/css/public.css" rel="stylesheet"
			type="text/css" />
		<script type="text/javascript" src="scripts/sunrise/common.js"></script>
		<script type="text/javascript" src="scripts/datePicker/WdatePicker.js"></script>
		<script src="scripts/editor/kindeditor.js"></script>
		<script type="text/javascript">
			KE.show({
				id : 'content',
				shadowMode : false,
				autoSetDataMode: false,
				allowPreviewEmoticons : false,
				afterCreate : function(id) {
					KE.event.add(KE.$('FormID'),'submit', function() {
					});
				}
			});
			function updateNotice(){
				KE.util.setData("content");
	            COMMON.upload({
	                url:'framework.do?ds=DS_FRAMEWORK_SERVICE_NOTICE_MAN_UPDATE',
	                formName:'addNoticeForm'
	            },function(){
					parent.reflesh();
					clearEditor('content');				
					CORE.info("更改成功！");
					document.addNoticeForm.reset();				
				});				
			}
		$(function(){
				var announcement_callback = function(msg){
				$("#title").val(msg.title);
				$("#type_id").val(msg.type_id);
				$("#urgence_id").val(msg.urgence_id);
				$("#end_date").val(msg.end_date);
				$("#content").val(msg.content);
				KE.html('content',$("#content").val());
				};
				var attachment_callback = function(msg){
					for(var i=0;i<msg.item.length;i++){
	        			$("#attachments").append("<tr id='c"+msg.item[i].id+"'><td>"+
							"<a href='framework.do?ds=DS_FRAMEWORK_SERVICE_DOWNLOAD&id="+msg.item[i].id+"'>"+msg.item[i].name+"</a>&nbsp;&nbsp;"+
							"<a href='javascript:void(0);' onclick='delAttachment("+msg.item[i].id+");'>删除</a>"+
							"</td></tr>");
					}
				}			
				CORE.loadSelect('type_id','DS_SYS_CODE_LABEL_VALUE',{data:'code_table=SYS_N_NOTICE&code_field=TYPE_ID',
					loadComplete:function(){
						CORE.loadSelect('urgence_id','DS_SYS_CODE_LABEL_VALUE',{data:'code_table=SYS_N_NOTICE&code_field=URGENCE_ID',	
							loadComplete:function(){
								CORE.request("DS_FRAMEWORK_SERVICE_NOTICE_MAN_EDIT",{data:"noticeId="+$("#noticeId").val()+"&ftl=_ftl"},announcement_callback);			
								CORE.request("DS_FRAMEWORK_SERVICE_NOTICE_ATTACHMENT_LIST",{data:'ftl=_ftl&noticeId='+$("#noticeId").val()},attachment_callback);								
							}});
					}
				});					
		});
		//清空html编辑器内的内容
		function clearEditor(id) {
		    KE.g[id].iframeDoc.open();
		    KE.g[id].iframeDoc.write(KE.util.getFullHtml(id));
		    KE.g[id].iframeDoc.close();
		    KE.g[id].newTextarea.value = '';
		}
	        var tr_id = "0";
        	function addUploadItem(){
    			tr_id++;
        		$("#uploadItemTable").append("<tr id='t"+tr_id+"'><td><input name='file' type='file'>备注:"+
        		"<input type='text' name='note'>"+
        		"<input type='button' value='删除' onclick='delUploadItem(\"t"+tr_id+"\")'>"+
        		"</td></tr>");
        	}
        	function delAttachment(_id){
        		$("#c"+_id).remove();
        		$("#attachments").append("<input name='dropId' type='hidden' value='"+_id+"'>");
        	}
        	function delUploadItem(_id){
				$("#"+_id).remove(); 
        	}  					
		
		</script>
	</head>
	<body style="padding: 0; margin: 0">
				<form id="FormID" name="addNoticeForm" enctype="multipart/form-data"
					onSubmit="updateNotice();return false;">
			<input type="hidden" name="noticeId"
				value="<%=request.getParameter("noticeId")%>"
				id="noticeId" />
				<input name="type" type="hidden" value="0">
				<table>
					<tr>
						<td align="right" valign="top">附件：</td>
						<td align="left"><table id="attachments"></table></td>
					</tr>
					<tr>
						<td align="right">上传文件：</td>
						<td>
						    <input name="file" type="file">备注:
						    <input type="text" name="note">
						    <input type="button" onclick="addUploadItem()" value="增加">
						</td>
					</tr>
					<tr>
						<td></td>
						<td><table id="uploadItemTable"></table></td>					
					</tr>
				</table>					
					<table id="addNotice" align="center">
						<tr>
							<td align="left" style="width:60px">
								主题：
							</td>
							<td>
							<input type="text" name="title" id="title"
								style="width: 630px">
							</td>
						</tr>
						<tr>
							<td align="left">
								公告类型：
							</td>
							<td align="left">
								<select name="type_id" id="type_id" style="width: 90px;">

								</select>
								紧急程度：
								<select name="urgence_id" id="urgence_id"
									style="width: 90px;">
								</select>
								有效时间：
								<input type="text" name="end_date" id="end_date"
									onClick="WdatePicker()" class="Wdate">
							</td>
						</tr>
						<tr>
							<td align="left">
								内容：
							</td>
							<td>
								<textarea name="content" id="content"
								style="width: 630px; height: 200px; visibility: hidden;"></textarea>
							</td>
						</tr>
					</table>
				</form>
	</body>
</html>
