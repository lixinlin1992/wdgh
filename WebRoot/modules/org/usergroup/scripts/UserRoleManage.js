var params = {
    sortName: 'CODE',
    sortOrder: 'ASC',
    idField: 'CODE',
    fitColumns: true,
    rownumbers:true,
    columns: [
        [
            {field: 'CODE', title: '编号', sortable: true, align: 'left', width: 120},
            {field: 'NAME', title: '名称', sortable: true, align: 'left', width: 120},
            {field: 'NOTE', title: '备注', sortable: true, align: 'left', width: 300},
            {field: 'opt', title: '操作', width: 100, align: 'center',
                formatter: function
                    (cellvalue,rowObject) {
                         var _html = "";
                        if (rowObject.TYPE_ID != 0) {
                            _html += create_btn({className:"btn_edit",onclick:"eidt('"+rowObject.CODE+"');",title:"修改角色"})+
                                create_btn({className:"btn_delete",onclick:"delUserGroup('"+rowObject.CODE+"');",title:"删除角色"});
                        }else{
                            _html+="--";
                        }

                        return _html;
                }
            }
        ]
    ]
};

//生成按钮
 function create_btn(opt) {
    return "<a href='" + (opt["url"] ? opt["url"] : "javascript:void(0);") + "' onclick=\"" +
        (opt["onclick"] ? opt["onclick"].replace("\"", "\\\"") : "") + "\" class=\"grid_btn " +
        (opt["className"] ? opt["className"] : "") + "\" title=\"" + (opt["title"] ? opt["title"] : "") + "\">" +
        (opt["label"] ? opt["label"] : "") + "</a>"
}


rdcp.ready(function () {
    $('#eidtCode').validatebox({
        required:true,
        validType: 'length[1,20]'
    });
    $('#eidtName').validatebox({
        required:true,
        validType: 'length[1,64]'
    });

//    GRID.create("#listdt", "DS_USER_GROUP_LIST", params, "userRoleForm");
    rdcp.grid('listdt', '!org/usergroup/~query/Q_USERGROUP_LIST', "userRoleForm", params);
    $("#add_role").click(function() {
//        CORE.loadRules("eidtRoleForm", "SYS_USERROLEMANAGE");
        document.eidtRoleForm.reset();
        $("#eidtCode").removeAttr("readonly");
        $("#_UpdateFlag").val("false");
//        $("#_eidtRoleDialog").show();
//        $("#_eidtRoleDialog").dialog(addRoleDialog);
        rdcp.dialog(addRoleDialog);

    });
});

var addRoleDialog = {
    title : "添加角色",
    id:"_eidtRoleDialog",
    width : "400",
    height : "250" ,
    modal : true,
    resizable: true,    // 能否调整大小
    buttons :
    [
        {
            text: '确定',
            handler: function () {
                var eidtCode = $("#eidtCode").val().trim();
                var eidtName=$("#eidtName").val().trim();
                if (eidtCode.length==0||eidtCode==null) {
                    $.messager.alert('提示', '请输入角色编号！', 'info');
                    return false;
                }else if(eidtName.length==0||eidtName==null){
                    $.messager.alert('提示', '请输入角色名称！', 'info');
                    return false;
                }
                rdcp.form.submit("eidtRoleForm", {url: "!org/usergroup/~query/Q_USERGROUP_EDIT",
                    success: function(data) {
                        document.eidtRoleForm.reset();
                        $("#_eidtRoleDialog").dialog("close");
                        $.messager.alert('提示', '角色已添加！', 'info');
                        rdcp.grid.reload("listdt");
                    }
                });
            }
        }, {
            text: '取消',
            handler: function () {
                $("#_eidtRoleDialog").dialog("close");
//            rdcp.dialog.close("_eidtRoleDialog");
            }
        }
    ]
};

function eidt(code) {
    rdcp.form.load("eidtRoleForm", "!org/usergroup/~query/Q_USERGROUP_INFO", 'code=' + code,function(){
        $("#eidtCode").attr("readonly", "readonly");
        $("#_UpdateFlag").val("true");

        rdcp.dialog(eidtRoleDialog);
    });

}

