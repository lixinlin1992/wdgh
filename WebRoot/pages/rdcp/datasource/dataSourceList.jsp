<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title>数据源展示</title>
<jsp:include page="/pages/framework/base.jsp"/>
<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>
<script type="text/javascript" src="scripts/common/ztree.help.js"></script>

<link type="text/css" rel="stylesheet"
      href="themes/default/css/rdcp.css">
<script type="text/javascript" src="scripts/rdcp/rdcp.js"></script>
<script type="text/javascript" src="scripts/service/datasource.help.js"></script>
<script type="text/javascript" language="JavaScript" src="scripts/service/module.help.js"></script>
<script type="text/javascript" language="JavaScript" src="scripts/service/query.help.js"></script>
<script type="text/javascript" language="JavaScript" src="scripts/service/version.help.js"></script>
<script type="text/javascript" language="JavaScript" src="scripts/service/datasource.help.js"></script>
<script type="text/javascript" src="scripts/common/encode.js"></script>
<script type="text/javascript" src="scripts/common/chinese.js"></script>
<script type="text/javascript">
//模块id ,模块名字  添加的时候用
var module_id_tmp = "";
var mudule_name_tmp = "";
var sys_code_tmp = "";
var sys_name_tmp = "";


//显示数据源
function showDs(obj) {
    if (obj.checked) {//选中展示数据源
        menuTree = new ZTree("dstree", "DS_DATA_SOURCE_TREE",
                {nodeClicked:zTreeOnClick,async:"true",otherParam:{inx:1}});
    } else {//未选中不展示数据源
        menuTree = new ZTree("dstree", "DS_DATA_SOURCE_TREE",
                {nodeClicked:zTreeOnClick,async:"true",otherParam:{inx:0}});
    }
}
function dsListLoadComplete(){
    $(".btn_commit").hide();
    $(".btn_undo").hide();
    $(".u_0_<%=LoginUserSession.getLoginUserInfo().getId()%>").show();
}
//GRID 设置参数
var calobjparams = {
    //	对象类型	对象名称	状态	标识	描述	操作

    //colNames : [ '名称','编码','记录日志','模块','业务系统名称','业务系统编码','最后修改时间','最后修改人','备注','编辑状态','操作','ID'],
    colModel : [
        {
            name : '名称',
            align : 'center',
            index : 'name',
            //width:""	,
            sortable:true

        },
        {
            name : '编码',
            index : 'code',
            align : 'center',
            sortable:true,
            formatoptions : {}

        }
        ,
        {
            name : '业务系统名称',
            index : 'SYS_NAME',
            align : 'center',
            sortable:true,
            formatoptions : {}

        }
        ,
        {
            name : '模块',
            index : 'MODULE_NAME',
            align : 'center',
            sortable:true,
            formatoptions : {}

        }
        ,
        {
            name : '最后修改时间',
            index : 'LAST_EDIT_DATE',
            align : 'center',
            sortable:true,
            formatoptions : {}

        }
        ,
        {
            name : '最后修改人',
            index : 'LAST_EDIT_USER_NAME',
            align : 'center',
            sortable:true,
            formatoptions : {}

        },
        {
            name:"编辑用户",
            index:"edit_user_name",
            align:"center",
            width:"80"	,
            sortable:true
        },
        {
            name : '编辑状态',
            index : 'EDIT_STATUS',
            align : 'center',
            sortable:true,
            width:"80"	,
            formatter : function(cell, opts, rowObj) {
                return (cell == "0" ? "编辑中" : "-");
            },
            formatoptions : {}

        }
        ,
        {
            name : '操作',
            index : '',
            align : 'left',
            sortable:false,
            width:"180"    ,
            formatter : createButton2,
            formatoptions : {}

        }
        ,
        {
            name : 'ID',
            index : 'ID',
            align : 'center',
            sortable:false,
            hidden:true,
            formatoptions : {}

        }
        ,{
            name:"EDIT_USER",
            index:"EDIT_USER",
            hidden:true
        }
        ,{
            name:"SYS_CODE",
            index:"SYS_CODE",
            hidden:true
        }
    ],
    caption : "数据源列表",
    edit : true,
    multiselect:true,
    width:"81%",
    //parentwidth:true,
    pager:'#pagerdt',
    loadComplete:dsListLoadComplete
}
function createButton2(cellValue, options, rowObj) {
    return GRID.button({className:"btn_param",url:"pages/rdcp/datasource/dataSourceParamList.jsp?dsid="+rowObj["ID"],title:"数据源参数管理"})+
            GRID.button({className:"btn_edit",onclick:"showAttr('" + rowObj['ID'] + "')",title:"修改数据源"})+
            GRID.button({className:"btn_browse",onclick:"testDataSource('" + rowObj['SYS_CODE'] + "','" + rowObj['code'] + "');",title:"测试数据源"})+
            GRID.button({className:"btn_sync",onclick:"_syncDS('"+rowObj["ID"]+"','"+rowObj["SYS_CODE"]+"');",title:"同步"})+
            GRID.button({className:"btn_commit u_"+rowObj["EDIT_STATUS"]+"_"+rowObj["EDIT_USER"],onclick:"_versionCommit('" + rowObj["ID"] + "','" + rowObj["SYS_CODE"] +"');",title:"提交更改"})+
            GRID.button({className:"btn_undo u_"+rowObj["EDIT_STATUS"]+"_"+rowObj["EDIT_USER"],onclick:"_versionRevocation('ID','"+rowObj["ID"]+"','"+rowObj["SYS_CODE"]+"','"+rowObj["name"]+"');",title:"撤销更改"});
    /*
    return "<nobr><input type='button' class='grid_button' onclick=\"javascript:window.location.href ='pages/rdcp/datasource/dataSourceParamList.jsp?dsid=" +
            rowObj['ID'] + "'\" value='参数'/>" +
            "<input type='button' class='grid_button'  value='修改' onclick=\"showAttr('" + rowObj['ID'] + "')\">" +
            "<input type='button' class='grid_button' value='测试' onclick=\"testDataSource('" + rowObj['SYS_CODE'] +
            "','" + rowObj['code'] + "');\">" +
            (("<%=LoginUserSession.getLoginUserInfo().getId()%>"==rowObj["EDIT_USER"] && "0"==rowObj["EDIT_STATUS"]) ? ("<input type='button' class='grid_button' value='提交' onclick=\"_versionCommit('" + rowObj["ID"] +
                //(true ? (GRID.button({label:"提交",onclick:"_versionCommit('" + rowObj["ID"]+"');"})): "") +
                    "');\"/>") : "") +
            "</nobr>";
            */
}

