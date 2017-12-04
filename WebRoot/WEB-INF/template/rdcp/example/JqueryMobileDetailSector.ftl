<#--*明细sector*-->
<script>

<#assign _colModel=property("show_cols")/>
var colsInfo =[<#-- 想要展示的列 -->
<#if (json(_colModel,"$.")?size>0)>
	<#assign index = 0/>
	<#list json(_colModel,"$.") as _colModelList>
	<#if index&gt;0>,</#if>
		{
		name:"${_colModelList.name.value!}",
		index:"${_colModelList.index.value!}",
		hidden : <#if _colModelList.hidden.value?? && _colModelList.hidden.value?string="true">true<#else>false</#if>
		}
	<#assign index=index+1/>
	</#list>
</#if>
];
		
var accParams ={<#--从其他页面传过来的参数值-->
        <#assign paramMap = _request.parameterMap>
        <#assign inxP=0/>
        <#list paramMap?keys as k>
            <#if inxP&gt;0>,</#if>
            "${k}" : "${paramMap[k][0]}" 
            <#assign inxP=inxP+1/>  
        </#list>
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
<#--* 页面异步加载数据 *-->		
$( '#_aboutPage' ).live( 'pageinit',function(event){
	listCreate();
});

<#--
*创建list
DS_DES_TABLE_COLS_LIST
-->
function listCreate(){
       var toSysParams ="";<#-- 传到后台的参数 -->
       if(wantParams.length>0){<#-- 有指定要接收的参数 -->
           toSysParams = "";
           var didParams="${property("diyParams")!}";<#-- 自定义参数 -->
           for(i=0;i<wantParams.length;i++){
              if(i==0){
                toSysParams = wantParams[i]+"="+accParams[wantParams[i]];
              }else{
                toSysParams += "&"+ wantParams[i]+"="+accParams[wantParams[i]];
              }
           }
           if(didParams!=""){
               var didParamsArr = didParams.split(",");
               didParams ="";
               for(i=0;i<didParamsArr.length;i++){
                 didParams+="&"+didParamsArr[i];
               }
           }
           toSysParams=toSysParams+didParams;
       };
      CORE.request("${property("showDetail_ds")!}",{data:toSysParams},function(data){
      	   $("#_ui_${_config.code}").empty();
      	  <#-- $("#_ui_${_config.code}").append("<li data-role='list-divider'>${property("title")!}</li>");-->
      	   var li ="";
      	   if(data.records !=null && data.records>0){
    			for(i=0;i<1;i++){
    				if(colsInfo.length>0){
    				    var col="<table>";
    					for(j=0;j<colsInfo.length;j++){
    					    var dis ="";<#--列是否隐藏-->
    						if(colsInfo[j].hidden){
    							dis="display:none;";
    						}
    						col+= "<tr style='"+dis+"'><td><h2>"+colsInfo[j].name+":</h2></td><td>"+data.rows[i].cell[j]+"</td></tr>";
    					}
    					col+="</table>";
    					li+="<li>"+col+"</li>"
    				}	
    			}
    			$("#_ui_${_config.code}").append(li);	   	
      	   }
    	   $("#_ui_${_config.code}").listview("refresh");<#-- 刷新列表 -->
    	  
      });	


};




</script>
<div id="_div_${_config.code}">
	<ul id='_ui_${_config.code}' data-role='listview' data-theme='${property("contentTheme")!}'  data-divider-theme='${property("titleTheme")!}'>
	
	</ul>
</div>		
