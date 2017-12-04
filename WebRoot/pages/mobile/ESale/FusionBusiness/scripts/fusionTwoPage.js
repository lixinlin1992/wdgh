/**
 * Created by 123 on 2015/7/16.
 * 选择产品页面
 */

var fusionTwo = {
	pid: "",
	pWoType: "",
	fusionProductName: ""
}
app.registerCtrl("fusionTwoPageCtrl", ["$rootScope", '$srhttp', '$scope', '$routeParams',
	function(root, $rdcp, $scope, $myparam) {
		//console.info(Local.getStoreJson("fusionParam"));

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		var fusionParam = Local.getStoreJson("fusionParam");
		Local.saveStoreJson("fusionParam", "");

		root.appTitle = "融合业务";
		//fusionTwo.request = $rdcp.request;
		//fusionTwo.scope = $scope;
		app.when("/fusionThreePage", {
			templateUrl: "ESale/FusionBusiness/pages/fusionThreePage.html",
			controller: "fusionThreePageCtrl"
		});

		selectFusionPro();
		//融合产品（搜索）
		$scope.searchFusionPro = function() {
			$("#pageIndex").val("1");
			selectFusionPro();
		};
		//选择融合产品
		$scope.selectProduct = function(id, pid, wotype, name) {
			isSelect(id);
			fusionTwo.pid = pid;
			fusionTwo.pWoType = wotype;
			fusionTwo.fusionProductName = name;
			$("#twoPage").show();
		};
		$scope.changProduct = function() {
				selectFusionPro();
			}
			//下一页
		$scope.fusionThreePage = function() {
				fusionParam.id = fusionTwo.pid;
				fusionParam.wotype = fusionTwo.pWoType;
				fusionParam.name = fusionTwo.fusionProductName;
				//var params = JSON.stringify(fusionParam);
				Local.saveStoreJson("fusionParam", fusionParam);
				window.location.href = "#/fusionThreePage";
			}
			/**
			 * 选择融合产品
			 * @param name 融合产品名称
			 */

		function selectFusionPro() {
			//停止监听摇一摇事件，加载完后再重新监听
			removeDeviceMotion();
			var keyword = $.trim($("#fusionKeyWord").val());
			var params = {
				pageSize: "10",
				page: $("#pageIndex").val(),
				title: keyword
			}
			$rdcp.request(
				"!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_RH_PRODUCT", //url
				params, //parms
				function(data) {
					//console.info(data);
					if (data.header && data.header.code == 0) {
						loadDataCallBack(data);
						var rows = data.body.rows;
						if (rows.length == 0) {
							alert("温馨提示", "找不到相关的产品");
							return;
						}
						$scope.productData = rows;
					} else {
						alert("错误", "加载数据出错！");
					}
				});
			$("#twoPage").hide();
		}

		/**
		 * 加载数据后判断是否显示“摇一摇，换产品”
		 * @param data
		 */
		function loadDataCallBack(data) {
			var page = parseInt(data.body.page);
			var count = parseInt(data.body.pageCount);
			if (count > 1) {
				$("#changProduct").show();
				addDeviceMotion(function(can) {
					if (can)
						$("#changProduct a").text("摇一摇，换产品");
					else
						$("#changProduct a").text("换一组产品");
				});
			} else {
				$("#changProduct").hide();
			}
			if (page >= count)
				page = 1;
			else
				page++;
			$("#pageIndex").val(page);
		}

		//摇一摇回调
		function onDeviceMotion() {
			selectFusionPro();
		}
	}
]);