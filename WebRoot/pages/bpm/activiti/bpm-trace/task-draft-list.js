//列表参数
var task_draft_list_params = {
	colModel : [ {
		name : '流程编号',
		index : 'deployID',
		width : "5px",
		hidden : true,
		align : "center",
		sortable : false,
		formatoptions : {}
	}, {
		name : '任务编号',
		index : 'taskId',
		width : "5px",
		hidden : true,
		align : "center",
		sortable : false,
		formatoptions : {}
	}, {
		name : '实例编号',
		index : 'procInstId',
		width : "10%",
		hidden : true,
		align : "center",
		sortable : false,
		formatoptions : {}
	}, {
		name : '流程定义编号',
		index : 'procDefID',
		width : "12%",
		align : "center",
		sortable : false,
		formatoptions : {}
	}, {
		name : '流程名称',
		index : 'procDefName',
		width : "10%",
		align : "center",
		sortable : false,
		formatoptions : {}
	}, {
		name : '当前节点',
		index : 'curNode',
		width : "10%",
		align : "center",
		sortable : false,
		formatter : genGetCurActivityTraceResourceRequestStr,
		formatoptions : {}
	}, {
		name : '责任人',
		index : 'assignee',
		width : "5%",
		align : "center",
		sortable : false,
		formatoptions : {}
	}, {
		name : '流程图片',
		index : 'pngName',
		width : "15%",
		align : "center",
		sortable : false,
		formatter : genGetProcessResourceRequestStr,
		formatoptions : {}
	}, {
		name : '开始时间',
		index : 'startTime',
		width : "10%",
		align : "center",
		sortable : false,
		formatoptions : {}
	}, {
		name : '截止时间',
		index : 'deadline',
		width : "10%",
		align : "center",
		sortable : false,
		formatoptions : {}
	}, {
		name : '超时(天)',
		index : 'overdue',
		width : "10%",
		align : "center",
		sortable : false,
		formatoptions : {}
	}, {
		name : '操作',
		index : 'unfinishTaskCount',
		width : "10%",
		align : "center",
		sortable : false,
		formatter : genProcessOperateRequestStr,
		formatoptions : {}
	} ],
	caption : "流程列表",
	edit : true,
	multiselect : false,
	width : "100%",
	pager : "#pagerdt"
};

procInstDeleteFormDialogOpt = {
	title : "删除实例",
	width : "350px",
	height : "150",
	modal : true,
	bgiframe : true,
	resizable : false,
	buttons : {
		'取消' : function() {
			$("#procInstDeleteFormDialog").dialog("close");
		},
		'删除' : function() {
			var procInstId = $("#_procInstDel_procInstId").val();
			var reason = $("#_procInstDel_reason").val();
			BPM.delProcInst(procInstId, reason, function(data) {
				GRID.reload("draftList");
				$("#procInstDeleteFormDialog").dialog("close");
				BPM.showSucInfo(data);
			});
		}
	}
};

/**
 * 生成操作列的超链接
 * 
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns {String}
 */
function genProcessOperateRequestStr(cellvalue, options, rowObject) {

	var procDefId = rowObject['procInstId'];
	var taskId = rowObject['taskId'];
	var taskHandleBtnClickFun = "showTaskHandleWin('" + procDefId + "', '" + taskId + "')";
	var taskHandleBtn = "<a href=\"javascript:void(0);\" onClick=\"" + taskHandleBtnClickFun + "\">办理</a>";

	var procInstId = rowObject['procInstId'];
	var processInstDelBtnClickFun = "showProcInstDelDialog('" + procInstId + "')";
	var processInstDelBtn = "<a href=\"javascript:void(0);\" onClick=\"" + processInstDelBtnClickFun + "\">删除实例</a>";

	return taskHandleBtn + " " + processInstDelBtn;

}

/**
 * 生成跟踪当前节点的超链接
 * 
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns {String}
 */
function genGetCurActivityTraceResourceRequestStr(cellvalue, options, rowObject) {
	var taskId = rowObject['taskId'];
	var taskTraceBtnClickFun = "BPM.showTaskTraceWin('" + taskId + "')";
	var taskTraceBtn = "<a href=\"javascript:void(0);\" onClick=\"" + taskTraceBtnClickFun + "\">" + cellvalue + "</a>";
	return taskTraceBtn;
}

/**
 * 生成请求流程图片的超链接
 * 
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns {String}
 */
function genGetProcessResourceRequestStr(cellvalue, options, rowObject) {

	var deployId = rowObject[0];
	var resourceName = cellvalue;
	var showProcessResourceBtnClickFun = "BPM.showProcessResourceWin('" + deployId + "','" + resourceName + "')";
	var showProcessResourceBtn = "<a href=\"javascript:void(0);\" onClick=\"" + showProcessResourceBtnClickFun + "\">"
			+ cellvalue + "</a>";
	return showProcessResourceBtn;
}

/**
 * 打开任务处理窗口
 * 
 * @param procDefId
 *            流程定义ID
 * @param taskId
 *            任务ID
 */
function showTaskHandleWin(procDefId, taskId) {
	BPM.showTaskHandleWin(procDefId, taskId);
}

/**
 * 显示流程实例删除窗口
 * 
 * @param procInstId
 *            流程实例ID
 */
function showProcInstDelDialog(procInstId) {
	$("#_procInstDel_procInstId").val(procInstId);
	$("#procInstDeleteFormDialog").dialog(procInstDeleteFormDialogOpt);
}

// 初始化
$(function() {
	GRID.create("#draftList", "DS_RUNNING_LIST", task_draft_list_params, "QueryForm");
});
