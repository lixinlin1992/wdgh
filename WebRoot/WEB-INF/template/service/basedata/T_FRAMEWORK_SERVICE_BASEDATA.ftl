{
<#list resultSet.rows as i>
"id":"${i.id}","ids":"${i.code}","name":"${i.name}","note":"${i.note!}","order_id":"${i.order_id!}","code_type":"${i.type_name}"
</#list>
}