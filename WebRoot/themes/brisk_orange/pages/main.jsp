<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
  <head>
    <base href="<%=basePath%>"/>
	 <title>左边</title>	 
<jsp:include page="/pages/framework/base.jsp"/>
<link href="themes/fire/css/common.css" rel="stylesheet" type="text/css" />
<link href="themes/fire/css/main.css" rel="stylesheet" type="text/css"/>
<link href="themes/fire/css/module.css" rel="stylesheet" type="text/css" />
<link href="themes/fire/css/searchtable.css" rel="stylesheet" type="text/css" />
<link href="themes/fire/css/form.css" rel="stylesheet" type="text/css" />
<link href="themes/fire/css/tablecontent.css" rel="stylesheet" type="text/css" />
<link href="themes/fire/css/btn.css" rel="stylesheet" type="text/css" />
<script type="text/javascript">
        function outsys(){
			//parent.outsys();
			CORE.confirm("确定退出?",function(){CORE.request("DS_USER_LOGOUT",{},function(data){window.top.location.href='<%=basePath%>';})});
        }
</script>
</head>

<body>
	

<!--内容部分End-->

</body>
</html>
