{
<#assign ni=0/>
	"sys":[
		<#list resultSet.rows as i>
			<#if ni&gt;0>,</#if>
			{"name":"${i.name!}","code":"${i.code!}"}
			<#assign ni=ni+1/>
		</#list>
	]
}
