app.registerCtrl("MyESaleBCtrl", ["$scope", "$srhttp",
	function($scope, $srhttp) {

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('myESaleB');
		}, 100);

		$scope.logout = function() {
			$srhttp.get("framework.do?ds=DS_USER_LOGOUT", {}, function(data) {

				Local.saveStore(sys.loginKey, '');
				location.href = "ESale/Mall/UI/pages/login.html";
			});

		};
		exit_yes = function() {
			$scope.logout();
		}
		exit = function() {
			$("#shadeDiv").show();
			$("#alertBox").show();
		}
		exit_false = function() {
				$("#shadeDiv").hide();
				$("#alertBox").hide();
			}
			//佛山集客开户APP清除本地存储的数据
		clearLocalStorage = function() {
			localStorage.removeItem("params");
			alert("清除缓存成功");
		}

		if (/android/i.test(navigator.userAgent)) {
			$("#nfc").show();
		} else {
			$("#nfc").hide();
		}

		//如果是内蒙易售宝
		if (APP_CONFIG.OPERATOR == "JKESALEB") {
			$("#nfc").hide(); //隐藏NFC注册
			$("#cbssBind").show(); //显示CBSS绑定
		}
		//佛山集客开户APP要添加清除缓存按钮
		if (APP_CONFIG.OPERATOR == "FSUNICOM" || APP_CONFIG.OPERATOR == "GZDZZX") {
			$("#clearLocalStorage").show(); //隐藏NFC注册
		}
	}
]);