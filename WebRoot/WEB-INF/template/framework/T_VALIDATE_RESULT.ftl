<#assign idx=0>
{
"header":{"code":"-97","message":"����У��ʧ��"},
"body":[
<#list messages as m><#if idx&gt;0>,</#if>"${m}"<#assign idx=idx+1></#list>
]
}