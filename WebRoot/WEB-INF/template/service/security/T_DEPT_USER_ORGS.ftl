<#assign idx=0>
[
<#list resultSet.rows as r>
<#if idx&gt;0>,</#if>"${r.org_id}"<#assign idx=idx+1>
</#list>
]