<script type="text/javascript" src="scripts/datePicker/WdatePicker.js"></script>
<link href="themes/default/css/jquery-ui-1.7.1.custom.datepicker.css" rel="stylesheet" type="text/css"/>
<div class="barquerycontent" align="center" style="width:<#assign _w=property("width")!""><#if _w??>${_w}<#if "true"=property("percentwidth")!>%<#else>px</#if><#else>100%</#if>;">
    <!--查询表单区域-->
    <form name="${property("formname")!"QueryForm"}" onsubmit="__FormSubmit${_config.code}(this);return false;">
    <input type="hidden" name="_sysCode" value="${_page.sys_code}"/>
    <input type="hidden" id="pageId" name="pageId"/>
        <table class="content_List">
            <#assign _json=property("query_conditions")!"">
            <#assign _idx = 0>
            <#assign sqlgencfg="">
            
            <#assign areaConfigLines = 1/>
            <#assign lastAreaConfigPosition = 3/>
            <#assign areaConfigLength = 0/>
            <#assign isGenSubmit = "true"/>
            <#list json(_json,"$.")! as checkIsGenSubmit>
            	<#if checkIsGenSubmit.type.value == "submit">
            		<#assign isGenSubmit = "false"/>
            	<#elseif checkIsGenSubmit.isAutoGenSubmit?? && checkIsGenSubmit.isAutoGenSubmit.value == "true">
            		 <#assign isGenSubmit = "false"/>
            	</#if>
            	<#assign areaConfigLength = areaConfigLength + 1/>
            </#list>     
            
            <#if property("linecount")??>
    		 	 <#if areaConfigLength%property("linecount") == 0>
    		 	 	<#assign areaConfigLines = areaConfigLength/property("linecount")/>
    		 	 <#else>
        		 	<#assign areaConfigLines = (areaConfigLength/property("linecount"))?int + 1/>
        		 </#if>	             	
            </#if>
                   
 
            <#if !property("linecount")??>
            	<#assign lastAreaConfigPosition = areaConfigLength/>
        	<#elseif property("linecount")??>	
        		 <#if areaConfigLength &lt;= property("linecount")>
        		 	<#assign lastAreaConfigPosition = areaConfigLength/>
        		 <#else>
        		 	 <#if areaConfigLength%property("linecount") == 0>
        		 	 	<#assign lastAreaConfigPosition = property("linecount")/>
        		 	 <#else>
	        		 	<#assign lastAreaConfigPosition = areaConfigLength%property("linecount")/>
	        		 </#if>	        		  
        		 </#if>
            </#if>
            
            <#assign configLineIndex = 0/>
            <#list json(_json,"$.")! as j>
                <#-- 定义表单ID -->
                <#assign inputId=""/>
                <#assign inputButtonId=""/>
                <#if j.hid?? && j.hid.value != "">
                    <#assign inputId="id='"+j.hid.value+"'"/>
                    <#assign inputButtonId="id='"+j.hid.value+"_button'"/>
                </#if>
                <#-- 下拉框类型则必须有ID -->
                <#if j.type.value == "select">
                    <#if inputId == "">
                        <#assign inputId = "id='"+j.code.value+j.id.value+"'"/>
                    </#if>
                </#if>    
                <#if _idx == 0>
	                <tr>
    	        	<#assign configLineIndex = configLineIndex+1/>
                </#if>
                <#-- 生成TD -->
                <#assign _idx=_idx+1>
                <td id="${property("formname")!"QueryForm"}_${j.code.value}_label" style="${j.style.value!""}<#if j.type.value == "hidden">display:none;</#if>" align="right" class="contenttd" width="<#if j.labelwidth??>${j.labelwidth.value!"100"}<#else>100</#if>px">${j.name.value}：</td>
                <td id="${property("formname")!"QueryForm"}_${j.code.value}_value" style="${j.style.value!""}<#if j.type.value == "hidden">display:none;</#if>"
                	align="left" width="<#if j.inputwidth??>${j.inputwidth.value!"200"}<#else>200</#if>px" 
                	<#if !j_has_next && property("linecount")??>
                		<#if isGenSubmit == "true" && property("is_gen_submit_alone")?? && "true" == property("is_gen_submit_alone")>
                		<#else>
                		colspan="${property("linecount")*2-_idx*2+1}"
                		</#if>
                	<#elseif _idx == lastAreaConfigPosition && isGenSubmit == "true" && property("is_gen_submit_alone")?? && "true" == property("is_gen_submit_alone")>
                		<#if configLineIndex == areaConfigLines>
                		colspan="1"
                		<#else>
                		colspan="2"
                		</#if> 
                	</#if>
                >
                <#-- 根据类型生成 -->             
                <#switch j.type.value>
                    <#case "select">
                    <select ${inputId} name="${j.code.value}"
                    		<#if j.inputStyle?? && j.inputStyle.value != "">style="${j.inputStyle.value}"</#if>
                            <#if j.onchange.value?? && j.onchange.value != "">onchange="${j.code.value}${j.id.value!}_onchange()"</#if>
                    >
                        <#list j.listdata.value?split(",") as o>
                        <#if o!=""><option <#if o?split(":")[0] == j.value.value>selected="true"</#if> value="${o?split(":")[0]}">${o?split(":")[1]}</option></#if>
                        </#list>
                    </select>
                    <#break>
                    <#case "textarea">
                    <textarea ${inputId} name="${j.code.value}" rows="${j.rows.value!"1"}" cols="${j.cols.value!"10"}"   
                    	<#if j.inputStyle?? && j.inputStyle.value != "">style="${j.inputStyle.value}"</#if>                  
                        <#if j.onchange.value?? && j.onchange.value != "">onchange="${j.code.value}${j.id.value!}_onchange()"</#if>
                        <#if j.onfocus.value?? && j.onfocus.value != "">onfocus="${j.code.value}${j.id.value!}onfocus()"</#if>                    
                        <#if j.onblur.value?? && j.onblur.value != "">onblur="${j.code.value}${j.id.value!}_onblur()"</#if>                    
                    ></textarea>
                    <#break>
                    <#case "checkbox">
                    <#case "radio">
                    <#-- 获取默认值 -->
                    <#assign multiInputValue = ""/> 
                    <#assign multiInputId=""/>
                    <#if j.hid?? && j.hid.value != "">
                        <#assign multiInputId=j.hid.value/>
                    </#if>
                    <#if j.value.value?? && j.value.value != "">
                        <#assign multiInputValue = j.value.value/>
                    </#if>
                    <#assign multiInputIndex = 0/>
                    <#-- 开始根据数据源生成选项 -->
                    <#list j.listdata.value?split(",")! as o>
                        <#if o!="">
                            <#-- 判断单选框的默认值 -->
                            <#assign isChecked = ""/>
                            <#-- 若没有设置默认值,则默认第一个胃默认选项 -->
                            <#if multiInputValue == "" && multiInputIndex == 0>
                                <#assign isChecked = "checked"/> 
                            <#-- 单选则配置值与默认值想到为默认选项 -->
                            <#elseif j.type.value == "radio" && multiInputValue != "" && multiInputValue == o?split(":")[0]>
                                <#assign isChecked = "checked"/>
                            <#elseif j.type.value == "checkbox" && multiInputValue != "">
                                <#list j.value.value?split(",")! as defaultValue>
                                    <#if defaultValue != "" && defaultValue == o?split(":")[0]>
                                        <#assign isChecked = "checked"/>
                                        <#break>
                                    </#if>
                                    <#assign isChecked = ""/>
                                </#list>
                            <#else>
                            <#-- 否则设置为不选择 -->
                                <#assign isChecked = ""/>
                            </#if>
                            <#-- 判断结束 -->
                            <label>
                                <input id="${multiInputId}_${multiInputIndex}" type="${j.type.value}" name="${j.code.value}" value="${o?split(":")[0]}"
                                    <#if j.onchange.value?? && j.onchange.value != "">onchange="${j.code.value}${j.id.value!}_onchange()"</#if>
                                 ${isChecked}/>${o?split(":")[1]}
                            </label>
                            <#assign multiInputIndex = multiInputIndex+1/>
                        </#if>
                    </#list>
                    <#break>
                    <#case "date">
                    <input  ${inputId} type="text" class="Wdate" onfocus="WdatePicker({dateFmt:'${j.dateformat.value}'})" name="${j.code.value}" value="${j.value.value}"
                    	<#if j.inputStyle?? && j.inputStyle.value != "">style="${j.inputStyle.value}"</#if>
                        <#if j.onchange.value?? && j.onchange.value != "">onchange="${j.code.value}${j.id.value!}_onchange()"</#if>                    
                        <#if j.onblur.value?? && j.onblur.value != "">onblur="${j.code.value}${j.id.value!}_onblur()"</#if>                    
                    />
                    <#break>
                    <#case "text">
                    <input  ${inputId} type="text" name="${j.code.value}" value="${j.value.value!}" <#if j.readonly.value?? && j.readonly.value?string="true">readonly</#if> 
                    	<#if j.inputStyle?? && j.inputStyle.value != "">style="${j.inputStyle.value}"</#if>
                        <#if j.onchange.value?? && j.onchange.value != "">onchange="${j.code.value}${j.id.value!}_onchange()"</#if>   
                        <#if j.onfocus.value?? && j.onfocus.value != "">onfocus="${j.code.value}${j.id.value!}onfocus()"</#if>                          
                        <#if j.onblur.value?? && j.onblur.value != "">onblur="${j.code.value}${j.id.value!}_onblur()"</#if>  
                    
                    />
                    <#if j.buttontext.value?? && j.buttontext.value!="">
                        <input ${inputButtonId} type="button" value="${j.buttontext.value}" 
                         <#if j.buttonevent.value?? && j.buttonevent.value != "">onclick="${j.code.value}${j.id.value!}_onclick()"</#if>
                         />
                    </#if>
                    <#break>
                    <#case "hidden">
                    <input ${inputId} type="hidden" name="${j.code.value}" value="${j.value.value!}"/>                    
                    <#break>
                    <#case "file">
                    <input ${inputId} type="file" name="${j.code.value}" <#if j.inputStyle?? && j.inputStyle.value != "">style="${j.inputStyle.value}"</#if>  />
                    <#if j.buttontext.value?? && j.buttontext.value!="">
                        <input ${inputButtonId} type="button" value="${j.buttontext.value}" 
                         <#if j.buttonevent.value?? && j.buttonevent.value != "">onclick="${j.code.value}${j.id.value!}_onclick()"</#if>
                         />
                    </#if>                    
                    <#break>
                    <#case "label">
                    <span ${inputId} <#if j.inputStyle?? && j.inputStyle.value != "">style="${j.inputStyle.value}"</#if>>${j.value.value!}</span>                    
                    <#break>
                    <#case "button">
                    <input ${inputId} type="button" name="${j.code.value}" value="${j.value.value!}" 
                     <#if j.inputStyle?? && j.inputStyle.value != "">style="${j.inputStyle.value}"</#if>
                     <#if j.buttonevent.value?? && j.buttonevent.value != "">onclick="${j.code.value}${j.id.value!}_onclick()"</#if>
                    />                    
                    <#break>
                    <#case "password">
					<input  ${inputId} type="password" name="${j.code.value}" value="${j.value.value!}" 
                    		<#if j.inputStyle?? && j.inputStyle.value != "">style="${j.inputStyle.value}"</#if>
	                        <#if j.onchange?? && j.onchange.value != "">onchange="${j.code.value}${j.id.value!}_onchange()"</#if>   
	                        <#if j.onfocus?? && j.onfocus.value != "">onfocus="${j.code.value}${j.id.value!}onfocus()"</#if>                          
	                        <#if j.onblur?? && j.onblur.value != "">onblur="${j.code.value}${j.id.value!}_onblur()"</#if>
	                        <#if j.readonly?? && j.readonly.value?string="true">readonly</#if>/>
					<#break>
                    <#case "submit">
						<input id="_BtnSubmitQuery" class="btnquery_mouseout" onMouseOver="this.className='btnquery_mouseover'" onMouseOut="this.className='btnquery_mouseout'" type="submit" value=""/>
					<#break>
                    <#case "custom">
                        ${j.custom_content.value!}                    
                    <#break>
                    </#switch>
                    <#if j_has_next><#else>
                    	<#if isGenSubmit == "true">
                    		<#if property("is_gen_submit_alone")?? && "true" == property("is_gen_submit_alone")>
                    		<#else>
	                    	<input id="_BtnSubmitQuery" class="btnquery_mouseout" onMouseOver="this.className='btnquery_mouseover'" onMouseOut="this.className='btnquery_mouseout'" type="submit" value=""/>
	                    	</#if>
	                    </#if>
                    </#if>
                </td>
                <#if property("linecount")?? && _idx&gt;=property("linecount")>
                	<#if configLineIndex != areaConfigLines>
                		</tr>
                	</#if>
                    <#if configLineIndex == areaConfigLines>
                    <#else>
                    <#assign _idx=0>
                    </#if>
                </#if>
                <#if j_index&gt;0>
                <#assign sqlgencfg=sqlgencfg+",">
                </#if>
                <#assign sqlgencfg=sqlgencfg+"{name:'"+j.code.value+"'">
                <#if j.query_code?? && j.query_code.value!=""><#assign sqlgencfg=sqlgencfg+",code:'"+j.query_code.value+"'"><#else><#assign sqlgencfg=sqlgencfg+",code:'"+j.code.value+"'"></#if>
                <#if j.query_method??><#assign sqlgencfg=sqlgencfg+",method:'"+j.query_method.value+"'"><#else><#assign sqlgencfg=sqlgencfg+",method:'equals'"></#if>
                <#if j.custom_query_method??><#assign sqlgencfg=sqlgencfg+",cmethod:'"+j.custom_query_method.value+"'"><#else><#assign sqlgencfg=sqlgencfg+",cmethod:''"></#if>
                <#if j.query_type??><#assign sqlgencfg=sqlgencfg+",type:'"+j.query_type.value+"'"><#else><#assign sqlgencfg=sqlgencfg+",type=''"></#if>
                <#assign sqlgencfg=sqlgencfg+"}">
            </#list>
	        <#if isGenSubmit == "true" && property("is_gen_submit_alone")?? && "true" == property("is_gen_submit_alone")>
		        <td id="${property("formname")!"QueryForm"}_submit_td" 
	                	align="left"
	                	<#if property("linecount")??>
	                		colspan="${property("linecount")*2-_idx*2+1}"
	                	</#if>
	                >                
	        	<input id="_BtnSubmitQuery" class="btnquery_mouseout" onMouseOver="this.className='btnquery_mouseover'" onMouseOut="this.className='btnquery_mouseout'" type="submit" value=""/>
	        	</td>
	        </#if>
	        </tr>
        </table>
        <#--自动生成查询SQL的配置-->
        <#if "true"=property("gen_sql")!>
        <input type="hidden" name="_auto_condition_config" value="[${sqlgencfg}]"/>
        </#if>
    </form>
