<%--
File: functionList.jsp
User: kinz
Date: 11-3-31 上午9:27

    对系统功能进行维护
--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>系统功能维护</title>
    <jsp:include page="/pages/framework/base.jsp"/>
	<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
	<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>
    <script type="text/javascript" src="scripts/common/ztree.help.js"></script>
    <script type="text/javascript" src="scripts/service/function.help.js"></script>
    <script type="text/javascript" src="pages/service/security/functionList.js"></script>
</head>
<body>
<jsp:include page="/pages/navbar.jsp"/>
<div class="modules">
    <div class="barquery">
        <div class="barqueryleft"></div>
        <div class="barquerycenter">系统功能维护</div>
        <div class="barqueryright"></div>
        <div class="barquerybtn">
            <input name="btn_addition" class="btn_additionout" value="添加" type="button"
                   onclick='addFunction();'/>
            <input type="button" class="btn_excelout" value="导出" id="jxl_expt">
        </div>
    </div>
    <table width="100%">
        <tr>
            <td valign="top" style="height:100%;width:250px;">
                <input name="btn_addition" class="btn_additionout" value="添加" type="button"
                       onclick='addModule();'/>
                <input name="btn_addition" class="btnbg" value="修改" type="button"
                       onclick='editModule();'/>
                <input name="btn_addition" class="btnbg" value="删除" type="button"
                       onclick='delModule();'/>

                <div id="MODULE_TREE" class="tree" style="height:500px;overflow:auto;"></div>
            </td>
            <td valign="top">
                <div class="barquerycontent" style="width: 820px;" align="center">
                    <form name="QueryForm"
                          onsubmit="GRID.reload('funcList');return false;">
                        <div class="barquerycontent" align="center">
                            <table class="content_List">
                                <tr>
                                    <td align="right" class="contenttd" style="width:150px">模块名称：</td>
                                    <td align="left" style="width:150px">
                                        <input name="module_id" type="hidden" id="Q_module_id"/>
                                        <input id="Q_module_name" name="module_name" class="textbox_css"
                                               readonly="readonly" style="width:100px"/>
                                        <input type="button" class="btnfunctionout" value="撤销"
                                               onclick="queryModuleSelect();"/>
                                    </td>
                                    <td align="right" class="contenttd" style="width:150px">功能名称：</td>
                                    <td align="left"><input type="text" name="func_name" class="textbox_css"/>
                                        <input class="btnquery_mouseout"
                                               onmouseover="this.className='btnquery_mouseover'"
                                               onmouseout="this.className='btnquery_mouseout'" type="submit" value=""/>
                                    </td>

                                </tr>
                            </table>

                        </div>
                    </form>
                    <div>
                        <table id="funcList" style="margin: 0; padding: 0;"></table>
                        <div id="pagerdt" style="margin: 0; padding: 0;"></div>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</div>
<div id="Func_Edit_Dlg" style="display:none;">
    <div class="modules" style="height:300px;width:100%;">
        <form name="EditForm" onsubmit="return false;">
            <table align="center">
                <tr class="formRow">
                    <td class="formLabel">
                        所属模块：
                    </td>
                    <td class="formField">
                        <input id="module_id" name="module_id" readonly="readonly" type="text" style="width:80px;"/>
                        <input id="module_name" name="module_name" disabled="disabled" type="text"
                               style="width:120px;"/>
                        <input type="button" name="module_sel_btn" class="btnfunctionout" value="选择"
                               onclick="selectModule();"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        功能编号：
                    </td>
                    <td class="formField">
                        <input id="id" name="id" type="text" style="width:150px;"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        功能名称：
                    </td>
                    <td class="formField">
                        <input id="name" name="name" type="text" style="width:150px;"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        功能码：
                    </td>
                    <td class="formField">
                        <input id="code" name="code" type="text" style="width:150px;"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        功能类型：
                    </td>
                    <td class="formField">
                        <label><input type="radio" name="type" value="0">普通功能</label>
                        <label><input type="radio" name="type" value="1" checked="true">菜单功能</label>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        授权规则：
                    </td>
                    <td class="formField">
                        <label><input type="radio" name="access_rule" value="0" checked="true">无需授权</label>
                        <label><input type="radio" name="access_rule" value="1">普通授权</label>
                        <label><input type="radio" name="access_rule" value="2">依赖授权</label>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        依赖功能：
                    </td>
                    <td class="formField">
                        <input type="hidden" name="depend_id" id="depend_id">
                        <input type="text" name="depend_name" id="depend_name" readonly="readonly" style="width:150px;">
                        <input type="button" class="btnfunctionout" value="选择" onclick="selectFunction();"/>
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

<div id="Module_Edit_Dlg" style="display:none;">
    <div class="modules" style="height:200px;">
        <form name="ModuleEditForm" onsubmit="return false;">
            <input name="id" type="hidden">
            <table align="center">
                <tr class="formRow">
                    <td class="formLabel">
                        上级模块：
                    </td>
                    <td class="formField">
                        <input id="parent_module_id" name="parent_id" readonly="readonly" type="text"
                               style="width:80px;" value="0"/>
                        <input id="parent_module_module_name" name="parent_name" disabled="disabled" type="text"
                               style="width:120px;"/>
                        <input type="button" name="module_sel_btn" class="btnfunctionout" value="选择"
                               onclick="selectParentModule();"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        模块名称：
                    </td>
                    <td class="formField">
                        <input name="name" type="text" style="width:150px;"/>
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

<div id="Func_DataSource_List" style="display: none;">
    添加数据源：
    <input type="hidden" name="datasource_id" id="_DataSource_Id">
    <input type="text" name="dsName" id="_DataSource_Note">
    <label><input type="radio" name="main_flag" value="0" id="_Main_Flag_0" checked="checked">普通</label>
    <label><input type="radio" name="main_flag" value="1" id="_Main_Flag_1">主要</label>
    <input type="button" value="添加" onclick="addFuncDataSource();">
    <table id="funcDataSourceList" style="margin: 0; padding: 0;"></table>
</div>
<div id="Func_DataSource_Add" style="display: none;">

</div>
<form name="FuncDataSourceForm">
    <input type="hidden" name="paging" value="false">
    <input type="hidden" name="function_id" value="">
</form>
</body>
</html>