<#assign idx=0>
[
<#list resultSet.rows as r>
<#if idx&gt;0>,</#if>{"id":"${r.id}",name:"${r.name}"<#if r.types =1>, isParent:true</#if>
,parent_id:"${r.id}",DEPT_TYPE:"${r.DEPT_TYPE}",NOTE:"${r.NOTE!}","type":"${r.types}","icon":"themes/default/images/service/security/<#if r.types==1>department.gif<#else>user.gif</#if>",nodes:[]}<#assign idx=idx+1>
</#list>
]