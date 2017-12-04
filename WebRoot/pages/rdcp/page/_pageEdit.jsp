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
<%
    TemplateConfig template = RDCPEngine.getTemplateConfig(StringUtil.getLong(request.getParameter("page_id")));
 %>
<html>
<head>
    <title>编辑页面</title>
    <jsp:include page="/pages/framework/base.jsp"/>
    <link type="text/css" rel="stylesheet" href="themes/default/css/rdcp.css"></link>
    <script type="text/javascript" src="scripts/rdcp/rdcp.js"></script>
    <script type="text/javascript" src="scripts/rdcp/propertyGrid.js"></script>
<%
	String scriptsParam = template.getParam("scripts");
	if(!StringUtil.isNull(scriptsParam)){
		String jshead = "<script type=\"text/javascript\" src=\"";
		String jstail = "\"></script>";
		String[] jsfiles = scriptsParam.split(",");
		for(String jsfile:jsfiles)
		{
			String js = jshead + jsfile + jstail;
			out.write(js);
		}
	}
%>
    <script type="text/javascript" language="JavaScript">
/**
 * 加载属性编辑
 */
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
					<div id="${param.templateId}" valign="top" onclick="_loadProperties('${param.templateId}')"
					     style="border: 1px solid #0A246A;float:left;width:100%;height:100%;">
					<%
					     List<SectorConfig> sectors = template.getSectorConfigs();
					     processSectors(sectors, template.getOrientation(), out , 0 , false);
					%>
					</div>				
				</td>
				<td valign="top">
					<!-- 属性编辑器模块 -->
					<table id="propertyTable" border="1" style="width:300px;height:100%;"></table>
				</td>
			</tr>
		</table>
	</div>
</body>
</html>
<%!
	//打印SECTOR
    void processSectors(List<SectorConfig> sectors, String orientation, Writer out ,
    					int perhorizontalSectorWidth,boolean isChild) throws Exception {
        for (int sectorsIndex = 0;sectorsIndex<sectors.size();sectorsIndex++) {
        	SectorConfig sector = sectors.get(sectorsIndex);//当前的sector
        	List<SectorConfig> subSectors = sector.getSectorConfigs();//包含的子sector
        	boolean horizontal = true;//是否横向SECTOR
        	if("horizontal".equals(sector.getOrientation())){
            	//当没有横向SECTOR时,重置横向SECTOR的宽度
        		if(perhorizontalSectorWidth==0){
	            	//SECTOR是横向,统计到达下一个横向SECTOR的数量
	                int horizontalSector = perhorizontalSectorCount(sectors,sectorsIndex,1);
	            	//横向SECTOR的宽为父容器的宽度比/SECOTR的数量
	            	perhorizontalSectorWidth = 90/horizontalSector;
        		}
            }else{
        		horizontal = false;
        		perhorizontalSectorWidth = 0;
            }
            if (subSectors != null && subSectors.size() > 0) {
            	int subSectorWidth = 0;
            	//若SECTOR为横向,则其宽为子SECTOR的数量与横向SECTOR宽的积
            	if(horizontal)
					subSectorWidth = perhorizontalSectorCount(subSectors,0,0) * perhorizontalSectorWidth;
                out.write(
                        "<div id='"+sector.getId()+"' style='background-color:#FFF;border:1px solid #0A246A;margin:10px; padding:2px; " +
        						(horizontal ? (isChild)? "height:100%;":"height:100px;" : "height:100px;") +
                                (horizontal ? "float:left;" : "") +
                				(horizontal && (subSectorWidth != 0) ? "width:"+subSectorWidth + "%;" : "") +
                                "' onclick='_loadProperties(\"" +
                                sector.getId() + "\");event?event.cancelBubble=true:event.stopPropagation();'>" +
                                "<div style='padding:0px;margin:0px;''>" + sector.getName() + "</div>");
	                processSectors(subSectors, sector.getOrientation(), out , 0 , true);
                out.write("</div>");
            } else {
                out.write(
                        "<div id='"+sector.getId()+"' style='background-color:#FFF;border:1px solid #0A246A;margin:10px; padding:10px;" +
        						(horizontal ? (isChild)? "":"height:100px;" : "height:100px;") +
                				(horizontal ? "width:"+perhorizontalSectorWidth + "%;" : "") +
                        		(horizontal ? "float:left;" : "") +
                                "' onclick='_loadProperties(\"" +
                                sector.getId() + "\");event?event.cancelBubble=true:event.stopPropagation();'>" + sector.getName() + "</div>");
            }
        }
    }
	//遍历SECTOR,得出直到下一个竖向SECTOR的数量
	int perhorizontalSectorCount(List<SectorConfig> sectors,int sectorsIndex,int result){
    	for(int countIndex = sectorsIndex;countIndex<sectors.size();countIndex++){
    		//遍历SECTORS队列
    		SectorConfig sector = sectors.get(sectorsIndex);
    		//若为水平分布
    		if("horizontal".equals(sector.getOrientation()))
	    		if(null != sector.getSectorConfigs() && sector.getSectorConfigs().size()>0){
	    			//若含有子SECTOR则计算其包含的子SECTOR
	    			result = perhorizontalSectorCount(sector.getSectorConfigs(),0,result);
    			}else{
    				result ++;
    			}
    	}
    	return result;
	}
%>