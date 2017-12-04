<%--
User: Larry
--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" import="java.util.*" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>客户日常拜访</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <r:include resource="!rdcp/pages/mbase.jsp"/>
    <script type="text/javascript" src="!szbo/base/scripts/upload.js"></script>
    <link href="!szbo/phone/~/css/moblieIndex.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript">
    
			var params = {
			    fitColumns: false,
			    columns: [
			        [ 
			         {field: 'opt', title: '操作', width: 140, align: 'center',
			             formatter: function(value, rec, index) {
			             	
			             	var f = 
			 					'<a class="btn_view"  href="javascript:void(0);" onclick="showProfile(\''+ rec.VISITID + '\');">查看附件</a> '+
			 					'<a class="btn_edit"  href="javascript:void(0);" onclick="addVisitComment(\''+ rec.VISITID + '\',\''+ rec.CUSTCODE + '\');">评论</a> ';
			                 return f;
			             }
			         },
			         {field: 'VISITID', title: '记录ID', sortable: true, align: 'left', width: 120,hidden:true},
			         {field: 'CUSTCODE', title: '客户编码', sortable: true, align: 'left', width: 120,hidden:true},
			         {field: 'INTIME', title: '录入时间', sortable: true, align: 'left', width: 120},
			            {field: 'COMNAME', title: '客户名称', sortable: true, align: 'left', width: 150},
			            {field: 'VISITTIME', title: '拜访时间', sortable: true, align: 'left', width: 120},
			            {field: 'ACTIVITY', title: '关怀活动', sortable: true, align: 'left', width: 120},
			            {field: 'HISTIME', title: '参加次数', sortable: true, align: 'left', width: 120},
			            {field: 'VISITMAN', title: '拜访人员', sortable: true, align: 'left', width: 120},
			            {field: 'VISITJOB', title: '拜访人职务', sortable: true, align: 'left', width: 120},
			            {field: 'VISITCONN', title: '拜访人联系方式', sortable: true, align: 'left', width: 120},
			            {field: 'VISITCONT', title: '拜访内容', sortable: true, align: 'left', width: 120}
			          
			            
			        ]
			    ]
			};
			
			rdcp.ready(function () {
				rdcp.loadJS(
						{
							url : "scripts/upload/ajaxfileupload.js",
							onload : function()
							{
							}
						});
				
				var opt = $("#opt").val();
				
				if(opt!=0){
					$("#formdiv").show();
					$("#btndiv").show();
					rdcp.request('!szbo/busiForward/~query/Q_VISIT_SEQ', "", function (data) {
					
						if($("#pushType").val()=='0'){
							 $("#addvisitid").val(data.body['rows'][0]['ID']);
						}else{
							$("#addvisitid").val($("#pushType").val());//把之前的序列赋值给之前的控件
						}
				       
				    });
					rdcp.request('!szbo/busiForward/~query/Q_VISIT_HISTIME', {'custcode':$("#custcode").val()}, function (data) {
				        $("#histime").val(data.body['rows'][0]['NUM']);
				        $("#histime").attr("readonly","true");
				    });
					  rdcp.dropdown2("activity", '!szbo/busiForward/~query/Q_ACTIVITY_SELECT', {loadComplete: function () {
				    }});
					  //加载信号强度下拉框
					    rdcp.dropdown2("wifilevel", '!szbo/busiManage/~query/Q_COMMON_GET_SELECT?code_table=CUS_VISIT_REC&code_field=WIFILEVEL', {loadComplete: function () {
					    }});
				}
				var date = new Date();
				var year = date.getFullYear();
				var month = date.getMonth()+1;
				if(month<10){
					month="0"+month;
				}
				var day=date.getDate();
				var datestr = year+"-"+month+"-"+day;
				$('#visittime').val(datestr);
				$('#visittime').attr("readonly","true");
				$("#businame").attr("readonly","true");
				   $("#add").show();
				$("#cancel").show();
				rdcp.grid('listvisit', '!szbo/busiForward/~query/Q_VISIT_LIST', 'visitListForm', params);
				
				
				/**
					add by wul
					提醒是否确定开始拜访
					动作:是,记录拜访开始时间;否,退出拜访,返回客户列表
					Q_ADD_VISIT
					pushType:0没有开始拜访,1已经开始拜访
				**/
				if($("#pushType").val()=='-1'){
					$.messager.confirm('确认操作', '确定要开始拜访?<br>(拜访结束后,在本地理位置操作结束拜访)', function (r) {
				        if(r){
				        	//alert("A");
				        	rdcp.request('!szbo/phone/~query/Q_UPDATE_VISIT_DATE?activity=-1', rdcp.id("addVisitForm").serialize(), function (data) {
				                if (data.header.code == 0) {
				                } else {
				                    $.messager.alert('提示', '开始失败', 'error');
				                }
				            });
				        }else{
				        	//alert("B");
				        	history.go(-1); 
				        }
				    });
				}
				
				
			});
			function cancelAdd(){
				CloseTab("addVisit","新增拜访记录");
			}
			
			var fileWin={
					title : "附件",
					width : "300", 
					height : "250" ,
					modal : true
			};
			function showProfile(id){
				lookFile(id,'CUS_VISIT_TABLE','profilediv');
				$("#profilediv").show();
				$("#profilediv").dialog(fileWin);
			}
			function showFileNames(){
				lookAddOrderInfo($("#addvisitid").val(),'CUS_VISIT_TABLE','addOrderInfo');
			}
			
			function addVisitComment(visitid,custid){
				var tabId = "addVisitComment";//tab唯一性
				var title = "评论客户拜访";//选项卡标题名字
				var url = "!szbo/busiForward/pages/addVisitComm.jsp?visitid="+visitid+"&cust_code="+custid;
				OpenTab(tabId, title, url);//新建Tab
			}
			
			function uploadf(){
				uploadFileInfo($("#addvisitid").val(),'CUS_VISIT_TABLE','addOrderInfo');
			}
			function addVisit(){
				
				if($("#visitname").val()==""){
					$.messager.alert('提示', '请输入拜访人员！', 'info');
					return;
				}
				if($("#nettype").val()==""){
					$.messager.alert('提示', '请选择网络类型！', 'info');
					return;
				}
				
				if($("#wifiaddr").val()==""){
					$.messager.alert('提示', '请填信号地址！', 'info');
					return;
				}
				if($("#visitcont").val()==""){
					$.messager.alert('提示', '请输入拜访内容！', 'info');
					return;
				}
				if($("#visitcont").val().length<20){
					$.messager.alert('提示', '拜访内容不得少于20个字！', 'info');
					return;
				}
						//是否可以结束拜访,设置了时间间隔  武汉暂时去除限制
						rdcp.request('!szbo/phone/~query/Q_IS_ADD_VISIT', rdcp.id("addVisitForm").serialize(), function (data) {
				        		if(1==1){
				        			//原来的代码
				        			rdcp.request('!szbo/phone/~query/Q_ADD_VISIT?activity=-1', rdcp.id("addVisitForm").serialize(), function (data) {
										 if(data.header.code==0){
								       		$.messager.alert('提示', '新增拜访记录成功!', 'info',function(){
								       			window.location = "!whBusiness/wechat/~/pages/customerVisitList.jsp";
								       		});
								       		rdcp.grid.reload('listvisit');
									        rdcp.request('!szbo/busiForward/~query/Q_VISIT_SEQ', "", function (data) {
										        $("#addvisitid").val(data.body['rows'][0]['ID']);
										    });
									       rdcp.request('!szbo/busiForward/~query/Q_VISIT_HISTIME', {'custcode':$("#custcode").val()}, function (data) {
										        $("#histime").val(data.body['rows'][0]['NUM']);
										        $("#histime").attr("readonly","true");
										    });
									       $("#visitname").val("");
									       $("#visitcont").val("");
									       $("#visitjob").val("");
									       $("#visitconn").val("");
									 	}
									});
									//原来的代码
				        		}else{
				        			$.messager.alert('提示', '距离开始拜访时间间隔小于15分钟,暂不能提交拜访记录!', 'info',function(){
												//window.location = "!szbo/phone/~/pages/customerVisitList.jsp";
								    });
				        		}
				        });
			}
			
			
			//上传附件 的方法
			function importFileInfo()
			{
				rdcp.id("import_order_id").val($("#addvisitid").val());
				rdcp.id("table_name").val('CUS_VISIT_TABLE');
				rdcp.id("div_name").val('addOrderInfo');
				//alert($("#upfile").val());
				//console.log($("#upfile").val());
				if ($("#upfile").val() == "")
				{
					$.messager.alert("提示","请选择需要上传的附件.","warning");
					return;
				} else
				{
					rdcp.mask($("#mask"),'文件上传中');
					COMMON.upload(
					{
						url : '!szbo/base~ds/DS_IMPORT_FILE',
						formName : 'addVisitForm'
					}, function(data)
					{
						rdcp.unmask($("#mask"));
						$.messager.alert('提示', '文件上传成功!', 'info');
						lookAddOrderInfo($("#import_order_id").val(), $("#table_name").val(), $("#div_name").val());
					});
				}
			}
			//添加需求但 填充页面 
			function lookAddOrderInfo(order_id, table_name, div_name)
			{
				$("#import_order_id").val(order_id);
				$("#table_name").val(table_name);
				$("#div_name").val(div_name);
				rdcp.request("!szbo/base/~query/Q_FILE_INFO_LOOK", "id=" + order_id + "&table_name=" + table_name, function(data)
				{
					var div_name = $('#div_name').val();
					$("#" + div_name).empty();
					for ( var i = 0; i < data.body.rows.length; i++)
					{
						$("#" + div_name).append('<div class="imgInformationBox" id="updateInfo">' + '<div class="imgInformation"><font id="' + data.body.rows[i].cell[0] + '">' + data.body.rows[i].cell[1] + '&nbsp;&nbsp;<input type="hidden" id="filepath'+data.body.rows[i].cell[0]+'" value="'+data.body.rows[i].cell[2]+'"></font></div><div class="imgTools"><a class="btn_delete" href="javascript:void(0)" id="uploadfiledel' + data.body.rows[i].cell[0] + '" name="accessoriesdelete" onclick="uploadfiledel(' + data.body.rows[i].cell[0] + ')">删除</a>' + '</div></div>');
					}
				});
			
			}
			
			//删除附件
			function uploadfiledel(id)
			{
				var order_id = $("#import_order_id").val();
				var table_name = $("#table_name").val();
				var div_name = $("#div_name").val();
				$.messager.confirm('确认操作', '确定要删除附件？', function(r)
				{
					if (r)
					{
						rdcp.request("!szbo/base/~query/Q_FILE_INFO_DEL", "id=" + id, function(data)
						{
							lookAddOrderInfo(order_id, table_name, div_name);
						});
					}
				});
			
			}
			    
    </script>
