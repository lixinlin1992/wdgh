<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<jsp:include page="/pages/framework/base.jsp" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>编码维护</title>
<link href="themes/default/css/public.css" rel="stylesheet" type="text/css" />
<link href="themes/default/css/publicTable.css" rel="stylesheet" type="text/css" />
<link href="themes/default/css/publicform.css" rel="stylesheet" type="text/css" />
<link href="themes/default/css/style.css" rel="stylesheet" type="text/css"/>
<script type="text/javascript" src="scripts/sunrise/framework.js"></script>
<script type="text/javascript" src="scripts/js/publicform.js" ></script>
<script type="text/javascript">

var params = {
		colNames : [ '编码名称', '编码备注', '编码排序','编码类型','操作'],
		colModel : [ {
			name : '编码名称',
			index : 'name',
			align : "center",
			width : 60
		}, {
			name : '编码备注',
			index : 'note',
			align : "center",
			width : 100
		}, {
			name : '编码排序',
			index : 'order_id',
			width : 20,
			align : "center"
		}, {
			name : '编码类型',
			index : 'type_name',
			width : 60,
			align : "center"
		}, {
			name : '操作',
			//index : '_op',
			align : 'center',
			width : 50,
			formatter : createButton,
			formatoptions : {},
			sortable : false
		}],
		caption : "网点类型管理",
		edit : true,
		align : "center",
		width : "100%",
		pager: '#pagered',
		editurl:"",
		cellEdit:false
	};
	
		$(function(){
			GRID.create("#listtable", "DS_FRAMEWORK_SERVICE_PARAMETER_LIST", params,"serchbankcollection");
			
			CORE.loadSelect('code_type_id','DS_FRAMEWORK_SERVICE_CODE_TYPE_SELECT',{data:'codetypeid=29',value:'81'});
		});
	
		//创建按钮
		function createButton(cellvalue, options, rowObject){
			return "<input type='button' class='grid_button' value='修改' onclick='edit(\""+cellvalue+"\")'>";
		}
		//新增
		function add_parameter_settings(){
			//	$("form[name='addform']")[0].reset();
				document.editform.reset();
				CORE.loadRules("addform", "PARAMETER_SETTINGS");
				CORE.loadSelect('code_type_add','DS_FRAMEWORK_SERVICE_CODE_TYPE_SELECT',{data:'codetypeid=29',value:'81'});
				
				$("#dialog_add").dialog(dlgOpts_add);
		}
		var dlgOpts_add = {
				title : "新增网点类型",
				width : "450px", 
				height : "350" , 
				modal : true, 
				buttons : {
					'取消':function(){$("#dialog_add").dialog("close");},
					'确定':function(){
					CORE.submitForm("DS_FRAMEWORK_SERVICE_PARAMETER_ADD","addform",{},function(){$("#dialog_add").dialog("close");CORE.info("添加成功!");GRID.reload('listtable');})}
				}
		};
		//修改
		function edit(obj){
				CORE.loadForm("DS_FRAMEWORK_SERVICE_PARAMETER_EDIT","editform",{ruleId : "PARAMETER_SETTINGS",data:"id="+obj+"&ftl=_ftl"});
									
				$("#dialog").dialog(dlgOpts_edit);
		}
		var dlgOpts_edit = {
				title : "修改网点类型",
				width : "450px", 
				height : "350" , 
				modal : true, 
				buttons : {
					'取消':function(){$("#dialog").dialog("close");},
					'确定':function(){CORE.submitForm("DS_FRAMEWORK_SERVICE_PARAMETER_UPDATE","editform",{},function(){$("#dialog").dialog("close");CORE.info("修改成功!");GRID.reload('listtable');})}
				}
		};
		</script>
</head>

