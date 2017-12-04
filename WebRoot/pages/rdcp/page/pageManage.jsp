<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%--
  User: 李嘉伟
  Date: 11-9-6
  Time: 15:28
  页面配置管理
--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<html>
<head>
    <jsp:include page="/pages/framework/base.jsp"/>
    <title>页面配置管理</title>
	<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
	<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>
    <script type="text/javascript" src="scripts/common/ztree.help.js"></script>
    <script type="text/javascript" src="scripts/service/module.help.js"></script>
    <script type="text/javascript" src="scripts/common/encode.js"></script>
    <script type="text/javascript" src="scripts/common/chinese.js"></script>
    <script type="text/javascript" language="JavaScript" src="scripts/service/version.help.js"></script>
<script>
function pageListLoadComplete(){
    $(".btn_commit").hide();
    $(".btn_undo").hide();
    $(".u_0_<%=LoginUserSession.getLoginUserInfo().getId()%>").show();
}

/**
 * 版本提交处理函数
 * @param id
 */
function _versionCommit(id,sysCode) {
    if(id==undefined){
        //撤销所有选中的数据源，需要过滤掉不是当前用户编辑的数据
        var _datas = [];
        var _ds = GRID.getSelectRow("pageManagerList");
        $.each(_ds,function(i,n){
            if(n["EDIT_USER"] != "<%=LoginUserSession.getLoginUserInfo().getId()%>" || n["EDIT_STATUS"] != "0")
                return;
            _datas.push({
                "key":"ID",
                "keyvalue":n["PAGE_ID"],
                "tablename":"RDC_CFG_PAGE",
                "objectname":n["页面名称"],
                "syscode":n["SYS_CODE"]
            });
        });
        if(_datas.length == 0){
            CORE.tip("请先选中您正在编辑的数据再进行撤销");
            return;
        }
        VERSION.versionCommitBatch(_datas,function(body,header){
            if (header.code == 0) {
                GRID.reload("pageManagerList");   //刷新列表
            }
        });
    }else{
        VERSION.versionCommit("ID", id, "RDC_CFG_PAGE",sysCode, function(body, header) {
            if (header.code == 0) {
                GRID.reload("pageManagerList");   //刷新列表
            }
        });
    }
}
/**
 * 版本撤销
 * @param id
 * @param objectName
 */
function _versionRevocation(key,keyValue,sysCode,objectName){
    if(key==undefined){
        //撤销所有选中的数据源，需要过滤掉不是当前用户编辑的数据
        var _datas = [];
        var _ds = GRID.getSelectRow("pageManagerList");
        $.each(_ds,function(i,n){
            if(n["EDIT_USER"] != "<%=LoginUserSession.getLoginUserInfo().getId()%>" || n["EDIT_STATUS"] != "0")
                return;
            _datas.push({
                "key":"ID",
                "keyvalue":n["PAGE_ID"],
                "tablename":"RDC_CFG_PAGE",
                "objectname":n["页面名称"],
                "syscode":n["SYS_CODE"]
            });
        });
        if(_datas.length == 0){
            CORE.tip("请先选中您正在编辑的数据再进行撤销");
            return;
        }
        VERSION.versionRevocationBatch(_datas,function(body,header){
            if (header.code == 0) {
                GRID.reload("pageManagerList");   //刷新列表
            }
        });
    }else{
        VERSION.versionRevocation(key,keyValue,"RDC_CFG_PAGE",sysCode,objectName,function(){
            GRID.reload("pageManagerList");
        });
    }
}
</script>
    <script type="text/javascript" language="JavaScript" src="pages/rdcp/page/pageManage.js"></script>
