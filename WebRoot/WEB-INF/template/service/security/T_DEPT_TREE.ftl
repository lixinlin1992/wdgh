<#assign idx=0>
[
<#list resultSet.rows as r>
<#if idx&gt;0>,</#if>{"id":"${r.id}",name:"${r.name}","isParent":<#if r.children_count&gt;0>true<#else>false</#if>,"parent_id":"${r.id}","dept_type":"${r.DEPT_TYPE}","note":"${r.NOTE!}"}<#assign idx=idx+1>
</#list>
]