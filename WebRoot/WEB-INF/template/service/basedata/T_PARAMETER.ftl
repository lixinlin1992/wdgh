{<#list resultSet.rows as i>
"${escape(i.code)}":{"name":"${escape(i.name)}","code":"${escape(i.code)}","value":"${escape(i.value)}"}
<#if i_has_next>,</#if>
</#list>}