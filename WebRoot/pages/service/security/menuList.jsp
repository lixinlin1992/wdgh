<%--
File: menuList.jsp
User: kinz
Date: 11-4-17 上午12:48

菜单管理页面

--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
    <title>菜单管理</title>
    <jsp:include page="/pages/framework/base.jsp"/>
	<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
	<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>
    <script type="text/javascript" src="scripts/common/ztree.help.js"></script>
    <script type="text/javascript" src="scripts/service/function.help.js"></script>
    <script type="text/javascript" src="pages/service/security/menuList.js"></script>
</head>
<body>
<jsp:include page="/pages/navbar.jsp"/>
<div class="modules">
    <div class="barquery">
        <div class="barqueryleft"></div>
        <div class="barquerycenter">系统菜单维护</div>
        <div class="barqueryright"></div>
        <div class="barquerybtn">
            <input name="btn_addition" class="btn_additionout" value="添加" type="button"
                   onclick='addMenu();'/>
        </div>
    </div>
    <table width="100%">
        <tr>
            <td valign="top" style="height:100%;width:250px;">
                <div id="MENU_TREE" class="tree" style="height:500px;overflow:auto;"></div>
            </td>
            <td valign="top">
                <div class="barquerycontent" align="center">
                    <form name="QueryForm"
                          onsubmit="GRID.reload('menuList');return false;">
                        <div class="barquerycontent" align="center">
                            <table class="content_List">
                                <tr>
                                    <td align="right" class="contenttd" style="width:100px">上级菜单：</td>
                                    <td align="left" style="width:150px">
                                        <input name="parent_level_id" id="Q_parent_level_id" type="hidden" value="0"/>
                                        <input name="parent_id" type="hidden" id="Q_menu_id"/>
                                        <input id="Q_menu_name" name="module_name" class="textbox_css"
                                               readonly="readonly" style="width:100px"/>
                                        <input type="button" class="btnfunctionout" value="撤销"
                                               onclick="queryMenuSelect();"/>
                                    </td>
                                    <td align="right" class="contenttd" style="width:100px">菜单名称：</td>
                                    <td align="left"><input type="text" name="name" class="textbox_css"></td>
                                    <td align="right" class="contenttd" style="width:100px">功能名称：</td>
                                    <td align="left"><input type="text" name="function_name" class="textbox_css"/>
                                        <input class="btnquery_mouseout"
                                               onmouseover="this.className='btnquery_mouseover'"
                                               onmouseout="this.className='btnquery_mouseout'" type="submit" value=""/>
                                    </td>

                                </tr>
                            </table>

                        </div>
                    </form>
                    <div>
                        <table id="menuList" style="margin: 0; padding: 0;"></table>
                        <div id="pagerdt" style="margin: 0; padding: 0;"></div>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</div>

<div id="Menu_Edit_Dlg" style="display:none;">
    <div class="modules" style="height:300px;">
        <form name="MenuEditForm" onsubmit="return false;">
            <input name="id" type="hidden">
            <table align="center">
                <tr class="formRow">
                    <td class="formLabel" width="100">
                        上级菜单：
                    </td>
                    <td class="formField">
                        <input type="text" name="parent_id" readonly="readonly">
                        <input type="text" name="parent_name" readonly="readonly">
                        <input type="button" name="menu_sel_btn" id="I_menu_sel_btn" class="btnfunctionout" value="选择"
                               onclick="selectParentMenu();"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">菜单级别</td>
                    <td class="formField">
                        <input type="hidden" name="level_id" value="1">
                        <input type="text" name="level_name" value="一级菜单" readonly="readonly">
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        菜单名称：
                    </td>
                    <td class="formField">
                        <input name="name" type="text" style="width:150px;"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        功能映射：
                    </td>
                    <td class="formField">
                        <input type="hidden" name="function_id">
                        <input name="function_name" type="text" style="width:150px;" readonly="readonly">
                        <input type="button" name="func_sel_btn" id="I_func_sel_btn" class="btnfunctionout" value="选择"
                               onclick="selectFunction();"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        菜单排序：
                    </td>
                    <td class="formField">
                        <input name="order_id" type="text" style="width:150px;"/>
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