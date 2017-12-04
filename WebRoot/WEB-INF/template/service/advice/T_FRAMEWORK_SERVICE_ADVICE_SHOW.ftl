{
<#list resultSet.rows as i>
"userName":"${i.name!}","date":"${i.advice_date!}","title":"${i.title!}","content":"${i.content!}","note":"${i.note!}"
</#list>
}
