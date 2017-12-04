<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%--
  User: 李嘉伟
  Date: 11-9-6
  Time: 15:28
     业务系统打包
--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<html>
<head>
    <jsp:include page="/pages/framework/base.jsp"/>
    <title>业务系统打包</title>
	<script type="text/javascript">
	//初始化
	$(function(){	
		var listHandlers = function(msg){
			for(var i=0;i<msg.length;i++){
	       		$("#handlers").append("<tr><td>"+
				"<input type='checkbox' name='handlers' value='"+msg[i]+"'/>" + msg[i] +
				"</td></tr>");
			}
		}	
		CORE.request("DS_PACKAGE_HANDLERS_LIST",{data:""},listHandlers);	
	});	
	//发送请求
	function package(){
		var params = "syscode="+$("#syscode").val();
		params += "&packageType="+$("#packageType").val();
		params += "&version_no="+$("#version_no").val();
		$("#handlers input[type='checkbox']").each(
			function(){
				if($(this).attr("checked"))
					params += "&handlers="+$(this).val();
			}
		);		
		params += "&filetype="+ $("input[@type=radio][name=filetype][checked]").val();
		CORE.goToDS("DS_SYSTEM_PACKAGE",params,null,'_blank');
	}
	</script>
</head>
<body>
    <div class="modules">
        <form name="publishForm">
        	<input type="hidden" id="syscode" value="${param.syscode}"/>
	        <table>
	            <tr class="formRow">
	            	<td class="formLabel" align="right">打包方式:</td>
	            	<td class="formField" align="left">
	            		<select id="packageType">
	            			<option value="1">手动</option>
	            		</select>
	            	</td>
				</tr>
	            <tr class="formRow">
	            	<td class="formLabel" valign="top">打包类型:</td>
	            	<td class="formField" align="left">
	            		<input type="radio" name="filetype" value="0" />开发平台格式
	            	</td>
	            </tr>
	            <tr class="formRow">
	            	<td class="formLabel" valign="top"></td>
	            	<td class="formField" align="left">
	            	<input type="radio" name="filetype" value="1" checked/>DMP(仅支持整个业务系统组件输出)
	            	</td>
	            </tr>
	            <tr class="formRow">
	            	<td class="formLabel" valign="top">版本号:</td>
	            	<td class="formField" align="left">
	            		<input type="text" id="version_no" style="width: 40px;"/>
	            	</td>
				</tr>
	            <tr class="formRow">
	            	<td class="formLabel" valign="top">打包组件选择:</td>
	            	<td class="formField" align="left">
	            		<table id="handlers"></table>
	            	</td>
				</tr>
			</table>
		</form>
  	</div>
</body>
</html>