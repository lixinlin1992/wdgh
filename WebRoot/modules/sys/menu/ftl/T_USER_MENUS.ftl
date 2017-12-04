[
<#list resultSet.rows as r>
{"name":"${unicode(r.name)}","url":"${unicode(r.url!)}","id":"${r.id}","parent_id":"${r.parent_id!}"}<#if r_has_next>,</#if>
</#list>
]