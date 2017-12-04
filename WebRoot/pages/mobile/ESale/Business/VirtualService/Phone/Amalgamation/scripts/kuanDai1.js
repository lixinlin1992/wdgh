app.registerCtrl("KuanDai1Ctrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//底部导航样式变化
		replaceClass('home');

		//页码
		$scope.page = 1;

		//页面显示数目
		$scope.pageSize = 8;

		$scope.imgScr = APP_CONFIG.SERVER_URL + "!service/file/~java/Downloader.get?id=";

		$rootScope.appTitle = "装宽带";

		//加载页面
		$scope.request = {
			getPage: function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_KD_PRODUCT", {
					"page": $scope.page,
					"pageSize": $scope.pageSize,
					"title": "", //模糊查询
					"speed": "",
					"jrlx": ""
				}, function(data) {
					if (data.header.code == 0) {
						if (data.body.rows.length == 0) {
							$("#more").text("没有数据");
						}
						if (data.body.rows.length < $scope.pageSize) {
							$("#more").text("加载完毕");
						}

						if ($scope.results == null) { //第一次访问接口
							$scope.results = data.body.rows;
						} else { //第二次及以上
							$scope.results = $scope.results.concat(data.body.rows);
						}
					}
				});
			}
		}


		//加载页面
		$scope.request.getPage();


		$scope.nextPage = function(id, name, type) {
			var params = {
				"id": id,
				"name": name,
				"type": type
			};
			Local.saveStoreJson("kd_product_object", params)
			hrefJump('kuanDai2');
		}

		//加载更多
		$scope.more = function() {
			$scope.page = $scope.page + 1;
			$scope.request.getPage();
		}
	}
]);