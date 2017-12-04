app.registerCtrl("NfcRegisterCtrl", ["$scope", "$srhttp", "$rootScope", function($scope, $srhttp, $rootScope) {

	//底部导航样式变化
	replaceClass('myESaleB');

	$rootScope.appTitle = "NFC注册";

	$scope.authorizationCode = ""; //授权码
	$scope.registerText = "注册";
	$scope.updateText = "更新授权";
	$scope.circle = ""; //小点...
	$scope.circle2 = ""; //小点...
	$scope.clickFlag = true; //能否点击的标识

	$scope.request = {
		getRegisterCode: function(code) {
			$.ajax({
				type: "get",
				url: "http://www.esaleb.com/" + "!service/nfcreg/~java/Register",
				data: {
					registerCode: encodeURI(code)
				},
				dataType: "json",
				success: function(data) {
					if (data.header.code == 0) {
						var finalCode = data.body;
						//设置注册码
						NFCReader.setIdentity($scope.event.setIdentitySuccess, $scope.event.setIdentityFail, [finalCode]);
					} else {
						alert(data.header.message);
						return;
					}
				}
			})

			/*$srhttp.post("!service/nfcreg/~java/Register", {
				registerCode: code
			}, function(data) {
				if (data.header.code == 0) {
					var finalCode = data.body;
					//设置注册码
					NFCReader.setIdentity($scope.event.setIdentitySuccess, $scope.event.setIdentityFail, [finalCode]);
				} else {
					alert(data.header.message);
					return;
				}
			},{mask:false});*/
		}
	}

	//$scope.request.getRegisterCode("E9TshnnUQA2PgdlAOFQkxlnDSMaks7Z0ipKQejXxeyyIZk/Y67FnlqvyV/YX9F4wEyy2ngVzzeUAD9kfOy6SiCDqWqbV6CYDiHOMD8030cnCJBH4J4C5mdXpgHseR5zsOhzGXXptoonK7DBMpofZppdJiESbRWkI9lLZ49dLPdI=");

	$scope.event = {

		//获取到注册码：成功的回调
		getRegisterCodeSuccess: function(code) {
			//修改按钮样式
			$("#registerBtn").removeClass("unuse_btn").addClass("theme_btn");
			$scope.registerText = "注册";
			$scope.clickFlag = true;

			if (code == null || code == "") {
				alert("获取注册码失败，请检查授权码是否正确");
				$scope.registerText = "注册";
				return;
			} else {
				console.log("注册码" + code);
				$scope.request.getRegisterCode(code);
			}
		},

		//获取到注册码：失败的回调
		getRegisterCodeFail: function() {
			//修改按钮样式
			$("#registerBtn").removeClass("unuse_btn").addClass("theme_btn");
			$scope.registerText = "注册";
			$scope.clickFlag = true;
			alert("获取注册码失败");
		},

		//设置注册码：成功的回调
		setIdentitySuccess: function(result) {
			//修改按钮样式
			$("#registerBtn").removeClass("unuse_btn").addClass("theme_btn");
			$("#updateBtn").removeClass("unuse_btn").addClass("theme_btn");
			$scope.registerText = "注册";
			$scope.updateText = "更新授权";
			$scope.clickFlag = true;

			if (result == "0") {
				NFCReader.init(null, null, []);
				alert("注册成功");
			} else if (result == "-1") {
				alert("更新成功");
			} else {
				alert("操作失败");
			}
		},

		//设置注册码：失败的回调
		setIdentityFail: function() {
			//修改按钮样式
			$("#registerBtn").removeClass("unuse_btn").addClass("theme_btn");
			$scope.registerText = "注册";
			$scope.clickFlag = true;
			alert("注册失败");
		},

		//注册状态动画
		registerMove: function() {
			if ($scope.registerText == "注册中") {
				if ($scope.circle.length <= 4) {
					$scope.circle += ".";
				} else {
					$scope.circle = "";
				}
				setTimeout(function() {
					$scope.$apply($scope.event.registerMove());
				}, 600);
			} else {
				$scope.circle = ""; //小点...
				return;
			}
		},

		//更新授权状态动画
		updateCircle: function() {
			if ($scope.updateText == "更新中") {
				if ($scope.circle2.length <= 4) {
					$scope.circle2 += ".";
				} else {
					$scope.circle2 = "";
				}
				setTimeout(function() {
					$scope.$apply($scope.event.updateCircle());
				}, 600);
			} else {
				$scope.circle2 = ""; //小点...
				return;
			}
		},

		//点击注册事件
		btnClick: function() {
			if ($scope.clickFlag == false) {
				return;
			}
			if ($scope.authorizationCode == "") {
				alert("请输入授权码");
				return;
			}
			$scope.clickFlag = false; //能否点击的标识
			$("#registerBtn").removeClass("theme_btn").addClass("unuse_btn");
			$scope.registerText = "注册中";
			$scope.event.registerMove(); //执行动画：其实不算动画啦

			document.addEventListener("deviceready", function() {
				//传入授权码，获取注册码
				NFCReader.getRegisterCode($scope.event.getRegisterCodeSuccess, $scope.event.getRegisterCodeFail, [$scope.authorizationCode]);
			}, false);
		},

		//更新
		updateIdentity: function() {
			//刚按下注册，则此时按清除无效
			if ($scope.clickFlag == false) {
				return;
			} else {
				$scope.clickFlag = false; //能否点击的标识
				$("#updateBtn").removeClass("theme_btn").addClass("unuse_btn");
				$scope.updateText = "更新中"
				$scope.event.updateCircle(); //执行动画：其实不算动画啦
				console.log("正在更新中...");
				document.addEventListener("deviceready", function() {
					//传入授权码，获取注册码
					NFCReader.setIdentity($scope.event.setIdentitySuccess, $scope.event.setIdentityFail, []);
				}, false);
			}

		}
	}
}]);