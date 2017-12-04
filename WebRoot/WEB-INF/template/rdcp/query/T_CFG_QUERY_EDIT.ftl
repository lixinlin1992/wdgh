{
<#list resultSet.rows as i>
"name":"${i.queryName!}",
"code":"${i.queryCode!}",
"sys_name":"${i.sysName!}",
"sys_code":"${i.sysCode!}",
"module_name":"${i.moduleName!}",
"module_id":"${i.moduleId!}",
"executor_name":"${i.exeName!}",
"executor_id":"${i.exeId!}",
"executor_class":"${i.EXECUTOR_CLASS!}",
"executor_result":"${i.EXECUTOR_RESULT!}",
"custom_result":"${i.CUSTOM_RESULT!}",
"sql_stmt":"${i.SQL_STMT!}",
"note":"${i.NOTE!}"
</#list>
}
