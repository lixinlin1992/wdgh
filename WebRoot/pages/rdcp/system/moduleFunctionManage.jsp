<%--
File: moduleFunctionManage.jsp
User: kinz
Date: 11-9-9 下午3:45


--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <jsp:include page="/pages/framework/base.jsp"/>
    <title>模块功能管理</title>
	<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
	<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>    
    <script type="text/javascript" src="scripts/common/ztree.help.js"></script>
    <script type="text/javascript" src="scripts/service/module.help.js"></script>
    <script type="text/javascript" src="scripts/service/function.help.js"></script>
</head>
<script>


var funcGridParams = {
    colModel:[
        {
            name:"编号",
            index:"id",
            width:50
        },
        {
            name:"模块",
            index:"module_name",
            width:70
        },
        {
            name:"名称",
            index:"name",
            width:70
        },
        {
            name:"功能码",
            index:"code",
            width:100
        },
        {
            name:"类型",
            index:"type",
            width:60,
            formatter:function(cell, options, row) {
                return (cell == 0 ? "普通" : "菜单");
            }
        },
        {
            name:"授权规则",
            index:"access_rule",
            width:60,
            formatter:function(cell, options, row) {
                return (cell == 0 ? "无需授权" : (cell == 1 ? "普通授权" : "依赖授权"));
            }
        },
        {
            name:"依赖功能",
            index:"depend_name",
            width:80
        },
        {
            name:"业务系统",
            index:"sys_name",
            width:100
        },
        {
            name:"操作",
            index:"",
            width:60,
            sortable:false,
            formatter:function(cell, options, row) {
                return GRID.button({className:"btn_edit",onclick:"editFunction("+row["id"]+");",title:"编辑功能"})+
                        GRID.button({className:"btn_delete",onclick:"deleteFunction("+row["id"]+",'"+row["name"]+"');",title:"删除该功能"})+
                        GRID.button({className:"btn_menu",onclick:"assignMenu("+row["id"]+");",title:"设置映射菜单"});
                /*
                return "<input type='button' value='修改' class='grid_button' onclick='editFunction(" + row["id"] +
                        ");'>" +
                        "&nbsp;<input type='button' value='删除' class='grid_button' onclick='deleteFunction(" +
                        row["id"] + ",\"" +
                        row["name"] +
                        "\")'>" +
                        "&nbsp;<input type='button' value='菜单' class='grid_button' onclick='assignMenu(" + row[0] +
                        ");'>";
                        */
            }
        }
    ],
    caption : "系统功能列表",
    multiselect:true,
    width:"860",
    pager: "#pagerdt"
};

var _ModuleTree = null;
var _ModuleSelectTree = null;
$(function() {
    //初始化模块树
    _ModuleTree = new ZTree("MODULE_TREE", "DS_RDCP_MODULE_TREE", {nodeClicked:function(event, treeId, node) {
        //树点击的时候，刷新功能列表
        if (node["type"] == 0) {
            if (document.QueryForm.sys_code.value == node["id"] && document.QueryForm.module_id.value == "")
                return;

            document.QueryForm.sys_code.value = node["id"];
            document.QueryForm.module_id.value = "";
            document.QueryForm.module_name.value = "";
        } else if (node["type"] == 1) {
            document.QueryForm.sys_code.value = node["sys_code"];
            document.QueryForm.module_name.value = node["name"];
            document.QueryForm.module_id.value = node["id"];
        }

        GRID.reload('funcList');
    }});
    CORE.loadSelect("Q_sys_code", "DS_SYSTEM_SELECT_LIST",
            {loadComplete:function() {
                //创建系统功能表格
                GRID.create("#funcList", "DS_RDCP_FUNCTION_LIST", funcGridParams, "QueryForm");
            }});
});


var moduleEdtDlgOpt = {
    title : "添加/修改模块",
    width : "350",
    height : "300" ,
    modal : true,
    bgiframe : true,
    resizeable:false,
    buttons:{
        "取消":function() {
            $("#Module_Edit_Dlg").dialog("close");
        }
    }
};

/**
 * 选择模块
 * @param idField 要写入module_id的input
 * @param nameField
 */
function selectModule_(syscodeField, idField, nameField, sysSelectable, callback) {
    _ModuleSelectTree = selectModule(function(node) {
        if (node == null) {
            syscodeField.value = '';
            idField.value = '0';
            nameField.value = '无';
        } else if (node.type == '0') {
            syscodeField.value = node.sys_code;
            idField.value = '0';
            nameField.value = node.name;
        } else {
            syscodeField.value = node.sys_code;
            idField.value = node.id;
            nameField.value = node.name;
        }
        if (typeof callback === 'function')
            callback();
    }, "", sysSelectable);
}

