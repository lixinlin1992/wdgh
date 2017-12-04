<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%--
  User: 李嘉伟
  Date: 11-9-6
  Time: 15:28
     开发人员管理
--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<html>
<head>
    <jsp:include page="/pages/framework/base.jsp"/>
    <title>开发人员管理</title>
    <script type="text/javascript" src="scripts/service/user.help.js"></script>
	<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
	<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>    
    <script type="text/javascript" src="scripts/common/ztree.help.js"></script>
    <script type="text/javascript" src="scripts/service/module.help.js"></script>
    <style type="text/css">
    	#systemList li{
    		height:18px;
    		line-height:18px;
    		margin-bottom:3px;
    		text-indent:16px;
    		border-bottom:1px dashed #000;}
    </style>    
	<script type="text/javascript">
//展示列表
var devMangerGridParam = {
    colModel:[
        {
            name:"ID",
            index:"ID",
            width:100,
            hidden:true
        },
        {
            name:"SYS_CODE",
            index:"SYS_CODE",
            width:100,
            hidden:true
        },
        {
            name:"USER_ID",
            index:"USER_ID",
            width:100,
            hidden:true
        },
        {
            name:"开发人员",
            index:"DEV_NAME",
            width:100
        },
        {
            name:"业务系统",
            index:"SYS_NAME",
            width:100
        },
        {
            name:"查看权限",
            index:"VIEW_FLAG",
            width:100,
            formatter:function(cell, options, row, tr, td) {
				if(cell=="0")
					return "<input type='checkbox' onclick='_signDev(this.checked,\"view\",\"" + row["ID"] +"\")'></input>";
				else
					return "<input type='checkbox' onclick='_signDev(this.checked,\"view\",\"" + row["ID"] +"\")' checked></input>";
            }
        },
        {
            name:"修改权限",
            index:"EDIT_FLAG",
            width:100,
            formatter:function(cell, options, row, tr, td) {
				if(cell=="0")
					return "<input type='checkbox' onclick='_signDev(this.checked,\"edit\",\"" + row["ID"] +"\")'></input>";
				else
					return "<input type='checkbox' onclick='_signDev(this.checked,\"edit\",\"" + row["ID"] +"\")' checked></input>";
            }
        },
        {
            name:"删除权限",
            index:"DELETE_FLAG",
            width:100,
            formatter:function(cell, options, row, tr, td) {
				if(cell=="0")
					return "<input type='checkbox' onclick='_signDev(this.checked,\"del\",\"" + row["ID"] +"\")'></input>";
				else
					return "<input type='checkbox' onclick='_signDev(this.checked,\"del\",\"" + row["ID"] +"\")' checked></input>";
            }
        },
        {
            name:"操作",
            width:30,
            sortable:false,
            formatter:function(cell, options, row, tr, td) {
                return GRID.button({className:"btn_delete",onclick:"_delDev('"+row["SYS_CODE"]+"','"+row["USER_ID"]+"');",title:"从系统开发人员中删除该用户"});
                //return "<input value='移除' type='button' class='grid_button' onclick='_delDev(\"" + row["SYS_CODE"] + "\",\"" + row["USER_ID"] +"\")'>&nbsp";
            }
        }
    ],
    caption : "开发人员管理",
    multiselect:true,
    width:"80%",
    pager: "#pagerdt"
};

/**
 * 添加开发人员
 */

function _addDev(){
	document.panelForm.reset();
	$("#devChoose").empty();
	$("#sys_text").val($("#sysName").val());
	$("#sys_code").val($("#sysCode").val());
	$("#panelDialog").dialog(_addDevOpts);
}

var _addDevOpts = {
	title:"添加开发人员",
	width:"320px",
	height:"330" ,
	modal:true,
	ID:0,
	bgiframe:true,
	resizable:false,
	buttons : {
	  '取消':function(){$("#panelDialog").dialog("close");},
	  '确定':function(){
	  		var count = 0;
			$("#devChoose input[type='hidden']").each(
				function(){
					count++;
				}
			);
	  		if($("#sys_text").val()=="")
	  			CORE.info("请选择业务系统编码");
	  		else if(count==0)
	  			CORE.info("请分配开发人员");
	  		else{
		  		//权限参数整理
		  		var data = "";
		  		if($("#lookupSecurity").attr("checked"))
		  			data += "view_flag=1";
		  		else
		  			data += "view_flag=0";
		  		if($("#editSecurity").attr("checked"))
		  			data += "&edit_flag=1";
		  		else
		  			data += "&edit_flag=0";
		  		if($("#delSecurity").attr("checked"))
		  			data += "&delete_flag=1";
		  		else
		  			data += "&delete_flag=0";
				//提交请求
		        CORE.submitForm("DS_DEV_ADD","panelForm",{data:data},
					function(){
					   $("#panelDialog").dialog("close");
		               GRID.reload('devManagerList');
				});
			}
       }
	}
};


