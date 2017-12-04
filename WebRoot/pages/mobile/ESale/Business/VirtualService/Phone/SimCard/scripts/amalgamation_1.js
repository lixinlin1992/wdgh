var imgData = {
	"front": '',
	'contrary': '',
	'hand': '',
	'configId': '',
	'robID': ""
};

var myPhoto = {};
var isWojiating = false; //判断是不是沃家庭、宽带新装或者续趸中的一种，只要不是智慧沃家这个值就为true
var isNew = true; //保存用户选择的是加装还是新装，默认是新装 true
var isConfig = false;
var isRob = false;
var isXudun = false; //判断用户选择的业务类型是不是续趸
var other;
var feeStandardRowCount = 0;
app.registerCtrl("amalgamation1Ctrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		myPhoto.request = $srhttp.request;
		myPhoto.post = $srhttp.post;

		$rootScope.appTitle = "做融合";
		//添加下一步跳转的链接
		app.when("/amalgamation_2", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/amalgamation_2.html",
			controller: "amalgamation2Ctrl"
		});
		resetBusinessClass();
		$scope.orderList = {
			businessID: "", //业务类型
			packageID: "", //套餐类型
			packageName: "", //套餐名
			netTypeID: "", //宽带类型
			netTypeValue: "", //宽带
			speedID: "", //速率
			speedValue: "", //
			feeID: "", //费用类型
			feeTypeValue: "", //费用类型名
			feeStandardID: "", //费用标准
			businessName: "",
			IDCARD_ID: "", //身份证ID，不是身份证号码，此ID为用户身份证信息存入数据库时数据库产生的ID
			isA: false,

			userNumber: "",
			address: "", //装机地址
			config: "",
			contactName: "", //联系人
			telephone: ""
		}

		$scope.form = {
			"CUSTOMER_NAME": "", //客户姓名
			"CERT_NUMBER": "", //证件号码
			"CERT_ADDRESS": "", //证件地址
			"ISS_USING": "", //签发机关

			"GENDER": "男", //性别
			"NATION": "汉", //民族

			"CERT_VALID_FROM": "", //证件有效期开始
			"CERT_VALID_TO": "", //证件有效期结束
			"FRONT": "", //正面照
			"BACK": "", //反面
			"HAND": "", //手持
			"NOTE": "" //备注
		}

		//验证图片识别权限和蓝牙读取权限，成功
		$scope.loadBtnAccess = function() {
			var param = {
				"business_id": "ChinaUnicom.Account",
				"service_id": "REAL_NAME_AUTHENTICATION",
				"group_id": "ID_INFO",
				"code": "ID_CARD_TYPE"
			};
			$srhttp.get("!System/Core/Member/~java/MemberConfig.getConfig", param, function(data) {
				if (data.header.code == "0") {
					if (data.body.VALUE != undefined && data.body.VALUE != "") {
						if (data.body.VALUE == "1") { //如果只有图片识别权限
							$("#btnAccess").val("1");
							$("#ocrDiv").css("display", "block");
							$("#frontDiv").css("display", "block");
							$("#contraryDiv").css("display", "block");
							$("#bluetoothDiv").css("display", "none");
						} else if (data.body.VALUE == "2") { //或者如果只有蓝牙读取权限
							$("#btnAccess").val("2");
							$("#bluetoothDiv").css("display", "block");
							$("#ocrDiv").css("display", "none");
							$("#new_img_front").hide(); //移除拍照事件
							$("#new_img_contrary").hide();
							$("#front").hide();
							$("#contrary").hide();
							$("#picTitle").text("请使用蓝牙二合一设备读取身份证信息");
						} else if (data.body.VALUE == "3") { //或者图片识别与蓝牙读取权限都有
							$("#btnAccess").val("3");
							$("#ocrDiv").css("display", "block");
							$("#bluetoothDiv").css("display", "block");
							$("#frontDiv").css("display", "block");
							$("#contraryDiv").css("display", "block");
						} else { //或者其他情况
							$("#btnAccess").val("1");
							$("#ocrDiv").css("display", "block");
							$("#frontDiv").css("display", "block");
							$("#contraryDiv").css("display", "block");
						}
					}
				} else {
					$("#btnAccess").val("1");
					$("#ocrDiv").css("display", "block");
					$("#frontDiv").css("display", "block");
					$("#contraryDiv").css("display", "block");
				}
			});
		}

		//验证 是否有身份证号码修改权限，成功
		$scope.loadIDcardNumReviseAccess = function() {
			var param = {
				"business_id": "ChinaUnicom.Account",
				"service_id": "REAL_NAME_AUTHENTICATION",
				"group_id": "ID_INFO",
				"code": "ID_CARD_MODIFICATION"
			};
			$srhttp.get("!System/Core/Member/~java/MemberConfig.getConfig", param, function(data) {
				if (data.header.code == "0") {
					if (data.body.VALUE != undefined && data.body.VALUE != "") {
						if (data.body.VALUE == "1") { //如果有身份证号码的修改权限
							$("#cert_number").removeAttr("readonly");
							$("#customer_name").removeAttr("readonly");
						} else if (data.body.VALUE == "0") { //如果没有身份证号码的修改权限
							$("#cert_number").attr("readonly", "readonly");
							$("#customer_name").attr("readonly", "readonly");
						}
					}
				} else {
					$("#cert_number").attr("readonly", "readonly");
					$("#customer_name").attr("readonly", "readonly");
				}
			});
		}

		$scope.loadBtnAccess();

		$scope.loadIDcardNumReviseAccess();

		//使用系统自带的照相功能上传图片
		$scope.takePhoto = function(type) {
			var sessionId = Local.getStoreJson(sys.loginKey).body.sessionId; //会话id
			$('#progressBar').css("width", "0%").empty().append('0%');
			TakePhoneUpload("{'busiId':'Account','busiType':'APP','size':1000,'_param':'" + type + "','SESSIONID':'" + sessionId + "'}", "print");
		}

		//如果是iphone 则使用js上传的功能
		function changeUploadByTerminal() {
			if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
				$('#new_img_front').hide().prevAll().show();
				$('#new_img_contrary').hide().prevAll().show();
				$('#new_img_hand').hide().prevAll().show();
				$('#new_img_writeCard').hide().prevAll().show();
			}
		}

		changeUploadByTerminal();
	}
])
radioGroup
/******业务类型******/
app.registerCtrl("businessClassCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		$scope.loadMessage = function() {
			$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_BUSINESS_CLASS", {}, function(data) {
				if (data.body.rows.length <= 0) {
					alert("没有可用的业务类型!");
					return;
				} else if (data.header.code == 0) {
					$scope.businessClass = data.body.rows;
					//如果只有一个，则默认点击第一个
					if ($scope.businessClass.length == 1) {
						setTimeout(function() {
							$scope.select_businessClass(0);
						}, 100);
					}
				}
			});
		}
		$scope.loadMessage();
		$scope.select_businessClass = function(id) {
			var selectBtn = $("#flow_select_id_" + (id));
			isWojiating = false;
			isXudun = false;
			$(selectBtn).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
			//判断是否业务类型是否是 沃家庭
			if ($(selectBtn).text() != "智慧沃家") {
				isWojiating = true;
				if ($(selectBtn).text() == "续趸") {
					isXudun = true;
				}
			}
			//如果是沃家庭，则创建并添加新装 加装单选框
			if (isWojiating) {
				$("#radioGroup").show();
			} else {
				$("#radioGroup").hide();
			}
			$scope.orderList.businessID = $(selectBtn).attr("businessId");
			$scope.orderList.businessName = $(selectBtn).text().trim();
			//发送广播
			$rootScope.$broadcast("PackageCtrl");
		}

	}
]);

