<%--
  User: bearangel
  Date: 11-9-17
  Time: 上午10:15
  执行器管理管理页面
--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
    <jsp:include page="/pages/framework/base.jsp"/>
    <title>执行器管理</title>
    <script type="text/javascript" language="JavaScript" src="pages/rdcp/query/executorManageJs.js"></script>
</head>
<body>
    <jsp:include page="/pages/navbar.jsp"/>
    <div class="modules">
        <div class="barquery">
            <div class="barqueryleft"></div>
            <div class="barquerycenter">执行器管理</div>
            <div class="barqueryright"></div>
            <div class="barquerybtn">
                <a class="btn_add" href="javascript:void(0);" onclick="_openAddExeDialog();" title="添加新的查询执行器">添加</a>
                <!--
                <input name="btn_addition" class="btn_additionout" value="添加" type="button" onclick='_openAddExeDialog();'/>
                -->
            </div>
        </div>

            <!--查询表单区域-->
            <form name="exeManageSearchForm">
                <div class="barquerycontent" align="center">
                    <table class="content_List">
                        <tr>
                            <td align="right" class="contenttd" style="width:100px">执行器名称：</td>
                            <td align="left" style="width:150px">
                                <input type="text" id="exeName_s" name="name" class="textbox_css" style="width:100px"/>
                            </td>
                            <td align="right" class="contenttd" style="width:100px">执行器编码：</td>
                            <td align="left" style="width:150px">
                                <input type="text" id="exeCode_s" name="code" class="textbox_css" style="width:100px"/>
                            </td>
                            <td align="right" class="contenttd" style="width:100px">
                                    <input class="btnquery_mouseout" onMouseOver="this.className='btnquery_mouseover'"
                                        onMouseOut="this.className='btnquery_mouseout'" type="button" value=""
                                        onclick="GRID.reload('exeManagerList')"/>
                            </td>
                        </tr>
                    </table>
                </div>
            </form>

            <!--列表区域-->
            <table id="exeManagerList" style="margin: 0; padding: 0;"></table>
            <div id="exeManagerPagerdt" style="margin: 0; padding: 0;"></div>
    </div>

    <!--对话框区域-->
    <div>
        <!--添加/编辑执行器对话框-->
        <div id="executorDialog" style="display:none">
            <form name="addExecutorForm" id="addExecutorForm">
                <input type="hidden" name="id" id="exeId"/>
                <table align="center" width="100%">
                    <tr class="formRow">
                        <td class="formLabel" style="width:125px">执行器名称：</td>
                        <td class="formField">
                            <input type="text" name="name" style="width:80%;"/>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel" style="width:125px">执行器编码：</td>
                        <td class="formField">
                            <input type="text" name="code" style="width:80%;"/>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel" style="width:125px">执行器类名：</td>
                        <td class="formField">
                            <input type="text" name="class" style="width:80%;"/>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel" style="width:125px">结果类型：</td>
                        <td class="formField">
                            <input type="text" name="results" style="width:80%;"/>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel" style="width:125px">执行器说明：</td>
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