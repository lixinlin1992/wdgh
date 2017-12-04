app.registerCtrl("WalletLogCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {

		//底部导航样式变化
		replaceClass('myESaleB');

		$rootScope.appTitle = "钱包明细";

		$scope.page = 0;

		$scope.form = {
			"fee": "",
			"status": "",
			"walletId": ""
		}

		$scope.form = Local.getStoreJson("accountParams");
		Local.saveStoreJson("accountParams", {});

		$scope.rows = [];

		//加载更多
		$scope.listShowAdd = function() {

			if ($("a.more_btn").text() == "已无更多数据") {
				return;
			}

			$scope.page = $scope.page + 1;
			$srhttp.post("!ESale/Mall/Member/~query/memberCenter/WALLET_LOG", {
				"result": "json",
				"walletId": $scope.form.walletId,
				"pageSize": 10,
				"page": $scope.page
			}, function(data) {
				$scope.rows = $scope.rows.concat(data.body.rows);
				console.log($scope.rows);
				//console.log($scope.rows[0].cell[0]);

				//当无数据时，修改文本值
				if (data.body.rows == "") {
					$("a.more_btn").text("已无更多数据");
				}
			});
		}

		//默认加载第一次
		$scope.listShowAdd();

		$scope.myStatus = function(value) {

			if (value == 2) {
				return "收入";
			} else {
				return "支出";
			}
		}

	}


]);