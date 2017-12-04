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
<html onkeydown="keyListener()">
<head>
    <title>编辑页面</title>
    <jsp:include page="/pages/framework/base.jsp"/>
    <link type="text/css" rel="stylesheet" href="themes/default/css/rdcp.css"></link>
    <link type="text/css" rel="stylesheet" href="themes/default/css/poshytip/tip-yellowsimple/tip-yellowsimple.css"></link>
    <script type="text/javascript" src="scripts/common/jquery.poshytip.min.js"></script>
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
	                    	 data = _sectorPropertyFormat(data);
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
 * 加载Sector配置后提取 %,+,& 符号
 */        
 		function _sectorPropertyFormat(propertyObject){
 			for(var key in propertyObject)
 			{
 				if(typeof(propertyObject[key]) == "string"){
 					propertyObject[key] = propertyObject[key].replace(/\%25/g,"%");
 					propertyObject[key] = propertyObject[key].replace(/\%2B/g,"+");
 				}else if(typeof(propertyObject[key])=="object")
 					propertyObject[key] = _sectorPropertyFormat(propertyObject[key]);
 			}
 			return propertyObject;
 		}
/**
 * 返回配置管理
 */
 		function _goBack(){
        	//先保存已有配置
//          if(_currentElement != null){
//	        	_saveProperties();
//	        	_currentElement = null;
//	        }
            var tabid = new Date().getTime();
			parent.f_addTab(tabid, "页面管理", "pages/rdcp/page/pageManage.jsp");
			parent.tab.removeTabItem("${param.page_id}");			
 			//window.location.href = "pages/rdcp/page/pageManage.jsp";
 		}
/**
 * 保存属性编辑
 */
        function _saveProperties(saveParams) {
        	if(saveParams == undefined)
        		saveParams = {}
            if(_currentElement == null){
                //CORE.info("请先选择区域再进行保存");
                return;
            }
            if(!propertyGrid.isChanged())
            	if(saveParams["callback"] == undefined)
	                return;
            var properties = propertyGrid.getProperties();

            var param = "page_id=${param.page_id}&element_id="+_currentElement;
            $.each(properties, function(code,o) {
 				o.value = o.value.replace(/\%26/g,"&");
 				o.value = o.value.replace(/\%25/g,"%");
 				o.value = o.value.replace(/\%2B/g,"+");
            	o.value = o.value.replace(/\%/g,"%25");
            	o.value = o.value.replace(/\+/g, "%2B");
 				o.value = o.value.replace(/\&/g,"%26");
                param += "&names=" + code + "&types=" + o.type + "&values=" + o.value;
            });
			CORE.request("DS_PAGE_PROPERTY_EDIT", {data:param}, function(data) {
				if(saveParams["callback"] != undefined && (typeof saveParams["callback"] === "function"))
					saveParams["callback"]();
			});
        }
/**
 * 测试页面
 */
        function _testConfig() {
        	//先保存已有配置
//            if(_currentElement != null){
//	        	_saveProperties({
//	        		callback : function(){
//	        			CORE.goToDS("DS_RDCP_RUN_PAGE","page_id="+${param.page_id},null,"_blank");	
//	        		}
//	        	});
//	        }else{
				CORE.goToDS("DS_RDCP_RUN_PAGE","page_id="+${param.page_id},null,"_blank");
//			}			
        }        
/**
 * 初始化
 */
