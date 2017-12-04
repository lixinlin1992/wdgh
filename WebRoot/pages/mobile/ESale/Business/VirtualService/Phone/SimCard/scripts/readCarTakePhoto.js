/** 当用户点击蓝牙读取时调*/
function bluetoothRead() {
	$("#flag").val("0");
	check();
}

/**蓝牙读取成功时调用*/
function onReadIDCardFinish(bluetoothInfoStr) {
	unmask();

	try {
		if (bluetoothInfoStr != "{}") {

			var bluetoothInfo = $.parseJSON(bluetoothInfoStr);

			//2015-06-17 添加身份证读取失败信息获取
			if (bluetoothInfo.result != undefined && bluetoothInfo.result != 0) {
				alert(getReadCardResult(bluetoothInfo.result));
				if (bluetoothInfo.result == -1) {
					if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
						/*$("#btBox").css("display", "block");
						$("#shadeDiv").css("display", "block");*/
					}
				}
				return;
			}
			//var cardID=bluetoothInfo.cardno.substr(0,4)+"****"+bluetoothInfo.cardno.substr(14);
			$("#customer_name").val(bluetoothInfo.name).trigger('change');
			$("#cert_address").val(bluetoothInfo.address).trigger('change');
			$("#gov").val(bluetoothInfo.issuedat).trigger('change');
			$("#gender").val(bluetoothInfo.sex).trigger('change');
			$("#cert_number").val(bluetoothInfo.cardno).trigger('change');
			$("#nation").val(bluetoothInfo.nation).trigger('change');
			$("#born").val(bluetoothInfo.born).trigger('change');
			$("#picture").val(bluetoothInfo.picture).trigger('change');
			/*try {
				$("#device_name").val(bluetoothInfo.DeviceName).trigger('change'); //二合一设备型号
			} catch (err) {
				console.log("设备型号无法读取到");
				$("#device_name").val("").trigger('change');
			}*/

			if (bluetoothInfo.effecteddate.length != 10) {
				var date1 = bluetoothInfo.effecteddate;
				date1 = date1.substring(0, 4) + "-" + date1.substring(4, 6) + "-" + date1.substring(6, 8);
			} else {
				var date1 = bluetoothInfo.effecteddate;
				date1 = date1.substring(0, 4) + "-" + date1.substring(5, 7) + "-" + date1.substring(8, 10);
			}
			if (bluetoothInfo.expireddate.length != 10) {
				var date2 = bluetoothInfo.expireddate;
				date2 = date2.substring(0, 4) + "-" + date2.substring(4, 6) + "-" + date2.substring(6, 8);
			} else {
				var date2 = bluetoothInfo.expireddate;
				date2 = date2.substring(0, 4) + "-" + date2.substring(5, 7) + "-" + date2.substring(8, 10);
			}
			$("#from").val(date1).trigger('change');
			$("#to").val(date2).trigger('change');


			//把名字、身份证号码展示在页面，同时禁止用户修改这两项数据
			$("#name").attr("readonly", "true");
			$("#certNumber").attr("readonly", "true");

			//使提交按钮变成橙色
			$("#submit").addClass("theme_btn");

			//请求合成身份证照片
			mask("正在合成身份证照片，请稍等...");
			myPhoto.request("!ESale/System/IDCard/~java/IDCardImg.create", bluetoothInfo, function(data) {

				if (data.header.code == 0) {
					//正面照，反面照
					imgData["front"] = data.body.cardon;
					imgData["contrary"] = data.body.cardoff;

					var url1 = "!service/file/~java/Downloader.get?type=Thumb&id=" + data.body.cardon; //正面照片
					var url2 = "!service/file/~java/Downloader.get?type=Thumb&id=" + data.body.cardoff; //反面照片

					//为图片的background修改路径
					$("#frontDiv_img").css("background", "url('" + APP_CONFIG.SERVER_URL + url1 + "')");
					$("#contraryDiv_img").css("background", "url('" + APP_CONFIG.SERVER_URL + url2 + "')");

				} else {
					alert("身份证照片合成失败！");
				}
				unmask();
			});

		} else {
			//alert('身份证读取失败，请重试');
		}
	} catch (err) {
		if (/android/i.test(navigator.userAgent)) {
			alert('身份证读取失败，请重试');
		}
	} finally {
		unmask();
	}
}

