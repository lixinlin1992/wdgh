<#assign idx=0>
[
<#list resultSet.rows as r>
<#if idx&gt;0>,</#if>{"id":"${r.id}","name":"${r.name}","isParent":<#if r.children_count&gt;0>true<#else>false</#if>,"type":"${r.type}","sys_code":"${r.sys_code!}","sys_name":"${r.sys_name!}"}<#assign idx=idx+1>
</#list>
]