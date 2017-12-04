app.registerCtrl("ChooseContractCtrl3", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		
		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		$rootScope.appTitle = "办合约";

		$scope.form = {
			"productId": "", //产品ID
			"productName": "", //产品名
			"PACKAGE_ID": "", //产品套餐ID

			"active_type_id": "", //活动类型ID
			"active_type_name": "", //活动类型名称

			"package_type_id": "", //套餐类型ID
			"package_type_name": "", //套餐类型名称

			"package_name_id": "", //详细套餐ID
			"package_name_name": "", //详细套餐名称

			"FEE": "", //合约惠机价格ID
			"FEE_NAME": "", //合约惠机名称

			"goodsId": "", //号码goosdID
			"PHONE_NUMBER": "", //号码
			"numType": "ChinaUnicom.Account.4G.BK", //4G白卡

			"CUSTOMER_NAME": "", //客户姓名
			"CERT_ADDRESS": "", //证件地址
			"CONTACT_MAN": "", //联系人
			"ISS_USING": "", //签发机关
			"CONTACT_PHONE": "", //联系电话
			"POSTAL_ADDRESS": "", //通讯地址
			"GENDER": "", //性别
			"CERT_NUMBER": "", //证件号码

			"ID_PIC_FRONT": "", //身份证正面照片
			"ID_PIC_BACK": "", //身份证反面照片

			"CERT_VALID_FROM": "", //证件有效期开始
			"CERT_VALID_TO": "", //证件有效期结束

			"FIRST_MONTH_FEE_NAME": "全月", //首月资费
			"PLAN_NAME": "", //计划名称

			"TERMINAL_SN": "", //终端串号
			"LLB": "", //流量包
			"YYB": "", //语音包
			"PERIODS": "", //期数
			"FEE_INIT": "", //预存款最低额度
			"money": "", //预存款
			"CONTRACT_TYPE": "", //合约赠送话费
			"productInfo": "" //首月支付类型ID
		}

		//获取上一页传递过来的参数
		$scope.form = Local.getStoreJson("form");

		//页码
		$scope.page = 1;
		//页面显示数目
		$scope.pageSize = 12;

		$scope.result = [];

		$scope.form.numType = "ChinaUnicom.Account.4G.BK";

		//路由转换
		app.when("/chooseContract2", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/chooseContract2.html",
			controller: "ChooseContractCtrl2"
		});
		//路由转换
		app.when("/chooseContract4", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/chooseContract4.html",
			controller: "ChooseContractCtrl4"
		});

		//跳转处理
		$scope.chooseContract4 = function(index) {
			var a = "#selectNumber_" + index;
			$scope.form.goodsId = $(a).attr("data");
			$scope.form.PHONE_NUMBER = $(a).attr("name");
			console.log("号码ID为：" + $scope.form.goodsId);
			console.log("号码为：" + $scope.form.PHONE_NUMBER);

			$scope.lock();
		}

		//锁卡,隐藏本DIV,显示下一个DIV
		$scope.lock = function() {
			$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~java/Number.lock", {
				"id": $scope.form.goodsId
			}, function(data) {
				if (data.header.code == 0) {
					Local.saveStoreJson("form", $scope.form);
					window.location.href = "#/chooseContract4";
				} else {
					alert("号码锁定异常，请刷新后重试");
					return false;
				}
			});
		}

		//加载页面
		$scope.getPage = function() {

			$srhttp.get("!ESale/Mall/Goods/~query/Q_GOODS_NUMBER_COMMON", {
				"businessId": $scope.form.numType,
				"pageSize": $scope.pageSize,
				"page": $scope.page
			}, function(data) {
				if (data.body.rows.length == 0) {
					$("#more").text("没有数据");
				}
				if (data.body.rows.length < $scope.pageSize) {
					$("#more").text("加载完毕");
				}
				if ($scope.results == null) {
					$scope.results = data.body.rows;
				} else {
					$scope.results = $scope.results.concat(data.body.rows);
				}

				if ($scope.results.length == 0) {
					alert("没有可用的产品可供选择");
				}
			}, {
				mask: true
			});

		}

		$scope.getPage();

		$scope.search = function() {
			$scope.query = $scope.queryparam;
			$scope.page = 1;
			$sscope.getPage();
		}

		$scope.more = function() {
			$scope.page = $scope.page + 1;
			$scope.getPage();
		}


	}
]);