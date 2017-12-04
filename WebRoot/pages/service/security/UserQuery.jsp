<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<title>用户管理</title>
<head>
<jsp:include page="/pages/framework/base.jsp"/>
<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>
<script type="text/javascript" src="scripts/common/ztree.help.js"></script>
<script type="text/javascript">
var params = {
    colModel : [
        {
            name : '工号',
            index : 'account',
            width : 50,
            align : "center"
        },
        {
            name : '名称',
            index : 'name',
            width : 50,
            align : "center"
        },
        {
            name : '角色',
            index : 'GROUP_NAME',
            align : "center",
            width : 150
        },
        {
            name : '手机号码',
            index : 'mobile_phone',
            width : 45,
            align : "center"
        },
        {
            name : '状态',
            index : 'status_id',
            align : "center",
            width : 25
        },
        {
            name:'部门',
            index:'dept_name',
            width:80,
            align:'center'
        },
        {
            name : '操作',
            align : "center",
            width : 70,
            sortable : false,
            formatter : opButtons,
            formatoptions : {}

        }
    ],
    caption : "用户列表",
    edit : true,
    multiselect:false,
    width:"98.5%"
    //	height:400
};
var dlgOpts = {
    title : "修改用户信息",
    width : "400px",
    height : "400" ,
    parentwidth : true,
    modal : true,
    buttons : {
        '取消':function() {
            $("#dialog").dialog("close");
        }
    }
};

function opButtons(cellvalue, options, rowObject) {
    var _html = GRID.button({className:"btn_view",onclick:"lookUser('"+cellvalue+"')",title:"查看用户信息"});
    if(rowObject["status_id"]=="有效"){
        _html += GRID.button({className:"btn_delete",onclick:"delUser('"+cellvalue+"')",title:"注销用户"})+
                GRID.button({className:"btn_edit",onclick:"editUserInfo('"+cellvalue+"')",title:"修改用户资料"})+
                GRID.button({className:"btn_restore",onclick:"pswReset('"+cellvalue+"')",title:"重置用户登录密码"})+
                GRID.button({className:"btn_auth",onclick:"setUserFunction('"+cellvalue+"')",title:"用户功能授权"})+
                GRID.button({className:"btn_auth",onclick:"getUserFunction('"+cellvalue+"')",title:"查看用户拥有的授权"})+
                GRID.button({className:"btn_exclude",onclick:"setExcludeFunction('"+cellvalue+"')",title:"排除功能设置"});
    }
    /*
    var _html = "<input class='grid_button' value='查看' type='button' onclick='lookUser(\"" + cellvalue + "\")'>";
    if (rowObject[4] == '有效') {
        _html += "&nbsp;&nbsp;<input class='grid_button' value='注销' type='button' onclick='delUser(\"" + cellvalue +
                "\")'/>" +
                "&nbsp;&nbsp;<input class='grid_button' value='修改' type='button' onclick='editUserInfo(\"" +
                cellvalue +
                "\")'/>" +
                "&nbsp;&nbsp;<input class='grid_buttont' value='还原密码' type='button' onclick='pswReset(\"" + cellvalue +
                "\")'/>" +
                "&nbsp;&nbsp;<input class='grid_buttont' value='功能授权' type='button' onclick='setUserFunction(\"" +
                cellvalue +
                "\");'/>" +
                "&nbsp;&nbsp;<input class='grid_buttont' value='查看授权' type='button' onclick='getUserFunction(\"" +
                cellvalue +
                "\")'/>" +
                "&nbsp;&nbsp;<input class='grid_button' value='排除功能' type='button' onclick='setExcludeFunction(\"" +
                cellvalue + "\");'>"
    }
    */
    return _html;
}

