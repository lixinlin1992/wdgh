app.registerCtrl("ChooseContractCtrl", ["$scope", "$srhttp","$rootScope",
	function($scope, $srhttp,$rootScope) {
		
		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);
		
		//页码
		$scope.page = 1;

		//页面显示数目
		$scope.pageSize = 8;

		$scope.imgScr = APP_CONFIG.SERVER_URL + "!service/file/~java/Downloader.get?id=";
		
		$rootScope.appTitle = "办合约";

		//路由转换
		app.when("/chooseContract2", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/chooseContract2.html",
			controller: "ChooseContractCtrl2"
		});

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

		//跳转处理
		$scope.nextPage = function($index) {
			var id = "#product_" + $index;
			$scope.form.productId = $(id).attr("data");
			$scope.form.productName = $(id).text().trim();
			$scope.form.PACKAGE_ID = $(id).attr("packageId");
			console.log("产品ID为："+$scope.form.productId);
			console.log("产品名称为："+$scope.form.productName);
			console.log("产品套餐ID为："+$scope.form.PACKAGE_ID);
			
			Local.saveStoreJson("form", $scope.form);
			window.location.href = "#/chooseContract2";
		}

		//加载页面
		$scope.getPage = function() {

			$srhttp.post("!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_HY_PRODUCT", {
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

	}
]);