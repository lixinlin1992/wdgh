<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%--
File: pageEdit
User: 李嘉伟
Date: 11-6-10 下午10:26

模板编辑页面

--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<%@ page import="com.sunrise.rdcp.config.TemplateConfig" %>
<%@ page import="com.sunrise.rdcp.engine.RDCPEngine" %>
<%@ page import="com.sunrise.foundation.utils.StringUtil" %>
<%@ page import="com.sunrise.rdcp.config.SectorConfig" %>
<%@ page import="java.util.List" %>
<%@ page import="java.io.Writer" %>
<html>
<head>
    <title>编辑页面</title>
    <jsp:include page="/pages/framework/base.jsp"/>
    <link type="text/css" rel="stylesheet" href="themes/default/css/rdcp.css"></link>
    <script type="text/javascript" src="scripts/rdcp/rdcp.js"></script>
    <script type="text/javascript" src="scripts/rdcp/propertyGrid.js"></script>
    <script type="text/javascript" language="JavaScript">
/**
 * 加载属性编辑
 */
 		var json = {};
        var propertyGrid = null;
        var _currentElement;
        var loadflag = true;
        function _loadProperties(elementId) {
        	//判断加载完否
        	if(loadflag){
        		//设置为未加载
        		loadflag = false;
	        	//先保存已有配置
	            if(_currentElement != null){
		        	_saveProperties();
	         		//还原颜色
	         		$("#"+_currentElement).css("background-color","#FFF");
		        	//清空当前编辑节点
		        	_currentElement = null;
		        }
	        	//加载页面的指定SECTOR
	            _currentElement = elementId;
	            CORE.request("DS_PAGE_PROPERTY_LIST",
	                    {data:"page_id=${param.page_id}&element_id=" + elementId}, function(data) {
	                         if (propertyGrid == null)
		                          propertyGrid = new RDCP.PropertyGrid({
			                                    id:"propertyTable",
			                                    group:true,
			                                    properties:data
			                                });
	                         else
	                            propertyGrid.setProperties(data);
        					//设置为已加载
	         				 loadflag = true;
	         				//设置颜色
	         				$("#"+elementId).css("background-color","#5c9ccc");
	                    });
	        }else
	        	CORE.info("还没有对前节点配置进行保存，稍后再操作");
        }
/**
 * 返回配置管理
 */
 		function _goBack(){
        	//先保存已有配置
            if(_currentElement != null){
	        	_saveProperties();
	        	_currentElement = null;
	        }
 			window.location.href = "pages/rdcp/page/pageManage.jsp";
 		}
/**
 * 保存属性编辑
 */
        function _saveProperties() {
            if(_currentElement == null){
                CORE.info("请先选择区域再进行保存");
                return;
            }
            var properties = propertyGrid.getProperties();
            var param = "page_id=${param.page_id}&element_id="+_currentElement;
            $.each(properties, function(code,o) {
                param += "&names=" + code + "&types=" + o.type + "&values=" + o.value;
            });
			CORE.request("DS_PAGE_PROPERTY_EDIT", {data:param}, function(data) {
			});
        }
/**
 * 测试页面
 */
        function _testConfig() {
        	//先保存已有配置
            if(_currentElement != null){
	        	_saveProperties();
	        }
			CORE.goToDS("DS_RDCP_RUN_PAGE","page_id="+${param.page_id},null,"_blank");			
        }        
/**
 * 初始化
 */
$(function(){
    CORE.loadSelect('sectorSelect', 'DS_PAGE_SECTOR_SELECT', {});
    CORE.loadSelect('containerSelect', 'DS_PAGE_CONTAINER_SELECT', {});
	CORE.request("DS_PAGE_TEMPLATE_GET",{data:"page_id=${param.page_id}"}, function(data) {
		json = data;
		$("#container_id").attr("id",data.id);
		if(data.js!=""){
			var scripts = data.js.split(",");
			for(var i = 0;i<scripts.length;i++)
			{
			    var oHead = document.getElementsByTagName('HEAD').item(0);			
			    var oScript= document.createElement("script");			
			    oScript.type = "text/javascript";		
			    scripts[i] = scripts[i].substring(1,scripts[i].length-1);	
			    oScript.src=scripts[i];			
			    oHead.appendChild(oScript); 				
			} 
		}
		generateNext(data.sectors,data.orientation,0,data.id,false);
    });
});    
/**
 * 页面布局生成
 */    