$(function(){
    CORE.loadSelect('sectorSelect', 'DS_PAGE_SECTOR_SELECT', {});
    CORE.loadSelect('containerSelect', 'DS_PAGE_CONTAINER_SELECT', {});
	CORE.request("DS_PAGE_TEMPLATE_GET",{data:"page_id=${param.page_id}"}, function(data) {
		json = data;
		var scripts = new Array();
		var css = new Array();
		fillScripts(scripts,json);
		fillCss(css,json);
		for(var i = 0;i<scripts.length;i++)
		{	
			for(var c = 0;c<scripts.length;c++){
				if(scripts[c]==scripts[i]&&c!=i){
					scripts[c] = "";
				}
			}
		}			
		for(var i = 0;i<css.length;i++)
		{	
			for(var c = 0;c<css.length;c++){
				if(css[c]==css[i]&&c!=i){
					css[c] = "";
				}
			}
		}			
		var oHead = $(document.head);//document.getElementsByTagName('HEAD').item(0);
		for(var j = 0;j<scripts.length;j++)
		{	
			if(scripts[j]!=""){
                /*
				var oScript= document.createElement("script");			
				oScript.type = "text/javascript";		
				oScript.src=scripts[j];
				oScript.mark="rdcp";			
				oHead.appendChild(oScript);
				 */
                oHead.append("<script type='text/javascript' src='"+scripts[j]+"?_t="+new Date().getTime()+"'/>");
			}
		}
		for(var j = 0;j<css.length;j++)
		{	
			if(css[j]!=""){
				oHead.append("<link type='text/css' rel='stylesheet' href='"+css[j]+"'/>");
			}
		}		
        var _html = "";
        _html = generateSectorDiv(data,'',data.orientation);
        $("#template_container").append(_html);
    });
});
//遍历加载JS
function fillScripts(scripts,json){
	if(json.js!=""){		
		var script = json.js.split(",");
		for(var i = 0;i<script.length;i++){
			scripts.push(script[i]);
		}		
	}
	for(var i = 0;i<json.sectors.length;i++)
	{
		fillScripts(scripts,json.sectors[i]);
	}	
}
//遍历加载css
function fillCss(css,json){
	if(json.css!=""){		
		var csses = json.css.split(",");
		for(var i = 0;i<csses.length;i++){
			css.push(csses[i]);
		}		
	}
	for(var i = 0;i<json.sectors.length;i++)
	{
		fillCss(css,json.sectors[i]);
	}	
}

/**
* 返回Sector的HTML
* @param sector
* @param parentId
* @param parentOrientation
* @param width
 */
