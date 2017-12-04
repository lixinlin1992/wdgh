{
<#-- 环节信息 -->
<#list resultSet_0.rows as i>
"name":"${i.name!}",
"st":"${i.st!}",
"ed":"${i.ed!}",
</#list>
<#-- 处理人名字 -->
<#assign index=0>
"assignee":"<#list resultSet_1.rows as i><#if index&gt;0>,p</#if>${i.name!}<#assign index=index+1></#list>",
<#-- 处理人角色 -->
<#assign index=0>
"role":"<#list resultSet_2.rows as i><#if index&gt;0>,p</#if>${i.name!}<#assign index=index+1></#list>",
<#-- 处理人部门 -->
<#assign index=0>
"dept":"<#list resultSet_3.rows as i><#if index&gt;0>,p</#if>${i.name!}<#assign index=index+1></#list>"
}