/******业务套餐******/
app.registerCtrl("PackageCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		$scope.loadMessage = function() {
			$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_BUSINESS_TYPE", {
				"business_id": $scope.orderList.businessID
			}, function(data) {
				if (data.body.rows.length <= 0) {
					alert("抱歉，" + $scope.orderList.businessName + "下没有相关的业务");
					return;
				} else if (data.header.code == 0) {
					$scope.package = data.body.rows;
					//如果只有一个，则默认点击第一个
					if ($scope.package.length == 1) {
						setTimeout(function() {
							$scope.select_package(0);
						}, 100);
					}
				}
				//$scope.$broadcast("pinPaiLayoutCtrl", 1);
			});
		}
		$scope.select_package = function(id) {
			var selectBtn = $("#package_select_id_" + (id));
			$(selectBtn).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
			$scope.orderList.packageID = $(selectBtn).attr("packageID");
			$scope.orderList.packageName = $(selectBtn).text().trim();
			//判断是否业务类型是 沃家庭 中的A套餐还是B套餐，并把值写入到变量中然后传递到第二个页面，默认不是
			if ($(selectBtn).text().trim() == "A套餐") {
				$scope.orderList.isA = "1"
			}
			//发送广播
			if (isWojiating) {
				$rootScope.$broadcast("BasicCtrl");
			} else { //当用户点击智慧沃家某套餐按钮时所做的处理
				$rootScope.$broadcast("FeeCtrl");
			}
		}
		$scope.$on("PackageCtrl", function() {
			resetPackage();
			$scope.loadMessage();
		})

	}
]);
/******基础信息******/
app.registerCtrl("BasicCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//装载宽带类型
		$scope.loadMessageNetType = function() {
				var param = {
					"pid": $scope.orderList.packageID,
					"business_id": $scope.orderList.businessID
				};
				$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_DATA_BY_PID", param, function(data) {
					if (data.body.rows.length <= 0) {
						alert("[" + $scope.orderList.packageName + "]下没有宽带类型!");
						return;
					} else if (data.header.code == 0) {
						$scope.netType = data.body.rows;
						//如果只有一个，则默认点击第一个
						if ($scope.netType.length == 1) {
							setTimeout(function() {
								$scope.netTypeSelect(0);
							}, 100);
						}
					}
					scrollToBottom();
				});
			}
			//加载速率
		$scope.loadMessageSpeed = function() {
			var param = {
				"pid": $scope.orderList.netTypeID,
				"business_id": $scope.orderList.businessID
			};
			$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_DATA_BY_PID", param, function(data) {
				if (data.body.rows.length <= 0) {
					alert("[" + $scope.orderList.netTypeValue + "]下没有可选速率!");
					return;
				} else if (data.header.code == 0) {
					$scope.speed = data.body.rows;
					//如果只有一个，则默认点击第一个
					if ($scope.speed.length == 1) {
						setTimeout(function() {
							$scope.speedSelect(0);
						}, 100);
					}
				}
				scrollToBottom();
			});
		}
		$scope.netTypeSelect = function(id) {
			var selectBtn = $("#netTypeSelect_id_" + id);
			$(selectBtn).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
			$scope.orderList.netTypeID = $(selectBtn).attr("netTypeID");
			$scope.orderList.netTypeValue = $(selectBtn).text().trim();
			$scope.loadMessageSpeed();
			resetBasic();
			resetSpeed();
		}
		$scope.speedSelect = function(id) {
			var selectBtn = $("#speedSelect_id_" + id);
			$(selectBtn).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
			$scope.orderList.speedID = $(selectBtn).attr("speedID");
			$scope.orderList.speedValue = $(selectBtn).text().trim();
			$rootScope.$broadcast("FeeCtrl");
		}
		$scope.$on("BasicCtrl", function() {
			resetBasic();
			resetNetType();
			$scope.loadMessageNetType();

		})
	}
]);
/******费用类型******/
app.registerCtrl("FeeCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//装载费用类型
		$scope.loadMessage = function() {
				var param = {
					"pid": $scope.orderList.speedID,
					"business_id": $scope.orderList.businessID
				};
				$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_DATA_BY_PID", param, function(data) {
					if (data.body.rows.length <= 0) {
						alert("!");
						return;
					} else if (data.header.code == 0) {
						$scope.feeType = data.body.rows;
						//如果只有一个，则默认点击第一个
						if ($scope.feeType.length == 1) {
							setTimeout(function() {
								$scope.feeSelect(0);
							}, 100);
						}
						resetFee();
						scrollToBottom();
					}
				});
			}
			//装载（智慧沃家）费用类型
		$scope.loadMessageZHWJ = function() {
			var param = {
				"business_type": $scope.orderList.packageID
			};
			$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_FEE_TYPE", param, function(data) {
				if (data.body.rows.length == 0) {
					alert("提示", "抱歉，[" + $scope.orderList.packageName + "] 下没有相关的业务");
					resetPackage();
					return;
				}
				resetFee();
				$scope.feeType = data.body.rows;
				//如果只有一个，则默认点击第一个
				if ($scope.feeType.length == 1) {
					setTimeout(function() {
						$scope.feeSelect(0);
					}, 100);
				}
			});
		}
		$scope.feeSelect = function(id) {
			var selectBtn = $("#feeSelect_id_" + id);
			$(selectBtn).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
			$scope.orderList.feeID = $(selectBtn).attr("feeID");
			$scope.orderList.feeTypeValue = $(selectBtn).text().trim();
			$rootScope.$broadcast("FeeStandardCtrl");
		}
		$scope.$on("FeeCtrl", function() {

			if (isWojiating) {
				$scope.loadMessage();
			} else { //如果是智慧沃家，就加载费用类型
				$scope.loadMessageZHWJ();

			}
		})
	}
]);