function generateSectorDiv(sector,parentId,parentOrientation){
    //alert('horizontal'==parentOrientation);
    var _html = "<table id='"+sector.code+"' width='100%' height='100%' border='0' style='border: 2px solid #a6c5fe; background-color: #FFFFFF;' cellpadding='0' cellspacing='0' onclick='_loadProperties(\"" +
                    sector.code + "\");event?event.cancelBubble=true:event.stopPropagation();'><tr>"+
            "<th style='background-color: #a6c5fe; text-align: left;' "+((sector.sectors.length>0 && 'horizontal' == parentOrientation)?"colspan='"+sector.sectors.length+"'":"")+">"+
            "<span>" + sector.name + "</span>"+
            "<span style='float:right;'>";
    if(sector.hasChild=="true")
            _html += (("${param.canEdit}"=="1")?"<a class='btn_add' onclick='addSector(\""+sector.code+"\");event?event.cancelBubble=true:event.stopPropagation();' titlte='添加子区域'></a>":"");
    if(parentId == ''){
        	_html += (("${param.canEdit}"=="1")?"<a class='btn_edit' onclick='editContainer();event?event.cancelBubble=true:event.stopPropagation();' title='修改'></a>":"");
        	_html += (("${param.canEdit}"=="1")?"<a class='btn_restore' title='刷新' onclick='refleshSector();event?event.cancelBubble=true:event.stopPropagation();'></a>":"");
    }else{
    		_html += (("${param.canEdit}"=="1")?"<a class='grid_btn btn_copy' title='转移到其他父容器' onclick='chooseOtherSector(\""+sector.code+"\");event?event.cancelBubble=true:event.stopPropagation();'></a>":"");
            _html += (("${param.canEdit}"=="1")?"<a class='btn_delete' title='删除区域' onclick='dropSectorConfirm(\""+sector.code+"\",\""+parentId+"\");event?event.cancelBubble=true:event.stopPropagation();'></a>":"");
    		_html += (("${param.canEdit}"=="1")?"<a class='"+('horizontal'==sector.parentOrientation?"btn_arrow_left":"btn_arrow_up")+"' title='向上/左移动' onclick='move2Head(\""+sector.code+"\",\""+parentId+"\");event?event.cancelBubble=true:event.stopPropagation();'></a>":"");
    		_html += (("${param.canEdit}"=="1")?"<a class='"+('horizontal'==sector.parentOrientation?"btn_arrow_right":"btn_arrow_down")+"' title='向下/右移动' onclick='move2Tail(\""+sector.code+"\",\""+parentId+"\");event?event.cancelBubble=true:event.stopPropagation();'></a>":"");
    		_html += (("${param.canEdit}"=="1")?"<a class='btn_edit' title='修改' onclick='editSector(\""+sector.code+"\",\""+sector.id+"\",\""+sector.name+"\",\""+sector.orientation+"\");event?event.cancelBubble=true:event.stopPropagation();'></a>":"");
    }
    _html += "<a class='btn_help' href='javascript:void();' title='显示API帮助' onclick='showApiTip(this,\""+sector.id+"\",\""+(""==parentId?"container":"sector")+"\");event?event.cancelBubble=true:event.stopPropagation();'></a></span></th></tr>";
    if(sector.sectors.length>0){
        $.each(sector.sectors,function(i,n){
            if('vertical' == parentOrientation || ('horizontal'==parentOrientation && i==0))
                _html += "<tr>";
            _html += "<td valign='top' style='padding:5px;'>"+generateSectorDiv(n,sector.code,n.orientation)+"</td>";
            if('vertical' == parentOrientation ||  ('horizontal'==parentOrientation && i==sector.sectors.length-1))
                _html += "</tr>";
        });
        //alert(_html);
    }else{
        _html += "<tr><td height='35'></td></tr>";
    }
    _html += "</table>";
    
    return _html;
}

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
                       		"<a href='javascript:void(0);' style='font-size:14px;' onclick='dropSectorConfirm(\""+currChild.code+"\",\""+fatherId+"\");event?event.cancelBubble=true:event.stopPropagation();'>-</a>&nbsp;&nbsp;"+
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
                            		"<a href='javascript:void(0);' style='font-size:14px;' onclick='dropSectorConfirm(\""+currChild.code+"\",\""+fatherId+"\");event?event.cancelBubble=true:event.stopPropagation();'>-</a>&nbsp;&nbsp;"+
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
//检测SECTOR的NAME是否唯一 
function checkSectorName(parent,sectorName){
	var result = true;
	for(var i = 0;i<parent.sectors.length;i++)
	{
		if(parent.sectors[i].name==sectorName){
			result = false;
			break;
		}else{
			result = checkSectorName(parent.sectors[i],sectorName);
			if(!result)
				break;
		}
	}
	return result;
}
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
        		//检测NAME属性是否唯一
        		if(!checkSectorName(json,sectorName)){
        			CORE.info("区域名字必须唯一");
        			return;
        		}
        		//填充参数
        		var newSector = {
        			"js":"",
					"id":sectorId,
					"code":"_"+Date.parse(new Date()),
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
//更新SECTOR
function refleshSector(){
	updateSector();
}
//更改SECTOR
function editSector(sectorCode,sectorId,name,orientation){
	_SectorEdit.sectorCode = sectorCode;
	_SectorEdit.sectorName = name;
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
	    sectorName:"",
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
        		//检测NAME属性是否唯一
        		if(sectorName != _SectorEdit.sectorName)
	        		if(!checkSectorName(json,sectorName)){
	        			CORE.info("区域名字必须唯一");
	        			return;
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
	CORE.confirm("是否确认删除?", function() {
	 	CORE.request("DS_PAGE_DEL",{data:"id="+pageId+"&sys_code="+sysCode}, function(data) {
                GRID.reload("pageManagerList");
        });
	});
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
function dropSectorConfirm(sectorId,fatherId){
	CORE.confirm("是否确认删除?", function() {
	 	dropSector(sectorId,fatherId);
	});
}
//移动到某sector内
function chooseOtherSector(sectorId){
	//清空所有可选节点
	$("#OtherSectorSelect").empty();
	//得到所有可选的父容器节点
	var $sectors_list = [];
	$sectors_list[json.code] = "页面容器";
	$sectors_list = getAllHasChildSector(json,$sectors_list,sectorId);
	for(var key in $sectors_list)
		$("#OtherSectorSelect").append("<option value='"+key+"'>"+$sectors_list[key]+"</option>");
	//打开窗口选择新的父容器节点
	_otherSectorDlg.sectorId = sectorId;
	$("#OtherSectorSelectPanel").dialog(_otherSectorDlg);
}
//获取所有可以添加子区域的区域
function getAllHasChildSector(parent,$sectors_list,sectorId){
	for(var i = 0;i<parent.sectors.length;i++)
	{
		if(parent.sectors[i].hasChild=="true"){
			if(parent.sectors[i].code != sectorId){
				var sector_id = parent.sectors[i].code; 
				var sector_label = parent.sectors[i].name;
				$sectors_list[sector_id] = sector_label;
			}
		}
		if(parent.sectors[i].sectors.length!=0)
			$sectors_list = getAllHasChildSector(parent.sectors[i],$sectors_list);
	}
	return $sectors_list;
}
var _otherSectorDlg ={
	    title : "选择可移动到的区域",
	    width : "320",
	    height : "320" ,
	    modal : true,
	    bgiframe : true,
	    resizable:false,
	    sectorCode:"",
	    buttons:{
	        "取消":function() {
	    		$("#OtherSectorSelectPanel").dialog("close");
	        },
	        "确定":function() {
	        	//获取移动到的父容器目标
        		var parentId = document.OtherSectorSelectForm.sectors.value;
				//获取移动的SECTOR
				var $aimSector = getAndRemoveSector(json,_otherSectorDlg.sectorId);
        		//转移内存的JSON对象
				move2Sector(json,$aimSector,parentId);
        		//发送请求更新参数
				updateSector();
				//关闭窗口
	    		$("#OtherSectorSelectPanel").dialog("close");
	        }
	    }
	};	
//执行跨父区域移动
function move2Sector(parent,sectorEntity,parentId){
	if(parent.code == parentId){
		if(parent.sectors.length==0)
			parent.sectors[0] = sectorEntity;
		else
			parent.sectors[parent.sectors.length] = sectorEntity;	
	}else
		for(var i = 0;i<parent.sectors.length;i++)
			move2Sector(parent.sectors[i],sectorEntity,parentId);
}
//获取并移除需要跨父区域移动的区域
function getAndRemoveSector(parent,sectorId)
{
	var $aimSector = null;
	for(var i = 0;i<parent.sectors.length;i++)
	{
        if (sectorId == parent.sectors[i]["code"]) {
        	$aimSector = parent.sectors[i];
	        parent.sectors.splice(i, 1);
			break;
		}else if(parent.sectors[i].sectors.length!=0){
			$aimSector = getAndRemoveSector(parent.sectors[i],sectorId);
			if($aimSector!=null)
				return $aimSector;
        }	
	}
	return $aimSector;
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

//将区域在父容器内向前移动
function move2Head(sectorId,fatherId){
	if(fatherId == json.id){
		for(var i = 0;i<json.sectors.length;i++){
            if(json.sectors[i].code == sectorId){
	            if (i == 0)
	                return;
	            var _tmp = json.sectors[i];
	            json.sectors[i] = json.sectors[i - 1];
	            json.sectors[i - 1] = _tmp;	
	            break;
			}
		}
	}else
		jsonOperation("m2head",json,fatherId,sectorId);
	updateSector();
}	

//将区域在父容器内向后移动
function move2Tail(sectorId,fatherId){
	if(fatherId == json.id){
		for(var i = 0;i<json.sectors.length;i++){
            if(json.sectors[i].code == sectorId){
	            if (i == json.sectors.length - 1)
	                return;
	            var _tmp = json.sectors[i];
	            json.sectors[i] = json.sectors[i + 1];
	            json.sectors[i + 1] = _tmp;	
	            break;	
			}
		}
	}else
		jsonOperation("m2tail",json,fatherId,sectorId);
	updateSector();
}	
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
			        	jsonOperation("del",father.sectors[i].sectors[j],fatherId,aim);
			        }
			    }			
			}else if(type=="edit"){
				father.sectors[i].name = aim.sectorName;
				father.sectors[i].orientation = aim.orientation;				
			}else if(type=="m2head"){
				for(var m = 0;m<father.sectors[i].sectors.length;m++)
				{
            		if(father.sectors[i].sectors[m]["code"] == aim){
		            	if (m == 0)
		                	return;
		            	var _tmp = father.sectors[i].sectors[m];
		            	father.sectors[i].sectors[m] = father.sectors[i].sectors[m - 1];
		            	father.sectors[i].sectors[m - 1] = _tmp;		
		            }			
				}
			}else if(type=="m2tail"){
				for(var m = 0;m<father.sectors[i].sectors.length;m++)
				{
		            if(father.sectors[i].sectors[m]["code"] == aim){
			            if (m == father.sectors[i].sectors.length - 1)
			                return;
			            var _tmp = father.sectors[i].sectors[m];
			            father.sectors[i].sectors[m] = father.sectors[i].sectors[m+1];
			            father.sectors[i].sectors[m+1] = _tmp;	
			            break;	
					}
				}
			}						
			break;
		}else if(father.sectors[i].sectors.length!=0){
			if(type=="add")
				jsonOperation("add",father.sectors[i],fatherId,aim);
			else if(type=="del")
				jsonOperation("del",father.sectors[i],fatherId,aim);	
			else if(type=="edit")
				jsonOperation("edit",father.sectors[i],fatherId,aim);
			else if(type=="m2head")
				jsonOperation("m2head",father.sectors[i],fatherId,aim);	
			else if(type=="m2tail")
				jsonOperation("m2tail",father.sectors[i],fatherId,aim);						
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
		
		//保存json
/*		json = data;
		$("#template_container").empty();
		var scripts = new Array();
		fillScripts(scripts,json);
		for(var i = 0;i<scripts.length;i++)
		{	
			for(var c = 0;c<scripts.length;c++){
				if(scripts[c]==scripts[i]&&c!=i){
					scripts[c] = "";
				}
			}
		}			
		var oHead = $(document.head);//document.getElementsByTagName('HEAD').item(0);
		for(var j = 0;j<scripts.length;j++)
		{	
			if(scripts[j]!=""){
                /*
				var oScript= document.createElement("script");			
				oScript.type = "text/javascript";		
				oScript.src=scripts[j];
				oScript.mark="rdcp";			
				oHead.appendChild(oScript);
				 */
//              oHead.append("<script type='text/javascript' src='"+scripts[j]+"?_t="+new Date().getTime()+"'/>")
//			}
//		}
//      var _html = "";
//      _html = generateSectorDiv(data,'',data.orientation);
//      $("#template_container").append(_html);
		
		window.location.reload();
	});	
}

