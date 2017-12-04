{
<#list resultSet.rows as i>
"id":"${i.id}","account":"${i.account}","name":"${i.name!}","mobile_phone":"${i.mobile_phone!}","email":"${i.email!}","status_id":"${i.status_id}"
</#list>
}