<#--
*
*1.调用 jmGetParams(); 可以直接拿到指定的要接收到参数的值,不用传参数，只要属性编辑那设定就可以了
*注意：以上函数仅用于EditSecotr
*
-->

<script>
    <#-- 拿到指定的参数值 -->
    function jmGetParams(){
        if(wantParams.length>0){<#-- 有指定要接收的参数 -->
           var toSysParams ="";<#-- 传到后台的参数 -->
           for(i=0;i<wantParams.length;i++){
              if(i==0){
                toSysParams = wantParams[i]+"="+accParams[wantParams[i]];
              }else{
                toSysParams += "&"+ wantParams[i]+"="+accParams[wantParams[i]];
              }
           }
           return toSysParams;
        }          
    }
  

    var accParams ={<#--从其他页面传过来的参数值-->
        <#if property("isAccParam")=="true">
            <#assign paramMap = _request.parameterMap>
            <#assign inxP=0/>
            <#list paramMap?keys as k>
                <#if inxP&gt;0>,</#if>
                "${k}" : "${paramMap[k][0]}" 
                <#assign inxP=inxP+1/>  
            </#list>
        </#if>
    };

    var wantParams =[<#-- 想要拿到的参数 -->
        <#if property("wantParams")??  && property("wantParams")!="">
            <#assign _wantParams=property("wantParams")/>
            <#assign indwp = 0/>
             <#list _wantParams?split(",") as o>    
                <#if indwp&gt;0>,</#if>
                    "${o!}"
                <#assign indwp=indwp+1/>
             </#list>
        </#if>
    ];
    
    <#--页面初始-->
    $( '#_aboutPage' ).live( 'pageinit',function(event){
        if(${property("isAccParam")!}){<#-- 表示要接收参数 -->
            if(wantParams.length>0){<#-- 有指定要接收的参数 -->
               var toSysParams ="";<#-- 传到后台的参数 -->
               for(i=0;i<wantParams.length;i++){
                  if(i==0){
                    toSysParams = wantParams[i]+"="+accParams[wantParams[i]];
                  }else{
                    toSysParams += "&"+ wantParams[i]+"="+accParams[wantParams[i]];
                  }
               }
              <#if property("initDataSource")??>
              CORE.request("${property("initDataSource")!}",{data:toSysParams},function(data){
                    CORE.fillForm(document.${property("formName")!"jmEditForm"},data);
               }); 
              </#if>
            }
        }   
    });
   <#--表单提交-->     
  function __jmFormSubmit${_config.code}(){
        <#if property("submitevent")??>${property("submitevent")}</#if>
    };
        
</script>
		<div class="content-primary">
	<form name="${property("formName")!"jmEditForm"}" >
		 <#assign _json=property("form_elements")!""/>
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
    
         </form>
			 <fieldset >
				 <button onclick="__jmFormSubmit${_config.code}()" data-theme="${property("confirmTheme")!}" data-inline='true'>确认</button>
				 <button type="reset" data-theme="${property("cancelTheme")!}" data-inline='true'>取消</button>
			 </fieldset>
	
	</div>
