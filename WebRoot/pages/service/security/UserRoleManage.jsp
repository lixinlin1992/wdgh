<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
<title>角色管理</title>
<head>
    <jsp:include page="/pages/framework/base.jsp"/>
    <link href="themes/default/css/public.css" rel="stylesheet"
          type="text/css"/>
    <script type="text/javascript" src="scripts/sunrise/common.js"></script>
    <script type="text/javascript" src="scripts/datePicker/WdatePicker.js"></script>
	<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
	<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>
    <script type="text/javascript" src="scripts/common/ztree.help.js"></script>
    <script type="text/javascript">
        var params = {
            colModel : [
                {
                    name : '编码',
                    index : 'code',
                    width : 120,
                    align : "center"
                },
                {
                    name : '名称',
                    index : 'name',
                    width : 120,
                    align : "center"
                },
                {
                    name:'备注',
                    index:'note',
                    width:150,
                    align:'center'
                },
                {
                    name : '操作',
                    index : 'button',
                    width : 50,
                    align : "center" ,
                    sortable : false,
                    formatter : button
                }
            ],
            caption : "浏览区",
            edit : true,
            multiselect:false,
            width:"98.5%"
        };
        $(function() {
            GRID.create("#listdt", "DS_USER_GROUP_LIST", params, "userRoleForm");
            $("#add_role").click(function() {
                CORE.loadRules("eidtRoleForm", "SYS_USERROLEMANAGE");
                document.eidtRoleForm.reset();
                $("#eidtCode").removeAttr("readonly");
                $("#_UpdateFlag").val("false");
                $("#_eidtRoleDialog").dialog(addRoleDialog);
            });
        });
        function button(cellvalue, options, rowObject) {
            var _html = "";
            if (rowObject[3] != 0) {
                _html += GRID.button({className:"btn_edit",onclick:"eidt('"+rowObject[0]+"');",title:"修改角色"})+
                    GRID.button({className:"btn_delete",onclick:"delUserGroup('"+rowObject[0]+"');",title:"删除角色"});
            }
            _html += GRID.button({className:"btn_auth",onclick:"setUserGroupFunc('"+rowObject[0]+"');",title:"功能授权"});
            return _html;
        }
        var addRoleDialog = {
            title : "添加角色",
            width : "400px",
            height : "280" ,
            buttons : {
                '取消':function() {
                    $("#_eidtRoleDialog").dialog("close");
                },
                '确定':function() {
                    CORE.submitForm("DS_USER_GROUP_EDIT", "eidtRoleForm", {}, function() {
                        document.eidtRoleForm.reset();
                        $("#_eidtRoleDialog").dialog("close");
                        CORE.tip("角色已添加！");
                        GRID.reload("listdt");
                    });
                }

            }}

        function eidt(code) {
            CORE.loadForm("DS_USER_GROUP_INFO", "eidtRoleForm",
                    {ruleId : "SYS_USERROLEMANAGE",data:'code=' + code,loadComplete:function() {
                        $("#eidtCode").attr("readonly", "readonly");
                        $("#_UpdateFlag").val("true");
                        $("#_eidtRoleDialog").dialog(eidtRoleDialog);
                    }});
        }

        var eidtRoleDialog = {
            title : "修改角色",
            width : "400px",
            height : "250" ,
            buttons : {
                '返回':function() {
                    $("#_eidtRoleDialog").dialog("close");
                },
                '修改':function() {
                    CORE.submitForm("DS_USER_GROUP_EDIT", "eidtRoleForm", {}, function() {
                        $("#_eidtRoleDialog").dialog("close");
                        CORE.tip("角色修改成功!");
                        GRID.reload('listdt');
                    })
                }

            }
        }

        function delUserGroup(code) {
            CORE.confirm("确定要删除角色吗？注意：角色删除后将不能恢复",function(){
                    CORE.request("DS_USER_GROUP_DEL", {data:"code=" + code}, function(data) {
                        CORE.tip("角色已经删除");
                        GRID.reload('listdt');
                    })});
        }

        var _funcTree = null;
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
        }
    </script>
</head>
<body style="padding: 0; margin: 0">
<div id="tmp" style="display: none;">
    <form name="roleCheckboxForm" id="roleCheckboxForm">
        <input type="hidden" name="user_group_code" id="user_group_code"/>

        <p id="functionId"></p>
    </form>
</div>
<jsp:include page="/pages/navbar.jsp"/>
<div class="modules">
    <div class="barquery">
        <div class="barquerycenter">
            角色管理
        </div>
        <div class="barquerybtn">
            <a class="btn_add" href="javascript:void(0);" id="add_role" title="添加新的角色">添加</a>
        </div>
    </div>
    <center>
        <div align="center">

            <form name="userRoleForm"
                  onsubmit="GRID.reload('listdt');return false;">
                <div class="barquerycontent">
                    <table class="content_List">
                        <tr>
                            <td align="right" class="contenttd" style="width: 80px;">
                                角色编号：
                            </td>
                            <td align="left" style="width: 150px;">
                                <input type="text" name="code" id="code">
                            </td>
                            <td align="right" class="contenttd" style="width: 80px;">
                                角色名称：
                            </td>
                            <td align="left">
                                <input type="text" name="name" id="name">
                                &nbsp;&nbsp;
                                <input Class="btnquery_mouseout"
                                       onmouseover="this.className='btnquery_mouseover'"
                                       onmouseout="this.className='btnquery_mouseout'" type="submit"
                                       value="">
                            </td>
                        </tr>
                    </table>
                </div>
            </form>
        </div>
        <div>
            <table id="listdt" style="margin: 0; padding: 0;"></table>
            <div id="pagerdt" style="margin: 0; padding: 0;"></div>
        </div>
        <div style="width:98%;text-align:left;">
            <b>说明：</b><br>
            1. 对角色进行授权后，所有分配该角色的用户都拥有这个角色的权限<br>
        </div>
        <div id="_eidtRoleDialog" style="display: none;">
            <form name="eidtRoleForm">
                <input type="hidden" id="_UpdateFlag" name="update" value="false">
                <table align="center">
                    <tr>
                        <td class="formLabel" style="width:100px;">
                            角色编号：
                        </td>
                        <td class="formField">
                            <input type="text" name="code" id="eidtCode"
                                   style="width: 200px">
                        </td>
                    </tr>
                    <tr>
                        <td class="formLabel">
                            角色名称：
                        </td>
                        <td class="formField">
                            <input type="text" name="name" id="eidtName"
                                   style="width: 200px">
                        </td>
                    </tr>
                    <tr>
                        <td class="formLabel">
                            角色备注：
                        </td>
                        <td class="formField">
                            <textarea cols="30" rows="5" name="note" id="eidtNote"></textarea>
                        </td>
                    </tr>
                </table>
            </form>
        </div>

    </center>
</div>
<div class="tree" id="roleDialog" style="display:none">
    <div id="roleTree"></div>
</div>
</body>
</html>
