/**
 *
 * User: kinz
 * Date: 11-4-17
 * Time: 上午12:51
 *
 * 菜单管理相关的脚本
 */

/**
 * 菜单表格相关列表
 */
var menuGridParams = {
    colNames:["编号","名称","级别","排序","上级菜单","功能","备注","操作"],
    colModel:[
        {
            name:"编号",
            index:"m.id",
            width:50
        },
        {
            name:"名称",
            index:"m.name",
            width:80
        },
        {
            name:"级别",
            index:"m.level_id",
            width:80,
            formatter:function(cell, options, row) {
                return (cell == 1) ? "一级菜单" : (cell == 2 ? "二级菜单" : "三级菜单");
            }
        },
        {
            name:"排序",
            index:"m.order_id",
            width:60
        },
        {
            name:"上级菜单",
            index:"parent_name",
            width:80
        },
        {
            name:"功能",
            index:"function_name",
            width:80
        },
        {
            name:"备注",
            index:"m.note",
            width:100
        },
        {
            name:"操作",
            index:"",
            width:80,
            sortable:false,
            formatter:function(cell, options, row) {
                return "<input type='button' value='修改' class='grid_button' onclick='editMenu(" + row[0] + ");'>"
                        + "<input type='button' value='删除' class='grid_button' onclick='deleteMenu(" + row[0] + ",\"" +
                        row[1] + "\");'>";
            }
        }
    ],
    caption : "系统菜单列表",
    multiselect:false,
    width:"820",
    pager: "#pagerdt"
};

var menuTree = null;//菜单树
var menuTree4Select = null;//上级菜单选择树
var funcTree4Select = null;//功能选择树
//编辑对话框选项
var menuEditDlgOpts = {
    title : "编辑菜单",
    width : "400",
    height : "390" ,
    modal : true,
    bgiframe : true,
    resizable:false
};

//初始化函数
$(function() {
    //创建系统功能表格
    GRID.create("#menuList", "DS_MENU_LIST", menuGridParams, "QueryForm");

    //装载模块树
    menuTree = new ZTree("MENU_TREE", "DS_MENU_TREE", {nodeClicked:queryMenuSelect});
});


/**
 * 添加菜单功能入口
 */
function addMenu() {
    //重设表格
    var form = document.MenuEditForm;
    form.reset();
    form.parent_id.value = $("#Q_menu_id").val() || 0;
    form.parent_name.value = $("#Q_menu_name").val();
    form.level_id.value = parseInt($("#Q_parent_level_id").val()) + 1;
    form.id.value = "";

    form.level_name.value = (form.level_id.value == 1)?"一级菜单":(form.level_id.value == 2? "二级菜单":"三级菜单");
    form.func_sel_btn.disabled = form.level_id.value != 3;

    //装载校验规则
    CORE.loadRules("MenuEditForm", "SYS_P_MENU", false, function() {
        $("#I_menu_sel_btn").removeAttr("disabled");
        //规则装载完成后，显示对话框
        menuEditDlgOpts.title = "添加新菜单";
        menuEditDlgOpts.buttons = {
            "取消":function() {
                $("#Menu_Edit_Dlg").dialog("close");
            },
            "确定":function() {
                CORE.submitForm("DS_MENU_EDIT", "MenuEditForm", {}, function(data) {
                    GRID.reload("menuList");

                    $("#Menu_Edit_Dlg").dialog("close");

                    //刷新相关数据，重新装载树
                    if(menuTree != null){
                        if(parseInt(form.parent_id.value) > 0)
                            menuTree.refreshNode(parseInt(form.parent_id.value));
                        else
                            menuTree.refresh();
                    }
                    if(menuTree4Select != null){
                        if(parseInt(form.parent_id.value) > 0)
                            menuTree4Select.refreshNode(parseInt(form.parent_id.value));
                        else
                            menuTree4Select.refresh();
                    }
                });
            }
        };

        $("#Menu_Edit_Dlg").dialog(menuEditDlgOpts);
    });
}

/**
 * 修改菜单功能入口
 * @param id
 */
