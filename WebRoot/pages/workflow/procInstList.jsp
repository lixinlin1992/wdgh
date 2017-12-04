<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
	<title>流程实例管理</title>
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
			//列表参数
			var instListParam = {
			    colModel:[
			    	{
			            name:"流程定义名称",
			            index:"procType",
			            width:"12%",
			            align:"center"
			        },
			        {
			            name:"流程定义版本",
			            index:"procTypeVer",
			            width:"10%",
			            align:"center"
			        },
			        {
			            name:"发起人",
			            index:"START_USER",
			            width:"10%",
			            align:"center"
			        },
			        {
			            name:"STATUS_CODE",
			            index:"STATUS_CODE",
			            width:"8%",
			            align:"center",
			            hidden:true
			        },
			        {
			            name:"状态",
			            index:"STATUS",
			            width:"8%",
			            align:"center",
			            formatter:function(cell, options, row, tr, td) {
			                if(cell == 0)
			                	return "运行中";
			                else if(cell == 1)
			                	return "正常结束";
			                else if(cell == 2)
			                	return "异常结束";
			                else if(cell == 3)
			                	return "暂停";
			            }
			        },
			        {
			            name:"流程实例ID",
			            index:"PROCID",
			            width:"10%",
			            align:"center",
			            hidden:true
			        },
			        {
			            name:"关联业务表ID",
			            index:"bussinessKey",
			            width:"10%",
			            align:"center"
			        },
			        {
			            name:"开始时间",
			            index:"st",
			            width:"15%",
			            align:"center"
			        },
			        {
			            name:"结束时间",
			            index:"et",
			            width:"15%",
			            align:"center"
			        },
			        {
			            name:"操作",
			            index:"operate",
			            width:"10%",
			            sortable:false,
			            formatter:function(cell, options, row, tr, td) {
			            	if(row["STATUS_CODE"]=="2" || row["STATUS_CODE"]=="1")
				                return GRID.button({className:"btn_edit",onclick:"_monitorByProcId('"+row["PROCID"]+"');",title:"查看"});
			            	else
				                return GRID.button({className:"btn_edit",onclick:"_monitorByProcId('"+row["PROCID"]+"');",title:"查看"})+
				                       GRID.button({className:"btn_edit",onclick:"_stopProcess('"+row["PROCID"]+"');",title:"暂停流程"})+
				                       GRID.button({className:"btn_edit",onclick:"_continueProcess('"+row["PROCID"]+"');",title:"继续流程"})+
				                       GRID.button({className:"btn_edit",onclick:"_cancelProcess('"+row["PROCID"]+"');",title:"取消流程"})+
				                       GRID.button({className:"btn_edit",onclick:"_interruptProcess('"+row["PROCID"]+"');",title:"中断流程"});
			            }
			        }
			    ],
			    caption : "流程实例列表",
			    multiselect:true,
			    width:"98%",
			    pager: "#listPagerdt",
			};
			
			//列表参数
			var taskListParam = {
			    colModel:[
			    	{
			            name:"环节",
			            index:"ACTNAME",
			            width:"55%",
			            align:"center"
			        },
			        {
			            name:"执行者",
			            index:"ASSIGNEE",
			            width:"25%",
			            align:"center"
			        },
			        {
			            name:"任务ID",
			            index:"TASKID",
			            hidden:true
			        },
			        {
			            name:"操作",
			            index:"operate",
			            width:"20%",
			            sortable:false,
			            formatter:function(cell, options, row, tr, td) {
			                return GRID.button({class:"btn_edit",onclick:"_monitorByTaskId('"+row["TASKID"]+"');",title:"操作"});
			            }
			        }
			    ],
			    caption : "任务列表",
			    width:390
			};
			//查看流程实例
			function _monitorByProcId(procId){
				CORE.goToDS('DS_WORKFLOW_MONITOR_REDIRECT','procId='+procId,null,'_self');
			}	
			//暂停流程
			function _stopProcess(procId){
				CORE.confirm("确定暂停流程吗？",function(){
					CORE.request("DS_WORKFLOW_STOP",{data:"processId="+procId},function(data){
						CORE.info("操作完成");
						GRID.reload("instList");
					});			
				});
			}	
			//继续流程
			function _continueProcess(procId){
				CORE.confirm("确定继续流程吗？",function(){
					CORE.request("DS_WORKFLOW_CONTINUE",{data:"processId="+procId},function(data){
						CORE.info("操作完成");
						GRID.reload("instList");
					});			
				});
			}	
			//取消流程
			function _cancelProcess(procId){
				CORE.confirm("取消流程后,流程数据将被删除,确定取消流程吗？",function(){
					CORE.request("DS_WORKFLOW_CANCEL",{data:"processId="+procId},function(data){
						CORE.info("取消操作完成");
						GRID.reload("instList");
					});			
				});
			}	
			//中断流程
			function _interruptProcess(procId){
				$("#InteruptPanel").dialog({
				    title : "中断信息",
				    width : "300",
				    height : "150" ,
				    modal : true,
				    bgiframe : true,
				    resizable:false,
				    buttons:{
				    	"确定":function(){
							CORE.request("DS_WORKFLOW_INTERUPT",
								{data:"processId="+procId+"&msg="+$("#interuptInfo").val()},function(data){
								CORE.info("中断操作完成");
				            	$("#InteruptPanel").dialog("close");
								GRID.reload("instList");
							});						    		
				    	},
				        "取消":function() {
				            $("#InteruptPanel").dialog("close");
				        }
				    }
				});			
			}
			
			//查看流程实例拥有任务
			function _gridTasks(procId){
				document.ProcTaskForm.procId.value = procId;
			    GRID.create("#taskList", "DS_WORKFLOW_PROCINST_TASKINST_LIST", taskListParam, "ProcTaskForm");
				$("#ProcTaskPanel").dialog({
				    title : "现行任务",
				    width : "420",
				    height : "350" ,
				    modal : true,
				    bgiframe : true,
				    resizable:false,
				    buttons:{
				        "取消":function() {
				            $("#ProcTaskPanel").dialog("close");
				        }
				    }
				});
			}		
			//监控任务实例
			function _monitorByTaskId(taskId){
				CORE.goToDS('DS_WORKFLOW_MONITOR_REDIRECT','taskId='+taskId,null,'_self');
			}			
			//初始化
			$(function(){	
			    GRID.create("#instList", "DS_WORKFLOW_PROCINST_LIST", instListParam, "QueryForm");
			});
	</script>
	</head>

	<body style="padding: 0; margin: 0"> 
		<jsp:include page="/pages/navbar.jsp" />
		<div class="modules">
			<div class="barquery">
				<div id="list_title" class="barquerycenter">
					当前系统所有流程实例:
				</div>
			</div>
		</div>
		<!-- 查询流程实例FORM -->
		<form name="QueryForm" onsubmit="GRID.reload('instList');return false;">
              <div class="barquerycontent" align="center">
                   <table class="content_List">
              	     <tr>
                        <td align="right" class="contenttd" width="200px">流程定义名称：</td>
                        <td align="left">
                    	   <input type="text" name="procType" class="textbox_css" /> 
                    	   <input class="btnquery_mouseout" onMouseOver="this.className='btnquery_mouseover'"
                                  onMouseOut="this.className='btnquery_mouseout'" type="submit" value=""/>
                        </td>
                     </tr>
                   </table>
               </div>
        </form>
		<div align="center">
		     <!--实例列表区域-->
             <table id="instList" style="margin: 0; padding: 0;"></table>
             <div id="listPagerdt" style="margin: 0; padding: 0;"></div>
		</div>
		<!-- 中断信息填写PANEL -->
		<div id="InteruptPanel" style="display:none;">
		   <table>
		   	<tr>
		   		<td>中断原因:</td>
		   		<td><textarea id="interuptInfo"></textarea></td>
		   	</tr>
		   </table>     		
		</div>
		<!-- 流程关联的所有任务实例FORM -->
		<form name="ProcTaskForm">
			<input type="hidden" name="procId"/>
		</form>
		<div id="ProcTaskPanel" style="display:none;">
             <table id="taskList" style="margin: 0; padding: 0;"></table>		
		</div>
	</body>
</html>
