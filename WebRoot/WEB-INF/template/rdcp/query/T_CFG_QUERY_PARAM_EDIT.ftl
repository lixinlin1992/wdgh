{
<#list resultSet.rows as i>
"_queryId":"${i.QUERY_ID!}",
"paramName":"${i.NAME!}",
"paramCode":"${i.CODE!}",
"type":"${i.TYPE!}",
"value":"${i.VALUE!}",
"templateFlag":"${i.TEMPLATE_FLAG!}",
"paramNote":"${i.NOTE!}"
</#list>
}
