/**
 * User: 李嘉伟
 * 页面管理JS
 **/

var pageMangerGridParam = {
    colModel:[
        {
            name:"业务系统",
            index:"SYS_NAME",
            width:100
        },
        {
            name:"模块",
            index:"MODUEL_NAME",
            width:100
        },
        {
            name:"模板名称",
            index:"TEMPLATE_NAME",
            width:90
        },
        {
            name:"页面名称",
            index:"PAGE_NAME",
            width:130
        },
        {
            name:"当前编辑人",
            index:"EDIT_USER_NAME",
            width:50
        },
        {
            name:"EDIT_USER",
            index:"EDIT_USER",
            hidden:true
        },
        {
            name:"EDIT_STATUS",
            index:"EDIT_STATUS",
            hidden:true
        },
        {
            name:"操作",
            index:"operate",
            width:140,
            sortable:false,
            formatter:function(cell, options, row, tr, td) {
                return GRID.button({className:"btn_edit",onclick:"_editPage('"+row["PAGE_ID"]+"');",title:"修改"})+
                        GRID.button({className:"btn_delete",onclick:"_delPage('" + row["PAGE_ID"] +"','" + row["SYS_CODE"]+"');",title:"删除"})+
                        GRID.button({className:"btn_copy",onclick:"_copyPage('" + row["TEMPLATE_ID"] +"','" + row["PAGE_ID"]+"');",title:"复制"})+
                        GRID.button({className:"btn_config",onclick:"_configPage('" + row["TEMPLATE_ID"] +"','" + row["PAGE_ID"]  +"','" + row["PAGE_NAME"] +"','" + row["SYS_NAME"] +"','" + row["HAS_DEF"] +"','" + row["MODUEL_NAME"]+"','" + row["SYS_CODE"] +"');",title:"配置"})+
                        GRID.button({className:"btn_browse",onclick:"CORE.goToDS('DS_RDCP_RUN_PAGE','page_id="+row["PAGE_ID"]+"',null,'_blank');",title:"测试"})+
                        GRID.button({className:"btn_sync",onclick:"_syncPage('"+row["PAGE_ID"]+"','"+row["SYS_CODE"]+"');",title:"同步"})+
                        GRID.button({className:"btn_auth",onclick:"_changeFunction('" + row["PAGE_ID"]+ "');",title:"更换关联的功能"})+
                        GRID.button({className:"btn_commit u_"+row["EDIT_STATUS"]+"_"+row["EDIT_USER"],onclick:"_versionCommit('"+row["PAGE_ID"]+"','"+row["SYS_CODE"]+"');",title:"提交更改"})+
                        GRID.button({className:"btn_undo u_"+row["EDIT_STATUS"]+"_"+row["EDIT_USER"],onclick:"_versionRevocation('ID','"+row["PAGE_ID"]+"','"+row["SYS_CODE"]+"','"+row["PAGE_NAME"]+"');",title:"撤销更改"});
                /*
                return "<input value='编辑' type='button' class='grid_button' onclick='_editPage(\"" + row["PAGE_ID"] +"\")'>&nbsp"+
                       "<input value='删除' type='button' class='grid_button' onclick='_delPage(\"" + row["PAGE_ID"] +"\",\"" + row["SYS_CODE"]+"\")'>&nbsp"+
         	   		   "<input value='克隆' type='button' class='grid_button' onclick='_copyPage(\"" + row["TEMPLATE_ID"] +"\",\"" + row["PAGE_ID"]+"\")'>&nbsp"+
                	   "<input value='配置' type='button' class='grid_button' onclick='_configPage(\"" + row["TEMPLATE_ID"] +"\",\"" + row["PAGE_ID"]  +"\",\"" + 
                	   																				row["PAGE_NAME"] +"\",\"" + 
                	   																				row["SYS_NAME"] +"\",\"" + 
                	   																				row["HAS_DEF"] +"\",\"" + 
                	   																				row["MODUEL_NAME"] +
                        															  "\")'>&nbsp;" +
                        "<input value='测试' type='button' class='grid_button' onclick='CORE.goToDS(\"DS_RDCP_RUN_PAGE\",\"page_id="+row["PAGE_ID"]+"\",null,\"_blank\")'>&nbsp;"+
                        "<input value='提交' type='button' class='grid_button commitBtn u_"+row["EDIT_STATUS"]+"_"+row["EDIT_USER"]+"' onclick='_versionCommit(\"" + row['PAGE_ID'] +"\")'>";
                        */
            }
        },
        {
            name:"TEMPLATE_ID",
            index:"TEMPLATE_ID",
            width:100,
            hidden:true
        },
        {
            name:"PAGE_ID",
            index:"PAGE_ID",
            width:100,
            hidden:true
        },
        {
            name:"SYS_CODE",
            index:"SYS_CODE",
            width:100,
            hidden:true
        },
        {
            name:"HAS_DEF",
            index:"HAS_DEF",
            width:100,
            hidden:true
        }
    ],
    caption : "页面管理列表",
    multiselect:true,
    width:950,
    pager: "#pagerdt",
    loadComplete:pageListLoadComplete
};

