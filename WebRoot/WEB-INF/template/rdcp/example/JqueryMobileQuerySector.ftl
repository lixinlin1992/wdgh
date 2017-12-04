		<div class="content-primary">
	<form name="${property("formName")!"queryForm"}" id="${property("formName")!"queryForm"}">
				<div data-role="fieldcontain">
         <#assign _json=property("query_conditions")!/>
             <#list json(_json,"$.")! as j>
                        
                     <#switch j.type.value>
                        <#case "select">
                                <label for="_select_${j.code.value!}" class="ui-input-text">${j.name.value!}</label>
                                <select name="${j.code.value!}" id="_select_${j.code.value!}">
                                    <#if j.listdata.value??>
                                        <#list j.listdata.value?split(",") as o>
                                            <#if o!=""><option value="${o?split(":")[0]}">${o?split(":")[1]}</option></#if>
                                        </#list>
                                    </#if>
                                </select>
                                <br>
                         <#break>
                        <#case "text">
                                <label for="_text_${j.code.value!}">${j.name.value!}</label>
                                <input value="${j.value.value!}" id="_text_${j.code.value!}" type="text" name="${j.code.value!}"  <#if j.readonly.value?? && j.readonly.value?string="true">readonly</#if>>
                                 <br>
                        <#break>
                        
                        <#case "textarea">
                                <label for="_textarea_${j.code.value!}">${j.name.value!}</label>
                                <textarea name="${j.code.value!}" id="_textarea_${j.code.value!}" >${j.value.value!}</textarea>
                                 <br>
                        <#break>    
                        
                        <#case "checkbox">
                                <input type="checkbox" name="${j.code.value!}" id="_checkbox_${j.code.value!}" value="${j.value.value!}"/>
                                <label for="_checkbox_${j.code.value!}">${j.name.value!}</label>
                                 <br>
                        <#break>
                        
                        <#case "radio">
                                <input type="radio" name="${j.code.value!}" id="_radio_${j.code.value!}" value="${j.value.value!}"/>
                                <label for="_radio_${j.code.value!}">${j.name.value!}</label>                           
                                 <br>
                        <#break>
                        
                        <#case "hidden">
                                <input type="hidden" name="${j.code.value!}" id="_hidden_${j.code.value!}" value="${j.value.value!}" />
                                 <br>
                        <#break>
                        <#case "date">
                                <input type="text" name="${j.code.value}" value="${j.value.value}" style="${j.style.value!}"/>
                                 <br>
                        <#break>                    
                     </#switch>
             </#list>
			 </div>
			 <fieldset>
				 <input type="button" data-theme="${property("searchTheme")!}" onclick='__FormSubmit${_config.code}();' value='搜索'/>
			 </fieldset>
		
	</form>
	</div>
<script>
	function __FormSubmit${_config.code}(){
	    <#if property("submitevent")??>${property("submitevent")};</#if>
	    <#--如果指定了列表，则刷新列表-->
	    <#if property("gridid")??>listCreate(1,"${property("gridid")}");</#if>
	}
	
	var _${_config.code}={
	    main:function(param){
	        alert(param);
	    }
	};
</script>