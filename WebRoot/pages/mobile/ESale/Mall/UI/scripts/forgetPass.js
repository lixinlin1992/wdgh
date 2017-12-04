app.controller("MyForgetPass", ["$scope", "$srhttp", "$timeout",
	function($scope, $srhttp, $timeout) {

		$scope.form = {
			'userId': "",
			'SMSCode': '',
			'newPassword': '',
			'reNewPassword': ''
		};

		//检验验证码正确与否
		$scope.showCodeMain = function() {
			if($scope.form.userId==""){
				alert_toast("请输入发展人编码");
				return;
			}
			if($scope.form.SMSCode==""){
				alert_toast("请输入短信验证码");
				return;
			}
			$srhttp.request("!ESale/System/Base/~java/ReSetPassword.validateCode", {
				"code": $scope.form.SMSCode
			}, function(data) {
				//console.log($scope.form.SMSCode);
				if (data.header.code == 0) {
					$("#showVerCodeMain").show();
					$("#inputVerCode").hide();
				} else if (data.header.code == 1) {
					alert_toast("已发送手机验证码，请注意查收");
					//window.native.toast("已发送手机验证码，请注意查收");
				} else if (data.header.code == 2) {
					alert_toast("验证码超时，请重新发送");
					//window.native.toast("验证码超时，请重新发送");
				} else if (data.header.code == 3) {
					alert_toast("验证码不正确");
					//window.native.toast("验证码不正确");
				}
			});
		};

		/**
		 * 重新发送短信验证码
		 */
		$scope.smsCodeSendBtnClass = "com_btn special_btn";
		$scope.reSendSms = function() {
			//如果没有输入工号
			if ($scope.form.userId == "") {
				alert_toast("请输入发展人编码");
				//window.native.toast("请输入发展人编码");
				return false;
			}
			//60秒内，再按发送短信，则点击无效
			if ($("#SmsCodeSendBtn").text() != "获取验证码" && $("#SmsCodeSendBtn").text() != "重发验证码") {
				return false;
			}
			if ("com_btn special_btn" == $scope.smsCodeSendBtnClass) {

				$srhttp.get("!ESale/System/Base/~java/ReSetPassword.sendCode", {
					"account": $scope.form.userId
				}, function(data) {
					if (data.header.code == 0) {
						alert_toast("验证码已经重发到你手机上，请注意查收");
						//window.native.toast("验证码已经重发到你手机上，请注意查收");
						$scope.smsCodeBtnCountDown(60);
					} else {
						alert_toast(data.header.message);
						//window.native.toast(data.header.message);
					}
				});
			} else {
				alert_toast("验证码重发失败，请联系管理员");
				//window.native.toast("验证码重发失败，请联系管理员");
			}

		};

		//检验密码，确定密码
		$scope.confirmPassword = function() {
			if ($scope.form.newPassword == "" || $scope.form.reNewPassword == "") {
				alert_toast("新密码不能为空！");
				//window.native.toast("新密码不能为空！");
				return false;
			} else if ($scope.form.newPassword != $scope.form.reNewPassword) {
				alert_toast("两次输入的密码不相同！");
				//window.native.toast("两次输入的密码不相同！");
				return false;
			} else {
				$srhttp.get("!ESale/System/Base/~java/ReSetPassword", {
					"password": $scope.form.newPassword
				}, function(data) {
					if (data.header.code == 0) {
						alert_toast("修改成功！");
						//window.native.toast("修改成功");
						window.location.href = APP_CONFIG.LOGIN_PAGE;
					} else if (data.header.code == 1) {
						alert_toast("未通过短信校验，请先校验短信验证码");
						//window.native.toast("未通过短信校验，请先校验短信验证码");
					} else if (data.header.code == -1) {
						alert_toast("密码设置失败，请稍后重试");
						//window.native.toast("密码设置失败，请稍后重试");
					}
				});
			}
		};


		//60秒倒数
		$scope.smsCodeBtnCountDown = function(sec) {
			if (sec > 0) {
				$("#SmsCodeSendBtn").html("获取编码中(" + sec + ")");
				$("#SmsCodeSendBtn").unbind("click");
				$('#form_button').text('登录');
				$scope.smsCodeSendBtnClass = "com_btn disable_btn";
				$timeout(function() {
					$scope.smsCodeBtnCountDown(sec - 1)
				}, 1000);
			} else {
				$("#SmsCodeSendBtn").html("重发验证码");
				$scope.smsCodeSendBtnClass = "com_btn special_btn";
				$("#SmsCodeSendBtn").bind("click", function() {
					$scope.reSendSms();
				});
			}
		};

		//返回按钮
		$scope.back = function() {
			window.location.href = APP_CONFIG.LOGIN_PAGE;
		}

		//安卓、苹果和电脑的不同弹框提示
		alert_toast = function(msg) {
			if (/android/i.test(navigator.userAgent)) {
				window.native.toast(msg);
			} else {
				alert(msg);
			}
		}
	}
]);