var eidtRoleDialog = {
    title : "修改角色",
    id:"_eidtRoleDialog",
    width : "400",
    height : "300" ,
    resizable: true,    // 能否调整大小
    modal : true,
    buttons : [
        {
            text: '修改',
            handler: function () {
                rdcp.form.submit("eidtRoleForm", {url: "!org/usergroup/~query/Q_USERGROUP_EDIT",
                    success: function(data) {
                        document.eidtRoleForm.reset();
                        $("#_eidtRoleDialog").dialog("close");
                        $.messager.alert('提示', '角色修改成功！', 'info');
                        rdcp.grid.reload("listdt");
                    }
                });
            }
        },
        {
            text: '返回',
            handler: function () {
                $("#_eidtRoleDialog").dialog("close");
            }
        }
    ]
};

function delUserGroup(code) {
   /* CORE.confirm("确定要删除角色吗？注意：角色删除后将不能恢复",function(){
        CORE.request("DS_USER_GROUP_DEL", {data:"code=" + code}, function(data) {
            CORE.tip("角色已经删除");
            GRID.reload('listdt');
        })});*/

    $.messager.confirm('确认操作', '确定要删除角色吗？注意：角色删除后将不能恢复', function (r) {
        if (r) {
            //rdcp.request = function(ds, params, callback, p)
            rdcp.request("!org/usergroup/~query/Q_USERGROUP_DEL", "code=" + code, function (data) {
                if (data.header.code == 0) {
                    $.messager.alert('提示', '角色已经删除', 'info');
                    rdcp.grid.reload("listdt");
                } else {
                    $.messager.alert('提示', '删除失败', 'error');
                }
            });
        }
    });
}

/*var _funcTree = null;
function setUserGroupFunc(user_group_code) {
    var roleDialog = {
        title : "功能授权",
        width : "400px",
        height : "400" ,
        buttons : {
            '返回':function() {
                $("#roleDialog").dialog("close");
            },
            '确定':function() {
                //获取功能树中选中的功能
                var _nodes = _funcTree.getCheckedNodes(true);
                var _param = "user_group_code=" + user_group_code;
                if (_nodes != null) {
                    for (var i = 0; i < _nodes.length; i++) {
                        //alert(_nodes[i].type+"  "+_nodes[i].name);
                        if (_nodes[i].type == 1)
                            _param += "&function_id=" + _nodes[i].id;
                    }
                }
                //alert(_param);
                CORE.request("DS_USER_GROUP_FUNCTION_SET", {data:_param}, function(data) {
                    $("#roleDialog").dialog("close");
                });
            }

        }
    }

    if (_funcTree == null) {
       _funcTree = new ZTree("roleTree", "DS_MODULE_FUNCTION_TREE",
            {otherParam:["loadFunction","true","access_rule","1"],multi:true,loadComplete:function() {
                _funcTree.checkAllNodes(false);
                CORE.request("DS_USER_GROUP_FUNCTION", {data:"user_group_code=" + user_group_code},
                    function(data) {
                        for (var i = 0; i < data.length; i++) {
                            var _n = _funcTree.getNodeById(data[i], 1);
                            if (_n == null)
                                continue;
                            _n.checked = true;
                            _funcTree.updateNode(_n, true);
                        }
                        $("#roleDialog").dialog(roleDialog);
                    });
            }});
    } else {
        _funcTree.checkAllNodes(false);
        CORE.request("DS_USER_GROUP_FUNCTION", {data:"user_group_code=" + user_group_code}, function(data) {
            for (var i = 0; i < data.length; i++) {
                var _n = _funcTree.getNodeById(data[i]);
                if (_n == null)
                    continue;
                _n.checked = true;
                _funcTree.updateNode(_n, true);
            }
            $("#roleDialog").dialog(roleDialog);
        });
    }
    //$("#roleDialog").dialog(roleDialog);
    //var zTree = new ZTree("roleTree", "DS_USERGROUP_ACCESS_TREE", {"multi":true});
}*/
