<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<title>当前在线用户</title>
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
            name:"用户名",
            align : 'center',
            index:"USERNAME",
            sortable:true
            
        },
        {
            name:"姓名",
            align : 'center',
            index:"NAME",
            sortable:true
        },
        {
            name:"登录时间",
            align : 'center',
            index:"LOGIN_TIME",
            sortable:true
        }
        ,   
        {
            name:"上次登录时间",
            index:"BEFORE_LOGIN_TIME_TIME",
            align : 'center',
            sortable:true
        }
        ,   
        {
            name:"上次注销时间",
            index:"BEFORE_LOGOUT_TIME",
            align : 'center',
            sortable:true
        }
        ,   
        {
            name:"登录地址",
            index:"login_ip",
            align : 'center',
            sortable:true
        }        
        ,   
        {
            name:"IP登录次数",
            index:"login_ip_count",
            align : 'center',
            sortable:true
        }
        ,   
        {
            name:"登录次数",
            index:"login_count",
            align : 'center',
            sortable:true
        }
        
    ],
    caption : "当前在线用户列表",
    multiselect:false,
    parentwidth:true,
    width:"99.9%",
    pager: "#pagerdt"
};
$(function(){			
	//生成校验规则列表
	GRID.create("#listdt","DS_ONLINE_USER_LIST",menuGridParams,"gridParam");
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
function  editRule(id){
	    ruleEditDlgOpts.title="修改校验规则";
	    ruleEditDlgOpts.buttons = {
				'返回':function(){
				  $("#ruleEditDiv").dialog("close");
				},
				'修改':function(){
					CORE.submitForm("DS_VALID_RULE_EDIT", "ruleEditForm", {}, function(data) {
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
    CORE.request("DS_VALID_RULE_TEBLE_INIT",{data:"id="+id}, function(data) {
 		CORE.fillForm(document.ruleEditForm,data);
        $("#ruleEditDiv").dialog(ruleEditDlgOpts);
     }); 	
}
//删除校验规则
function deleteRule(id){
    	CORE.confirm("是否确认删除该纪录?", function() {
		 	CORE.request("DS_VALID_RULE_DELETE",{data:"id="+id}, function(data) {
		 		if (data > 0) {		 
	                  GRID.reload("listdt");
	                  CORE.info("操作成功!");
	            }else{
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
				<div class="barquerycenter">
					当前在线用户
				</div>
				<div class="barquerybtn">
					<input type="hidden" value="添加"
						class="btn_additionout auto_disabled" onclick="ruleAdd();" />
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
											用户名:
										</td>
										<td>
											<input type='text' name='loginUserName' id='loginUserName' />
										</td>
										<td class='contenttd'>
											姓名:
										</td>
										<td>
											<input type='text' name='loginName' id='loginName'/>
										</td>
										<td class='contenttd'>
											登录次数:
										</td>
										<td>
											<input type='text' name='loginCount' id='loginCount'/>
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
						<td class="formLabel">规则名称:</td>
						<td class="formField"><input type="text" name="name" id="name"/></td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">校验规则:</td>
						<td class="formField"><textarea id="valid_pattern" name="valid_pattern" rows="4" style="width:250px;"></textarea></td>
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
