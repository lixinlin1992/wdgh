<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/"%>
<%
	String serverUrl = "http://" + request.getServerName() + ":"
			+ request.getServerPort() + request.getContextPath();
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
<title></title>

<head>
	<r:include resource="!rdcp/pages/listBase.jsp"/>
<script type="text/javascript" src="!property/base/~/scripts/upload.js"></script>
<script type="text/javascript">
	rdcp.ready(function()
	{
		rdcp.loadJS(
		{
			url : "scripts/upload/ajaxfileupload.js",
			onload : function()
			{
			}
		});
	});
	//上传的附件窗口
	var uploadFile =
	{
		title : "上传文件",
		id : "uploadFile",
		width : "550",
		height : "320",
		modal : true,
		buttons :
		[
		{
			text : '返回',
			handler : function()
			{
				$("#uploadFile").dialog("close");
			}
		} ]
	};
	/**
	 uploadFileInfo(order_id,table_name,div_name,pay);
	 order_id:对应主表的order_id
	 TABLE_NAME:唯一表示，用主表做区分。
	 div_name：页面布局需要上传后注入html的div的id
	 **/

	function uploadFileInfo(order_id, table_name, div_name)
	{
		rdcp.id("import_order_id").val(order_id);
		rdcp.id("table_name").val(table_name);
		rdcp.id("div_name").val(div_name);
		$("#uploadFile").dialog(uploadFile);
	}
	//上传附件 的方法
	function importFileInfo()
	{
		console.log($("#upfile").val());
		if ($("#upfile").val() == "")
		{
			$.messager.alert("提示","请选择需要上传的附件.","warning");
			return;
		} else
		{

			COMMON.upload(
			{
				url : "!property/base~ds/DS_IMPORT_FILE",
				//url : "!property/govermmentCenter/~/pages/upload_json.jsp",
				formName : 'importFileForm'
			}, function(data)
			{
				$("#uploadFile").dialog("close");
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

		rdcp.request("!property/base/~query/Q_FILE_INFO_LOOK", "id=" + order_id + "&table_name=" + table_name, function(data)
		{
			var div_name = $('#div_name').val();
			$("#" + div_name).empty();
			for ( var i = 0; i < data.body.rows.length; i++)
			{
				$("#" + div_name).append('<div id="updateInfo">' + '<div style="width:400px; float:left;"><font id="' + data.body.rows[i].cell[0] + '">' + data.body.rows[i].cell[1] + '&nbsp;&nbsp;<input type="hidden" id="filepath'+data.body.rows[i].cell[0]+'" value="'+data.body.rows[i].cell[2]+'"></font></div><div><a class="btn_leading_out"  id="upload_look' + data.body.rows[i].cell[0] + '" name="accessorieslook" onclick="uploadlookfile(' + data.body.rows[i].cell[0] + ')"   href="javascript:void(0)" >下载</a>' + '&nbsp;&nbsp;&nbsp;' + 
				'<a class="btn_delete" href="javascript:void(0)" id="uploadfiledel' + data.body.rows[i].cell[0] + '" name="accessoriesdelete" onclick="uploadfiledel(' + data.body.rows[i].cell[0] + ', \'' + order_id + '\', \'' + table_name + '\', \'' + div_name + '\')">删除</a>' + '</div></div>');
			}
		});

	}

	//查看文件
	function lookFile(order_id, table_name, div_name)
	{
		//$("#import_order_id").val(order_id);
		$("#table_name").val(table_name);
		//$("#div_name").val(div_name);
		rdcp.request("!property/base/~query/Q_FILE_INFO_LOOK", "id=" + order_id + "&table_name=" + table_name, function(data)
		{
			//var div_name = $('#div_name').val();
			$("#" + div_name).empty();
			for ( var i = 0; i < data.body.rows.length; i++)
			{
				$("#" + div_name).append('<div id="updateInfo">' + '<div style="width:400px; float:left;"><font id="' + data.body.rows[i].cell[0] + '">' + data.body.rows[i].cell[1] + '&nbsp;&nbsp;<input type="hidden" id="filepath'+data.body.rows[i].cell[0]+'" value="'+data.body.rows[i].cell[2]+'"></font></div><div><a class="btn_leading_out"  id="upload_look' + data.body.rows[i].cell[0] + '" name="accessorieslook" onclick="uploadlookfile(' + data.body.rows[i].cell[0] + ')"   href="javascript:void(0)" >下载</a>' + '&nbsp;&nbsp;&nbsp;' + '</div></div>');
			}
		});

	}

	//查看附件
	function uploadlookfile(id)
	{
		var file_path = "uploadfile" + $("#filepath" + id).val().replace("\\", "\/");
		file_path = file_path.replace("\\", "\/");
		window.open($("#url_").val() + "/!property/base~ds/DS_FRAMEWORK_FILE_DOWNLOAD?id=" + id);
	}
	//删除附件
	function uploadfiledel(id, order_id, table_name, div_name)
	{
		//var order_id = $("#import_order_id").val();
		//var table_name = $("#table_name").val();
		//var div_name = $("#div_name").val();
		$.messager.confirm('确认操作', '确定要删除附件？', function(r)
		{
			if (r)
			{
				rdcp.request("!property/base/~query/Q_FILE_INFO_DEL", "id=" + id, function(data)
				{
					lookAddOrderInfo(order_id, table_name, div_name);
				});
			}
		});

	}
</script>
</head>
<body>
	<div id="uploadFile" style="display: none;width: 450px; overflow: hidden; height: 200px;" >
		<form name="importFileForm" enctype="multipart/form-data" onSubmit="return false;">
			<!--页面布局的时候 传过来 div_name-->
			<input type="hidden" value="<%=serverUrl%>" id="url_" />
			<input name="div_name" id="div_name" type="hidden" />
			<table width="500px" border="0">
				<tr>
					<td class="title" style="width: 150px">请选择你要上传的附件：</td>
					<td class="title" style="width: 300px">
						<input name="file" id="upfile" type="file" />
						<input type="hidden" name="note" value="0" /> 
						<input type="hidden" id="import_order_id" name="import_order_id" /> 
						<input type="hidden" id="table_name" name="table_name" />
						<a class="btn_commit" onclick="importFileInfo()" href="javascript:void(0);">上传</a>
				    </td>
				</tr>
			</table>
		</form>
	</div>
</body>
</html>