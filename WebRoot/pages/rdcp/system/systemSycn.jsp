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
	<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
	<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>
    <script type="text/javascript" src="scripts/common/ztree.help.js"></script>
	<script type="text/javascript">
	//初始化
	$(function(){	
		var listTables = function(msg){
			for(var i=0;i<msg.length;i++){
				var item = "<tr><td align='left'><input type='checkbox' name='tablenames' value='"+msg[i].code+"'/>" + msg[i].name +
				"</td><td align='right'>";
				if(msg[i].param.ds != "" && msg[i].param.ds != undefined)
					item += "<input type='button' value='选择' onclick='parent.openSyncSelect(\"${param.syscode}\",\""+msg[i].param.ds + "\",\"" + msg[i].code +"\")'/>" +
							"</td></tr>";
				else
					item += "</td></tr>";
	       		$("#tables").append(item);
				
				$("#synctable").append("<tr class='formRow'>" + 
									   "<td class='formLabel' valign='top'>"+msg[i].name+":</td>" +
	                                   "<td align='left' valign='top'>" +
	                                   "<ul id='"+msg[i].code+"' width='100%'></ul>" +	
	                                   "</td></tr>");
			}
		}	
		CORE.request("DS_SYSTEM_SYNC_TABLE",{data:""},listTables);	
	});	
	//发送请求
	function package(){
		var params = "syscode="+$("#syscode").val();
		$("#tables input[type='checkbox']").each(
			function(){
				if($(this).attr("checked")){
					params += "&tablenames="+$(this).val();
				}
			}
		);		
		
		$.each($("input[name=objId]"),function(n,val){
			params += "&objIds="+val.value;
		});	
			
		params += "&currunt="+ $("input[@type=radio][name=currunt][checked]").val();

		CORE.request("DS_SYSTEM_SYNC",{data:params},function(msg){
			parent.traceSyncResult(msg);
		});	
	}

	//添加功能节点
	var n = 0;
	function chooseObject(type,objId,objName){
		var isExsits = false;
		var newNode = type + " " + objId;
		$.each($("input[name=objId]"),function(n,val){
			if(val.value == newNode){
				isExsits = true; 
			}
		});
		if(isExsits)
			return;  
		$("#"+type).append("<li id='_"+ n +"' style='float:left;padding-left:5px;'>" +
						"<input type='hidden' name='objId' value='"+newNode+"'/>" + 
						objName + "&nbsp;<a href='javascript:void(0);' style='color:red;' onclick='deleteObj("+n+")'>删除</a>.</li>");
		n++;
	}
	
	function deleteObj(divNum){
		$("#_"+divNum).remove();
	}
	</script>
</head>
<body>
    <div class="modules">
        <form name="publishForm">
        	<input type="hidden" id="syscode" value="${param.syscode}"/>
	        <table width="100%" id="synctable">
	            <tr class="formRow">
	            	<td class="formLabel" valign="top" width="25%">配置数据来源:</td>
	            	<td class="formField" align="left" width="75%">
	            		<input type="radio" name="currunt" value="0" checked/>最新历史版本
	            		<input type="radio" name="currunt" value="1" />当前配置
	            	</td>
	            </tr>
	            <tr class="formRow">
	            	<td class="formLabel" valign="top">同步类型选择:</td>
	            	<td class="formField" align="left" valign="top">
	            		<table id="tables"></table>
	            	</td>
				</tr>
			</table>
		</form>
  	</div>
</body>
</html>