/**
 * 添加模块
 */
function addModule() {
    document.ModuleEditForm.reset();
    $("#I_module_sel_btn").show();
    moduleEdtDlgOpt["title"] = "添加模块";
    moduleEdtDlgOpt["buttons"]["确定"] = function() {
        CORE.submitForm("DS_RDCP_MODULE_EDIT", "ModuleEditForm", {}, function(data) {
            $("#Module_Edit_Dlg").dialog("close");
            CORE.tip("模块已经添加");
            var _parent_node = null;
            //如果提交成功，上级节点刷新
            if (document.ModuleEditForm.parent_id.value == '0') {
                _parent_node = _ModuleTree.getNodeById(document.ModuleEditForm.sys_code.value, '0');
            } else {
                _parent_node = _ModuleTree.getNodeById(document.ModuleEditForm.parent_id.value, '1');
            }
            if (_parent_node != null && _parent_node != undefined) {
                if (_parent_node["isParent"] != "true") {
                    _parent_node["isParent"] = true;
                    _ModuleTree.updateNode(_parent_node);
                }
                _ModuleTree.refreshNode(_parent_node.id, _parent_node.type);
            }
            //选择树也要更新，刷新整个业务系统的节点
            if (_ModuleSelectTree != null) {
                if (document.ModuleEditForm.parent_id.value == '0') {
                    _parent_node = _ModuleSelectTree.getNodeById(document.ModuleEditForm.sys_code.value, '0');
                } else {
                    _parent_node = _ModuleSelectTree.getNodeById(document.ModuleEditForm.parent_id.value, '1');
                }
                if (_parent_node != null && _parent_node != undefined) {
                    if (_parent_node["isParent"] != "true") {
                        _parent_node["isParent"] = true;
                        _ModuleSelectTree.updateNode(_parent_node);
                    }
                    _ModuleSelectTree.refreshNode(_parent_node.id, _parent_node.type);
                }
            }
        });
    };

    CORE.loadRules("ModuleEditForm", "R_SYS_P_MODULE", true, function() {
        $("#Module_Edit_Dlg").dialog(moduleEdtDlgOpt);
    });
}

/**
 * 修改选中的模块
 */
function editModule() {
    var _node = _ModuleTree.getSelectedNode();
    if (_node == null || _node == undefined || _node.type != "1") {
        CORE.tip("请从左边的树中选择一个模块再点击编辑！");
        return;
    }

    $("#I_module_sel_btn").hide();
    document.ModuleEditForm.reset();
    moduleEdtDlgOpt["title"] = "修改模块";
    moduleEdtDlgOpt["buttons"]["确定"] = function() {
        CORE.submitForm("DS_RDCP_MODULE_EDIT", "ModuleEditForm", {}, function(data) {
            $("#Module_Edit_Dlg").dialog("close");
            //如果提交成功，更新节点数据
            _ModuleTree.updateNodeData(document.ModuleEditForm.id.value, "1",
                    {name:document.ModuleEditForm.name.value});

            if (_ModuleSelectTree != null) {
                _ModuleSelectTree.updateNodeData(document.ModuleEditForm.id.value, "1",
                        {name:document.ModuleEditForm.name.value});
            }
            CORE.tip("模块修改成功");
        });
    };

    CORE.loadForm("DS_RDCP_MODULE_INFO", "ModuleEditForm",
            {data:"id=" + _node.id,ruleId:"R_SYS_P_MODULE",loadComplete:function() {
                $("#Module_Edit_Dlg").dialog(moduleEdtDlgOpt);
            }});
}

/**
 * 删除选中的模块
 */
function deleteModule() {
    var _node = _ModuleTree.getSelectedNode();
    if (_node == null || _node == undefined || _node.type != "1") {
        CORE.tip("请从左边的树中选择一个模块再点击删除！");
        return;
    }
    CORE.confirm("确定要删除模块 [" + _node.name + "] 吗？注意：模块删除后不可恢复！", function() {
        CORE.request("DS_RDCP_MODULE_DELETE", {data:"id=" + _node.id}, function(data) {
            _ModuleTree.removeNode(_node.id, _node.type);
            if (_ModuleSelectTree != null) {
                _ModuleSelectTree.removeNode(_node.id, _node, type);
            }

            CORE.tip("模块已经删除");
        });
    });
}

