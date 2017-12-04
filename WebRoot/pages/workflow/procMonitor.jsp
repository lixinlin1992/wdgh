<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
	<title>流程监控</title>
	<head>
		<jsp:include page="/pages/framework/base.jsp" />
		<link href="themes/default/css/style.css" rel="stylesheet"
			type="text/css"/>
		<link href="themes/default/css/public.css" rel="stylesheet"
			type="text/css" />
		<link href="themes/default/css/publicform.css" rel="stylesheet"
			type="text/css" />
		<style type="text/css">
			.activity{
				padding:5px;height:20px;border:1px solid black;
				background:#AAAAAA;
				font-size:9pt;
				color:white;
				font-weight:bolder;
				float: left;
				cursor:hand;
			}
			.curractivity{
				padding:5px;height:20px;border:2px dashed black;
				background:#AAAAAA;
				font-size:9pt;
				color:white;
				font-weight:bolder;
				float: left;
				cursor:hand;
			}
			.hover{
				background: green;
				color: black;
			}
		</style>			
		<script type="text/javascript" src="scripts/sunrise/common.js"></script>
		<script type="text/javascript" src="scripts/common/wz_jsgraphics.js"></script>
		<script type="text/javascript" src="scripts/common/jquery.ui.flow.js"></script>
		<script type="text/javascript">
			//初始化
			$(function(){	
				//检测是否传递流程实例ID或任务实例ID
				if("${param.taskId}"=="" && "${param.procId}" == ""){
					CORE.info("前一页面没有传递流程实例ID参数procId或任务实例ID参数taskId!修正后再作配置");
					return;
				}
				//按前端请求决定请求参数
				var requestData = "";
				var ds = "";
				if(document.monitorForm.taskId.value==""){
					ds = "DS_WORKFLOW_HISTORY_DATA_BYPROCESSID";
					requestData = "processId=" + "${param.procId}";
				}else{
					ds = "DS_WORKFLOW_HISTORY_DATA";
					requestData = "taskId="+"${param.taskId}";
				}				
				//发送请求 
			 	CORE.request(ds,{data:requestData}, function(data) {
			 			//设置流程名称
			 			$("#procName").append(data.proc_name);
			 			//获取首环节
		                var startEvent = data.startEvent;
		                //组装首发环节的下一级关联节点属性
		                var nextParam = "";
		                for(var i = 0;i<startEvent.next.length;i++)
		                {
		                	if(i!=0)
		                		nextParam += ",";
		                	nextParam += startEvent.next[i].id;
		                }
		                //首环节样式设置
		                var classStyle = "activity";
		                if(startEvent.next.length == 0)
		                	classStyle = "curractivity";
		                //添加首环节到首流程图
		                var startEventDiv = "<div class='"+classStyle+"' activity='' group='1' begin='-1' id='"+startEvent.id+"' "+
		                					"next='"+nextParam+"' onclick='showActivityInfo(this.id,\""+ startEvent.assignee +"\")'>"+startEvent.activityName+"</div>";
		                
		                $("#diagram").append(startEventDiv);
		                //添加其他环节到流程图元素
		                for(var j = 0;j<startEvent.next.length;j++)
		                	generateDiv(startEvent.next[j],"1");
		                //渲染流程图
		                $("#diagram").flow({
		                	
		                	hover:function(){ 
		                	 
		                	},remove:function(){
		                	  
		                	},click:function(){ 
		                	
		                	}
		                });
		                //显示最后环节的信息
		                var currRunningActivities = $(".curractivity");
		                var currRunningActivity = currRunningActivities[0];
		                //请求信息
		                showActivityInfo(currRunningActivity.id,startEvent.assignee);
		        });
			});
			//添加子节点
			function generateDiv(data,groupId){
				//流程流转的下一级节点的ID
                var nextParam = "";
                if(data.next.length == 0)
                	nextParam = "-1";
                else
	                for(var i = 0;i<data.next.length;i++)
	                {
	                	if(i!=0)
	                		nextParam += ",";
	                	nextParam += data.next[i].id;
	                }
	            //设置样式
                var classStyle = "activity";
                if(data.next.length == 0)
                	classStyle = "curractivity";    
	            //添加该环节到流程图元素
                var _html = "<div class='"+classStyle+"' activity='' group='"+groupId+"' id='"+data.id+"' next='"+nextParam+"' "+
                			"onclick='showActivityInfo(this.id,\""+ data.assignee +"\")'>"+data.activityName+"</div>";
                $("#diagram").append(_html);	
		        //添加子环节
		        var nextGroupId = groupId;
		        for(var j = 0;j<data.next.length;j++){
	        		if(j!=0)  		
        				nextGroupId = eval(nextGroupId + "+1");
        			nextGroupId = generateDiv(data.next[j],nextGroupId);
		        }
		        return nextGroupId;
			}
			//展示环节信息
			function showActivityInfo(taskId,assigneeStr){
				var assignees = assigneeStr.split(",");
				var requestStr = "taskId="+taskId;
				for(var i = 0;i<assignees.length;i++)
					requestStr += "&assignee="+assignees[i];
                CORE.request("DS_WORKFLOW_ACTIVITY_INFO",{data:requestStr}, 
                	function(data) {
		                $("#activityName").empty();
		                $("#activityName").append(data.name);
		                $("#activityStartTime").empty();
		                $("#activityStartTime").append(data.st);
		                $("#activityEndTime").empty();
		                $("#activityEndTime").append(data.ed);
		                $("#assignee").empty();
		                $("#assignee").append(data.assignee+"&nbsp;&nbsp;");
		                $("#assigneeRole").empty();
		                $("#assigneeRole").append(data.role+"&nbsp;&nbsp;");
		                $("#assigneeDep").empty();
		                $("#assigneeDep").append(data.dept+"&nbsp;&nbsp;");
		                $("#activityInfo").css("display","");
                });
			}
	</script>
	</head>

	<body style="padding: 0; margin: 0">
		<!-- 前端接口传送的参数 -->
		<form name="monitorForm"> 
			<input type="hidden" name="taskId" value="${param.taskId}"/>
			<input type="hidden" name="processId" value="${param.procId}"/>
		</form>
		<!-- 流程图元素 -->
		<div id="diagram" style="display:none;"></div>
		<!-- 页面布局 -->
	    <div class="modules">
	        <div class="barquery">
	            <div class="barqueryleft"></div>
	            <div id="procName" class="barquerycenter"></div>
	            <div class="barqueryright"></div>
	            <div class="barquerybtn">
	            </div>
	        </div>		
		<!-- 实际流程图展示位置 -->
			<div id="draw" style="position:relative; width:95%; height:230px;margin-left:10px;margin-top:80px;">
			</div>
		<!-- 流程环节数据 -->
			<div id="activityInfo" style="display:none;position:relative; width:80%;margin-left:auto;margin-right:auto;" align="center">
				<table width="100%" cellspacing="0" cellpadding="1" border="1">
					<tr>
						<th align="center" width="30%" style="background-color: #a6c5fe;">环节信息</th>
						<th align="center" width="60%" style="background-color: #a6c5fe;">处理信息</th>
					</tr>
					<tr>
						<td align="left" valign="top" height="150px;">
							<table>
								<tr>
									<td>环节名称:</td>
									<td><span id="activityName"></span></td>
								</tr>
								<tr>
									<td>环节开始时间:</td>
									<td><span id="activityStartTime"></span></td>
								</tr>
								<tr>
									<td>环节结束时间:</td>
									<td><span id="activityEndTime"></span></td>
								</tr>
							</table>
						</td>
						<td align="left" valign="top" height="150px;">
							<table>
								<tr>
									<td>处理人:</td>
									<td align="left"><span id="assignee"></span></td>
									<td>角色:</td>
									<td align="left"><span id="assigneeRole"></span></td>
									<td>所属部门:</td>
									<td align="left"><span id="assigneeDep"></span></td>
								</tr>
								<tr>
									<td align="left" colspan="3">是否委托:<span id="isDelege">否</span></td>
									<td align="left" colspan="3">委托人:<span id="deleger">无</span></td>						
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</div>
		</div>
	</body>
</html>