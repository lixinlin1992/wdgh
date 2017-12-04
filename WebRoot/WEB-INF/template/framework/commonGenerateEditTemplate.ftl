<#assign index = 0/>
{
${"<#list resultSet.rows as i>"}
<#list Fields_Cols as fi>
<#if index&gt;0>,</#if>"${fi.name}":"${"$"}{i.${fi.name}!}"<#assign index = index +1/></#list>
${"</#list>"}
}	   	