/******费用标准******/
app.registerCtrl("FeeStandardCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//装载费用类型
		$scope.loadMessage = function() {
			var param = {
				"type_id": $scope.orderList.feeID,
				"business_id": $scope.orderList.businessID
			};
			$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_GOODS_BY_TYPE", param, function(data) {
				if (data.body.rows.length <= 0) {
					resetFee();
					alert("[" + $scope.orderList.feeTypeValue + "]下没有费用标准!");
					return;
				} else if (data.header.code == 0) {
					resetFeeStandard();
					$scope.feeStandard = data.body.rows;
					//如果只有一个，则默认点击第一个
					if ($scope.feeStandard.length == 1) {
						setTimeout(function() {
							$scope.feeStandardSelect(0);
						}, 100);
					}
					scrollToBottom();
				}
			});
		}

		//点击智慧沃家费用类型按钮时所作的处理
		$scope.loadMessageZHWJ = function() {
			var param = {
				"fee_type": $scope.orderList.feeID
			};
			$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_FEE_GOODS", param, function(data) {
				if (data.body.rows.length <= 0) {
					resetFee();
					alert("[" + $scope.orderList.feeTypeValue + "]下没有费用标准!");
					return;
				} else if (data.header.code == 0) {
					resetFeeStandard();
					$scope.feeStandard = data.body.rows;
					//如果只有一个，则默认点击第一个
					if ($scope.feeStandard.length == 1) {
						setTimeout(function() {
							$scope.feeStandardSelect(0);
						}, 100);
					}
					scrollToBottom();
				}
			});
		}

		$scope.feeStandardSelect = function(id) {
			var selectBtn = $("#feeStandardSelect_id_" + id);
			$(selectBtn).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
			$scope.orderList.feeStandardID = $(selectBtn).attr("feeStandardID");
			resetConfig();

			scrollToBottom();
			$rootScope.$broadcast("FooterCtrl");
			//todo
			if (isWojiating) {
				//如果用户选择的业务类型是续趸，则不显示局向，以及零配置的内容
				if (isXudun) {
					$("#JuxiangInputDiv").hide();
					$("#configChooseDiv").hide();
					$("#configPicDIV").hide();
				} else {
					$("#JuxiangInputDiv").show();
					$("#configChooseDiv").show();
					if (isConfig) {
						$("#configPicDIV").show();
					}
				}
				$("#configLayoutDiv").show("normal");
				$("#IDCard").show("normal");
			} else { //智慧沃家
				$("#IDCard").show("normal");
				$("#form").show("normal");
				$("#nextBtn").text("下一步");
				$("#footer").show("normal");
				$("#section").removeAttr("class");
				scrollHeightToBottom("IDCard", 395);
			}

		}
		$scope.$on("FeeStandardCtrl", function() {

			if (isWojiating) {
				$scope.loadMessage();
			} else {
				$scope.loadMessageZHWJ();
			}
		})
	}
]);
/******当用户点击下一步（提交）按钮时调用******/
app.registerCtrl("FooterCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		$scope.nextPage = function() {
			if (isWojiating) {
				$scope.submitWojiating();
			} else {
				//todo 暂时隐藏，便于测试
				if (!$scope.validateIDPart())
					return;
				$scope.form.NOTE = $("#other").val();
				$scope.form.FRONT = imgData["front"];
				$scope.form.BACK = imgData["contrary"];
				$scope.form.HAND = imgData["hand"];

				//生成身份证ID
				$scope.cardForm = {
					"name": $scope.form.CUSTOMER_NAME,
					"gender": $scope.form.GENDER,
					"paper_addr": $scope.form.CERT_ADDRESS,
					"paper_num": $scope.form.CERT_NUMBER,
					"str_office": $scope.form.ISS_USING,
					"paper_stime": $scope.form.CERT_VALID_FROM,
					"paper_time": $scope.form.CERT_VALID_TO
				}
				$scope.orderList.IDCARD_ID = InsertIDCard($scope.cardForm);

				Local.saveStoreJson("form", $scope.form);
				Local.saveStoreJson("orderList", $scope.orderList);


				location.href = "#/amalgamation_2";
			}
		}

		/**
		 * 沃家庭 提交方法
		 */
		$scope.submitWojiating = function() {
				$scope.orderList.userNumber = $("#userNumber").val();
				$scope.orderList.address = $("#address").val();
				$scope.orderList.other = $("#other").val();

				if (!isNew && $scope.orderList.userNumber == "") {
					alert("提示", "请输入用户号码");
					$("#userNumber").focus();
					return;
				}

				if (!isXudun && $scope.orderList.address == "") {
					alert("提示", "请输入装机地址");
					$("#address").focus();
					return;
				}

				if (isConfig && imgData["configId"] == "") {
					alert("提示", "请上传配置照片");
					window.scrollTo(0, 0);
					return;
				}

				if (isRob && imgData["robID"] == "") {
					alert("提示", "请上传反抢照片");
					window.scrollTo(0, 0);
					return;
				}
				//生成身份证ID
				$scope.cardForm = {
					"name": $scope.form.CUSTOMER_NAME,
					"gender": $scope.form.GENDER,
					"paper_addr": $scope.form.CERT_ADDRESS,
					"paper_num": $scope.form.CERT_NUMBER,
					"str_office": $scope.form.ISS_USING,
					"paper_stime": $scope.form.CERT_VALID_FROM,
					"paper_time": $scope.form.CERT_VALID_TO
				}
				if (!$scope.validateIDPart())
					return;
				$scope.orderList.IDCARD_ID = InsertIDCard($scope.cardForm); //方法来源来simCard.js，后修改为在本js文件底部
				$scope.create_order();
			}
			/**
			 * 校验沃家庭和智慧沃家都需要校验的模块
			 * 也就是身份证模块和联系人、联系电话模块
			 * @returns: 如果全部校验通过，返回true,否则返回false
			 */
		$scope.validateIDPart = function() {
				$scope.orderList.contactName = $("#contactName").val();
				$scope.orderList.telephone = $("#telephone").val();
				//先校验身份证图片，然后校验联系人、联系电话

				if (imgData["front"] == "" || imgData["contrary"] == "") {
					alert("请蓝牙读取身份证信息");
					window.scrollTo(0, 0);
					return false;
				}
				if ($scope.orderList.contactName == "") {
					alert("请输入联系人");
					$("#contactName").focus();
					return false;
				}

				if ($scope.orderList.telephone == "") {
					alert("请输入联系电话");
					$("#telephone").focus();
					return false;
				}
				if (!$scope.checkMobile($scope.orderList.telephone)) {
					alert("联系电话格式不正确");
					$("#telephone").focus();
					return false;
				}
				return true;
			}
			//检验号码11位
		$scope.checkMobile = function(str) {
				var re = /^1\d{10}$/;
				return re.test(str);
			}
			/**
			 * 当用户点击提交按钮时，调用后台订单生成接口生成订单
			 */
		$scope.create_order = function() {
			var paramData = $scope.getOrderData();
			$srhttp.post("!ESale/Mall/Order/~java/Order.create", {
				"list": rdcp.json2str(paramData.list),
				"ext": rdcp.json2str(paramData.ext),
				"businessId": "ChinaUnicom.Amalgamation",
			}, function(data) {
				if (data.header.code == 0) {
					var creatorName = data.body["creator_member_name"];
					var devId = data.body["member_id"];
					Base.sendMessage(devId, creatorName + "的订单已经生成,请注意接收查看");
					alert("订单创建成功");
					window.location.href = '#/orders';
				} else {
					alert("提示", "订单创建失败！");
					$("#submitBtn").css("display", "block");
				}
			});
		}

		$scope.getOrderData = function() {
			var config = $("#config").val(); //局向输入框的值
			//var goodsId=$("[name='feeStandardBtn'][class='com_selectbtn com_selectbtnon']").attr("feeStandardID");
			//var netTypeValue=$("[name='netTypeBtn'][class='com_selectbtn com_selectbtnon']").text();
			//var speedValue=$("[name='speedBtn'][class='com_selectbtn com_selectbtnon']").text();
			//var feeTypeValue=$("[name='feeBtn'][class='com_selectbtn com_selectbtnon']").text();
			var comment = $("#other").val(); //其他里面的备注信息

			var result = {};
			result['list'] = {
				'list': [{
					'goodsId': $scope.orderList.feeStandardID,
					'quantity': '1'
				}]
			};

			result['ext'] = {
				'ext': {
					'BUSINESS': [{
						'key': 'BRAND_NAME',
						'val': "中国联通",
						'key_as': '运营商'
					}, {
						'key': 'businessName',
						'val': $scope.orderList.businessName,
						'key_as': '业务类型'
					}, {
						'key': 'address',
						'val': $scope.orderList.address,
						'key_as': '装机地址'
					}, {
						'key': 'NET_TYPE',
						'val': $scope.orderList.netTypeValue,
						'key_as': '宽带类型'
					}, {
						'key': 'kd_info1',
						'val': $scope.orderList.speedValue,
						'key_as': '速率'
					}, {
						'key': 'FEE_TYPE',
						'val': $scope.orderList.feeTypeValue,
						'key_as': '费用类型'
					}, {
						'key': 'CardID',
						'val': $scope.orderList.IDCARD_ID,
						'key_as': '身份证ID'
					}, ],
					'BASE': [{
						'key': 'CONTACT_MAN',
						'val': $scope.orderList.contactName,
						'key_as': '联系人'
					}, {
						'key': 'CONTACT_PHONE',
						'val': $scope.orderList.telephone,
						'key_as': '联系电话'
					}, {
						'key': 'CUSTOMER_NAME',
						'val': $scope.form.CUSTOMER_NAME,
						'key_as': '客户姓名'
					}, {
						'key': 'CERT_ADDRESS',
						'val': $scope.form.CERT_ADDRESS,
						'key_as': '证件地址'
					}, {
						'key': 'ISS_USING',
						'val': $scope.form.ISS_USING,
						'key_as': '签发机关'
					}, {
						'key': 'GENDER',
						'val': $scope.form.GENDER,
						'key_as': '性别'
					}, {
						'key': 'CERT_NUMBER',
						'val': $scope.form.CERT_NUMBER,
						'key_as': '证件号码'
					}, {
						'key': 'USER_NUMBER',
						'val': $scope.orderList.userNumber,
						'key_as': '用户号码'
					}, {
						'key': 'CONFIG',
						'val': config,
						'key_as': '局向'
					}, {
						'key': 'NOTE',
						'val': comment,
						'key_as': '备注'
					}],
					'BASE.IMG': [{
						'key': 'ID_PIC_FRONT',
						'val': imgData["front"],
						'key_as': '身份证正面照片'
					}, {
						'key': 'ID_PIC_BACK',
						'val': imgData["contrary"],
						'key_as': '身份证反面照片'
					}, {
						'key': 'ID_PIC_HAND',
						'val': imgData["hand"],
						'key_as': '手持身份证照片'
					}],
					'BASE.DATE': [{
							'key': 'CERT_VALID_FROM',
							'val': $scope.form.CERT_VALID_FROM,
							'key_as': '证件有效期开始'
						}, //证件有效日期开始
						{
							'key': 'CERT_VALID_TO',
							'val': $scope.form.CERT_VALID_TO,
							'key_as': '证件有效期结束'
						} //证件有效日期
					]
				}
			};

			if (isConfig) {
				result.ext.ext['BASE.IMG'].push({
					'key': 'ID_CONFIG',
					'val': imgData["configId"],
					'key_as': '零配置图片'
				});
			}

			if (isRob) {
				result.ext.ext['BASE.IMG'].push({
					'key': 'ID_ROB',
					'val': imgData["robID"],
					'key_as': '反抢图片'
				});
			}

			return result;
		}


		$scope.$on("FooterCtrl", function() {
			if (isWojiating) {
				$("#nextBtn").text("提交");
			} else { //如果是智慧沃家，则取出需要传到后面的参数并追加到URL后面，然后跳转
				//todo
				$("#nextBtn").text("下一步");
			}
		})
	}
]);

