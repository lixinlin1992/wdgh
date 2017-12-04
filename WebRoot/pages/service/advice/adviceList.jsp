<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
	<title>投诉与建议</title>
	<head>
		<jsp:include page="/pages/framework/base.jsp" />
		<link href="themes/default/css/public.css" rel="stylesheet"
			type="text/css" />
		<script type="text/javascript" src="scripts/sunrise/common.js"></script>
		<script type="text/javascript" src="scripts/datePicker/WdatePicker.js"></script>
		<script type="text/javascript">
		var params = {
				colNames : [ '投诉人','投诉标题','投诉日期', '投诉类型', '回复','操作'],
				colModel : [ {
					name : '投诉人',
					index : 'name',
					width : '10%',
					align : "center" 
				}, {
					name : '投诉标题',
					index : 'title',
					width : '20%',
					align : "center" ,
					sortable : false
				}, {
					name : '投诉日期',
					index : 'advice_date',
					width : '15%',
					align : "center" ,
					sortable : false
				}, {
					name : '投诉类型',
					index : 'type_name',
					width : '10%',
					align : "center" ,
					sortable : false
				}, {
					name : '回复',
					index : 'reply_count',
					width : '10%',
					align : "center" ,
					sortable : false
				}, {
					name : '操作',
					width : '15%',
					align : "center" ,
					formatter : createButton,
					formatoptions : {},
					sortable : false
				}],
				caption : "浏览区",
				edit : true,
				multiselect:false,
				width:"100%",
				pager: "#pagerdt"
			};
		var params2 = {
				colNames : [ '回复内容','回复人','回复时间','操作'],
				colModel : [ {
					name : '回复内容',
					index : 'content',
					width : 10,
					align : "center" ,
					sortable : false
				}, {
					name : '回复人',
					index : 'name',
					width : 2,
					align : "center" ,
					sortable : false
				}, {
					name : '回复时间',
					index : 'reply_date',
					width : 2,
					align : "center" 
				}, {
					name : '操作',
					width : 2,
					align : "center" ,
					sortable : false,
					formatter : replyButton
				}],
				caption : "回复",
				width:"100%",
				pager: "#pagerdtr2",
				parentwidth:true
			};			
			function createButton(cellvalue, options, rowObject){
				return "<input name='btnfunction' class='grid_button' value='详情' type='button' onclick='show(\""+cellvalue+"\")'/>"+
						"&nbsp;&nbsp;<input name='btnfunction' class='grid_button' value='删除' type='button' onclick='delAdvice(\""+cellvalue+"\")'/>";
			}
			function replyButton(cellvalue, options, rowObject){
				return "&nbsp;&nbsp;<input name='btnfunction' class='grid_button' value='删除' type='button' onclick='delReply(\""+cellvalue+"\")'/>";
			}			
			function delAdvice(delId)
			{
				CORE.confirm("确定要删除吗？",function(){
					CORE.request("DS_FRAMEWORK_SERVICE_ADVICE_DEL",{data:'ftl=_ftl&adviceId='+delId},function(data){
						CORE.info("删除成功!");
						GRID.reload("listdt");
					});
				});
			}
			function delReply(delId)
			{
				CORE.confirm("确定要删除吗？",function(){
					CORE.request("DS_FRAMEWORK_SERVICE_ADVICE_REPLY_DEL",{data:'ftl=_ftl&replyId='+delId},function(data){
						CORE.info("删除成功!");
						GRID.reload('reply');
					});					
				});
			}			
			function show(adviceId)
			{
				var advice_callback = function(msg){
					$("#advice_userName").html(msg.userName);
					$("#advice_date").html(msg.date);
					$("#advice_title").html(msg.title);
					$("#advice_content").html(msg.content);
					$("#advice_note").html(unescape(msg.note));
				};
				CORE.request("DS_FRAMEWORK_SERVICE_ADVICE_SHOW",{data:'ftl=_ftl&adviceId='+adviceId},advice_callback);			
				$("#adviceId").val(adviceId);
				GRID.reload('reply');
				$("#_adviceInfoDialog").dialog(adviceInfoDialog);
			}
			var adviceInfoDialog = {
				title : "投诉与建议详情",
				width : "800px", 
				height : "480" ,
				buttons : {
					'回复':function(){
						var content = $("#content").val();
						alert(content);
						alert(content.length);
						if($("#content").val().length>1024)
							CORE.info("输入内容不得大于1024个字符");
						else
						CORE.request("DS_FRAMEWORK_SERVICE_ADVICE_REPLY_ADD",{data:'ftl=_ftl&adviceId='+$("#adviceId").val()+
							'&content='+$("#content").val()},
							function(){
								GRID.reload('reply');
								$("#content").val("");
								CORE.info("回复成功");
							});
						},
					'返回':function(){$("#_adviceInfoDialog").dialog("close");GRID.reload("listdt");}
				}
			}					
			$(function(){
				GRID.create("#listdt", "DS_FRAMEWORK_SERVICE_ADVICE_LIST", params,"adviceForm");
				CORE.loadSelect('type_id','DS_SYS_CODE_LABEL_VALUE',{data:'code_table=SYS_A_ADVICE&code_field=TYPE_ID'});
				GRID.create("#reply", "DS_FRAMEWORK_SERVICE_ADVICE_REPLY_LIST",params2,"replyForm");
			});					
		</script>
	</head>
	<body style="padding: 0; margin: 0">
		<jsp:include page="/pages/navbar.jsp" />
		<div class="modules">
			<div class="barquery">
				<div class="barquerycenter">
					投诉与建议
				</div>
			</div>
			<div align="center">
				<form name="adviceForm"
					onsubmit="GRID.reload('listdt');return false;">
					<div class="barquerycontent">
						<table class="content_List">
							<tr>
								<td align="right" class="contenttd" style="width: 80px;">
									从：
								</td>
								<td align="left" style="width: 150px;">
									<input type="text" name="start_date" id="start_date"
										onClick="WdatePicker()" class="Wdate">
								</td>
								<td align="right" class="contenttd" style="width: 80px;">
									至：
								</td>
								<td align="left" style="width: 150px;">
									<input type="text" name="end_date" id="end_date"
										onClick="WdatePicker()" class="Wdate">
								</td>
								<td align="right" class="contenttd" style="width: 100px;">
									投诉类型：
								</td>
								<td align="left">
									<select name="type_id" id="type_id">
										<option value="">
											--请选择--
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
							<div id="pagerdt" style="margin: 0; padding: 0;"></div>
				</div>
				<div id="_netDialog" style="display: none;">
					<form name="adviceNetForm">
						<table align="center">
							<tr>
								<td>
									所属地市：*** 所属区县：** 所属市场类型：*** 所属网络：***
								</td>
							</tr>
						</table>
						<table align="center">
							<tr>
								<td align="right">
									网点编号：
								</td>
								<td>
									<input type="text" style="width: 200px" name="id">
								</td>
								<td align="right">
									网点名称：
								</td>
								<td>
									<input type="text" style="width: 200px" name="name">
								</td>
							</tr>
							<tr>
								<td align="right">
									代码：
								</td>
								<td>
									<input type="text" style="width: 200px" name="code">
								</td>
								<td align="right">
									网点电话：
								</td>
								<td>
									<input type="text" style="width: 200px" name="telt">
								</td>
							</tr>
							<tr>
								<td align="right">
									联系人：
								</td>
								<td>
									<input type="text" style="width: 200px" name="contact">
								</td>
								<td align="right">
									手机号码：
								</td>
								<td>
									<input type="text" style="width: 200px" name="mobile_phone">
								</td>
							</tr>
							<tr>
								<td align="right">
									店主：
								</td>
								<td>
									<input type="text" style="width: 200px" name="owner">
								</td>
								<td align="right">
									营业时间：
								</td>
								<td>
									<input type="text" style="width: 200px" name="bussiness_time">
								</td>
							</tr>
							<tr>
								<td align="right">
									网络经理：
								</td>
								<td>
									<input type="text" style="width: 200px" name="uname">
								</td>
								<td align="right">
									服务商：
								</td>
								<td>
									<input type="text" style="width: 200px" name="sname">
								</td>
							</tr>
							<tr>
								<td align="right">
									网点类型：
								</td>
								<td>
									<input type="text" style="width: 200px" name="tname">
								</td>
								<td align="right">
									网点状态：
								</td>
								<td>
									<input type="text" style="width: 200px" name="status_name">
								</td>
							</tr>
							<tr>
								<td align="right">
									备注：
								</td>
								<td colspan=3>
									<textarea cols="69" rows="3" name="note"></textarea>
								</td>
							</tr>
							<tr>
								<td align="right">
									地址：
								</td>
								<td colspan=3>
									<textarea cols="69" rows="3" name="addr"></textarea>
								</td>
							</tr>
						</table>
					</form>
				</div>
				<div id="_serviceDialog" style="display: none;">
					<form name="adviceServiceForm">
						<table align="center">
							<tr>
								<td align="right">
									编号：
								</td>
								<td>
									<input type="text" style="width: 200px" name="id">
								</td>
							</tr>
							<tr>
								<td align="right">
									区域：
								</td>
								<td>
									<input type="text" style="width: 200px" name="area_name">
								</td>
							</tr>
							<tr>
								<td align="right">
									名称：
								</td>
								<td>
									<input type="text" style="width: 200px" name="name">
								</td>
							</tr>
							<tr>
								<td align="right">
									编码：
								</td>
								<td>
									<input type="text" style="width: 200px" name="code">
								</td>
							</tr>
							<tr>
								<td align="right">
									服务商地址：
								</td>
								<td>
									<input type="text" style="width: 200px" name="address">
								</td>
							</tr>
							<tr>
								<td align="right">
									联系人：
								</td>
								<td>
									<input type="text" style="width: 200px" name="contact">
								</td>
							</tr>
							<tr>
								<td align="right">
									电话：
								</td>
								<td>
									<input type="text" style="width: 200px" name="tele">
								</td>
							</tr>
							<tr>
								<td align="right">
									配送电话：
								</td>
								<td>
									<input type="text" style="width: 200px" name="fax">
								</td>
							</tr>
							<tr>
								<td align="right">
									邮箱：
								</td>
								<td>
									<input type="text" style="width: 200px" name="email">
								</td>
							</tr>
							<tr>
								<td align="right">
									备注：
								</td>
								<td>
									<input type="text" style="width: 200px" name="note">
								</td>
							</tr>
						</table>
					</form>
				</div>
				<div id="_adviceInfoDialog" style="display: none;">
					<table width=750px>
						<tr>
							<td align="left">
								<font color="#FF0000" size="3">投诉</font>
							</td>
							<td align="right">
								投诉人：
								<span id="advice_userName"></span> 投诉时间：
								<span id="advice_date"></span>
							</td>
						</tr>
					</table>
					<hr>
					<table>
						<tr>
							<td align="left">
								标题:
							</td>
							<td>
								<span id="advice_title"></span>
							</td>
						</tr>
						<tr>
							<td align="left">
								内容:
							</td>
							<td>
								<span id="advice_content"></span>
							</td>
						</tr>
						<tr>
							<td align="left">
								备注:
							</td>
							<td>
								<span id="advice_note"></span>
							</td>
						</tr>
					</table>
					<hr>
					<form name="replyForm">
						<input type="hidden" id="adviceId" name="adviceId" />
						<table id="reply" style="margin: 0; padding: 0;"
							style="width:400px;" align="center"></table>
						<div id="pagerdtr2" style="margin: 0; padding: 0;"></div>

						<table>
							<tr>
								<td>
									回复内容：
								</td>
								<td>
									<textarea cols="50" rows="5" name="content" id="content"></textarea>
								</td>
							</tr>
						</table>
					</form>
				</div>
			</div>
		</div>
	</body>
</html>
