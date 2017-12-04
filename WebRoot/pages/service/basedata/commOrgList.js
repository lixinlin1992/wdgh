/**
 * User: kinz
 * Date: 11-4-21
 * Time: 下午6:34
 */

var gridParams = {
    colNames:["编号","名称","机构编码","级别","上级机构","附加数据","操作"],
    colModel:[
        {
            name:"编号",
            index:"id",
            width:60
        },
        {
            name:"名称",
            index:"name",
            width:80
        },
        {
            name:"机构编码",
            index:"code",
            width:80
        },
        {
            name:"级别",
            index:"node_level",
            width:120,
            formatter:function(cell, options, row) {
                return (cell == 1 ? "根节点" : (cell == 2 ? "节点" : "叶节点"));
            }
        },
        {
            name:"上级机构",
            index:"parent_name",
            width:80
        },
        {
            name:"附加数据",
            index:"ext_data",
            width:80
        },
        {
            name:"操作",
            index:"",
            width:70,
            sortable:false,
            formatter:function(cell, options, row) {
                return "<input type='button' class='grid_button' value='修改' onclick='edit_commorg(" + row[0] +
                        ")'>" +
                        "&nbsp;&nbsp;" +
                        "<input type='button' class='grid_button' value='删除' onclick='deleteOrg(" + row[0] +
                        ",\"" + row[1] + "\");'>";
            }
        }
    ],
    caption : "组织机构列表",
    multiselect:false,
    width:950,
    pager: "#pagerdt"
};

var orgTree = null;//模块树
var orgTree4Select = null;//机构选择树
//初始化函数
$(function() {
    //创建表格
    GRID.create("#listGrid", "DS_COMMORG_LIST", gridParams, "QueryForm");

    //装载树
    orgTree = new ZTree("COMMORG_TREE", "DS_COMMORG_TREE", {otherParam:[],nodeClicked:queryOrgSelect});
});

//点击机构树的时候刷新右边的列表
function queryOrgSelect(event, treeId, treeNode) {
    if (treeNode == null || treeNode == undefined) {
        $("#Q_parent_id").val("");
        $("#Q_parent_name").val("");
    } else {
        $("#Q_parent_id").val(treeNode.id);
        $("#Q_parent_name").val(treeNode.name);

        //设置当前选中的模块
        if (orgTree4Select != null)
            orgTree4Select.selectNode($("#Q_parent_id").val());
    }

    //刷新表格
    GRID.reload("listGrid");
}

//编辑对话框选项
var EditDlgOpts = {
    title : "创建机构",
    width : "430px",
    height : "290" ,
    modal : true,
    bgiframe : true,
    resizable:false
};

//添加机构
function add_commorg() {
    document.EditForm.reset();

    //设置当前选中的节点作为上级节点
    document.EditForm.parent_id.value = $("#Q_parent_id").val();
    document.EditForm.parent_name.value = $("#Q_parent_name").val();

    CORE.loadRules("EditForm", "SYS_BI_COMMORG", false, function() {
        $("#OrgSelectBtn").removeAttr("disabled");
        EditDlgOpts.title = "添加新机构";
        EditDlgOpts.buttons = {
            '取消':function() {
                $("#dialog_edit").dialog("close");
            },
            '确定':function() {
                CORE.submitForm("DS_COMMORG_EDIT", "EditForm", {}, function(data) {
                    if (data.result1 > 0) {
                        $("#dialog_edit").dialog("close");
                        //添加成功后，刷新列表，刷新树结构
                        GRID.reload("listGrid");
                        var id = document.EditForm.parent_id.value;
                        //刷新相关的树节点
                        if (orgTree != null)
                            orgTree.refreshNode(id);
                        if (orgTree4Select != null)
                            orgTree4Select.refreshNode(id);
                    } else {
                        CORE.error("添加机构失败");
                    }
                });
            }
        };
        $("#dialog_edit").dialog(EditDlgOpts)
    });
}

//修改机构
function edit_commorg(id) {
    //装载表单
    CORE.loadForm("DS_COMMORG_INFO", "EditForm",
    {data:"id=" + id,rule:"R_SYS_BI_COMMORG",loadComplete:function() {
        var form = document.EditForm;
        $("#OrgSelectBtn").attr("disabled", "disabled");
        EditDlgOpts.title = "修改机构";
        EditDlgOpts.buttons = {
            '取消':function() {
                $("#dialog_edit").dialog("close");
            },
            '确定':function() {
                CORE.submitForm("DS_COMMORG_EDIT", "EditForm", {}, function(data) {
                    if (data[0] >= 0) {
                        $("#dialog_edit").dialog("close");
                        //添加成功后，刷新列表，刷新树结构
                        GRID.reload("listGrid");
                        var id = document.EditForm.parent_id.value;
                        //刷新相关的树节点
                        if (orgTree != null)
                            orgTree.refreshNode(id);
                        if (orgTree4Select != null)
                            orgTree4Select.refreshNode(id);
                    } else {
                        CORE.error("修改机构失败");
                    }
                });
            }
        };
        $("#dialog_edit").dialog(EditDlgOpts);
    }});
}

var orgTree4Select = null;//机构选择树
//选择上级机构
function selectOrg() {
    if (orgTree4Select == null)
        orgTree4Select = selectCommOrg("commOrg_1", {select:parentOrgSelected});
    else
        selectCommOrg("commOrg_1", {select:parentOrgSelected});
}

//机构选中回调函数
function parentOrgSelected(treeNode) {
    if (treeNode.length == 0) {
        $("#parent_id").val("");
        $("#parent_name").val("");
    } else {
        $("#parent_id").val(treeNode.id);
        $("#parent_name").val(treeNode.name);
    }
    return true;
}

//删除组织机构
function deleteOrg(id, name) {
    CORE.confirm("确定要删除机构 [" + name + "] 吗？", function() {
        CORE.request("DS_COMMORG_DEL", {data:"id=" + id}, function(data) {
            if (data > 0) {
                //删除成功后，刷新列表，刷新树结构
                GRID.reload("listGrid");
                orgTree.removeNode(id);
                if (orgTree4Select != null)
                    orgTree4Select.removeNode(id);
            }
        });
    }, function() {
    });
}