<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>组织机构管理</title>
    <r:include resource="!rdcp/pages/listBase.jsp"/>
    <script type="text/javascript" src="!org/dept/~/scripts/DeptManager.js"></script>
</head>

<body style="MARGIN: 0px;padding:0px;height:100%;">


<div id="submenu" name="submenu">
    <div class="SR_Space">
        <div class="SR_moduleBox">
            <div class="SR_moduleTitle">
                组织机构
            </div>
            <div class="SR_moduleRight">
                <a class="btn_add" href="javascript:void(0);" onclick="addOrgMan();" title="添加新的部门">添加</a>
                <a class="btn_edit" href="javascript:void(0);" onclick="modOrg();" title="修改选中的部门">修改</a>
            </div>
        </div>



        <table border="0" id="orgStrManTable" name="orgStrManTable" cellPadding="0" cellSpacing="0" height="100%" width="100%">
            <tr height="100%">
                <td noWrap align="center" id="frmTitle" width="145" height="100%" valign="top">
                    <!-- 左边树形列表 -->
                    <div style="height: 100%;margin:0px;width: 225px;" name="submenu1">
                        <table border="0" height="100%" width="225" cellPadding="0" cellSpacing="0">
                            <tr height="90%">
                                <td valign="top" style="overflow: auto;">
                                    <div style="height:90%;width:100%;">
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
                    <div class="SR_searchTableBox" hidden>
                        <form name="netQuery" id="netQuery"
                              onsubmit="return false;">
                            <!--用于树控件提交数据，搜索部门ID输入框的值会同步改值-->
                            <input type="hidden" class="DEPT_ID" name="DEPT_ID" value="">
                            <%--<table border="0" class="content_List" width="100%" cellSpacing="0" cellPadding="0"
                                   id="orgDetailTable">
                                <tr>
                                    <td align="right" class="SR_searchTitle">
                                        组织结构名称:
                                    </td>
                                    <td align="left">
                                        <input type="text" style="width:170px;" class="SR_pureInput" name="nqname" id="nqname"
                                               value="">
                                    </td>
                                    <td align="left" align="right" class="SR_searchTitle">
                                        组织结构类型:
                                    </td>
                                    <td align="left">
                                        <select id="nqDEPT_TYPE" name="nqDEPT_TYPE" class="SR_pureInput" style="width:170px;">
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
                                    <td align="left" align="right" class="SR_searchTitle">
                                        部门ID:
                                    </td>
                                    <td align="left">
                                        <input type="text" style="width:170px;" class="SR_pureInput" name="nqPARENT_ID"
                                               id="nqPARENT_ID" value="">
                                        <input type="button" id="nqParent_button" class="grid_button" value="选择"
                                               onClick="getParentTree(this)">
                                    </td>
                                    <td colspan="2">
                                        <a class="SR_moduleSearch"
                                           onmouseover="this.className='SR_moduleSearchHover';"
                                           onMouseOut="this.className='SR_moduleSearch'" href="javascript://"
                                           onclick="seachDeartment()"></a>
                                    </td>
                                </tr>
                            </table>--%>
                        </form>
                    </div>
                    <div  class="SR_tableContentBox">
                        <table id="listnet" ></table>
                    </div>
                    <!-- end 右边展示的内容 -->
                </td>
            </tr>
        </table>


        <!-- 修改组织机构 -->
        <div id="dialog_edit" name="dialog_edit" style="display:none;">
            <div class="SR_inputTableContent">
            <form name="editOrgForm" id="editOrgForm" method="post">
                <input type="hidden" id="edit_id" name="id">
                <table border="0" id="eaddOrgManTable">
                    <tr class="formRow">
                        <td class="formLabel" style="width:90px;">
                            部门名称:
                        </td>
                        <td class="formField">
                            <input type="text" style="width:200px;" name="name" id="_Name" class="SR_pureInput"
                                   value="">
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">
                            部门编码:
                        </td>
                        <td class="formField">
                            <input type="text" style="width:200px;" name="dept_code" id="_Dept_Code" class="SR_pureInput"
                                   value="">
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">
                            部门类型:
                        </td>
                        <td class="formField">
                            <select id="_Dept_Type" name="dept_type" style="width:170px;" class="SR_pureInput">
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
                   <%-- <tr class="formRow">
                        <td class="formLabel">
                            所属行政区域:
                        </td>
                        <td class="formField">
                            <input type="hidden" name="admin_org" id="_admin_org">
                            <input type="text" readonly="true" name="admin_org_name"
                                   id="_admin_org_name" value="">
                            <input type="button" value="选择" id="_Admin_org_Btn" onclick="selectAdminOrg();">
                        </td>
                    </tr>--%>
                    <tr class="formRow">
                        <td class="formLabel">
                            上级部门:
                        </td>
                        <td class="formField">
                            <input type="hidden" name="parent_id" id="_Parent_Id">
                            <input type="text" readonly="true" name="parent_name" class="SR_pureInput"
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
                            <input type="text" name="master_name" id="_Master_Name" class="SR_pureInput" readonly="readonly">
                            <input type="button" value="选择" onclick="selectDeptMaster();">
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">
                            业务编码：
                        </td>
                        <td class="formField">
                            <input type="text" name="business_code" class="SR_pureInput" style="width:200px;">
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">
                            备注:
                        </td>
                        <td class="formField">
                            <textarea style="width:200px;height:100px;" class="SR_pureInput" name="note" id="_Note"></textarea>
                        </td>
                    </tr>
                </table>
            </form>
        </div>
        </div>

    </div>
</div>



<div id="parentOrg" style="display:none;">
    <div id="parentTree" class="tree"></div>
</div>
</body>
</html>