function resetBusinessClass() {
	$("#businessClassDiv").show();
	$("#businessClassDiv").nextAll().hide();
}

function resetPackage() {
	$("#packageLayoutDiv").show();
	$("#packageLayoutDiv").nextAll().hide();
}

function resetBasic() {
	$("#basicLayoutDiv").show();
	$("#basicLayoutDiv").nextAll().hide();
}

function resetNetType() {
	$("#netTypeLayoutDiv").show();
	$("#netTypeLayoutDiv").siblings().hide();
	if (!isNew) {
		$("#userNumberDiv").show("normal");
	} else {
		$("#userNumberDiv").hide("normal");
	}
	//如果用户选择的业务类型是续趸，则不显示装机地址
	if (isXudun) {
		$("#addressDiv").hide();
	} else {
		$("#addressDiv").show();
	}
}

function resetSpeed() {
	$("#speedLayoutDiv").show();
	$("#speedLayoutDiv").nextAll().hide();
}

function resetFee() {
	$("#feeLayoutDiv").show();
	$("#feeLayoutDiv").nextAll().hide();
}

function resetFeeStandard() {
	$("#feeStandardLayoutDiv").show();
	$("#feeStandardLayoutDiv").nextAll().hide();
}

function resetConfig() {
	if (isWojiating) {
		$("#configLayoutDiv").show();
	} else {
		$("#configLayoutDiv").hide();
	}
	$("#configLayoutDiv").nextAll().hide();
	reset();
}