function editMenu(id) {
    CORE.loadForm("DS_MENU_INFO", "MenuEditForm", {data:"id="+id,ruleId:"SYS_P_MENU",loadComplete:function() {
        //修改时，上级菜单不允许修改
        $("#I_menu_sel_btn").removeAttr("disabled");

        //如果是三级菜单，允许设置功能
        if(parseInt(document.MenuEditForm.level_id) == 3)
            document.MenuEditForm.func_sel_btn.disabled = false;
        else
            document.MenuEditForm.func_sel_btn.disabled = true;

        menuEditDlgOpts.title = "修改菜单";
        menuEditDlgOpts.buttons = {
            "取消":function() {
                $("#Menu_Edit_Dlg").dialog("close");
            },
            "确定":function() {
                CORE.submitForm("DS_MENU_EDIT", "MenuEditForm", {}, function(data) {
                    GRID.reload("menuList");

                    $("#Menu_Edit_Dlg").dialog("close");
                });
            }
        };

        $("#Menu_Edit_Dlg").dialog(menuEditDlgOpts);
    }});
}

/**
 * 删除菜单功能入口
 * @param id
 * @param name
 */
function deleteMenu(id, name) {
    CORE.confirm("确定要删除菜单项 [" + name + "] 吗？", function() {
        CORE.request("DS_MENU_DEL", {data:"id=" + id}, function(data) {
            GRID.reload("menuList");
        });
    });
}

/**
 * 当菜单树节点选中状态发生变化时调用
 * @param event
 * @param treeId
 * @param node
 */
function queryMenuSelect(event, treeId, node) {
    if (node == null || node == undefined) {
        $("#Q_menu_id").val("");
        $("#Q_menu_name").val("");
        $("#Q_parent_level_id").val(0);
    } else {
        $("#Q_menu_id").val(node.id);
        $("#Q_menu_name").val(node.name);
        $("#Q_parent_level_id").val(node.level_id);
    }

    //刷新表格
    GRID.reload("menuList");
}

/**
 * 选择上级菜单
 */
function selectParentMenu() {
    if (menuTree4Select == null) {
        menuTree4Select = buildSelectTree("DS_MENU_TREE", "parent_tree", {select:function(node) {
            if (node == null || node == undefined || node.length == 0) {
                document.MenuEditForm.parent_id.value = 0;
                document.MenuEditForm.parent_name.value = "";
                document.MenuEditForm.level_id.value = 1;
                document.MenuEditForm.level_name.value = "一级菜单";
            } else {
                document.MenuEditForm.parent_id.value = node.id;
                document.MenuEditForm.parent_name.value = node.name;
                document.MenuEditForm.level_id.value = parseInt(node.level_id) + 1;
                document.MenuEditForm.level_name.value = (parseInt(node.level_id) == 1) ? "二级菜单" : "三级菜单";
            }

            if (document.MenuEditForm.level_id.value != 3) {
                document.MenuEditForm.function_id.value = "";
                document.MenuEditForm.function_name.value = "";
                document.MenuEditForm.func_sel_btn.disabled = true;
            } else {
                document.MenuEditForm.func_sel_btn.disabled = false;
            }
            return true;
        },otherParam:["level_id",1,"level_id",2]});
    } else {
        buildSelectTree("DS_MENU_TREE", "parent_tree");
    }
}

function selectFunction() {
    if (funcTree4Select == null) {
        funcTree4Select = buildSelectTree("DS_MODULE_FUNCTION_TREE", "func_1", {select:function(node) {
            if (node == null || node == undefined || node.length == 0) {
                document.MenuEditForm.function_id.value = "";
                document.MenuEditForm.function_name.value = "";
            } else {
                if(node.type != 1)
                    return false;
                document.MenuEditForm.function_id.value = node.id;
                document.MenuEditForm.function_name.value = node.name;
                if($.trim(document.MenuEditForm.name.value) == "")
                    document.MenuEditForm.name.value = node.name;
            }
            return true;
        },otherParam:["loadFunction"]});
    } else {
        buildSelectTree("DS_MODULE_FUNCTION_TREE", "func_1");
    }
}