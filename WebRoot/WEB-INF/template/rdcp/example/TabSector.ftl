<link href="themes/default/css/ligerUISkins/Aqua/css/ligerui-all.css" rel="stylesheet" type="text/css"/>
<script src="scripts/ligerUI/js/core/base.js" type="text/javascript"></script>
<script src="scripts/ligerUI/js/plugins/ligerTab.js" type="text/javascript"></script>
<div position="center" id="${property("framename")!}">
	<#list _sectors as s>
    <div tabid="${s.code}" id="${s.code}"  title="${s.name}"  valign="${property("valign")!"top"}" align="${property("align")!"left"}"  
    <#if property(s,"SectorClass")?? && property(s,"SectorClass")!="">class="${property(s,"SectorClass")}"<#elseif property(s,"HasSectorBorder")?? && "true"=property(s,"HasSectorBorder")!>class="sector_external_div"</#if> style="<#if property(s,"SectorStyle")?? && property(s,"SectorStyle")!="">${property(s,"SectorStyle")}<#else>margin: 0px;</#if><#if "true"=property(s,"hidden")!>display:none;</#if>">
    	<#-- 区域边框 -->
        <#if property(s,"HasSectorBorder")?? && "true"=property(s,"HasSectorBorder")!>
        	<h2 class="sector_external_bar">${s.name}</h2>
        	<div>
        </#if>
    	<@sector sector=s/>
        <#-- 区域边框结束 -->
        <#if property(s,"HasSectorBorder")?? && "true"=property(s,"HasSectorBorder")!>
    		</div>
        </#if>  
    </div>
	</#list>
</div>
<#-- 初始化TAB -->
<script>
$(function(){
	var _height = $("#${property("framename")!} :first");
	$("#${property("framename")!}").ligerTab({heigth:_height});
});
</script>