var _funcTree = null;
function setUserFunction(userId) {
    var _dlgOpt = {
        title : "功能授权",
        width : "450px",
        height : "400" ,
        modal : true,
        bgiframe : true,
        buttons : {
            '取消':function() {
                $("#tree").dialog("close");
            },
            '确定':function() {
                //authorize(tree.treeObj.getCheckedNodes(true), userId);
                var _param = "user_id=" + userId;
                var _ns = _funcTree.getCheckedNodes(true);
                for (var i = 0; i < _ns.length; i++) {
                    if (_ns[i].type == 1 && _ns[i].checked)
                        _param += "&function_id=" + _ns[i].id;
                }
                CORE.request("DS_USER_FUNCTION_SET", {data:_param}, function(data) {
                    $("#tree").dialog("close");
                });
            }
        }
    };
    if (_funcTree == null) {
        loadFunctionTree(function() {
            loadUserFunction(userId, function() {
                $("#tree").dialog(_dlgOpt);
            });
        });
    } else {
        loadUserFunction(userId, function() {
            $("#tree").dialog(_dlgOpt);
        });
    }
}

/**
 * 设置排除的功能
 * @param userId
 */
function setExcludeFunction(userId) {
    var _exDlgOpt = {
        title : "设置排除功能",
        width : "450px",
        height : "400" ,
        modal : true,
        bgiframe : true,
        buttons : {
            '取消':function() {
                $("#tree").dialog("close");
            },
            '确定':function() {
                //authorize(tree.treeObj.getCheckedNodes(true), userId);
                var _param = "user_id=" + userId;
                var _ns = _funcTree.getCheckedNodes(true);
                for (var i = 0; i < _ns.length; i++) {
                    if (_ns[i].type == 1 && _ns[i].checked)
                        _param += "&function_id=" + _ns[i].id;
                }
                CORE.request("DS_USER_FUNC_EXCLUDE_SET", {data:_param}, function(data) {
                    $("#tree").dialog("close");
                });
            }
        }
    };
    if (_funcTree == null) {
        loadFunctionTree(function() {
            loadUserExcludeFunction(userId, function() {
                $("#tree").dialog(_exDlgOpt);
            });
        });
    } else {
        loadUserExcludeFunction(userId, function() {
            $("#tree").dialog(_exDlgOpt);
        });
    }
}

/**
 *装载功能树
 */
function loadFunctionTree(callback) {
    _funcTree = new ZTree("tree", "DS_MODULE_FUNCTION_TREE",
            {multi:true,otherParam:["loadFunction","true","access_rule","1"],loadComplete:callback});
}

/**
 * 装载用户的功能授权信息
 * @param userId
 */
function loadUserFunction(userId, callback) {
    if (_funcTree == null) {
        return;
    }

    CORE.request("DS_USER_FUNCTION", {data:"user_id=" + userId}, function(data) {
        _funcTree.checkAllNodes(false);
        for (var i = 0; i < data.length; i++) {
            var _n = _funcTree.getNodeById(data[i], 1);
            if (_n == null)
                continue;
            _n.checked = true;
            _funcTree.updateNode(_n, true);
        }
        //alert("shit");
        if (callback != undefined)
            callback();
    });
}

/**
 * 装载用户排除的功能权限
 * @param userId
 */
function loadUserExcludeFunction(userId, callback) {
    if (_funcTree == null)
        return;

    CORE.request("DS_USER_FUNC_EXCLUDE", {data:"user_id=" + userId}, function(data) {
        _funcTree.checkAllNodes(false);
        for (var i = 0; i < data.length; i++) {
            var _n = _funcTree.getNodeById(data[i], 1);
            if (_n == null)
                continue;
            _n.checked = true;
            _funcTree.updateNode(_n, true);
        }
        //alert("shit");
        if (callback != undefined)
            callback();
    });
}

function lookUser(obj) {
    editUserInfo(obj, false);
    //$(".ui-dialog-buttonpane").children(".ui-button").eq(1).remove();
}

;
function delUser(obj) {
    CORE.confirm("确定要注销该用户吗？注意，该用户注销后将不能再登录以使用系统。", function() {
        var callback = function(result) {
            CORE.tip("用户已被注销");
            GRID.reload("listuser");
        };
        CORE.submitForm("DS_USER_DEL", null, {data:"userid=" + obj}, callback);
    });
}

