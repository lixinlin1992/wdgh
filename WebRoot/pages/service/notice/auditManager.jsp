<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
	<title>信息公告</title>
	<head>
		<jsp:include page="/pages/framework/base.jsp" />
		<link href="themes/default/css/public.css" rel="stylesheet"
			type="text/css" />
		<script type="text/javascript" src="scripts/sunrise/common.js"></script>
		<script type="text/javascript" src="scripts/datePicker/WdatePicker.js"></script>
		<script type="text/javascript">
		var params = {
				colNames : [ '录入时间', '主题', '录入人', '状态','操作'],
				colModel : [ {
					name : '录入时间',
					index : 'start_date',
					width : 80,
					align : "center" ,
					sortable : false
				}, {
					name : '主题',
					index : 'title',
					width : 180,
					align : "center" ,
					sortable : false
				},{
					name : '录入人',
					index : 'name',
					width : 30,
					align : "center" ,
					sortable : false
				}, {
					name : '状态',
					index : 'status_id',
					width : 30,
					align : "center",
					formatoptions : {},
					sortable : false
				}, {
					name : '操作',
					width : 30,
					align : "center",
					formatter : titleT,
					formatoptions : {},
					sortable : false
				}],
				caption : "浏览区",
				edit : true,
				multiselect:false,
				width:"100%",
				pager: "#pagerdtr"
			};
		var params2 = {
				colNames : [ '查阅者','查阅次数', '最后查阅时间'],
				colModel : [ {
					name : '查阅者',
					index : 'name',
					width : 100,
					align : "center" ,
					sortable : false
				}, {
					name : '查阅次数',
					index : 'num',
					width : 60,
					align : "center"
				}, {
					name : '最后查阅时间',
					index : 'visit_date',
					width : 100,
					align : "center" 
				}],
				caption : "查阅记录",
				edit : true,
				multiselect:false,
				width:600,
				parentwidth:true,
				pager: "#pagerdtr2"
			};
			$(function(){
				GRID.create("#listdt", "DS_FRAMEWORK_SERVICE_NOTICE_AUDIT_LIST", params,"auditAnnouncementForm");
				GRID.create("#listdt2", "DS_FRAMEWORK_SERVICE_NOTICE_AUDIT_LOOKBACK_LIST",params2,"noticeForm");
			});
				var dlgOpts = {
				title : "公告审核",
				width : "630px", 
				height : "450" , 
				buttons : {
					'确定':function(){
					if($("#YES").attr("checked"))
						$("#auditStatusidSelect").attr("value", "1");
					else if($("#WITHOUT").attr("checked"))
						$("#auditStatusidSelect").attr("value", "3");
					else
						$("#auditStatusidSelect").attr("value", "2");
						CORE.request("DS_FRAMEWORK_SERVICE_NOTICE_AUDIT_UPDATE",
							{data:"ftl=_ftl&noticeId="+document.getElementById("noticeId").value+"&statusid="+$("#auditStatusidSelect").val()});
							$("#dialog").dialog("close");
							GRID.reload("listdt");
					},
					'查阅记录':function(){showDialog2(document.getElementById("noticeId").value);},
					'返回':function(){$("#dialog").dialog("close");}
					}
			};
			var dlgOpts2 = {
				title : "查阅记录",
				width : "630px", 
				height : "450" , 
				buttons : {
					'返回':function(){$("#_dialog2").dialog("close");GRID.reload("listdt");}
					}
			};
			function titleT(cellvalue, options, rowObject){
				if(rowObject[3]=="未审批")
					return "<input name='btnfunction' class='grid_button' value='审核' type='button' onclick='showDialog(\""+rowObject[5]+"\")'/>";
				else
					return "<input name='btnfunction' class='grid_button' value='已审核' type='button' />";				
			}
			function showDialog(url)
			{
				var announcement_callback = function(msg){
				$("#title").html(msg.title);
				$("#name").html(msg.name);
				$("#start_date").html(msg.start_date);
				$("#content").html(unescape(msg.content));
				 $("#auditStatusidSelect").html(msg.status_id);
				$("#auditStatusidSelect").attr("value", "1");
				};
				CORE.request("DS_FRAMEWORK_SERVICE_NOTICE_AUDIT_EDIT",{data:'ftl=_ftl&noticeId='+url},announcement_callback);
				document.getElementById("noticeId").value = url;
				 $("#dialog").dialog(dlgOpts);
			}
			function showDialog2(temp)
			{
				$("#dialog").dialog("close");
				$("#_dialog2").dialog(dlgOpts2);
				$("#nId").val(temp);
				GRID.reload("listdt2");
			}
		</script>
	</head>
	<body style="padding: 0; margin: 0">
		<jsp:include page="/pages/navbar.jsp" />
		<div class="modules">
			<div class="barquery">
				<div class="barquerycenter">
					信息审核
				</div>
			</div>
			<center>
				<form name="auditAnnouncementForm"
					onsubmit="GRID.reload('listdt');return false;">
					<div class="barquerycontent" align="center">
						<table class="content_List">
							<tr align="center">
								<td align="right" class="contenttd" style="width: 80px;">
									审核情况：
								</td>
								<td align="left">
									<select name="statusid" id="statusidSelect">
										<option value="">
											--请选择--
										</option>
											<option value="0">
												待审核
											</option>
											<option value="1">
												审核通过
											</option>
											<option value="2">
												审核否决
											</option>	
											<option value="3">
												提前置为无效
											</option>										
									</select>
									&nbsp;&nbsp;
									<input Class="btnquery_mouseout"
										onmouseover="this.className='btnquery_mouseover'"
										onmouseout="this.className='btnquery_mouseout'" type="submit"
										value="">
								</td>
							</tr>
						</table>
					</div>
				</form>
				<div style="width:98%;">
							<table id="listdt" style="margin: 0; padding: 0;"></table>
							<div id="pagerdtr" style="margin: 0; padding: 0;"></div>
				</div>
				<div id="dialog" style="display: none;">
					<form name="auditForm">
						<input type="hidden" id="noticeId" />
						<select name="auditStatusid" id="auditStatusidSelect"
							style="width: 160px;display:none;">
								<option value="0">
									待审核
								</option>
								<option value="1">
									审核通过
								</option>
								<option value="2">
									审核否决
								</option>	
								<option value="3">
									提前置为无效
								</option>								
						</select>						
						<table align="center">
							<tr>
								<td>
									审核情况:
								</td>
								<td>
						<label><input type="radio" name="DUEL_TYPE" id="YES" checked>审核通过</label>
					
						<label><input type="radio" name="DUEL_TYPE" id="NOS">审核否决</label>
					
						<label><input type="radio" name="DUEL_TYPE" id="WITHOUT">提前设置为无效</label>
								</td>
							</tr>
						</table>
						<table align="center" width="600">
							<tr>
								<td align="center">
									<span id="title" name="title"></span>
									<hr>
								</td>
							</tr>
							<tr align="right">
								<td align="right">
									(通告发布者：
									<font color="#FF0000"><span id="name" name="name"></span>
									</font> 于
									<font color="#FF0000"><span id="start_date"
										name="start_date"></span> </font> 发布)
								</td>
							</tr>
							<tr>
								<td>
									<span id="content" name="content"></span>
								</td>
							</tr>
						</table>
					</form>
				</div>
				<form name="noticeForm">
					<input type="hidden" id="nId" name="nId" />
				</form>	
				<div id="_dialog2" style="display: none;" style="width:400px;"
					align="center">
					<table id="listdt2" style="margin: 0; padding: 0;"></table>
					<div id="pagerdtr2" style="margin: 0; padding: 0;"></div>
				</div>
			</center>
	</body>
</html>
