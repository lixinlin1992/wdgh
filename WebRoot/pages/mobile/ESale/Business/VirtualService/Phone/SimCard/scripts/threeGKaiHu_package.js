app.registerCtrl("ThreeGKaiHuPackageCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		
		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		$rootScope.appTitle = "3G开户";

		//添加下一步跳转的链接
		app.when("/threeGKaiHu_submit", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/threeGKaiHu_submit.html",
			controller: "ThreeGKaiHuSubmitCtrl"
		});

		$scope.numType = {
			"value": "ChinaUnicom.Account.3G.BK" //默认白卡
		}

		$scope.d = {
			'BRAND': {
				'key': '中国联通',
				'value': 'CU'
			},
			'BUSINESSID': {
				'key': '白卡开户',
				'value': 'ChinaUnicom.Account.3G.BK'
			}
		}

		$scope.form = {

			"goodsId": "", //!号码ID+
			"quantity": "1", //！固定的值+

			"PHONE_NUMBER": "", //!选中的手机号码,中文+

			"package_name": "", //!套餐名称,为空不用传值+
			"package_id": "", //!套餐ID,为空不用传值+
			"PACKAGE_ESS_NAME": "", //!ESS名称,为空不用传值+
			"PACKAGE_ESS_CODE": "", //!ESS编码,为空不用传值+
			"POLICY_NAME": "3G开户", //!政策,固定值+
			"FIRST_MONTH_FEE_NAME": "全月资费", //！首月支付类型,其值是中文+
			"FIRST_MONTH_FEE": "0", //支付费用 
			"CardID": "", //身份证ID,这个不是身份证号码，是从数据库读到的ID+
			"NOTE": "", //！备注+

			"CUSTOMER_NAME": "", //！客户姓名+
			"CERT_TYPE": "", //！证件类型ID,访问接口读回来的，!ESale/Business/VirtualService/Phone/SimCard/~query/potal/Q_CERT_TYPE_LIST
			"CERT_TYPE_NAME": "", //！证件类型的中文名称，一般只有身份证，但有可能后期添加一些别的+
			"CERT_ADDRESS": "", //！证件地址+
			"CONTACT_MAN": "", //！联系人，跟客户姓名是一样的+
			"CONTACT_PHONE": "", //！联系电话+
			"ISS_USING": "", //！签发机关+
			"POSTAL_ADDRESS": "", //！通讯地址+
			"GENDER": "男", //！性别+
			"CERT_NUMBER": "", //！证件号码+

			"ID_PIC_FRONT": "", //身份证正面照片+
			"ID_PIC_BACK": "", //身份证反面照片+
			"ID_PIC_PEO": "", //手持照片+

			"CERT_VALID_FROM": "", //！证件有效期开始+
			"CERT_VALID_TO": "", //！证件有效期结束+
			"businessId": "", //!产品ID

			"CARD_PIC": "", //成卡照片
			"CARDNUMBER": "", //！成卡卡号+
			"productInfo": "", //首月支付类型ID
			"packageFee":""//费用选择
		};

		//获取前一个界面保存的数据
		$scope.form = Local.getStoreJson("formParams");
		$scope.numType = Local.getStoreJson("numTypeParams3");
		$scope.form.businessId = $scope.numType.value;

		//下一步的事件
		$scope.nextPage = function() {
			Local.saveStoreJson("formParams", $scope.form);
			window.location.href = "#/threeGKaiHu_submit";
		}
	}
]);

/*****3G开户--套餐类型*/
app.registerCtrl("ThreeGOpenOrderCtrl", ["$scope", "$srhttp", "$rootScope",

	function($scope, $srhttp, $rootScope) {

		//加载数据
		$scope.loadMessage = function() {
			$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_2G_3G_DINNER_LIST", {
				"businessId": $scope.form.businessId,
				"typeId": $("#typeId").val() //这里的typeId哪来的我也不知道，结果是underfind,旧的jsp也是underfind
			}, function(data) {
				if (data.header.code == 0) {
					$scope.rows1 = data.body.rows;
				}
			});
		}

		//套餐选择
		$scope.taocan_select = function(id) {
			var a = $("#taocan_select_id_" + (id));
			$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");

			//修改表单的值
			$scope.form.package_name = $(a).text();
			$scope.form.CODE_NUM = $scope.rows1[id].CODE_NUM;
			$scope.form.package_id=$scope.form.CODE_NUM;
			console.log("套餐名：" + $scope.form.package_name);
			console.log("套餐ID：" + $scope.form.package_id);

			//发送广播
			$rootScope.$broadcast('ThreeGDinnerCtrl', 1);
			$rootScope.$broadcast('MonthPackageCtrl', 2);

			//修改下一步的样式--可见不可见
			$("#nextBtn").hide();
		}

		$scope.loadMessage();
	}
]);

/*****3G开户套餐--价格选项卡*/
app.registerCtrl("ThreeGDinnerCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {

		//加载数据
		$scope.loadMessage = function() {
			$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/potal/Q_3GDINNER_LIST", {}, function(data) {
				if (data.header.code == 0) {
					$scope.rows2 = data.body.rows;
				}
			});
		}

		//点击事件
		$scope.price_select = function(id) {
			var a = $("#price_select_id_" + (id));
			$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
			//套餐价格
			$scope.form.packageFee = $(a).text();
			$scope.form.FIRST_MONTH_FEE = $(a).attr("data");
			
			$scope.form.PACKAGE_ESS_NAME=$(a).attr("essName");
			$scope.form.PACKAGE_ESS_CODE=$(a).attr("essCode");
			
			console.log("费用选择为："+$scope.form.packageFee);
			console.log("首月支付：" + $scope.form.FIRST_MONTH_FEE);
			console.log("essname："+$scope.form.PACKAGE_ESS_NAME);
			console.log("esscode：" + $scope.form.PACKAGE_ESS_CODE);

			//发送广播
			$rootScope.$broadcast('MonthPackageCtrl', 1);

			//修改下一步的样式--可见不可见
			$("#nextBtn").show();
		}

		//接收广播
		$scope.$on('ThreeGDinnerCtrl', function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				$("#threeGPrice").show();
			} else {
				$("#threeGPrice").hide();
			}
		});
	}
]);


/*****首月资费*/
app.registerCtrl("MonthPackageCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {

		//点击事件
		$scope.month_select = function(id) {
			var a = $("#month_select_id_" + (id));
			$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
			$scope.form.FIRST_MONTH_FEE_NAME = $(a).text();
			
			if ($scope.form.FIRST_MONTH_FEE_NAME == "套外资费") {
				$scope.form.productInfo = "1";
			} else if ($scope.form.FIRST_MONTH_FEE_NAME == "半月资费") {
				$scope.form.productInfo = "2";
			} else {
				$scope.form.productInfo = "3";
			}
			console.log("$scope.form.productInfo:"+$scope.form.productInfo);
		}

		//接收广播
		$scope.$on('MonthPackageCtrl', function(event, data) {
			if (data == 1) {
				$("#month").show();
			} else {
				$("#month").hide();
			}
		});
	}
]);