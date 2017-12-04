var $_treeObjs = {};

/**
 * 构建一个zTree对象
 *
 * @param targetId 树容器的id，如DIV的ID
 * @param datasource 树的数据来源，与框架结合，传入数据源ID
 * @param options 树的参数，具体描述如下：
 *      async: 是否异步，true/false，不传入则采用true，该参数考虑去掉
 *      id: 获取节点数据时，必需的数据名称，不传入则直接使用 'id'
 *      otherParam: 在请求数据源时需要提交给数据源的其它参数，格式：[key,value,key1,value1]
 *      nodeClicked: 节点点击事件监听，如：function(event,treeId,treeNode){...}
 *      multi: 是否多选，不传入则表示单选
 *      loadComplete: 树装载完成后的回调方法
 */
var ZTree = function (targetId, datasource, options) {
    this.options = options;
    this.settings = {
        async:options['async'] || true,
        asyncUrl:"framework.do?ds=" + datasource, //获取节点数据的URL地址
        asyncParam:["id", "type"], //获取节点数据时，必须的数据名称，例如：id、name
        asyncParamOther:options["otherParam"], //其它参数 ( key, value 键值对格式)
        checkable:options["multi"],
        checkType:options["checkType"]||{"Y":"ps","N":"ps"},
        callback:{
            //树单击事件
            click:function (event, treeId, treeNode) {
                if ($_treeObjs[targetId].treeNodeClicked != undefined && $_treeObjs[targetId].treeNodeClicked != null &&
                        typeof($_treeObjs[targetId].treeNodeClicked) === 'function') {
                    $_treeObjs[targetId].treeNodeClicked(event, treeId, treeNode);
                }
                /*
                 if (options["nodeClicked"] == undefined)
                 return;
                 if (typeof options["nodeClicked"] === 'function')
                 options["nodeClicked"](event, treeId, treeNode);
                 */
            },
            asyncSuccess:function (event, treeId, msg) {
                if (typeof options["loadComplete"] === 'function')
                    options["loadComplete"]();
            },
            asyncError:function (event, treeId, XMLHttpRequest, textStatus, errorThrown) {
            }
        }
    };
    this.treeObj = $("#" + targetId).zTree(this.settings);
    this.treeNodeClicked = options["nodeClicked"];

    $_treeObjs[targetId] = this;
};

