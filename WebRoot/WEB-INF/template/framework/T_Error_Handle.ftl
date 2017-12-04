{
"header":{"code":"-1","message":"<#if message??><#if message?index_of("Exception")!=-1 >${escape(message?substring(message?index_of('Exception')+10))}<#else>${escape(message)}</#if><#else>服务端请求失败，请稍后再试</#if>"},
"body":"<#if message??><#if message?index_of("Exception")!=-1 >${escape(message?substring(message?index_of('Exception')+10))}<#else>${escape(message)}</#if><#else>服务端请求失败，请稍后再试</#if>"
}