{
<#list resultSet.rows as i>
"id":"${i.ID!}",
"name":"${i.NAME!}",
"code":"${i.CODE!}",
"class":"${i.CLASS!}",
"results":"${i.RESULTS!}",
"note":"${i.NOTE!}"
</#list>
}
