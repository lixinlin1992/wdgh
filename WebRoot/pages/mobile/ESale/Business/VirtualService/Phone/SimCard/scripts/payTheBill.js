app.registerCtrl("PayTheBillCtrl", ["$scope", "$srhttp", "$rootScope", "$timeout",
	function($scope, $srhttp, $rootScope, $timeout) {

		$rootScope.appTitle = "缴话费";

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		//存放各个变量
		$scope.form = {
			"balance": "", //余额
			"phoneNo": "", //手机号码
			"finalMoney": "", //充值金额
			"area": "无法获取", //号码归属地
			"company": "无法获取", //号码所属运营商
			"brandId": "", //运营商
			"submit_flag": false, //能否提交
		}

		//存储充值金额的数组
		$scope.arrays = {
			"payMoneyRows": [{
				"name": "30元",
				"code": "30"
			}, {
				"name": "50元",
				"code": "50"
			}, {
				"name": "100元",
				"code": "100"
			}, {
				"name": "300元",
				"code": "300"
			}, {
				"name": "500元",
				"code": "500"
			}]
		}

		//选中第一个金额
		$timeout(function() {
			$("#moneyDiv").find("a").eq(0).trigger("click");
		}, 100);


		//手机号码事件监听，不长于11位
		$scope.$watch('form.phoneNo', function(newValue, oldValue) {
			if (newValue >= 11) {
				$scope.form.phoneNo = $scope.form.phoneNo.substring(0, 11);
			}
			//获取号码归属地，运营商，是否能充值此话费
			if ($scope.form.phoneNo.length == 11) {
				$scope.request.getNumberInfo(false);
			}
		});

		$scope.request = {

			//获取余额
			getBalance: function() {
				$srhttp.post("!ESale/Charge/Business/Telephone/~java/Recharge.getWalletBalance", {}, function(data) {
					try {
						if (data.header.code == "0") {
							$scope.form.balance = data.body.balance;
						} else {
							$scope.form.balance = 0;
							alert(data.header.message);
						}
					} catch (e) {
						alert(e.message);
					}
				});
			},

			/*
			 * 获取号码归属地，运营商，是否能充值此话费
			 * @params flag	报错时，是否弹出提示框
			 */
			getNumberInfo: function(flag) {
				$srhttp.post("!ESale/System/Interface/~java/OF_CheckCharge.check", {
					"mobile_number": $scope.form.phoneNo, //手机号码
					"fee": $scope.form.finalMoney //充值金额
				}, function(data) {
					try {
						if (data.header.code == "0") {
							//可以充值
							$scope.form.area = data.body.area; //号码区域
							$scope.form.company = data.body.operator; //运营商
							$("#submit").removeClass("unuse_btn").addClass("theme_btn");
							$scope.form.submit_flag = true;
						} else {
							//不能充值
							if (flag) {
								alert(data.header.message);
							}
							$("#submit").removeClass("theme_btn").addClass("unuse_btn");
							$scope.form.submit_flag = false;
						}
					} catch (e) {
						alert(e.message);
					}
				});
			},

			//确定提交
			submit: function() {

				//判断是否拥有提交功能
				if ($scope.form.submit_flag == false) {
					return;
				}
				if ($scope.form.phoneNo == "" || ($scope.form.phoneNo + "").length != 11 || ($scope.form.phoneNo + "").substring(0, 1) != 1) {
					alert("手机号码格式不正确");
					return;
				}
				if ($scope.form.finalMoney == "" || $scope.form.finalMoney <= 0) {
					alert("充值金额格式不正确");
					return;
				}
				if ($scope.form.balance < $scope.form.finalMoney) {
					alert("余额不足，不可充值");
					return;
				}
				//弹出确认充值对话框
				$scope.event.confirm_show();
			},

			//创建订单
			creatOrder: function() {

				if ($scope.form.company == "联通") {
					$scope.form.brandId = "CU";
				} else if ($scope.form.company == "电信") {
					$scope.form.brandId = "CN";
				} else if ($scope.form.company == "移动") {
					$scope.form.brandId = "CM";
				}

				$srhttp.post("!ESale/Charge/Business/Telephone/~java/Recharge.submitOrder", {
					"brandId": $scope.form.brandId,
					"code": $scope.form.finalMoney,
					"area": $scope.form.area,
					"phoneNo": $scope.form.phoneNo,
					"brandName": $scope.form.companey
				}, function(data) {
					try {
						if (data.header.code == "0") {
							alert("充值成功，请留意短信通知");
						} else if (data.header.code == "2001") {
							alert("系统错误");
						} else if (data.header.code == "2002") {
							alert("非法操作");
						} else if (data.header.code == "2003") {
							alert("不支持该充值类型");
						} else if (data.header.code == "2004") {
							alert("余额不足");
						} else if (data.header.code == "2005") {
							alert("充值失败");
						} else {
							alert(data.header.message);
						}
						$scope.form.phoneNo = "";
					} catch (e) {
						alert(e.message);
					}
				});
			}
		}

		//事件处理
		$scope.event = {

			//选择充值价格
			selectPayMoney: function(obj, value) {
				$(obj.target).addClass("selectbtnon").parent().siblings().find("a").removeClass("selectbtnon");
				$scope.form.finalMoney = value;
				//获取号码归属地，运营商，是否能充值此话费
				if ($scope.form.phoneNo.length == 11) {
					$scope.request.getNumberInfo(false);
				}
			},

			//弹框
			confirm_show: function() {
				$("#shadeDiv2").show();
				$("#confirmDialog").show();
			},

			//确定按钮
			confirm_yes: function() {
				$("#shadeDiv2").hide();
				$("#confirmDialog").hide();
				$scope.request.creatOrder();
			},

			//取消按钮
			confirm_false: function() {
				$("#shadeDiv2").hide();
				$("#confirmDialog").hide();
			},

		}

		$scope.request.getBalance();
	}
]);