</div>
<script>
function __FormSubmit${_config.code}(form){
    <#--如果指定了列表，则刷新列表-->
    <#if property("gridid")??>GRID.reload("${property("gridid")}");</#if>
    <#if property("submitevent")?? && property("submitevent")?string != "">${property("submitevent")};</#if>
}


    <#-- 生成事件 -->
    <#assign _json=property("query_conditions")!"">
    <#list json(_json,"$.")! as j>
       <#switch j.type.value>
            <#case "select">
                   <#if j.onchange.value?? && j.onchange.value != "">
                       function ${j.code.value}${j.id.value!}_onchange(){
                           ${j.onchange.value}
                       }
                   </#if>
            <#break>
            <#case "textarea">
                <#if j.onchange.value?? && j.onchange.value != "">
                    function ${j.code.value}${j.id.value!}_onchange(){
                           ${j.onchange.value}                    
                    }
                </#if>
                <#if j.onfocus.value?? && j.onfocus.value != "">
                    function ${j.code.value}${j.id.value!}onfocus(){
                           ${j.onfocus.value}                    
                    }                    
                </#if>                    
                <#if j.onblur.value?? && j.onblur.value != "">
                    function ${j.code.value}${j.id.value!}_onblur(){
                           ${j.onblur.value}                                        
                    }
                </#if>                    
            <#break>
            <#case "checkbox">
            <#case "radio">
                <#if j.onchange.value?? && j.onchange.value != "">
                    function ${j.code.value}${j.id.value!}_onchange(){
                           ${j.onchange.value}                              
                    }
                </#if>
            <#break>
            <#case "date">
                <#if j.onchange.value?? && j.onchange.value != "">
                    function ${j.code.value}${j.id.value!}_onchange(){
                           ${j.onchange.value}                    
                    }
                </#if>                 
                <#if j.onblur.value?? && j.onblur.value != "">
                    function ${j.code.value}${j.id.value!}_onblur(){
                           ${j.onblur.value}                                        
                    }
                </#if>               
            <#break>
            <#case "file">
            <#case "button">
                   <#if j.buttonevent.value?? && j.buttonevent.value != "">
                    function ${j.code.value}${j.id.value!}_onclick(){
                        ${j.buttonevent.value}
                    }
                </#if>
            <#break>
            <#case "password">
            <#case "text">
                <#if j.onchange?? && j.onchange.value != "">
                    function ${j.code.value}${j.id.value!}_onchange(){
                           ${j.onchange.value}                    
                    }
                </#if>
                <#if j.onfocus?? && j.onfocus.value != "">
                    function ${j.code.value}${j.id.value!}onfocus(){
                           ${j.onfocus.value}                    
                    }                    
                </#if>                    
                <#if j.onblur?? && j.onblur.value != "">
                    function ${j.code.value}${j.id.value!}_onblur(){
                           ${j.onblur.value}                                        
                    }
                </#if> 
                   <#if j.buttonevent?? && j.buttonevent.value != "">
                    function ${j.code.value}${j.id.value!}_onclick(){
                        ${j.buttonevent.value}
                    }
                </#if>
            <#break>
      </#switch>        
    </#list>


