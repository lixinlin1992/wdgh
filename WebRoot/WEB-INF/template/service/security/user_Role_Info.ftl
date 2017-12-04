{
<#list resultSet.rows as i>
"eidtCode":"${i.code!}","eidtName":"${i.name!}","eidtNote":"${i.note!}",
"edit_type_id":"${i.type_id!}"
</#list>
}
