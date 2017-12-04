<%--
  User: bearangel
  Date: 11-9-17
  Time: 上午10:15
  处理器管理管理页面
--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
    <jsp:include page="/pages/framework/base.jsp"/>
    <title>处理器管理</title>
    <script type="text/javascript" language="JavaScript" src="pages/rdcp/query/processorManageJs.js"></script>
</head>
<body>
    <jsp:include page="/pages/navbar.jsp"/>
    <div class="modules">
        <div class="barquery">
            <div class="barqueryleft"></div>
            <div class="barquerycenter">处理器管理</div>
            <div class="barqueryright"></div>
            <div class="barquerybtn">
                <a class="btn_add" href="javascript:void(0);" onclick="_openAddProDialog();" title="添加新的处理器">添加</a>
                <!--
                <input name="btn_addition" class="btn_additionout" value="添加" type="button" onclick='_openAddProDialog();'/>
                -->
            </div>
        </div>
            <!--查询表单区域-->
            <form name="processorSearchForm">
                <div class="barquerycontent" align="center">
                    <table class="content_List">
                        <tr>
                            <td align="right" class="contenttd" style="width:100px">处理器名称：</td>
                            <td align="left" style="width:150px">
                                <input type="text" id="proName_s" name="name" class="textbox_css" style="width:100px"/>
                            </td>
                            <td align="right" class="contenttd" style="width:100px">处理器编码：</td>
                            <td align="left" style="width:150px">
                                <input type="text" id="proCode_s" name="code" class="textbox_css" style="width:100px"/>
                            </td>
                            <td align="right" class="contenttd" style="width:100px">
                                    <input class="btnquery_mouseout" onMouseOver="this.className='btnquery_mouseover'"
                                        onMouseOut="this.className='btnquery_mouseout'" type="button" value=""
                                        onclick="GRID.reload('processorList')"/>
                            </td>
                        </tr>
                    </table>
                </div>
            </form>

            <!--列表区域-->
            <table id="processorList" style="margin: 0; padding: 0;"></table>
            <div id="processorPagerdt" style="margin: 0; padding: 0;"></div>
    </div>

    <!--对话框区域-->
    <div>
        <!--添加/编辑执行器对话框-->
        <div id="processorDialog" style="display:none">
            <form name="addProcessorForm" id="addProcessorForm">
                <input type="hidden" name="id" id="proId"/>
                <table align="center" width="100%">
                    <tr class="formRow">
                        <td class="formLabel" style="width:125px">处理器名称：</td>
                        <td class="formField">
                            <input type="text" name="name" style="width:80%;"/>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel" style="width:125px">处理器编码：</td>
                        <td class="formField">
                            <input type="text" name="code" style="width:80%;"/>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel" style="width:125px">处理器类名：</td>
                        <td class="formField">
                            <input type="text" name="class" style="width:80%;"/>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel" style="width:125px">处理器说明：</td>
                        <td class="formField">
                            <textarea name="note" style="width:80%;height:100px;"></textarea>
                        </td>
                    </tr>
                </table>
            </form>
        </div>
    </div>
</body>
</html>