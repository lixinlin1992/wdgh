
/**
 *
 * User: kinz
 * Date: 11-4-17
 * Time: 上午12:51
 *
 * 系统功能维护脚本文件
 */

var funcGridParams = {
    colNames:["编号","模块","名称","功能码","类型","授权规则","依赖功能","备注","操作"],
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
            width:120
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
            width:80,
            formatter:function(cell, options, row) {
                return (cell == 0 ? "无需授权" : (cell == 1 ? "普通授权" : "依赖授权"));
            }
        },
        {
            name:"依赖功能",
            index:"depend_func_name",
            width:80
        },
        {
            name:"备注",
            index:"note",
            width:100
        },
        {
            name:"操作",
            index:"",
            width:120,
            sortable:false,
            formatter:function(cell, options, row) {
                return "<input type='button' value='修改' onclick='editFunction(" + row[0] + ");'>" +
                        "&nbsp;&nbsp;<input type='button' value='删除' onclick='delFunction(" + row[0] + ",\"" + row[2] +
                        "\")'>" +
                        "&nbsp;&nbsp;<input type='button' value='菜单' onclick='assignMenu(" + row[0] + ");'>" +
                        "&nbsp;&nbsp;<input type='button' value='数据源' onclick='manageDataSource(" + row[0] + ");'> ";
            }
        }
    ],
    caption : "系统功能列表",
    multiselect:false,
    width:"820",
    pager: "#pagerdt"
};

var moduleTree = null;//模块树
var moduleTree4Select_f = null;//添加功能时选择所属模块的树
var moduleTree4Select_m = null;//添加模块时选择上级模块的树
var funcTree4Select = null;//依赖功能选择树
var menuTree4Select = null;//菜单分配选择树
//初始化函数
$(function() {
    //创建系统功能表格
    GRID.create("#funcList", "DS_F_FUNCTION_LIST", funcGridParams, "QueryForm");

    //装载模块树
    moduleTree = new ZTree("MODULE_TREE", "DS_MODULE_FUNCTION_TREE",
            {nodeClicked:queryModuleSelect});

    //初始化导出按钮事件
    $("#jxl_expt").click(function() {
        CORE.goToDS('DS_F_FUNCTION_LIST', 'result=excel&engine=pio&fileName=Functions.xls', 'QueryForm');
    });


    COMMON.autocomplete({
                inputName : "dsName",
                datasource : "DS_DATASOURCE",
                multi : false,
                min : 1,
                select : function(event, ui) {
                    this.value = ui.item.label;
                    $("#_DataSource_Id").val(ui.item.value);
                }
            });
});

function queryModuleSelect(event, treeId, treeNode) {
    if (treeNode == null || treeNode == undefined) {
        $("#Q_module_id").val("");
        $("#Q_module_name").val("");
    } else {
        $("#Q_module_id").val(treeNode.id);
        $("#Q_module_name").val(treeNode.name);
    }

    //刷新表格
    GRID.reload("funcList");
}

//编辑功能对话框选项
var funcEditDlgOpts = {
    title : "编辑功能",
    width : "400",
    height : "400" ,
    modal : true,
    bgiframe : true,
    resizable:false
};

//编辑功模块对话框选项
var moduleEditDlgOpts = {
    title : "编辑模块",
    width : "400",
    height : "300" ,
    modal : true,
    bgiframe : true,
    resizable:false
};

//添加系统功能
function addFunction() {
    document.EditForm.reset();

    $("#module_id").val($("#Q_module_id").val());
    $("#module_name").val($("#Q_module_name").val());
    CORE.loadRules("EditForm", "SYS_P_FUNCTION", false, function() {
        var form = document.EditForm;
        form.module_sel_btn.disabled = "";
        $("#id").attr("readonly", "");
        funcEditDlgOpts.title = "添加新功能";
        funcEditDlgOpts.buttons = {
            '取消':function() {
                $("#Func_Edit_Dlg").dialog("close");
            } ,
            '确定':function() {
                CORE.submitForm("DS_FUNCTION_ADD", "EditForm", {}, function(data) {
                    if (data > 0) {
                        $("#Func_Edit_Dlg").dialog("close");
                        var id = $("#module_id").val();
                        //刷新相关的树节点
                        if (moduleTree != null)
                            moduleTree.refreshNode(id);
                        if (moduleTree4Select_f != null)
                            moduleTree4Select_f.refreshNode(id);
                        if (funcTree4Select != null)
                            funcTree4Select.refreshNode(id);
                        GRID.reload("funcList");
                    } else {
                        CORE.error("添加功能失败");
                    }
                });
            }
        };
        $("#Func_Edit_Dlg").dialog(funcEditDlgOpts)
    });
}

