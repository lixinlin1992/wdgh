//获取sessionid的方法
/*function getSessionId(){
	console.info(document.cookie);
	var c_name = 'JSESSIONID';
	if(document.cookie.length>0){
		c_start=document.cookie.indexOf(c_name + "=")
		if(c_start!=-1){
			c_start=c_start + c_name.length+1
			c_end=document.cookie.indexOf(";",c_start)
			if(c_end==-1) c_end=document.cookie.length
			return unescape(document.cookie.substring(c_start,c_end));
		}
	}
}*/
/*
*//**
 * Created by carl on 2015/7/7.
 * 登陆js
 *//*
var login = {
	//密码本地保存
	Key_Login_Pwd: '_Key_Login_Pwd',
	//登录结果
	KEY_LOGIN_RESULT_CODE: "_LOGIN_CODE",
	//退出后保存帐号
	KEY_LOGIN_LOGIN_NAME: "_LOGIN_NAME",
	//初始化
	init: function() {
		if (sys.isLogin()) {
			if (this.loginControllerScope && this.loginControllerScope.loginAuto) {
				this.loginControllerScope.loginAuto();
			}
		} else {
			//显示登录框进行登录
			//          showForm();
			//倒计时：一秒之后现在框
			setTimeout('showForm(1)', 1000);
		}
		var longinName = Local.getStore(login.KEY_LOGIN_LOGIN_NAME);
		if (longinName != undefined)
			$('#loginName').val(longinName);
		else {
			longinName = "";
			$('#loginName').val(longinName);
		}
	},
	//自动登陆方法
	//控制器全局变量
	loginControllerScope: null
};

//登陆操作函数
login.login = function() {
	var loginName = $('#loginName').val();
	var password = $('#password').val();
	if (loginName && password) {
		var $btn = $('#form_button').button('loading');
	} else {
		alert("请输入用户名和密码");
	}
	console.log("登录相关参数已经组织");
	return {
		loginName: loginName,
		password: password,
		callback: function(data) {
			//console.log(data);
			login.loginControllerScope.loginTip = "";
			$btn.button('reset');

			//全局变量----获取controller里面的code

			if (data.header.code == 4000) {
				login.loginControllerScope.showSmsCodeForm(codes);
				login.loginControllerScope.smsCodeBtnCountDown(60);
			} else if (data.header.code == 4101) {
				console.log("收到激活回应");
				window.location.href = "ESale/Mall/UI/pages/activate.html";
			} else {
				if (data && data.header.code == 0) {
					//保存帐号 用于退出是显示
					Local.saveStoreJson(sys.loginKey, data);
					Local.saveStore(login.KEY_LOGIN_LOGIN_NAME, data.body.account);

					//保存数据在本地
					Local.saveStoreJson(sys.loginKey, data);
					sys.dispatch();
				} else {
					Local.saveStore(sys.loginKey, '');
					//alert(data.body.content);
					switch (data.header.code) {
						case 2010:
							login.loginControllerScope.loginTip = "帐号密码不正确";
							break;
						case 2011:
							login.loginControllerScope.loginTip = "您的密码不正确";
							break;
						case 2016:
							login.loginControllerScope.loginTip = "您的帐号已经被锁定，请联系管理员解锁";
							break;
						default:
							login.loginControllerScope.loginTip = data.header.message;
					}
				}
			}
		}
	}
};

*//**
 * 自动登陆
 *//*
login.loginAuto = function() {
	var $btn = $('#form_button').button('loading');
	var loginName = Local.getStoreJson(sys.loginKey).body.account; //用户名
	var sessionId = Local.getStoreJson(sys.loginKey).body.sessionId; //会话id
	$('#loginName').val(loginName);
	$('#password').val(sessionId);

	return {
		loginName: loginName,
		sessionId: sessionId,
		callback: function(data) {
			$btn.button('reset');
			if (data && data.header.code === 0) {
				//保存数据在本地
				Local.saveStoreJson(sys.loginKey, data);

				sys.dispatch();
			} else {
				$('#password').val('');

				//alert("自动登陆失败");
				login.loginControllerScope.loginTip = "您的登录已经过期，请重新登录";
				//已经保存密码的话，登录框就不显示，直接显示验证码
				showForm(1);
			}
		}
	}
};
*//**
 * 登陆控制器
 */
