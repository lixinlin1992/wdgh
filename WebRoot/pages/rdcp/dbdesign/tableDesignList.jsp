<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title>数据库设计表</title>
<jsp:include page="/pages/framework/base.jsp" />
<link type="text/css" rel="stylesheet"
	href="themes/default/css/zTreeStyle/zTreeStyle.css" />
<script type="text/javascript"
	src="scripts/ztree/jquery-ztree-2.5.min.js"></script>
<script type="text/javascript" src="scripts/common/ztree.help.js"></script>

<link type="text/css" rel="stylesheet"
	href="themes/default/css/rdcp.css">
	<script type="text/javascript" src="scripts/rdcp/rdcp.js"></script>
	<script type="text/javascript" src="scripts/datePicker/WdatePicker.js"></script>
	<script type="text/javascript" src="scripts/service/function.help.js"></script>
	<script type="text/javascript">
		//规则编辑对话框选项
		var ruleEditDlgOpts = {
			title : "添加数据库表",
			width : "300",
			height : "200",
			modal : true,
			bgiframe : true,
			resizable : false
		};
		//数据库设计表列表属性
		var dbtableGridParams = {
			colModel : [
					{
						name : "ID",
						align : "center",
						index : "ID",
						hidden : true
					},
					{
						name : "业务系统",
						align : 'center',
						index : "SYS_NAME"

					},
					{
						name : "业务系统编码",
						align : 'center',
						index : "SYS_CODE"

					},
					{
						name : "表名称",
						align : 'center',
						index : "NAME",
						sortable : true
					},
					{
						name : "表编码",
						align : 'center',
						index : "CODE"
					},
					{
						name : "操作",
						align : 'center',
						index : "",
						width : "320px",
						sortable : false,
						formatter : function(cell, options, row) {
							return GRID.button({className:"btn_edit",onclick:"editRule('"+row["ID"]+"');",title:"修改"});
							/*
							return "<input type='button' value='修改' class='grid_button' onclick=\"editRule('"
									+ row['ID']
									+ "');\">"
									+ "&nbsp;<input type='button' value='删除' class='grid_button' onclick=\"deleteRule('"
									+ row['ID']
									+ "','"
									+ row['SYS_CODE']
									+ "')\">";*/
						}
					}, {
						name : "ID",
						index : "ID",
						align : 'center',
						hidden : true
					}

			],
			caption : "数据库设计表列表",
			multiselect : false,
			parentwidth : true,
			width : "99.9%",
			pager : "#pagerdt"
		};
		$(function() {
			//生成列表
			GRID.create("#listdt", "DS_DES_TABLE_LIST", dbtableGridParams,
					"gridParam");
			//填充系统下拉框
			CORE.loadSelect('sys_code', 'DS_SYSTEM_SELECT_LIST', {
				value : ""
			});
		});
		//数据库表添加
		function tableAdd() {
			ruleEditDlgOpts.title = "添加";
			document.ruleEditForm.reset();
			ruleEditDlgOpts.buttons = {
				'返回' : function() {
					$("#ruleEditDiv").dialog("close");
				},
				'添加' : function() {
					CORE.submitForm("DS_BASE_DATA_TABLE_EDIT", "ruleEditForm",
							{}, function(data) {
								if (data > 0) {
									GRID.reload("listdt");
									CORE.info("操作成功!");
									$("#ruleEditDiv").dialog("close");
								} else {
									CORE.info("操作失败,请检查后重新操作,谢谢!");
									$("#ruleEditDiv").dialog("close");
								}
							});
				}
			}
			$("#ruleEditDiv").dialog(ruleEditDlgOpts);
		}
		//修改
		function editRule(id) {
			ruleEditDlgOpts.title = "修改";
			ruleEditDlgOpts.buttons = {
				'返回' : function() {
					$("#ruleEditDiv").dialog("close");
				},
				'修改' : function() {
					CORE.submitForm("DS_BASE_DATA_TABLE_EDIT", "ruleEditForm",
							{}, function(data) {
								if (data > 0) {
									GRID.reload("listdt");
									CORE.info("操作成功!");
									$("#ruleEditDiv").dialog("close");
								} else {
									CORE.info("操作失败,请检查后重新操作,谢谢!");
									$("#ruleEditDiv").dialog("close");
								}
							});
				}
			}
			CORE.request("DS_BASE_DATA_TEBLE_EDIT_INIT", {
				data : "id=" + id
			}, function(data) {
				CORE.fillForm(document.ruleEditForm, data);
				$("#ruleEditDiv").dialog(ruleEditDlgOpts);
			});
		}
		//删除校验规则
		function deleteRule(id, sys_code) {
			CORE.confirm("是否确认删除该纪录?", function() {
				CORE.request("DS_DATA_BASE_TABLE_DELETE", {
					data : "id=" + id + "&sys_code=" + sys_code
				}, function(data) {
					if (data > 0) {
						GRID.reload("listdt");
						CORE.info("操作成功!");
					} else {
						CORE.info("操作失败!");
					}
				});
			});
		}
		/******导入信息********/
		var Opt = {
			title : "导入信息",
			width : "580px",
			height : "250",
			modal : true,
			bgiframe : true,
			resizable : false,
			buttons : {
				'取消' : function() {
					$("#importPanel").dialog("close");
				},
				'导入' : function() {
					COMMON.upload({
						url : 'framework.do?ds=DS_PDM_IMPORT',
						formName : 'importForm'
					}, function(data) {
						$("#importPanel").dialog("close");
						GRID.reload("listdt");
					});
				}
			}
		};
		function importData() {
			CORE.loadSelect('dbimportSyscode', 'DS_SYSTEM_SELECT_LIST', {
				value : "RDCP"
			});
			$("#importPanel").dialog(Opt);
		}
	</script>