/**
 * 同步页面
 */
function _syncPage(pageId,syscode){
	CORE.request("DS_SYNC_OBJECT",{data:"objId="+pageId+"&syscode="+syscode+"&tablenames=RDC_CFG_PAGE"}, function(data) {
		CORE.info(data);
	});
}
/**
 * 新增时选择关联功能
 */
function _selectRefFunction(){	
	var callback = function(event, treeId, node){
		if(node.type=="2"){
			$("#ref_function").val(node.name);
			$("#ref_function_id").val(node.id);
			$("#functionPanel").dialog("close");
		}
	}
	buildFuncTree(callback);
}
/**
 * 更改页面关联的功能
 */
function _changeFunction(pageId){
	var callback = function(event, treeId, node){
		if(node.type == "2"){
			CORE.request("DS_PAGE_REF_FUNCTION",{data:"pageId="+pageId+"&function_id="+node.id}, function(data) {
	    		$("#functionPanel").dialog("close");
	    		CORE.tip("关联到选中的功能!");
	    	});
    	}
	}
	buildFuncTree(callback);
}

/**
 * 选择功能
 */
var funcTree4Select = null;
var funcTreePanelOpt = {
    title : "选择功能",
    width : "380",
    height : "350" ,
    modal : true,
    bgiframe : true,
    resizable:false,
    buttons:{
        "取消":function() {
            $("#functionPanel").dialog("close");
        }
    }
};
function buildFuncTree(selectFunc){
    funcTree4Select = new ZTree("func_tree", "DS_PAGE_MODUEL_FUNCTION_TREE",
    	{nodeClicked:function(event, treeId, treeNode){
    		selectFunc(event, treeId, treeNode);
    	}});
    $("#functionPanel").dialog(funcTreePanelOpt);
}

/**
 * 添加页面配置
 */
function _addPage(){
	//清空数据
	$("#id").val("");
	$("#page_id").val("");
	$("#page_note").val("");
	$("#page_code").val("");	
	$("#ref_function").val("");
	$("#ref_function_id").val("");
	$("#page_code").removeAttr("readOnly");
	//模板可选
	$("#template_list").removeAttr("disabled");
	$("#container_list").removeAttr("disabled");
	//可选是否和模板同步
    document.PageParams.has_def.checked = true;
    document.PageParams.has_def.disabled = "";
    //只显示容器选项
    $("#containerTr").attr("style","display:none;");
    $("#templateTr").attr("style","");
    $("#refFunctionTr").attr("style","");
    _PageParamsDialog.from = "template";
	$("#PageParamsDialog").dialog(_PageParamsDialog);
}
/**
 * 添加仅有容器的页面
 */
function _addPageOnlyContainer(){
	//清空数据
	$("#id").val("");
	$("#page_id").val("");
	$("#page_note").val("");
	$("#page_code").val("");
	$("#ref_function").val("");
	$("#ref_function_id").val("");
	$("#page_code").removeAttr("readOnly");
	//模板可选
	$("#template_list").removeAttr("disabled");
	$("#container_list").removeAttr("disabled");
    //只能复制容器配置,不保持同步
    document.PageParams.has_def.checked = true;
    document.PageParams.has_def.disabled = true;
    //只显示容器选项
    $("#containerTr").attr("style","");
    $("#refFunctionTr").attr("style","");
    $("#templateTr").attr("style","display:none;");
    _PageParamsDialog.from = "container";
	$("#PageParamsDialog").dialog(_PageParamsDialog);
}