app.controller('LoginController', ['$scope', '$rootScope', '$srhttp', '$timeout',
	function($scope, $rootScope, $request, $timeout) {
		$scope.gettime=function(){
			var currentTime=new Date();
			$("#g_time").attr("src",APP_CONFIG.SERVER_URL+"framework.do?ds=DS_FRAMEWORK_SECURITY_VALIDATE_CODE&r="+currentTime);
		}
		$scope.gettime();
//获取sessionid
		function getsessionid(){
			$request.post('!property/mobile/~java/RequestSessionId.getSessionId',{},function(data){
				Local.saveStoreJson("sessionid",data.body);
				location.href = APP_CONFIG.HOME_PAGE;
			},{mask:false})
		}
		//getsessionid();
		//登陆事件
		$scope.loginFun = function() {
			if ($("#loginName").val() == "" || $("#loginName").val() == null) {
				alert("用户名不能为空");
				return;
			}
			else if ($("#password").val() == "" || $("#password").val() == null) {
				alert("密码不能为空");
				return;
			}
			else if ($("#validateCode").val() == "" || $("#validateCode").val() == null) {
				alert("验证码不能为空");
				return;
			}
			else {
				$("#g_mask").show();
				$request.post('framework.do?ds=DS_USER_LOGIN&'+rdcp.id("loginForm_id").serialize(),{},
					function(data) {
					if(data instanceof Object){
						if (data.header.code == 0) {
							getsessionid();
						} else {
							$scope.gettime();
							alert(data.header.message + "，" + data.body.content);
						}}
					},{mask_msg:'正在登陆中...'}
				);
			}
		};





































/*

		var tip = Local.getStore("_LOGIN_TIP");
		if (tip != undefined)
			tip = unescape(tip);
		$scope.loginTip = tip;
		Local.saveStore("_LOGIN_TIP", "");

		$scope.testSession = function(callback) {
			$request.get("!sys/security/~java/UpdateSession", {}, function(data) {
				console.log("Session Tested");
				if (callback != undefined) callback();
			}, {
				mask: false
			})
		};



		//自动登陆事件
		$scope.loginAuto = function() {
			var param = login.loginAuto();
			$scope.waitMessage = "正在登录" + $rootScope.appTitle + "...";

			//当本地存在帐号以及sessionid的时候才进行自动登录，否则不进行自动登录
			if (undefined != param.loginName && undefined != param.sessionId) {
				$request.request('!sys/security/~java/Login', {
						version: 1.0,
						terminal: 'Mobile',
						account: param.loginName,
						key: param.sessionId
					},
					function(data) {
						if (param.callback)
							param.callback(data);
					}
				);
			} else {
				//显示登录框进行登录
				showForm(1);
			}
		};
		//自动登陆方法
		login.loginControllerScope = $scope;


		$scope.showSmsCodeForm = function(e) {
			if (e == 4000) {
				$("#SmsCode").show();
				showForm(2);
				//					console.info(111);
			} else {
				$("#SmsCode").hide();
				showForm(1);
				//					console.info(221);
			}
		};


		//短信验证码相关参数默认值
		$scope.smsCodeSendBtnClass = "com_btn special_btn";
		$scope.smsCodeSendBtnLabel = "60秒后重发";
		$scope.smsCode = "";
		*/
/**
		 * 提交短信验证码
		 *//*

		$scope.validateSmsCode = function() {
			if ($scope.smsCode == undefined || $.trim($scope.smsCode) == "") {
				alert("请输入有效的短信验证码");
				return;
			}
			$request.get("!ESale/System/Base/~java/SMSLogin", {
				code: $scope.smsCode
			}, function(data) {
				//data.header.code = 4101;
				var msg = "";
				switch (data.header.code) {
					case 0: //验证成功
						//						msg="666";
						window.location.href = APP_CONFIG.HOME_PAGE;
						//						$scope.loginSuccess(APP_CONFIG.PAGE_HOME);
						break;
					case 4001:
						msg = "短信认证码不正确，请重新输入";
						break;
					case 4002:
						msg = "短信验证码不能为空";
						break;
					case 4003:
						msg = "短信验证码已经过期，请重新发送验证码";
						break;

				}
				if ("" != msg)
					alert(msg);
			}, {
				mask: true
			});
		};


		//60秒倒数
		//      $scope.smsCodeBtnCountDown = function (sec) {
		//          if (sec > 0) {
		//              //$("#SmsCodeSendBtn").attr("class", "com_btn disable_btn");
		//              //$("#SmsCodeSendBtn").html(sec + "秒后重发");
		//              //$("#SmsCodeSendBtn").unbind("click");

		//              $scope.smsCodeSendBtnLabel=sec + "秒后重发";
		//              $timeout(function () {
		//                  $scope.smsCodeBtnCountDown(sec - 1)
		//              }, 1000);
		//          } else {

		//              $scope.smsCodeSendBtnLabel="重发验证码";
		//          }
		//      };
		*/
/**
		 * 重新发送短信验证码
		 *//*

		$scope.reSendSms = function() {
			if ("com_btn special_btn" == $scope.smsCodeSendBtnClass) {
				$request.get("!ESale/System/Base/~java/SMSLogin.reSend", {}, function(data) {
					if (data.header.code == 0) {
						alert("验证码已经重发到你手机上，请注意查收");
						$scope.smsCodeBtnCountDown(60);
					} else {
						alert("验证码重发失败，请联系管理员");
					}
				}, {
					mask: true
				});
			}
		};


		//60秒倒数
		$scope.smsCodeBtnCountDown = function(sec) {
			if (sec > 0) {
				$("#SmsCodeSendBtn").attr("class", "com_btn disable_btn");
				$("#SmsCodeSendBtn").html(sec + "秒后重发");
				//				$("#SmsCodeSendBtn").unbind("click");
				$('#form_button').text('登录');
				$scope.smsCodeSendBtnClass = "com_btn disable_btn";
				$timeout(function() {
					$scope.smsCodeBtnCountDown(sec - 1)
				}, 1000);
			} else {
				$("#SmsCodeSendBtn").attr("class", "com_btn special_btn");
				$("#SmsCodeSendBtn").html("重发验证码");
				$scope.smsCodeSendBtnClass = "com_btn special_btn";
				//				$("#SmsCodeSendBtn").bind("click", function() {
				//					$scope.reSendSms();
				//				});
				$('#form_button').text('登录');
			}
		};
*/

		/**
		 * 验证码END
		 */
	}


]);