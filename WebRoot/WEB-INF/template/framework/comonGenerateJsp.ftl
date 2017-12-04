<#assign index=0/>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
  <title>${Mname}</title>
  <head>
	<jsp:include page="/pages/framework/base.jsp" />
	<link href="themes/default/css/public.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="scripts/sunrise/common.js"></script>
	<script type="text/javascript" src="scripts/datePicker/WdatePicker.js"></script>
	<script type="text/javascript" src="pages/generate/${Tname}/commonGenerateJs.js"></script>
	<script type="text/javascript">
	</script>
  </head>
  <body style="padding: 0; margin: 0">
	<jsp:include page="/pages/navbar.jsp" />
	<div class="modules">
  	    <div class="barquery">
	    <div class="barquerycenter">${Mname}</div>
		<div class="barqueryright"></div>
		<div class="barquerybtn"><input name="btn_addition" class="btn_additionout" value="添加" type="button" onclick='add();'/></div>	    
	</div>
	<!-- 查询控制 -->
	<div align="center">
		<form name="searchForm" onsubmit="GRID.reload('listdt');return false;">
			<div class="barquerycontent">
				<table class="content_List">
	 			    <#assign x = 0/>
					<#list Search as i>
	 			    <#if x=0><tr align="left"><#assign x=3/>
	 			    </#if>
				       <td align="right" class="contenttd">${i.text}</td>
				       <td align="left"><#if i.type=="0"><input type="text" name="${i.name}"></#if><#if i.type=="3"><select name="${i.name}" id="S_${i.name}"></#if><#if i.type=="2"><input type="text" name="${i.name}" class="Wdate"  onfocus="WdatePicker({dateFmt:'yyyy-MM-dd'})" readonly/></#if><#if i.type=="4"><input type="text" name="${i.name}"></#if></td><#assign x=x-1/>
				    <#if x=0></tr></#if>
				    </#list>
				    <tr><td><input Class="btnquery_mouseout" onMouseOver="this.className='btnquery_mouseover'" onMouseOut="this.className='btnquery_mouseout'" type="submit" value=""></td></tr>
				</table>
			</div>
		</form>
		<div>
			<table id="listdt" style="margin: 0; padding: 0;"></table>
			<div id="pagerdt" style="margin: 0; padding: 0;"></div>
		</div>
      </div>
	<!-- 编辑面板 -->
      <div id="panel" style="display: none;">
	      <form name="panelForm">
			<#list KEY as key_i>
			<input type="hidden" name="${key_i.item}">
			</#list>
			<#assign x = 0/>		    
		    <table align="center">
			<#list Fields_Cols as i>
			<#if x%2=0><tr>
			</#if> <td align="right">${i.text}</td>
			  <td><#if i.type=="0"><input type="text" name="${i.name}"></#if><#if i.type=="3"><select name="${i.name}" id="${i.name}"></#if><#if i.type=="2"><input type="text" name="${i.name}" class="Wdate"  onfocus="WdatePicker({dateFmt:'yyyy-MM-dd'})" readonly/></#if><#if i.type=="4"><input type="text" name="${i.name}"></#if></td><#assign x=x+1/>
			<#if x%2=0></tr></#if>
			</#list>
 		    </table>
		</form>
	</div>
	</body>
</html>