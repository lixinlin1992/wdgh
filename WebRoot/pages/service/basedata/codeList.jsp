<%--
File: codeList.jsp
User: kinz
Date: 11-7-7 下午4:08


--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>编码维护</title>
    <jsp:include page="/pages/framework/base.jsp"/>
    <script type="text/javascript" src="pages/service/basedata/codeList.js"></script>
</head>
<body>
<%
%>
<jsp:include page="/pages/navbar.jsp"/>
<div class="modules">
    <div class="barquery">
        <div class="barqueryleft"></div>
        <div class="barquerycenter">编码维护</div>
        <div class="barqueryright"></div>
        <div class="barquerybtn">
            <a class="btn_add" href="javascript:void(0);" onclick="addCode();" title="添加新的编码">添加</a>
        </div>
    </div>
    <center>
        <form name="QueryForm" onsubmit="GRID.reload('listtable');return false;">
            <div class="barquerycontent" align="center">
                <table class="content_List">
                    <tr>
                        <td align="right" class="contenttd" style="width:80px;">系统：</td>
                        <td align="left"><select name="sys_code" id="Q_sys_code" onchange="sysCodeSelectChanged(this.value,'code_type_id');"><option value="">--请选择--</option></select></td>
                        <td align="right" class="contenttd" style="width:80px">编码类型：</td>
                        <td align="left">
                            <select name="code_type_id" id="code_type_id">
                                <option value="">--请选择--</option>
                            </select></td>
                        <td align="right" class="contenttd" style="width:80px">编码名称：</td>
                        <td align="left" style="width:130px"><input name="code_name" class="textbox_css"
                                                                    style="width:120px"/></td>
                        <td align="right" class="contenttd" style="width:100px">状态：</td>
                        <td align="left">
                            <select name="status_id">
                                <option value="">--请选择--</option>
                                <option value="1">有效</option>
                                <option value="0">无效</option>
                            </select>
                            <input class="btnquery_mouseout" onmouseover="this.className='btnquery_mouseover'"
                                   onmouseout="this.className='btnquery_mouseout'" type="submit" value=""/>
                        </td>
                    </tr>
                </table>

            </div>
        </form>
		<div>
			<table id="listtable" style="margin: 0; padding: 0;"></table>
			<div id="pagered" style="margin: 0; padding: 0;"></div>
		</div>
        <div id="EditDialog" style="display: none; width: 280px;" class="modules">
            <form name="EditForm" onsubmit="return false;">
                <table align="center">
                    <tr class="formRow">
                        <td class="formLabel">
                            编码编码：
                        </td>
                        <td class="formField">
                            <input type="hidden" name="id"/>
                            <input id="code_num" name="code_num" type="text" style="width:150px;"/>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">
                            编码名称：
                        </td>
                        <td class="formField">
                            <input id="name" name="name" type="text" style="width:150px;"/>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">系统：</td>
                        <td class="formField">
                            <select name="sys_code" id="E_sys_code" onchange="sysCodeSelectChanged(this.value,'edit_code_type_id');"><option value="">--请选择--</option> </select>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">
                            编码类型：
                        </td>
                        <td class="formField">
                            <select id="edit_code_type_id"  name="edit_code_type"
                                    onchange="document.EditForm.code_table.value = this.value==''?'':this.value.split('.')[0];document.EditForm.code_field.value = this.value==''?'':this.value.split('.')[1];"></select>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">
                            业务表：
                        </td>
                        <td class="formField">
                            <input name="code_table" type="text" readonly="readonly" style="width:150px;"/>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">
                            业务字段：
                        </td>
                        <td class="formField">
                            <input name="code_field" type="text" readonly="readonly" style="width:150px;"/>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">
                            排序：
                        </td>
                        <td class="formField">
                            <input id="order_id" name="order_id" type="text" style="width:150px;"/>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">
                            编码备注：
                        </td>
                        <td class="formField">
                            <textarea id="note" name="note" cols="22" rows="5" style="width:150px;"></textarea>
                        </td>
                    </tr>
                </table>

            </form>
        </div>
    </center>
</div>
</body>
</html>