/**
 * 选择业务系统
 */

var _ModuleSelectTree = null;
function _selectSys(){
    _ModuleSelectTree = selectModule(function(node) {
        if (node != null && node.type == '0') {
        	$("#sys_text").val(node.name);
        	$("#sys_code").val(node.sys_code);
        } else if (node != null) {
        	$("#sys_text").val(node.parentNode.name);
        	$("#sys_code").val(node.sys_code);
        }
    },"",true,true);
}

/*
 * 添加开发人员的选择按钮事件
 */
var devNo = 0;//开发人员节点ID
function _selectUser(){
	selectUser(
		{
			multiselect:true,
			selected:function(users){
				if(users.length!=0){
					for(var i = 0;i<users.length;i++)
					{
						//防止重复添加已存在的开发人员
						var isExists = false;
						$("#devChoose input[type='hidden']").each(
							function(){
								if(users[i].id == $(this).attr("value"))
									isExists = true;
							}
						);
						if(isExists)
							continue;
						//组装开发人员节点
						devNo++;
						var trHead = "<tr id='devNo"+devNo+"'>";
						var trEnd = "</tr>";
						var tdLabel = "<td>"+users[i].name+"<input name='developer' type='hidden' value='"+users[i].id+"'/></td>";
						var tdFunction = "<td><a href='javascript:void(0);' onclick='dropAddedDev(\""+devNo+"\")'>删除</a></td>";
						$("#devChoose").append(trHead+tdLabel+tdFunction+trEnd);
					}
				}
			}
		}
	)
}
/*
 * 删除开发人员节点
 * @param 删除节点的ID
 *
 */
function dropAddedDev(trId){
	$("#devNo"+trId).remove();
}

/**
 * 移除开发人员
 * @param sysId 业务系统
 * @param moduelId 模块
 * @param devId 开发人员
 */
function _delDev(sysId,devId){
    CORE.confirm("确定要移除该开发人员吗?", function() {
        //进行删除
	    CORE.request("DS_DEV_DEL",{'data':"sys_code="+sysId+"&user_id="+devId},function(body,header){
	        if(header.code == 0){
	            CORE.tip("删除成功");
	            GRID.reload("devManagerList");   //刷新参数列表
	        }else{
	            CORE.error("删除失败",body);
	        }
	    });
    });
}

function _delDevs(){
    var datas = GRID.getSelectRow("devManagerList");
    //检测有没有勾选开发人员
    if(datas.length==0){
        CORE.info("请选择要移除的开发人员");
        return;
    }
    CORE.confirm("确定要移除选中的开发人员吗?", function() {
    	//组装参数
		var params = ""
		for(var i = 0;i<datas.length;i++)
		{
			var sys_code = datas[i]["SYS_CODE"];
			var user_id = datas[i]["USER_ID"];
			params += "sys_code="+sys_code+"&";
			params += "user_id="+user_id+"&";
		}
        //进行删除
	    CORE.request("DS_DEVS_DEL",{'data':params},function(body,header){
	        if(header.code == 0){
	            CORE.tip("开发人员已移除");
	            GRID.reload("devManagerList");   //刷新参数列表
	        }else{
	            CORE.error("移除开发人员失败",body);
	        }
	    });
    });
}



/**
 * 授权开发人员
 */
function _signDev(bool,type,rowId){
	//获取目标数据
	var data = $("#devManagerList").getRowData(rowId);
	//组装请求数据
	var params = ""
	var sys_code = data["SYS_CODE"];
	var user_id = data["USER_ID"];
	params += "sys_code="+sys_code+"&";
	params += "user_id="+user_id+"&";
	params += "type="+type+"&";
	if(bool)
		params += "flag=1";
	else
		params += "flag=0";
    //提交
    CORE.request("DS_DEV_FUN_SIGN",{data:params},function(body,header){
    	if(header.code == 0){
	        CORE.tip("授权成功");
	    }else{
	        CORE.error("授权失败",body);
	    }
	});
}

