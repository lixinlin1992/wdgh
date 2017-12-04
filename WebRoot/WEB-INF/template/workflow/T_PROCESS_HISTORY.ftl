{
	"id":"${historyProcessInstance.id!}",
	"bussinessKey":"${historyProcessInstance.bussinessKey!}",
	"start_time":"${historyProcessInstance.start_time!}",
	"end_time":"${historyProcessInstance.end_time!}",
	"proc_name":"${historyProcessInstance.proc_name!}",
	"start_user":"${historyProcessInstance.start_user!}",
    "startEvent":{
    	"id":"${historyProcessInstance.startevent.id!}",
    	"assignee":"${historyProcessInstance.startevent.assignee!}",
    	"activityId":"${historyProcessInstance.startevent.activityId!}",
    	"activityName":"${historyProcessInstance.startevent.activityName!}",
    	"start_time":"${historyProcessInstance.startevent.start_time!}",
    	"end_time":"${historyProcessInstance.startevent.end_time!}",
    	"next":[
	    	<@generateChild children=historyProcessInstance.startevent.next></@generateChild>  	
    	]
	}
}
<#macro generateChild children>
<#assign index = 0/>
<#list children as child>
<#if index&gt;0>,</#if>
{	
   	"id":"${child.id!}",
   	"assignee":"${child.assignee!}",
   	"activityId":"${child.activityId!}",
   	"activityName":"${child.activityName!}",
   	"start_time":"${child.start_time!}",
   	"end_time":"${child.end_time!}",
	"next":[	
		<@generateChild children=child.next></@generateChild>
	]
}
<#assign index = index+1/>
</#list>
</#macro>