//表格里的操作,显示属性编辑器
function showAttr(dsid) {
    $('#_dsId').val(dsid);
    CORE.request("DS_DS_PROPERTY_GRID", {data:"id=" + dsid}, function(data) {
        CORE.fillForm(document.dsform, data);
        $("#propertyDiv").dialog(propertyDivSetting);
    });
}


//点击树出发的事件
function zTreeOnClick(event, treeId, treeNode) {
    //type  0是系统,1是模块,2是数据源
    if (treeNode.type == 0) {
        $("#sys").val(treeNode.sys);
        $("#mol_id").val("");
        $("#ds_id").val("");
    } else if (treeNode.type == 1) {
        $("#sys").val(treeNode.sys);
        $("#mol_id").val(treeNode.id);
        $("#ds_id").val("");
    } else if (treeNode.type == 2) {
        $("#sys").val(treeNode.sys);
        $("#mol_id").val("");
        $("#ds_id").val(treeNode.id);
        showAttr(treeNode.id);
    }
    GRID.reload('listdt');
}
//数据源树
var menuTree;
$(function() {
    module_id_tmp = "";
    mudule_name_tmp = "";
    sys_code_tmp = "";
    sys_name_tmp = "";

    //生成数据源树
    menuTree = new ZTree("dstree", "DS_DATA_SOURCE_TREE", {nodeClicked:zTreeOnClick,async:"true",otherParam:{inx:0}});
    //生成数据源列表
    GRID.create("#listdt", "DS_DATA_SOURCE_GRID", calobjparams, "gridParam");

    CORE.loadRules("dsform", "RDC_CFG_DATASOURCE");
});

