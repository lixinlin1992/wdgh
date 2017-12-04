<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<title>参数类型</title>
		<jsp:include page="/pages/framework/base.jsp" />
		<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
		<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>		
		<script type="text/javascript" src="scripts/common/ztree.help.js"></script>

		<link type="text/css" rel="stylesheet"
			href="themes/default/css/rdcp.css">
		<script type="text/javascript" src="scripts/rdcp/rdcp.js"></script>
		<script type="text/javascript" src="scripts/service/function.help.js"></script>
		<script type="text/javascript">
	
//参数类型编辑对话框设置
var paramTypeEditDlgOpts = {
    title : "添加参数类型",
    width : "400",
    height : "300" ,
    modal : true,
    bgiframe : true,
    resizable:false
};	
//参数类型展示表格的属性
var paramTypeGridParams = {
    colModel:[
        {
            name:"业务系统",
            align : 'center',
            index:"SYS_CODE"
        },
        {
            name:"业务表编码",
            align : 'center',
            index:"CODE_TABLE"
            
        },       

        {
            name:"业务表名称",
            align : 'center',
            index:"CODE_TABLE_NAME",
            sortable:true
          
        },
        {
            name:"业务字段编码",
            align : 'center',
            index:"CODE_FIELD"
            
        },        
        {
            name:"业务字段名称",
            align : 'center',
            index:"CODE_FIELD_NAME",
            sortable:false
          
        },
 		{
            name:"类型名称",
            align : 'center',
            index:"NAME",
            sortable:true
          
        },        
        {
            name:"类型描述",
            align : 'center',
            index:"NOTE",
            sortable:false
          
        },
        {
            name:"是否可编辑",
            align : 'center',
            index:"EDIT_FLAG",
            sortable:false,
            formatter:function(cell, options, row) {
                return (cell == 0) ? "不可编辑" : "可编辑";
            }            
          
        },
        {
            name:"操作",
            align : 'center',
            index:"", 
            width:"60",
            sortable:false,
            formatter:function(cell, options, row) {
                return GRID.button({className:"btn_edit",onclick:"editParamType('" + row['ID'] + "');",title:"修改编码类型 ["+row["NAME"]+"]"})+
                        GRID.button({className:"btn_delete",onclick:"deleteParamType('" + row['ID']+"');",title:"删除编码类型 ["+row["NAME"]+"]"});
                /*
                return "<input type='button' value='修改' class='grid_button' onclick=\"editParamType('" + row['ID'] + "');\">"
                        + "<input type='button' value='删除' class='grid_button' onclick=\"deleteParamType('" + row['ID']+"')\">";
                        */
            }
        },
        {
            name:"ID",
            index:"ID",
            align : 'center',
            hidden:true
        }
        
    ],
    caption : "参数类型列表",   
    parentwidth:true,
    width:"99.9%",
    pager: "#pagerdt"
};
$(function(){	
	//生成校参数类型列表
	GRID.create("#listdt","DS_SERVICE_PARAM_TYPE_GRID",paramTypeGridParams,"gridParam");
	//填充系统下拉框
	CORE.loadSelect('sysSelect','DS_SYSTEM_SELECT_LIST',{});
	CORE.loadSelect('sys_code','DS_SYSTEM_SELECT_LIST',{});
});
//参数类型添加
function paramTypeAdd(){
	document.paramTypeEditForm.reset();  
    $("#code_table").removeAttr("readonly");        
    $("#code_field").removeAttr("readonly");  
    paramTypeEditDlgOpts.title="添加参数类型";
	paramTypeEditDlgOpts.buttons={
		'返回':function(){
			$("#paramTypeEditDiv").dialog("close");
		},
		'添加':function(){
			CORE.confirm("添加成功后,业务表编码和业务字段编码不能修改,是否确认添加?", function() {
			   CORE.submitForm("DS_SERVICE_PARAM_TYPE_EDIT", "paramTypeEditForm", {}, function(data) {
	               if (data > 0) {
	                   GRID.reload("listdt");
	                   CORE.tip("编码类型已添加");
	                   $("#paramTypeEditDiv").dialog("close");
	               } else {
	                   CORE.tip("编码类型添加失败,请检查后重新操作!");
	                   $("#paramTypeEditDiv").dialog("close");
	               }
	           });	
           });
		}
	} 
	$("#paramTypeEditDiv").dialog(paramTypeEditDlgOpts);
}
//修改
function  editParamType(id){
	    paramTypeEditDlgOpts.title="修改参数类型";
	    paramTypeEditDlgOpts.buttons = {
				'返回':function(){
				  $("#paramTypeEditDiv").dialog("close");
				},
				'修改':function(){
					CORE.submitForm("DS_SERVICE_PARAM_TYPE_EDIT", "paramTypeEditForm", {}, function(data) {
		               if (data > 0) {
		                   GRID.reload("listdt");
		                   CORE.tip("编码类型修改成功!");
		                   $("#paramTypeEditDiv").dialog("close");
		               } else {
		                   CORE.tip("编码类型修改失败,请检查后重新操作,谢谢!");
		                   $("#paramTypeEditDiv").dialog("close");
		               }
		            });		
				}		
		}
    CORE.request("DS_SERVICE_PARAM_TYPE_INIT",{data:"id="+id}, function(data) {
 		CORE.fillForm(document.paramTypeEditForm,data);
        $("#paramTypeEditDiv").dialog(paramTypeEditDlgOpts);
        $("#code_table").attr("readonly","readonly");        
        $("#code_field").attr("readonly","readonly");        
     }); 	
}
//删除校验规则
function deleteParamType(id){
    	CORE.confirm("确定要删除选中的编码类型吗?注意：编码类型删除后将不能恢复，且该类型下的编码也会被删除！", function() {
		 	CORE.request("DS_SERVICE_PARAM_TYPE_DELETE",{data:"id="+id}, function(data) {
		 		if (data > 0) {		 
	                  GRID.reload("listdt");
	                  CORE.tip("编码类型已删除!");
	            }else{
	            	  CORE.tip("编码类型删除失败!");
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
				<div class="barquerycenter">
					参数类型
				</div>
				<div class="barquerybtn">
                    <a class="btn_add" href="javascript:void(0);" onclick="paramTypeAdd();" title="添加新的编码类型">添加</a>
                    <!--
					<input type="button" value="添加"
						class="btn_additionout auto_disabled" onclick="paramTypeAdd();" />
						-->
				</div>
			</div>
		</div>
		<div>
			<table style="width: 100%">
				<tr>
					<td valign="top" style="width: 100%">
						<form name="gridParam" id="gridParam">
							<p></p>
							<div class="barquerycontent" style="width: 100%">					
								<table class="content_List" style="width: 100%">
									<tr>
										<td class='contenttd'>
											业务系统:
										</td>
										<td>
											<select id="sysSelect" name="sysSelect">
												<option value="">--请选择--</option>
											</select>
										</td>
										<td class='contenttd'>
											业务表编码:
										</td>
										<td>
											<input type='text' name='code_table_ser' id='code_table_ser'/>
										</td>
										<td class='contenttd'>
											业务字段编码:
										</td>
										<td>
											<input type='text' name='code_field_ser' id='code_field_ser'/>
										</td>
										<td class='contenttd'>
											是否可编辑:
										</td>
										<td>
											<select id="edit_flag_ser" name="edit_flag_ser">
												<option value="">--请选择--</option>
												<option value="0">不可编辑</option>
												<option value="1">可编辑</option>
											</select>
										</td>
									</tr>
									<tr>
										<td class='contenttd'>
											参数类型名称:
										</td>
										<td>
											<input type='text' name='name_ser' id='name_ser'/>
										</td>
										<td class='contenttd'>
											业务表名称:
										</td>
										<td>
											<input type='text' name='code_table_name_ser' id='code_table_name_ser'/>
										</td>
										<td class='contenttd'>
											业务字段名称:
										</td>
										<td>
											<input type='text' name='code_field_name_ser' id='code_field_name_ser'/>									
										</td>								
										<td colspan="2">
											<input type="button" value=""
												onclick="javascript:GRID.reload('listdt')"
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
		<div id="paramTypeEditDiv" style="display:none;">
			<form name="paramTypeEditForm" id="paramTypeEditForm">
				<table align="center">
					<tr style="display:none;">
						<td>
							id
							<input type="text" id="id" name="id"/>
						</td>
					</tr>
					<tr class="formRow">
						<td class="formLabel" style="width:100px;">业务系统:</td>
						<td class="formField"><select id="sys_code" name="sys_code"><option value="">--请选择--</option></select></td>
					</tr>					
					<tr class="formRow" >
						<td class="formLabel">业务表编码:</td>
						<td class="formField"><input type="text" name="code_table" id="code_table" /></td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">业务表名称:</td>
						<td class="formField"><input type="text" name="code_table_name" id="code_table_name"/></td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">业务字段编码:</td>
						<td class="formField"><input type="text" name="code_field" id="code_field"/></td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">业务字段名称:</td>
						<td class="formField"><input type="text" name="code_field_name" id="code_field_name"/></td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">参数类型名称:</td>
						<td class="formField"><input type="text" name="name" id="name"/></td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">类型描述:</td>
						<td class="formField"><textarea id="note" name="note" rows="4" style="width:250px;"></textarea></td>
					</tr>
				</table>
			</form>
		</div>
	</body>
</html>
