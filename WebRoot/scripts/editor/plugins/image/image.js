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
		}
	}
	var dlgOpts = {
		title: "上传图片",
		width: "500",
		height: "350",
		parentwidth: true,
		modal: true,
		buttons: [
			{
				text: '确定',
				handler: function () {
					var div = $(".SR_uploadImg");
					var imgList = div.find("img");
					for(var i=0;i<imgList.length;i++){
						var src = imgList.attr("src");
					}
					var fileUrl = $("#fileUrl").val();
					self.exec('insertimage', serverBasePath + fileUrl, "", "", "", 0, "");
					$("#uploadDlg").dialog("close");
				}
			},
			{
				text: '取消',
				handler: function () {
					$("#uploadDlg").dialog("close");
				}
			}
		]
	};
	var imgDlg = function() {
		$("#uploader").html("");
		rdcp.uploader("uploader", {busiId: "newsId", busiType: "newsType"}, {
			onSuccess: function (file) {
				$("#fileUrl").val(file.url);
				$(".SR_uploadHeader").hide();
			}
		});
		$("#uploadDlg").dialog(dlgOpts);
	};

	self.clickToolbar("image", imgDlg);
});
