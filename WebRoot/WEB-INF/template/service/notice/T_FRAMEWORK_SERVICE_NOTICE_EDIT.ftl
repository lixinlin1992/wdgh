{
<#list resultSet.rows as i>
"title":"${i.title!}","name":"${i.name!}","start_date":"${i.start_date!}","content":"${i.content!}","auditStatusid":"${i.status_id!}"
</#list>
}