//选择模块
function selectModule() {
    if (moduleTree4Select_f == null)
        moduleTree4Select_f = selectModuleOrFunction("module_1",
                {select:moduleSelected});
    else
        selectModuleOrFunction("module_1",
                {select:moduleSelected});

    //设置当前选中的模块
    moduleTree4Select_f.selectNode($("#Q_module_id").val());
}

function moduleSelected(treeNode) {
    if (treeNode.length == 0) {
        $("#module_id").val("");
        $("#module_name").val("");
    } else {
        if (treeNode.id == 1)
            return false;
        $("#module_id").val(treeNode.id);
        $("#module_name").val(treeNode.name);
    }
    return true;
}

//选择依赖功能
function selectFunction() {
    if (funcTree4Select == null)
        funcTree4Select = selectModuleOrFunction("function_1",
                {select:functionSelected,otherParam:["loadFunction"]});
    else
        selectModuleOrFunction("function_1", {select:functionSelected,otherParam:["loadFunction"]});
}

//依赖功能选择回调函数
function functionSelected(treeNode) {
    if (treeNode.length == 0) {
        $("#depend_id").val("");
        $("#depend_name").val("");
    }
    if (treeNode.type == '0')
        return false;
    $("#depend_id").val(treeNode.id);
    $("#depend_name").val(treeNode.name);
    return true;
}


//修改功能入口函数
function editFunction(id) {
    CORE.loadForm("DS_FUNCTION_INFO", "EditForm",
            {data:"id=" + id,ruleId:"SYS_P_FUNCTION",loadComplete:function() {
                //修改不允许选择模块，以及编号
                var form = document.EditForm;
                form.module_sel_btn.disabled = "disabled";
                $("#id").attr("readonly", "readonly");
                //装载表单完成后，打开修改对话框
                funcEditDlgOpts.title = "修改功能";
                funcEditDlgOpts.buttons = {
                    '取消':function() {
                        $("#Func_Edit_Dlg").dialog("close");
                    } ,
                    '确定':function() {
                        CORE.submitForm("DS_FUNCTION_UPDATE", "EditForm", {}, function(data) {
                            if (data > 0) {
                                $("#Func_Edit_Dlg").dialog("close");
                                //刷新表格
                                GRID.reload("funcList");
                            } else {
                                CORE.error("修改功能失败");
                            }
                        });
                    }
                };
                $("#Func_Edit_Dlg").dialog(funcEditDlgOpts)
            }});
}

//删除功能入口函数
function delFunction(id, name) {
    CORE.confirm("确定要删除功能 [" + name + "] 吗？", function() {
        CORE.request("DS_FUNCTION_DEL", {data:"id=" + id}, function(data) {
            //删除后刷新表格
            GRID.reload("funcList");
        });
    }, function() {
    });
}

//添加模块功能入口函数
function addModule() {
    var _moduleForm = document.ModuleEditForm;
    _moduleForm.reset();
    //将当前选中的模块作为默认的上级模块
    var current_selectedNode = moduleTree.getSelectedNode();
    _moduleForm.parent_id.value = current_selectedNode == null ? "0" : current_selectedNode.id;
    _moduleForm.parent_name.value = current_selectedNode == null ? "一级模块" : current_selectedNode.name;

    //装载校验规则
    CORE.loadRules("ModuleEditForm", "SYS_P_MODULE", false, function() {
        moduleEditDlgOpts.title = "添加新模块";
        moduleEditDlgOpts.buttons = {
            "取消":function() {
                $("#Module_Edit_Dlg").dialog("close");
            },
            "确定":function() {
                //提交到服务器
                CORE.submitForm("DS_MODULE_EDIT", "ModuleEditForm", {}, function(data) {
                    $("#Module_Edit_Dlg").dialog("close");
                    //如果没有上级模块就刷新整棵树
                    if (document.ModuleEditForm.parent_id.value == "")
                        moduleTree.refresh();
                    else
                        moduleTree.refreshNode(document.ModuleEditForm.parent_id.value);
                });
            }
        };
        $("#Module_Edit_Dlg").dialog(moduleEditDlgOpts);
    });
}

//修改模块功能入口函数
function editModule() {
    var current_selectedNode = moduleTree.getSelectedNode();
}

