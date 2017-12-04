<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>组织机构管理</title>
    <jsp:include page="/pages/framework/base.jsp"/>
	<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
	<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>
    <script type="text/javascript" src="scripts/common/ztree.help.js"></script>
</head>
<script type="text/javascript">

    var serviceid;
    var zTree1;
    var setting;
    var zNodes = [];
    //树节点点击时触发的事件
    function zTreeOnClick(event, treeId, treeNode) {
        $("#netQuery").find("input[type='text']").val("");
        $("#netQuery").find("select").val("");
        var s = zTree1.treeObj.getNodeByTId(treeNode.tId).parent_id;
        $("#netQuery .DEPT_ID").val(treeNode.id);
        serviceid = s;
        GRID.reload('listnet');
    }

    ///修改组织机构
    function modOrg() {
        if (serviceid == undefined) {
            CORE.tip("请先选中部门树中的一个节点再点击修改！");
            return;
        }
        $("#_Parent_Select_Btn").attr("disabled","disabled");
        CORE.loadForm("DS_DEPARTMENT_DETAIL", "editOrgForm", {ruleId : "editService",data:"id=" + serviceid,loadComplete:function(){
            $("#dialog_edit").dialog(dlgOpts_edit);
        }});

    }

    var dlgOpts_edit = {
        title : "修改部门",
        width : "350px",
        height : "330" ,
        modal : true,
        buttons : {
            '取消':function() {
                $("#dialog_edit").dialog("close");
            },
            '确定':function() {
                CORE.submitForm("DS_DEPARTMENT_EDIT", "editOrgForm", {}, function() {
                    CORE.tip("部门修改成功!");
                    $("#dialog_edit").dialog("close");
                    reloadarea(1);
                })
            }
        }
    };

    ///增加组织结构
    function addOrgMan() {
        CORE.loadRules("editOrgForm", "add_orgStrMan_validation", false, function() {
            document.editOrgForm.reset();
            $("#_Parent_Select_Btn").removeAttr("disabled");
            if (zTree1.getSelectedNode() != null) {
                $("#_Parent_Id").val(zTree1.getSelectedNode().id);
                $("#_Parent_Name").val(zTree1.getSelectedNode().name);
            }
            $("#dialog_edit").dialog(dlgOpts_add);
        });
    }

    var dlgOpts_add = {
        title : "新增部门",
        width : "370px",
        height : "330" ,
        modal : true,
        buttons : {
            '取消':function() {
                $("#dialog_edit").dialog("close");
            },
            '确定':function() {
                CORE.submitForm("DS_DEPARTMENT_EDIT", "editOrgForm", {}, function() {
                    $("#dialog_edit").dialog("close");
                    CORE.tip("部门已添加!");
                    reloadarea($("#PARENT_ID").val());
                })
            }
        }
    };

    //刷新树
    function reloadarea(id) {
        zTree1.refreshNode(id);
    }

    $(function() {
        zTree1 = new ZTree("treeDemo", "DS_FRAMEWORK_SECURITY_DEPARTMENT", {"nodeClicked":zTreeOnClick});
        GRID.create("#listnet", "DS_DEPARTMENT_USERS", params, "netQuery");
        $("#addOrg").attr("readonly", "readonly");
    });

    //////////展示相应的组织机构下的所有的联通用户
    var params = {
        colModel : [
            {
                name : '登录账户',
                index : 'ACCOUNT',
                align : 'center',
                width : 30
            },
            {
                name : '姓名',
                index : 'NAME',
                align : 'center',
                width : 20
            },
            {
                name : '手机号码',
                index : 'MOBILE_PHONE',
                align : 'center',
                width : 20
            },
            {
                name : '用户状态',
                index : 'STATUS_ID',
                align : 'center',
                width : 18

            } ,
            {
                name : '电子邮件',
                index : 'EMAIL',
                align : "center",
                width : 40
            },
            {
                name:"部门",
                index:"dept_name",
                align:"center",
                width:60
            }
        ],
        caption : "用户列表",
        multiselect:false,
        parentwidth:true,
        width:"100%"
    };
    var updateInfoNetId;

    //搜索
    function seachDeartment() {
        $("#netQuery .DEPT_ID").val($("#nqPARENT_ID").val());
        GRID.reload("listnet");
    }

    //选择上级部门
    function selectParentDept(){
        buildSelectTree("DS_FRAMEWORK_SECURITY_DEPARTMENT","_Select_Parent_Dept_Tree",{select:function(node){
            $("#_Parent_Id").val((node.id==undefined || node.length==0)?"":node.id);
            $("#_Parent_Name").val((node.id=undefined || node.length==0)?"":node.name);
            return true;
        }});
    }

    //选择部门负责人
    function selectDeptMaster(){
        buildSelectTree("DS_FRAMEWORK_SECURITY_DEPARTMENT","_Select_Dept_Master_Tree",{otherParam:["loadUser","true"],select:function(node){
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
        }});
    }

    
    //选择行政区域 2012-09-12 李嘉伟 部门添加关联的行政区域    
    function selectAdminOrg(){
        buildSelectTree("DS_SYS_BI_ADMIN_ORG_TREE","PROPERTY_TYPE_TREE",{select:function(node){
            if(node.id == undefined || node.length==0){
            	$("#_admin_org").val("");
            	$("#_admin_org_name").val("");
            }else{
            	$("#_admin_org").val(node.id);
            	$("#_admin_org_name").val(node.name);
            }
            return true;
        }});
    }