function reset() {
		$("#cardLyoutDiv").show();
		$("#prev_and_nextPage").show();
		$("#otherLayoutDiv").show();
	}
	/**
	 * 直接让滚动条滚到最下面，无动画版
	 * */

function scrollToBottom() {
	setTimeout(function() {
		$("#CONTAINER").scrollTop(9999);
	}, 200);
}


/**
 * 选择【业务类型】中沃家庭新装 加装时做的处理
 * @param selectBtn 那个按钮本身
 */
function selectRadio(selectBtn) {
		$("a[name='radioBtn']").attr("class", "radiobtn");
		$(selectBtn).attr("class", "radiobtn radiobtnon");

		if ($(selectBtn).text() == "加装") {
			isNew = false;
			$("#userNumberDiv").show("normal");
		} else {
			isNew = true;
			$("#userNumberDiv").hide("normal");
		}
	}
	/**
	 * 选择【零配置】中的单选按钮时做的处理
	 * @param selectBtn 那个按钮本身
	 */

function selectConfig(selectBtn) {
	$("a[name='configBtn']").attr("class", "radiobtn");
	$(selectBtn).attr("class", "radiobtn radiobtnon");

	if ($(selectBtn).text() == "是") {
		$("#configPicDIV").show("normal");
		isConfig = true;
	} else {
		$("#configPicDIV").hide();
		isConfig = false;
	}
}

