<%--
File: commOrgSecurity
User: kinz
Date: 11-5-12 下午4:58

机构授权维护
1. 部门授权
2. 用户授权
--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<html>
<head>
    <title>机构授权</title>
    <jsp:include page="/pages/framework/base.jsp"/>
	<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
	<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>
    <script type="text/javascript" src="scripts/common/ztree.help.js"></script>
    <script type="text/javascript" src="pages/service/security/commOrgSecurity.js"></script>
</head>
<body>
<jsp:include page="/pages/navbar.jsp"/>
<div style="margin:0 auto;">
    <div class="barquery">
        <div class="barqueryleft"></div>
        <div class="barquerycenter">机构授权维护</div>
        <div class="barqueryright"></div>
        <div class="barquerybtn">
        </div>
    </div>
    <table width="640" align="center" class="ui_grid_btable"
           style="margin:0 auto; border-collapse:collapse;border:#6495ed solid 1px;height:350px;">
        <tr>
            <th>部门/用户(请点击)</th>
            <th>机构授权(请选择)</th>
        </tr>
        <tr style="height:400px;">
            <td valign="top" style="width:300px;text-align:left;">
                <div id="DEPARTMENT_TREE" class="tree" style="height:400px;overflow:auto;width:300px;"></div>
            </td>
            <td valign="top" style="text-align:left;width:300px;">
                <div id="ORG_TREE" class="tree" style="height:400px;overflow:auto;width:300px;"></div>
            </td>
        </tr>
        <tr id="_Dept_Select_Tip" style="display:none;height:50px;">
            <td colspan="2" align="left">
                您选中的是部门，请在右边的机构中选择该部门可访问的机构区域。<br>
                对部门进行机构区域授权后，该部门下的所有用户/员工都将继承该部门的授权。
            </td>
        </tr>
        <tr id="_User_Select_Tip" style="display:none;overflow-y:visible;">
            <td colspan="2" align="left">
                您选中的是用户/员工，请做右边的机构中选择该用户/员工可访问的机构区域。
            </td>
        </tr>
        <tr>
            <td colspan="2" align="center">
                <input type="button" value="提交" onclick="submitChanges();" class="grid_button">
            </td>
        </tr>
    </table>
</div>
</body>
</html>