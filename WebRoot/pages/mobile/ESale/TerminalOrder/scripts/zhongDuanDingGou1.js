app.registerCtrl("ZhongDuanDingGou1Ctrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		$rootScope.appTitle = "终端销售";
		
		//页码
		$scope.page = 1;
		//页面显示数目
		$scope.pageSize = 10;
		//图片地址
		$scope.imgScr = APP_CONFIG.SERVER_URL + "!service/file/~java/Downloader.get?id=";
		//数据存储
		$scope.form1={
			"ID":"",//终端ID
			"img":""//图片
		}

		//加载页面
		$scope.getPage = function() {

			$srhttp.post("!ESale/Mall/Goods/~query/Q_GOODS_SALE_LIST", {
				"page": $scope.page,
				"pageSize": $scope.pageSize
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
		$scope.getPage();
		
		//加载更多
		$scope.more = function() {
			$scope.page = $scope.page + 1;
			$scope.getPage();
		}
		
		$scope.nextPage=function(index){
			var id="#product_"+index;
			$scope.form1.ID=$(id).attr("data");//终端ID
			$scope.form1.img=$(id).find("img").attr("src");//图片
			Local.saveStoreJson("form1",$scope.form1);
			hrefJump('zhongDuanDingGou2');//页面跳转
		}
	}
]);