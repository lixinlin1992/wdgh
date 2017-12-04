<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
<head>
<title>数据源测试</title>
<jsp:include page="/pages/framework/base.jsp"/>

<script type="text/javascript">
$(function(){
    //装载数据源下拉框
    CORE.loadSelect("TABLE_SELECT","DS_TABLES",{});
	//绑定数据表选择事件
	$("#TABLE_SELECT").bind("change", function(){showFields();});
	//绑定PDM解析事件
	$("#PDM_SAX").bind("click", function(){sax();});
	
});
var Opts = {
	title : "请稍后",
	width : "350px", 
	height : "180", 
	modal : true
};
var t = 0;
function showFields(){
	if(document.getElementById("TABLE_SELECT").value!=""){
		CORE.request("DS_TABLE_FIELDS",{data:"Id="+document.getElementById("TABLE_SELECT").value+"&ftl=_ftl"},function(data){
			var items = data.item;
			$("#cols_name").empty();
			$("#search_name").empty();
			for(var i=0;i<items.length;i++){
				t++;			
				$("#cols_name").append("<tr id=\"c"+t+"\"><td>"+
								"<input type='text' name='COL_NAME' value='"+items[i].name+"'></td>"+
								"<input type='hidden' name='COL_CODE' value='"+items[i].code+"'>"+
								"<input type='button' value='删除' onclick='del(\"c"+t+"\")'></td></tr>");
				$("#search_name").append("<tr id=\"t"+t+"\"><td>"+
								"<input type='text' name='search_name' value='"+items[i].name+"'><td>"+
								"<input type='hidden' name='search_code' value='"+items[i].code+"'>"+
								"<input type='hidden' name='search_type' value='"+items[i].type+"'>"+
								"<input type='button' value='删除' onclick='del(\"t"+t+"\")'></td></tr>");														
			}
		});
	}
}
function del(Id){
	$("#"+Id).remove();
}
function sax(){
	$("#panel").dialog(Opts);
	CORE.request("DS_PDM_PRASE",{data:"PDM_NAME="+document.getElementById("PDM_NAME").value},function(data){
					$("#panel").dialog("close");
		//			CORE.loadSelect("TABLE_SELECT","DS_TABLES",{});
					CORE.info("解析完成！");
				});
}
function doSubmit(form){
	CORE.submitForm("DS_CODE_GEN","TestForm",{},function(){CORE.info("生成完成！");});
}

</script>
</head>

<body>
<form name="TestForm" onsubmit="doSubmit(this);return false;">
<table align="center">
    <tr>
        <td  style="font-size:14;">输入PDM文件名:</td>
        <td><input name="PDM_NAME" id="PDM_NAME"><input type="button" id="PDM_SAX" value="解析PDM"></td>
    </tr>
    <tr>
        <td  style="font-size:14;">数据表格:</td>
        <td>
        	<select name="TABLE_ID" id="TABLE_SELECT">
        </td>
    </tr>
    <tr>
        <td style="font-size:14;" valign="top">展示列表的列名:</td>
        <td colspan="2" valign="top">
        	<table id="cols_name"></table>
        </td>
        <td style="font-size:14;" valign="top">查询表头</td>
        <td colspan="2" valign="top">
        	<table id="search_name"></table>
        </td>        
    </tr>
    <tr>
        <td colspan="2" align="center"  style="font-size:13;"><input type="submit" value="提交" class="btnfunctionout"></td>
    </tr>
</table>
</form>
<div id="panel" style="display:none;">加载PDM中。。。</div>
</body>
</html>