</head>
<body>
    <jsp:include page="/pages/navbar.jsp"/>
    <div class="modules">
        <div class="barquery">
            <div class="barqueryleft"></div>
            <div class="barquerycenter">页面配置管理</div>
            <div class="barqueryright"></div>
            <div class="barquerybtn">
                <a class="btn_add" href="javascript:void(0);" onclick="_addPage();" title="从模板添加新的页面">从模板添加</a>
                <a class="btn_add" href="javascript:void(0);" onclick="_addPageOnlyContainer();" title="添加新的空白页面">添加</a>
                <a class="btn_delete" href="javascript:void(0);" onclick="_delPages();" title="删除选中的页面">删除</a>
                <a class="btn_commit u_0_<%=LoginUserSession.getLoginUserInfo().getId()%>" href="javascript:void(0);" onclick="_versionCommit();" title="提交选中的所有修改">提交</a>
                <a class="btn_undo u_0_<%=LoginUserSession.getLoginUserInfo().getId()%>" href="javascript:void(0);" onclick="_versionRevocation();" title="撤销选中的所有修改">撤销</a>
                <!--
                <input name="btn_addition" class="btn_deleteout" value="删除" type="button" onclick='_delPages();'/>
                <input name="btn_addition" class="btn_additionout" value="添加" type="button" onclick='_addPage();'/>
                -->
            </div>
        </div>
        <table width="100%">
            <tr>
                <!--右边页面管理树-->
                <td valign="top" style="height:100%;width:15%;">
                    <div id="page_tree" class="tree" style="height:500px;overflow:auto;"></div>
                </td>

                <!--左边页面列表-->
                <td valign="top" style="width:85%;">
                        <!--查询表单区域-->
                        <form name="pageManagerForm" onsubmit="GRID.reload('pageManagerList');return false;">
                            <input type="hidden" id="pageId" name="pageId"/>
                            <div class="barquerycontent" align="center">
                                <table class="content_List">
                                    <tr>
                                        <td align="right" class="contenttd">业务系统：</td>
                                        <td align="left" width="200px">
                                            <input type="text" id="sysName" name="sysName" readonly="true" class="textbox_css" />
                                            <input id="sysId" name="sysId" class="textbox_css" style="display:none;"/>
                                        </td>
                                        <td align="right" class="contenttd">模块名称：</td>
                                        <td align="left" width="200px">
                                            <input type="text" id="moduleName" name="moduleName" readonly="true" class="textbox_css"/>
                                            <input type="hidden" id="moduleId" name="modelId" class="textbox_css" style="display:none;"/>
                                            <input type="button" id="moduleNameSelect" name="moduleNameSelect" value="选择" onclick="_moduleNameSelect();"/>
                                        </td>
                                        <td align="right" class="contenttd" >模板名称：</td>
                                        <td align="left" width="200px">
                                            <input type="text" id="templateName" name="templateName" readonly="true" class="textbox_css" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="right" class="contenttd">页面名称：</td>
                                        <td align="left">
                                            <input type="text" id="pageName" name="pageName" class="textbox_css"/>
                                            <input class="btnquery_mouseout" onMouseOver="this.className='btnquery_mouseover'"
                                                onMouseOut="this.className='btnquery_mouseout'" type="submit" value=""/>
                                        </td>
                                    	<td class="contenttd" colspan="4"></td>
                                    </tr>
                                </table>
                            </div>
                        </form>

                        <!--列表区域-->
                        <table id="pageManagerList" style="margin: 0; padding: 0;"></table>
                        <div id="pagerdt" style="margin: 0; padding: 0;"></div>
                </td>
            </tr>
        </table>
    </div>
    <!--页面信息-->
    <div id="PageParamsDialog" style="display:none;">
    	<form name="PageParams">
		<input type="hidden" id="id" name="id" readOnly/>
		<table>
			<tr class="formRow">
				<td class="formLabel">业务系统:</td>
				<td class="formField">
					<input type="text" id="sys_list_text" name="sys_text" readOnly/>
					<input type="text" id="sys_list_code" name="sys_code" style="display:none;" readOnly/>
				</td>
			</tr>
			<tr class="formRow">
				<td class="formLabel">所属模块:</td>
				<td class="formField">
					<input type="text" id="module_list_name" name="module_name" readOnly/>
					<input type="hidden" id="module_list_code" name="module_id" readOnly/>
					<input type="button" value="选择" onclick="_selectModule()"/>
				</td>
			</tr>
			<tr class="formRow" id="refFunctionTr">
				<td class="formLabel">关联功能:</td>
				<td class="formField">
					<input type="text" id="ref_function" name="ref_function" readOnly/>
					<input type="hidden" id="ref_function_id" name="ref_function_id" readOnly/>
					<input type="button" value="选择" onclick="_selectRefFunction()"/>
				</td>
			</tr>
			<tr class="formRow" id="templateTr">
				<td class="formLabel">模板选择:</td>
				<td class="formField">
					<select id="template_list" name="template_id"></select>
				</td>
			</tr>
			<tr class="formRow" id="containerTr" style="display:none;">
				<td class="formLabel">容器选择:</td>
				<td class="formField">
					<select id="container_list" name="container_id"></select>
				</td>
			</tr>
            <tr class="formRow">
                <td class="formLabel">页面模板:</td>
                <td class="formField">
                    <label><input name="has_def" type="checkbox" checked="checked"/>复制模板(模板修改后页面将不再同步更新)</label>
                </td>
            </tr>
			<tr class="formRow">
				<td class="formLabel">页面名称:</td>
				<td class="formField">
					<input type="text" id="page_id" name="name" onchange="if(!document.PageParams.code.readOnly){document.PageParams.code.value=getFirstLetterOfChinesePinyin(this.value)};"/>
				</td>
			</tr>
			<tr class="formRow">
				<td class="formLabel">页面编码:</td>
				<td class="formField">
					<input type="text" id="page_code" name="code" />
				</td>
			</tr>
			<tr class="formRow">
				<td class="formLabel">页面备注:</td>
				<td class="formField">
					<textarea id="page_note" name="note"></textarea>
				</td>
			</tr>
			<tr class="formRow">
				<td class="formLabel">页面类型:</td>
				<td class="formField">
					<select id="dyna_flag" name="dyna_flag">
						<option value="0">静态内容</option>
						<option value="1">动态内容</option>
					</select>
				</td>
			</tr>
		</table>
		</form>
    </div>
    <!-- 功能树 -->
    <div id="functionPanel" valign="top" style="display:none;">
    	<div id="func_tree" class="tree" style="overflow:auto;"></div>
    </div>
</body>
</html>