/**
 * 选择【反抢】中的单选按钮时做的处理
 * @param selectBtn 那个按钮本身
 */
function selectRob(selectBtn) {
	$("a[name='robBtn']").attr("class", "radiobtn");
	$(selectBtn).attr("class", "radiobtn radiobtnon");

	if ($(selectBtn).text() == "是") {
		$("#robPicDiv").show("normal");
		isRob = true;
	} else {
		$("#robPicDiv").hide("normal");
		isRob = false;
	}
}

//====================================================
/** 当用户点击蓝牙读取时调*/
function bluetoothRead() {
	check();
}

/**蓝牙读取成功时调用*/
function onReadIDCardFinish(bluetoothInfoStr) {
		unmask();

		try {
			if (bluetoothInfoStr != "{}") {

				var bluetoothInfo = $.parseJSON(bluetoothInfoStr);

				//2015-06-17 添加身份证读取失败信息获取
				if (bluetoothInfo.result != undefined && bluetoothInfo.result != 0) {
					alert(getReadCardResult(bluetoothInfo.result));
					if (bluetoothInfo.result == -1) {
						if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
							/*$("#btBox").css("display", "block");
							 $("#shadeDiv").css("display", "block");*/
						}
					}
					return;
				}

				$("#customer_name").val(bluetoothInfo.name).trigger('change');
				$("#cert_address").val(bluetoothInfo.address).trigger('change');
				$("#gov").val(bluetoothInfo.issuedat).trigger('change');
				$("#gender").val(bluetoothInfo.sex).trigger('change');
				$("#cert_number").val(bluetoothInfo.cardno).trigger('change');
				$("#nation").val(bluetoothInfo.nation).trigger('change');

				if (bluetoothInfo.effecteddate.length != 10) {
					var date1 = bluetoothInfo.effecteddate;
					date1 = date1.substring(0, 4) + "-" + date1.substring(4, 6) + "-" + date1.substring(6, 8);
				} else {
					var date1 = bluetoothInfo.effecteddate;
					date1 = date1.substring(0, 4) + "-" + date1.substring(5, 7) + "-" + date1.substring(8, 10);
				}
				if (bluetoothInfo.expireddate.length != 10) {
					var date2 = bluetoothInfo.expireddate;
					date2 = date2.substring(0, 4) + "-" + date2.substring(4, 6) + "-" + date2.substring(6, 8);
				} else {
					var date2 = bluetoothInfo.expireddate;
					date2 = date2.substring(0, 4) + "-" + date2.substring(5, 7) + "-" + date2.substring(8, 10);
				}
				$("#from").val(date1).trigger('change');
				$("#to").val(date2).trigger('change');


				//把名字、身份证号码展示在页面，同时禁止用户修改这两项数据
				$("#name").attr("readonly", "true");
				$("#certNumber").attr("readonly", "true");

				//请求合成身份证照片
				mask("正在合成身份证照片，请稍等...");
				myPhoto.request("!ESale/System/IDCard/~java/IDCardImg.create", bluetoothInfo, function(data) {

					if (data.header.code == 0) {
						//正面照，反面照
						imgData["front"] = data.body.cardon;
						imgData["contrary"] = data.body.cardoff;

						var url1 = "!service/file/~java/Downloader.get?type=Thumb&id=" + data.body.cardon; //正面照片
						var url2 = "!service/file/~java/Downloader.get?type=Thumb&id=" + data.body.cardoff; //反面照片

						//为图片的background修改路径
						$("#frontDiv_img").css("background", "url('" + APP_CONFIG.SERVER_URL + url1 + "')");
						$("#contraryDiv_img").css("background", "url('" + APP_CONFIG.SERVER_URL + url2 + "')");

					} else {
						alert("身份证照片合成失败！");
					}
					unmask();
				});

			} else {
				alert('身份证读取失败，请重试');
			}
		} catch (err) {
			if (/android/i.test(navigator.userAgent)) {
				alert('身份证读取失败，请重试');
			}
		} finally {
			unmask();
		}
	}
	//生成身份证ID

