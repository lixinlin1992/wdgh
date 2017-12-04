<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<title>校验规则</title>
		<jsp:include page="/pages/framework/base.jsp" />
		<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
		<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>
		<script type="text/javascript" src="scripts/common/ztree.help.js"></script>

		<link type="text/css" rel="stylesheet"
			href="themes/default/css/rdcp.css">
		<script type="text/javascript" src="scripts/rdcp/rdcp.js"></script>
		<script type="text/javascript" src="scripts/service/function.help.js"></script>
		<script type="text/javascript">
	
//规则编辑对话框选项
var ruleEditDlgOpts = {
    title : "添加规则",
    width : "400",
    height : "300" ,
    modal : true,
    bgiframe : true,
    resizable:false
};	
//规则展示表格的属性
var menuGridParams = {
    colModel:[
        {
            name:"规则名称",
            align : 'center',
            index:"ID"
            
        },
        {
            name:"校验规则",
            align : 'center',
            index:"parent_name"
            
        },
        {
            name:"规则描述",
            align : 'center',
            index:"note",
            sortable:false
          
        },
        {
            name:"操作",
            align : 'center',
            index:"", 
            width:"40",
            sortable:false,
            formatter:function(cell, options, row) {
                return GRID.button({className:"btn_edit",onclick:"editRule('"+row["ID"]+"')",title:"修改规则"})+
                        GRID.button({className:"btn_delete",onclick:"deleteRule('"+row["ID"]+"')",title:"删除规则"});
                /*
                return "<input type='button' value='修改' class='grid_button' onclick=\"editRule('" + row['ID'] + "');\">"
                        + "<input type='button' value='删除' class='grid_button' onclick=\"deleteRule('" + row['ID']+"')\">";
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
    caption : "校验规则列表",
    multiselect:false,
    parentwidth:true,
    width:"99.9%",
    pager: "#pagerdt"
};
$(function(){			
	//生成校验规则列表
	GRID.create("#listdt","DS_VALID_RULE_GRID",menuGridParams,"gridParam");
});
//规则添加
function ruleAdd(){
	document.ruleEditForm.reset();  
	ruleEditDlgOpts.buttons={
		'返回':function(){
			$("#ruleEditDiv").dialog("close");
		},
		'添加':function(){
		  CORE.submitForm("DS_VALID_RULE_EDIT", "ruleEditForm", {}, function(data) {
               if (data > 0) {
                   CORE.tip("规则添加成功!");
                   GRID.reload("listdt");
                   $("#ruleEditDiv").dialog("close");
               } else {
                   CORE.tip("添加规则失败,请检查后重新操作!");
                   //$("#ruleEditDiv").dialog("close");
               }
           });	
		}
	} 
	$("#ruleEditDiv").dialog(ruleEditDlgOpts);
}
//修改
function  editRule(id){
	    ruleEditDlgOpts.title="修改校验规则";
	    ruleEditDlgOpts.buttons = {
				'返回':function(){
				  $("#ruleEditDiv").dialog("close");
				},
				'修改':function(){
					CORE.submitForm("DS_VALID_RULE_EDIT", "ruleEditForm", {}, function(data) {
		               if (data > 0) {
                           CORE.tip("修改规则成功!");
		                   GRID.reload("listdt");
		                   $("#ruleEditDiv").dialog("close");
		               } else {
		                   CORE.tip("操作失败,请检查后重新操作!");
		                   //$("#ruleEditDiv").dialog("close");
		               }
		            });		
				}		
		}
    CORE.request("DS_VALID_RULE_TEBLE_INIT",{data:"id="+id}, function(data) {
 		CORE.fillForm(document.ruleEditForm,data);
        $("#ruleEditDiv").dialog(ruleEditDlgOpts);
     }); 	
}
//删除校验规则
function deleteRule(id){
    	CORE.confirm("确认要删除该校验规则吗?注意：校验规则删除后将不能恢复！", function() {
		 	CORE.request("DS_VALID_RULE_DELETE",{data:"id="+id}, function(data) {
		 		if (data > 0) {		 
	                  GRID.reload("listdt");
	                  CORE.tip("校验规则删除成功!");
	            }else{
	            	  CORE.tip("校验规则删除失败!");
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
					校验规则
				</div>
				<div class="barquerybtn">
                    <a class="btn_add" href="javascript:void(0);" onclick="ruleAdd();" title="添加新的校验规则">添加</a>
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
											规则名称:
										</td>
										<td>
											<input type='text' name='ruleName' id='ruleName' />
										</td>
										<td class='contenttd'>
											校验规则:
										</td>
										<td>
											<input type='text' name='validateRule' id='validateRule'/>
										</td>
										<td class='contenttd'>
											规则描述:
										</td>
										<td>
											<input type='text' name='ruleNote' id='ruleNote'/>
										</td>
										<td>
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
		<div id="ruleEditDiv" style="display:none;">
			<form name="ruleEditForm" id="menuEditForm">
				<table align="center">
					<tr style="display:none;">
						<td>
							<!-- 规则id -->
							<input type="text" id="id" name="id"/>
						</td>
					</tr>
					<tr class="formRow" >
						<td class="formLabel" style="width:90px;">规则名称:</td>
						<td class="formField"><input type="text" name="name" id="name"/></td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">校验规则:</td>
						<td class="formField"><textarea id="valid_pattern" name="valid_pattern" rows="6" style="width:250px;"></textarea></td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">规则描述:</td>
						<td class="formField"><textarea id="note" name="note" rows="4" style="width:250px;"></textarea></td>
					</tr>
				</table>
			</form>
		</div>
	</body>
</html>
