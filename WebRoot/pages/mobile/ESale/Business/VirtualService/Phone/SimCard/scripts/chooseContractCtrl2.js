app.registerCtrl("ChooseContractCtrl2", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		
		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		//路由转换
		app.when("/chooseContract", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/chooseContract.html",
			controller: "ChooseContractCtrl"
		});

		$rootScope.appTitle = "办合约";

		//路由转换
		app.when("/chooseContract3", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/chooseContract3.html",
			controller: "ChooseContractCtrl3"
		});

		//跳转处理
		$scope.chooseContract3 = function() {
			Local.saveStoreJson("contractparam", $scope.form);
		}

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

		//加载后，发送广播，让第一个div可见
		setTimeout(function() {
			$scope.$broadcast("ActiveLayoutCtrl", 1);
		}, 100);

		//下一页
		$scope.nextPage = function() {
			Local.saveStoreJson("form", $scope.form);
			window.location.href = "#/chooseContract3";
		}
	}
]);

//活动类型
app.registerCtrl("ActiveLayoutCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载数据
		$scope.loadMessage = function() {
			$srhttp.post("!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_HY_ACTI_TYPE", {
				id: $scope.form.productId
			}, function(data) {
				if (data.header.code == 0) {
					$scope.row1 = data.body.rows;
				}
				if (data.body.rows.length == 1) {
					$scope.form.active_type_id = $scope.row1[0].ID; //套餐名称ID
					$scope.form.active_type_name = $scope.row1[0].NAME; //套餐名称名称
					console.log("套餐名称id:" + $scope.form.active_type_id);
					console.log("套餐名称name:" + $scope.form.active_type_name);

					$rootScope.$broadcast('PackageTypeLayoutCtrl', 1);
					$rootScope.$broadcast('PackageNameLayoutCtrl', 2);
					$rootScope.$broadcast('FeeLayoutCtrl', 2);
					$rootScope.$broadcast('InfoLayoutCtrl', 2);
					$("#nextBtn").hide();
					$("#info").hide();
				}
			});
		}

		//选择
		$scope.active_select = function(id) {
			var a = $("#active_select_id_" + (id));
			$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
			$scope.form.active_type_id = $(a).attr("data"); //活动ID
			$scope.form.active_type_name = $(a).text().trim(); //活动名称 
			console.log("活动ID:" + $scope.form.active_type_id);
			console.log("活动名称:" + $scope.form.active_type_name);

			//发送广播
			$rootScope.$broadcast('PackageTypeLayoutCtrl', 1);
			$rootScope.$broadcast('PackageNameLayoutCtrl', 2);
			$rootScope.$broadcast('FeeLayoutCtrl', 2);
			$rootScope.$broadcast('InfoLayoutCtrl', 2);
			$("#nextBtn").hide();
			$("#info").hide();
		}

		//接收广播
		$scope.$on('ActiveLayoutCtrl', function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				$("#activeLayoutDiv").show();
			} else {
				$("#activeLayoutDiv").hide();
			}
		});
	}
]);

//套餐类型
app.registerCtrl("PackageTypeLayoutCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载数据
		$scope.loadMessage = function() {
			$srhttp.post("!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_HY_PACKAGE_TYPE", {
				"id": $scope.form.productId,
				"acti_type": $scope.form.active_type_id
			}, function(data) {
				if (data.header.code == 0) {
					$scope.row1 = data.body.rows;
					if (data.body.rows.length == 1) {
						$scope.form.package_type_id = $scope.row1[0].ID; //套餐名称ID
						$scope.form.package_type_name = $scope.row1[0].NAME; //套餐名称名称
						console.log("套餐名称id:" + $scope.form.package_type_id);
						console.log("套餐名称name:" + $scope.form.package_type_name);

						$rootScope.$broadcast('PackageNameLayoutCtrl', 1);
						$rootScope.$broadcast('FeeLayoutCtrl', 2);
						$rootScope.$broadcast('InfoLayoutCtrl', 2);
						$("#nextBtn").hide();
						$("#info").hide();
					}
				}
			});
		}

		//选择
		$scope.packageType_select = function(id) {
			var a = $("#packageType_select_id_" + (id));
			$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
			$scope.form.package_type_id = $(a).attr("data"); //套餐类型ID
			$scope.form.package_type_name = $(a).text().trim(); //套餐类型名称
			console.log("套餐类型id:" + $scope.form.package_type_id);
			console.log("套餐类型name:" + $scope.form.package_type_name);

			//发送广播
			$rootScope.$broadcast('PackageNameLayoutCtrl', 1);
			$rootScope.$broadcast('FeeLayoutCtrl', 2);
			$rootScope.$broadcast('InfoLayoutCtrl', 2);
			$("#nextBtn").hide();
			$("#info").hide();
		}

		//接收广播
		$scope.$on('PackageTypeLayoutCtrl', function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				$("#PackageTypeLayoutDiv").show();
			} else {
				$("#PackageTypeLayoutDiv").hide();
			}
		});
	}
]);

