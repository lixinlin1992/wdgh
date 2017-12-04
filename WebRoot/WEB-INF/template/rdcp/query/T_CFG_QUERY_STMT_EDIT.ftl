{
<#list resultSet.rows as i>
"id":"${i.ID!}",
"sql_stmt_item":"${i.STMT!}",
"query_model":"${i.DESIGN_DATA!}"
</#list>
}
