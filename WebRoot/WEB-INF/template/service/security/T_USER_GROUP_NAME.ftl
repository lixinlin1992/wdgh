<#assign index=0/>
[
	<#list resultSet.rows as i>
	<#if index&gt;0>,</#if>{"name":"${i.name!}"}<#assign index=index+1/>
	</#list>
]