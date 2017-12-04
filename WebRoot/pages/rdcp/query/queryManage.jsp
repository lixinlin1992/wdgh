<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<%@ page import="com.sunrise.foundation.dbutil.DBManager" %>
<%@ page import="com.sunrise.foundation.dbutil.meta.MetaDataHelper,com.sunrise.foundation.utils.StringUtil" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.tools.querydesigner.meta.ConnectionInfo" %>
<%@ page import="com.thoughtworks.xstream.XStream" %>
<%@ page import="com.thoughtworks.xstream.io.xml.DomDriver" %>
<%@ page import="java.sql.Connection" %>
<%--
  User: bearangel
  Date: 11-8-29
  Time: 下午5:16
  查询管理
--%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + request.getServerPort()
            + path + "/";
%>
<html>
<head>
    <jsp:include page="/pages/framework/base.jsp"/>
    <title>查询管理</title>
	<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
	<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>
    <script type="text/javascript" src="scripts/common/ztree.help.js"></script>
    <script type="text/javascript" language="JavaScript" src="scripts/service/module.help.js"></script>
    <script type="text/javascript" language="JavaScript" src="scripts/service/version.help.js"></script>
    <script type="text/javascript" src="scripts/common/encode.js"></script>
    <script type="text/javascript" src="scripts/common/chinese.js"></script>
    <script>
    function queryListLoadComplete(){
        $(".btn_commit").hide();
        $(".btn_undo").hide();
        $(".u_0_<%=LoginUserSession.getLoginUserInfo().getId()%>").show();
    }
    /**
     * 返回请求所需要的参数，包括url，sysCode
     */
    function _getParams(){
        return '<%=basePath%>'+'pages/rdcp/query/connectionInfo.jsp,'+_sysCode;
    }

    </script>
    <script type="text/javascript" language="JavaScript" src="pages/rdcp/query/queryManageJs.js"></script>
