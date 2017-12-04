app.registerCtrl("MyAccountCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {

		//底部导航样式变化
		replaceClass('myESaleB');

		$rootScope.appTitle = "我的帐户";
		$srhttp.get("!ESale/Mall/Member/~query/memberCenter/WALLET_DETAIL", {
			"result": "json"
		}, function(data) {
			$scope.info = data.body.rows;
			$scope.colName = data.body.colName;

			$scope.id = $scope.info[0].cell[$scope.colName.indexOf("ID")];
			$scope.balance = $scope.info[0].cell[$scope.colName.indexOf("BALANCE")];
			$scope.mname = $scope.info[0].cell[$scope.colName.indexOf("MNAME")];
			$scope.name = $scope.info[0].cell[$scope.colName.indexOf("NAME")];
			$scope.status = $scope.info[0].cell[$scope.colName.indexOf("STATUS")];
			$scope.note = $scope.info[0].cell[$scope.colName.indexOf("NOTE")];


			if ($scope.status == 0) {
				$scope.status = "无效";
			} else {
				$scope.status = "有效";
			}
		});

		$scope.form = {
			"fee": "",
			"status": "",
			"walletId": ""
		}

		$scope.nextPage = function() {

			$scope.form.fee = $scope.balance;
			$scope.form.status = $scope.status;
			$scope.form.walletId = $scope.id;

			Local.saveStoreJson("accountParams", $scope.form);
			location.href = "#/walletLog";
		}
	}
]);