//页面加载后执行代码块
$(function(){
	//初始化列表
    GRID.create("#devManagerList","DS_DEV_MANAGER_LIST",devMangerGridParam,"developerSearchForm");
	//初始化系统列表
	CORE.request("DS_DEV_UL_SYS",{data:""},function(data){
		if(data.sys.length==0)
			$("#systemListPanel").append("没有你所负责的业务系统.");
		else
			for(var i = 0;i<data.sys.length;i++)
			{
				$("#systemList").append("<li id='"+data.sys[i].code+"'><a href='javascript:void(0);' onclick="+
										"'setSearchSysCodeParam(\""+ data.sys[i].code + "\",\"" + data.sys[i].name +"\")'>"+ data.sys[i].name +
										"</a></li>");
			}
	});
});

function setSearchSysCodeParam(syscode,sysName){
	$("#systemList li").css("font-style","");
	$("#"+syscode).css("font-style","italic");
	$("#sysCode").val(syscode);
	$("#sysName").val(sysName);
	GRID.reload('devManagerList');
}

	</script>
</head>
<body>
    <jsp:include page="/pages/navbar.jsp"/>
    <div class="modules">
        <div class="barquery">
            <div class="barqueryleft"></div>
            <div class="barquerycenter">开发人员管理</div>
            <div class="barqueryright"></div>
            <div class="barquerybtn">
                <a class="btn_add" href="javascript:void(0);" onclick="_addDev();" title="添加新的业务系统开发人员">添加</a>
                <a class="btn_delete" href="javascript:void(0);" onclick="_delDevs();" title="从业务系统中移除选中的开发人员">删除</a>
                <!--
                <input name="btn_addition" class="btn_additionout" value="添加" type="button" onclick='_addDev();'/>
                <input name="btn_addition" class="btn_deleteout" value="删除" type="button" onclick='_delDevs();'/>
                -->
            </div>
        </div>
        <table width="100%">
            <tr>
                <!--右边页面管理树-->
                <td valign="top" style="height:100%;width:15%;">
                    <div id="systemListPanel" style="padding:0;">
                    	<ul id="systemList">
                    	</ul>
                    </div>
                </td>

                <!--左边页面列表-->
                <td valign="top" style="width:85%;">
			             <!--查询表单区域-->
			             <form name="developerSearchForm">
			                   <div class="barquerycontent" align="center">
			                        <table class="content_List">
			                        <tr>
			                           <td align="right" class="contenttd" style="width:80px">系统编码：</td>
			                           <td align="left" style="width:80px">
			                           	   <input type="text" id="sysCode" name="sysCode" class="textbox_css"/>
			                           </td>
			                           <td align="right" class="contenttd" style="width:80px">系统名称：</td>
			                           <td align="left" style="width:80px">
			                           	   <input type="text" id="sysName" name="sysName" class="textbox_css"/>
			                           </td>
			                           <td align="right" class="contenttd"style="width:80px">开发人员：</td>
			                           <td align="left" style="width:200px">
			                               <input type="text" id="devName" name="devName" class="textbox_css"/>
			                               <input class="btnquery_mouseout" onMouseOver="this.className='btnquery_mouseover'"
			                                      onMouseOut="this.className='btnquery_mouseout'" type="button" value=""
			                                      onclick="GRID.reload('devManagerList')"/>
			                           </td>
			                           <td align="left" class="contenttd">
			                           </td>
			                       </tr>
			                       </table>
			                   </div>
			             </form>
			             <!--列表区域-->
			             <table id="devManagerList" style="margin: 0; padding: 0;"></table>
			             <div id="pagerdt" style="margin: 0; padding: 0;"></div>
				</td>
			</tr>
		</table>
		<div id="panelDialog" style="display:none;">
			<form name="panelForm">
				<table>
					<tr class="formRow">
						<td class="formLabel">业务系统:</td>
						<td class="formField">
							<input type="text" id="sys_text" readOnly/>
							<input type="button" onclick="_selectSys()" value="选择"/>
							<input type="text" id="sys_code" name="sys_code" style="display:none;"/>
						</td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">开发人员:</td>
						<td class="formField">
							<input type="button" value="选择" onclick="_selectUser()"/>
						</td>
					</tr>
					<tr class="formRow">
						<td class="formLabel"></td>
						<td class="formField" valign="top">
							<table id="devChoose"></table>
						</td>
					</tr>
					<tr class="formRow">
						<td class="formLabel">功能授权:</td>
						<td class="formField">
	   						<input type="checkbox" id="lookupSecurity" checked/>查看权限
	   						<input type="checkbox" id="editSecurity" />修改权限
	   						<input type="checkbox" id="delSecurity" />删除权限
						</td>
					</tr>
				</table>
			</form>
		</div>
  </div>
</body>
</html>