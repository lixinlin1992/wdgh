<#--
OpenFlashChart组件模板
需要使用到swfobject.js,ofc.help.js
-->
<div id="ofc_${_config.code}"></div>
<script type="text/javascript" src="scripts/common/swfobject.js"></script>
<script type="text/javascript" src="scripts/service/ofc.help.js"></script>
<script type="text/javascript">
    <#assign xconfig=property("xaxisconfig")!"">
    <#assign sconfig=property("seriesconfig")!"">
    <#assign yconfig=property("yaxisconfig")!"">
    <#assign title=property("title")!"">
    <#assign bg_colour=property("bg_colour")!"">
	<#-- 生成报表 -->
<#-- 是否自动加载列表 -->
<#if property("isGenAuto")?? && property("isGenAuto") == "false">
<#else> 
	$(function(){
		OFC.create("ofc_${_config.code}","${property("chartdatasource")}",
					{
						width:"<#if property("width")??>${property("width")}<#if property("percentwidth")?? && property("percentwidth")=='true'>%</#if><#else>90%</#if>",
						height:"${property("height")!"200"}",
						xaxis_config:"<#if xconfig?trim!="">${escape(xconfig)}</#if>",
						series_config:"<#if sconfig?trim!="">${escape(sconfig)}</#if>",
						yaxis_config:"<#if yconfig?trim!="">${escape(yconfig)}</#if>",
						title:"${escape(title)}",
						bg_colour:"${escape(bg_colour)}",
						sysCode:"${_page.sys_code}"
					},"<#if property("formname")?? && property("formname") != "">${property("formname")}<#else>ofc_${_config.code}_form</#if>");	
    });    
</#if>
    //报表API
	var ${_config.code}={
	    getId:function(){
	    	return "ofc_${_config.code}";
	    },
	    quest:function(params){
	    	OFC.questload("ofc_${_config.code}",params);
	    },
        main:function(rqData){
		OFC.create("ofc_${_config.code}","${property("chartdatasource")}",
					{
						data:rqData,
						width:"<#if property("width")??>${property("width")}<#if property("percentwidth")?? && property("percentwidth")=='true'>%</#if><#else>90%</#if>",
						height:"${property("height")!"200"}",
						xaxis_config:"<#if xconfig?trim!="">${escape(xconfig)}</#if>",
						series_config:"<#if sconfig?trim!="">${escape(sconfig)}</#if>",
						yaxis_config:"<#if yconfig?trim!="">${escape(yconfig)}</#if>",
						title:"${escape(title)}",
						bg_colour:"${escape(bg_colour)}",
						sysCode:"${_page.sys_code}"
					},"<#if property("formname")?? && property("formname") != "">${property("formname")}<#else>ofc_${_config.code}_form</#if>");	
        
        }
	};    
</script>