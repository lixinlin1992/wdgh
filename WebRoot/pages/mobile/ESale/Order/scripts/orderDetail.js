//订单详细页面内容获取---begin
app.registerCtrl("OrderDetail", ["$scope", "$routeParams", "$srhttp", "$rootScope",
	function($scope, $routeParams, $srhttp, $rootScope) {

		//样式变化
		replaceClass('orders');
		$rootScope.appTitle = "我的订单";

		$scope.sysUrl = APP_CONFIG.SERVER_URL;

		$scope.idFilter = function(e) {
			return e.key_as && e.key_as.indexOf('id') < 0;
		}
		$srhttp.get("!ESale/Mall/Order/~java/Order.getOrder", {
			orderId: $routeParams.orderId
		}, function(date) {
			try {
				//转换格式：把‘.’换成“_” begin
				date = JSON.parse(JSON.stringify(date).replace(/BASE\.DATE/g, 'BASE_DATE'));
				date = JSON.parse(JSON.stringify(date).replace(/BASE\.HIDDEN/g, 'BASE_HIDDEN'));
				date = JSON.parse(JSON.stringify(date).replace(/BUSINESS\.INT/g, 'BUSINESS_INT'));
				date = JSON.parse(JSON.stringify(date).replace(/BASE\.IMG/g, 'BASE_IMG'));
				date = JSON.parse(JSON.stringify(date).replace(/BASE\.STRING/g, 'BASE_STRING'));
				//			console.info(date);
				//转换格式：把‘.’换成“_” end

				//获取数据 begin
				$scope.orders = date.body;
				$scope.ext_base = date.body.ext.BASE;
				$scope.ext_base_date = date.body.ext.BASE_DATE;
				$scope.ext_hidden = date.body.ext.BASE_HIDDEN;
				$scope.ext_img = date.body.ext.BASE_IMG;
				$scope.ext_business = date.body.ext.BUSINESS;
				$scope.ext_business_int = date.body.ext.BUSINESS_INT;
				$scope.gbl = date.body.goodsBeanList;
				$scope.base_string = date.body.ext.goodsBeanList[0].BASE_STRING;
				//获取数据 end
			} catch (e) {
				console.log(e);
			}


		});
		//判断是否支付
		//		$scope.payStatus = function(status) {
		//			if (status == 0) {
		//				return "未支付";
		//			} else {
		//				return "已支付";
		//			}
		//		};
		//		app.filter("id",function(){
		//			return function("val"){
		//				
		//				
		//			}
		//		})

		//点击显示更多内容 begin
		$scope.showMore = function(status, index) {
			if (index > 2) {
				if (status) {
					return "收回数据";
				} else {
					return "显示所有";
				}
			} else {
				return "已全显示";
			}
		};
		//点击显示更多内容 end


	}
]);
//订单详细页面内容获取---end

//状态数据获取---begin
app.registerCtrl("Status", ["$scope", "$routeParams", "$srhttp",
	function($scope, $routeParams, $srhttp) {

		$scope.orderStatus = [];
		$scope.orderFail = [];
		//获取订单处理失败/驳回原因
		$srhttp.post("!ESale/Mall/Order/~query/Q_ORDER_FAIL_REASON", {
			order_id: $routeParams.orderId
		}, function(data) {
			try {
				$scope.orderFail = [{
					"FAIL_MESSAGE": data.body.rows[0].NAME
				}];
			} catch (e) {
				console.log("出错" + e.message);
			}


		});

		$srhttp.get("!ESale/Mall/Order/~query/Q_ORDER_STATUS_LOG_LIST", {
			orderId: $routeParams.orderId
		}, function(data) {
			$scope.orderStatus = data.body.rows;
		});

		$scope.statusDeal = function($type, $old, $new, $note) {
			$scope.status = $old + " " + $new;
			//			console.log( $scope.status + "|" + $old + " " + $new);

			$scope.OrderHelp = {
				"status": {
					"-3 0": "您成功提交了订单，请等待系统进行确认...",
					"0 0": "您重新发起了订单，请等待系统进行确认...",
					"4 0": "您重新发起了订单，请等待系统进行确认...",
					"0 1": "您的订单正在处理中，请稍候...",
					"0 2": "您的订单已经成功受理。" + $note,
					"0 3": "对不起，您的订单受理失败，订单结束。" + $note,
					"1 0": "您的订单将延后处理，请稍候...",
					"1 5": "您的订单将延后处理，请稍候...",
					"5 1": "您的订单正在处理中，请稍候...",
					"0 5": "您的订单已经通过审核。",
					"0 4": "对不起，您的订单审核不通过，驳回原因：" + $note,
					"1 4": "对不起，您的订单审核不通过，驳回原因：" + $note,
					"7 4": "对不起，您的订单审核不通过，驳回原因：" + $note,
					"-3 7": "您成功提交了订单，请等待审批...",
					"7 5": "您的订单已经通过审核，请等待处理...审批编号:" + $note,
					"1 2": "您的订单已经成功受理。" + $note,
					"1 3": "对不起，您的订单受理失败，订单结束。" + $note,
					"0 -1": "您的订单已经取消。",
					"1 -1": "您的订单已经取消。",
					"5 -1": "您的订单已经取消。",
					"-1 2": "您的订单状态发生改变，已由取消状态转为处理成功。" + $note,
					"0 -2": "您的订单已经超时。",
					"1 -2": "您的订单已经超时。",
					"5 -2": "您的订单已经超时。"
				},
				"pay_status": {
					"0 1": "您已经成功支付了订单，请等待供货商进行受理。",
					"0 2": "您已经成功提交了支付请求，正在等待支付处理结果...",
					"2 1": "订单支付成功，请等待供货商进行受理。",
					"2 0": "支付失败或者您取消了订单支付请求。"
				},
				"express_status": {
					"0 1": "您的订单已经发货，请您收货确认。",
					"1 2": "您的订单已经确认收货。"
				},
				"trade_status": {},
				"evaluate_status": {}
			};

			switch ($type) {
				case '0':
					return $scope.OrderHelp["status"][$scope.status];
					break;
				case '1':
					return $scope.OrderHelp["pay_status"][$scope.status];
					break;
				case '2':
					return $scope.OrderHelp["trade_status"][$scope.status];
					break;
				case '3':
					return $scope.OrderHelp["express_status"][$scope.status];
					break;
				case '4':
					return $scope.OrderHelp["evaluate_status"][$scope.status];
					break;
				default:
					return "未知操作";
					break;
			}
		}
	}
]);
//状态数据获取---end