<%--
File: commOrgSecurity
User: kinz
Date: 11-5-12 下午4:58

属性授权
1. 部门授权
2. 用户授权
3. 角色授权
--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>对象属性授权</title>
    <jsp:include page="/pages/framework/base.jsp"/>
    <script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>
    <script type="text/javascript" src="scripts/common/ztree.help.js"></script>
    <style type="">
		.property_grid_table{
			font-size: 12px;
			border-collapse: collapse; 
			zoom:1;
			border-top:2px solid #5F8FBF;
		    border-color: #5F8FBF #DEDFE4 #DEDFE4;
		    border-right: 1px solid #DEDFE4;
		    border-style: solid;
		    border-width: 2px 1px 1px;
		    color: #000000;
		    font-size: 12px;
		    overflow: auto;
		}    
		.property_grid_td{
		    border: 1px solid #CAD9EA;
		    overflow: hidden;
		    padding: 0 2px;
		    text-align: center;
		    text-overflow: ellipsis;
		    white-space: nowrap;
		}		
		.property_grid_th{
		    background: none repeat scroll 0 0 #EBF5FE;
		    border: 1px solid #CAD9EA;
		    color: #000000;
		    font-weight: bold;
		    height: 24px;
		    line-height: 24px !important;
		    overflow: hidden;
		    text-align: center;
		    text-overflow: ellipsis;
		    white-space: nowrap;		
		}
		.property_grid_td ul{
			padding:0px;
		}
		.property_grid_td li{
		    line-height: 18px;
		    list-style: none outside none;
		    margin: 0;
		    padding: 0;
		    white-space: nowrap;
			cursor:hand;
		}
		.property_element_selected{
		    background-color: #FFE6B0;
		    border: 1px solid #FFB951;
		    color: black;
		    margin: 0;
		    opacity: 0.8;
		    padding: 3px 3px 2px 0;
			cursor:hand;
		}
    </style>
    <script type="text/javascript">
	/**
	 * 初始化函数
	 */	
		$(function(){
			//请求对象属性类型
		 	CORE.request("DS_PROPERTYSECURTY_TYPE_GET",{data:""}, function(data) {
	             for(var key in data){
	             	$("#propertyGroupType").append("<li><a id='_property_type_"+data[key]["value"]+"' "+
	             						" onclick='getProperties(\""+data[key]["value"]+"\")'>"+data[key]["label"]+"</a></li>");
	             }
	        });
	 		GRID.create("#userGroupList", "DS_PROPERTYSECURTY_USERGROUP_LIST",userGroupParams,"ugSearchForm");
	 		GRID.create("#userList", "DS_PROPERTYSECURTY_USER_LIST",userParams,"userSearchForm");
	 		GRID.create("#userGroupSelectList", "DS_USER_GROUP_LIST", _select_UserGroup, "userRoleForm");
	 		GRID.create("#userSelectList", "DS_USER_LIST", _select_User, "userManager");
		});
	/**
	 * 获取属性类型下的所有属性
	 */		
	 	function getProperties(code){
	 		//显示选中属性类型
	 		$("#propertyGroupType a").attr("class","");
	 		$("#_property_type_"+code).attr("class","property_element_selected");
	 		//显示提示信息
	 		$("#_Type_Select_Tip").css("display","");
	 		$("#_Property_Select_Tip").css("display","none");
	 		document.userSearchForm.typecode.value = code;
	 		document.ugSearchForm.typecode.value = code;
	 		//请求获取其下属性
		 	CORE.request("DS_PROPERTYSECURTY_GET",{data:"code="+code}, function(data) {
		 		$("#Property").empty();
	             for(var key in data){
	             	$("#Property").append("<li><a id='_property_"+data[key]["value"]+"' "+
	             						" onclick='generateInfo(\""+data[key]["value"]+"\")'>"+data[key]["label"]+"</li>");
	             }
	        });
	 	} 
	/**
	 * 展示属性的相关授权
	 */		   
	 	function generateInfo(id){
	 		//显示选中属性
	 		$("#Property a").attr("class","");
	 		$("#_property_"+id).attr("class","property_element_selected");
	 		//显示提示信息
	 		$("#_Property_Select_Tip").css("display","");
	 		$("#_Type_Select_Tip").css("display","none");
	 		document.userSearchForm.property_id.value = id;
	 		document.ugSearchForm.property_id.value = id;
	 		//获取列表信息
	 		GRID.reload("userGroupList");
	 		GRID.reload("userList");
	 		//显示查询表格
	 		$("#securityInfo").css("display","");		
	 	}
	//用户组列表参数
    var userGroupParams = {
	   colModel : [
	   {
	 	name:'编码',
		index:'code',
		hidden:true
	   }
	   	   ,
	   {
	 	name : '角色名',
		index : 'name',
		width : '30%',
		align : "center"
	   }
	   	   ,
	   {
	 	name : '备注',
		index : 'note',
		width : '40%',
		align : "center"
	   }
	   ,{
		name : '操作',
		width : '30%',
		align : "center" ,
		formatter : function(cellvalue, options, rowObject){
			return "<input value='删除' type='button' class='grid_button' onclick='delGroup(\"" + rowObject["code"] +"\")'/>"
		},
		formatoptions : {},
		sortable : false
	   }],
		edit : false,
		rowNum: 10,
		multiselect:false,
		width:600,
		pager: "#ugdt"
   };	 	
   //删除角色授权
   function delGroup(code){
   		var typecode = document.ugSearchForm.typecode.value;
   		var property_id = document.ugSearchForm.property_id.value;
   		var requestStr = "code="+code+"&property_id="+property_id+"&typecode="+typecode;
   		CORE.request("DS_PROPERTYSECURTY_DELUG",{data:requestStr}, function(data) {
	    	GRID.reload('userGroupList');
	    	GRID.reload('userList');
	    });     
   }
	//用户列表参数
    var userParams = {
	   colModel : [
	   {
	 	name:'ID',
		index:'ID',
		hidden:true
	   },{
	 	name : '用户名',
		index : 'NAME',
		width : '20%',
		align : "center"
	   },{
	 	name : '角色',
		index : 'GROUP_NAME',
		width : '30%',
		align : "center"
	   },{
	 	name : '部门',
		index : 'DEPT_NAME',
		width : '30%',
		align : "center"
	   },{
	 	name : '来源',
		index : 'SOURCE',
		hidden:true
	   },{
		name : '操作',
		width : '20%',
		align : "center" ,
		formatter : function(cellvalue, options, rowObject){
			if(rowObject["SOURCE"] == 0)
				return "<input value='删除' type='button' class='grid_button' onclick='delUser(\"" + rowObject["ID"] +"\")'/>";
			else 
				return "<input value='删除' type='button' class='grid_button' disabled/>";
		},
		formatoptions : {},
		sortable : false
	   }],
		edit : false,
		multiselect:false,
		width:600,
		rowNum: 10,
		pager: "#udt"
   };	 	
   //删除用户
   function delUser(id){
   		var typecode = document.userSearchForm.typecode.value;
   		var property_id = document.userSearchForm.property_id.value;
   		var requestStr = "id="+id+"&property_id="+property_id+"&typecode="+typecode;
   		CORE.request("DS_PROPERTYSECURTY_DELUSER",{data:requestStr}, function(data) {
	    	GRID.reload('userGroupList');
	    	GRID.reload('userList');
	    });     
   }   
   /**
    * 添加用户
    */
   function _addUser(){
   		$("#UserPanel").dialog(_select_User_Dlg);   
   };
   var _select_User_Dlg = {
			title : "添加用户",
			width : "800px", 
			height : "400" ,
			buttons : {
				'关闭':function(){
					$("#UserPanel").dialog("close");
				}
   			}
   		}   
   var _select_User = {
	    colModel : [
	        {
	            name : '工号',
	            index : 'account',
	            width : 50,
	            align : "center"
	        },
	        {
	            name : '名称',
	            index : 'name',
	            width : 50,
	            align : "center"
	        },
	        {
	            name : '角色',
	            index : 'GROUP_NAME',
	            align : "center",
	            width : 150
	        },
	        {
	            name : '手机号码',
	            index : 'mobile_phone',
	            width : 45,
	            align : "center"
	        },
	        {
	            name : '状态',
	            index : 'status_id',
	            align : "center",
	            width : 25
	        },
	        {
	            name:'部门',
	            index:'dept_name',
	            width:80,
	            align:'center'
	        },
	        {
	            name : '操作',
	            align : "center",
	            width : 70,
	            sortable : false,
	            formatter : chooseUser,
	            formatoptions : {}
	
	        }
	    ],
	    caption : "用户列表",
	    edit : true,
		rowNum: 10,
	    multiselect:false,
		pager: "#uSelectdt",
	    width:770
   };
   function chooseUser(cellvalue, options, rowObject) {
   		return "<input value='选择' type='button' class='grid_button' onclick='addUser2Property(\"" + cellvalue +"\")'/>";
   }
   function addUser2Property(id){
   		var typecode = document.userSearchForm.typecode.value;
   		var property_id = document.userSearchForm.property_id.value;
   		var requestStr = "id="+id+"&property_id="+property_id+"&typecode="+typecode;
   		CORE.request("DS_PROPERTYSECURTY_ADDUSER",{data:requestStr}, function(data) {
	    	GRID.reload('userList');
	    	$("#UserPanel").dialog("close");
	    });      
   }
   /**
    * 添加角色
    */
   function _addUserGroup(){
   		$("#UserGroupPanel").dialog(_select_UserGroup_Dlg);
   };
	var _select_UserGroup_Dlg = {
			title : "添加角色",
			width : "800px", 
			height : "400" ,
			buttons : {
				'关闭':function(){
					$("#UserGroupPanel").dialog("close");
				}
   			}
   		}   
   var _select_UserGroup = {
            colModel : [
                {
                    name : '编码',
                    index : 'code',
                    width : 120,
                    align : "center"
                },
                {
                    name : '名称',
                    index : 'name',
                    width : 120,
                    align : "center"
                },
                {
                    name:'备注',
                    index:'note',
                    width:150,
                    align:'center'
                },
                {
                    name : '操作',
                    index : 'button',
                    width : 50,
                    align : "center" ,
                    sortable : false,
		            formatter : chooseUserGroup
                }
            ],
            caption : "浏览区",
            edit : true,
			rowNum: 10,
            multiselect:false,
			pager: "#ugSelectdt",
            width:770  
   };
   function chooseUserGroup(cellvalue, options, rowObject) {
   		return "<input value='选择' type='button' class='grid_button' onclick='addUserGroup2Property(\"" + rowObject["code"] +"\")'/>";
   }
   function addUserGroup2Property(code){
   		var typecode = document.ugSearchForm.typecode.value;
   		var property_id = document.ugSearchForm.property_id.value;
   		var requestStr = "code="+code+"&property_id="+property_id+"&typecode="+typecode;
   		CORE.request("DS_PROPERTYSECURTY_ADDUG",{data:requestStr}, function(data) {
	    	GRID.reload('userGroupList');
	    	GRID.reload('userList');
	    	$("#UserGroupPanel").dialog("close");
	    });  
   }
    </script>
