{
"header":{"code":"0","message":"Tree Load Success"},
"body":
<#assign nodes=roots>
<#assign idx=0>
[{<#list nodes as n><#if idx&gt;0>,</#if>"id":"${n.id}","name":"${escape(n.name)}","type":"${n.type}","checked":${n.dataMap.CHECKED},"grant_type":${n.dataMap.GRANT_TYPE!-1}<#if n.children?exists><@subTree childNodes=n.children></@subTree></#if><#assign idx=idx+1></#list>}]
<#macro subTree childNodes><#assign index=0>,"nodes":[<#list childNodes as child><#if index&gt;0>,</#if>{"id":"${child.id}","name":"${escape(child.name)}","type":"${child.type}","checked":${child.dataMap.CHECKED},"grant_type":${child.dataMap.GRANT_TYPE!-1}<#if  child.children?exists><@subTree childNodes=child.children></@subTree></#if>}<#assign index=index+1></#list>]</#macro>
}
