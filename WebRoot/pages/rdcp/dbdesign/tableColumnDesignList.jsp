<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title>数据库字段设计</title>
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
		//字段管理列表
		var dbtableColsGridParams = {
			colModel : [
					{
						name : "ID",
						align : "center",
						index : "ID",
					},
					{
						name : "TABLE_ID",
						align : "center",
						index : "TABLE_ID"
					},
					{
						name : "业务系统",
						align : "center",
						index : "SYS_NAME",
						sortable : true
					},
					{
						name : "业务系统编码",
						align : "center",
						index : "SYS_CODE",
						sortable : true
					},
					{
						name : "业务表名",
						align : "center",
						index : "TABLE_NAME",
						sortable : true
					},
					{
						name : "业务表编码",
						align : "center",
						index : "TABLE_CODE"
					},
					{
						name : "字段名",
						align : "center",
						index : "NAME",
						sortable : true
					},
					{
						name : "字段编码",
						align : "center",
						index : "CODE",
						sortable : true
					},
					{
						name : "操作",
						align : 'center',
						index : "",
						width : "320px",
						sortable : false,
						formatter : function(cell, options, row) {
							return GRID.button({className:"btn_edit",onclick:"editCols('"+row["ID"]+ "','"
                                + row['TABLE_ID']
                            + "','"
                            + row['TABLE_NAME']
                            + "','"
                            + row['SYS_CODE']
                            + "','"
                            + row['NAME']
                            + "','"
                            + row['CODE']+"');",title:"修改"});
							/*
							return "<input type='button' value='修改' class='grid_button' onclick=\"editCols('"
									+ row['ID']
									+ "','"
									+ row['TABLE_ID']
									+ "','"
									+ row['TABLE_NAME']
									+ "','"
									+ row['SYS_CODE']
									+ "','"
									+ row['NAME']
									+ "','"
									+ row['CODE']
									+ "','"
									+ "');\">"
									+ "&nbsp;<input type='button' value='删除' class='grid_button' onclick=\"deleteCols('"
									+ row['ID']
									+ "','"
									+ row['SYS_CODE']
									+ "')\">";*/
						}
					}

			],
			caption : "数据库表字段列表",
			multiselect : false,
			parentwidth : true,
			width : "99.9%",
			pager : "#pagerdt"
		};
		$(function() {
			//生成列表
			GRID.create("#listdt", "DS_DES_TABLE_COLS_LIST",
					dbtableColsGridParams, "gridParam");
			//填充系统下拉框
			CORE.loadSelect('sys_code', 'DS_SYSTEM_SELECT_LIST', {
				value : ""
			});
		});

		/*
		 * 初始字段编辑框
		 */
		function editCols(id, table_id, table_name, sys_code, name, code) {
			$("#id").val(id);
			$("#table_name").val(table_name);
			$("#sys_code").val(sys_code);
			$("#name").val(name);
			$("#code").val(code);
			CORE.loadSelect('table_id', 'DS_SYS_TABLE_SELECT', {
				data : "sys_code=" + sys_code,
				value : table_id
			});
			document.getElementById("colsForm").style.display = "";
		}

		/*
		 * 系统选择下拉框改变，就展示表的下拉框
		 */
		function sysSelectOnChange() {
			var _sys_code = $("#sys_code").val();
			if (_sys_code == null || _sys_code == "") {
				CORE.loadSelect('table_id', 'DS_SYS_TABLE_SELECT', {
					data : "sys_code=-1",
					value : ""
				});
			} else {
				CORE.loadSelect('table_id', 'DS_SYS_TABLE_SELECT', {
					data : "sys_code=" + _sys_code,
					value : ""
				});
			}
		}

		/*
		 *表的下拉框改变，就展示表的名字
		 */
		function tableSelectOnChange() {
			var _table_id = $("#table_id").val();
			if (_table_id == null || _table_id == "") {
				$("#table_name").val("");
			} else {
				CORE.request("DS_GET_TABLE_NAME", {
					data : "table_id=" + _table_id
				}, function(data) {
					$("#table_name").val(data.rows[0].cell[0]);
					//CORE.fillForm(document.ruleEditForm, data);
				});
			}
		}

		/*
		 *表单新增/修改提交
		 */
		function formEditSubmit() {

			CORE.submitForm("DS_BASE_DATA_TABLE_COLUMNS_EDIT", "colsForm", {},
					function(data) {
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
		/*
		 * 字段添加
		 */
		function tableColsAdd() {
			CORE.loadSelect('table_id', 'DS_SYS_TABLE_SELECT', {
				data : "sys_code=-1",
				value : ""
			});
			window.document.colsForm.reset();
			document.getElementById("colsForm").style.display = "";
		}
		/*
		 * 删除字段
		 */
		//删除校验规则
		function deleteCols(id, sys_code) {
			CORE.confirm("是否确认删除该纪录?", function() {
				CORE.request("DS_DATA_BASE_TABLE_COLUMNS_DELETE", {
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
	</script>
</head>

<body>
	<jsp:include page="/pages/navbar.jsp" />
	<div class="moudles">
		<div class="barquery">
			<div class="barquerycenter">数据库字段设计</div>
			<div class="barquerybtn">
				<!-- <input type="button" value="添加"
					class="btn_additionout auto_disabled" onclick="tableColsAdd();" /> -->
				 <a class="btn_add" href="javascript:void(0);" onclick="tableColsAdd();" title="添加新的字段">添加</a>
			</div>
		</div>
	</div>
	<div>
		<table style="width: 100%">
			<tr>
				<td valign="top" style="width: 100%">
					<form name="gridParam" id="gridParam"
						onSubmit="GRID.reload('listdt');return false;">
						<p></p>
						<div class="barquerycontent" style="width: 100%">
							<table class="content_List" style="width: 100%">
								<tr>
									<td class='contenttd'>系统名称:</td>
									<td><input type='text' name='sysName4ser' id='sysName4ser' />
									</td>
									<td class='contenttd'>表名称:</td>
									<td><input type='text' name='tableName4ser'
										id='tableName4ser' /></td>
									<td class='contenttd'>字段名称:</td>
									<td><input type='text' name='colName4ser'
										id='tableName4ser' /></td>
								</tr>
								<tr>
									<td class='contenttd'>系统编码:</td>
									<td><input type='text' name='sysCode4ser' id='sysCode4ser' />
									</td>

									<td class='contenttd'>表编码:</td>
									<td><input type='text' name='tableCode4ser'
										id='tableCode4ser' /></td>
									<td class='contenttd'>字段编码:</td>
									<td><input type='text' name='colCode4ser'
										id='tableCode4ser' /></td>
									<td><input type="submit" value=""
										onMouseOver="this.className='btnquery_mouseover'"
										onMouseOut="this.className='btnquery_mouseout'"
										Class="btnquery_mouseout" /></td>
								</tr>
							</table>
						</div>
						<!-- /barquerycontent -->
					</form> <!-- gridParam -->
					<table id="listdt" style="margin: 0; padding: 0;"></table>
					<div id="pagerdt" style="margin: 0; padding: 0;"></div>
				</td>
			</tr>
		</table>
		<div id="colsForm" style="display: none;">
			<form name="colsForm" onSubmit="formEditSubmit();return false;">
				<table align="center">
					<tr style="display: none;">
						<td><input type="text" id="id" name="id" /> <!-- 用于判断添加或者修改 -->
							<input type="text" id="status" name="status" value="0" /> <!-- 默认状态 --></td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">业务系统:</td>
						<td class="formField"><select id="sys_code" name="sys_code"
							onChange="sysSelectOnChange();">
								<option value="">--请选择--</option>
						</select></td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">业务表:</td>
						<td class="formField"><select id="table_id" name="table_id"
							onChange="tableSelectOnChange();">
								<option value="">--请选择--</option>
						</select></td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">业务表名:</td>
						<td class="formField"><input type="text" id="table_name"
							name="table_name" readonly="readonly" /></td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">字段名称:</td>
						<td class="formField"><input type="text" name="name"
							id="name" /></td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">字段编码:</td>
						<td class="formField"><input type="text" name="code"
							id="code" /></td>
					</tr>
					<tr>
						<td></td>
						<td><input type="submit" value="确定" />&nbsp;<input
							type="button" onclick="tableColsAdd();" value="取消" /></td>
					</tr>
				</table>
			</form>
		</div>
	</div>
</body>
</html>