//删除模块功能入口函数
function delModule() {
    var current_selectedNode = moduleTree.getSelectedNode();
    if (current_selectedNode == null)
        return;
    CORE.confirm("确定要删除模块 [" + current_selectedNode.name + "] 吗？", function() {
        CORE.request("DS_MODULE_DEL", {data:"id=" + current_selectedNode.id}, function(data) {
            moduleTree.removeNode(current_selectedNode.id);
            if (moduleTree4Select_f != null)
                moduleTree4Select_f.removeNode(current_selectedNode.id);
        });
    });
}


//选择上级模块(添加模块)
function selectParentModule() {
    if (moduleTree4Select_m == null)
        moduleTree4Select_m = selectModuleOrFunction("module_2",
                {select:function(node) {
                    document.ModuleEditForm.parent_id.value = node == null ? "" : node.id;
                    document.ModuleEditForm.parent_name.value = node == null ? "" : node.name;
                    return true;
                }});
    else
        selectModuleOrFunction("module_2");
}


//为功能分配菜单
function assignMenu(id) {
    //弹出菜单树以供选择
    if (menuTree4Select == null) {
        menuTree4Select = selectMenu("menu_1", {
                    select:function(node) {
                        if (node == null || node.length == 0)
                            return true;
                        //只能给三级菜单分配功能
                        if (parseInt(node.level_id) != 3) {
                            return false;
                        }
                        //如果该菜单已经分配了该功能，不处理
                        if (parseInt(node.function_id) == id) {
                            return true;
                        }
                        //如果菜单已经分配给其它功能，则不能分配
                        if (node.function_id != "" && parseInt(node.function_id) != id) {
                            CORE.info("该菜单已经分配给其它功能，不能再次分配");
                            return false;
                        }
                        CORE.request("DS_FUNCTION_MENU_ASSIGN", {data:"menu_id=" + node.id + "&function_id=" + id},
                                function(data) {
                                });
                        return true;
                    }
                });
    } else {
        selectMenu("menu_1");
    }
}

var funcDsDlgOpt = {
    title : "数据源管理",
    width : "600",
    height : "300" ,
    modal : true,
    bgiframe : true,
    resizable:false,
    buttons:{
        "关闭":function() {
            $("#Func_DataSource_List").dialog("close");
        }
    }
};

var _dsGrid = null;
var _dsGridParam = {
    colNames:["数据源","描述","主要","操作"],
    colModel:[
        {
            name:"数据源",
            index:"datasource_id",
            width:100
        },
        {
            name:"数据源",
            index:"datasource_note",
            width:150
        },
        {
            name:"主要",
            index:"main_flag",
            width:40,
            formatter:function(cell,options,row,tr,td){
                return cell==0?"否":"是";
            }
        },
        {
            name:"操作",
            index:"",
            width:100,
            sortable:false,
            formatter:function(cell, options, row, tr, td) {
                return "<input type='button' class='grid_button' value='删除' onclick='deleteDataSource(\"" + row[0] +
                        "\")'>";
            }
        }
    ],
    caption : "数据源列表",
    multiselect:false,
    width:"96%"
};

//管理功能用到的数据源
function manageDataSource(id) {
    $("#Func_DataSource_List").dialog(funcDsDlgOpt);
    document.FuncDataSourceForm.function_id.value = id;
    if (_dsGrid == null) {
        _dsGrid = GRID.create("#funcDataSourceList", "DS_FUNC_DATASOURCE_LIST", _dsGridParam, "FuncDataSourceForm");
    } else {
        GRID.reload("funcDataSourceList");
    }
}

//添加功能数据源
function addFuncDataSource() {
    if (_dsGrid == null)
        return;

    var _param = "function_id=" + document.FuncDataSourceForm.function_id.value + "&datasource_id=" +
            $("#_DataSource_Id").val() +
            "&datasource_note=" + $("#_DataSource_Note").val()+"&main_flag="+(document.getElementById("_Main_Flag_0").checked?0:1);
    CORE.request("DS_FUNC_DATASOURCE_ADD", {data:_param}, function(data) {
        $("#_DataSource_Id").val("");
        $("#_DataSource_Note").val("");
        GRID.reload("funcDataSourceList");
    });
}

//删除数据源
function deleteDataSource(datasource_id) {
    var _param = "function_id=" + document.FuncDataSourceForm.function_id.value + "&datasource_id=" + datasource_id;
    CORE.request("DS_FUNC_DATASOURCE_DEL", {data:_param}, function(data) {
        GRID.reload("funcDataSourceList");
    });
}