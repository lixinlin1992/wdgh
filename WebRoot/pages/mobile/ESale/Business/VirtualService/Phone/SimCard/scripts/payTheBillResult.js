app.registerCtrl("PayTheBillResultCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {

		$rootScope.appTitle = "缴话费";

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		$scope.form = {};
		$scope.form = Local.getStoreJson("chargeForm");
		$scope.form.chargeStatus = "充值中";
		$scope.form.circle = ".";
		console.log($scope.form);
		var flag = true; //控制轮循

		$scope.request = {
			getResult: function() {
				if (flag == false) {
					return;
				} else {
					flag = false;
					console.log("轮循中......");
					$srhttp.post("!ESale/System/Interface/~query/Q_CHARGE_STATUS", {
						order_code: $scope.form.code
					}, function(data) {
						try {
							if (data.header.code == 0) {
								if (data.body.rows[0].CHARGE_RESULT == "loading") {
									$("#chargeStatus").attr("class", "recharge_message_processing");
									$scope.form.chargeStatus = "充值中";
								} else if (data.body.rows[0].CHARGE_RESULT == "success") {
									$("#chargeStatus").attr("class", "recharge_message_sucess");
									$scope.form.chargeStatus = "充值成功";
									$scope.form.circle = "";
									clearInterval(interval);
								} else if (data.body.rows[0].CHARGE_RESULT == "fail") {
									$("#chargeStatus").attr("class", "recharge_message_fail");
									$scope.form.chargeStatus = "充值失败";
									$scope.form.circle = "";
									clearInterval(interval);
								}
							} else {

							}
							flag = true;
						} catch (e) {
							alert(e.message);
						}
					}, {
						mask: false
					});
				}
			}
		}
		
		$scope.StatusMove = function() {
			if ($scope.form.chargeStatus == "充值中") {
				if ($scope.form.circle.length <= 4) {
					$scope.form.circle += ".";
				} else {
					$scope.form.circle = "";
				}
				setTimeout(function() {
					$scope.$apply($scope.StatusMove());
				}, 400);
			} else {
				return;
			}
		}
		$scope.StatusMove();

		var interval = setInterval($scope.request.getResult, 3000);
	}
]);