function editUserInfo(obj, edit) {
    $("#userId").val(obj);
    if (edit != undefined && !edit) {
        dlgOpts.buttons["确定"] = dlgOpts.buttons["取消"];
    } else {
        dlgOpts.buttons["确定"] = function() {
            var right = document.getElementById("rightBox");
            for (var i = 0; i < right.options.length; i++) {
                right.options[i].selected = true;
            }
            ;
            CORE.submitForm("DS_FRAMEWORK_SERVICE_SECURITY_UPDATEUSER", "edituserform", {}, function() {
                $("#dialog").dialog("close");
                GRID.reload('listuser');
                CORE.tip("用户资料修改成功！");
                CORE.request("DS_FRAMEWORK_SECURITY_USER_APPLICATION", {});
            })
        };
    }
    CORE.loadForm("DS_USER_EDIT", "edituserform",
            {data:"id=" + obj , ruleId : "SYS_P_USER",loadComplete:
                    function() {
                        //alert("1");
                        //左边的角色
                        CORE.request("DS_FRAMEWORK_SERVICE_SECURITY_USER_GROUP_LEFTLIST", {data:'ftl=_ftl&id=' + obj},
                                function(data) {
                                    //alert("2");
                                    $("#leftBox").empty();
                                    //alert("3");
                                    $.each(data, function(entryIndex, entry) {
                                        $("#leftBox").append("<option>" + entry['name'] + "</option>");
                                    });
                                    //alert("4");
                                    //右边的角色
                                    CORE.request("DS_FRAMEWORK_SERVICE_SECURITY_GROUP_RIGHTLIST",
                                            {data:'ftl=_ftl&id=' + obj},
                                            function(data) {
                                                //alert("5");
                                                $("#rightBox").empty();
                                                //alert("6");
                                                $.each(data, function(entryIndex, entry) {
                                                    $("#rightBox").append("<option>" + entry['name'] + "</option>");
                                                    //$("#rightBox").append("<input type='hidden' name='rightValues' value='"+entry['name']+"'\>");
                                                });
                                                //alert("7");
                                                $("#dialog").dialog(dlgOpts);
                                            });
                                });
                    }});
    document.getElementById("account").readOnly = true;
}

