<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%--
	author:李嘉伟
	time:20111205
	version:1.0
	包含功能：可选选流程,可选环节页面
	可选流程:_selectProcDef({type:"",select:function(id){}})
	发起流程:
			var config = {
				data:"",
				procDefId:id,
				activityId:"usertask1",
				bussinessKey:"4",
				callback:function(){alert("start!");}
			};
			_startProcess(config);
--%>



<!-- 可选流程定义 -->
<form name='_WORK_FLOW_PROC_DEF_FORM'>
	<input type='hidden' name='type'/>
</form>
<div id='_WORK_FLOW_PROC_DEF_DIV_' style='display:none;' >
	<table id='_WORK_FLOW_PROC_DEF_LIST_' style='margin: 0; padding: 0;'></table>
</div>
<script type="text/javascript">
/**
 * 可选流程
 * @param type 类型
 * @param select 回调事件
 */
function _selectProcDef(param){
	_procDefDlg = $("#_WORK_FLOW_PROC_DEF_DIV_");
	//填充参数
	document._WORK_FLOW_PROC_DEF_FORM.type.value = param.type;
	//创建流程列表
	GRID.create("#_WORK_FLOW_PROC_DEF_LIST_", "DS_WORKFLOW_PROCDEF_LIST", 
				{
					colModel:[
			        {
			            name:"ID",
			            index:"ID",
			            align:"center",
			            hidden:true
			        },
			        {
			            name:"流程名称",
			            index:"SYS_NAME",
			            align:"center",
			            width:200
			        },
			        {
			            name:"版本",
			            index:"MODUEL_NAME",
			            align:"center",
			            width:100
			        }],
				    caption : "流程列表",
				    onSelectRow:function(id){
				    	param.select(id);
	            		_procDefDlg.dialog("close");
				    },
				    width:460
			   }, "_WORK_FLOW_PROC_DEF_FORM");
	//弹出选择框
	_procDefDlg.dialog({
	    title:"流程列表",
	    width:"490",
	    height:"180",
	    resizeable:false,
	    buttons:{
	        "关闭":function () {
	            _procDefDlg.dialog("close");
	        }
	    }
	});	
}
</script>

<!-- 选人列表样式 -->
<style>
.activityGrid {
    font-size: 12px;
    border-collapse: collapse;
    border: 1px solid #DEDFE4;
    color: #000;
    table-layout: fixed;
    overflow: auto;
    zoom: 1;
    border-top: 2px solid #5F8FBF;
}

.activityGrid tr {
    height: 18px;
}

