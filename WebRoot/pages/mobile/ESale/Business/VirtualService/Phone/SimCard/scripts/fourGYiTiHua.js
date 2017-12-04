app.registerCtrl("FourGYiTiHuaCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		$rootScope.appTitle = "4G一体化";

		//添加下一步跳转的链接
		app.when("/fourGYiTiHua_package", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/fourGYiTiHua_package.html",
			controller: "FourGYiTiHuaPackageCtrl"
		});

		$scope.numType = {
			"value": "ChinaUnicom.Account.4G.BK" //默认白卡
		}

		$scope.d = {
			'BRAND': {
				'key': '中国联通',
				'value': 'CU'
			},
			'BUSINESSID': {
				'key': '白卡开户',
				'value': 'ChinaUnicom.Account.4G.BK'
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
			"POLICY_NAME": "", //!政策,固定值+
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
			"businessId": $scope.numType.value, //!产品ID

			"CARD_PIC": "", //成卡照片
			"CARDNUMBER": "", //！成卡卡号+
			"productInfo": "" //首月支付类型ID
		};

	}
]);

/*****选号*/
app.registerCtrl("SelectNumberCtrl", ["$scope", "$srhttp", '$filter', '$rootScope',
	function($scope, $srhttp, $filter, $rootScope) {

		//搜索框里的文本值
		$scope.title = "";

		//默认查第1页
		$scope.page = 1;

		//查询到的订单列表
		$scope.orders = [];

		//查找区域
		$scope.areaId = "";

		$scope.request = {
			loadNumber: function() {
				//页面一加载，获取号码数据，默认白卡
				$srhttp.get("!ESale/Mall/Goods/~query/Q_GOODS_NUMBER_COMMON", {
					"businessId": $scope.form.businessId,
					"brandId": $scope.d.BRAND.value,
					"pageSize": 10,
					"page": 1,
					"areaId": $scope.areaId,
					"title": $scope.title,
					"priceorder":"priceLowToHigh"//排序
				}, function(data) {
					if (!data.body.pageCount == 0) {
						$scope.orders = data.body.rows;
					}
					//当无数据时，修改文本值
					if (data.body.rows == "") {
						$("a.more_btn").text("已无更多数据");
					}
				});
			}
		}

		$scope.request.loadNumber();



		//点击白卡,成卡
		$scope.showNumberBC = function() {
			$scope.page = 1;
			$scope.request.loadNumber();

			$("a.more_btn").text("点击加载更多数据");
		}

		//区域
		$srhttp.get("!ESale/Mall/Member/~query/Member.Q_AREA_LIST", {}, function(data) {
			$scope.address = data.body.rows;
		});

		//区域过滤
		addressChange = function() {
			$scope.areaId = $(".com_area .left option:selected").attr("data");

			if ($scope.areaId == "") {
				$scope.showNumberBC();
			} else {
				$scope.page = 1; //加载第一页
				$scope.request.loadNumber();

				$("a.more_btn").text("点击加载更多数据");
			}
		}

		//加载更多
		$scope.listShowAdd = function() {
			$scope.page = $scope.page + 1;
			$srhttp.get("!ESale/Mall/Goods/~query/Q_GOODS_NUMBER_COMMON", {
				"businessId": $scope.form.businessId,
				"brandId": $scope.d.BRAND.value,
				"pageSize": 10,
				"page": $scope.page,
				"areaId": $scope.areaId,
				"title": $scope.title,
				"priceorder":"priceLowToHigh"//排序
			}, function(data) {
				$scope.orders = $scope.orders.concat(data.body.rows);
				//当无数据时，修改文本值
				if (data.body.rows == "") {
					$("a.more_btn").text("已无更多数据");
				}
			});
		}

		//成卡和白卡交互样式 begin,白卡1，成卡2
		$scope.cardChange = function(type) {
			var addressName = $(".com_area .left select").val();
			//等于1==白卡，等于2==成卡
			if (type == 1) {
				$(".com_area .right a:first-child").addClass("choiceon_btn");
				$(".com_area .right a:last-child").removeClass("choiceon_btn");
				$scope.numType.value = "ChinaUnicom.Account.4G.BK";
				$scope.form.businessId = "ChinaUnicom.Account.4G.BK";
			} else {
				$(".com_area .right a:first-child").removeClass("choiceon_btn");
				$(".com_area .right a:last-child").addClass("choiceon_btn");
				$scope.numType.value = "ChinaUnicom.Account.4G.CK";
				$scope.form.businessId = "ChinaUnicom.Account.4G.CK";
			}

			//重置下拉区域列表
			$(".com_area .left select option:first").attr("selected", "selected");

			//清空搜索区域里的值
			$scope.title = "";
			$(".search_text").val("");

			//重置页面
			$scope.page = 1;
			$scope.areaId = "";
			$scope.showNumberBC();
		};

		//搜索功能begin
		$scope.NumSearch = function() {
			$scope.page=1;
			$scope.request.loadNumber();

		};

		//选号功能,为goodID赋值，为PHONE_NUMBER赋值，锁卡
		$scope.selectNumber = function(index) {
			var a = "#selectNumber_" + index;
			$scope.form.goodsId = $(a).attr("data");
			$scope.form.PHONE_NUMBER = $(a).attr("name");

			//写下数据
			Local.saveStoreJson("formParams", $scope.form);
			Local.saveStoreJson("numTypeParams4", $scope.numType);
			//锁卡
			$scope.lock();
		}

		//锁卡,隐藏本DIV,显示下一个DIV
		$scope.lock = function() {
			$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~java/Number.lock", {
				"id": $scope.form.goodsId
			}, function(data) {
				if (data.header.code == 0) {
					hrefJump('fourGYiTiHua_package');
				} else {
					alert("号码锁定异常，请刷新后重试");
					return false;
				}
			});
		}
	}
])