/**
 * Created by 123 on 2015/7/16.
 */

var fusion = {
	newType: "新装宽带",
	oldType: "已有宽带",
	type: "", //业务类型
	city_code: "", //城市名称
	market_code: "", //地区编码
	market_name: "", //地区名称
	address: "" //标准地址
}

app.registerCtrl("FusionCtrl", ["$rootScope", '$srhttp', '$scope',
	function(root, $rdcp, $scope) {

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		root.appTitle = "融合业务";
		//fusion.request = $rdcp.request;
		//fusion.scope = $scope;
		//app.when("/fusionTwoPage/:fusionParam", {
		app.when("/fusionTwoPage", {
			templateUrl: "ESale/FusionBusiness/pages/fusionTwoPage.html",
			controller: "fusionTwoPageCtrl"
		});

		//类型选择单击事件
		$scope.typeClick = function(id, name) {
			isSelect(id);
			fusionType(name);
		};
		//城市选择单击事件
		$scope.selectCity = function(id, name) {
			isSelect(id);
			selectCity(name);
		};
		//营销中心选择单击事件
		$scope.selectMarket = function(id, name) {
			isSelect(id);
			selectMarketCenter(id, name);
		};
		//搜索地址单击事件
		$scope.searchAddr = function() {
				//重置页数为1
				$("#pageIndex").val("1");
				searchAddress();
			}
			//换一组地址
		$scope.changAddress = function() {
				searchAddress();
			}
			//选择地址
		$scope.selectAddress = function(id, name) {
				isSelect(id);
				fusion.address = name;
				$("#nextPage").show();
			}
			//下一页
		$scope.fusionTwoPage = function() {
			var param = {
				type: "",
				city: "",
				sale_code: "",
				sale_name: "",
				address: ""
			};
			param.type = fusion.type;
			param.city = fusion.city_code;
			param.sale_code = fusion.market_code;
			param.sale_name = fusion.market_name;
			param.address = fusion.address;
			//var params = JSON.stringify(param);
			Local.saveStoreJson("fusionParam", param);
			window.location.href = "#/fusionTwoPage";
			//Local.getStoreJson("fusionParam");
			//location.href = "#/fusionTwoPage/"+params;
		}

		/**
		 * 融合业务类型选择
		 * @param name 类型名字
		 */
		function fusionType(name) {
			fusion.type = name;
			//新装宽带
			if (name != "" && name == fusion.newType) {
				$("#selectCity").show();
				$("#nextPage").hide();
				//ysb_shade("正在加载数据，请稍候……");
				$rdcp.request(
					"!ESale/Mobile/Business/VirtualService/Phone/Amalgamation/~query/Q_CITY_RES", //url
					{}, //parms
					function(data) {
						if (data.header && data.header.code == 0) {
							var rows = data.body.rows;
							if (rows.length == 0) {
								alert("温馨提示", "加载城市失败");
								return;
							}
							$scope.typeRows = rows;
						} else {
							//ysb_alert("错误", "加载数据出错！");
							alert("错误", "加载数据出错！");
						}
					});
			}
			//已有宽带
			else {
				fusion.address = "";
				fusion.city_code = "";
				fusion.market_code = "";
				fusion.market_name = "";
				$("#selectCity,#marketingSelect,#addressSelect").hide();
				$("#nextPage").show();
			}
		}

		/**
		 * 选择城市，加载营销中心
		 * @param cityCode 城市CODE
		 */
		function selectCity(cityCode) {
			fusion.city_code = cityCode; //保存选择的城市名称
			$("#marketingSelect").show();
			$("#addressSelect").hide();
			//ysb_shade("正在加载数据，请稍候……");
			$rdcp.request(
				"!ESale/Mobile/Business/VirtualService/Phone/Amalgamation/~query/Q_SALE_RES", //url
				{
					city: cityCode
				}, //parms
				function(data) {
					//ysb_unshade();
					if (data.header && data.header.code == 0) {
						var rows = data.body.rows;
						if (rows.length == 0) {
							//ysb_alert("温馨提示", "没有营销中心数据");
							alert("温馨提示", "没有营销中心数据");
							return;
						}
						$scope.marketRows = rows;
					} else {
						alert("错误", "加载数据出错！");
					}
				});
		}

		/**
		 * 选择营销中心，加载标准地址
		 * @param id
		 */
		function selectMarketCenter(id, name) {
			fusion.market_code = id;
			fusion.market_name = name;
			$("#addressSelect").show();
			$("#changAddr,#nextPage,#addressDataRows").hide();
		}

		/**
		 * 根据关键字搜索标准地址
		 */
		function searchAddress() {
			var keyword = $.trim($("#keyWord").val());
			if (keyword == "") {
				alert("温馨提示", "请输入地址关键字");
				return;
			}
			var params = {
				pageSize: "10",
				city: fusion.city_code,
				sale: fusion.market_name,
				addr: keyword,
				page: $("#pageIndex").val()
			}
			$rdcp.request(
				"!ESale/Mobile/Business/VirtualService/Phone/Amalgamation/~query/Q_ADDR_RES", //url
				params, //parms
				function(data) {
					if (data.header && data.header.code == 0) {
						changAddr(data);
						var rows = data.body.rows;
						if (rows.length == 0) {
							alert("温馨提示", "找不到相关的标准地址");
							return;
						}
						$scope.addressData = rows;
					} else {
						alert("错误", "加载数据出错！");
					}
				});
			$("#nextPage").hide();
		}

		/**
		 * 换一组地址
		 * @param data
		 */
		function changAddr(data) {
			$("#addressDataRows").show();
			var page = parseInt(data.body.page);
			var count = parseInt(data.body.pageCount);
			if (count > 1) {
				$("#changAddr").show();
			} else {
				$("#changAddr").hide();
			}
			if (page >= count)
				page = 1;
			else
				page++;
			$("#pageIndex").val(page);
		}
	}
]);