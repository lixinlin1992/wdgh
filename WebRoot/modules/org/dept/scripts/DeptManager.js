var serviceid;
var zTree1;
var setting;
var zNodes = [];


///修改组织机构
function modOrg() {

    /*if (serviceid == undefined) {
        CORE.tip("请先选中部门树中的一个节点再点击修改！");
        return;
    }*/

    if (rdcp.tree.getSelected("treeDemo") == null) {
        rdcp.tip("请先选中部门树中的一个节点再点击修改！");
        return;
    }

    // $("#_Parent_Select_Btn").attr("disabled","disabled");
    $("#_Parent_Select_Btn").attr("disabled",false);
    rdcp.form.load("editOrgForm", "!org/dept/~query/Q_DEPT_INFO", 'id=' + rdcp.tree.getSelected("treeDemo").id,function(){
        rdcp.dialog(dlgOpts_edit);
    });


  /*  CORE.loadForm("DS_DEPARTMENT_DETAIL", "editOrgForm", {ruleId : "editService",data:"id=" + serviceid,loadComplete:function(){
        $("#dialog_edit").dialog(dlgOpts_edit);
    }});
*/
}

var dlgOpts_edit = {
    title : "修改部门",
    id:"dialog_edit",
    width : "370",
    height : "370" ,
    modal : true,
    buttons :[
        {
            text: '确定',
            handler: function () {

                rdcp.form.submit("editOrgForm", {url: "!org/dept/~query/Q_DEPT_EDIT",
                    success: function(data) {

                        $("#dialog_edit").dialog("close");
                        load_dept_tree();
                        $.messager.alert('提示', '部门修改成功', 'info');
                    }
                });
            }
        },{
            text: '取消',
            handler: function () {
                $("#dialog_edit").dialog("close");
            }
        }
    ]
};

///增加组织结构
function addOrgMan() {
   /* CORE.loadRules("editOrgForm", "add_orgStrMan_validation", false, function() {
        document.editOrgForm.reset();
        $("#_Parent_Select_Btn").removeAttr("disabled");
        if (zTree1.getSelectedNode() != null) {
            $("#_Parent_Id").val(zTree1.getSelectedNode().id);
            $("#_Parent_Name").val(zTree1.getSelectedNode().name);
        }
        $("#dialog_edit").dialog(dlgOpts_add);
    });
*/
    document.editOrgForm.reset();
    $("#edit_id").val("");
    $("#_Parent_Select_Btn").removeAttr("disabled");
    if (rdcp.tree.getSelected("treeDemo") != null) {
        $("#_Parent_Id").val(rdcp.tree.getSelected("treeDemo").id);
        $("#_Parent_Name").val(rdcp.tree.getSelected("treeDemo").text);
    }
//    $("#dialog_edit").dialog(dlgOpts_add);
    rdcp.dialog(dlgOpts_add);
}

var dlgOpts_add = {
    title : "新增部门",
    id:"dialog_edit",
    width : "370px",
    height : "370" ,
    modal : true,
    buttons :[
        {
            text: '确定',
            handler: function () {
                rdcp.form.submit("editOrgForm", {url: "!org/dept/~query/Q_DEPT_EDIT",
                    success: function(data) {

                        $("#dialog_edit").dialog("close");
                        load_dept_tree();
                        $.messager.alert('提示', '部门已添加', 'info');
                    }
                });
            }
        },{
            text: '取消',
            handler: function () {
                $("#dialog_edit").dialog("close");
            }
        }
    ]
};

//加载部门树
function load_dept_tree(){
    rdcp.tree("treeDemo", "!org/dept/~query/Q_DEPT_TREE", {
        onClick: function (node) {

            $("#netQuery").find("input[type='text']").val("");
            $("#netQuery").find("select").val("");

//            var s = zTree1.treeObj.getNodeByTId(treeNode.tId).parent_id;

//            var s = rdcp.tree.selectNode("treeDemo",node["id"]).parent_id;

            $("#netQuery .DEPT_ID").val(node["id"]);
//            serviceid = s;
            rdcp.grid.reload("listnet");

//            $("#_Dept_Name").val( node["text"]);
//            $("#_Dept_Id").val( node["id"]);

            return true;

        }
    });
}


