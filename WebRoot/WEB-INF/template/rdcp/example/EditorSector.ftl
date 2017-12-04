<#--
 * @(#)GridSector.ftl 11-9-29 下午1:24
 * CopyRight 2011.  All rights reserved
 * 编辑/添加模板
 -->
<script type="text/javascript" src="scripts/datePicker/WdatePicker.js"></script>
<link href="themes/default/css/jquery-ui-1.7.1.custom.datepicker.css" rel="stylesheet" type="text/css"/>
<#if property("formField")?? && property("formField") != "">
<#-- 编辑区域是否生成FORM节点 -->
<#if property("isform")?? && property("isform")?string == "false">
<#else>
<form name="${property("formName")!"QueryForm"}">
    <input type="hidden" name="_sysCode" value="${_page.sys_code}"/>
</#if>
<#-- 生成编辑列表 -->
    <#assign _formFields=property("formField")/>
    <#if (json(_formFields,"$.")?size>0)>        
        <table class="content_List">
            <#assign _json=property("formField")!"">
            <#assign _idx = 0>
            <#assign sqlgencfg="">
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
                    <tr class="formRow">
                </#if>
                <#-- 生成TD -->            
                <#assign _idx=_idx+1>
                <td  id="${property("formname")!"QueryForm"}_${j.code.value}_label" 
                    align="<#if j.labeltdv??>${j.labeltdv.value!"right"}</#if>" 
                    valign="<#if j.labeltdh??>${j.labeltdh.value!"top"}</#if>"
                    style="${j.style.value!""}<#if j.type.value == "hidden">display:none;</#if>" 
                    class="contenttd" 
                    width="<#if j.labelwidth??>${j.labelwidth.value}<#else>100</#if>px"
                >${j.name.value}：</td>
                <td  id="${property("formname")!"QueryForm"}_${j.code.value}_value"
                    align="<#if j.inputtdv??>${j.inputtdv.value!"left"}</#if>" 
                    valign="<#if j.inputtdh??>${j.inputtdh.value!"top"}</#if>"
                    style="${j.style.value!""}<#if j.type.value == "hidden">display:none;</#if>" 
                    width="<#if j.inputwidth??>${j.inputwidth.value}<#else>200</#if>px" 
                    <#if !j_has_next && property("linecount")??>colspan="${property("linecount")*2-_idx*2+1}"</#if>
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
                    <input ${inputId} type="file" name="${j.code.value}" <#if j.inputStyle?? && j.inputStyle.value != "">style="${j.inputStyle.value}"</#if>/>
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
                    <#case "custom">
                        ${j.custom_content.value!}                    
                    <#break>
                    </#switch>
                </td>
                <#if property("linecount")?? && _idx&gt;=property("linecount")></tr><#assign _idx=0></#if>
            </#list>
        </table>
    </#if>

<#-- 编辑区域是否生成FORM节点 -->
<#if property("isform")?? && property("isform")?string == "false">
<#else>
</form>
</#if>    
    
        

<script>
    <#-- 是否生成加载下拉框代码 -->
    <#if property("isCodeGenAuto")?? && property("isCodeGenAuto")?string == "false">
    <#else>
    $(function(){
        <#assign _json=property("formField")!""/>
        <#list json(_json,"$.")! as j>
            <#if j.type.value=="select">
                <#if j.dataSource.value?? && j.dataSource.value != "">
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

    })
    </#if>
    
    <#-- 生成事件 -->
    <#assign _json=property("formField")!"">
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
    
    
    <#--接口函数定义区域-->
    var ${_config.code}={
            loadForm:function(params){
                //加载表单函数
                CORE.loadForm("${property("dataSource")!}","${property("formName")!}",
                {data:params.data,loadComplete:params.loadComplete});
            }
        };
</script>
</#if>                                                                                                                                                                                                                                                                                                                                                                  