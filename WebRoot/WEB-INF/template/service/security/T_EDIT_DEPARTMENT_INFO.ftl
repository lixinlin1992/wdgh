{
<#list resultSet.rows as i>
"ename":"${i.name!}","eDEPT_TYPE_NAME":"${i.DEPT_TYPE_NAME!}","eNOTE":"${i.NOTE!}","ePARENT_NAME":"${i.PARENT_NAME!}"
</#list>
}