rdcp.ready(function () {
    $('#_Name').validatebox({
        required: true
    });
    $('#_Dept_Code').validatebox({
        required: true
    });
    $('#_Dept_Type').validatebox({
        required: true
    });
    $('#_Parent_Name').validatebox({
        required: true
    });
//    zTree1 = new ZTree("treeDemo", "DS_FRAMEWORK_SECURITY_DEPARTMENT", {"nodeClicked":zTreeOnClick});

    load_dept_tree();

//    GRID.create("#listnet", "DS_DEPARTMENT_USERS", params, "netQuery");
    rdcp.grid('listnet', '!org/dept/~query/Q_DEPARTMENT_USERS', "netQuery", params);

    $("#addOrg").attr("readonly", "readonly");
});

//////////展示相应的组织机构下的所有的联通用户
var params = {
    fitColumns: true,
    rownumbers:true,
    columns: [
        [
            {field: 'ACCOUNT', title: '登录账户', sortable: true, align: 'left', width: 100},
            {field: 'NAME', title: '姓名', sortable: true, align: 'left', width: 100},
            {field: 'MOBILE_PHONE', title: '手机号码', sortable: true, align: 'left', width: 100},
            {field: 'STATUS_ID', title: '用户状态', sortable: true, align: 'left', width: 100},
            {field: 'EMAIL', title: '电子邮件', sortable: true, align: 'left', width: 100},
            {field: 'DEPT_NAME', title: '部门', sortable: true, align: 'left', width: 100}
        ]
    ]
};



var updateInfoNetId;

//搜索
function seachDeartment() {
    $("#netQuery .DEPT_ID").val($("#nqPARENT_ID").val());
    rdcp.grid.reload("listnet");
}

//选择上级部门
function selectParentDept(){
   /* buildSelectTree("DS_FRAMEWORK_SECURITY_DEPARTMENT","_Select_Parent_Dept_Tree",{select:function(node){
        $("#_Parent_Id").val((node.id==undefined || node.length==0)?"":node.id);
        $("#_Parent_Name").val((node.id=undefined || node.length==0)?"":node.name);
        return true;
    }});*/

    rdcp.tree("parentTree", "!org/dept/~query/Q_DEPT_TREE", {
        onClick: function (node) {
            $("#_Parent_Id").val(node["id"]);
            $("#_Parent_Name").val(node["text"]);

            rdcp.dialog.close("parentOrg");

            return true;
        }
    });
    rdcp.dialog(dlgOpts_parent_tree);
}

var dlgOpts_parent_tree = {
    title : "选择",
    id:"parentOrg",
    width : "370",
    height : "330" ,
    modal : true
};

//选择部门负责人
function selectDeptMaster(){
    /*buildSelectTree("DS_FRAMEWORK_SECURITY_DEPARTMENT","_Select_Dept_Master_Tree",{otherParam:["loadUser","true"],select:function(node){
        if(node.id == undefined || node.length==0){
            $("#_Master_Id").val("");
            $("#_Master_Name").val("");
        }else{
            if(node.type == 1)
                return false;
            $("#_Master_Id").val(node.id);
            $("#_Master_Name").val(node.name);
        }
        return true;
    }});*/

    rdcp.tree("parentTree", "!org/dept/~query/Q_USER_DEPT_TREE", {
        onClick: function (node) {
            if(node.attributes.type_id=="3"){
                $("#_Master_Id").val(node["id"]);
                $("#_Master_Name").val(node["text"]);
                rdcp.dialog.close("parentOrg");
            }
            return true;
        }
    });
    rdcp.dialog(dlgOpts_parent_tree);
}


