<#assign index = 0/>
<#assign colWidthsSize = 0/>
<#assign colWidths = []/>
<#assign childrenSize = _sectors?size/>
<#if childrenSize&gt;0>
<#-- 设置用户设定的TD宽度数组 -->
<#if property("colwidths")??>
<#assign colWidths=json(property("colwidths"),"$.")!>
<#assign colWidthsSize = colWidths?size/>
</#if>
<#-- 计算TD的宽度 -->
<#assign hgap = (property("hgap")!0)/2/>
<#assign hgapValue = (property("hgap")!0)/>
<#assign tdPadding = (_sectors?size-1)*hgapValue/100/>
<#assign tdWidth = (100-tdPadding)/_sectors?size/>
<#assign spTdWidth = tdWidth - tdPadding/>
<#if _config.orientation='horizontal' && _sectors?size&gt;1>
	<#-- 水平布局 -->
	<table border="0" width="100%" style="padding:0px;margin: 0px;">
	    <tr>
	<#list _sectors as s>
		<#if colWidthsSize == childrenSize>
			<#if index == _sectors?size-1 && index != 0>
		    <td valign="${property("valign")!"top"}" align="${property("align")!"left"}" width="${colWidths[index]}" 
		        style="padding-left:${hgap}px;padding-right:0px;padding-top:${property("vgap")!"0"}px;padding-bottom:0px;margin: 0px;<#if "true"=property(s,"hidden")!>display:none;</#if>">
		       
		       <div id="${s.code}" valign="${property("valign")!"top"}" align="${property("align")!"left"}"  
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
		        
		    </td>
			<#elseif index &gt; 0>
		    <td valign="${property("valign")!"top"}" align="${property("align")!"left"}" width="${colWidths[index]}"
		        style="padding-left:${hgap}px;padding-right:${hgap}px;padding-top:${property("vgap")!"0"}px;padding-bottom:0px;margin: 0px;<#if "true"=property(s,"hidden")!>display:none;</#if>">

		       <div id="${s.code}" valign="${property("valign")!"top"}" align="${property("align")!"left"}"  
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
		       
		    </td>
		    <#else>
		    <td valign="${property("valign")!"top"}" align="${property("align")!"left"}"  width="${colWidths[index]}" 
		        style="padding-right:${hgap}px;padding-left:0px;padding-top:${property("vgap")!"0"}px;padding-bottom:0px;margin: 0px;<#if "true"=property(s,"hidden")!>display:none;</#if>">

		       <div id="${s.code}" valign="${property("valign")!"top"}" align="${property("align")!"left"}"  
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
		       
		    </td>
		    </#if>
		    <#assign index = index+1/>		
		<#else>
			<#if index == _sectors?size-1 && index != 0>
		    <td valign="${property("valign")!"top"}" align="${property("align")!"left"}" width="${spTdWidth}%" 
		        style="padding-left:${hgap}px;padding-right:0px;padding-top:${property("vgap")!"0"}px;padding-bottom:0px;margin: 0px;<#if "true"=property(s,"hidden")!>display:none;</#if>">

		       <div id="${s.code}" valign="${property("valign")!"top"}" align="${property("align")!"left"}"  
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
		       
		    </td>
			<#elseif index &gt; 0>
		    <td valign="${property("valign")!"top"}" align="${property("align")!"left"}" width="${tdWidth}%" 
		        style="padding-left:${hgap}px;padding-right:${hgap}px;padding-top:${property("vgap")!"0"}px;padding-bottom:0px;margin: 0px;<#if "true"=property(s,"hidden")!>display:none;</#if>">

		       <div id="${s.code}" valign="${property("valign")!"top"}" align="${property("align")!"left"}"  
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
		       
		    </td>
		    <#else>
		    <td valign="${property("valign")!"top"}" align="${property("align")!"left"}"  width="${spTdWidth}%"  
		        style="padding-right:${hgap}px;padding-left:0px;padding-top:${property("vgap")!"0"}px;padding-bottom:0px;margin: 0px;<#if "true"=property(s,"hidden")!>display:none;</#if>">

		       <div id="${s.code}" valign="${property("valign")!"top"}" align="${property("align")!"left"}"  
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
		       
		    </td>
		    </#if>
		    <#assign index = index+1/>
		</#if>
	</#list>
	    </tr>
	</table>
<#else>
	<#assign index = 0/>
    <#-- 垂直布局 -->
    <#list _sectors as s>   
	    <#if index &gt; 0>
	    	<div style="height:${property("vgap")!"0"}px"></div>
	    </#if>     
    	<div id="${s.code}" valign="${property("valign")!"top"}" align="${property("align")!"left"}"  
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
    <#assign index = index + 1/>
    </#list>
</#if>
</#if>