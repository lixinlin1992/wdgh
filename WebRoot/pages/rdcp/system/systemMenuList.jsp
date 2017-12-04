<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<title>系统菜单</title>
		<jsp:include page="/pages/framework/base.jsp" />
		<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
		<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>		
		<script type="text/javascript" src="scripts/common/ztree.help.js"></script>
		<link type="text/css" rel="stylesheet"
			href="themes/default/css/rdcp.css"/>
		<script type="text/javascript" src="scripts/rdcp/rdcp.js"></script>
		<script type="text/javascript" src="scripts/service/function.help.js"></script>
		<script type="text/javascript">
	
//菜单编辑对话框选项
var menuEditDlgOpts = {
    title : "编辑菜单",
    width : "400",
    height : "300" ,
    modal : true,
    bgiframe : true,
    resizable:false
};	
//菜单展示表格的属性
var menuGridParams = {
    colNames:["编号","名称","级别","排序","上级菜单","功能","系统名称","备注","操作","ID","TYPE"],
    colModel:[
        {
            name:"编号",
            align : 'center',
            index:"ID"
            
        },
        {
            name:"名称",
            align : 'center',
            index:"name"
          
        },
        {
            name:"级别",
            align : 'center',
            index:"level_id",
           
            formatter:function(cell, options, row) {
                return (cell == 1) ? "一级菜单" : (cell == 2 ? "二级菜单" : "三级菜单");
            }
        },
        {
            name:"排序",
            align : 'center',
            index:"order_id"
           
        },
        {
            name:"上级菜单",
            align : 'center',
            index:"parent_name"
            
        },
        {
            name:"功能",
            align : 'center',
            index:"FUNCTION_ID"
        },
        {
            name:"系统名称",
            align : 'center',
            index:"SYS_NAME"
        },
        {
            name:"备注",
            align : 'center',
            index:"note",
            sortable:false
          
        },
        {
            name:"操作",
            align : 'center',
            index:"", 
            width:"80",
            sortable:false,
            formatter:function(cell, options, row) {
                return GRID.button({className:"btn_edit",onclick:"editMenu('"+row["ID"]+"','"+row["TYPE"]+"');",title:"修改菜单"})+
                        GRID.button({className:"btn_delete",onclick:"deleteMenu('"+row["ID"]+"','"+row["TYPE"]+"');",title:"删除菜单"});
                /*
                return "<input type='button' value='修改' class='grid_button' onclick=\"editMenu('" + row['ID']+"','"+ row['TYPE'] + "')\">"
                        + "<input type='button' value='删除' class='grid_button' onclick=\"deleteMenu('" + row['ID']+"','"+ row['TYPE']+"')\">";
                        */
            }
        },
        {
            name:"ID",
            index:"ID",
            align : 'center',
            hidden:true
        },
        {
            name:"TYPE",
            index:"TYPE",
            align : 'center',
            hidden:true
           
        }        
        
    ],
    caption : "系统菜单列表",
    multiselect:false,
    //parentwidth:true,
    width:"80%",
    pager: "#pagerdt"
};
	//系统菜单修改
    function editMenu(id,type){
	    menuEditDlgOpts.title="修改系统菜单";
	    menuEditDlgOpts.buttons = {
				'返回':function(){
				  $("#menuEditDiv").dialog("close");
				},
				'修改':function(){
					CORE.submitForm("DS_SYS_MENU_EDIT", "menuEditForm", {}, function(data) {
		               if (data > 0) {
			               if(id !=undefined ||id!=null || id!="" ){
			               		/*获取当前节点的父亲节点
			               		var menuNode_tmp = menuTree.getNodeById(id,type);
			               		var menuSelectNode_tmp = menuSelectTree.getNodeById(id,type);*/
		               			/*刷新菜单选择树*/
		               			var datas = {"name":$("#name").val()};
		               			 
		               			menuTree.updateNodeData(id,type,datas);
			               		//menuTree.refreshNode(menuNode_tmp.parentNode.id,menuNode_tmp.parentNode.type);
			               		//刷新上级菜单选择树
			               		menuSelectTree.updateNodeData(id,type,datas);	
			               }			               
							//$("#menuid").val(id);	
						  // $("#sMenuName").val("");			               
		                   GRID.reload("listdt");
		                   //CORE.info("操作成功!");
                           CORE.tip("菜单修改成功");
		                   $("#menuEditDiv").dialog("close");
		               } else {
		                   //CORE.info("操作失败,请检查后重新操作,谢谢!");
		                   $("#menuEditDiv").dialog("close");
                           CORE.tip("菜单操作失败");
		               }
		            });		
				}		
		}
       CORE.request("DS_SYSTEM_MENU_TEBLE_INIT",{data:"id="+id}, function(data) {
       	  if(data.level_id==3){
 			$("#function_name").removeAttr("disabled");
			$("#funcBtn").removeAttr("disabled");
       	  }else{
       	  	$("#function_name").attr("disabled","none");
			$("#funcBtn").attr("disabled","none");
       	  }
	       
		   CORE.fillForm(document.menuEditForm,data);
           $("#menuEditDiv").dialog(menuEditDlgOpts);
        }); 
    }
    //系统菜单删除
    function deleteMenu(id,type){  

    	//alert(id+"  "+type);
    	CORE.confirm("是否确认删除该纪录?", function() {
		 	CORE.request("DS_SYSTEM_MENU_DELETE",{data:"id="+id}, function(data) {
		 		if (data > 0) {		 
		               if(id !=undefined ||id!=null || id!="" ){
		                	//刷新菜单选择树
		                	menuTree.removeNode(id,type);
		                	//刷新上级菜单选择树
		               		menuSelectTree.removeNode(id,type);	    		               
		               }	 		
					 
	                  GRID.reload("listdt");
	                  //CORE.info("操作成功!");
                     CORE.tip("菜单已经删除");
	            }else{
	            	  //CORE.info("操作失败!");
                     CORE.tip("菜单删除失败");
	            }      
	        });      	
    	});
  	
    }
    
	//点击树出发的事件		
	function zTreeOnClick(event, treeId, treeNode) {		
		//type  0是系统,其他是菜单,3是最低菜单
		if(treeNode.type==0){
			$("#sys").val(treeNode.sys);		
			$("#menuid").val("");			
		}else {
			$("#sys").val(treeNode.sys);			
			$("#menuid").val(treeNode.id);
		}
		if(treeNode.type==0){//系统
			$("#parent_id").val("0");
			$("#sName").val(treeNode.name);
			$("#parent_type").val(treeNode.type);
			$("#tNodeId").val(treeNode.id);
			$("#level_id").val("1");
			$("#level_name").val("一级菜单");
			$("#function_name").attr("disabled","none");					
			$("#funcBtn").attr("disabled","none");				
		}else if(treeNode.type==1){//一级菜单
			$("#parent_id").val(treeNode.id);
			$("#parent_type").val(treeNode.type);
			$("#sName").val(treeNode.name);
			$("#tNodeId").val(treeNode.id);
			$("#level_id").val("2");
			$("#level_name").val("二级菜单");	
			$("#function_name").attr("disabled","none");					
			$("#funcBtn").attr("disabled","none");					
		}else if(treeNode.type==2){//二级菜单
			$("#parent_id").val(treeNode.id);
			$("#sName").val(treeNode.name);
			$("#tNodeId").val(treeNode.id);
			$("#parent_type").val(treeNode.type);
			$("#level_id").val("3");
			$("#level_name").val("三级菜单");		
			$("#function_name").attr("disabled","");					
			$("#funcBtn").attr("disabled","");					
		}else if(treeNode.type==3){
			document.menuEditForm.reset();
		}		
		findSys(treeNode);
		//填充搜索的"上级菜单"
		$("#sMenuName").val("");		
		GRID.reload('listdt');	
		//填充搜索的"上级菜单"
		$("#sMenuName").val(treeNode.name);
	}
	//菜单树
	var menuTree;
    //上级菜单选择树
    var menuSelectTree;
    //功能树
    var funcSelectTree;
	$(function(){			
		//生成菜单树
		menuTree = new ZTree("memu_tree", "DS_SYSTEM_MENU_TREE",{nodeClicked:zTreeOnClick,async:"true"});
		//上级菜单选择树
		menuSelectTree = new ZTree("memu_select_tree", "DS_SYSTEM_MENU_TREE",{nodeClicked:menuSelect,async:"true",otherParam:{inx:0}});
		//生成菜单列表
		GRID.create("#listdt","DS_SYSTEM_MENU_LIST",menuGridParams,"gridParam");
		
		CORE.loadRules("menuEditForm", "SYS_P_MENU");
	});

	//上级菜单选择树事件
	function menuSelect(event, treeId, treeNode){
		//document.menuEditForm.reset();
		if(treeNode.type==0){//系统
			$("#parent_id").val("0");
			$("#sName").val(treeNode.name);
			$("#tNodeId").val(treeNode.id);
			$("#parent_type").val(treeNode.type);
			$("#level_id").val("1");
			$("#level_name").val("一级菜单");
			$("#function_name").attr("disabled","none");					
			$("#funcBtn").attr("disabled","none");				
		}else if(treeNode.type==1){//一级菜单
			$("#parent_id").val(treeNode.id);
			$("#tNodeId").val(treeNode.id);
			$("#parent_type").val(treeNode.type);
			$("#sName").val(treeNode.name);
			$("#level_id").val("2");
			$("#level_name").val("二级菜单");	
			$("#function_name").attr("disabled","none");					
			$("#funcBtn").attr("disabled","none");					
		}else if(treeNode.type==2){//二级菜单
			$("#parent_id").val(treeNode.id);
			$("#tNodeId").val(treeNode.id);
			$("#parent_type").val(treeNode.type);
			$("#sName").val(treeNode.name);
			$("#level_id").val("3");
			$("#level_name").val("三级菜单");		
			$("#function_name").removeAttr("disabled");
			$("#funcBtn").removeAttr("disabled");
		}
		findSys(treeNode);
		$("#menuSelectTreeDiv").dialog("close");
	}
	//递归找系统名称
	function findSys(treeNode){
		if(treeNode.type == 0){
			//$("#sys_name").val(treeNode.name);
			$("#sys_code").val(treeNode.sys);
			return;
		}else{
			findSys(treeNode.parentNode);
		}
	}