//生成下一级子容器页面
function generateNext(children,orientation,perhorizontalChildWidth,fatherId,isChild){
    for (var childIndex = 0;childIndex<children.length;childIndex++) 
    {
    	var currChild = children[childIndex];
    	var Children = currChild.sectors;
    	var horizontal = true;
       	if("horizontal"==orientation){
           	//当没有横向SECTOR时,重置横向SECTOR的宽度
       		if(perhorizontalChildWidth==0){
            	//SECTOR是横向,统计到达下一个横向SECTOR的数量
                var horizontalChild = perhorizontalChildCount(children,childIndex,0);
            	//横向SECTOR的宽为父容器的宽度比/SECOTR的数量
            	perhorizontalChildWidth = 90/horizontalChild;
       		}
        }else{
        	horizontal = false;
        	perhorizontalChildWidth = 0;
        }
        if (Children.length > 0) {
            var ChildrenWidth = 0;
        	var ChildrenHeight = 0;
            //若SECTOR为横向,则其宽为子SECTOR的数量与横向SECTOR宽的积
            if(horizontal)
            	if(currChild.orientation=="horizontal")
					ChildrenWidth = perhorizontalChildCount(Children,0,0) * perhorizontalChildWidth;
				else
					ChildrenWidth = perhorizontalChildWidth;
            if(!isChild)
				ChildrenHeight = verticalChildCount(Children,0,0) * 170;
			var html = "<div id='"+currChild.code+"' style='background-color:#FFF;border:1px solid #0A246A;margin:2px;padding:3px 2px;position:relative;" +
       						((!isChild)?"height:"+ChildrenHeight+"px;":"") +
                            (horizontal ? "float:left;" : "") +
              				(horizontal && (ChildrenWidth != 0) ? "width:"+ChildrenWidth + "%;" : "") +
                             "' onclick='_loadProperties(\"" +
                             currChild.code + "\");event?event.cancelBubble=true:event.stopPropagation();'>" +
                             "<div style='padding:0px;margin:0px;position:absolute;top:0px;left:0px;'>" + currChild.name + "</div>" +
                          	"<div style='position:absolute;right:0px;top:0px;'>" +
                       		"<a href='javascript:void(0);' style='font-size:14px;' onclick='addSector(\""+currChild.code+"\");event?event.cancelBubble=true:event.stopPropagation();'>+</a>&nbsp;&nbsp;"+
                       		"<a href='javascript:void(0);' style='font-size:14px;' onclick='dropSector(\""+currChild.code+"\",\""+fatherId+"\");event?event.cancelBubble=true:event.stopPropagation();'>-</a>&nbsp;&nbsp;"+
                       		"<a href='javascript:void(0);' style='font-size:14px;' onclick='editSector(\""+currChild.code+"\",\""+currChild.id+"\",\""+currChild.name+"\",\""+currChild.orientation+"\");event?event.cancelBubble=true:event.stopPropagation();'>e</a>"+
                       	"</div><br/>";							
			$("#"+fatherId).append(html);				
	        generateNext(Children,currChild.orientation,0,currChild.code,true);
			$("#"+fatherId).append("</div>");
       } else {
	   		var html = "<div id='"+currChild.code+"' style='background-color:#FFF;border:1px solid #0A246A;margin:2px; padding:2px;position:relative;" +
        					"height:100px;" +
               				(horizontal ? "width:"+perhorizontalChildWidth + "%;" : "") +
                       		(horizontal ? "float:left;" : "") +
                            "' onclick='_loadProperties(\"" +
                            currChild.code + "\");event?event.cancelBubble=true:event.stopPropagation();'>" + currChild.name + 
                            	"<div style='position:absolute;right:0px;top:0px;'>" +
                            		"<a href='javascript:void(0);' style='font-size:14px;' onclick='addSector(\""+currChild.code+"\");event?event.cancelBubble=true:event.stopPropagation();'>+</a>&nbsp;&nbsp;"+
                            		"<a href='javascript:void(0);' style='font-size:14px;' onclick='dropSector(\""+currChild.code+"\",\""+fatherId+"\");event?event.cancelBubble=true:event.stopPropagation();'>-</a>&nbsp;&nbsp;"+
                            		"<a href='javascript:void(0);' style='font-size:14px;' onclick='editSector(\""+currChild.code+"\",\""+currChild.id+"\",\""+currChild.name+"\",\""+currChild.orientation+"\");event?event.cancelBubble=true:event.stopPropagation();'>e</a>"+
                            	"</div>"+
                            "</div>";
							
			$("#"+fatherId).append(html);
       }
    }
}
//遍历SECTOR,得出直到下一个竖向SECTOR的数量
function perhorizontalChildCount(children,childIndex,result){
    for(var countIndex = childIndex;countIndex<children.length;countIndex++){
    	//遍历SECTORS队列
    	var currChild = children[countIndex];
    	//若为水平分布
    	if("horizontal"==currChild.orientation && currChild.sectors.length>0)
   			//若含有子SECTOR则计算其包含的子SECTOR
   			result = perhorizontalChildCount(currChild.sectors,0,result);
   		else
	    	result ++;
    }
    return result;
}
//遍历SECTOR,得出树的深度
function verticalChildCount(children,childIndex,result){
    for(var countIndex = childIndex;countIndex<children.length;countIndex++){
    	//遍历SECTORS队列
    	var currChild = children[countIndex];
    	//若为竖直分布
    	if("vertical"==currChild.orientation && currChild.sectors.length>0)
   			//若含有子SECTOR则计算其包含的子SECTOR
   			result = perhorizontalChildCount(currChild.sectors,0,result);
   		else if(countIndex == children.length-1)
	    	result ++;
    }
    return result;
}
/**
 * 模板JSON维护
 */  
