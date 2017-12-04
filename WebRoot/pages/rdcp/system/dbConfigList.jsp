<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<title>数据库配置管理</title>
		<jsp:include page="/pages/framework/base.jsp" />
		<script type="text/javascript" src="scripts/rdcp/rdcp.js"></script>
		<script type="text/javascript" src="scripts/service/user.help.js"></script>
		<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
		<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>		
		<script type="text/javascript" src="scripts/common/ztree.help.js"></script>
		<script type="text/javascript" src="scripts/service/module.help.js"></script>
		<script type="text/javascript" src="scripts/service/function.help.js"></script>
		<script type="text/javascript">
		var calobjparams ={
				colModel : [ {
					name : 'ID',
					align : 'center',
					index : 'ID',
					sortable:false,
					hidden:false
				}, {
					name : '系统编码',
					index : 'SYS_CODE',
					align : 'center',
					sortable:true,
					formatoptions : {}
				},{
					name:'系统名称',
					index:'SYS_NAME',
					align:'center',
					sortable:true
				},{
					name:'数据库配置名称',
					index:'NAME',
					align:'center',
					sortable:true
				},{
					name:'数据库类型',
					index:'DB_TYPE',
					align:'center',
					sortable:true
				},{
					name:'连接串',
					index:'DB_URL',
					align:'center',
					sortable:true
				},{
					name:'数据库版本',
					index:'DB_VERSION',
					align:'center',
					sortable:true
				},{
					name:'用户名称',
					index:'DB_USER',
					align:'center',
					sortable:true					
				},{
					name:'用户密码',
					index:'DB_PASSWORD',
					align:'center',
					sortable:true
				},{
					name:'是否默认',
					index:'DEFAULT_FLAG',
					align:'center',
					sortable:true,
					 formatter:function(cell, options, row, tr, td) {
					 	return (cell==0?'不是默认':'默认'); 
					 }
				},{
					name:'驱动程序',
					index:'DRIVER_CLASS',
					align:'center',
					sortable:true
				},{
		            name : '操作',
		            index : 'DD',
		            align : 'left',
		            sortable:false,
		            width:"150",
		            formatter : createButton,
		            formatoptions : {}
		        }
				
				],
				caption : "数据库配置查看",
				edit : true,
				multiselect:true,
				width:"98.5%",
				parentwidth:true,
				onSelectRow:testC,
				pager:'#pagerdt'
		 }	
		 function createButton(cell, options, rowObj){
				return  GRID.button({className:"btn_edit",onclick:"updateConfig('" + rowObj["ID"]+"');",title:"编辑当前行数据"});
		 }
		 function testC(Id,rowN,ColN){
			CORE.request("DS_INIT_DB_CONFIG_EDIT", {data:"id=" + Id}, function(data) {
		        CORE.fillForm(document.editForm, data);
		        document.getElementById('editDiv').style.display = "";
		    });		
		 }	
		$(function(){			
			//生成列表
			GRID.create("#listdt","DS_DB_CONFIG_LIST",calobjparams,"gridParam");
			//填充下拉框
			CORE.loadSelect("sys_code","DS_SYS_SELECT_4_DB_CONFIG",{data:""});
		});
		
		/*
		*修改数据
		*/
		function updateConfig(id){
			CORE.request("DS_INIT_DB_CONFIG_EDIT", {data:"id=" + id}, function(data) {
		        CORE.fillForm(document.editForm, data);
		        document.getElementById('editDiv').style.display = "";
		    });			
		}
		
		/*
		*添加
		*/
		function _addDev(){
			document.editForm.reset();
			document.getElementById('editDiv').style.display = "";
		}
		
		/*
		*添加提交
		*/
		function _addSubmit(){
		        //CORE.loadRules("dsform", "RDC_CFG_DATASOURCE", false, function() {
             CORE.submitForm("DS_EDIT_4_DB_CONFIG", "editForm", {}, function(data) {
                 if (data > 0) {
                     GRID.reload("listdt");
                     CORE.info("操作成功!");
                     document.getElementById('editDiv').style.display = "none";
                 } else {
                     CORE.info("操作失败,请检查后重新操作,谢谢!");
                     document.getElementById('editDiv').style.display = "none";
                 }
             });
                //});
		}
		
		/*
		*批量删除系统配置
		*/
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
		            CORE.request("DS_DB_CONFIG_DELETE", {data:id}, function(data) {
		                GRID.reload("listdt");
		                CORE.info("操作成功!");
		            });
	            });
	        } else {
	        	CORE.info("请选择所要删除的数据。");
	            return;
	           
	        }
	    }
		</script>
	</head>
	<body>
		<jsp:include page="/pages/navbar.jsp" />
		<div class="moudles">
			<div class="barquery">
				<div class="barquerycenter">
					数据库配置管理
				</div>
				<div class="barquerybtn">
					<a class="btn_arrow_left" href="javascript:void(0);" onclick="window.history.go(-1);" title="返回业务系统管理界面">返回</a>
					<a class="btn_add" href="javascript:void(0);" onclick="_addDev();"
						title="添加数据库配置">添加</a>
					<a class="btn_delete" href="javascript:void(0);" onclick="batchDel();"
						title="删除数据库配置">删除</a>
					
				</div>
			</div>
		</div>
		<div>
			<table style="width: 100%">
				<tr>
					<td valign="top" style="width: 100%">
						<form name="gridParam" id="gridParam"
							onsubmit="GRID.reload('listdt');return false;">
							<div class="barquerycontent" style="width: 100%">
								<table class="content_List" style="width: 100%">
									<tr>
										<td class='contenttd'>
											系统名称:
										</td>
										<td>
											<input type='text' name='s_sysName' id='s_sysName' />
											<!-- 从其他页面传过来的syscode -->
											<input type='text' name='ssyscode' id='ssyscode' value='${param._sysCode}' style="display:none;"/>
										</td>
										<td class='contenttd'>
											数据库配置名称:
										</td>
										<td>
											<input type='text' name='s_name' id='s_name' />
										</td>
										<td>
											<input type="submit" value=""
												onMouseOver="this.className='btnquery_mouseover'"
												onMouseOut="this.className='btnquery_mouseout'"
												Class="btnquery_mouseout" />
										</td>
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
		<div id='editDiv' style="display:none;">
			<form id="editForm" name="editForm" onsubmit="_addSubmit();return false;">
				<table>
					<tr class="formRow">
						<td class="formLabel">
							<input type="text" name="id" id="id" value="" style="display:none;"/>
							业务系统:
						</td>
						<td class="formField">
							<select id='sys_code' name='sys_code'>
							</select>
						</td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">
							配置别名:
						</td>
						<td class="formField">
							<input type="text" size="50" name="name" />
						</td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">
							数据库类型:
						</td>
						<td class="formField">
							<input type="text" size="50" name="db_type" />
						</td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">
							连接串:
						</td>
						<td class="formField">
							<input type="text"  size="50" name="db_url" />
						</td>
					</tr>

					<tr class="formRow">
						<td class="formLabel">
							数据库版本:
						</td>
						<td class="formField">
							<input type="text" size="50" name="db_version" />
						</td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">
							用户名称:
						</td>
						<td class="formField">
							<input type="text" size="50" name="db_user" />
						</td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">
							用户密码:
						</td>
						<td class="formField">
							<input type="text" size="50" name="db_password" />
						</td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">
							是否默认:
						</td>
						<td class="formField">
							<label><input type="radio" name="default_flag" value="0"/>不默认</label>
							<label><input type="radio" name="default_flag" value="1"/>默认</label>
						</td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">
							驱动程序 :
						</td>
						<td class="formField">
							<input type="text" size="50" name="driver_class" />
						</td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">
						</td>
						<td class="formField">
							<input type="submit" />
							&nbsp;
							<input type="reset" />
						</td>
					</tr>
				</table>
			</form>
		</div>
	</body>
</html>
