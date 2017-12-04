<%--
File: functionList.jsp
User: kinz
Date: 11-3-31 上午9:27

    公用组织机构维护页面
--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <title>组织机构维护</title>
    <jsp:include page="/pages/framework/base.jsp"/>
	<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
	<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>    
    <script type="text/javascript" src="scripts/common/ztree.help.js"></script>
    <script type="text/javascript" src="scripts/service/commorg.help.js"></script>
    <script type="text/javascript" src="pages/service/basedata/commOrgList.js"></script>
</head>
<body>
<jsp:include page="/pages/navbar.jsp"/>
<div class="modules">
    <div class="barquery">
        <div class="barqueryleft"></div>
        <div class="barquerycenter">组织机构维护</div>
        <div class="barqueryright"></div>
        <div class="barquerybtn"><input name="btn_addition" class="btn_additionout" value="添加" type="button"
                                        onclick='add_commorg();'/></div>
    </div>
    <table width="100%">
        <tr>
            <td valign="top" style="height:100%;width:250px;">
                <div id="COMMORG_TREE" class="tree" style="height:500px;overflow:auto;"></div>
            </td>
            <td valign="top">
                <div class="barquerycontent" style="padding: 10px;" align="center">
                    <form name="QueryForm"
                          onsubmit="GRID.reload('listGrid');return false;">
                        <div class="barquerycontent" align="center">
                            <table class="content_List">
                                <tr>
                                    <td align="right" class="contenttd" style="width:150px">上级机构：</td>
                                    <td align="left" style="width:150px">
                                        <input name="parent_id" type="hidden" id="Q_parent_id"/>
                                        <input id="Q_parent_name" name="parent_name" class="textbox_css"
                                               readonly="readonly" style="width:100px"/>
                                        <input type="button" class="btnfunctionout" value="撤销"
                                               onclick="queryOrgSelect();"/>
                                    </td>
                                    <td align="right" class="contenttd" style="width:150px">机构名称：</td>
                                    <td align="left"><input type="text" name="name" class="textbox_css"/>
                                        <input class="btnquery_mouseout"
                                               onmouseover="this.className='btnquery_mouseover'"
                                               onmouseout="this.className='btnquery_mouseout'" type="submit" value=""/>
                                    </td>

                                </tr>
                            </table>

                        </div>
                    </form>
                    <div style="width:98%;">
                        <table id="listGrid" style="margin: 0; padding: 0;"></table>
                        <div id="pagerdt" style="margin: 0; padding: 0;"></div>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</div>
<div id="dialog_edit" style="display:none;">
    <div class="modules" style="height:190px;">
        <form name="EditForm" onsubmit="return false;">
            <input type="hidden" name="id">
            <table align="center">
                <tr class="formRow">
                    <td class="formLabel">
                        上级机构：
                    </td>
                    <td class="formField">
                        <input id="parent_id" name="parent_id" type="hidden"/>
                        <input id="parent_name" name="parent_name" readonly="readonly" type="text"
                               style="width:150px;"/>
                        <input type="button" id="OrgSelectBtn" class="btnfunctionout" value="选择"
                               onclick="selectOrg();"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        机构名称：
                    </td>
                    <td class="formField">
                        <input id="name" name="name" type="text" style="width:150px;"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        机构编码：
                    </td>
                    <td class="formField">
                        <input id="code" name="code" type="text" style="width:150px;"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        附加信息：
                    </td>
                    <td class="formField">
                        <input id="ext_data" name="ext_data" type="text" style="width:150px;"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        备注：
                    </td>
                    <td class="formField">
                        <textarea rows="4" name="note" style="width:250px;"></textarea>
                    </td>
                </tr>
            </table>
        </form>
    </div>
</div>
</body>
</html>