.activityGrid th {
    height: 24px;
    border: 1px solid #cad9ea;
    background: url(../images/index02_r8_c8.gif) repeat-x;
    font-weight: bold;
    color: #000;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.activityGrid td {
    border: 1px solid #cad9ea;
    padding: 0px 2px 0px 2px;
    word-break: keep-all;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.propertyGrid input {
    width: 100%;
    height: 100%;
    border: none;
}

</style>
<script type="text/javascript">
/**
 * 发起流程
 * @param data 业务参数
 * @param procDef 流程KEY
 * @param procDefId 流程ID
 * @param activityId 发起在流程中的环节ID
 * @param bussinessKey 业务ID
 * @param callback 回调函数
 */
function _startProcess(params){
	//请求参数
	var requestParams = "";
	if(params.procDef != undefined)
		requestParams += "procDef="+params.procDef;
	else if(params.procDefId != undefined)
		requestParams += "procDefId="+params.procDefId;
	else{
		CORE.info("必须提供走哪个流程ID或者流程KEY！");
		return;
	}
	if(params.bussinessKey == undefined)
		CORE.info("必须提供流畅关联的业务ID参数:bussinessKey!");
	else
		requestParams += "&bussinessKey="+params.bussinessKey;
	if(params.activityId != undefined)		
		requestParams += "&activityId="+params.activityId;
	if(params.data != undefined)
		requestParams += "&"+params.data;
	//发送请求获取环节以及候选人
	CORE.request("DS_PROCESS_NEXT_ASSIGNEE",{data:requestParams},function(data){
		_generateActivitySelectGrid(data,function(params,map){_startProcessTask(params,map);},params);
	});
}

//完成发起任务函数
function _startProcessTask(params,map){
	var requestData = params + "&bussinessKey=" + map.bussinessKey;
	if(map.procDef != undefined)
		requestData += "&procDef="+map.procDef;
	else if(map.procDefId != undefined)
		requestData += "&procDefId="+map.procDefId;
	if(map.data != undefined)
		requestData += "&"+map.data;		
	CORE.request("DS_PROCESS_START_COMPLETE",{data:requestData},function(body,head){
		if(body.taskId!="undefined" && body.taskId != "")
			CORE.goToDS('DS_PROCESS_REDIRECT', 'taskId='+body.taskId, null,'_self');
		else{
			$("#_ActivityAssigneePanel").dialog("close");
			CORE.info(data.body);
		}
	});		 
}

//完成代办任务
function _completeUserTask(params,map){
	var requestData = params + "&taskId="+map.taskId + "&bussinessDS=" + map.bussinessDS + 
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


//打开选择用户窗口,并传递回调函数
function _generateActivitySelectGrid(gridData,func,map){
	//创建表格
	__generateActivityAssigneeGrid(gridData);
	//保存回调
	_activitySelectPanelParam.completeTask = func;
	_activitySelectPanelParam.map = map;
	//弹出环节选取
	$("#_ActivityAssigneePanel").dialog(_activitySelectPanelParam);
}

//弹出框选择的环节人员
var _activitySelectValue = "";
//弹出框参数
var _activitySelectPanelParam =	{
	title : "下一步骤设置",
	width:"450", 
	height:"380", 
	modal:true,
	bgiframe:true,
	resizable:false,
	buttons :{
		'取消':function(){
			$("#_ActivityAssigneePanel").dialog("close");
		},
		'确定':function() {
			var _activitySelectValue = _makeActivityAssigneeParam();
			_activitySelectPanelParam.completeTask(_activitySelectValue,_activitySelectPanelParam.map);
		}
	}
}

//创建表格
function __generateActivityAssigneeGrid(gridData){
	$("#_ActivityAssigneeList").empty();
	$("#_ActivityAssigneeList").append("<tr><th align='center' width='30%'>步骤</th><th align='center'>候选人</th></tr>");
	//当只有一个结果时默认选择一个
	var FirstRequire = "";
	if(gridData.length==1)
		FirstRequire = "disabled checked";
	for(var i = 0;i<gridData.length;i++)
	{
		if(gridData[i].name=="End")
			gridData[i].name = "流程结束";
		var activity = "<input type='checkbox' name='activityId' value='"+gridData[i].id+
		"' actName='"+gridData[i].name+
		"' actPage='"+gridData[i].page+
		"' actForm='"+gridData[i].form+
		"' actDs='"+gridData[i].ds+
		"' actType='"+gridData[i].type+"' "+FirstRequire+"/>"+gridData[i].name;
		var assignee = "";
		for(var j = 0;j<gridData[i].assignees.length;j++)
		{
			assignee += "<input type='checkbox' name='assignee' value='"+gridData[i].assignees[j].id+
						"' actId='"+gridData[i].id+
						"' assName='"+gridData[i].assignees[j].name+
						"' assType='"+gridData[i].assignees[j].type+"'/>"+gridData[i].assignees[j].name;
			if((j+1)%4==0)
				assignee+="<br/>";
		}
		if(gridData[i].assignees.length==0)
			assignee += "无候选人";
		$("#_ActivityAssigneeList tbody")
			.append("<tr><td valign='top' align='center'>" + activity + "</td><td valign='top' align='left'>"+assignee+"</td></tr>");
	}
	
}

//转化用户选择了的参数
function _makeActivityAssigneeParam(){
	var params = "";
	$("#_ActivityAssigneeList :input[name='assignee']").each(
		function(){
			if(this.checked==true){
				//var str = $(this).attr("actId")+"_"+$(this).attr("value")+"_"+$(this).attr("assName")+"_"+$(this).attr("assType");
				//params+="selectAssignees="+str+"&";
				params += "selectAssignees="+$(this).attr("actId")+"_"+$(this).attr("value")+"&";
			}
		}
	);	
	$("#_ActivityAssigneeList :input[name='activityId']").each(
		function(){		
			if(this.checked==true){
				//var str = $(this).attr("value")+"_"+$(this).attr("actName")+"_"+$(this).attr("actPage")+"_"+$(this).attr("actForm")+"_"+
				//		  $(this).attr("actDs")+"_"+$(this).attr("actType");
				//params+="selectActivities="+str+"&";
				params+="selectActivities="+$(this).attr("value")+"&";
			}
		}
	);		
	return params;
}
</script>
<!-- 用户列表窗口 -->
<div id="_ActivityAssigneePanel" style="display: none; width: 100%;height:100%" align="center">
	<table id="_ActivityAssigneeList" class="activityGrid" border="1" style="width:100%;height:50%;"></table>
</div>