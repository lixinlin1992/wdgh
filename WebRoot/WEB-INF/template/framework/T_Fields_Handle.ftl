<#assign index = 0/>
{"item":[
<#list resultSet.rows as i>
<#if index &gt;0>,</#if>
{"name":"${i.name!}","code":"${i.code!}","type":"${i.type!}"}
<#assign index = index +1/>
</#list>
]}
