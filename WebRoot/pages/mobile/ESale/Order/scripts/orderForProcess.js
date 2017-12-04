app.registerCtrl("OrderForProcessControl", ["$scope", "$srhttp",
	function($scope, $srhttp) {

		//样式变化
		replaceClass('orderForProcess');

		$scope.page = 1;
		$scope.orders = [];

		//页面加载，马上查询10条记录
		$srhttp.get("!ESale/Mall/Order/~query/Q_ORDER_LIST?rows=10&sort=CREATE_TIME&order=DESC&status=0,1,5", {
			"page": 1,
			"extFields": 'GOODS_ADD_TITLE'
		}, function(data) {
			$scope.orders = data.body.rows;
			//当无数据时，修改文本值
			if (data.body.rows == "" || data.body.rows.length < 10) {
				$("a.more_btn").text("已无更多数据");
			}
		});

		$scope.hrefJump = function(value, params, businessId) {
			if (businessId.indexOf("Terminal") >= 0) {
				value = "terminalOrderDetail";
			}
			var myHref = "#/" + value + "/" + params;
			window.location.href = myHref;
		}

		//加载更多
		$scope.addList = function() {
			$scope.page = $scope.page + 1;
			$srhttp.get("!ESale/Mall/Order/~query/Q_ORDER_LIST?rows=10&sort=CREATE_TIME&order=DESC&status=0,1,5", {
				"page": $scope.page,
				"extFields": 'GOODS_ADD_TITLE'
			}, function(data) {
				$scope.orders = $scope.orders.concat(data.body.rows);

				//当无数据时，修改文本值
				if (data.body.rows == "" || data.body.rows.length < 10) {
					$("a.more_btn").text("已无更多数据");
				}
			});
		}

		$scope.orderStatus = function(status, index) {
			if (status == 0) {
				$("#status_" + index).addClass("orange");
				return "未处理";
			} else if (status == 1) {
				$("#status_" + index).addClass("orange");
				return "处理中"; //orange
			} else if (status == -1) {
				$("#status_" + index).addClass("red");
				return "订单取消"; //red
			} else if (status == -2) {
				$("#status_" + index).addClass("red");
				return "超时取消"; //red
			} else if (status == -1) {
				$("#status_" + index).addClass("red");
				return "手动取消"; //red
			} else if (status == 2) {
				$("#status_" + index).addClass("green");
				return "处理成功"; //green
			} else if (status == 3) {
				$("#status_" + index).addClass("red");
				return "处理失败"; //red
			} else if (status == 4) {
				$("#status_" + index).addClass("red");
				return "已驳回"; //red
			} else if (status == 5) {
				$("#status_" + index).addClass("red");
				return "已确认";
			}
		}
	}
]);