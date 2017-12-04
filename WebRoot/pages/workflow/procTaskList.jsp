<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
	<title>流程定义管理</title>
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
			var taskListParam = {
			    colModel:[
			    	{
			            name:"流程名",
			            index:"PROC_NAME",
			            width:"25%",
			            align:"center"
			        },
			        {
			            name:"流程环节",
			            index:"ACTIVIY_NAME",
			            width:"25%",
			            align:"center"
			        },
			        {
			            name:"创建时间",
			            index:"CREATE_TIME",
			            width:"25%",
			            align:"center"
			        },
			        {
			            name:"TASK_ID",
			            index:"TASK_ID",
			            width:"0%",
			            hidden:true
			        },
			        {
			            name:"操作",
			            index:"operate",
			            width:"25%",
			            sortable:false,
			            formatter:function(cell, options, row, tr, td) {
			                return GRID.button({className:"btn_edit",onclick:"_gotoPage('"+row["TASK_ID"]+"');",title:"操作"});
			            }
			        }
			    ],
			    caption : "任务列表",
			    multiselect:true,
			    width:"98%",
			    pager: "#listPagerdt",
			};
			//跳转到指定环节页面
			function _gotoPage(taskId){
				CORE.goToDS('DS_PROCESS_REDIRECT', 'taskId='+taskId, null,'_self');
			}			
			//初始化
			$(function(){	
			    GRID.create("#tasksList", "DS_PROCESS_USERTASK", taskListParam, "QueryForm");
			});
	</script>
	</head>

	<body style="padding: 0; margin: 0"> 
		<jsp:include page="/pages/navbar.jsp" />
		<div class="modules">
			<div class="barquery">
				<div id="list_title" class="barquerycenter">
					当前用户所有代办任务:
				</div>
			</div>
		</div>
		<!-- 查询当前业务FORM -->
		<form name="QueryForm">
			<input type="hidden" name="procDef" value="${param.procDef}">
		</form>
		<div align="center">
		     <!--列表区域-->
             <table id="tasksList" style="margin: 0; padding: 0;"></table>
             <div id="listPagerdt" style="margin: 0; padding: 0;"></div>
		</div>
	</body>
</html>
