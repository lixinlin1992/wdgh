<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<title>数据源参数</title>
		<jsp:include page="/pages/framework/base.jsp" />
		<jsp:include page="/pages/framework/base.jsp" />
		<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
		<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>
		<script type="text/javascript" src="scripts/common/ztree.help.js"></script>

		<link type="text/css" rel="stylesheet"
			href="themes/default/css/rdcp.css">
		<script type="text/javascript" src="scripts/rdcp/rdcp.js"></script>
		<script type="text/javascript">
	 	var calobjparams ={
			//colNames : [ '参数名称','参数编码','类型','是否必须','操作','ID'],
			colModel : [ {
				name : '名称',
				align : 'center',
				index : '',
				sortable:false
			
			}, {
				name : '编码',
				index : '',
				align : 'center',
				sortable:false,
				formatoptions : {}
				
			}
			, {
				name : '类型',
				index : 'name',				
				align : 'center',
				sortable:false,
				//formatter : createButton2,							
				formatoptions : {}
				
			}			
			, {
				name : '是否必须',
				index : 'name',				
				align : 'center',
				sortable:false,
				//formatter : createButton2,							
				formatoptions : {}
				
			}			
			, {
				name : '操作',
				index : '',				
				align : 'center',
				sortable:false,
				width:50	,
				formatter : createButton2,							
				formatoptions : {}
				
			}			
			, {
				name : 'ID',
				index : 'ID',				
				align : 'center',
				sortable:false,	
				hidden : true,
				formatoptions : {}
				
			}			
			],
			caption : "数据项取数定义查看",
			edit : true,
			multiselect:true,
			width:"98.5%",
			parentwidth:true,
			pager:'#pagerdt'
	 }		
 	 function createButton2(cellValue,options,rowObj){
          return GRID.button({className:"btn_edit",onclick:"showAttr("+rowObj["ID"]+");",title:"修改"});
		//return "<input type='button' class='grid_button'  value='修改' onclick=\"showAttr("+rowObj['ID']+")\">";
	 }
	 //展示参数属性
	 function showAttr(id){
	       CORE.request("DS_DS_PARAM_TABLE",{data:"id="+id}, function(data) {
	       	   if(data.PATTERN_ID==-1){
	       	   	document.getElementById('VALID_PATTERN_TR').style.display = "";
	       	   }else if(data.PATTERN_ID==null || data.PATTERN_ID==''){
	       	   	document.getElementById('VALID_PATTERN_TR').style.display = "";
	       	   }else{
	       	   	document.getElementById('VALID_PATTERN_TR').style.display = "none";
	       	   }
			   CORE.fillForm(document.paramForm,data);
               $("#paramDiv").dialog(paramDivUpdSetting);
            });
	 }		
	$(function(){			
		//生成参数源列表
		GRID.create("#listdt","DS_DATA_SOURCE_PARAM_GRID",calobjparams,"gridParam");
		//校验规则下拉框
		CORE.loadSelect("PATTERN_ID","DS_CHECK_RULE",{data:""});
		document.getElementById('VALID_PATTERN_TR').style.display = "";
		CORE.loadRules("paramForm", "RDC_CFG_DS_PARAM");
	});
	//参数属性弹出框(添加)
	var	paramDivSetting={
		title : "参数属性",
		width : "350px", 
		height : "400" ,
		modal : true,
		buttons :{
				'返回':function(){
					$("#paramDiv").dialog("close");
				},
				'添加':function(){
					var PATTERN_ID = $('#PATTERN_ID').val();
	
					CORE.submitForm("DS_DATA_SOURCE_PARAM_ADD", "paramForm", {}, function(data) {
		               if (data > 0) {
		                   GRID.reload("listdt");
		                   CORE.info("操作成功!");
		                   $("#paramDiv").dialog("close");
		               } else {
		                   CORE.info("操作失败,请检查后重新操作,谢谢!");
		                   $("#paramDiv").dialog("close");
		               }
		           	});	
				}
		}
	}
	//现实参数具体信息
	function showParam(){
		document.paramForm.reset();
		document.getElementById('VALID_PATTERN_TR').style.display = "";
		$("#paramDiv").dialog(paramDivSetting);
	}
	
	//隐藏或者现实 自定义规则
	function selectChange(obj){
		if(obj.value==-1){
		  document.getElementById('VALID_PATTERN_TR').style.display = "";
		}else{
		  document.getElementById('VALID_PATTERN_TR').style.display = "none";
		   $("#VALID_PATTERN").val("");
		}
	}
	//参数属性弹出框(修改)
	var	paramDivUpdSetting={
		title : "参数属性",
		width : "350px", 
		height : "400" ,
		modal : true,
		buttons :{
			'返回':function(){
				$("#paramDiv").dialog("close");
			}
			,
			'修改':function(){
				CORE.confirm("是否确认修改?", function() {
					CORE.submitForm("DS_DATA_SOURCE_PARAM_ADD", "paramForm", {}, function(data) {
		               if (data > 0) {
		                   GRID.reload("listdt");
		                   CORE.info("操作成功!");
		                   $("#paramDiv").dialog("close");
		               } else {
		                   CORE.info("操作失败,请检查后重新操作,谢谢!");
		                   $("#paramDiv").dialog("close");
		               }
		           	});	
				});
			}
		}
	}	
	//参数批量删除
	function ParamDel(){
	 	var rows =GRID.getSelectRow("listdt","ID")
	 	if(rows.length>0){
	 		var id = "";
		 	for(i=0;i<rows.length;i++){		 		
		 		if(i==0){
		 			id = "id="+rows[i];
		 		}else{//
		 			id = id+"&id="+rows[i]
		 		}
		 	}		 	
		 	CORE.confirm("确认删除?", function() {
			 	CORE.request("DS_DS_PARAM_DEL_KV",{data:id}, function(data) {
			 		
	                   GRID.reload("listdt");
	                   CORE.info("操作成功!");
	                
	            });
		 	});
	 	}else{
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
					数据源参数
				</div>
				<div class="barquerybtn">
                        <a class="btn_arrow_left" href="javascript:void(0);" onclick="window.history.go(-1);" title="返回数据源管理">返回</a>
                        <a class="btn_add" href="javascript:void(0);" onclick="showParam();" title="添加新参数">添加</a>
                        <a class="btn_delete" href="javascript:void(0);" onclick="ParamDel();" title="删除选中的参数">删除</a>
                        <!--
						<input type="button" value="返回" class="btn_additionout auto_disabled"
							onclick="window.history.go(-1);" />
						<input type='button' class="btn_additionout auto_disabled" value='添加'
							onclick='showParam();' />
						<input type='button' class="btn_deleteout auto_disabled" value='删除' 
							onclick='ParamDel();'/>
							-->
				</div>
			</div>
		</div>
        <form name='gridParam'>
            <input type='text' name='_dsId' id='_dsId' value='${param.dsid}' style="display: none;" />
        </form>
		<div>
			<table style="width: 100%">
				<tr>
					<td align="center" style="width: 100%">
						<table id="listdt" style="margin: 0; padding: 0;"></table>
						<div id="pagerdt" style="margin: 0; padding: 0;"></div>
					</td>
				</tr>
			</table>
		</div>
		<div id='paramDiv' style='display: none;'>
			<form name='paramForm' id='paramForm'>
				<input type='text' name='id' id='id' value="" style="display:none;"/>
				<input type='text' name='DATASOURCE_ID' id='DATASOURCE_ID'  style="display:none;"
					value='${param.dsid}'/>
				<table class="">
					<tr>
						<td class='contenttd'>
							参数名称
						</td>
						<td>
							<input type='text' name='name' id='name' />
						</td>
					</tr>
					<tr>
						<td class='contenttd'>
							参数编码
						</td>
						<td>
							<input type='text' name='code' id='code' />
						</td>
					</tr>
					<tr>
						<td class='contenttd'>
							类型
						</td>
						<td>
							<select name='TYPE' id='TYPE'>
								<!--0 文本，1 数字，2 时间，3 短日期，4 长日期-->
								<option value='0'>
									文本
								</option>
								<option value='1'>
									数字
								</option>
								<option value='2'>
									时间
								</option>
								<option value='3'>
									短日期
								</option>
								<option value='4'>
									长日期
								</option>
							</select>
						</td>
					</tr>
					<tr>
						<td class='contenttd'>
							是否校验
						</td>
						<td>
							<select name='VALID_CHECK' id='VALID_CHECK'>
								<option value='0'>
									不校验
								</option>
								<option value='1'>
									校验
								</option>
							</select>
						</td>
					</tr>
					<tr>
						<td class='contenttd'>
							是否必需
						</td>
						<td>
							<select name='VAL_REQUIRED' id='VAL_REQUIRED'>
								<option value='0'>
									不是必须
								</option>
								<option value='1'>
									必须
								</option>
							</select>
						</td>
					</tr>
					<tr>
						<td class='contenttd'>
							允许多个
						</td>
						<td>
							<select name='MULTI_FLAG' id='MULTI_FLAG'>
								<option value='0'>
									不允许
								</option>
								<option value='1'>
									允许
								</option>
								<option value='2'>
									必须多个
								</option>
							</select>
						</td>
					</tr>
					<tr>
						<td class='contenttd'>
							长度
						</td>
						<td>
							<input type='text' name='VAL_LENGTH' id='VAL_LENGTH'/>
						</td>
					</tr>
					<tr>
						<td class='contenttd'>
							精度
						</td>
						<td>
							<input type='text' name='VAL_PRECISION' id='VAL_PRECISION'/>
						</td>
					</tr>
					<tr>
						<td class='contenttd'>
							校验规则
						</td>
						<td>
							<select name='PATTERN_ID' id='PATTERN_ID'
								onchange="selectChange(this);">
								<option value='-1'>
									自定义
								</option>
							</select>
						</td>
					</tr>
					<tr id='VALID_PATTERN_TR' style='display: none;'>
						<td class='contenttd'>
							自定义规则
						</td>
						<td>
							<input type='text' name='VALID_PATTERN' id='VALID_PATTERN'/>
						</td>
					</tr>
					<tr>
						<td class='contenttd'>
							默认值
						</td>
						<td>
							<input type='text' name='DEFAULT_VAL' id='DEFAULT_VAL'/>
						</td>
					</tr>
				</table>
			</form>
		</div>
	</body>
</html>

