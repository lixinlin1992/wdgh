<#assign idx=0>
[
<#list resultSet.rows as r>
<#if idx&gt;0>,</#if>
{
id:"${r.id}",name:"${r.name}",parent_id:"${r.parent_id}"
	<#if r.parent_id =0>,isParent:true</#if>
	,parent_id:"${r.id}",
	nodes:[]}
	<#assign idx=idx+1>
</#list>
]