</head>
<body>
<jsp:include page="/pages/navbar.jsp"/>
<div style="margin:0 auto;">
    <div class="barquery">
        <div class="barqueryleft"></div>
        <div class="barquerycenter">对象属性授权维护</div>
        <div class="barqueryright"></div>
        <div class="barquerybtn">
        </div>
    </div>
    <!-- 中间列表 -->
    <table width="1000" align="center" class="property_grid_table"
           style="margin:0 auto; border-collapse:collapse;border:#6495ed solid 1px;height:350px;">
        <tr>
            <th class="property_grid_th">对象属性类型(请点击)</th>
            <th class="property_grid_th">对象属性(请选择)</th>
            <th class="property_grid_th">授权对象</th>
        </tr>
        <tr style="height:400px;">
            <td valign="top" class="property_grid_td" style="width:200px;text-align:left;padding:0px;">
                <div align="center" style="padding:0px;height:400px;overflow:auto;width:100%;">
                	<ul id="propertyGroupType"></ul>
                </div>
            </td>
            <td valign="top" class="property_grid_td" style="width:200px;text-align:left;">
                <div align="center" style="padding:0px;height:400px;overflow:auto;width:100%;">                
                	<ul id="Property"></ul>
                </div>
            </td>
            <td valign="top" class="property_grid_td" style="width:600px;text-align:left;">
                <div id="securityInfo" align="center" style="display:none;height:100%;overflow:auto;width:100%;">
				    <!-- 角色查询区域 -->
				    <form name="ugSearchForm" onsubmit="GRID.reload('userGroupList');return false;">
				    	<input type="hidden" name="typecode"/>
				    	<input type="hidden" name="property_id"/>
				    	<table id="ugSearchTable" class="content_List" width="600" style="margin-bottom:2px;">
							<tr>
								<td width="80" class="contenttd">角色选择:</td>
								<td align="left">
									<input type="text" name="UserGroupName"/>
		                            <input Class="btnquery_mouseout"
		                                   onmouseover="this.className='btnquery_mouseover'"
		                                   onmouseout="this.className='btnquery_mouseout'" type="submit"
		                                   value=""/>
								</td>
								<td width="40" class="contenttd" align="right">操作:</td>
								<td width="80" align="right">
								<a class="btn_add" href="javascript:void(0);" onclick="_addUserGroup();" title="添加新角色到该授权">添加</a>
								</td>
							</tr>
						</table>
				    </form>
                    <table id="userGroupList" style="margin: 0; padding: 0;"></table>
                    <div id="ugdt" style="margin: 0; padding: 0;"></div>
                    <div style="margin-bottom:10px;"></div>
				    <!-- 用户查询区域 -->
				    <form name="userSearchForm" onsubmit="GRID.reload('userList');return false;">
				    	<input type="hidden" name="typecode"/>
				    	<input type="hidden" name="property_id"/>
				    	<table id="userSearchTable" class="content_List" width="600" style="margin-bottom:2px;">
							<tr>
								<td width="80" class="contenttd">用户名:</td>
								<td align="left">
									<input type="text" name="username"/>
		                            <input Class="btnquery_mouseout"
		                                   onmouseover="this.className='btnquery_mouseover'"
		                                   onmouseout="this.className='btnquery_mouseout'" type="submit"
		                                   value=""/>
								</td>
								<td width="40" class="contenttd" align="right">操作:</td>
								<td width="80" align="right">
								<a class="btn_add" href="javascript:void(0);" onclick="_addUser();" title="添加新用户到该授权">添加</a>
								</td>
							</tr>
						</table>
				    </form>
                    <table id="userList" style="margin: 0; padding: 0;"></table>
                    <div id="udt" style="margin: 0; padding: 0;"></div>
                    <div style="margin-bottom:10px;"></div>
                </div>
            </td>
        </tr>
        <tr id="_Type_Select_Tip" class="property_grid_td" style="display:none;overflow-y:visible;height:20px;">
            <td colspan="3" align="center">
                您选中的是属性类型，请在中间的属性中选择相应的属性进行针对该属性进行授权。<br>
                
            </td>
        </tr>
        <tr id="_Property_Select_Tip" class="property_grid_td" style="display:none;overflow-y:visible;height:20px;">
            <td colspan="3" align="center">
                您选中的是属性，请在右侧进行对该属性授权。
            </td>
        </tr>
    </table>
    <!-- 添加用户 -->
    <div id="UserPanel" style="display:none;" align="center">
        <div class="barquerycontent" align="center">
            <form name="userManager"
                  onsubmit="GRID.reload('userSelectList');return false;">
                <table class="content_List">
                    <tr>
                        <td style="width: 60px;" align="right" class="contenttd">
                            用户工号:
                        </td>
                        <td align="left">
                            <input type="text" name="useraccount" value="">
                        </td>
                        <td style="width: 60px;" align="right" class="contenttd">
                            用户名称:
                        </td>
                        <td align="left">
                            <input type="text" name="username" value="">
                        </td>
                        <td style="width: 60px;" align="right" class="contenttd">
                            手机号码:
                        </td>
                        <td align="left">
                            <input type="text" name="mobilephone" value="">
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 60px;" align="right" class="contenttd">
                            状&nbsp;&nbsp;态:
                        </td>
                        <td align="left">
                            <select name="statusid" id="statusidSelect"
                                    style="width: 160px;">
                                <option value="">
                                    --请选择--
                                </option>
                                <option value="1">
                                    有效
                                </option>
                                <option value="2">
                                    已注销
                                </option>
                            </select>
                        </td>
                        <td colspan="4">
                            <input Class="btnquery_mouseout"
                                   onmouseover="this.className='btnquery_mouseover'"
                                   onmouseout="this.className='btnquery_mouseout'" type="submit"
                                   value="">
                        </td>
                </table>
            </form>
        </div>    
    	<table id="userSelectList" style="margin: 0; padding: 0;"></table>
        <div id="uSelectdt" style="margin: 0; padding: 0;"></div>
    </div>
    <!-- 添加角色 -->
    <div id="UserGroupPanel" style="display:none;" align="center">
            <form name="userRoleForm"
                  onsubmit="GRID.reload('userGroupSelectList');return false;">
                <div class="barquerycontent">
                    <table class="content_List">
                        <tr>
                            <td align="right" class="contenttd" style="width: 80px;">
                                角色编号：
                            </td>
                            <td align="left" style="width: 150px;">
                                <input type="text" name="code" id="code">
                            </td>
                            <td align="right" class="contenttd" style="width: 80px;">
                                角色名称：
                            </td>
                            <td align="left">
                                <input type="text" name="name" id="name">
                                &nbsp;&nbsp;
                                <input Class="btnquery_mouseout"
                                       onmouseover="this.className='btnquery_mouseover'"
                                       onmouseout="this.className='btnquery_mouseout'" type="submit"
                                       value="">
                            </td>
                        </tr>
                    </table>
                </div>
            </form>    
    	<table id="userGroupSelectList" style="margin: 0; padding: 0;"></table>
        <div id="ugSelectdt" style="margin: 0; padding: 0;"></div>    
    </div>
</div>
</body>
</html>