//苹果设备的图片上传功能
function uploadImg(id) {
	mask("文件上传中...");
	var p = {
		'busiId': 'Account',
		'busiType': 'APP',
		'size': '1000'
	};

	mobileUpload({
		id: id,
		form: p, //上传时参数 提交到后台的参数
		url: APP_CONFIG.SERVER_URL + '!service/file/~java/Uploader.upload',
		fileSelected: function(data) { //文件选择后触发

			if (!(id == "writeCard")) {
				$('#progressBar').css("width", "0%");
				document.getElementById('progressBar').innerHTML = '0%';
			}


			//用fileReader请看网上详解 这里这是用于图片预览效果
			var reader = new FileReader();
			reader.onload = function(e) {
				//p.imgDataUrl=this.result;//从这里可以得到本地图片路径 在可以同<img src='this.reuslt'>展示出来
				//                $("#" + id).parent().css("background", "url('" + this.result + "')");//更换背景图片
			}
			reader.readAsDataURL(data.file); //本地读取文件 可以实现预览效果的
			//显示图片信息
			//                document.getElementById('fileName').innerHTML = "名称：" + data.fileName;
			//                document.getElementById('fileSize').innerHTML = "大小：" + data.fileSize;
			//                document.getElementById('fileType').innerHTML = "类型：" + data.fileType;
		},
		uploadProgress: function(evt) { //上传进度
			//下面是结合bootstrap的上传效果  可自己定义
			if (evt.lengthComputable) {

				//如果不是成卡图，则加载进度条
				if (!(id == "writeCard")) {
					var percentComplete = Math.round(evt.loaded * 100 / evt.total);
					$('#progressBar').css("width", percentComplete.toString() + "%"); //使用bootstrap滑动条显示上传进度
					document.getElementById('progressBar').innerHTML = percentComplete.toString() + '%';
				}

			} else {
				document.getElementById('progressBar').innerHTML = 'unable to compute';
			}
		},
		uploadComplete: function(evt) {
			var response = rdcp.str2json(evt.target.responseText)[0];
			imgData[id] = response.id;
			$("#" + id).parent().css("background", "url('" + APP_CONFIG.SERVER_URL + response.thumbURL + "')");
			unmask();
		}
	});
}

//如果是iphone 则使用js上传的功能
function changeUploadByTerminal() {
	if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
		$('#new_img_front').hide().prevAll().show();
		$('#new_img_contrary').hide().prevAll().show();
		$('#new_img_hand').hide().prevAll().show();
		$('#new_img_writeCard').hide().prevAll().show();
	}
}
changeUploadByTerminal();

//使用系统自带的照相功能上传图片
function takePhoto(type) {
	var sessionId = Local.getStoreJson(sys.loginKey).body.sessionId; //会话id
	$('#progressBar').css("width", "0%").empty().append('0%');
	TakePhoneUpload("{'busiId':'Account','busiType':'APP','size':1000,'_param':'" + type + "','SESSIONID':'" + sessionId + "'}", "print");
}

//拍照上传
function OnUploadBegin() {
	mask("正在上传图片中...");
}

//拍照上传图片回调
function OnUploadFinish(result) {

	if (result) {
		result = $.parseJSON(result)[0];
		if (result.id) {

			//如果不是成卡图，则加载进度条
			if (!(result._param == "writeCard")) {
				$('#progressBar').css("width", "100%").empty().append('100%');
			}

			imgData[result._param] = result.id;
			$("#new_img_" + result._param).parent().css("background", "url('" + APP_CONFIG.SERVER_URL + result.thumbURL + "')");
		}
		if (!(result._param == "writeCard")) {
			$("#upload_text").empty().append("图片上传成功");
		}
	} else {
		$("#upload_text").empty().append("图片上传失败!请重新上传...");
	}
	unmask();
}



//生成身份证ID
function InsertIDCard(obj) {
	var result = {};
	result.name = obj.name; //姓名
	result.sex = obj.gender ? (obj.gender == '男' ? '1' : '2') : "1"; //性别
	result.nation = obj.nation; //民族
	result.address = obj.paper_addr ? obj.paper_addr : ' '; //地址
	result.cardNo = obj.paper_num ? obj.paper_num : ' '; //身份号码
	result.issuedAt = obj.str_office ? obj.str_office : '无'; //签发机关
	result.effectedDate = obj.paper_stime ? obj.paper_stime.replace(/-/g, '') : ' '; //开始时间
	result.expiredDate = obj.paper_time ? obj.paper_time.replace(/-/g, '') : ' '; //终止有效期
	result.CardReaderId = '0000000000';
	result.born=obj.born;
	result.picture = obj.picture;
	result.ID = "";

	$.ajax({
		type: "post",
		url: APP_CONFIG.SERVER_URL + "!ESale/System/IDCard/~java/IDCardINFO.InsertIDCard?data=" + encodeURIComponent(JSON.stringify(result)),
		//data:result,
		success: function(data) {
			data = eval("(" + data + ")");
			if (data.header.code == 0) {
				//alert(data);
				result.ID = data.body.ID;
			} else {
				alert('储存身份证信息失败');
				return false;
			}
		},
		async: false
	});
	return result.ID;
}