<body style="padding: 0; margin: 0">
<jsp:include page="/pages/navbar.jsp"/>
<div class="modules">
	<div class="barquery">
		<div class="barqueryleft"></div>
		<div class="barquerycenter">编码维护</div>
		<div class="barqueryright"></div>
		<div class="barquerybtn"><input name="btn_addition" class="btn_additionout" value="添加" type="button" onclick='add_parameter_settings();'/></div>
	</div>
    <center>
    <form name="serchbankcollection" onsubmit="GRID.reload('listtable');return false;">
		<div class="barquerycontent" align="center">
			<table class="content_List">
                  <tr>
                    <td align="right" class="contenttd" style="width:150px">编码名称：</td>
                    <td align="left" style="width:150px" ><input name="code_name" class="textbox_css" style="width:100px" /></td>
				    <td  align="right" class="contenttd" style="width:150px">编码类型：</td>
				    <td  align="left" ><select name="code_type_id" id="code_type_id"><option value="">--请选择--</option></select>
                    <input class="btnquery_mouseout" onmouseover="this.className='btnquery_mouseover'"
									onmouseout="this.className='btnquery_mouseout'" type="submit" value=""/>
                    </td>
                    
                </tr>
			</table>

		</div>
	</form>
    <div style="width:98%;">
        <table id="listtable" align="center" style="margin: 0; padding: 0;"></table>
        <div id="pagered" style="margin: 0; padding: 0;"></div>
    </div>
<div id="dialog" style="display: none;" class="modules">
				<br/>
				<form name="editform" onsubmit="return false;">
				
                    	
					<table align="center">
						<tr class="formRow" >
							<td class="formLabel" >
								编码编码：
							</td>
							<td class="formField">
								<input id="id" name="id" type="text" readonly="readonly" style="width:150px;display: none;"/>
								<input id="ids" name="ids" disabled="disabled" type="text" style="width:150px;"></input>
							</td>
						</tr>
						<tr class="formRow">
							<td class="formLabel">
								编码类型：
							</td>
							<td class="formField">
								<input id="code_type" name="code_type" disabled="disabled" type="text" style="width:150px;"/>
							</td>
						</tr>
						<tr class="formRow">
							<td class="formLabel">
								编码名称：
							</td>
							<td class="formField">
								<input id="name" name="name" type="text" style="width:150px;"/>
							</td>
						</tr>
						<tr class="formRow">
							<td class="formLabel">
								编码备注：
							</td>
							<td class="formField">
								<textarea id="note" name="note" cols="22" rows="5" style="width:150px;"></textarea>
							</td>
						</tr>
						<tr class="formRow">
							<td class="formLabel">
								编码排序：
							</td>
							<td class="formField">
								<input id="order_id" name="order_id" type="text" style="width:150px;"></input>
							</td>
						</tr>
			
						
					
						
					</table>
                  
				</form>
			</div>
<div id="dialog_add" style="display: none;" class="modules">
				<br/>
				<form name="addform" onsubmit="return false;">
				
                    	
					<table align="center">
						<tr class="formRow">
							<td class="formLabel">
								编码类型：
							</td>
							<td class="formField">
								<select name="code_type_add" id="code_type_add"><option value="">--请选择--</option></select>
							</td>
						</tr>
						<tr class="formRow">
							<td class="formLabel">
								编码：
							</td>
							<td class="formField">
								<input id="code_add" name="code_add" type="text" style="width:150px;"/>
							</td>
						</tr>
						<tr class="formRow">
							<td class="formLabel">
								编码名称：
							</td>
							<td class="formField">
								<input id="name_add" name="name_add" type="text" style="width:150px;"/>
							</td>
						</tr>
						<tr class="formRow">
							<td class="formLabel">
								编码备注：
							</td>
							<td class="formField">
								<textarea id="note_add" name="note_add" cols="22" rows="5" style="width:150px;"></textarea>
							</td>
						</tr>
						<tr class="formRow">
							<td class="formLabel">
								编码排序：
							</td>
							<td class="formField">
								<input id="order_add" name="order_add" type="text" style="width:150px;"></input>
							</td>
						</tr>
			
						<tr class="formRow">
							<td class="formLabel">
								编码排状态：
							</td>
							<td class="formField">
								<select name="status_add" id="status">
									<option value="">--请选择--</option>
									<option value="1">有效</option>
									<option value="0">无效</option>
								</select>
							</td>
						</tr>	
					
						
					</table>
                  
				</form>
			</div>			
    	</center>
	</div>	
</body>
</html>
