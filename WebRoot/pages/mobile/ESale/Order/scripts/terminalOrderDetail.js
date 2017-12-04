//订单详细页面内容获取---begin
app.registerCtrl("TerminalOrderDetailCtrl", ["$scope", "$routeParams", "$srhttp", "$rootScope",
	function($scope, $routeParams, $srhttp, $rootScope) {

		//样式变化
		replaceClass('orders');
		$rootScope.appTitle = "我的订单";

		$scope.express_fee = ""; //运费
		$scope.express = ""; //物流公司
		$scope.express_num = ""; //物流号

		$scope.sysUrl = APP_CONFIG.SERVER_URL;

		$scope.idFilter = function(e) {
			return e.key_as && e.key_as.indexOf('id') < 0;
		}

		$scope.loadOrder = function() {
			$srhttp.get("!ESale/Mall/Order/~java/Order.getOrder", {
				orderId: $routeParams.orderId
			}, function(data) {
				setTimeout(function() {
					data = JSON.parse(JSON.stringify(data).replace(/BASE\.data/g, 'BASE_data'));
					data = JSON.parse(JSON.stringify(data).replace(/BASE\.HIDDEN/g, 'BASE_HIDDEN'));
					data = JSON.parse(JSON.stringify(data).replace(/BUSINESS\.INT/g, 'BUSINESS_INT'));
					data = JSON.parse(JSON.stringify(data).replace(/BASE\.IMG/g, 'BASE_IMG'));
					data = JSON.parse(JSON.stringify(data).replace(/BASE\.STRING/g, 'BASE_STRING'));
					//			console.info(data);
					//转换格式：把‘.’换成“_” end

					//获取数据 begin
					$scope.orders = data.body;
					$scope.ext_base = data.body.ext.BASE;
					$scope.ext_base_data = data.body.ext.BASE_data;
					$scope.ext_hidden = data.body.ext.BASE_HIDDEN;
					$scope.ext_img = data.body.ext.BASE_IMG;
					$scope.ext_business = data.body.ext.BUSINESS;
					$scope.ext_business_int = data.body.ext.BUSINESS_INT;
					$scope.gbl = data.body.goodsBeanList;

					for (var i = 0; i < data.body.ext.BASE.length; i++) {
						if (data.body.ext.BASE[i].key == "EXPRESS_FEE") {
							$scope.express_fee = data.body.ext.BASE[i].val;
						} else if (data.body.ext.BASE[i].key == "EXPRESS") {
							$scope.express = data.body.ext.BASE[i].key;
							$scope.express_num = data.body.ext.BASE[i].val;
						}
					}
					$scope.$apply();
				}, 1);
			});
		}

		$scope.getOrderGoods = function() {

			$srhttp.get("!ESale/Mall/Order/~query/Q_ORDER_GET_GOODS_LIST", {
				getTerminal: "1",
				orderId: $routeParams.orderId
			}, function(data) {
				if (data.header.code == 0) {
					$scope.orderGoods = data.body.rows;
					console.log($scope.orderGoods);
				}
			});
		}

		$scope.getExpressInfo = function() {
			$srhttp.get("!ESale/Mall/Member/~query/Member.Q_ADDRESS_INFO", {
				orderId: $routeParams.orderId
			}, function(data) {
				if (data.header.code == 0) {
					$scope.expressInfo = data.body;
				}
			});
		}

		$scope.loadOrder();
		$scope.getExpressInfo();
		$scope.getOrderGoods();

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