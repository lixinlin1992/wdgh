{"header":{"code":0,"message":"Load Bean Success"},"body":[<#assign idx=0><#if rowcount&gt;1></#if>
<#list rows as row><#if idx&gt;0>,</#if>{<#assign idx2=0>
    <#list row as cell><#if idx2&gt;0>,</#if>"${cell.key}":"${escape(cell.value!)}"<#assign idx2=idx2+1></#list>}
    <#assign idx=idx+1></#list><#if rowcount&gt;1></#if>]}