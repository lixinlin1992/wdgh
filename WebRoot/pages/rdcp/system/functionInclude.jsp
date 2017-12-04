<%--
File: functionInclude.jsp
User: kinz
Date: 11-9-13 下午3:15
    嵌入到moduleFunctionManage.jsp页面的页面片段

--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<script>
    var funcEdtDlgOpt = {
        title : "添加/修改功能",
        width : "350",
        height : "400" ,
        modal : true,
        bgiframe : true,
        resizeable:false,
        buttons:{
            "取消":function() {
                $("#Function_Edit_Dlg").dialog("close");
            },
            "确定":function() {
                CORE.submitForm("DS_RDCP_FUNCTION_EDIT", "FunctionEditForm", {}, function(data) {
                    $("#Function_Edit_Dlg").dialog("close");
                    GRID.reload("funcList");
                    CORE.tip("功能添加/修改成功");
                });
            }
        }
    };
    /**
     * 添加新的功能
     */
    function addFunction() {
        document.FunctionEditForm.reset();
        document.FunctionEditForm.module_id.value = document.QueryForm.module_id.value;
        document.FunctionEditForm.module_name.value = document.QueryForm.module_name.value;
        document.FunctionEditForm.sys_code.value = document.QueryForm.sys_code.value;
        funcEdtDlgOpt["title"] = "添加新功能";
        $("#Function_Edit_Dlg").dialog(funcEdtDlgOpt);
    }

    /**
     * 修改功能
     * @param id
     */
    function editFunction(id) {
        document.FunctionEditForm.reset();
        funcEdtDlgOpt["title"] = "修改功能";
        CORE.loadForm("DS_RDCP_FUNCTION_INFO", "FunctionEditForm", {data:"id=" + id,loadComplete:function() {
            $("#Function_Edit_Dlg").dialog(funcEdtDlgOpt);
        }});
    }

    /**
     * 删除功能
     * @param id
     * @param name
     */
    function deleteFunction(id, name) {
        if (id != undefined) {
            CORE.confirm("确定要删除功能 [" + name + "] 吗？注意：功能删除后不可恢复！", function() {
                CORE.request("DS_RDCP_FUNCTION_DELETE", {data:"id=" + id}, function(data) {
                    GRID.reload("funcList");
                    CORE.tip("功能已经删除");
                });
            });
        } else {
            var _ids = GRID.getSelectRow("funcList","编号");
            if(_ids == null || _ids.length==0){
                CORE.tip("请选择要删除的功能！");
                return;
            }
            CORE.confirm("确定要删除所有选中的功能吗？注意：功能删除后不可恢复！",function(){
                CORE.request("DS_RDCP_FUNCTION_DELETE",{data:"id="+_ids.join("&id=")},function(data){
                    GRID.reload("funcList");
                    CORE.tip("功能已经删除");
                });
            });
        }
    }
</script>

<div id="Function_Edit_Dlg" style="display:none;">
    <div class="modules" style="height:200px;width: 300px;">
        <form name="FunctionEditForm" onsubmit="return false;">
            <input name="id" type="text" style="display: none;">
            <input type="text" name="sys_code" style="display: none;">
            <table align="center">
                <tr class="formRow">
                    <td class="formLabel" width="100">
                        所属模块：
                    </td>
                    <td class="formField">
                        <input type="text" name="module_id" value="0" style="display: none;">
                        <input type="text" name="module_name" readonly="readonly">
                        <input type="button" name="menu_sel_btn" id="I_module_sel_btn_2" class="btnfunctionout"
                               value="选择"
                               onclick="selectModule_(document.FunctionEditForm.sys_code,document.FunctionEditForm.module_id,document.FunctionEditForm.module_name,false,function(){document.FunctionEditForm.depend_id.value='';document.FunctionEditForm.depend_name.value='';});"/>
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
                        <input type="text" name="depend_name" id="depend_name" readonly="readonly" style="width:100px;">
                        <input type="button" class="btnfunctionout" value="选择"
                               onclick="selectFunction(function(node){if(node != null && node.sys_code!=document.FunctionEditForm.sys_code.value)return false;document.FunctionEditForm.depend_id.value=(node==null)?'':node.id;document.FunctionEditForm.depend_name.value=(node==null)?'':node.name;return true;});"/>
                    </td>
                </tr>
				<tr class="formRow">
					<td class="formLabel">是否有效:</td>
					<td class="formField">
						<label><input type="radio" name="status" value="0"/>无效</label>
						<label><input type="radio" name="status" value="1" checked/>有效</label>
					</td>
				</tr>
                <tr class="formRow">
                    <td class="formLabel">
                        备注：
                    </td>
                    <td class="formField">
                        <textarea rows="4" name="note" style="width:98%;"></textarea>
                    </td>
                </tr>
            </table>
        </form>
    </div>
</div>