ZTree.prototype = {
    update:function (nodes) {
        alert(this.treeObj.getNodes().length);
        if (nodes.nodes != null) {
            var temp = nodes.nodes[0].body;
            temp = CORE.unescapeJson(temp);
            this.treeObj.addNodes(nodes, temp);
        } else {
            nodes = CORE.unescapeJson(nodes);
            this.treeObj.addNodes(null, nodes);
        }
    },
    /**
     * 刷新节点
     * @param id
     */
    refreshNode:function (id, type) {
        var node = this.getNodeById(id, type);
        this.treeObj.reAsyncChildNodes(node, "refresh");
        this.treeObj.selectNode(node);
    },
    /**
     * 刷新整棵树
     */
    refresh:function () {
        this.treeObj.refresh();
    },
    /**
     * 选中指定id的节点
     * @param id
     */
    selectNode:function (id, type) {
        var node = this.getNodeById(id, type);//this.treeObj.getNodeByParam("id", id);
        this.treeObj.selectNode(node);
    },
    /**
     * 将一个json数据添加到树中，可同时加入多个节点
     * @param parentNode 上级树节点
     * @param nodeData 要添加的数据
     */
    addNodes:function (parentNode, nodeDatas) {
        this.treeObj.addNodes(parentNode, nodeDatas);
    },
    /**
     * 删除指定id的节点
     * @param id
     */
    removeNode:function (id, type) {
        var node = this.getNodeById(id, type);
        this.treeObj.removeNode(node);
    },
    /**
     * 获取选中的节点数据
     */
    getSelectedNode:function () {
        return this.treeObj.getSelectedNode();
    },
    /**
     * 更新节点
     * @param node
     * @param checkType
     */
    updateNode:function (node, checkType) {
        this.treeObj.updateNode(node, checkType);
    },

    /**
     * 根据节点Id，更新或添加相关的数据
     * @param id 节点id
     * @param type 节点类型
     * @param datas 一个key-value格式数据
     */
    updateNodeData:function (id, type, datas) {
        if (datas == null || datas == undefined)
            return;
        var node = this.getNodeById(id, type);
        if (node == null || node == undefined)
            return;
        $.each(datas, function (i, n) {
            node[i] = n;
        });
        this.updateNode(node);
    },

    /**
     * 获取选中或者未选中的节点
     * @param checked
     */
    getCheckedNodes:function (checked) {
        return this.treeObj.getCheckedNodes(checked);
    },

    /**
     * 选中指定id和type的节点
     * @param id
     * @param type
     */
    checkNode:function (id, type) {
        var node = this.getNodeById(id, type);
        node["checked"] = true;
        this.updateNode(node, true);
    },

    /**
     * 选中/取消选中所有的节点
     * @param checked
     */
    checkAllNodes:function (checked) {
        this.treeObj.checkAllNodes(checked);
    },
    /**
     * 根据树节点id获取节点
     * @param id
     * @param type 类型
     */
    getNodeById:function (id, type) {
        if (type == undefined || type == null) {
            return this.treeObj.getNodeByParam("id", id);
        } else {
            var nodes = this.treeObj.getNodesByParam("id", id);
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].type == type) {
                    return nodes[i];
                }
            }
            return null;
        }
    },
    expandAll:function(sign){
    	if(sign == undefined)
    		sign = true;
    	this.treeObj.expandAll(sign);
    },
    /**
     * 展开值匹配的节点
     * @param name
     * @param id
     */
    expandNodeByAim:function(name,id){
    	var aimValue = name;
    	var searchType = "name";
    	if(id != undefined){
    		aimValue = id;
    		searchType = "id";
    	}
    	var _allNodes = this.treeObj.getNodes();
    	var expandChildNodeByAim = function(_treeObj,parent,value,type,deleteItem){
    		for(var i = 0;i<parent.nodes.length;i++)
    		{
	    		switch(type){
	    			case "name":
	    				if(parent.nodes[i].name.indexOf(value) >= 0){
	    					_treeObj.expandNode(parent.nodes[i],true,false);
	    					_treeObj.selectNode(parent.nodes[i]);	    					
	    				}else{					
							deleteItem = expandChildNodeByAim(_treeObj,parent.nodes[i],value,type,deleteItem);
							if(parent.nodes[i].nodes.length == 0){
								deleteItem[parent.nodes[i].id+"_"+parent.nodes[i].type] = parent.nodes[i].id;
								parent.nodes[i]._isDel = true;	
							}else{
								var canDel = true;
								for(var j = 0;j<parent.nodes[i].nodes.length;j++)
								{
									if(parent.nodes[i].nodes[j]._isDel == undefined)
									{
										canDel = false;
										break;
									}
								}
								if(canDel){
									deleteItem[parent.nodes[i].id+"_"+parent.nodes[i].type] = parent.nodes[i].id;
									parent.nodes[i]._isDel = true;	
								}
							} 
						}
	    				break;
	    			case "id":
	    				if(parent.nodes[i].id == value){
	    					_treeObj.expandNode(parent.nodes[i],true,false);
	    					_treeObj.selectNode(parent.nodes[i]);	 
	    				}else{
							deleteItem = expandChildNodeByAim(_treeObj,parent.nodes[i],value,type,deleteItem);
							if(parent.nodes[i].nodes.length == 0){
								deleteItem[parent.nodes[i].id+"_"+parent.nodes[i].type] = parent.nodes[i].id;
								parent.nodes[i]._isDel = true;	
							}else{
								var canDel = true;
								for(var j = 0;j<parent.nodes[i].nodes.length;j++)
								{
									if(parent.nodes[i].nodes[j]._isDel == undefined)
									{
										canDel = false;
										break;
									}
								}
								if(canDel){
									deleteItem[parent.nodes[i].id+"_"+parent.nodes[i].type] = parent.nodes[i].id;
									parent.nodes[i]._isDel = true;	
								}
							} 	
	    				}
	    				break;
	    		}
	    	}
	    	return deleteItem;    		
    	};
    	var deleteItem = [];
    	for(var _nodeKey in _allNodes)
    	{   	
    		switch(searchType){
    			case "name":
    				if(_allNodes[_nodeKey].name.indexOf(aimValue) >= 0){
    					this.treeObj.expandNode(_allNodes[_nodeKey],true,false);
    					this.treeObj.selectNode(_allNodes[_nodeKey]);	    	
    				}else{
						deleteItem = expandChildNodeByAim(this.treeObj,_allNodes[_nodeKey],aimValue,searchType,deleteItem);
					}
    				break;
    			case "id":
    				if(_allNodes[_nodeKey].id == aimValue){
    					this.treeObj.expandNode(_allNodes[_nodeKey],true,false);
    					this.treeObj.selectNode(_allNodes[_nodeKey]);	    
    				}else{
						deleteItem = expandChildNodeByAim(this.treeObj,_allNodes[_nodeKey],aimValue,searchType,deleteItem);
					}
    				break;
    		}
    	}
    	for(var deleKey in deleteItem)
    	{
    		var deleteParas = deleKey.split("_");
        	var nodes = this.treeObj.getNodesByParam("type", deleteParas[1]);
        	var node = null;
        	for(var deleteNodeIndex = 0;deleteNodeIndex<nodes.length;deleteNodeIndex++)
        	{
        		if(nodes[deleteNodeIndex].id == deleteItem[deleKey]){
        			node = nodes[deleteNodeIndex];
        			break;
        		}
        	}
        	this.treeObj.removeNode(node);
    	}
        this.treeObj.refresh();
    },
    /**
     * 重新加载数
     */
    rebuildTree:function(params,callback){
    	$("#" + this.targetId).empty();
    	var original_callback = this.settings.callback.asyncSuccess;
    	this.settings.callback.asyncSuccess = function(){
    		original_callback();
    		callback();
    	};
    	this.treeObj = $("#" + this.targetId).zTree(this.settings);
    	$_treeObjs[this.targetId] = this;
    	this.settings.callback.asyncSuccess = original_callback;
    }
};