</script>
<body>
<jsp:include page="/pages/navbar.jsp"/>
<div class="modules">
    <div class="barquery">
        <div class="barqueryleft"></div>
        <div class="barquerycenter">模块功能管理</div>
        <div class="barqueryright"></div>
        <div class="barquerybtn">
            <a class="btn_add" href="javascript:void(0);" onclick="addModule();" title="添加新的模块">添加模块</a>
            <a class="btn_edit" href="javascript:void(0);" onclick="editModule();" title="修改选中模块">修改模块</a>
            <a class="btn_delete" href="javascript:void(0);" onclick="deleteModule();" title="删除选中模块">删除模块</a>
            <a class="btn_add" href="javascript:void(0);" onclick="addFunction();" title="添加新的功能">添加功能</a>
            <a class="btn_delete" href="javascript:void(0);" onclick="deleteFunction();" title="删除所有选中的功能">删除功能</a>
            <!--
            <input name="btn_addition" class="btn_additionout" title="添加新的模块" value="模块" type="button"
                   onclick='addModule();'/>
            <input name="module_edit_btn" class="btn_editout" title="修改选中的模块" value="模块" type="button"
                   onclick="editModule();"/>
            <input name="module_del_btn" class="btn_deleteout" title="删除选中的模块" value="模块" type="button"
                   onclick="deleteModule();"/>
            <input name="btn_addition" class="btn_additionout" title="添加新的功能" value="功能" type="button"
                   onclick='addFunction();'/>
            <input name="func_del_btn" class="btn_deleteout" title="删除所有选中的功能" value="功能" type="button"
                   onclick='deleteFunction();'/>
                   -->
        </div>
    </div>
    <table width="100%">
        <tr>
            <td valign="top" style="height:100%;width:250px;">
                <div id="MODULE_TREE" class="tree" style="height:500px;overflow:auto;"></div>
            </td>
            <td valign="top">
                <form name="QueryForm"
                      onsubmit="GRID.reload('funcList');return false;">
                    <div class="barquerycontent" align="center">
                        <table class="content_List Wdate hasDatepicker">
                            <tr>
                                <td align="right" class="contenttd" style="width:80px">业务系统：</td>
                                <td align="left" style="width:140px">
                                    <select name="sys_code" id="Q_sys_code" onchange="GRID.reload('funcList');">
                                        <option value="">--请选择--</option>
                                    </select>
                                </td>
                                <td align="right" class="contenttd" style="width:80px">模块：</td>
                                <td align="left">
                                    <input type="hidden" name="module_id">
                                    <input type="text" name="module_name" class="textbox_css" readonly="readonly">
                                    <input type="button" class="btnfunctionout" value="撤销"
                                           onclick="document.QueryForm.module_id.value='';document.QueryForm.module_name.value='';GRID.reload('funcList');"/>
                                </td>
                                <td align="right" class="contenttd" style="width:100px">功能名称：</td>
                                <td align="left"><input type="text" name="func_name" class="textbox_css"/>
                                    <input class="btnquery_mouseout"
                                           onmouseover="this.className='btnquery_mouseover'"
                                           onmouseout="this.className='btnquery_mouseout'" type="submit" value=""/>
                                </td>
                            </tr>
                        </table>
                    </div>
                </form>
                <div>
                    <table id="funcList" style="margin: 0; padding: 0;"></table>
                    <div id="pagerdt" style="margin: 0; padding: 0;"></div>
                </div>
            </td>
        </tr>
    </table>
</div>

<div id="Module_Edit_Dlg" style="display:none;">
    <div class="modules" style="height:200px;width: 300px;">
        <form name="ModuleEditForm" onsubmit="return false;">
            <input name="id" type="text" style="display: none;"/>
            <input type="text" name="sys_code" style="display: none;"/>
            <table align="center">
                <tr class="formRow">
                    <td class="formLabel" width="90">
                        上级模块：
                    </td>
                    <td class="formField">
                        <input type="text" name="parent_id" value="0" style="display: none;"/>
                        <input type="text" name="parent_name" readonly="readonly"/>
                        <input type="button" name="menu_sel_btn" id="I_module_sel_btn" class="btnfunctionout" value="选择"
                               onclick="selectModule_(document.ModuleEditForm.sys_code,document.ModuleEditForm.parent_id,document.ModuleEditForm.parent_name,true);"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">模块名称：</td>
                    <td class="formField">
                        <input type="text" name="name" value=""/>
                    </td>
                </tr>
				<tr class="formRow">
					<td class="formLabel">是否有效:</td>
					<td class="formField">
						<label><input type="radio" name="status" value="0"/>无效</label>
						<label><input type="radio" name="status" value="1" checked/>有效</label>
					</td>
				</tr>
                <tr class="formRow">
                    <td class="formLabel">
                        备注：
                    </td>
                    <td class="formField">
                        <textarea rows="4" name="note" style="width:98%;"></textarea>
                    </td>
                </tr>
            </table>
        </form>
    </div>
</div>
<jsp:include page="functionInclude.jsp"/>
</body>
</html>