app.registerCtrl("RongHe1Ctrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//底部导航样式变化
		replaceClass('home');
		$rootScope.appTitle="办融合";

		//页码
		$scope.page = 1;

		//页面显示数目
		$scope.pageSize = 8;

		$scope.imgScr = APP_CONFIG.SERVER_URL + "!service/file/~java/Downloader.get?id=";

		$scope.rongHe1 = {
			"kuanDaiType": "", //宽带类型
			"id": "", //产品ID
			"name": "", //融合产品名
			"wotype": "",
			"rh_name": "", //融合产品名
			"rh_type": "", //融合类型
		}
		
		$scope.show = {
			"product": true
		}

		//加载页面
		$scope.request = {

			//加载产品列表
			getPage: function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_RH_PRODUCT", {
					"page": $scope.page,
					"pageSize": $scope.pageSize,
					"title": "", //模糊查询
					"speed": $scope.rongHe1.speed_id,
					"jrlx": $scope.rongHe1.jrlx_id
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
			},

		}

		$scope.event = {

			//选中样式修改
			selectReplaceClass: function(obj) {
				$(obj.target).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
			},

			//宽带类型点击事件
			selectKuanDaiType: function(obj, type) {
				$scope.event.selectReplaceClass(obj);
				$scope.rongHe1.kuanDaiType = type;
			},

			//下一步
			nextPage: function(id, name, wotype, rh_name, rh_type) {
				$scope.rongHe1.id = id;
				$scope.rongHe1.name = name;
				$scope.rongHe1.wotype = wotype;
				$scope.rongHe1.rh_name = rh_name;
				$scope.rongHe1.rh_type = rh_type;
				if ($scope.rongHe1.kuanDaiType == "") {
					alert("请选选择宽带类型");
					return;
				} else {
					Local.saveStoreJson("rongHe1", $scope.rongHe1);
					hrefJump('rongHe2');
				}
			}
		}

		//加载更多
		$scope.more = function() {
			$scope.page = $scope.page + 1;
			$scope.request.getPage();
		}
		
		$scope.request.getPage();
	}
]);