app.registerCtrl("FourGGroupOrderPackageCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		
		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		$rootScope.appTitle = "4G自由组合";

		//添加下一步跳转的链接
		app.when("/fourGGroupOrder_submit", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/fourGGroupOrder_submit.html",
			controller: "FourGGroupOrderSubmitCtrl"
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
				'key': '',
				'value': 'CU.Account.Card'
			},
			'POLICY': {
				'key': '4G自由组合',
				'value': 'CU.4G.GROUP'
			},
		}

		$scope.form = {

			"goodsId": "", //!号码ID+
			"quantity": "1", //！固定的值+

			"PHONE_NUMBER": "", //!选中的手机号码,中文+

			"package_name": "", //!套餐名称,为空不用传值+
			"package_id": "", //!套餐ID,为空不用传值+
			"PACKAGE_ESS_NAME": "", //!ESS名称,为空不用传值+
			"PACKAGE_ESS_CODE": "", //!ESS编码,为空不用传值+
			"POLICY_NAME": $scope.d.POLICY.key, //!政策,固定值+
			"FIRST_MONTH_FEE_NAME": "全月资费", //！首月支付类型,其值是中文+
			"INMINUSPACKAGES": "", //!语音包,中文+
			"INFLOWPACKAGES": "", //!流量包,中文+
			"INSMSPACKAGES": "", //!短信包,中文+
			"INCALLPACKAGES": "", //!来电显示,中文+
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
			"sureFee": 0, //!价格+
			"businessId": $scope.d.BUSINESSID.value, //!产品ID,定死的值+

			"CARD_PIC": "", //成卡照片
			"CARDNUMBER": "", //！成卡卡号+
			"productInfo": "" //首月支付类型ID
		};

		//获取前一个界面保存的数据
		$scope.form = Local.getStoreJson("formParams");
		$scope.numType = Local.getStoreJson("numTypeParams1");
		$scope.form.sureFee = 0; //价格初始化为0

		$scope.money = {
			"voiceMoney": 0,
			"flowMoney": 0,
			"smsMoney": 0,
			"callMoney": 0
		}

		//计算总价格
		$scope.countMoney = function() {
			$scope.form.sureFee = $scope.money.voiceMoney + $scope.money.flowMoney + $scope.money.smsMoney + $scope.money.callMoney;
		}

		//下一步的事件
		$scope.nextPage = function() {
			if ($scope.form.INMINUSPACKAGES == "") {
				alert("请先选择语音包");
				return;
			}
			if ($scope.form.INFLOWPACKAGES == "") {
				alert("请先选择流量包");
				return;
			}
			if ($scope.form.INSMSPACKAGES == "") {
				alert("请先选择短信包");
				return;
			}
			if ($scope.form.INCALLPACKAGES == "") {
				alert("请先选择来电显示");
				return;
			}
			Local.saveStoreJson("formParams", $scope.form);
			window.location.href = "#/fourGGroupOrder_submit";
		}

	}
]);

/*****全国语音包*/
app.registerCtrl("VoicePackageCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载数据
		$scope.loadMessage = function() {
			$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_INMINUTES_GROUP_LIST", {}, function(data) {
				if (data.header.code == 0) {
					$scope.rows1 = data.body.rows;
				}
			});
		}

		//点击事件
		$scope.a_select = function(id) {
			var a = $("#voice_select_id_" + (id + 1));
			if (a) {
				//修改样式
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
				$("#sms a").removeClass("com_selectbtnon");
				$("#call a").removeClass("com_selectbtnon");
				//修改选中项的值
				$scope.form.INMINUSPACKAGES = $(a).text();

				//计算价格
				$scope.money.voiceMoney = parseInt($(a).attr("fee"));
				$scope.money.flowMoney = 0;
				$scope.money.smsMoney = 0;
				$scope.money.callMoney = 0;
				$scope.countMoney();

				//发送广播
				$rootScope.$broadcast('FlowPackageCtrl', 1);
				$rootScope.$broadcast('SmsPackageCtrl', 2);
				$rootScope.$broadcast('CallPackageCtrl', 2);
				$rootScope.$broadcast('MonthPackageCtrl', 2);

				//将此选项卡下面的值清空掉，防止用户恶意点击
				$scope.form.INFLOWPACKAGES = "";
				$scope.form.INSMSPACKAGES = "";
				$scope.form.INCALLPACKAGES = "";

				//修改下一步的样式--可见不可见
				$("#nextBtn").hide();
			}
		}

		$scope.loadMessage();

		/*//接收广播
		$scope.$on('VoicePackageCtrl', function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				$("#voice").show();
			} else {
				$("#voice").hide();
			}
		});*/
	}
]);