/**
 * 编辑页面配置
 * @param pageId
 */
function _editPage(pageId){
	$("#page_id").val("");
	$("#page_note").val("");
	$("#page_code").attr("readOnly","true");
	$("#ref_function").val("");
	$("#ref_function_id").val("");
    //不显示归属容器模板
    $("#refFunctionTr").attr("style","display:none;");
    $("#containerTr").attr("style","display:none;");
    $("#templateTr").attr("style","display:none;");
    CORE.loadForm("DS_PAGE_LOAD", "PageParams", {data:"id=" + pageId,loadComplete:function(data) {
    	if(data["has_def"]==0){
    		document.PageParams.has_def.checked = false;
    	}else{
    		document.PageParams.has_def.checked = true;
    	}
    	document.PageParams.has_def.disabled = true;
		$("#template_list").attr("disabled","true");
		$("#PageParamsDialog").dialog(_PageParamsDialog);
    }});
}

//页面配置参数选择框
var _PageParamsDialog ={
	    title : "页面编辑",
	    width : "380",
	    height : "350" ,
	    modal : true,
	    bgiframe : true,
	    resizable:false,
	    from :"template",
	    buttons:{
	        "取消":function() {
	            $("#PageParamsDialog").dialog("close");
	        },
	        "确定":function() {
	        	var datas = "from="+_PageParamsDialog.from;
	            CORE.submitForm("DS_PAGE_SAVE", "PageParams", {data:datas}, function(data) {
	                $("#PageParamsDialog").dialog("close");
	                GRID.reload("pageManagerList");
	            });
	        }
	    }
	};

/**
 * 删除页面配置
 * @param pageId
 */
function _delPage(pageId,sysCode){
	CORE.confirm("是否确认删除?", function() {
	 	CORE.request("DS_PAGE_DEL",{data:"id="+pageId+"&sys_code="+sysCode}, function(data) {
                GRID.reload("pageManagerList");
        });
	});
}

/**
 * 批量删除页面配置
 */
function _delPages(){
	CORE.confirm("是否确认删除?", function() {
		var datas = GRID.getSelectRow("pageManagerList");
		//检测有没有勾选
		if(datas.length==0){
			CORE.tip("请选择至少一个对象");
			return;
		}
    	//组装参数
		var params = ""
		for(var i = 0;i<datas.length;i++)
		{
			var sys_code = datas[i]["SYS_CODE"];
			var page_id = datas[i]["PAGE_ID"];
			params += "sys_code="+sys_code+"&";
			params += "id="+page_id+"&";
		}	 	
		CORE.request("DS_PAGES_DEL",{data:params}, function(data) {
            GRID.reload("pageManagerList");
        });
	});
}


/**
 * 克隆页面配置
 * @param pageId
 */
function _copyPage(templateId,pageId){
	$("#page_id").val("");
	$("#page_note").val("");
	$("#template_list").attr("disabled","true");
	$("#template_list").val(templateId);
	$("#page_code").val("");
	$("#page_code").removeAttr("readOnly");
	_PageCloneDialog.pageId = pageId;
	$("#PageParamsDialog").dialog(_PageCloneDialog);
}


//页面配置复制弹出框
var _PageCloneDialog ={
	    title : "新建页面",
	    width : "390",
	    height : "360" ,
	    modal : true,
	    bgiframe : true,
	    resizable:false,
	    pageId : -1,
	    buttons:{
	        "取消":function() {
	            $("#PageParamsDialog").dialog("close");
	        },
	        "确定":function() {
	            CORE.submitForm("DS_PAGE_CLONE", "PageParams", {data:"SourcePageId="+_PageCloneDialog.pageId}, function(data) {
	                $("#PageParamsDialog").dialog("close");
	                GRID.reload("pageManagerList");
	            });
	        }
	    }
	};


/**
 * 配置页面
 * @param pageId
 * @param templateId
 */
