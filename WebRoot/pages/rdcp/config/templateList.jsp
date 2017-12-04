<%--
File: templateList
User: kinz
Date: 11-6-10 下午9:46

模板管理

--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<html>
<head>
    <title>模板管理</title>
    <jsp:include page="/pages/framework/base.jsp"/>
    <script type="text/javascript" src="pages/rdcp/config/templateList.js"></script>
</head>
<body>
<jsp:include page="/pages/navbar.jsp"/>
<div class="modules">
    <div class="barquery">
        <div class="barqueryleft"></div>
        <div class="barquerycenter">模板管理</div>
        <div class="barqueryright"></div>
        <div class="barquerybtn">
            <input name="btn_addition" class="btn_additionout" value="添加" type="button"
                   onclick='addTemplate();'/>
        </div>
    </div>
    <table width="100%">
        <tr>
            <td valign="top">
                <div class="barquerycontent" style="padding: 10px;" align="center">
                    <form name="QueryForm"
                          onsubmit="GRID.reload('templateList');return false;">
                        <div class="barquerycontent" align="center">
                            <table class="content_List">
                                <tr>
                                    <%--<td align="right" class="contenttd" style="width:150px">模块名称：</td>--%>
                                    <%--<td align="left" style="width:150px">--%>
                                    <%--<input name="module_id" type="hidden" id="Q_module_id"/>--%>
                                    <%--<input id="Q_module_name" name="module_name" class="textbox_css"--%>
                                    <%--readonly="readonly" style="width:100px"/>--%>
                                    <%--<input type="button" class="btnfunctionout" value="撤销"--%>
                                    <%--onclick="queryModuleSelect();"/>--%>
                                    <%--</td>--%>
                                    <%--<td align="right" class="contenttd" style="width:150px">功能名称：</td>--%>
                                    <%--<td align="left"><input type="text" name="func_name" class="textbox_css"/>--%>
                                    <%--<input class="btnquery_mouseout"--%>
                                    <%--onmouseover="this.className='btnquery_mouseover'"--%>
                                    <%--onmouseout="this.className='btnquery_mouseout'" type="submit" value=""/>--%>
                                    <%--</td>--%>
                                </tr>
                            </table>

                        </div>
                    </form>
                    <div style="width:98%;">
                        <table id="templateList" style="margin: 0; padding: 0;"></table>
                        <div id="pagerdt" style="margin: 0; padding: 0;"></div>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</div>
<div id="Template_Edit_Dlg" style="display:none;">
    <iframe id="_EditFrame" name="EditFrame" src="" width="100%" height="100%"
            frameborder="0" style="margin:0 auto;"></iframe>
</div>
</body>
</html>