var _tree_dlgOpts = {
    title:"请选择",
    width:"450px",
    height:"400",
    modal:true,
    bgiframe:true,
    resizable:false
};


/**
 * 构建一颗树以供选择使用，并弹出对话框
 * @param datasource
 * @param name
 * @param options
 * select : 选中后触发的事件
 * multi : 是否多选
 * rootId : 根节点ID
 * reload: 是否重新构建,true/false
 */
function buildSelectTree(datasource, name, options) {
    var id = "_select_tree_" + name;

    //判断是否重建
    if (options["reload"] != null && options["reload"])
        $("#" + id).remove();

    if (options["multi"] == undefined)
        options["multi"] = false;
    if (options["multi"]) {
        _tree_dlgOpts["buttons"] = {
            '取消':function () {
                $("#" + id).dialog("close");
            },
            '确定':function () {
                if (options["select"] != undefined &&
                        options["select"]($_treeObjs["_select_tree_" + name].treeObj.getCheckedNodes(true)))
                    $("#" + id).dialog("close");
            }
        };
        options["nodeClicked"] = function (event, treeId, treeNode) {
        };
    } else {
        _tree_dlgOpts["buttons"] = {
            '取消':function () {
                $("#" + id).dialog("close");
            },
            '清空':function () {
                $("#" + id).dialog("close");
                if (options["select"] != undefined && options["select"](options["multi"] ? [] : null))
                    $("#" + id).dialog("close");
            }
        };
        options["nodeClicked"] = function (event, treeId, treeNode) {
            if (!options["select"](treeNode))
                return;
            $("#" + id).dialog("close");
        };
    }
    if ($("#" + id).length > 0) {
        $("#" + id).dialog(_tree_dlgOpts);
        //var _newSettings = $_treeObjs["_select_tree_" + name].treeObj.getSetting();
        //_newSettings.callback["click"] = options["nodeClicked"];
        //$_treeObjs["_select_tree_" + name].treeObj.updateSetting(_newSettings);
        $_treeObjs["_select_tree_" + name].treeNodeClicked = options["nodeClicked"];
        return $_treeObjs["_select_tree_" + name];
    } else {
        $("body").append("<div id=\"_select_tree_" + name + "\"></div>");
        var treeDiv = $("#" + id);
        //$(id).css({border:1, "border-color":"black", width:400, height:400, display:"none"});
        treeDiv.attr("class", "tree");
        treeDiv.dialog(_tree_dlgOpts);

        return new ZTree("_select_tree_" + name, datasource, options);
    }
}