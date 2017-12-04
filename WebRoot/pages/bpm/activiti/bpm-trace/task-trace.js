$(function() {
	CORE.request("DS_GET_CUR_ACTIVITY_TRACE_RESOURCE", {
		data : "taskId=" + $("#taskId").val()
	}, function(data) {
		$(document.body).append(data);
	});

	CORE.request("DS_GET_TASK_BEAN_DATA", {
		data : "taskId=" + $("#taskId").val()
	}, function(taskBean) {
		var deployId = taskBean.deploymentBean.deployId;
		var resourceName = taskBean.deploymentBean.diagramName;
		var processDiagramImgUrl = "framework.do?ds=DS_GET_PROCESS_RESOURCE&deployId=" + deployId + "&resourceName="
				+ resourceName;
		$("#processDiagramImg").attr("src", processDiagramImgUrl);
	});

});
