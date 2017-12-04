<#assign menuList=menuList>
[{
	<#list menuList as i>
	id:"${i.id}",name:"${i.name}",type:"${i.type}",source:"${i.source}",newType:"${i.newType}",function_id:"${i.function_id}"<#if i.function_id !=0>,checked:true</#if><@greet sysFunctionMenu=i.sysFunctionMenus></@greet>
	</#list>
}]


<#macro greet sysFunctionMenu>
	<#assign index=0>
	,nodes:[
	<#list sysFunctionMenu as menuList>
		<#if index&gt;0>,</#if>
		{id:"${menuList.id}",name:"${menuList.name}",type:"${menuList.type}",source:"${menuList.source}",newType:"${menuList.newType}",function_id:"${menuList.function_id}"<#if menuList.function_id !=0>,checked:true</#if>
		<#if menuList.sysFunctionMenus??>
			<@greet sysFunctionMenu=menuList.sysFunctionMenus></@greet>
		</#if>
		}
		<#assign index=index+1>
	</#list>
	]
</#macro>