var ${_config.code}={
    main:function(param){
        alert(param);
    },
    getFormData:function(){

    },
    reloadChart:function(id){
        OFC.reload(id);
    },
    reloadAllChart:function(){
        OFC.reloadAll("${property("formname")!"QueryForm"}");
    }
};

    $(function(){
    
    <#assign _json=property("query_conditions")!""/>
    <#-- 是否生成加载下拉框代码 -->
    <#if property("isCodeGenAuto")?? && property("isCodeGenAuto")?string == "false">
    <#else>
        <#assign _json=property("query_conditions")!""/>
        <#list json(_json,"$.")! as j>
            <#if j.type.value=="select">
                <#if j.dataSource?? && j.dataSource.value != "">
                    <#-- 定义加载的下拉框ID -->
                    <#assign inputId=""/>
                    <#if j.hid?? && j.hid.value != "">
                        <#assign inputId=j.hid.value/>
                    </#if>                
                    <#if inputId == "">
                        <#assign inputId = j.code.value+j.id.value/>
                    </#if>
                    <#-- 生成加载 -->
                    CORE.loadSelect("${inputId}","${j.dataSource.value}",{loadComplete:function(){
                        <#-- 下拉框加载回调 -->
                        <#if j.loadComplete?? && j.loadComplete.value != "">
                            ${j.loadComplete.value}
                        </#if>
                    }});
                </#if>
            </#if>
        </#list>
    </#if>    
    
     })
</script>                                                                                                                                                                                                                                                                                                                              