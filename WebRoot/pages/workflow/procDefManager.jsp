<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
	<title>流程定义管理</title>
	<head>
		<jsp:include page="/pages/framework/base.jsp" />
		<link href="themes/default/css/style.css" rel="stylesheet"
			type="text/css">
		<link href="themes/default/css/public.css" rel="stylesheet"
			type="text/css" />
		<link href="themes/default/css/publicform.css" rel="stylesheet"
			type="text/css" />
		<script type="text/javascript" src="scripts/sunrise/common.js"></script>
		<script type="text/javascript" src="scripts/datePicker/WdatePicker.js"></script>
		<script type="text/javascript">
			var ProcessParams = {
				colModel : [
				{
					name : '流程名',
					index : 'NAME',
					width : "10%",
					align : "center",
					sortable : false,
					formatoptions : {}
				}, {
					name : '流程定义KEY',
					index : 'KEY',
					width : "10%",
					align : "center",
					sortable : false,
					formatoptions : {}
				}, {
					name : '版本' ,
					index : 'VERSION',
					width : "10%",
					align : "center",
					sortable : false,
					formatoptions : {}
				}, {
					name : '部署时间',
					index : 'TIME',
					width : "10%",
					align : "center",
					sortable : false,
					formatoptions : {}
				}],
				caption : "流程列表" ,
				edit : true,
				multiselect:false,
				width:"100%",
				pager:"#pagerdt"			
			};
			
			$(function(){
				GRID.create("#listdt", "DS_PROCESS_DEFLIST",ProcessParams,"ProcessForm");
			});
			//添加操作
			function add(){
				$("#importPanel").dialog(Opt);
			} 
		    var Opt = {
				title:"上传信息",
				width:"380px", 
				height:"250" , 
				modal:true,
				bgiframe:true,
				resizable:false,
				buttons : {
				   '取消':function(){$("#importPanel").dialog("close");},
				   '上传':function(){
				        if($("#file").val() == "" || $("#file").val() == null){
		        		    CORE.info("请选择你要导入的文件再上传！");
		        		    return ;
		        	    }
     			        COMMON.upload({
					        url:'framework.do?ds=DS_PROCESS_UPLOAD',
					        formName:'importForm'
					    },function(data){
						    $("#importPanel").dialog("close");
						    GRID.reload("listdt");
				   	    });
			   	  }
			   }
		   };	
	</script>
	</head>

	<body style="padding: 0; margin: 0">&nbsp; 
		<jsp:include page="/pages/navbar.jsp" />
		<div class="modules">
			<div class="barquery">
				<div id="list_title" class="barquerycenter">
				</div>
			</div>
			<div align="right"><input name="btn_addition" class="btn_additionout" value="添加" type="button" onclick='add();'/></div>
			<div id="_ProcessDialog" style="width: 100%;hight:150px">
 				<form name="ProcessForm">
 				</form>
 			<div>
				<table id="listdt" style="margin: 0; padding: 0;"></table>
				<div id="pagerdt" style="margin: 0; padding: 0;"></div>
			</div>
		</div>
		<div id="importPanel" style="display:none;">
		     <form name="importForm" enctype="multipart/form-data" onSubmit="importData();return false;">   
				  <table>
					  <tr>
						  <td><strong>选择部署的流程定义文件</strong></td>
						  <td>
							  <input name="file" id="file" type="file" />
					  		  <input type="hidden" name="note" id="note" value="111" />			  
					      </td>
					  </tr>
					  <tr>
						  <td><strong>流程类型</strong></td>
						  <td>
							  <input name="type" id="type" type="text"/>
					      </td>
					  </tr>
				  </table>		  
			 </form>	
		</div>
	</body>
</html>
