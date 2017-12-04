<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
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
    <script type="text/javascript" src="pages/rdcp/page/templateManage.js"></script>
</head>
<body>
<jsp:include page="/pages/navbar.jsp"/>
<div class="modules">
    <div class="barquery">
        <div class="barqueryleft"></div>
        <div class="barquerycenter">模板管理</div>
        <div class="barqueryright"></div>
        <div class="barquerybtn">
            <a class="btn_add" href="javascript:void(0);" onclick="addTemplate();" title="添加新的模板">添加</a>
            <!--
            <input name="btn_addition" class="btn_additionout" value="添加" type="button"
                   onclick='addTemplate();'/>
                   -->
        </div>
    </div>
          <!--查询表单区域-->
          <form name="templateManagerForm" onsubmit="GRID.reload('templateList');return false;">
                <div class="barquerycontent" align="center">
                     <table class="content_List">
                         <tr>
                             <td align="right" class="contenttd" style="width:80px">模板名称：</td>
                             <td align="left">
                                 <input type="text" id="templateName" name="templateName" class="textbox_css"/>
                                 <input class="btnquery_mouseout" onMouseOver="this.className='btnquery_mouseover'"
                                        onMouseOut="this.className='btnquery_mouseout'" type="submit" value=""/>
                             </td>
                         </tr>
                     </table>
               </div>
          </form>
          <table id="templateList" style="margin: 0; padding: 0;"></table>
          <div id="pagerdt" style="margin: 0; padding: 0;"></div>
</div>
<div id="Template_Edit_Dlg" style="height:98%;display:none;">
    <iframe id="_EditFrame" name="EditFrame" src="" width="100%" height="100%"
            frameborder="0" style="margin:0 auto;"></iframe>
</div>
</body>
</html>