//添加新SECTOR
function addSector(fatherId){
	_SectorChoose.fatherId = fatherId;
	$("#sectorSelect").removeAttr("disabled"); 
	document.sectorSelectForm.reset();
	$("#sectorSelectPanel").dialog(_SectorChoose);
}
var _SectorChoose ={
	    title : "添加区域",
	    width : "320",
	    height : "320" ,
	    modal : true,
	    bgiframe : true,
	    resizable:false,
	    fatherId:"",
	    buttons:{
	        "取消":function() {
	            $("#sectorSelectPanel").dialog("close");
	        },
	        "确定":function() {
	        	//获取参数
	        	var sectorId = $("#sectorSelect").val();
	        	var sectorName = document.sectorSelectForm.name.value;
        		var orientation = "horizontal";
		        if (document.getElementById("__h").checked == true) {
					orientation = "horizontal";
    		    } else {
					orientation = "vertical";        		
        		}
        		//填充参数
        		var newSector = {
        			"js":"",
					"id":sectorId,
					"code":Date.parse(new Date())+"",
					"name":sectorName,
					"orientation":orientation,
					"version":"1.0",
					"author":"李嘉伟",
					"date":"2011-10-20",
					"sectors":[]
        		};
        		if(_SectorChoose.fatherId == json.id)
        			json.sectors.push(newSector);
        		else
        			jsonOperation("add",json,_SectorChoose.fatherId,newSector);
        		//发送请求更新参数
				updateSector();
	    		$("#sectorSelectPanel").dialog("close");
	        }
	    }
	};
