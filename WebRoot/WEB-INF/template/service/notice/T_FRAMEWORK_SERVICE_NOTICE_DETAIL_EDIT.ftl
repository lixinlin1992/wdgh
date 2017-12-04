{
<#list resultSet.rows as i>
"title":"${i.title!}","name":"${i.name!}","start_date":"${i.start_date!}","type_id":"${i.type_id!}","urgence_id":"${i.urgence_id!}",
"end_date":"${i.end_date!}","content":"${i.content!}","auditStatusid":"${i.status_id!}"
</#list>
}
