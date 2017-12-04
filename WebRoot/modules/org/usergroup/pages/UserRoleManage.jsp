<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
<title>角色管理</title>
<head>
    <r:include resource="!rdcp/pages/listBase.jsp"/>
    <script type="text/javascript" src="!org/usergroup/~/scripts/UserRoleManage.js"></script>
</head>
<body style="padding: 0; margin: 0">
<div id="tmp" style="display: none;">
    <form name="roleCheckboxForm" id="roleCheckboxForm">
        <input type="hidden" name="user_group_code" id="user_group_code"/>

        <p id="functionId"></p>
    </form>
</div>
<%--<jsp:include page="/pages/navbar.jsp"/>--%>
<div class="SR_Space">
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">角色管理</div>
        <div class="SR_moduleRight">
            <a class="btn_add" href="javascript:void(0);" id="add_role" title="添加新的角色">添加</a>
        </div>
    </div>
    <center>
        <div align="center">
            <div class="SR_searchTableBox">
                <form name="userRoleForm" id="userRoleForm" method="post">
                    <div class="barquerycontent">
                        <table class="content_List">
                            <tr>
                                <td align="right" class="SR_searchTitle" style="width: 80px;">
                                    角色编号：
                                </td>
                                <td align="left" style="width: 150px;">
                                    <input type="text" name="code" id="code" class="SR_pureInput"/>
                                </td>
                                <td align="right" class="SR_searchTitle" style="width: 80px;">
                                    角色名称：
                                </td>
                                <td align="left">
                                    <input type="text" name="name" id="name" class="SR_pureInput"/>
                                    &nbsp;&nbsp;
                                    <%--<input Class="btnquery_mouseout"--%>
                                           <%--onmouseover="this.className='btnquery_mouseover'"--%>
                                           <%--onmouseout="this.className='btnquery_mouseout'" type="submit"--%>
                                           <%--value="">--%>
                                    <a class="SR_moduleSearch"
                                       onmouseover="this.className='SR_moduleSearchHover';"
                                       onMouseOut="this.className='SR_moduleSearch'" href="javascript://"
                                       onclick="rdcp.grid.reload('listdt');return false;"></a>
                                </td>
                            </tr>
                        </table>
                    </div>
                </form>
            </div>
        </div>

       <%-- <div>
            <table id="listdt" style="margin: 0; padding: 0;"></table>
            <div id="pagerdt" style="margin: 0; padding: 0;"></div>
        </div>--%>

        <div class="SR_tableContentBox">
            <table id="listdt"></table>
        </div>

        <div style="width:98%;text-align:left;padding-top: 10px">
            <b>说明：</b><br>
            1. 对角色进行授权后，所有分配该角色的用户都拥有这个角色的权限<br>
        </div>
        <div id="_eidtRoleDialog" style="display: none;">
            <div class="SR_inputTableContent">
            <form name="eidtRoleForm" id="eidtRoleForm">
                <input type="hidden" id="_UpdateFlag" name="update" value="false">
                <table align="center">
                    <tr>
                        <td class="formLabel" style="width:100px;">
                            角色编号：
                        </td>
                        <td class="formField">
                            <input type="text" name="code" id="eidtCode" class="SR_pureInput"
                                   style="width: 200px">
                        </td>
                    </tr>
                    <tr>
                        <td class="formLabel">
                            角色名称：
                        </td>
                        <td class="formField">
                            <input type="text" name="name" id="eidtName" class="SR_pureInput"
                                   style="width: 200px">
                        </td>
                    </tr>
                    <tr>
                        <td class="formLabel">
                            角色备注：
                        </td>
                        <td class="formField">
                            <textarea cols="30" class="SR_pureInput" style="width:200px;height:100px;" rows="5" name="note" id="eidtNote"></textarea>
                        </td>
                    </tr>
                </table>
            </form>
        </div>
        </div>

    </center>
</div>
<div class="tree" id="roleDialog" style="display:none">
    <div id="roleTree"></div>
</div>
</body>
</html>