//更改SECTOR
function editSector(sectorCode,sectorId,name,orientation){
	_SectorEdit.sectorCode = sectorCode;
	$("#sectorSelect").attr("disabled","true");
	$("#sectorSelect").val(sectorId);
	document.sectorSelectForm.name.value = name;
    if (orientation == "horizontal") {
		$("#__h").attr("checked","true");
    } else {
		$("#__v").attr("checked","true");    		
	}
	$("#sectorSelectPanel").dialog(_SectorEdit);
}
var _SectorEdit ={
	    title : "编辑区域",
	    width : "320",
	    height : "320" ,
	    modal : true,
	    bgiframe : true,
	    resizable:false,
	    sectorCode:"",
	    buttons:{
	        "取消":function() {
	            $("#sectorSelectPanel").dialog("close");
	        },
	        "确定":function() {
	        	//获取参数
	        	var code = _SectorEdit.sectorCode;
	        	var sectorName = document.sectorSelectForm.name.value;
        		var orientation = "horizontal";
		        if (document.getElementById("__h").checked == true) {
					orientation = "horizontal";
    		    } else {
					orientation = "vertical";        		
        		}
        		var newParams = {
        			"orientation":orientation,
        			"sectorName":sectorName
        		}
       			jsonOperation("edit",json,code,newParams);
        		//发送请求更新参数
				updateSector();
	    		$("#sectorSelectPanel").dialog("close");
	        }
	    }
	};	
//删除SECTOR
function dropSector(sectorId,fatherId){
	if(fatherId==json.id){
	    for (var i = 0; i < json.sectors.length; i++) {
	        if (sectorId == json.sectors[i]["code"]) {
	            json.sectors.splice(i, 1);
	            break;
	        }
	    }			
	}else
		jsonOperation("del",json,fatherId,sectorId);
	updateSector();
}
//修改Container
function editContainer(){
	$("#containerSelect").val(json.id);
    if (json.orientation == "horizontal") {
		$("#c__h").attr("checked","true");   
    } else {
		$("#c__v").attr("checked","true");    		
	}	
	$("#containerSelectPanel").dialog(_ContainerEdit);
}
var _ContainerEdit ={
	    title : "编辑区域",
	    width : "320",
	    height : "320" ,
	    modal : true,
	    bgiframe : true,
	    resizable:false,
	    sectorCode:"",
	    buttons:{
	        "取消":function() {
	            $("#containerSelectPanel").dialog("close");
	        },
	        "确定":function() {
	        	//获取参数
        		var orientation = "horizontal";
		        if ($("#c__h").attr("checked")){
					orientation = "horizontal";
    		    } else {
					orientation = "vertical";        		
        		}
        		json.id = $("#containerSelect").val();
        		json.code = $("#containerSelect").val();
        		json.orientation = orientation;
        		//发送请求更新参数
				updateSector();
	    		$("#containerSelectPanel").dialog("close");
	        }
	    }
	};	
//查找JSON中的父节点并进行操作
function jsonOperation(type,father,fatherId,aim){
	for(var i=0;i<father.sectors.length;i++)
	{
		if(father.sectors[i].code==fatherId){
			if(type=="add")
				father.sectors[i].sectors.push(aim);
			else if(type=="del"){
			    for (var j = 0; j < father.sectors[i].sectors.length; j++) {
			        if (aim == father.sectors[i].sectors[j]["code"]) {
			            father.sectors[i].sectors.splice(j, 1);
			            break;
			        }else if(father.sectors[i].sectors[j].sectors.length!=0){
			        	jsonOperation("del",father.sectors[i].sectors[j],fatherId,sectorId);
			        }
			    }			
			}else if(type=="edit"){
				father.sectors[i].name = aim.sectorName;
				father.sectors[i].orientation = aim.orientation;				
			}				
			break;
		}else if(father.sectors[i].sectors.length!=0){
			if(type=="add")
				jsonOperation("add",father.sectors[i],fatherId,aim);
			else if(type=="del")
				jsonOperation("del",father.sectors[i],fatherId,aim);	
			else if(type=="edit")
				jsonOperation("edit",father.sectors[i],fatherId,aim);		
			
		}
	}
}
//更新SECTOR
function updateSector(){
	//装载模板结构
	var params = "";
	params += "templateStructs="+CORE.json2str(json);
	params += "&page_id="+${param.page_id};
	CORE.request("DS_PAGE_TEMPLATE_SET", {data:params}, function(data) {
/*		//重绘页面
		$("#"+data.id).empty();
		$("#"+data.id).append(
		"<div style='float:right;'>"+
       	"<a href='javascript:void(0);' style='font-size:16px;' onclick='addSector(json.id);event?event.cancelBubble=true:event.stopPropagation();'>+</a>&nbsp;&nbsp;"+
        "</div><br/>"
        );
		generateNext(data.sectors,data.orientation,0,data.id,false);
		//清空当前编辑节点
		_currentElement = null;
		//保存JSON
		json = data;		 */
		
		window.location.reload();
	});	
}
    </script>
