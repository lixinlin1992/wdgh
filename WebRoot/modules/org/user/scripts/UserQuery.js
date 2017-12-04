var params = {
    fitColumns: true,
    rownumbers:true,
    columns: [
        [
            {field: 'ACCOUNT', title: '工号', sortable: true, align: 'left', width: 120},
            {field: 'NAME', title: '名称', sortable: true, align: 'left', width: 120},
            {field: 'GROUP_NAME', title: '角色', sortable: true, align: 'left', width: 120},
            {field: 'MOBILE_PHONE', title: '手机号码', sortable: true, align: 'left', width: 120},
            {field: 'STATUS_ID', title: '状态', sortable: true, align: 'left', width: 120},
            {field: 'DEPT_NAME', title: '部门', sortable: true, align: 'left', width: 120},
            {field: 'opt', title: '操作', width: 100, align: 'center',
                formatter: function (cellvalue, rowObject) {
                    var _html = create_btn({className: "btn_view", onclick: "lookUser('" + rowObject.ID +
                            "')", title: "查看用户信息"});
                    if (rowObject.STATUS_ID == "有效") {
                        _html += create_btn({className: "btn_delete", onclick: "delUser('" + rowObject.ID +
                                "')", title: "注销用户"}) +
                                create_btn({className: "btn_edit", onclick: "editUserInfo('" + rowObject.ID +
                                        "')", title: "修改用户资料"}) +
                                create_btn({className: "btn_undo", onclick: "pswReset('" + rowObject.ID +
                                        "')", title: "重置用户登录密码"});
//                            create_btn({className:"btn_auth",onclick:"setUserFunction('"+cellvalue+"')",title:"用户功能授权"})+
//                            create_btn({className:"btn_auth",onclick:"getUserFunction('"+cellvalue+"')",title:"查看用户拥有的授权"})+
//                            create_btn({className:"btn_exclude",onclick:"setExcludeFunction('"+cellvalue+"')",title:"排除功能设置"});
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


function lookUser(obj) {
    editUserInfo(obj, false);
    //$(".ui-dialog-buttonpane").children(".ui-button").eq(1).remove();
}

/**
 * 加载用户类型具体查看sys_pa_code
 * @param type 指定用户类型，如果不指定则不会选中
 */
function loadUserTypeCombox(type) {
    rdcp.comboBox("userType", "!org/user/~query/Q_USER_TYPE_LOAD" + (type == "" ? "" : ("?code_num=" + type)),
            {autoSelectType: "remote", autoSelectItemIndex: "checked"});
}

function delUser(obj) {
    $.messager.confirm('确认操作', '确定要注销该用户吗？注意，该用户注销后将不能再登录以使用系统。', function (r) {
        if (r) {
            //rdcp.request = function(ds, params, callback, p)
            rdcp.request("!org/user/~query/Q_USER_DISABLE", "userid=" + obj, function (data) {
                if (data.header.code == 0) {
//                    rdcp.tip("用户已被注销");
                    $.messager.alert('提示', '用户已被注销！', 'info');
                    rdcp.grid.reload("listuser");
                } else {
                    $.messager.alert('提示', '操作失败！', 'error');
//                    rdcp.tip("操作失败");
                }
            });
        }
    });
}

/**
 * 验证表单
 * @returns {Boolean} 验证是否通过
 */
function validForm() {
    var isValid = $(this).form('validate');
    var userTypeValid = true;
    var userType = $("#userType").val();
    if (userType == -1) {
        userTypeValid = false;
        $.messager.alert('提示', '请选择类型', 'error');
    }
    return (isValid && userTypeValid);
}
var dlgOpts = {
    title: "修改用户信息",
    id: "dialog",
    width: "450",
    height: "480",
    parentwidth: true,
    modal: true,
    buttons: [
        {
            text: '确定',
            handler: function () {

                var right = document.getElementById("rightBox");
                for (var i = 0; i < right.options.length; i++) {
                    right.options[i].selected = true;
                }
                rdcp.form.submit("edituserform", {url: "!org/user/~query/Q_USER_UPDATE",
                    success: function (data) {
                        //data = eval('(' + data + ')');
                        if (data.header.code == 0) {
                            $("#dialog").dialog("close");
                            $.messager.alert('提示', '用户资料修改成功！', 'info');
                            rdcp.grid.reload("listuser");
                        } else {
                            $.messager.alert('提示', '用户资料修改失败！', 'error');
                        }
                    }, onSubmit: function () {
                        return validForm();
                    }
                });

            }
        },
        {
            text: '取消',
            handler: function () {
                $("#dialog").dialog("close");
            }
        }
    ]
};

var dlgOpts_show = {
    title: "用户信息",
    id: "dialog",
    width: "400",
    height: "480",
    parentwidth: true,
    modal: true,
    buttons: [
        {
            text: '取消',
            handler: function () {
                $("#dialog").dialog("close");
            }
        }
    ]
};

function editUserInfo(obj, edit) {
    $("#userId").val(obj);
    $("#pass").show();
    $("#password").attr("readonly", "readonly");
    $("#notice").hide();
    var dlgOpts_p;
    if (edit != undefined && !edit) {
        dlgOpts_p = dlgOpts_show;
    } else {
        dlgOpts_p = dlgOpts;
    }
    rdcp.request("!gh/manu/~query/Q_LOAD_DEPT_LIST",{},function(data) {
        var p = data.body.rows;
        for (var i = 0; i < data.body.rows.length; i++) {
            var html = "<option value='" + data.body.rows[i].ID+ "'>" + data.body.rows[i].NAME+ "</option>";
            $("#dept_id").append(html);
        }
    });
    rdcp.form.load("edituserform", "!org/user/~query/Q_USER_INFO", {id: obj}, function (data) {
        //$("#userType").combobox("select",data["TYPE_ID"]);
       // loadUserTypeCombox(data["body"]["type_id"]);//加载用户类型
        //左边的角色
        rdcp.request("!org/user/~query/Q_USER_EX_GROUP", 'id=' + obj, function (data) {
            if (data.header.code == 0) {
                $("#leftBox").empty();
                $.each(data.body.rows, function (entryIndex, entry) {
                    $("#leftBox").append("<option>" + entry.NAME + "</option>");
                });

                rdcp.request("!org/user/~query/Q_USER_IN_GROUP", 'id=' + obj, function (data) {
                    if (data.header.code == 0) {
                        $("#rightBox").empty();
                        $.each(data.body.rows, function (entryIndex, entry) {
                            $("#rightBox").append("<option>" + entry.NAME + "</option>");
                        });
                        rdcp.dialog(dlgOpts_p);
                    } else {
                        $.messager.alert('提示', '获取角色信息出现错误', 'error');
                    }
                });

            } else {
                $.messager.alert('提示', '获取角色信息出现错误', 'error');
            }
        });

    });

    document.getElementById("account").readOnly = true;
}

//由左移到右
function right() {
    var lbox = $("#leftBox option:selected");
    $(lbox).each(function () {
        $(lbox).remove();
        //alert($(lbox).val());
        $("#rightBox").append(lbox);
        //$("#rightBox").append("<input type='hidden' id='rightValues' name='rightValues' value='"+$(lbox).val()+"'\>");
    });
    $("#rightBox").attr("selectedIndex", -1);
    $("#rightBox").change();
}

//由右移到左
function left() {
    var rbox = $("#rightBox option:selected");
    $(rbox).each(function () {
        $(rbox).remove();
        //$("#rightValues").remove();
        //alert($(rbox).val());
        //$("input[value='"+$(rbox).val()+"']").remove();
        $("#leftBox").append(rbox);
    });
    $("#leftBox").attr("selectedIndex", -1);
    $("#rightBox").change();
}

//密码还原
function pswReset(obj) {
    $.messager.confirm('确认操作', '确定要重置密码到888888？', function (r) {
        if (r) {
            rdcp.request("!org/user/~query/Q_USER_RESETPWD", "id=" + obj, function (data) {
                if (data.header.code == 0) {
//                    rdcp.tip("用户已被注销");
                    $.messager.alert('提示', '该用户密码已经还原为初始密码：888888', 'info');
                    rdcp.grid.reload("listuser");
                } else {
                    $.messager.alert('提示', '操作失败！', 'error');
//                    rdcp.tip("操作失败");
                }
            });

        }
    });
}

var dlgOpts1 = {
    title: "添加用户信息",
    id: "dialog",
    width: "450",
    height: "470",
    modal: true,
    buttons: [
        {
            text: '确定',
            handler: function () {
                var ltText = $.trim($("#ltText").val());
                var area_id_ = $.trim($("#area_id_").val());
                var liangtong = 0;
                var fuwushang = 0;


                var right = document.getElementById("rightBox");
                for (var i = 0; i < right.options.length; i++) {
                    right.options[i].selected = true;
                }

                //rdcp.form.submit("edituserform", {url: "!org/user/~query/Q_USER_ADD" + "?password=888888",
                rdcp.form.submit("edituserform", {url: "!org/user/~query/Q_USER_ADD",
                    success: function (data) {
                        //data = eval('(' + data + ')');
                        if (data.header.code == 0) {
                            document.edituserform.reset();
                            $("#dialog").dialog("close");
                            $.messager.alert('提示', '用户已添加！', 'info');
                            rdcp.grid.reload("listuser");
                        } else {
                            $("#account").attr("value", "");
                            $.messager.alert('提示', '工号已存在，请重新输入！', 'error');
                        }
                    },
                    onSubmit: function () {
                        return validForm();
                    }
                });
            }
        },
        {
            text: '取消',
            handler: function () {
                $("#dialog").dialog("close");
            }
        }
    ]

};

function addUser() {

    document.edituserform.reset();
    $("#pass").hide();
//    $("input").attr("readonly", false);
    document.getElementById("account").readOnly = false;
    $("#notice").show();
    $("#leftBox").empty();
    $("#rightBox").empty();
    //loadUserTypeCombox("");
    //角色列表
    rdcp.request("!gh/manu/~query/Q_LOAD_DEPT_LIST",{},function(data) {
        var p = data.body.rows;
        for (var i = 0; i < data.body.rows.length; i++) {
            var html = "<option value='" + data.body.rows[i].ID+ "'>" + data.body.rows[i].NAME+ "</option>";
            $("#dept_id").append(html);
        }
    });
    rdcp.request("!org/user/~query/Q_USER_ALL_GROUP", "", function (data) {
        if (data.header.code == 0) {
            $.each(data.body.rows, function (entryIndex, entry) {
                $("#leftBox").append("<option>" + entry.NAME + "</option>");
            });
            rdcp.dialog(dlgOpts1);
        } else {
            $.messager.alert('提示', '获取角色信息出现错误', 'error');
        }
    });

    /*  CORE.request("DS_FRAMEWORK_SERVICE_SECURITY_USER_GROUP_NAMELIST", {data:'ftl=_ftl'}, function(data) {
     $.each(data, function(entryIndex, entry) {
     $("#leftBox").append("<option>" + entry['name'] + "</option>");
     });
     CORE.loadRules("edituserform", "SYS_P_USER");
     $("#dialog").dialog(dlgOpts1);
     });*/
}

rdcp.ready(function () {

    //初始化校验
    $.extend($.fn.validatebox.defaults.rules, {
        mobilePhone: {
            validator: function (value, param) {

                var result = value.match(/^1[3|4|5|8][0-9]\d{4,8}$/);
                if (result == null) return false;
                return true;
            },
            message: '请输入正确的手机号码'
        }
    });
    $('#account').validatebox({
        required: true
    });
    $('#name').validatebox({
        required: true
    });
    $('#mobile_phone').validatebox({
        required: false,
        validType: 'mobilePhone'
    });
    $('#email').validatebox({
        required: false,
        validType: 'email'
    });
    /*
     $('#_Dept_Name').validatebox({
     required: true
     });
     */

//    GRID.create("#listuser", "DS_USER_LIST", params, "userManager");
    rdcp.grid('listuser', '!org/user/~query/Q_USER_LIST', "userManager", params);
    $("#TYPE_ID2").change(function () {
        $("#add_type_id").remove();
        var optionValue = $("#TYPE_ID2").find("option:selected").attr("value");
        if (optionValue == "") {
            return;
        } else if (optionValue == 0) {
            $("#tr_type_id")
                    .after("<tr id='add_type_id'><td>联通:</td><td><input type='hidden' id='TYPE_ID' name='TYPE_ID' ><input type='text' readonly='readonly' id='ltText' name='ltText' size='26'><input type='button' value='选择' id='liantong_check' name='liantong_check' onclick='liantong()'></td></tr>");
        } else {
            $("#tr_type_id")
                    .after("<tr id='add_type_id'><td>服务商:</td><td><input type='hidden' id='TYPE_ID' name='TYPE_ID' ><input type='text' id='area_id_' readonly='readonly' name='area_id_' size='26'><input type='hidden' name='sInfoArea' id='sInfoArea' style='width:120px'><input type='button' value='选择' id='area_check' name='area_check' onclick='serviceF()'></td></tr>");
        }

    });
});

//选中用户所属的部门
function selectDept() {
    rdcp.tree("tree", "!org/dept/~query/Q_DEPT_TREE", {
        onClick: function (node) {

            $("#_Dept_Name").val(node["text"]);
            $("#_Dept_Id").val(node["id"]);

            rdcp.dialog.close("tree");
            return true;

        }
    });
    rdcp.dialog(dlgOpts_tree);
}

var dlgOpts_tree = {
    title: "选择部门",
    id: "tree",
    width: "450",
    height: "500",
    modal: true,
    scroll:"yes",

};

/**
 * 装载用户所有的功能授权信息
 * @Author 蒋杰龙
 * @param userId
 */
function loadAllUserFunction(userId, callback) {
    if (_funcTree == null) {
        return;
    }

    CORE.request("DS_LOAD_ALL_USER_FUNCTION", {data: "userId=" + userId}, function (data) {
        _funcTree.checkAllNodes(false);
        for (var i = 0; i < data.length; i++) {
            var _n = _funcTree.getNodeById(data[i], 1);
            if (_n == null)
                continue;
            _n.checked = true;
            _funcTree.updateNode(_n, true);
        }
        if (callback != undefined)
            callback();
    });
}

//查看授权
function getUserFunction(userId) {
    var _dlgOpt = {
        title: "查看用户授权",
        width: "450px",
        height: "400",
        modal: true,
        bgiframe: true,
        buttons: {
            '关闭': function () {
                $("#tree").dialog("close");
            }
        }
    };
    if (_funcTree == null) {
        loadFunctionTree(function () {
            loadAllUserFunction(userId, function () {
                $("#tree").dialog(_dlgOpt);
            });
        });
    } else {
        loadAllUserFunction(userId, function () {
            $("#tree").dialog(_dlgOpt);
        });
    }
}