function InsertIDCard(obj) {
	var result = {};
	result.name = obj.name; //姓名
	result.sex = obj.gender ? (obj.gender == '男' ? '1' : '2') : "1"; //性别
	result.nation = "汉"; //民族
	result.address = obj.paper_addr ? obj.paper_addr : ' '; //地址
	result.cardNo = obj.paper_num ? obj.paper_num : ' '; //身份号码
	result.issuedAt = obj.str_office ? obj.str_office : '无'; //签发机关
	result.effectedDate = obj.paper_stime ? obj.paper_stime.replace(/-/g, '') : ' '; //开始时间
	result.expiredDate = obj.paper_time ? obj.paper_time.replace(/-/g, '') : ' '; //终止有效期
	result.CardReaderId = '0000000000';
	result.ID = "";

	$.ajax({
		type: "post",
		url: APP_CONFIG.SERVER_URL + "!ESale/System/IDCard/~java/IDCardINFO.InsertIDCard?data=" + encodeURIComponent(JSON.stringify(result)),
		//data:result,
		success: function(data) {
			//alert(data);

			data = eval("(" + data + ")");
			if (data.header.code == 0) {
				//alert(data);
				result.ID = data.body.ID;

			} else {
				alert('储存身份证信息失败');
				return false;
			}
		},
		async: false
	});

	return result.ID;
}

