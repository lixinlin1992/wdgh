<#assign index=0/>
[
<#list resultSet.rows as i>
    <#if index&gt;0>,</#if>
   {
        "id":"${i.id_!}",
        "deal_user":"${i.deal_user!}",
        "start_time":"${i.start_time_!}",
        "end_time":"${i.end_time_!}",
        "duration":"${i.duration_!}",
        "delete_reason":"${i.delete_reason_!}"
    }
    <#assign index=index+1/>
</#list>
]