//由左移到右
function right() {
    var lbox = $("#leftBox option:selected");
    $(lbox).each(function() {
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
    $(rbox).each(function() {
        $(rbox).remove();
        //$("#rightValues").remove();
        //alert($(rbox).val());
        //$("input[value='"+$(rbox).val()+"']").remove();
        $("#leftBox").append(rbox);
    });
    $("#leftBox").attr("selectedIndex", -1);
    $("#rightBox").change();
}

function pswReset(obj) {
    CORE.request("DS_FRAMEWORK_SERVICE_SECURITY_USER_PSWRESET", {data:"password=888888&id=" + obj}, function() {
        CORE.tip("该用户密码已经还原为初始密码：888888！");
        GRID.reload("listuser");
    });
}

var dlgOpts1 = {
    title : "添加用户信息",
    width : "450px",
    height : "500" ,
    modal : true,
    buttons : {
        '取消':function() {
            $("#dialog").dialog("close");
        },
        '确定':function() {
            var ltText = $.trim($("#ltText").val());
            var area_id_ = $.trim($("#area_id_").val());
            var liangtong = 0;
            var fuwushang = 0;

            var right = document.getElementById("rightBox");
            for (var i = 0; i < right.options.length; i++) {
                right.options[i].selected = true;
            }
            ;
            CORE.submitForm("DS_FRAMEWORK_SERVICE_SECURITY_ADDUSER", "edituserform", {data:"password=888888"},
                    function(msg) {
                        $("#dialog").dialog("close");
                        GRID.reload('listuser');
                        CORE.tip("用户已添加！");
                    });
        }
    }
};

function addUser() {

    document.edituserform.reset();

//    $("input").attr("readonly", false);
    document.getElementById("account").readOnly = false;
    $("#leftBox").empty();
    $("#rightBox").empty();
    //角色列表
    CORE.request("DS_FRAMEWORK_SERVICE_SECURITY_USER_GROUP_NAMELIST", {data:'ftl=_ftl'}, function(data) {
        $.each(data, function(entryIndex, entry) {
            $("#leftBox").append("<option>" + entry['name'] + "</option>");
        });
        CORE.loadRules("edituserform", "SYS_P_USER");
        $("#dialog").dialog(dlgOpts1);
    });
}

$(function() {
    GRID.create("#listuser", "DS_USER_LIST", params, "userManager");
    $("#TYPE_ID2").change(function() {
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
    buildSelectTree("DS_FRAMEWORK_SECURITY_DEPARTMENT", "Dept_Tree", {select:function(node) {
        if (node.length == 0) {
            $("#_Dept_Name").val("");
            $("#_Dept_Id").val("");
        } else {
            $("#_Dept_Name").val(node.name);
            $("#_Dept_Id").val(node.id);
        }
        return true;
    }});
}

/**
 * 装载用户所有的功能授权信息
 * @Author 蒋杰龙
 * @param userId
 */
function loadAllUserFunction(userId, callback) {
    if (_funcTree == null) {
        return;
    }

    CORE.request("DS_LOAD_ALL_USER_FUNCTION", {data:"userId=" + userId}, function(data) {
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
        title : "查看用户授权",
        width : "450px",
        height : "400" ,
        modal : true,
        bgiframe : true,
        buttons : {
            '关闭':function() {
                $("#tree").dialog("close");
            }
        }
    };
    if (_funcTree == null) {
        loadFunctionTree(function() {
            loadAllUserFunction(userId, function() {
                $("#tree").dialog(_dlgOpt);
            });
        });
    } else {
        loadAllUserFunction(userId, function() {
            $("#tree").dialog(_dlgOpt);
        });
    }
}

</script>
</head>
<body style="padding: 0; margin: 0">
<div id="tmp" style="display: none;">
    <form name="roleCheckboxForm" id="roleCheckboxForm">
        <input type="hidden" name="user_id" id="user_id"/>

        <p id="functionId"></p>
    </form>
</div>
<jsp:include page="/pages/navbar.jsp"/>
<div class="modules">
    <div class="barquery">
        <div class="barquery">
            <div class="barquerycenter">用户管理</div>
            <div class="barquerybtn">
                <a class="btn_add" href="javascript:void(0);" onclick="addUser();" title="添加新用户">添加</a>
                <a class="btn_exp_excel" href="javascript:void(0);" onclick="CORE.goToDS('SYS_P_USER_LIST','result=excel&fileName=用户列表导出','userManager');" title="导出用户信息列表为Excel文件">导出</a>
                <!--  <a href="javascript://nop/;" class="btnfunctionout" style="padding:3px 5px;" onclick="CORE.goToDS('SYS_P_USER_LIST','result=excel&fileName=用户列表导出','userManager')">导出Excel</a>-->
                <%--<input class="btn_excelout" type="button"--%>
                       <%--onclick="CORE.goToDS('DS_USER_LIST','result=excel&fileName=用户列表导出','userManager')"--%>
                       <%--value="导出"/>--%>
                <%--<input name="btn_addition" class="btn_additionout" value="添加" type="button" onclick="addUser();"/>--%>
            </div>
        </div>
    </div>
    <center>
        <div class="barquerycontent" align="center">

            <form name="userManager"
                  onsubmit="GRID.reload('listuser');return false;">
                <table class="content_List">
                    <tr>
                        <td style="width: 60px;" align="right" class="contenttd">
                            用户工号:
                        </td>
                        <td align="left">
                            <input type="text" name="useraccount" value="">
                        </td>
                        <td style="width: 60px;" align="right" class="contenttd">
                            用户名称:
                        </td>
                        <td align="left">
                            <input type="text" name="username" value="">
                        </td>
                        <td style="width: 60px;" align="right" class="contenttd">
                            手机号码:
                        </td>
                        <td align="left">
                            <input type="text" name="mobilephone" value="">
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 60px;" align="right" class="contenttd">
                            状&nbsp;&nbsp;态:
                        </td>
                        <td align="left">
                            <select name="statusid" id="statusidSelect"
                                    style="width: 160px;">
                                <option value="">
                                    --请选择--
                                </option>
                                <option value="1">
                                    有效
                                </option>
                                <option value="2">
                                    已注销
                                </option>
                            </select>
                        </td>
                        <td colspan="4">
                            <input Class="btnquery_mouseout"
                                   onmouseover="this.className='btnquery_mouseover'"
                                   onmouseout="this.className='btnquery_mouseout'" type="submit"
                                   value="">
                        </td>
                </table>
            </form>
        </div>
        <div>
            <table id="listuser" style="margin: 0; padding: 0;"></table>
            <div id="pagerdt" style="margin: 0; padding: 0;"></div>
        </div>
        <div style="width:98%;text-align:left;">
            <b>说明：</b><br>
            1. 可单独为用户进行系统功能的访问授权<br>
            2. 可对用户进行功能授权排除，意思是，对用户从角色继承过来的授权将排除这些。<br>
            3. 排除的功能授权只对用户所属角色的授权生效，单独对用户进行设置的授权不受影响。<br>
        </div>
        <!-- 修改用户信息 -->
        <div id="dialog" style="display: none;padding:0px !important;margin:0 0 0 10px !important;">
            <form name="edituserform" onsubmit="return false;">
                <input type="hidden" name="id" id="userId">
                <table>
                    <tr>
                        <td class="formLabel">
                            工号：
                        </td>
                        <td class="formField">
                            <input id="account" name="account" type="text"  style="width: 200px;"/>
                        </td>
                    </tr>
                    <tr>
                        <td class="formLabel">
                            用户名：
                        </td>
                        <td class="formField">
                            <input id="name" name="name" type="text" style="width: 200px;"/>
                        </td>
                    </tr>
                    <tr>
                        <td class="formLabel">
                            手机号码：
                        </td>
                        <td class="formField">
                            <input id="mobile_phone" name="mobile_phone" type="text" style="width: 200px;"/>
                        </td>
                    </tr>
                    <tr>
                        <td class="formLabel">
                            邮箱：
                        </td>
                        <td class="formField">
                            <input id="email" name="email" type="text" style="width: 200px;"/>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">
                            部门：
                        </td>
                        <td class="formField">
                            <input type="hidden" name="dept_id" id="_Dept_Id">
                            <input type="text" readonly="readonly" name="dept_name" id="_Dept_Name">
                            <input type="button" value="选择" onclick="selectDept();">
                        </td>
                    </tr>
                    <tr>
                        <td class="formLabel">
                            状态：
                        </td>
                        <td class="formField">
                            <label><input name="status_id" type="radio" value="1" checked>有效</label>
                            <label><input name="status_id" type="radio" value="2">注销</label>
                        </td>
                    </tr>
                </table>
                <table>
                    <tr>
                        <td>
                            可分配角色<br>
                            <select id="leftBox" name="leftBox" size="10" style="width: 140px;"
                                    multiple="multiple">
                            </select>
                            <br><br></td>
                        <td width="20%" align="center">
                            <input id="perRight" type="button" style="width: 46px;"
                                   class="btnfunctionout" onclick="right()" value="  >  ">
                            <br>
                            <br>
                            <br>
                            <input id="perLeft" type="button" style="width: 46px;"
                                   class="btnfunctionout" onclick="left()" value="  <  ">
                            <br><br></td>
                        <td>
                            已分配角色<br>
                            <select id="rightBox" name="rightBox" size="10" style="width: 140px;"
                                    multiple="multiple"></select>
                            <br><br></td>
                    </tr>
                </table>
            </form>
        </div>
        <div style="display:none;" class="tree" id="tree">
        </div>
        <div style="display:none;" id="service_user">
            <ul id="treeService" class="tree"
                style="float:left;width:200px;height:330px;overflow:auto;margin-right:10px;"></ul>
            <form id="serviceForm" name="serviceForm" style="float:left;">
                <input type="hidden" id="areaid" name="areaid" value="1">

                <div style="width:250px;">
                    <table id="listnet_service" style="margin: 0; padding: 0;"></table>
                    <div id="pagerdt1" style="margin: 0; padding: 0;"></div>
                </div>
            </form>
        </div>
    </center>
</div>
</body>
</html>
