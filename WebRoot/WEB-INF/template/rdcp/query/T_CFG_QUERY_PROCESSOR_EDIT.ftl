{
<#list resultSet.rows as i>
"id":"${i.ID!}",
"query_id":"${i.QUERY_ID!}",
"processor_id":"${i.PROCESSOR_ID!}",
"processor_name":"${i.NAME!}",
"processor_class":"${i.PROCESSOR_CLASS!}",
"type":"${i.TYPE!}",
"seq_num":"${i.SEQ_NUM!}",
"break_flag":"${i.BREAK_FLAG!}",
"note":"${i.NOTE!}"
</#list>
}
