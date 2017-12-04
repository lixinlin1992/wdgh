{
<#assign ni=0/>
	"item":[
		<#list resultSet.rows as i>
			<#if ni&gt;0>,</#if>
			{"name":"${i.name!}","id":"${i.ids!}"}
			<#assign ni=ni+1/>
		</#list>	
	]
}
