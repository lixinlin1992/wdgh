<#assign idx=0>
[<#list resultSet.rows as i><#if idx&gt;0>,</#if>
{"id":"${i.id!}","name":"${i.name!}","type":"${i.type!}","isParent":${i.isParent!},"sys":"${i.sys}","code":"${i.code!}","nodes":[]}
<#assign idx=idx+1></#list>]