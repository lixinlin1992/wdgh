<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
	<title>信息公告</title>
	<head>
		<jsp:include page="/pages/framework/base.jsp" />
		<link href="themes/default/css/style.css" rel="stylesheet"
			type="text/css">
		<link href="themes/default/css/public.css" rel="stylesheet"
			type="text/css" />
		<link href="themes/default/css/publicform.css" rel="stylesheet"
			type="text/css" />
		<script type="text/javascript" src="scripts/sunrise/common.js"></script>
		<script type="text/javascript" src="scripts/datePicker/WdatePicker.js"></script>
		<script type="text/javascript">
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
		var MainFormParams = {
				colNames : [ '录入时间','主题', '浏览次数'],
				colModel : [ {
					name : '录入时间',
					index : 'notice_date',
					width : 60,
					align : "center" 
				}, {
					name : '主题',
					index : 'title',
					width : 180,
					align : "center" ,
					sortable : false,
					formatter : titleT,
					formatoptions : {}
				}, {
					name : '浏览次数',
					index : 'visit_number',
					width : 30,
					align : "center" 
				}],
				caption : "信息公告",
				edit : true,
				multiselect:false,
				width:"100%",
				pager: "#pagerdt"
			};
			function titleT(cellvalue, options, rowObject){
				return "<a href='javascript:void(0);' onclick='showDetailNotice("+rowObject[3]+");'>"+cellvalue+"</a>";
			}
			function showDetailNotice(url)
			{
				 $("#frameInDialog").attr("src",'pages/service/notice/noticeShow.jsp?noticeId='+url);
  				 $("#NoticePanel").dialog(detailOpts);
  				 CORE.request("DS_FRAMEWORK_SERVICE_NOTICE_VISIT",{data:'noticeId='+url});
			}						
			$(function(){
				GRID.create("#listdt", "DS_FRAMEWORK_SERVICE_NOTICE_LIST",MainFormParams,"noticeForm");
			});
		</script>
	</head>

	<body style="padding: 0; margin: 0">
		<jsp:include page="/pages/navbar.jsp" />
		<div class="modules">
			<div class="barquery">
				<div class="barquerycenter">
					信息公告
				</div>
			</div>
			<div class="barquerycontent" style="padding: 10px;" align="center">
				<form name="noticeForm"
					onsubmit="GRID.reload('listdt');return false;">
				</form>
				<div style="width:98%;">
					<table id="listdt" style="margin: 0; padding: 0;"></table>
					<div id="pagerdt" style="margin: 0; padding: 0;"></div>
				</div>
				<div id="NoticePanel" style="display: none;height:100%">
					<iframe width="612" height="320" id="frameInDialog" frameborder="no"></iframe>
					<input type="hidden" id="noticeId" />
				</div>
			</div>
	</body>
</html>
