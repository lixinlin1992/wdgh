<#assign idx=0>
[<#list resultSet.rows as i><#if idx&gt;0>,</#if>
{"id":"${i.id!}","name":"${i.name!}","type":"${i.type!}","isParent":"${i.isParent!}","sys":"${i.sys!}","nodeType":"${i.nodeType!}","sys_name":"${i.sys_name!}","nodes":[]}
<#assign idx=idx+1></#list>]