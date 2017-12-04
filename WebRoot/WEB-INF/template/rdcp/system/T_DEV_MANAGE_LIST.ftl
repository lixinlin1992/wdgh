<#assign index=0/>
{
"page":"${pageInfo.page}",
"total":"${pageInfo.pageCount?string("#")}",
"records":"${pageInfo.totalCount?string("#")}",
"cols":[<#list resultSet.colNames as i><#if index&gt;0>,</#if>"${i}"<#assign index=index+1/></#list>],
<#assign index=0/>
"rows":[
	<#list resultSet.rows as i>
	<#if index&gt;0>,</#if>
	{
	"id":"${index}",
	"cell":[
	"${index}",
	"${i.sys_code}",
	"${i.user_id}",
	"${i.DEV_NAME}",
	"${i.SYS_NAME}",
	"${i.view_flag}",
	"${i.edit_flag}",
	"${i.delete_flag}"
	]
	}
	<#assign index=index+1/>
	</#list>
]
}