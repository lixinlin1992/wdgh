{
<#list resultSet.rows as i>
"id":"${i.ID!}",
"name":"${i.NAME!}",
"code":"${i.CODE!}",
"class":"${i.CLASS!}",
"note":"${i.NOTE!}"
</#list>
}