</script>
<body style="MARGIN: 0px;padding:0px;height:100%;">
<jsp:include page="/pages/navbar.jsp"/>
<table border="0" id="orgStrManTable" name="orgStrManTable" cellPadding="0" cellSpacing="0" height="100%" width="100%">
    <tr height="100%">
        <td noWrap align="center" id="frmTitle" width="145" height="100%" valign="top">
            <!-- 左边树形列表 -->
            <div style="height: 100%;margin:0px;width: 225px;" name="submenu1">
                <table border="0" height="100%" width="225" cellPadding="0" cellSpacing="0">
                    <tr height="90%">
                        <td valign="top" style="overflow: auto;">
                            <div style="height:90%;width:100%;">
                                <div style="font-size:12px;text-indent:6px;font-weight:bold;height:30px;line-height:38px;">
                                    组织机构
                                </div>
                                <div id="treeDemo" class="tree" style="position:absolute;"></div>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <!--end 左边树形列表 -->
        </td>
        <td style="WIDTH: 100%;" height="100%" valign="top">
            <!-- 右边展示的内容 -->
            <div style="height:100%;" id="submenu" name="submenu">
                <div class="modules">
                    <div class="barquery">
                        <div class="barqueryleft">
                        </div>
                        <div class="barquerybtn">
                            <a class="btn_add" href="javascript:void(0);" onclick="addOrgMan();" title="添加新的部门">添加</a>
                            <a class="btn_edit" href="javascript:void(0);" onclick="modOrg();" title="修改选中的部门">修改</a>
                        </div>
                    </div>

                    <div class="barquerycontent" style="margin:0;padding:0;width:100%;">
                        <form name="netQuery" id="netQuery" style="margin-bottom:10px;padding:0px;"
                              onsubmit="return false;">
                            <!--用于树控件提交数据，搜索部门ID输入框的值会同步改值-->
                            <input type="hidden" class="DEPT_ID" name="DEPT_ID" value="">
                            <table border="0" class="content_List" width="100%" cellSpacing="0" cellPadding="0"
                                   id="orgDetailTable">
                                <tr>
                                    <td align="right" class="contenttd">
                                        组织结构名称:
                                    </td>
                                    <td align="left">
                                        <input type="text" style="width:170px;" name="nqname" id="nqname"
                                               value="">
                                    </td>
                                    <td align="left" align="right" class="contenttd">
                                        组织结构类型:
                                    </td>
                                    <td align="left">
                                        <select id="nqDEPT_TYPE" name="nqDEPT_TYPE" style="width:170px;">
                                            <option value="">
                                                --请选择--
                                            </option>
                                            <option value="0">
                                                集团
                                            </option>
                                            <option value="1">
                                                公司
                                            </option>
                                            <option value="2">
                                                部门
                                            </option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" align="right" class="contenttd">
                                        部门ID:
                                    </td>
                                    <td align="left">
                                        <input type="text" style="width:170px;" name="nqPARENT_ID"
                                               id="nqPARENT_ID" value="">
                                        <input type="button" id="nqParent_button" class="grid_button" value="选择"
                                               onClick="getParentTree(this)">
                                    </td>
                                    <td colspan="2">
                                        <input Class="btnquery_mouseout"
                                               onmouseover="this.className='btnquery_mouseover'"
                                               onmouseout="this.className='btnquery_mouseout'" type="submit"
                                               value="" title="搜索" onclick="seachDeartment()"/>
                                    </td>
                                </tr>
                            </table>
                        </form>
                        <div style="width:98%;">
                            <table id="listnet" style="margin: 0; padding: 0;"></table>
                        </div>
                    </div>
                    <!-- 修改组织机构 -->
                    <div id="dialog_edit" name="dialog_edit" style="display:none;">
                        <form name="editOrgForm" id="editOrgForm" method="post">
                            <input type="hidden" name="id">
                            <table border="0" id="eaddOrgManTable">
                                <tr class="formRow">
                                    <td class="formLabel" style="width:90px;">
                                        部门名称:
                                    </td>
                                    <td class="formField">
                                        <input type="text" style="width:200px;" name="name" id="_Name"
                                               value="">
                                    </td>
                                </tr>
                                <tr class="formRow">
                                	<td class="formLabel">
                                		 部门编码:
                                	</td>
                                	<td class="formField">
                                        <input type="text" style="width:200px;" name="dept_code" id="_Dept_Code"
                                               value="">
                                	</td>
                                </tr>
                                <tr class="formRow">
                                    <td class="formLabel">
                                        部门类型:
                                    </td>
                                    <td class="formField">
                                        <select id="_Dept_Type" name="dept_type" style="width:170px;">
                                            <option value="">
                                                --请选择--
                                            </option>
                                            <option value="0">
                                                集团
                                            </option>
                                            <option value="1">
                                                公司
                                            </option>
                                            <option value="2">
                                                部门
                                            </option>
                                        </select>
                                    </td>
                                </tr>
                                <tr class="formRow">
                                    <td class="formLabel">
                                         所属行政区域:
                                    </td>
                                    <td class="formField">
                                        <input type="hidden" name="admin_org" id="_admin_org">
                                        <input type="text" readonly="true" name="admin_org_name"
                                               id="_admin_org_name" value="">
                                        <input type="button" value="选择" id="_Admin_org_Btn" onclick="selectAdminOrg();">
                                    </td>
                                </tr>
                                <tr class="formRow">
                                    <td class="formLabel">
                                        上级部门:
                                    </td>
                                    <td class="formField">
                                        <input type="hidden" name="parent_id" id="_Parent_Id">
                                        <input type="text" readonly="true" name="parent_name"
                                               id="_Parent_Name" value="">
                                        <input type="button" value="选择" id="_Parent_Select_Btn" onclick="selectParentDept();">
                                    </td>
                                </tr>
                                <tr class="formRow">
                                    <td class="formLabel">
                                        部门负责人：
                                    </td>
                                    <td class="formField">
                                        <input type="hidden" name="master_id" id="_Master_Id">
                                        <input type="text" name="master_name" id="_Master_Name" readonly="readonly">
                                        <input type="button" value="选择" onclick="selectDeptMaster();">
                                    </td>
                                </tr>
                                <tr class="formRow">
                                    <td class="formLabel">
                                        业务编码：
                                    </td>
                                    <td class="formField">
                                        <input type="text" name="business_code" style="width:200px;">
                                    </td>
                                </tr>
                                <tr class="formRow">
                                    <td class="formLabel">
                                        备注:
                                    </td>
                                    <td class="formField">
                                        <textarea style="width:200px;height:100px;" name="note" id="_Note"></textarea>
                                    </td>
                                </tr>
                            </table>
                        </form>
                    </div>

                </div>
            </div>
            <!-- end 右边展示的内容 -->
        </td>
    </tr>
</table>
<div id="parentOrg" style="display:none;">
    <div id="parentTree" class="tree"></div>
</div>
</body>
</html>
