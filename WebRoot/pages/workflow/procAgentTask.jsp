<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
	<title><s:property value="activity.name"/></title>
	<head>
		<jsp:include page="/pages/framework/base.jsp" />
    	<link type="text/css" rel="stylesheet" href="themes/default/css/rdcp.css"></link>
		<script type="text/javascript" src="scripts/sunrise/common.js"></script>
		<script type="text/javascript">
			/**
			 * 获取业务表单
			 *
			 */
			 function getBussinessFormData(params){
			  	//根据流程定义的表单ID获取表单			 	 
				var bussinessForm = eval("document.getElementById('bussinessFrame').contentWindow.document."+document.activityForm.form.value);
				var bussinessParams = "";
				//组装业务系统参数
		        for (var i = 0; i < bussinessForm.elements.length; i++) {
		            var ele = bussinessForm.elements[i];
		            var tagName = ele.nodeName.toLowerCase();
		            var type = ele.type.toLowerCase();
		            if (tagName == "input") {
		                if (type == "checkbox" || type == "radio") {
		                	if(ele.checked)
		                		bussinessParams += ele.name+"="+ele.value+"&";
		                } else if (type == "text" || type == "hidden") {
		                    bussinessParams += ele.name+"="+ele.value+"&";
		                }
		            } else if (tagName == "select") {
		                bussinessParams += ele.name+"="+ele.value+"&";
		            } else if (tagName == "textarea") {
		                bussinessParams += ele.name+"="+ele.value+"&";
		            }
		        }	
		        if(params!=undefined && params != "")
			        bussinessParams += "&" + params;
		        //组装请求参数
				var requestParams = {	
					taskId:document.activityForm.taskId.value,
					bussinessDS:document.activityForm.ds.value,
					submitType:document.activityForm.submittype.value,
					data:bussinessParams
				};		        
			    //返回结果
			    return requestParams;
			 }
			/**
			 * 提交任务
			 * 
			 */
			 function getNextActivity(params){
				var map = getBussinessFormData(params);
				var requestData = "taskId=" + map.taskId + "&" + 
							      "bussinessDS=" + map.bussinessDS + "&" +
							      map.data;
				//判断是否审批任务,是则发送信息
				if(document.activityForm.type.value == "1")
					requestData += "&sunrise_approval="+document.approval_form.approval.value;					
				//发送请求获取环节以及候选人
				CORE.request("DS_PROCESS_NEXT_ASSIGNEE",{data:requestData},function(data){
					//任务选择页面交由procActivitySelect.jsp负责
					//若业务数据提交类型是 业务页面负责则完成时执行业务JS函数（业务页面必须回调完成任务函数）
					if(!document.activityForm.submittype.value == "html"){
						var functionName = document.activityForm.submittype.value;
						var functionStr = "document.getElementById('bussinessFrame')."+
										  "contentWindow.document."+
										   functionName+"()";
						map.bussinessFunction = functionStr;
						_generateActivitySelectGrid(data,
													function(para,map){
														eval(map.bussinessFunction);
													},
													map);					
					}else
					//若业务数据提交类型是 模拟提交业务并完成任务
						_generateActivitySelectGrid(data,
													function(para,map){_completeUserTask(para,map);},
													map);
				});
			 	
			 }
			 /**
			  * 业务系统提交业务数据后回调方法
			  */
			 function completeUserTaskByBussiness(){
				var map = getBussinessFormData("");
				var requestData = _activitySelectValue + "&taskId="+map.taskId + "&bussinessDS=" + map.bussinessDS + 
								  "&submittype=" + map.submitType;
				if(map.data != undefined)
					requestData += "&"+map.data;		
				//判断是否审批任务,是则发送信息
				if(document.activityForm.type.value == "1"){
					requestData += "&sunrise_approval="+document.approval_form.approval.value;
					requestData += "&sunrise_approval_content="+document.approval_form.approval_content.value;
				}					
				CORE.request("DS_PROCESS_COMPLETE_TASK",{data:requestData},function(body,head){
					$("#_ActivityAssigneePanel").dialog("close");
					CORE.info(data.body);
				});	
			 }
			 /**
			  * 保存任务
			  *
			  */
			 function saveActivity(params){
				var requestParams = getBussinessFormData(params);
				var requestData = "taskId=" + requestParams.taskId + "&" + requestParams.data;
				//发送请求获取环节以及候选人
				CORE.request("DS_PROCESS_SAVE_TASK",{data:requestData},function(data){
					CORE.tip("保存任务数据完成.");
				});			 
			 }  
			 /**
			  * 任务回退
			  *
			  */
			 function rejectActivity(){
				var requestParams = getBussinessFormData("");
				var requestData = "taskId=" + requestParams.taskId + "&" + requestParams.data;
				//发送请求获取环节以及候选人
				CORE.request("DS_PROCESS_REJECT_TASK",{data:requestData},function(data){
					CORE.tip("任务回退完成.");
				});						 	
			 }
			 /**
			  * 查看历史
			  *
			  */
			 function viewHistory(){
			 
			 }
			 /**
			  * 查看流程
			  *
			  */
			 function checkProcess(){
			 
			 }
			//初始化
			$(function(){	
				//若类型为审批则显示审批
				if(document.activityForm.type.value == "1")
					$("#APPROVAL_PANEL").css("display","");
			});			 
		</script>
	</head>

	<body style="padding: 0; margin: 0"> 
		<jsp:include page="/pages/navbar.jsp" />
		<div class="modules">
			<div class="barquery">
				<div id="list_title" class="barquerycenter">
					<s:property value="activity.name"/>
				</div>            
				<div class="barquerybtn">
                	<a style="vertical-align:bottom;text-decoration:uderline;line-height:16px;" href="javascript:void(0);" onclick="viewHistory();">查看历史</a>
                	<a style="vertical-align:bottom;text-decoration:uderline;line-height:16px;" href="javascript:void(0);" onclick="checkProcess();">查看流程</a>
                	<a class="btn_arrow_left" href="javascript:void(0);" onclick="rejectActivity();" title="回退到上一环节">回退</a>
                	<a class="btn_save" href="javascript:void(0);" onclick="saveActivity();" title="保存业务表单">保存</a>
                	<a class="btn_browse" href="javascript:void(0);" onclick="getNextActivity();" title="提交流程">提交</a>
            	</div>
			</div>
		</div>
		<!-- 存放环节参数 -->
		<form name="activityForm">
			<input name="taskId" type="hidden" value="<s:property value="taskId"/>" />
			<input name="ds" type="hidden" value="<s:property value="activity.ds"/>" />
			<input name="form" type="hidden" value="<s:property value="activity.form"/>" />
			<input name="type" type="hidden" value="<s:property value="activity.type"/>" />
			<input name="submittype" type="hidden" value="<s:property value="activity.submittype"/>" />
		</form>
		<!-- 审批界面 -->
		<div align="center" width="95%" style="display:none;" id="APPROVAL_PANEL">
			<form name="approval_form">
				<table width="80%">
					<tr><td align="left">
						审批意见:<select name="approval">
							   		<option value="1">通过</option>
							   		<option value="0">驳回</option>
							   </select>
					</td></tr>
					<tr><td align="left" valign="top" height="100px">
						<textarea style="width:100%;height:100%" name="approval_content"></textarea>
					</td></tr>
				</table>
			</form>
		</div>
		<!-- 业务页面 -->
		<div align="center" width="100%" height="100%">
			<iframe id="bussinessFrame" 
					width="100%" height="98%" frameborder="no" 
					src="<s:property value="activity.page"/>"></iframe>
		</div>
		<!-- 选人界面 -->
		<jsp:include page="/pages/workflow/procActivitySelect.jsp"></jsp:include>
	</body>
</html>
