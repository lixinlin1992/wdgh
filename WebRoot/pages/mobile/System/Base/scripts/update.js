$(document).ready(function() {
	localStorage.updateNow = 0; //标识要更新
	checkedUpdate();
});

/*
 cwq 20150921
 检查更新函数
 @localStorage.updateUrl 更新地址
 */
function checkedUpdate_yes() {
	$("#shadeDiv").hide();
	$("#updateNew").hide();
	location.href = localStorage.updateUrl;
	localStorage.updateNow = 1;
}

function checkedUpdate_false() {
	$("#shadeDiv").hide();
	$("#updateNew").hide();
	localStorage.updateNow = 1;
}

//注：不可以放在登录之前，1.有可能会报错；2.如果弹出是否更新框，这时发生自动登录事件，弹出框会马上消失
function checkedUpdate() {
	if (localStorage.updateNow == 0) {
		//console.log("等于0");
		//进行IOS和Android判断
		document.addEventListener('deviceready', function() {
			//检测版本
			cordova.getAppVersion.getVersionNumber(function(version) {
				$('#version').text("当前版本:" + version);

				var url = APP_CONFIG.APP_URL_API; //获取服务器最新版本的接口
				
				//IOS事件处理
				if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
					//添加弹框HTML
					if ($("#updateNew").length == 0) {
						$("body").append('<div id="updateNew" class="com_alert" style="top: 150px;display:none;"><h2 id="alertTitle" class="title">提示</h2><div class="content"><span class="loadingtxt" style="margin-top: 15px;font-size:1.2em;">是否更新？</span></div><div class="bottom_btnbox"><div class="left"><a class="normal_btn" href="javascript://" onclick="checkedUpdate_yes()">确定</a></div><div class="right"><a class="normal_btn" href="javascript://" onclick="checkedUpdate_false()">取消</a></div></div></div>');
					}
					
					$.post(url, {
						aId: APP_CONFIG.APP_AID_IOS,
						_api_key: APP_CONFIG.APP_API_KEY_IOS
					}, function(data) {
						var appCount = data.data.length;
						if (version != data.data[appCount - 1].appVersion) {
							$("#shadeDiv").show();
							$("#updateNew").show();
							localStorage.updateUrl = APP_CONFIG.APP_UPDATE_URL_IOS; //IOS的下载链接
						}
					});
				}

				//Androi事件处理
				else if (/android/i.test(navigator.userAgent)) {
					//添加弹框HTML
					if ($("#updateNew").length == 0) {
						$("body").append('<div id="updateNew" class="com_alert" style="top: 150px;display:none;"><h2 id="alertTitle" class="title">提示</h2><div class="content"><span class="loadingtxt" style="margin-top: 15px;font-size:1.2em;">是否更新？</span></div><div class="bottom_btnbox"><div class="left"><a class="normal_btn" href="javascript://" onclick="checkedUpdate_yes2()">确定</a></div><div class="right"><a class="normal_btn" href="javascript://" onclick="checkedUpdate_false()">取消</a></div></div></div>');
					}
					
					$.post(url, {
						aId: APP_CONFIG.APP_AID_ANDROID,
						_api_key: APP_CONFIG.APP_API_KEY_ANDROID
					}, function(data) {
						var appCount = data.data.length;
						if (version != data.data[appCount - 1].appVersion) {
							$("#shadeDiv").show();
							$("#updateNew").show();
						}
					});
				}
			});
		});
	} else {
		//console.log("不等于0");
	}
}

//安卓的更新下载
function checkedUpdate_yes2() {
	$("#shadeDiv").hide();
	$("#updateNew").hide();
	localStorage.updateNow = 1;
	//执行下载
	document.addEventListener('deviceready', function() {
		function success(msg) {
			//下载完成，返回文件本地连接
		};

		function error(msg) {
			//下载失败，返回错误信息
		};
		AutoUpdate.update(success, error, [APP_CONFIG.APP_UPDATE_URL_ANDROID]); //执行更新
	});
}