</head>
<body>
    <jsp:include page="/pages/navbar.jsp"/>
    <div class="modules">
        <div class="barquery">
            <div class="barqueryleft"></div>
            <div class="barquerycenter">查询管理</div>
            <div class="barqueryright"></div>
            <div class="barquerybtn">
                <a class="btn_undo u_0_<%=LoginUserSession.getLoginUserInfo().getId()%>" href="javascript:void(0);" onclick="_versionRevocationBatch();" title="提交选中的数据">撤销</a>
                <a class="btn_commit u_0_<%=LoginUserSession.getLoginUserInfo().getId()%>" href="javascript:void(0);" onclick="_versionCommitBatch();" title="提交选中的数据">提交</a>
                <a class="btn_add" href="javascript:void(0);" onclick="_addQuery();" title="添加新的查询配置">添加</a>
                <!--
                <input name="btn_addition" class="btn_additionout" value="添加" type="button" onclick='_addQuery();'/>
                -->
            </div>
        </div>
        <table>
            <tr>
                <!--右边数据源树-->
                <td valign="top" style="height:100%;width:150px">
                    <div id="query_tree" class="tree" style="width:150px;height:450px;overflow:auto;"></div>
                </td>

                <!--左边数据源类表-->
                <td valign="top" style="width:550px">
                        <!--查询表单区域-->
                        <form name="queryManagerForm" onsubmit="GRID.reload('queryManagerList');return false;">
                            <div class="barquerycontent" align="center">
                                <table class="content_List">
                                    <tr>
                                        <td align="right" class="contenttd" style="width:100px">模块名称：</td>
                                        <td align="left" style="width:150px">
                                            <input type="text" id="q_sys_code" name="sys_code" style="display: none;"/>
                                            <input type="text" id="moduleName" name="moduleName" class="textbox_css" style="width:100px"/>
                                            <input type="hidden" id="moduleId" name="moduleId" class="textbox_css" style="width:100px"/>
                                            <input type="button" id="moduleNameSelect" name="moduleNameSelect" value="选择" onclick="_moduleNameSelect();">
                                        </td>
                                        <td align="right" class="contenttd" style="width:100px">查询名称：</td>
                                        <td align="left" style="width:150px">
                                            <input type="text" id="queryName" name="queryName" class="textbox_css"/>
                                        </td>
                                        <td align="right" class="contenttd" style="width:100px">查询编码：</td>
                                        <td align="left" style="width:150px">
                                            <input type="text" id="queryCode" name="code" class="textbox_css"/>
                                        </td>
                                        <td align="right" class="contenttd" style="width:100px">
                                            <input class="btnquery_mouseout" onMouseOver="this.className='btnquery_mouseover'"
                                                onMouseOut="this.className='btnquery_mouseout'" type="submit" value="" />
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </form>

                        <!--列表区域-->
                        <table id="queryManagerList" style="margin: 0; padding: 0;"></table>
                        <div id="pagerdt" style="margin: 0; padding: 0;"></div>
                </td>
            </tr>
        </table>
    </div>

    <!--存放对话框-->
    <div>
        <!--查询配置添加表单-->
        <div id="addQueryDialog" style="display:none;">
            <form name="addQueryForm" id="addQueryForm">
                <table class="content_List">
                    <tr>
                        <td align="right" class="contenttd" style="width:150px">查询名称：</td>
                        <td align="left" style="width:150px">
                            <input type="text" id="name_add" name="name" class="textbox_css" onchange="if(document.addQueryForm.code.value==''){document.addQueryForm.code.value=getFirstLetterOfChinesePinyin(this.value);}"/>
                        </td>
                        <td align="right" class="contenttd" style="width:150px">查询编码：</td>
                        <td align="left" style="width:150px">
                            <input type="text" id="code_add" name="code" class="textbox_css"/>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="contenttd" style="width:150px">所属业务系统：</td>
                        <td align="left" style="width:150px">
                            <input type="text" id="sys_name_add" name="sys_name" class="textbox_css"/>
                            <input type="text" id="sys_code_add" name="sys_code" style="display: none;"/>
                        </td>
                        <td align="right" class="contenttd" style="width:150px">所属模块：</td>
                        <td align="left" style="width:150px">
                            <input type="text" id="module_name_add" name="module_name" class="textbox_css"/>
                            <input type="hidden" id="module_id_add" name="module_id" class="textbox_css"/>
                            <input type="button" name="moduleNameSelect" value="选择" onclick="_moduleSelectOnAddQuery();">
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="contenttd" style="width:150px">执行器：</td>
                        <td align="left" style="width:150px">
                            <input type="text" id="executor_name_add" name="executor_name" class="textbox_css"/>
                            <input type="hidden" id="executor_id_add" name="executor_id" class="textbox_css"/>
                            <input type="button" name="executorNameSelect" value="选择" onclick="_openQueryExeDialog();">
                        </td>
                        <td align="right" class="contenttd" style="width:150px">自定义执行器：</td>
                        <td align="left" style="width:150px">
                            <input type="text" id="executor_class_add" name="executor_class" class="textbox_css"/>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="contenttd" style="width:150px">结果类型：</td>
                        <td align="left" style="width:150px">
                            <%--<input type="text" id="executor_result_add" name="executor_result" class="textbox_css"/>--%>
                            <select name="executor_result" id="executor_result_add"><option value="">无</option></select>
                        </td>
                        <td align="right" class="contenttd" style="width:150px">自定义结果类型：</td>
                        <td align="left" style="width:150px">
                            <input type="text" id="custom_result_add" name="custom_result" class="textbox_css"/>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" align="right" class="contenttd" style="width:150px">
                            <input style="margin:10px" type="button" name="addStmt" id="addStmt" value="添加查询语句">
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="contenttd" style="width:150px">查询语句：</td>
                        <td colspan="3" align="left" style="width:150px">
                            <textarea  name="sql_stmt_item" class="textbox_css" style="width:535px;height:100px;"></textarea>
                            <textarea name="query_model" class="textbox_css" style="display:none"></textarea>
                            <span style="float:right">
                                <input style="margin-bottom:5px" type="button"  onclick="_openQueryBuilderDlg(this)" value="查询设计"/> <br/>
                                <input style="margin-bottom:10px" type="button" name="sql_stmt_delete_btn"  value="删除查询"/>
                            </span>
                        </td>
                    </tr>

                    <tr name="sql_stmt_td" style="display:none">
                        <td colspan="4" align="left" style="width:150px">
                            <textarea id="sql_stmt_add" name="sql_stmt" class="textbox_css" style="width:535px;height:150px;"></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="contenttd" style="width:150px">备注：</td>
                        <td colspan="3" align="left" style="width:150px">
                            <textarea id="note_add" name="note" class="textbox_css" style="width:535px;height:60px;"></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" align="right" class="contenttd" style="width:150px">
                            <input type="button" name="addQueryParam" id="addQueryParam" value="添加查询参数">
                        </td>
                    </tr>
                </table>
            </form>
        </div>

        <!--功能模块选择树-->
        <%--<div id="queryTreeDialog" style="display:none;">--%>
            <%--<div id="queryTree" class="tree" style="overflow:auto;"></div>--%>
        <%--</div>--%>

        <!--查询配置参数表单模板-->
        <div id="queryParamTemplate" style="display:none;">
            <table class="content_List">
                <tr><td colspan="4" class="contenttd"><hr style="margin-top:5px;margin-bottom:5px;"></td></tr>
                <tr>
                    <td align="right" class="contenttd" style="width:150px">参数名称：</td>
                    <td align="left" style="width:150px">
                        <input type="text" name="paramName" class="textbox_css"/>
                    </td>
                    <td align="right" class="contenttd" style="width:150px">参数编码：</td>
                    <td align="left" style="width:150px">
                        <input type="text" name="paramCode" class="textbox_css"/>
                    </td>
                </tr>
                <tr>
                    <!--
                    <td align="right" class="contenttd" style="width:150px">参数类型：</td>
                    <td align="left" style="width:150px">
                        <input type="text" name="type" class="textbox_css"/>
                    </td>
                    -->
                    <td align="right" class="contenttd" style="width:150px">参数值：</td>
                    <td colspan="2" align="left" style="width:150px">
                        <textarea style="width:450px" name="value" class="textbox_css"></textarea>
                    </td>
                    <td colspan="3" align="left" style="width:150px">
                        模板处理:<input name="templateFlag" type="checkBox" value="1" checked="true"/>
                    </td>
                </tr>
                <tr>
                    <td align="right" class="contenttd" style="width:150px">备注：</td>
                    <td colspan="2" align="left" style="width:150px">
                        <textarea name="paramNote" style="width:250px" class="textbox_css"></textarea>
                    </td>
                    <td align="center" class="contenttd" style="width:150px">
                        <input type="button" name="deleteParam" value="删除">
                    </td>
                </tr>
            </table>
        </div>

        <!--查询语句表格模板-->
        <div style="display:none">
            <table>
                <tr id="queryStmtTemplate">
                    <td align="right" class="contenttd" style="width:150px">查询语句：</td>
                    <td colspan="3" align="left" style="width:150px">
                        <textarea  name="sql_stmt_item" class="textbox_css" style="width:535px;height:100px;"></textarea>
                        <textarea name="query_model" class="textbox_css" style="display:none"></textarea>
                        <span style="float:right">
                            <input style="margin-bottom:5px" type="button"  onclick="_openQueryBuilderDlg(this)" value="查询设计"/> <br/>
                            <input style="margin-bottom:10px" type="button" name="sql_stmt_delete_btn"  value="删除查询"/>
                        </span>
                    </td>
                </tr>
            </table>
        </div>

        <!--查询配置编辑表单-->
        <div id="editorQueryDialog" style="display:none;">
            <form name="editorQueryForm">
                <input type="hidden" id="queryId_editor" name="id" class="textbox_css"/>
                <table class="content_List">
                    <tr>
                        <td align="right" class="contenttd" style="width:150px">查询名称：</td>
                        <td align="left" style="width:150px">
                            <input type="text" id="name_editor" name="name" class="textbox_css"/>
                        </td>
                        <td align="right" class="contenttd" style="width:150px">查询编码：</td>
                        <td align="left" style="width:150px">
                            <input type="text" id="code_editor" name="code" class="textbox_css"/>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="contenttd" style="width:150px">所属业务系统：</td>
                        <td align="left" style="width:150px">
                            <input type="text" id="sys_name_editor" name="sys_name" class="textbox_css"/>
                            <input type="hidden" id="sys_code_editor" name="sys_code" class="textbox_css"/>
                        </td>
                        <td align="right" class="contenttd" style="width:150px">所属模块：</td>
                        <td align="left" style="width:150px">
                            <input type="text" id="module_name_editor" name="module_name" class="textbox_css"/>
                            <input type="hidden" id="module_id_editor" name="module_id" class="textbox_css"/>
                            <input type="button" name="moduleNameSelect" value="选择" onclick="_moduleSelectOnAddQuery();">
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="contenttd" style="width:150px">执行器：</td>
                        <td align="left" style="width:150px">
                            <input type="text" id="executor_name_editor" name="executor_name" class="textbox_css"/>
                            <input type="hidden" id="executor_id_editor" name="executor_id" class="textbox_css"/>
                            <input type="button" name="executorNameSelect" value="选择" onclick="_openQueryExeDialog();">
                        </td>
                        <td align="right" class="contenttd" style="width:150px">自定义执行器：</td>
                        <td align="left" style="width:150px">
                            <input type="text" id="executor_class_editor" name="executor_class" class="textbox_css"/>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="contenttd" style="width:150px">结果类型：</td>
                        <td align="left" style="width:150px">
                            <%--<input type="text" id="executor_result_editor" name="executor_result" class="textbox_css"/>--%>
                            <select name="executor_result" id="executor_result_selector"><option value="">无</option></select>
                        </td>
                        <td align="right" class="contenttd" style="width:150px">自定义结果类型：</td>
                        <td align="left" style="width:150px">
                            <input type="text" id="custom_result_editor" name="custom_result" class="textbox_css"/>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="contenttd" style="width:150px">查询语句：</td>
                        <td colspan="3" align="left" style="width:150px">
                            <textarea id="sql_stmt_editor" name="sql_stmt" class="textbox_css" style="width:570px;height:150px;"></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="contenttd" style="width:150px">备注：</td>
                        <td colspan="3" align="left" style="width:150px">
                            <textarea id="note_editor" name="note" class="textbox_css" style="width:600px"></textarea>
                        </td>
                    </tr>
                </table>
            </form>
            <!--查询配置参数列表-->
            <form name="queryParamFrom">
                <input type="hidden" name="queryId" id="query_id_param">
            </form>

            <input value="添加查询语句" type="button" onclick='_addQueryStmtDlg();'/>
            <table id="queryStmtList" style="margin: 0; padding: 0;"></table>
            <div id="queryStmtPagerdt" style="margin: 0; padding: 0;"></div>

            <input value="添加参数" type="button" onclick='_openAddQueryParamDialog();'/>
            <table id="queryParamList" style="margin: 0; padding: 0;"></table>
            <div id="queryParamPagerdt" style="margin: 0; padding: 0;"></div>
        </div>

        <!--查询配置参数表单模板-->
        <div id="queryParamEditorDialog" style="display:none;">
            <form name="queryParamEditorForm" id="queryParamEditorForm">
                <input type="hidden" name="_queryId" id="queryIdForParam" class="textbox_css"/>
                <input type="hidden" name="id" id="queryParamId" class="textbox_css"/>
                <table class="content_List">
                    <tr>
                        <td align="right" class="contenttd" style="width:150px">参数名称：</td>
                        <td align="left" style="width:150px">
                            <input type="text" name="paramName" class="textbox_css"/>
                        </td>
                        <td align="right" class="contenttd" style="width:150px">参数编码：</td>
                        <td align="left" style="width:150px">
                            <input type="text" name="paramCode" class="textbox_css"/>
                        </td>
                    </tr>
                    <tr>
                        <!--
                        <td align="right" class="contenttd" style="width:150px">参数类型：</td>
                        <td align="left" style="width:150px">
                            <input type="text" name="type" class="textbox_css"/>
                        </td>
                        -->
                        <td align="right" class="contenttd" style="width:150px">参数值：</td>
                        <td colspan="2" align="left" style="width:150px">
                            <textarea style="width:300px;height:100px;" name="value" class="textbox_css"></textarea>
                        </td>
                        <td colspan="3" align="left" style="width:150px">
                            模板处理:<input name="templateFlag" type="checkBox" value="1" checked="true"/>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="contenttd" style="width:150px">备注：</td>
                        <td colspan="3" align="left" style="width:150px">
                            <textarea type="text" name="paramNote" style="width:350px" class="textbox_css"></textarea>
                        </td>
                    </tr>
                </table>
            </form>
        </div>


        <!--查询执行器列表-->
        <div id="queryExeDialog" style="display:none;">
            <table id="queryExeList" style="margin: 0; padding: 0;"></table>
            <div id="queryExePagerdt" style="margin: 0; padding: 0;"></div>
        </div>

        <!--查询处理器配置列表对话框-->
        <div id="queryProcessorCfgDialog" style="display:none;">
            <form name="queryProcessorCfgForm">
                <input type="hidden" name="queryId" id="queryId_pro"/>
            </form>
            <%--<input name="btn_addition" class="btn_additionout" value="添加" type="button" style="margin-left:10px;margin-top:10px" onclick='_addQueryProcessorDialog();'/>--%>
            <div style="text-align: right;padding: 2px;">
            <a href="javascript:void(0);" class="btn_add" onclick="_addQueryProcessorDialog();" title="添加处理器">添加</a>
            </div>
            <table id="queryProcessorCfgList" style="margin: 0; padding: 0;"></table>
            <div id="queryProcessorCgfPagerdt" style="margin: 0; padding: 0;"></div>
        </div>

        <!--添加/编辑处理器器表单-->
        <div id="queryProcessorEditorDialog" style="display:none;">
            <form name="queryProEditorForm" id="queryProEditorForm">
                <input type="hidden" name="id"/>
                <input type="hidden" name="query_id" id="query_id_pro_editor"/>
                <table align="center">
                    <tr class="formRow">
                        <td class="formLabel" style="width:125px">处理器名称：</td>
                        <td class="formField">
                            <input type="text" name="processor_name" id="processor_name"/>
                            <input type="button" value="选择" style="width:50px" onclick="_openQueryProDialog();" />
                            <input type="hidden" name="processor_id" id="processor_id"/>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">自定义处理器：</td>
                        <td class="formField">
                            <input type="text" name="processor_class" id="processor_class" style="width:180px"/>

                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">处理器类型：</td>
                        <td class="formField">
                            <label><input type="radio" name="type" value="0" id="processor_type_1"/>预处理</label>
                            <label><input type="radio" name="type" value="1" id="processor_type_2"/>后处理</label>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">处理器顺序：</td>
                        <td class="formField">
                            <input type="text" name="seq_num" id="processor_seq_num" style="width:180px"/>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">是否中断：</td>
                        <td class="formField">
                            <label><input type="radio" name="break_flag" id="processor_break_flag_1" value="0"/>不中断</label>
                            <label><input type="radio" name="break_flag" id="processor_break_flag_2" value="1"/>中断</label>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">备注：</td>
                        <td class="formField">
                            <textarea name="note" id="processor_note"></textarea>
                        </td>
                    </tr>
                </table>
            </form>

            <table id="queryProcessorParamList" style="margin: 0; padding: 0;"></table>
            <div id="queryProcessorParamPagerdt" style="margin: 0; padding: 0;"></div>
        </div>

        <!--查询处理器列表对话框-->
        <div id="queryProcessorDialog" style="display:none;">
            <table id="queryProcessorList" style="margin: 0; padding: 0;"></table>
            <div id="queryProcessorPagerdt" style="margin: 0; padding: 0;"></div>
        </div>


         <!--查询处理器参数对话框-->
        <div id="processorParamDialog" style="display:none;">
            <form name="processorParamForm" id="processorParamForm">
                <input type="hidden" name="id"/>
                <input type="hidden" name="query_id" class="textbox_css"/>
                <input type="hidden" name="processor_id" class="textbox_css"/>
                <table align="center">
                    <tr class="formRow">
                        <td class="formLabel">参数名称：</td>
                        <td class="formLabel">
                            <input type="text" name="name" class="textbox_css"/>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">参数编码：</td>
                        <td class="formLabel">
                            <input type="text" name="code" class="textbox_css"/>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <!--
                        <td align="right" class="contenttd" style="width:150px">参数类型：</td>
                        <td align="left" style="width:150px">
                            <input type="text" name="type" class="textbox_css"/>
                        </td>
                        -->
                        <td class="formLabel">参数值：</td>
                        <td class="formLabel">
                            <textarea style="width:250px;height:60px;" name="value" class="textbox_css"></textarea>
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">备注：</td>
                        <td class="formLabel">
                            <textarea type="text" name="note" style="width:250px;height:60px;" class="textbox_css"></textarea>
                        </td>
                    </tr>
                </table>
            </form>
        </div>

        <!--添加/编辑处理器器表单-->
        <div id="queryStmtDlg" style="display:none">
            <form name="queryStmtform" id="queryStmtform">
                <table align="center">
                    <tr class="formRow">
                        <td class="formLabel">查询语句：</td>
                        <td class="formLabel">
                            <textarea name="sql_stmt_item" style="width:350px;height:150px;" class="textbox_css"></textarea>
                            <input style="margin-bottom:5px" name="designBtn" type="button"  onclick="_openQueryBuilderDlg(this)" value="查询设计"/>
                            <textarea style="display:none"  name="query_model" ></textarea>
                            <input type="hidden" name="id" />
                        </td>
                    </tr>
                </table>
            </form>
        </div>

        <div style="display:none;" id="queryBuilderDig">
            <jsp:plugin name="queryBuilder" type="applet"
                    code="com.sunrise.tools.querydesigner.applet.QueryBuilderApplet.class"
                    archive="queryBuilder.jar,xstream-1.4.2.jar,xpp3_min-1.1.4c.jar,xmlpull-1.1.3.1.jar"
                    height="450px" width="800px">
                <jsp:fallback>您好，您的浏览器不支持Applet，不能使用Applet</jsp:fallback>
            </jsp:plugin>

        </div>
    </div>
</body>
</html>