//添加数据源显示弹出框
function dsAdd() {
    //var module_name_tmp = $("#module_name").val();
    //var module_id_tmp = $("#module_id").val();
    //var sys_name_tmp = $("#sys_name").val();
    //var sys_code = $("#sys_code").val();

    document.dsform.reset();
    var _curNode = menuTree.getSelectedNode();
    if(_curNode != null && _curNode.type == '1'){
        $("#module_name").val(_curNode.name);
        $("#module_id").val(_curNode.id);
        $("#sys_name").val(_curNode.sys_name);
        $("#sys_code").val(_curNode.sys);
    }
    $("#propertyDiv").dialog(propertyAddDivSetting);

}

/**
 * 版本提交处理函数
 * @param id
 */
function _versionCommit(id,syscode) {
    if(id==undefined){
        //提交所有选中的数据源，需要过滤掉不是当前用户编辑的数据
        var _datas = [];
        var _ds = GRID.getSelectRow("listdt");
        $.each(_ds,function(i,n){
            if(n["EDIT_USER"] != "<%=LoginUserSession.getLoginUserInfo().getId()%>" && n["EDIT_STATUS"] != "0")
                return;
            _datas.push({
                "key":"ID",
                "keyvalue":n["ID"],
                "tablename":"RDC_CFG_DATASOURCE",
                "objectname":n["名称"],
                "syscode":n["SYS_CODE"]
            });
        });
        if(_datas.length == 0){
            CORE.tip("请先选中您正在编辑的数据再进行提交");
            return;
        }
        VERSION.versionCommitBatch(_datas,function(body,header){
            if (header.code == 0) {
                GRID.reload("listdt");   //刷新列表
            }
        });
    }else{
        VERSION.versionCommit("ID", id, "RDC_CFG_DATASOURCE",syscode,function(body, header) {
            if (header.code == 0) {
                GRID.reload("listdt");   //刷新列表
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
        var _ds = GRID.getSelectRow("listdt");
        $.each(_ds,function(i,n){
            if(n["EDIT_USER"] != "<%=LoginUserSession.getLoginUserInfo().getId()%>" && n["EDIT_STATUS"] != "0")
                return;
            _datas.push({
                "key":"ID",
                "keyvalue":n["ID"],
                "tablename":"RDC_CFG_DATASOURCE",
                "objectname":n["名称"],
                "syscode":n["SYS_CODE"]
            });
        });
        if(_datas.length == 0){
            CORE.tip("请先选中您正在编辑的数据再进行撤销");
            return;
        }
        VERSION.versionRevocationBatch(_datas,function(body,header){
            if (header.code == 0) {
                GRID.reload("listdt");   //刷新列表
            }
        });
    }else{
        VERSION.versionRevocation(key,keyValue,"RDC_CFG_DATASOURCE",sysCode,objectName,function(){
            GRID.reload("listdt");
        });
    }
}
</script>
</head>

<body>
<jsp:include page="/pages/navbar.jsp"/>
<div class="moudles">
    <div class="barquery">
        <div class="barquerycenter">
            数据源展示
        </div>
        <div class="barquerybtn">
            <a class="btn_add" href="javascript:void(0);" onclick="dsAdd();" title="添加新的数据源">添加</a>
            <a class="btn_delete" href="javascript:void(0);" onclick="batchDel();" title="删除选中的数据源">删除</a>
            <a class="btn_commit u_0_<%=LoginUserSession.getLoginUserInfo().getId()%>" href="javascript:void(0);" onclick="_versionCommit();" title="提交选中数据源的更改">提交</a>
            <a class="btn_undo u_0_<%=LoginUserSession.getLoginUserInfo().getId()%>" href="javascript:void(0);" onclick="_versionRevocation()" title="撤销选中数据源的更改">撤销</a>
            <!--
            <input type="button" value="添加" class="btn_additionout auto_disabled" onclick="dsAdd()"/>
            <input type="button" value="删除" class="btn_deleteout auto_disabled" onclick="batchDel();"/>
            -->
        </div>
    </div>
</div>
<style>
    .formField input[type='text'],textarea{
        width: 200px;
    }
</style>
<!-- 属性编辑器弹出框 -->
<div id="propertyDiv" style="display: none;">
    <form name="dsform">
        <!-- 数据源id -->
        <input type="text" value="" name="id" id="_dsId" style="display: none;"/>
        <table width="400">
            <tr class='formRow'>
                <td class='formLabel' style="width:120px;">名称：</td>
                <td class="formField"><input type="text" name="name" id="name"
                                             onchange="if(document.dsform.code.value==''){document.dsform.code.value=getFirstLetterOfChinesePinyin(this.value);}"></td>
            </tr>
            <tr class='formRow'>
                <td class='formLabel'>编码：</td>
                <td class="formField"><input type="text" name="code" id="code"></td>
            </tr>
            <tr class='formRow'>
                <td class='formLabel'>备注：</td>
                <td class="formField"><input type="text" name="note" id="note"></td>
            </tr>
            <tr class='formRow'>
                <td class='formLabel'>系统名称：</td>
                <td class="formField"><input type='text' name='sys_name' id='sys_name' readonly="readonly"/>
                    <input type='text' name='sys_code' id='sys_code' value="" style="display: none;"/>
                </td>
            </tr>
            <tr class='formRow'>
                <td class='formLabel'>模块：</td>
                <td class="formField">
                    <input type='text' name='module_name' id='module_name' readonly="readonly"/>
                    <input type="text" name="module_id" ID="module_id" style="display: none;"/>
                    <input type='button' value='选择' onclick="_selectModule();"/>
                </td>
            </tr>
            <tr id="PARAM_TR" style='display: none;' class='formRow'>
                <td class='formLabel'>参数：</td>
                <td class="formField"><a
                        href="javascript:window.location.href ='pages/rdcp/datasource/dataSourceParamList.jsp?dsid='+$('#_dsId').val();">查看</a>
                </td>
            </tr>
            <tr class='formRow'>
                <td class='formLabel'>日志内容：</td>
                <td class="formField"><input type="text" name="log_content" id="log_content"></td>
            </tr>
            <tr class='formRow'>
                <td class='formLabel'>数据源类型：</td>
                <td class="formField"><select type="text" name="type" id="type">
                    <option value="2">查询配置</option>
                    <option value="0">URL</option>
                    <option value="1">file</option>
                </select></td>
            </tr>
            <tr class='formRow'>
                <td class='formLabel'>数据源来源：</td>
                <td class="formField"><input type="text" name="source" id="source"></td>
            </tr>
            <tr class='formRow'>
                <td class='formLabel'>查询编码：</td>
                <td class="formField">
                    <input type="text" name="query_code" id="query_code" readonly="readonly"/>
                    <%--<input type="button" onclick="showQueryTree();" value="选择"/>--%>
                    <input type="button" onclick="if($('#sys_code').val()==''){CORE.tip('请先选择所属模块。');return;}selectQuery({selected:function(querys){if(querys == undefined)return;if(querys.length==0){$('#query_code').val('');}else if(querys[0]['sys_code']!=$('#sys_code').val()){CORE.tip('选择的查询必需与数据源所属业务系统一致');return false;}else{$('#query_code').val(querys[0]['code']);return true;}}})" value="选择"/>
                </td>
            </tr>
            <tr class='formRow'>
                <td class='formLabel'>是否记录日志：</td>
                <td class="formField"><label><input type="radio" value="0" name="log_flag"
                                                    checked="checked"/>不记录日志</label><label><input type="radio" value="1"
                                                                                                  name="log_flag"/>记录日志</label>
                </td>
            </tr>
            <tr class='formRow'>
                <td class='formLabel'>演示数据：</td>
                <td class="formField"><textarea name="demo_data" id="demo_data" rows="6"></textarea></td>
            </tr>
        </table>
    </form>
</div>
<div>
    <table>
        <tr>
            <td valign="top">
                <div id="dstree" class="tree"
                     style="width: 200px; height: 500px; overflow-y: auto;">
                </div>
            </td>
            <td valign="top" style="width: 100%">
                <form name="gridParam" id="gridParam">
                    <p></p>

                    <div class="barquerycontent" style="width: 100%">
                        <input type="text" name="sys" id="sys" style="display: none;"/>
                        <input type="text" name="mol_id" id="mol_id" style="display: none;"/>
                        <input type="text" name="ds_id" id="ds_id" style="display: none;"/>
                        <table class="content_List" style="width: 100%">
                            <tr>
                                <td class='contenttd'>数据源名称:</td>
                                <td><input type='text' name='_dsName' id='_dsName'></td>
                                <td class='contenttd'>数据源编码:</td>
                                <td><input type='text' name='_daCode' id='_daCode'></td>
                                <td>
                                    <input type="button" value=""
                                           onclick="javascript:GRID.reload('listdt')"
                                           onMouseOver="this.className='btnquery_mouseover'"
                                           onMouseOut="this.className='btnquery_mouseout'"
                                           Class="btnquery_mouseout"/>
                                </td>
                            </tr>
                        </table>
                    </div>
                </form>
                <table id="listdt" style="margin: 0; padding: 0;"></table>
                <div id="pagerdt" style="margin: 0; padding: 0;"></div>
            </td>
        </tr>
        <tr>
            <td>
                <label>
                    <input type="checkbox" id="checkbox" onclick="showDs(this);"/>
                    显示数据源
                </label>
            </td>
            <td>
            </td>
        </tr>
    </table>
</div>
</body>
</html>
<script>
    //属性弹出框参数(修改的)
    var propertyDivSetting = {
        title : "数据源属性",
        width : "450",
        height : "400" ,
        modal : true,
        buttons :{
            '返回':function() {
                $("#propertyDiv").dialog("close");
            },
            '修改':function() {
               //CORE.confirm("确认修改?", function() {
                    CORE.submitForm("DS_DATA_SOURCE_ADD", "dsform", {}, function(data) {
                        if (data > 0) {
                            GRID.reload("listdt");
                            CORE.tip("数据源已修改");
                            $("#propertyDiv").dialog("close");
                        } else {
                            CORE.tip("数据源修改失败,请检查后重新操作");
                            $("#propertyDiv").dialog("close");
                        }
                    });
              //});
            }
        }
    }
    //属性弹出框参数(添加的)
    var propertyAddDivSetting = {
        title : "添加数据源",
        width : "450",
        height : "400" ,
        modal : true,
        buttons :{
            '返回':function() {
                $("#propertyDiv").dialog("close");
            },
            '添加':function() {
                CORE.loadRules("dsform", "RDC_CFG_DATASOURCE", false, function() {
                    CORE.submitForm("DS_DATA_SOURCE_ADD", "dsform", {}, function(data) {
                        if (data > 0) {
                            GRID.reload("listdt");
                            CORE.tip("数据源已添加");
                            $("#propertyDiv").dialog("close");
                        } else {
                            CORE.tip("数据源添加失败,请检查后重新操作");
                            $("#propertyDiv").dialog("close");
                        }
                    });
                });
            }
        }
    }

    //数据源 批量删除
    function batchDel() {
        var rows = GRID.getSelectRow("listdt", "ID");
        //var sys_code_rows = GRID.getSelectRow("listdt", "SYS_CODE");
        if (rows.length > 0) {
            var id = "";
            for (i = 0; i < rows.length; i++) {
                if (i == 0) {
                    id = "id=" + rows[i];
                } else {//
                    id = id + "&id=" + rows[i]
                }
            }
            CORE.confirm("是否确认删除?", function() {
	            CORE.request("DS_DATA_SOURCE_DEL_KV", {data:id}, function(data) {
	                GRID.reload("listdt");
	                CORE.tip("数据源已删除");
	            });
            });
        } else {
        	CORE.tip("请选择所要删除的数据。");
            return;
        }
    }

    function _selectModule(){
        selectModule(function(node){
            //缓存当前的业务系统，如果选择了新的业务系统，则清空选择的数据源
            var _curSys = $('#sys_code').val();
            if(node==null||node==undefined){
                $('#module_name').val("");
                $('#module_id').val("");
                $('#sys_code').val("");
                $('#sys_name').val("");
            }else{
                $('#module_name').val(node.name);
                $('#module_id').val(node.id);
                $('#sys_code').val(node.sys_code);
                $('#sys_name').val(node.sys_name);
            }
            if(_curSys != "" && _curSys!=$('#sys_code').val()){
                $("#query_code").val("");
            }
        },'',false,true);
    }
    
	/**李嘉伟2012年5月25日修改 同步功能***/
	function _syncDS(dsId,syscode){
		CORE.request("DS_SYNC_OBJECT",{data:"objId="+dsId+"&syscode="+syscode+"&tablenames=RDC_CFG_DATASOURCE"}, function(data) {
			CORE.info(data);
		});
	}
</script>

