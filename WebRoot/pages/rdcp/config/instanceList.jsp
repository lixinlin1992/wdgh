<%--
File: instanceList
User: kinz
Date: 11-6-13 下午4:24
模板实例管理

--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<html>
<head>
    <title>模板实例管理</title>
    <jsp:include page="/pages/framework/base.jsp"/>
    <script type="text/javascript" language="JavaScript" src="pages/rdcp/config/instanceList.js"></script>
</head>
<body>
<jsp:include page="/pages/navbar.jsp"/>
<div class="modules">
    <div class="barquery">
        <div class="barqueryleft"></div>
        <div class="barquerycenter">模板实例管理</div>
        <div class="barqueryright"></div>
        <div class="barquerybtn">
            <input name="btn_addition" class="btn_additionout" value="添加" type="button"
                   onclick='addInstance();'/>
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
                                    <td align="right" class="contenttd" style="width:150px">模板名称：</td>
                                    <td align="left" style="width:150px">
                                        <input id="Q_template_name" name="template_name" class="textbox_css"
                                               style="width:100px"/>
                                    </td>
                                    <td align="right" class="contenttd" style="width:150px">实例名称：</td>
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
                        <table id="instanceList" style="margin: 0; padding: 0;"></table>
                        <div id="pagerdt" style="margin: 0; padding: 0;"></div>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</div>
<div>
    
</div>
</body>
</html>