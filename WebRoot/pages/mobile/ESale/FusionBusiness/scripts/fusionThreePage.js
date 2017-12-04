/**
 * Created by Administrator on 2015/7/20.
 */

var fusionThree = {
	fusionPhoneNumber: "",
	phoneNumId: ""
}
app.registerCtrl("fusionThreePageCtrl", ["$rootScope", '$srhttp', '$scope', '$routeParams',
	function(root, $rdcp, $scope, $routeParams) {
		// console.info(Local.getStoreJson("fusionParam"));

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		var fusionParam = Local.getStoreJson("fusionParam");
		Local.saveStoreJson("fusionParam", "");

		root.appTitle = "融合业务";
		//fusionThree.request = $rdcp.request;
		//fusionThree.scope = $scope;
		app.when("/fusionFourPage", {
			templateUrl: "ESale/FusionBusiness/pages/fusionFourPage.html",
			controller: "fusionFourPageCtrl"
		});

		selectPhoneNumber();
		//选择号码（搜索）
		$scope.searchPhoneNum = function() {
			$("#pageIndex").val("1");
			selectPhoneNumber();
		};
		//换一组号码
		$scope.changPhone = function() {
				selectPhoneNumber();
			}
			//下一页
		$scope.fusionFourPage = function() {
				fusionParam.goodsId = fusionThree.phoneNumId;
				fusionParam.number = fusionThree.fusionPhoneNumber;
				Local.saveStoreJson("fusionParam", fusionParam);
				//var params = JSON.stringify(fusionParam);
				window.location.href = "#/fusionFourPage";
			}
			//选择产品号码
		$scope.selPhoneNumber = function(id, phoneID, name) {
			//ysb_shade("预占号码中，请稍候...");
			$rdcp.request(
				"!ESale/Business/VirtualService/Phone/SimCard/~java/Number.lock", //url
				{
					id: phoneID
				}, //parms
				function(data) {
					//ysb_unshade();
					isSelect(id);
					if (data.header && data.header.code == 0) {
						if (data.body.flag == "1") {
							fusionThree.phoneNumId = phoneID;
							fusionThree.fusionPhoneNumber = name;
							$("#threePage").show();
						} else {
							alert('温馨提示', "此号码已被预占，请选择其它号码");
						}
					} else {
						alert('温馨提示', "发生网络错误");
					}
				}
			);
		};

		/**
		 * 选择号码
		 * @param name 产品号码
		 */
		function selectPhoneNumber() {
			//停止监听摇一摇事件，加载完后再重新监听
			removeDeviceMotion();
			var keyword = $("#phoneNum").val();
			var param = {
				typeId: "ChinaUnicom.Account.Number",
				businessId: "ChinaUnicom.Account.4G.BK",
				pageSize: "16",
				page: $("#pageIndex").val(),
				title: keyword
			}
			$rdcp.request(
				"!ESale/Mall/Goods/~query/Q_GOODS_NUMBER_COMMON", //url
				param, //parms
				function(data) {
					if (data.header && data.header.code == 0) {
						numberLoadCall(data);
						var rows = data.body.rows;
						if (rows.length == 0) {
							alert("温馨提示", "找不到相关的号码");
							//$("#threePage").show();
							return;
						}
						$scope.phoneNumberData = rows;
					} else {
						alert("错误", "加载数据出错！");
					}
				});
			$("#threePage").hide();
		}

		//号码加载后回调
		function numberLoadCall(data) {
			var page = parseInt(data.body.page);
			var count = parseInt(data.body.pageCount);
			if (count > 1) {
				$("#changPhoneNum").show();
				//添加摇一摇换号码事件
				addDeviceMotion(function(can) {
					if (can)
						$("#changPhoneNum a").text("摇一摇，换号码");
					else
						$("#changPhoneNum a").text("换一组号码");
				});
			} else {
				$("#changPhoneNum").hide();
			}
			if (page >= count)
				page = 1;
			else
				page++;
			$("#pageIndex").val(page);
		}

		//摇一摇回调
		function onDeviceMotion() {
			selectPhoneNumber();
		}
	}
]);