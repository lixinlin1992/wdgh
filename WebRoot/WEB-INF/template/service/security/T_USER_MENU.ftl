<#assign idx=0>
[
<#list resultSet.rows as r>
<#if idx&gt;0>,</#if>{"name":"${r.NAME}","url":"${r.MENU_URL!}","id":"${r.ID}"}<#assign idx=idx+1>
</#list>
]