//套餐名称
app.registerCtrl("PackageNameLayoutCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载数据
		$scope.loadMessage = function() {
			$srhttp.post("!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_HY_PACKAGE_NAME", {
				"id": $scope.form.productId,
				"acti_type": $scope.form.active_type_id,
				"package_type": $scope.form.package_type_id
			}, function(data) {
				if (data.header.code == 0) {
					$scope.row1 = data.body.rows;
					if (data.body.rows.length == 1) {
						$scope.form.package_name_id = $scope.row1[0].ID; //套餐名称ID
						$scope.form.package_name_name = $scope.row1[0].NAME; //套餐名称名称
						console.log("套餐名称id:" + $scope.form.package_name_id);
						console.log("套餐名称name:" + $scope.form.package_name_name);

						$rootScope.$broadcast('FeeLayoutCtrl', 1);
						$rootScope.$broadcast('InfoLayoutCtrl', 2);
						$("#nextBtn").hide();
						$("#info").hide();
					}
				}
			});
		}

		//选择
		$scope.packageName_select = function(id) {
			var a = $("#packageName_select_id_" + (id));
			$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
			$scope.form.package_name_id = $(a).attr("data"); //套餐名称ID
			$scope.form.package_name_name = $(a).text().trim(); //套餐名称名称
			console.log("套餐名称id:" + $scope.form.package_name_id);
			console.log("套餐名称name:" + $scope.form.package_name_name);

			$rootScope.$broadcast('FeeLayoutCtrl', 1);
			$rootScope.$broadcast('InfoLayoutCtrl', 2);
			$("#nextBtn").hide();
			$("#info").hide();
		}

		//接收广播
		$scope.$on('PackageNameLayoutCtrl', function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				$("#PackageNameLayoutDiv").show();
			} else {
				$("#PackageNameLayoutDiv").hide();
			}
		});
	}
]);

//合约惠机，价格
app.registerCtrl("FeeLayoutCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载数据
		$scope.loadMessage = function() {
			$srhttp.post("!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_HY_FEE", {
				"id": $scope.form.productId,
				"acti_type": $scope.form.active_type_id,
				"package_type": $scope.form.package_type_id,
				"package_name": $scope.form.package_name_id
			}, function(data) {
				if (data.header.code == 0) {
					$scope.row1 = data.body.rows;
					if (data.body.rows.length == 1) {
						$scope.form.FEE = $scope.row1[0].ID; //套餐名称ID
						$scope.form.FEE_NAME = $scope.row1[0].NAME; //套餐名称名称
						console.log("套餐名称id:" + $scope.form.FEE);
						console.log("套餐名称name:" + $scope.form.FEE_NAME);
						$("#info").show();

						$rootScope.$broadcast('InfoLayoutCtrl', 1);
						$("#nextBtn").show();
					}

					$scope.form.LLB = $scope.row1[0].LLB; //流量包
					$scope.form.YYB = $scope.row1[0].YYB; //语音包
					$scope.form.PERIODS = $scope.row1[0].PERIODS; //期数
					$scope.form.FEE_INIT = $scope.row1[0].FEE_INIT; //初始价格
					$scope.form.CONTRACT_TYPE = $scope.row1[0].NAME; //合约赠送话费
				}
			});
		}

		//选择
		$scope.fee_select = function(id) {
			var a = $("#fee_select_id_" + (id));
			$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
			$scope.form.FEE = $(a).attr("data"); //合约惠机价格ID
			$scope.form.FEE_NAME = $(a).text().trim(); //合约惠机名称
			console.log("价格id:" + $scope.form.FEE);
			console.log("价格对应名称name:" + $scope.form.FEE_NAME);

			$("#info").show();

			$rootScope.$broadcast('InfoLayoutCtrl', 1);
			$("#nextBtn").show();
		}

		//接收广播
		$scope.$on('FeeLayoutCtrl', function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				$("#FeeLayoutDiv").show();
			} else {
				$("#FeeLayoutDiv").hide();
			}
		});
	}
]);

//套餐信息
app.registerCtrl("InfoLayoutCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载数据
		$scope.loadMessage = function() {
			$srhttp.post("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/common/Q_PACKAGE_CONFIG_PLAN", {
				"package_id": $scope.form.package_name_id
			}, function(data) {
				if (data.header.code == 0) {
					var packageId = data.body.rows[0].ID; //计划ID
					$scope.form.PLAN_NAME = data.body.rows[0].NAME; //计划名称
					$srhttp.post("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_DINNER_DETAIL_LIST", {
						"package_id": packageId
					}, function(data) {
						if (data.header.code == 0) {
							$scope.row1 = data.body.rows;
						}
					});
				}
			});


		}

		//接收广播
		$scope.$on('InfoLayoutCtrl', function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				$("#InfoLayoutDiv").show();
			} else {
				$("#InfoLayoutDiv").hide();
			}
		});
	}
]);