/*****全国流量包*/
app.registerCtrl("FlowPackageCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载数据
		$scope.loadMessage = function() {
			$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_INFLOW_GROUP_LIST", {}, function(data) {
				if (data.header.code == 0) {
					$scope.rows2 = data.body.rows;
				}
			});
		}

		//点击事件
		$scope.a_select = function(id) {
			var a = $("#flow_select_id_" + (id));
			if (a) {
				//修改样式
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
				$("#sms a").removeClass("com_selectbtnon"); /*这行为特殊行*/

				//修改选中项的值
				$scope.form.INFLOWPACKAGES = $(a).text();

				//计算价格
				$scope.money.flowMoney = parseInt($(a).attr("fee"));
				$scope.money.smsMoney = 0;
				$scope.money.callMoney = 0;
				$scope.countMoney();

				//发送广播
				$rootScope.$broadcast('SmsPackageCtrl', 1);
				$rootScope.$broadcast('CallPackageCtrl', 2);
				$rootScope.$broadcast('MonthPackageCtrl', 2);

				//将此选项卡下面的值清空掉，防止用户恶意点击
				$scope.form.INSMSPACKAGES = "";
				$scope.form.INCALLPACKAGES = "";

				//修改下一步的样式--可见不可见
				$("#nextBtn").hide();
			}
		}

		//接收广播
		$scope.$on('FlowPackageCtrl', function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				$("#flow").show();
			} else {
				$("#flow").hide();
			}
		});
	}
]);

/*****共享短信包*/
app.registerCtrl("SmsPackageCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载数据
		$scope.loadMessage = function() {
			$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_INSMS_GROUP_LIST", {}, function(data) {
				if (data.header.code == 0) {
					$scope.rows3 = data.body.rows;
				}
			});
		}

		//点击事件
		$scope.a_select = function(id) {
			var a = $("#sms_select_id_" + (id + 1));
			if (a) {
				//修改样式
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
				$("#call a").removeClass("com_selectbtnon"); /*这行为特殊行*/

				//修改选中项的值
				$scope.form.INSMSPACKAGES = $(a).text();

				//计算价格
				$scope.money.smsMoney = parseInt($(a).attr("fee"));
				$scope.money.callMoney = 0;
				$scope.countMoney();

				//发送广播
				$rootScope.$broadcast('CallPackageCtrl', 1);
				$rootScope.$broadcast('MonthPackageCtrl', 2);

				//将此选项卡下面的值清空掉，防止用户恶意点击
				$scope.form.INCALLPACKAGES = "";

				//修改下一步的样式--可见不可见
				$("#nextBtn").hide();

			}
		}

		//接收广播
		$scope.$on('SmsPackageCtrl', function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				$("#sms").show();
			} else {
				$("#sms").hide();
			}
		});
	}
]);

/*****来电显示*/
app.registerCtrl("CallPackageCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		$scope.loadMessage = function() {
			$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_INCALL_GROUP_LIST", {}, function(data) {
				if (data.header.code == 0) {
					$scope.rows4 = data.body.rows;
				}
			});
		}

		//点击事件
		$scope.a_select = function(id) {
			var a = $("#call_select_id_" + (id + 1));
			if (a) {
				//修改样式
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");

				//修改选中项的值
				$scope.form.INCALLPACKAGES = $(a).text();

				//计算价格
				$scope.money.callMoney = parseInt($(a).attr("fee"));
				$scope.countMoney();

				//发送广播
				$rootScope.$broadcast('MonthPackageCtrl', 1);

				//修改下一步的样式--可见不可见
				$("#nextBtn").show();
			}
		}

		//接收广播
		$scope.$on('CallPackageCtrl', function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				$("#call").show();
			} else {
				$("#call").hide();
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