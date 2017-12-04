<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>
<script type="text/javascript" src="scripts/common/ztree.help.js"></script>
<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
<#-- 若是选择框类型则不生成树容器 -->
<#if property("hasPanel")?? && property("hasPanel") == "true">
<#else> 
<!-- 树容器 -->
<div id="${property("tree_id")}" class="${property("tree_class")!"tree"}" style="height:${property("tree_height")!500}px;overflow:auto;"></div>
</#if>
<!-- ztree 脚本 -->
<script>
//树对象
var ${property("tree_id")} = null;

<#-- 是否自动加载树 -->
<#if property("autoBuild")?? && property("autoBuild") == "true">
$(function(){
    ${property("tree_id")} = new ZTree("${property("tree_id")}", "${property("datasource")}",
    	{
    		async:<#if property("async")?? && property("async") != "true">false<#else>true</#if>,
    		multi:<#if property("multi")?? && property("multi") != "true">false<#else>true</#if>,
    		nodeClicked:${property("tree_id")}_select,
    		otherParam:["_sysCode",CORE.syscode<#if property("otherParams")?? && property("otherParams") != "">,${property("otherParams")}</#if>],
    		loadComplete:${property("tree_id")}_complete
    		<#if property("checkType")?? && property("checkType") != "">,checkable:true,checkType:${property("checkType")}</#if> 
    	});
});
</#if>

<!-- ztree 点击事件 -->
function ${property("tree_id")}_select(event, treeId, treeNode){
	${property("selectEvent")!}
}

<!-- ztree 加载完成事件 -->
function ${property("tree_id")}_complete(){
	${property("completeEvent")!}
}

<!-- ztree API -->
var ${_config.code}={
    main:function(){
    	//根据配置创建树
	    ${property("tree_id")} = new ZTree("${property("tree_id")}", "${property("datasource")}",
	    	{
    			async:<#if property("async")?? && property("async") != "true">false<#else>true</#if>,
    			multi:<#if property("multi")?? && property("multi") != "true">false<#else>true</#if>,
	    		nodeClicked:${property("tree_id")}_select,
	    		otherParam:["_sysCode",CORE.syscode<#if property("otherParams")?? && property("otherParams") != "">,${property("otherParams")}</#if>],
	    		loadComplete:${property("tree_id")}_complete
  		  		<#if property("checkType")?? && property("checkType") != "">,checkable:true,checkType:${property("checkType")}</#if> 
	    	});
    },
    buildInitTree:function(param){
    	//手动创建树
    	//组织创建树时额外的参数
    	var op = param.otherParam;
    	var opIndex = op.length;
    	op[opIndex] = "_sysCode";
    	op[opIndex+1] = CORE.syscode;
        //创建树
	    ${property("tree_id")} = new ZTree("${property("tree_id")}", "${property("datasource")}",
	    	{
	    		async:<#if property("async")?? && property("async") != "true">false<#else>true</#if>,
	    		multi:<#if property("multi")?? && property("multi") != "true">false<#else>true</#if>,
	    		nodeClicked:${property("tree_id")}_select,
	    		otherParam:op,
	    		loadComplete:${property("tree_id")}_complete    		
	    		<#if property("checkType")?? && property("checkType") != "">,checkable:true,checkType:${property("checkType")}</#if> 
	    	});    
    },
    buildTreePanel:function(param){
    	//创建一个含选择树的对话框
		//组织参数
		
		if(param.otherParam == undefined)
			param.otherParam = [];
		
    	var op = param.otherParam;
    	var opIndex = op.length;
    	op[opIndex] = "_sysCode";
    	op[opIndex+1] = CORE.syscode;
		
    	var panel_options = {    		
    		async:<#if property("async")?? && property("async") != "true">false<#else>true</#if>,
    		multi:<#if property("multi")?? && property("multi") != "true">false<#else>true</#if>,
    		nodeClicked:${property("tree_id")}_select,
    		otherParam:param.otherParam,
    		loadComplete:${property("tree_id")}_complete
    		<#if property("checkType")?? && property("checkType") != "">,checkable:true,checkType:${property("checkType")}</#if>
    	};
		//是否重新创建树
    	if(param.reload != undefined && param.reload == true){
    		panel_options.reload = true;
    	}
    	
		//确定按钮事件
    	if(param.select != undefined){
    		panel_options.select = param.select;
    	}
		
		//弹出树选择框
    	${property("tree_id")} = buildSelectTree("${property("datasource")}","${property("tree_id")}",panel_options);
    },
    getTreeObj:function(){
    	//获取生成的ztree对象
    	return ${property("tree_id")}; 
    },
    getSelectNodes:function(checked){
    	//返回选中的ztree对象数组
    	if(checked == undefined || checked == "")
    		checked = true;
    	var ztree_nodes_arr_ = ${property("tree_id")}.getCheckedNodes(checked);
    	var arr_ = [];
    	for(var index = 0;index<ztree_nodes_arr_.length;index++)
    	{
    		arr_[index] = ztree_nodes_arr_[index].id;
    	}
    	return arr_;
    },
    getSelectZTreeNodes:function(checked){
    	//返回选中的ztree对象数组
    	if(checked == undefined || checked == "")
    		checked = true;
    	return ${property("tree_id")}.getCheckedNodes(checked);
    }
};
</script>