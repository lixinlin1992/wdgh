<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%--
  User: 李嘉伟
  Date: 12-13-2011
  Time: 15:28
  发起流程页面
  必须用数据源DS_REDIRECT_STARTPROCESS跳转后进入
  需要传递:activityId 发起后的活动
  		 bussinessKey 流程的关联业务主键
  		 procDef 流程定义KEY
  		 procType 流程定义的类型
  可传递: callback 执行完后执行的函数 eg: callback=function(){....} 
--%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
	<title>发起流程</title>
	<head>
		<jsp:include page="/pages/framework/base.jsp" />
		<link href="themes/default/css/style.css" rel="stylesheet"
			type="text/css">
		<link href="themes/default/css/public.css" rel="stylesheet"
			type="text/css" />
		<link href="themes/default/css/publicform.css" rel="stylesheet"
			type="text/css" />
		<script type="text/javascript" src="scripts/sunrise/common.js"></script>
		<script type="text/javascript">
			//初始化
			$(function(){	
				//发起参数
				var config = {
					activityId:"${param.activityId}",
					bussinessKey:"${param.bussinessKey}",
					callback:"${param.callback}"
				};
				//组织form参数
				config.data = $(document.StartDataForm).serialize();
				//没有传递流程定义的KEY则让用户选择流程
				if("${param.procDef}"=="" || "${param.procDef}"==undefined)
					_selectProcDef({type:"${param.procType}",select:function(id){
						config.procDefId = id;
						_startProcess(config);				
					}});
				else{
					config.procDef = "${param.procDef}";
					_startProcess(config);
				}				
			});
	</script>
	</head>

	<body style="padding: 0; margin: 0">
		<form name="StartDataForm">
<%
Enumeration keys = request.getParameterNames();
while(keys.hasMoreElements()){
    String key = (String) keys.nextElement();
    if("method".equals(key) || 
       "__d".equals(key) ||
       "_pageSize".equals(key) ||
       "procDef".equals(key) ||
       "activityId".equals(key) ||
       "bussinessKey".equals(key) ||
       "callback".equals(key) ||
       "ds".equals(key))
        continue;
    String[] paramArray = request.getParameterValues(key);
    if(paramArray == null || paramArray.length == 0)
        continue;
    for(int i=0;i<paramArray.length;i++){
        if(paramArray[i] == null || paramArray[i].trim().length() == 0)
            continue;
%>
<input type="hidden" name="<%=key %>" value="<%=paramArray[i] %>">
<%
    }
}
%>		
		</form>			 
		<jsp:include page="/pages/workflow/procActivitySelect.jsp"></jsp:include>
	</body>
</html>