</head>
<body>

	<%
	  SysPUser user = (SysPUser) session.getAttribute(LoginUserSession.UserSession_Key);
    String userName = user.getName();
    String deptName = user.getDept_path();
	%>
<div class="SR_Form">
	<!--手机页面标题Begin-->
	<div class="SR_title">
		<div class="SR_titleBg">
			<a class="leftBtn" href="javascript:history.go(-1);">返回</a>
			<h1>商机管理系统</h1>
			<a class="rightBtn" href="javascript:history.go(-2);">首页</a>
		</div>
	</div>
	<!--手机页面标题Begin-->
	<!--页面表单Begin-->
	<div class="SR_moblieForm">
		<div class="SR_moblieFormBox">
		<span class="title" style="color:red"><font size="3">提示：请在拜访结束后填写拜访信息</br></font></span>
		<form name="addVisitForm" id="addVisitForm" method="post" enctype="multipart/form-data" onsubmit="return false;">
			<ul>
				<li class="SR_moblieFormList">
					<table cellspacing="0">
						<tr>
							<td class="listTitle"><span>客户名称</span><span>|</span></td>
							<td class="listContent">
								<!-- apple wxcode-->
								<input type="hidden" name="wxcode" id="wxcode" value=""/> 
								<input type="hidden" name="address" id="address" value=""/>
								<input type="hidden" name="pushType" id="pushType" value="<%=request.getParameter("pushType") %>"/> 
								<input type="hidden" name="custcode" id="custcode" value="<%=request.getParameter("custcode") %>"/> 
								<input type="text" name="custname" id="custname" value="<%=request.getParameter("custname") %>" readonly="readonly"/>
								<input type="hidden" id="addvisitid" name="addvisitid" value=""/>
							</td>
						</tr>
					</table>
				</li>
				<li class="SR_moblieFormList">
					<table cellspacing="0">
						<tr>
							<td class="listTitle"><span>跟进时间</span><span>|</span></td>
							<td class="listContent"><input type="text" name="visittime" id="visittime" readonly="readonly" value=""/></td>
						</tr>
					</table>
				</li>
				<li class="SR_moblieFormList">
					<table cellspacing="0">
						<tr>
							<td class="listTitle"><span>被拜访人</span><span>|</span></td>
							<td class="listContent"><input type="text" name="visitname" id="visitname"/></td>
						</tr>
					</table>
				</li>
				<li class="SR_moblieFormList">
					<table cellspacing="0">
						<tr>
							<td class="listTitle"><span>网络类型</span><span>|</span></td>
							<td>
								<input type="radio" name="nettype" value="1" />2G
								<input type="radio" name="nettype" value="2" checked="checked" />3G
								<input type="radio" name="nettype" value="3" />4G
							</td>
						</tr>
					</table>
				</li>
				<li class="SR_moblieFormList">
					<table cellspacing="0">
						<tr>
							<td class="listTitle"><span>信号强度</span><span>|</span></td>
							<td class="listContent">
								<select id="wifilevel" name="wifilevel">
									
								</select>
							</td>
						</tr>
					</table>
				</li>
				<li class="SR_moblieFormList">
					<table cellspacing="0">
						<tr>
							<td class="listTitle"><span>信号地址</span><span>|</span></td>
							<td class="listContent"><input type="text" name="wifiaddr" id="wifiaddr"/></td>
						</tr>
					</table>
				</li>
				<li class="SR_moblieFormListTextarea">
					<table cellspacing="0">
						<tr>
							<td class="listTitle">拜访内容：</td>
						</tr>
						<tr>
							<td class="listContent" colspan="2"><textarea id="visitcont" name="visitcont"></textarea></td>
						</tr>
					</table>
				</li>
				<li id="mask">
					<div class="file-box"> 
						<input name="div_name" id="div_name" type="hidden" />
						<table class="uploadTable" width="100%">
							<tr>
								<td>
									<input type='text' name='textfield' id='textfield' class='txt' /> 
								</td>
								<td width="83px">
									<input type="hidden" name="note" value="0" /> 
								    <input type="hidden" id="import_order_id" name="import_order_id" /> 
									<input type="hidden" id="table_name" name="table_name" /> 
									
									<input type='button' class='btnSelect' value='选择文件' />
									<input type="file" name="file" id="upfile" class="file" size="28" onchange="document.getElementById('textfield').value=this.value"/> 
								</td>
								<td width="83px">
									<a class="btnUpload" onclick="importFileInfo()" href="javascript:void(0);">上传文件</a>
								</td>
							</tr>
						</table>
						<div id="addOrderInfo"></div>
					</div> 
				</li>
				<li  class="SR_moblieFormListBtn">
					<table>
						<tr>
							<td><a class="moblieBtn" href="javascript:void(0);" onclick="addVisit();">确定</a></td>
							<td class="space"></td>
							<td><a class="moblieBtn" href="javascript:history.go(-1);">取消</a></td>
						</tr>
					</table>
				</li>
			</ul>
			</form>
		</div>
	</div>
	<!--页面表单End-->
	
	
	<div class="SR_searchTableBox" align="center" style="display:none">
			<form name="visitListForm" id="visitListForm" method="post">
				<table>
					<tr>
					<td>
				<input type="hidden"  name="ccode" id="ccode" value="<%=request.getParameter("cust_code") %>"
							class="SR_pureInput" />
				<input type="hidden"  name="opt" id="opt" value="<%=request.getParameter("opt") %>"
							class="SR_pureInput" />
						
					</td></tr>
				</table>
				</form>
				</div>
</div>
</body>
</html>