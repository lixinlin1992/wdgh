<#assign idx=0>
{
"header":{"code":"-97","message":"数据校验失败"},
"body":[
<#list messages as m><#if idx&gt;0>,</#if>"${m}"<#assign idx=idx+1></#list>
]
}