</head>

<body>
	<jsp:include page="/pages/navbar.jsp" />
	<div class="moudles">
		<div class="barquery">
			<div class="barquerycenter">数据库设计表</div>
			<div class="barquerybtn">
			    <a class="btn_add" href="javascript:void(0);" onclick="tableAdd();" title="添加新的空白页面">添加</a>
				<a class="btn_commit" href="javascript:void(0);" onclick="importData();" title="提交选中的所有修改">导入</a>	
				<!--  
				<input type="button" value="添加"
					class="btn_additionout auto_disabled" onclick="tableAdd();" /> 
					<input
					type="button" value="导入" class="btn_additionout auto_disabled"
					onclick="importData()" />
				-->
			</div>
		</div>
	</div>
	<div>
		<table style="width: 100%">
			<tr>
				<td valign="top" style="width: 100%">
					<form name="gridParam" id="gridParam"
						onsubmit="javascript:GRID.reload('listdt');return false;">
						<p></p>
						<div class="barquerycontent" style="width: 100%">
							<table class="content_List" style="width: 100%">
								<tr>
									<td class='contenttd'>系统名称:</td>
									<td><input type='text' name='sysName4ser' id='sysName4ser' />
									</td>
									<td class='contenttd'>系统编码:</td>
									<td><input type='text' name='sysCode4ser' id='sysCode4ser' />
									</td>
								
									<td class='contenttd'>表名称:</td>
									<td><input type='text' name='tableName4ser'
										id='tableName4ser' /></td>
									<td class='contenttd'>表编码:</td>
									<td><input type='text' name='tableCode4ser'
										id='tableCode4ser' /></td>
									<td><input type="submit" value=""
										onMouseOver="this.className='btnquery_mouseover'"
										onMouseOut="this.className='btnquery_mouseout'"
										Class="btnquery_mouseout" /></td>
								</tr>
							</table>
						</div>
					</form>
					<table id="listdt" style="margin: 0; padding: 0;"></table>
					<div id="pagerdt" style="margin: 0; padding: 0;"></div>
				</td>
			</tr>
		</table>
	</div>
	<div id="ruleEditDiv" style="display: none;">
		<form name="ruleEditForm" id="menuEditForm">
			<table align="center">
				<tr style="display: none;">
					<td>
						<!-- 规则id --> <input type="text" id="id" name="id" /> <!-- 创建时间 -->
						<input type="text" id="status" name="status" value="0" />
						<input type="text" name="create_time" id="create_time" /> <!-- 创建用户 -->
						<input type="text" name="create_user" id="create_user" />
					</td>
				</tr>
				<tr class="formRow">
					<td class="formLabel">业务系统:</td>
					<td class="formField"><select id="sys_code" name="sys_code">
							<option>--请选择--</option>
					</select></td>
				</tr>
				<tr class="formRow">
					<td class="formLabel">数据库表名称:</td>
					<td class="formField"><input type="text" name="name" id="name" /></td>
				</tr>
				<tr class="formRow">
					<td class="formLabel">数据库表编码:</td>
					<td class="formField"><input type="text" name="code" id="code" /></td>
				</tr>
			</table>
		</form>
	</div>
	<div id="importPanel" style="display: none;">
		<form name="importForm" enctype="multipart/form-data"
			onSubmit="return false;">
			<table>
				<tr class="formRow">
					<td class="formLabel"><strong>选择导入的该业务系统:</strong></td>
					<td class="formField"><select id="dbimportSyscode"
						name="syscode">
							<option>--请选择--</option>
					</select></td>
				</tr>
				<tr class="formRow">
					<td class="formLabel"><strong>选择导入的Pdm文件:</strong></td>
					<td class="formField"><input name="file" id="upfile"
						type="file" /> <input type="hidden" name="note" value="pdm" /></td>
				</tr>
			</table>
		</form>
	</div>
</body>
</html>