//菜单添加
var menuAdd = function (){
	menuEditDlgOpts.buttons = {
		'返回':function(){
		  $("#menuEditDiv").dialog("close");
		},
		'添加':function(){
			 CORE.submitForm("DS_SYS_MENU_EDIT", "menuEditForm", {}, function(data) {
	               if (data > 0) {
		      	       var tNodeId_tmp = $("#tNodeId").val();
		               var parent_type_tmp = $("#parent_type").val();
		               if(tNodeId_tmp !=undefined ||tNodeId_tmp!=null || tNodeId_tmp!="" ){
		                	//刷新菜单选择树
		                	menuTree.refreshNode(tNodeId_tmp,parent_type_tmp);
		                	//刷新上级菜单选择树
		               		menuSelectTree.refreshNode(tNodeId_tmp,parent_type_tmp);	    		               
		               }
	                   GRID.reload("listdt");
	                   CORE.tip("菜单已添加!");
	                   $("#menuEditDiv").dialog("close");
	               } else {
	                   CORE.tip("添加菜单失败,请检查后重新操作!");
	                   $("#menuEditDiv").dialog("close");
	               }
	           });				
		}		
	}
	var sys_code_tmp = $("#sys_code").val();
	var parent_id_tmp = $("#parent_id").val();
	var sName_tmp = $("#sName").val();
	var level_id_tmp = $("#level_id").val();
	var level_name_tmp = $("#level_name").val();		
	var tNodeId_tmp = $("#tNodeId").val();		
	var parent_type_tmp = $("#parent_type").val();		
	document.menuEditForm.reset();
	$("#sys_code").val(sys_code_tmp);
	$("#parent_id").val(parent_id_tmp);
	$("#sName").val(sName_tmp);
	$("#level_id").val(level_id_tmp);
	$("#level_name").val(level_name_tmp);
	$("#tNodeId").val(tNodeId_tmp);
	$("#parent_type").val(parent_type_tmp);
	if(level_id_tmp==3){
		$("#function_name").removeAttr("disabled");
		$("#funcBtn").removeAttr("disabled");
	}else{
		$("#function_name").attr("disabled","none");					
		$("#funcBtn").attr("disabled","none");		
	}		
	$("#menuEditDiv").dialog(menuEditDlgOpts);
}
//展示上级菜单选择树
function selectParentMenu(){
	menuEditDlgOpts.title="选择上级菜单";
	menuEditDlgOpts.width="300";
	menuEditDlgOpts.height="350";
	menuEditDlgOpts.buttons ={
		'返回':function(){
			$("#menuSelectTreeDiv").dialog("close");
		}
	}
	$("#menuSelectTreeDiv").dialog(menuEditDlgOpts);
}
//展示功能选择树
function selectFunc(){
	var sys_code_tmp = $("#sys_code").val();
	selectFunction(function (node){
	 if(node==null){
		$("#function_id").val("");
		$("#function_name").val("");
		$("#name").val("");
	  }else{ 
		  if( sys_code_tmp==node.sys_code){
			$("#function_id").val(node.id);
			$("#function_name").val(node.name);
			$("#name").val(node.name);
			 return true;
		  }
	  }
	});
}

		</script>
	</head>

	<body>
		<jsp:include page="/pages/navbar.jsp" />
		<div class="moudles">
			<div class="barquery">
				<div class="barquerycenter">
					系统菜单维护
				</div>
				<div class="barquerybtn">
                    <a class="btn_add" href="javascript:void(0);" onclick="menuAdd();" title="添加新的菜单">添加菜单</a>
                    <!--
					<input type="button" value="添加"
						class="btn_additionout auto_disabled" onclick="menuAdd()" />
						-->
				</div>
			</div>
		</div>
		<div>
			<table>
				<tr>
					<td valign="top">
						<!-- 菜单树 -->
						<div id="memu_tree" class="tree"
							style="width: 200px; height: 500px; overflow-y: auto;">
						</div>
						<!-- 上级菜单选择树 -->
						<div id="menuSelectTreeDiv" style="display:none;">
							<div id="memu_select_tree" class="tree"
								style="width: 200px; height: 250px; overflow-y: auto;">
							</div>
						</div>	
						<!-- 功能树 -->
						<div id="funcSelectTreeDiv" style="display:none;">
							<div id="func_select_tree" class="tree"
								style="width: 200px; height: 250px; overflow-y: auto;">
							</div>
						</div>											
					</td>
					<td valign="top" style="width: 100%">
						<form name="gridParam" id="gridParam" onSubmit="javascript:GRID.reload('listdt');return false;">
							<p></p>
							<div class="barquerycontent" style="width: 100%">
								<!-- 菜单id -->
								<input type="text" name="menuid" id="menuid" style="display:none;"/>
								<!-- 系统编码 -->
								<input type="text" name="sys" id="sys" style="display:none;"/>

								<table class="content_List" style="width: 100%">
									<tr>
										<td class='contenttd'>
											上级菜单:
										</td>
										<td>
											<input type='text' name='sMenuName' id='sMenuName' />
										</td>
										<td class='contenttd'>
											菜单名称:
										</td>
										<td>
											<input type='text' name='menuName' id='menuName'/>
										</td>
										<td class='contenttd'>
											功能名称:
										</td>
										<td>
											<input type='text' name='gongNeng' id='gongNeng'/>
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
		<div id="menuEditDiv" style="display:none;">
			<form name="menuEditForm" id="menuEditForm">
				<table align="center">
					<tr style="display:none;">
						<td>
							系统编码 
							<input type="text" id="sys_code" name="sys_code"/>
							 菜单id 
							<input type="text" id="id" name="id"/>
							当前菜单id
							<input type="text" name="parent_id" id="parent_id" value="0"/>
							当前菜单的type 
							<input type="text" name="parent_type" id="parent_type" value="0"/>
							 当前菜单树节点的 tId
							<input  type="text" name="tNodeId" id="tNodeId" value=""/>								
						</td>
					</tr>
					<tr class="formRow">
						<td class="formLabel" style="width:90px;">上级菜单:</td>
						<td class="formField"><input type="text" name="sName" id="sName" readonly="readonly"/>
						<input type="button" name="menu_sel_btn" id="menu_sel_btn" class="btnfunctionout auto_disabled" value="选择" onclick="selectParentMenu();"/>
						</td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">菜单级别:</td>
						<td class="formField"><input type="text" name="level_id" id="level_id" value="1" style="display:none;"/><input type="text" name="level_name" id="level_name" value="一级菜单" readonly="readonly"/></td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">菜单名称:</td>
						<td class="formField"><input type="text" name="name" id="name"/></td>
					</tr>
					<tr class="formRow" >
						<td class="formLabel">功能映射:</td>
						<td class="formField"><input type="text" style="display:none;" name="function_id" id="function_id" value="" /><input type="text" name="function_name" id="function_name" disabled="disabled"/>
						<input type="button" name="funcBtn" id="funcBtn" class="btnfunctionout auto_disabled" value="选择" onclick="selectFunc();"  disabled="disabled"/>
						</td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">菜单排序:</td>
						<td class="formField"><input type="text" id="order_id" name="order_id" /></td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">是否有效:</td>
						<td class="formField">
							<label><input type="radio" name="status" value="0"/>无效</label>
							<label><input type="radio" name="status" value="1" checked/>有效</label>
						</td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">备注:</td>
						<td class="formField"><textarea id="note" name="note" rows="4" style="width:250px;"></textarea></td>
					</tr>
				</table>
			</form>
		</div>
	</body>
</html>
