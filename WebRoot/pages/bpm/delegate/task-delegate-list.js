var task_delegate_list_params = {
	colModel : [ {
		name : '委托编号',
		index : 'delegateId',
		width : "10%",
		hidden : true,
		align : "center",
		sortable : false,
		formatoptions : {}
	}, {
		name : '委托人',
		index : 'FORM_USER',
		width : "10%",
		hidden : false,
		align : "center",
		sortable : false,
		formatoptions : {}
	}, {
		name : '被委托人',
		index : 'TO_USER',
		width : "10%",
		hidden : false,
		align : "center",
		sortable : false,
		formatoptions : {}
	}, {
		name : '委托时间',
		index : 'DELEGATE_DATE',
		width : "12%",
		align : "center",
		sortable : false,
		formatoptions : {}
	}, {
		name : '委托开始时间',
		index : 'START_DATE',
		width : "10%",
		align : "center",
		sortable : false,
		formatoptions : {}
	}, {
		name : '委托结束时间',
		index : 'END_DATE',
		width : "10%",
		align : "center",
		sortable : false,
		formatoptions : {}
	}, {
		name : '委托状态',
		index : 'STATUS',
		width : "5%",
		align : "center",
		sortable : false,
		formatter : function(cellvalue, options, rowObject){
			switch (cellvalue) {
			case "0":
				return '未生效';
				break;
			case "1":
				return '有效';
				break;
			case "2":
				return '无效';
				break;
			}
		},
		formatoptions : {}
	}, {
		name : '委托设置人',
		index : 'DELEGATE_USER',
		width : "10%",
		align : "center",
		sortable : false,
		formatoptions : {}
	},{
		name : '操作',
		index : '',
		width : "10%",
		align : "center",
		sortable : false,
		formatter : operation,
		formatoptions : {}
	}],
	caption : "任务委托列表",
	edit : true,
	multiselect : false,
	width : "100%",
	pager : "#listPagerdt"
};

/**
 * 操作列formatter处理函数
 */
function operation(cellvalue, options, rowObject){
	if(rowObject['STATUS']==2){
		return "";
	}
	var modifyDelegate = '<a href="javascript:void(0);" onClick="modifyDelegateForm('+rowObject['delegateId']+');">修改委托</a>';
	var deleteDelegate = '<a href="javascript:void(0);" onClick="deleteDelegate('+rowObject['delegateId']+','+rowObject['STATUS']+')">取消委托</a>';
	return modifyDelegate + " " + deleteDelegate;
};

/**
 * 装载待修改表单
 */
var modifyDelegateForm = function(delegateId){
	
	CORE.loadRules("delegateEditorForm","BPM_DELEGATE");
	
	var delegateEditorFormDialogOpt = {
			title : "修改委托",
			width : "350px",
			height : "190",
			modal : true,
			bgiframe : true,
			resizable : false,
			buttons : {
				'取消' : function() {
					$("#delegateEditorFormDialog").dialog("close");
				},
				'确定' : function() {
					CORE.submitForm("DS_MODIFY_DELEGATE","delegateEditorForm",{},function(body,header){
						if(header.code == 0){
							CORE.tip("更新成功");
							$("#delegateEditorFormDialog").dialog("close");
							GRID.reload('delegateList');
						}else{
							CORE.error("更新错误",body);
						}
					});
				}
			}
		};
	
	CORE.loadForm("DS_LOAD_DELEGATE_FORM","delegateEditorForm",
		{data:"delegateId="+delegateId,
		loadComplete:function(){
			$("#delegateEditorFormDialog").dialog(delegateEditorFormDialogOpt);
		}});

};

/**
 * 删除委托
 */
var deleteDelegate = function(delegateId,status){
	CORE.confirm("确定要取消委托吗?",function(){
		CORE.request("DS_DELETE_DELEGATE",{data:"delegateId="+delegateId+"&status="+status},function(body,header){
			if(header.code==0){
				CORE.tip("委托取消成功");
				GRID.reload('delegateList');
			}else{
				CORE.error("委托取消出错",body);
			}
		});
	});
};


$(function(){
	GRID.create("#delegateList", "DS_TASK_DELEGATE_LIST", task_delegate_list_params, "");
	CORE.loadRules("addDelegateForm","BPM_DELEGATE");
});


/**
 * 添加委托任务
 */
var addDelegate = function(){
	CORE.submitForm("DS_ADD_DELEGATE","addDelegateForm",{},function(body,header){
		if(header.code == 0){
			CORE.tip("添加成功");
			GRID.reload('delegateList');
		}else{
			CORE.error("发生错误",body);
		}
	});
};

/**
 * 选人
 */
var selectDelegateUser = function(obj){
	selectUser({
		multiselect:false,
		selected:function(users){
			if(users.length == 0){
				$("#"+obj['id']).val("");
				$("#"+obj['name']).val("");
			}else{
				$("#"+obj['name']).val(users[0].name);
				$("#"+obj['id']).val(users[0].id);
			}
		}
	});
};


/**
 * 设置是否现在委托人表单
 */
var displayFormUser = function(flag){
	if(flag == true){
		$(".isAdmin").attr("style","display:none");
	}else{
		$(".isAdmin").attr("style","");
	}
};