</head>
<body>
    <jsp:include page="/pages/navbar.jsp"/>
    <div class="modules">
        <div class="barquery">
            <div class="barqueryleft"></div>
            <div class="barquerycenter">业务系统： ${param.sysName}  模块名称：${param.moduleName}  页面名称：${param.pageName}</div>
            <div class="barqueryright"></div>
            <div class="barquerybtn">
                <input name="btn_addition" class="btn_additionout" value="返回" type="button" onclick='_goBack();'/>
				<input name="btn_addition" class="btn_additionout" value="保存" type="button" onclick='_saveProperties();'/>
				<input name="btn_addition" class="btn_additionout" value="测试" type="button" onclick='_testConfig();'/>
            </div>
        </div>
    </div>
	<div style="magin:10px;padding:10px;">
		<table width="100%">
			<tr>
				<td valign="top" width="80%">
					<!-- 编辑模块 -->
					<div id="container_id" valign="top" onclick="_loadProperties(this.id)"
					     style="border: 1px solid #0A246A;float:left;width:100%;height:100%;">
                         <div style="float:right;">
                         	<a href="javascript:void(0);" style="font-size:14px;" onclick="addSector(json.id);event?event.cancelBubble=true:event.stopPropagation();">+</a>&nbsp;&nbsp;
                         	<a href='javascript:void(0);' style='font-size:14px;' onclick='editContainer();event?event.cancelBubble=true:event.stopPropagation();'>e</a>
                         </div>
                         <br />
					</div>				
				</td>
				<td valign="top">
					<!-- 属性编辑器模块 -->
					<table id="propertyTable" border="1" style="width:300px;height:100%;"></table>
				</td>
			</tr>
		</table>
	</div>
	<div id="sectorSelectPanel" style="display:none;">
		<form name="sectorSelectForm">
		<table>
			<tr class="formRow">
				<td class="formLabel">区域选择:</td>
				<td class="formField">
					<select id="sectorSelect" name="sectorSelect">
					</select>
				</td>
			</tr>
			<tr class="formRow">
				<td class="formLabel">子区域布局:</td>
				<td class="formField">
                    <label><input type="radio" name="type" value="0" id="__v"/>竖向</label>
                    <label><input type="radio" name="type" value="1" id="__h" checked="checked"/>横向</label>
				</td>
			</tr>
			<tr class="formRow">
				<td class="formLabel">区域名称:</td>
				<td class="formField">
                    <input type="text" name="name"/>
				</td>
			</tr>	
		</table>
		</form>
	</div>
	<div id="containerSelectPanel" style="display:none;">
		<form name="containerSelectForm">
		<table>
			<tr class="formRow">
				<td class="formLabel">容器选择:</td>
				<td class="formField">
					<select id="containerSelect" name="containerSelect">
					</select>
				</td>
			</tr>
			<tr class="formRow">
				<td class="formLabel">子区域布局:</td>
				<td class="formField">
                    <label><input type="radio" name="type" value="0" id="c__v"/>竖向</label>
                    <label><input type="radio" name="type" value="1" id="c__h" checked="checked"/>横向</label>
				</td>
			</tr>
		</table>
		</form>
	</div>
</body>
</html>