/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/
KindEditor.plugin('image', function(K) {
	var self = this;
	self.plugin.image = {
		'delete' : function() {
			self.plugin.getSelectedImage().remove();
			// [IE] 删除图片后立即点击图片按钮出错
			self.addBookmark();
		},
		'edit' : function() {
			var image = self.plugin.getSelectedImage();
			var src = image.attr("src");
			var title = image.attr("title");
			var width = image.attr("width");
			var height = image.attr("height");
			var $container = $("body");
			var html = "<div id=\"K_uploadDlg\" style=\"display:block;\"><div id=\"K_uploader\"></div><input type=\"hidden\" id=\"K_fileUrl\"/>" +
				"<table><tr><td>标题：</td><td colspan=\"3\"><input type=\"text\" id=\"K_title\" style=\"width:300px;\"/></td></tr><tr><td>宽度：</td><td><input type=\"text\" id=\"K_width\" value=\"400\"/></td><td>高度：</td><td><input type=\"text\" id=\"K_height\" value=\"400\"/></td></tr></table></div>";
			$("div#K_uploadDlg").remove();
			$container.append(html);
			rdcp.uploader("K_uploader", {busiId: "newsId", busiType: "newsType"}, {
				onSuccess: function (file) {
					$("#K_fileUrl").val(file.url);
					$("#K_title").val(file.name);
					$("#K_uploader .SR_uploadHeader").hide();
				}
			});
			$("#K_uploadDlg").dialog(dlgOpts2);
			$("#K_uploader .SR_uploadHeader").hide();
			$("#K_title").val(title);
			$("#K_width").val(width);
			$("#K_height").val(height);
			$("#K_fileUrl").val(src);

			var html = "<li id='K_img_file' class='SR_uploadFileBox'><div class='SR_uploadFileBoxBtn'>" +
				"<div class='SR_imgName'><h2>"+title+"</h2></div><input class='SR_uploaderDel' type='button' onclick=\"javascript:void(0);\"></div><div class='SR_uploadImg'>";
			html += "<img src='"+src+"'/></div></li>";
			$("#K_uploader").find(".SR_uploadFileList ul").append(html);
		}
	}


	var dlgOpts = {
		title: "上传图片",
		width: "500",
		height: "380",
		parentwidth: true,
		modal: true,
		buttons: [
			{
				text: '确定',
				handler: function () {
					var fileUrl = $("#K_fileUrl").val();
					if(fileUrl == null||fileUrl == undefined){
						$.messager.alert("提示","请上传图片！","info");
						return false;
					}
					var title = $("#K_title").val();
					var width = $("#K_width").val();
					var height = $("#K_height").val();
					self.exec('insertimage', serverBasePath + fileUrl, title, width, height, 0, "");
					$("#K_uploadDlg").dialog("close");
				}
			},
			{
				text: '取消',
				handler: function () {
					$("#K_uploadDlg").dialog("close");
				}
			}
		]
	};
	var dlgOpts2 = {
		title: "修改图片",
		width: "500",
		height: "380",
		parentwidth: true,
		modal: true,
		buttons: [
			{
				text: '确定',
				handler: function () {
					var fileUrl = $("#K_fileUrl").val();
					if(fileUrl == null||fileUrl == undefined){
						$.messager.alert("提示","请上传图片！","info");
						return false;
					}
					var title = $("#K_title").val();
					var width = $("#K_width").val();
					var height = $("#K_height").val();
					var parent = self.plugin.getSelectedImage().parent();
					self.exec('editimage', fileUrl, title, width, height, 0, "");
					/*if(parent.name=="p")
						parent.remove();
					else
						self.plugin.getSelectedImage().remove();*/
					$("#K_uploadDlg").dialog("close");
				}
			},
			{
				text: '取消',
				handler: function () {
					$("#K_uploadDlg").dialog("close");
				}
			}
		]
	};
	var imgDlg = function() {
		var $container = $("body");
		var html = "<div id=\"K_uploadDlg\" style=\"display:block;\"><div id=\"K_uploader\"></div><input type=\"hidden\" id=\"K_fileUrl\"/>" +
			"<table><tr><td>标题：</td><td colspan=\"3\"><input type=\"text\" id=\"K_title\" style=\"width:300px;\"/></td></tr><tr><td>宽度：</td><td><input type=\"text\" id=\"K_width\" value=\"400\"/></td><td>高度：</td><td><input type=\"text\" id=\"K_height\" value=\"400\"/></td></tr></table></div>";
		$("div#K_uploadDlg").remove();
		$container.append(html);
		rdcp.uploader("K_uploader", {busiId: "newsId", busiType: "newsType"}, {
			onSuccess: function (file) {
				$("#K_fileUrl").val(file.url);
				$("#K_title").val(file.name);
				$("#K_uploader .SR_uploadHeader").hide();
			}
		});
		$("#K_uploadDlg").dialog(dlgOpts);
	};

	self.clickToolbar("image", imgDlg);
});
