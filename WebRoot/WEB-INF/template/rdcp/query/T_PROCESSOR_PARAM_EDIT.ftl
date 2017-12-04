{
<#list resultSet.rows as i>
"id":"${i.id!}",
"processor_id":"${i.processor_id!}",
"query_id":"${i.query_id!}",
"name":"${i.name!}",
"code":"${i.code!}",
"value":"${i.value!}",
"note":"${i.note!}"
</#list>
}
