<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
	<title>公告录入</title>
	<head>
		<jsp:include page="/pages/framework/base.jsp" />
		<link href="themes/default/css/public.css" rel="stylesheet"
			type="text/css" />
		<script type="text/javascript" src="scripts/sunrise/common.js"></script>
		<script type="text/javascript">
		var params = {
				colNames : [ '录入时间', '主题', '状态', '录入人',"操作"],
				colModel : [ {
					name : '录入时间',
					index : 'start_date',
					width : 80,
					align : "center",
					sortable : false
				}, {
					name : '主题',
					index : 'title',
					width : 180,
					align : "center",
					sortable : false
				}, {
					name : '状态',
					index : 'status_id',
					width : 30,
					align : "center",
					sortable : false
				}, {
					name : '录入人',
					index : 'name',
					width : 30,
					align : "center",
					sortable : false
				}, {
					name : '操作',
					width : 60,
					align : "center",
					sortable : false,
					formatter : showAnnouncement
				}],
				caption : "我的公告列表",
				edit : true,
				multiselect:false,
				width:"100%",
				pager: "#pagerdt"
		};	
		var detailOpts = {
			title : "信息公告",
			width : "630px", 
			height : "450" , 
			buttons : {
				'返回':function(){
					$("#NoticePanel").dialog("close");
					GRID.reload("listdt");
				}
			}
		};	
		var NoticeDetailOpts = {
			title : "信息公告",
			width : "800px", 
			height : "470" , 
			buttons : {
				'返回':function(){
					$("#NoticeDetailPanel").dialog("close");
				},
				'保存':function(){
					document.getElementById("addInDialog").contentWindow.doUpload();
					$("#NoticeDetailPanel").dialog("close");
				}				
			}
		};	
		var NoticeDetailEditOpts = {
			title : "信息公告",
			width : "800px", 
			height : "470" , 
			buttons : {
				'返回':function(){
					$("#NoticeDetailPanel").dialog("close");
				},
				'保存':function(){
					document.getElementById("addInDialog").contentWindow.updateNotice();
					$("#NoticeDetailPanel").dialog("close");
				}				
			}
		};						
		function showAnnouncement(cellvalue, options, rowObject){
			if(rowObject[2]=="待审核")
				return "<input name='btnfunction' class='grid_button' value='预览' type='button' onclick='show(\""+cellvalue+"\")'/>"+
					"<input name='btnfunction' class='grid_button' value='修改' type='button' onclick='edit(\""+cellvalue+"\")'/>";
			else
				return "<input name='btnfunction' class='grid_button' value='预览' type='button' onclick='show(\""+cellvalue+"\")'/>"+
					"<input name='btnfunction' class='grid_button' value='撤销' type='button' onclick='remove(\""+cellvalue+"\")'/>";		
		}	
		function show(noticeId){
			 $("#frameInDialog").attr("src",'pages/service/notice/noticeShow.jsp?noticeId='+noticeId);
  			 $("#NoticePanel").dialog(detailOpts);		
		}	
		function edit(noticeId){	
   		    $("#addInDialog").attr("src","pages/service/notice/noticeEdit.jsp?noticeId="+noticeId);		
			$("#NoticeDetailPanel").dialog(NoticeDetailEditOpts);				
		}
		function remove(noticeId){
			CORE.confirm("确认撤销公告？",function(){
				CORE.request("DS_FRAMEWORK_SERVICE_NOTICE_MAN_DEL",{data:"noticeId="+noticeId},function(data){
					CORE.info("撤销成功");
					GRID.reload("listdt");
				});
			});
		}	
		function add(){
   		    $("#addInDialog").attr("src","pages/service/notice/noticeAdd.jsp");		
			$("#NoticeDetailPanel").dialog(NoticeDetailOpts);
		}
	
		$(function(){
			GRID.create("#listdt", "DS_FRAMEWORK_SERVICE_NOTICE_MAN_LIST", params,"myNoticeForm");			
		});
		function reflesh(){
			GRID.reload("listdt");
		}
		</script>
	</head>
	<body style="padding: 0; margin: 0">
		<jsp:include page="/pages/navbar.jsp" />
		<div class="modules">
			<div class="barquery">
				<div class="barquerycenter">
					公告录入
				</div>
				<div class="barquerybtn">
					<input type="button" value="添加" class="btnfunctionout"	onclick="add()">
				</div>
			</div>
		</div>	
		<form name="myNoticeForm"></form>
		<!-- 表格所在 -->
		<center>
			<table id="listdt" style="margin: 0; padding: 0;"></table>
			<div id="pagerdtr" style="margin: 0; padding: 0;"></div>
		</center>		
			<!-- 公告面板 -->
			<div id="NoticeDetailPanel" style="display: none;height:100%">
				<iframe width="100%" height="100%" id="addInDialog" frameborder="no"></iframe>
			</div>
			<div id="NoticePanel" style="display: none;height:100%">
				<iframe width="612" height="320" id="frameInDialog" frameborder="no"></iframe>
				<input type="hidden" id="noticeId" />
			</div>		
	</body>
</html>		