function OnUploadBegin() {
	$("#upload_text").empty().append("图片正在上传，请耐心等待...");
}

//回调
function OnUploadFinish(result) {
		if (result) {
			try {
				result = $.parseJSON(result)[0];
				if (result.id) {
					$('#progressBar').css("width", "100%").empty().append('100%');
					imgData[result._param] = result.id;
					$("#new_img_" + result._param).parent().css("background", "url('" + APP_CONFIG.SERVER_URL + result.thumbURL + "')");
				}
				$("#upload_text").empty().append("图片上传成功");
			} catch (Exception) {
				alert("图片上传失败,请重新上传!");
			}

		} else {
			$("#upload_text").empty().append("图片上传失败!请重新上传...");
		}
	}
	//苹果设备的图片上传功能

function uploadImg(id) {
	var p = {
		'busiId': 'Account',
		'busiType': 'APP',
		'size': '1000'
	};
	mobileUpload({
		id: id,
		form: p, //上传时参数 提交到后台的参数
		url: APP_CONFIG.SERVER_URL + '!service/file/~java/Uploader.upload',
		fileSelected: function(data) { //文件选择后触发

			$('#progressBar').css("width", "0%");
			document.getElementById('progressBar').innerHTML = '0%';

			//用fileReader请看网上详解 这里这是用于图片预览效果
			var reader = new FileReader();
			reader.onload = function(e) {
				//p.imgDataUrl=this.result;//从这里可以得到本地图片路径 在可以同<img src='this.reuslt'>展示出来
				//                $("#" + id).parent().css("background", "url('" + this.result + "')");//更换背景图片
			}
			reader.readAsDataURL(data.file); //本地读取文件 可以实现预览效果的
			//显示图片信息
			//                document.getElementById('fileName').innerHTML = "名称：" + data.fileName;
			//                document.getElementById('fileSize').innerHTML = "大小：" + data.fileSize;
			//                document.getElementById('fileType').innerHTML = "类型：" + data.fileType;
		},
		uploadProgress: function(evt) { //上传进度
			//下面是结合bootstrap的上传效果  可自己定义
			if (evt.lengthComputable) {
				var percentComplete = Math.round(evt.loaded * 100 / evt.total);
				$('#progressBar').css("width", percentComplete.toString() + "%"); //使用bootstrap滑动条显示上传进度
				document.getElementById('progressBar').innerHTML = percentComplete.toString() + '%';
			} else {
				document.getElementById('progressBar').innerHTML = 'unable to compute';
			}
		},
		uploadComplete: function(evt) {
			var response = rdcp.str2json(evt.target.responseText)[0];
			imgData[id] = response.id;
			$("#" + id).parent().css("background", "url('" + APP_CONFIG.SERVER_URL + response.thumbURL + "')");
		}
	});
}

/**
 * 让垂直滚动条跟着动画一直保持在最低，起到一个滚动条自动跟随控件展开的效果
 * @param id 做动画的DIV（这里只是变化此东东的height）
 * @param px 要变化的像素（原先都是会设回0）*/
function scrollHeightToBottom(id, px) {
	var time_token = setInterval(function() {
		$("#section").prop('scrollTop', '9999');
	}, 10);
	$("#" + id).animate({
		height: px + "px"
	}, 300, function() {
		clearInterval(time_token);
	});
}