function _configPage(templateId,pageId,pageName,sysName,has_def,moduleName,syscode){
	var href = "";
	if(has_def=="是")
		href = "pages/rdcp/page/pageEditEx.jsp?page_id="+pageId+"&pageName="+pageName+"&syscode="+syscode+"&sysName="+sysName+"&moduleName="+moduleName+"&canEdit=1";
	else
		href = "pages/rdcp/page/pageEditEx.jsp?page_id="+pageId+"&templateId="+templateId+"&syscode="+syscode+"&pageName="+pageName+"&sysName="+sysName+"&moduleName="+moduleName+"&canEdit=0";
	//$("#_EditFrame").attr("src", "pages/rdcp/page/pageEdit.jsp?page_id="+pageId+"&templateId="+templateId);
    //$("#PageDialog").dialog(_PageDialog);
    
    //在liger主题下，调用index的方法新开一个页面配置
    parent.f_addTab(pageId, sysName+"-"+pageName, href);
}

var pageTree = null;//模块树
var pageTreeForSearch = null; //搜索区域的模块树

//页面加载后执行代码块
$(function(){
    GRID.create("#pageManagerList","DS_PAGE_MANAGER_LIST",pageMangerGridParam,"pageManagerForm");
    //加载现有模板
    CORE.loadSelect('template_list', 'DS_TEMPLATE_SELECT', {});
    //加载现有容器
    CORE.loadSelect('container_list', 'DS_PAGE_CONTAINER_SELECT', {});
    //装载页面树
    pageTree = new ZTree("page_tree", "DS_PAGE_TREE",{nodeClicked:queryModuleSelect});
});

/**
 *  查询表单模块选择事件处理函数
 */
function _moduleNameSelect(){
	pageTreeForSearch =  selectModule(function(treeNode) {
        if (treeNode != null && treeNode.type == '0') {
    		$("#sysId").val(treeNode.sys);
    		$("#sysName").val(treeNode.name);
        } else if (treeNode != null) {
    		$("#moduleId").val(treeNode.id);
    		$("#moduleName").val(treeNode.name);
    		$("#sysId").val(treeNode.sys_code);
    		$("#sysName").val(treeNode.parentNode.sys_name);
        }
    },"",true);
}
/**
 *  编辑页面信息的选择模块树
 */
function _selectModule(){
	pageTreeForSearch =  selectModule(function(node) {
        if (node != null && node.type == '0') {
    		$("#sys_list_code").val(node.sys_code);
    		$("#sys_list_text").val(node.name);
        } else if (node != null) {
    		$("#sys_list_code").val(node.sys_code);
    		$("#sys_list_text").val(node.parentNode.name);
        	$("#module_list_name").val(node.name);
        	$("#module_list_code").val(node.id);
        }
    },"",true);
}

/**
 * 模块树的节点选择事件
 * @param event
 * @param treeId
 * @param treeNode
 */
var queryModuleSelect = function(event, treeId, treeNode){
	if(treeNode.type==0){
		$("#sysId").val(treeNode.sys);
		$("#sysName").val(treeNode.name);
		$("#moduleId").val("");
		$("#moduleName").val("");
		$("#pageName").val("");
		$("#pageId").val("");
		$("#sys_list_code").val(treeNode.sys);
		$("#sys_list_text").val(treeNode.name);
	}
	if(treeNode.type==1){
		$("#moduleId").val(treeNode.id);
		$("#moduleName").val(treeNode.name);
		$("#sysId").val(treeNode.sys);
		$("#sysName").val(treeNode.parentNode.name);
		$("#pageId").val("");
		$("#pageName").val("");
		$("#module_list_code").val(treeNode.id);
		$("#module_list_name").val(treeNode.name);
		$("#sys_list_code").val(treeNode.sys);
		$("#sys_list_text").val(treeNode.parentNode.name);
	}
	if(treeNode.type==2){
		$("#pageName").val(treeNode.name);
		$("#moduleId").val(treeNode.parentNode.id);
		$("#moduleName").val(treeNode.parentNode.name);
		$("#sysId").val(treeNode.sys);
		$("#sysName").val(treeNode.parentNode.parentNode.name);
		$("#module_list_code").val(treeNode.parentNode.id);
		$("#module_list_name").val(treeNode.parentNode.name);
		$("#sys_list_code").val(treeNode.sys);
		$("#sys_list_text").val(treeNode.parentNode.parentNode.name);
	}
    GRID.reload("pageManagerList");
}