/**
 * 同步页面
 */
function _syncPage(){
	CORE.request("DS_SYNC_OBJECT",{data:"objId=${param.page_id}&syscode=${param.syscode}&tablenames=RDC_CFG_PAGE"}, function(data) {
		CORE.info(data);
	});
}
/**
 * 按钮事件侦听
 */
function keyListener(){	
	var pe = getPageEvent();  
	if(pe.keyCode == 13)
		return;
	if(pe.shiftKey&&pe.keyCode==83)//SHIFT+S 保存
		_saveProperties();
	else if(pe.shiftKey&&pe.keyCode==87)//SHIFT+W 关闭
		parent.tab.removeTabItem("${param.page_id}");
	else if(pe.shiftKey&&pe.keyCode==68)//SHIFT+D 测试
		_testConfig();
	else if(pe.shiftKey&&pe.keyCode==81)//SHIFT+Q 刷新
		window.location.reload();
}
/**
 * 获取事件对象
 */
function getPageEvent(){  
	if(document.all)      
    	return window.event;//如果是ie  
    func=getPageEvent.caller;  
    while(func!=null){  
        var arg0=func.arguments[0];  
        if(arg0){  
           if((arg0.constructor==Event || arg0.constructor ==MouseEvent) || (typeof(arg0)=="object" && arg0.preventDefault && arg0.stopPropagation)){  
              return arg0;  
           }              
        }  
        func=func.caller;  
    }  
    return null;  
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
            	<a class="btn_sync" href="javascript:void(0);" onclick="_syncPage();" title="同步当前配置页面到业务库">同步</a>
                <a class="btn_arrow_left" href="javascript:void(0);" onclick="_goBack();" title="返回页面管理">返回</a>
                <a class="btn_save" href="javascript:void(0);" onclick="_saveProperties();" title="保存页面配置">保存</a>
                <a class="btn_browse" href="javascript:void(0);" onclick="_testConfig();" title="在新窗口测试页面">测试</a>
                <!--
                <input name="btn_addition" class="btn_additionout" value="返回" type="button" onclick='_goBack();'/>
				<input name="btn_addition" class="btn_additionout" value="保存" type="button" onclick='_saveProperties();'/>
				<input name="btn_addition" class="btn_additionout" value="测试" type="button" onclick='_testConfig();'/>
				-->
            </div>
        </div>
    </div>
	<div style="magin:10px;padding:10px;">
		<table width="100%">
			<tr>
				<td valign="top" width="80%" id="template_container">
					<!-- 编辑模块 -->
                    <!--
					<div id="container_id" valign="top" onclick="_loadProperties(this.id)"
					     style="border: 1px solid #0A246A;float:left;width:100%;height:100%;padding:3px;">
                         <div style="float:right;">
                         	<a href="javascript:void(0);" style="font-size:14px;" onclick="addSector(json.id);event?event.cancelBubble=true:event.stopPropagation();">+</a>&nbsp;&nbsp;
                         	<a href='javascript:void(0);' style='font-size:14px;' onclick='editContainer();event?event.cancelBubble=true:event.stopPropagation();'>e</a>
                         </div>
                         <br />
					</div>
					-->
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
	<div id="OtherSectorSelectPanel" style="display:none;">
		<form name="OtherSectorSelectForm">
		<table>
			<tr class="formRow">
				<td class="formLabel">可以转移的区域:</td>
				<td class="formField">
					<select id="OtherSectorSelect" name="sectors">
					</select>
				</td>
			</tr>
		</table>
		</form>
	</div>	
</body>
<style>
    .methodTable{
        width:580px !important;
        border:1px solid #37356c;
        border-collapse: collapse;
    }
    .methodTable th,.methodTable td{
        border: 1px solid #37356c;
    }
</style>
<script type="text/javascript" src="scripts/rdcp/tools.api.js"></script>
<script>
    var _currentElementId = null;
    function showApiTip(ele,id,type){
        CORE.request("DS_RDCP_ELEMENT_API",{data:"ele_type="+type+"&element_id="+id},function(data){
            //alert(data);
            try{
                if(!ele.id)
                    ele.id = new Date().getTime()+"";
                //alert(_currentElementId);
                if(_currentElementId != null)
                    $("#"+_currentElementId).poshytip("destroy");
                _currentElementId = ele.id;
                var _html =RDCP.buildApiTipHtml(data,ele.id);
                $("#"+ele.id).poshytip({
                    content: _html,
                    showOn: 'none',
                    alignTo: 'target',
                    alignX: 'inner-right',
                    offsetX: 0,
                    offsetY: 5,
                    className:"tip-yellowsimple",
                    //showAniDuration :false,
                    hideAniDuration :false
                });
                //$(ele).poshytip("update",_html);
                $(ele).poshytip("show");
            }catch(e){CORE.info("打开API发生错误："+e.message);}
        });
    }
</script>
</html>