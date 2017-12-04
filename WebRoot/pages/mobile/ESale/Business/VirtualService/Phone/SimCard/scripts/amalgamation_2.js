var isNewUser_net = true;
var isNewUser_tele=true;
var needTeleInfo;

var scope={}
var myHttp = {};

//保存身份证信息
var userName, cert_address, gov, gender, cert_number, from, to;

var isNetwork = false; //当用户点击蓝牙读取身份证时，保存用户点击的是不是宽带信息模块的蓝牙读取

var IDCARD_ID_NET = "",
	IDCARD_ID_TELE = ""; //保存蓝牙读取身份证的ID

app.registerCtrl("amalgamation2Ctrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		
		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		$rootScope.appTitle = "做融合";
		$scope.orderList = Local.getStoreJson("orderList");

		$scope.form = Local.getStoreJson("form");



		myHttp.request = $srhttp.request;
		myHttp.post = $srhttp.post;

		$scope.second = {
			netAccount: "", //宽带账号
			moveAddress: "", //移机地址
			phoneNumber: "", //固话号码
			guhuataocan: "", //固话套餐
			address: "", //装机地址
			networkType: "", //宽带类型
			speedid: "", //宽带速率
			IDCARD_ID_NET: "", //宽带身份证ID
			IDCARD_ID_TELE: "", //固话身份证ID

			network: "",
			network_ip: "",
			other: "",
			other_info: "",
			other_product: "",
			other_product2: "",
			phone: ""
		};

		scope = $scope;
		scope.second = $scope.second;

		$scope.initConfig = function() {
			var url = "!System/Core/Member/~java/MemberConfig.getConfig";
			var params = {
				"business_id": "ChinaUnicom.Amalgamation",
				"service_id": "AMALGAMATION_BUSI",
				"group_id": "PAGE_CONFIG"
			};
			$srhttp.request(url, params, function(data) {
				unmask();

				if (data.body.length <= 0) {
					alert("抱歉，您没有相关的业务");
					return;
				}

				//取数据
				for (var i = 0; i < data.body.length; i++) {
					switch (data.body[i].CODE) {
						case "NETWORK":
							$scope.second.network = data.body[i].VALUE;
							break;

						case "NETWORK_IPTV":
							$scope.second.network_ip = data.body[i].VALUE;
							break;

						case "OTHER":
							$scope.second.other = data.body[i].VALUE;
							break;

						case "OTHER_INFO":
							$scope.second.other_info = data.body[i].VALUE;
							break;

						case "OTHER_PRODUCT":
							$scope.second.other_info = data.body[i].VALUE;
							other_product = data.body[i].VALUE;
							break;

						case "OTHER_PRODUCT2":
							$scope.second.other_product2 = data.body[i].VALUE;
							break;

						case "PHONE":
							$scope.second.phone = data.body[i].VALUE;
							break;
					}
				}
			});
		}

		$scope.initConfig();

		console.log("=============orderList=================");
		console.log($scope.orderList);
		console.log("================orderList==============");

		console.log("===============form================");
		console.log($scope.form);
		console.log("===============form=================");

		console.log("================" + $scope.orderList.feeStandardID);
		//添加下一步跳转的链接
		app.when("/amalgamation_3", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/amalgamation_3.html",
			controller: "amalgamation3Ctrl"
		});

		//上一步
		$scope.prevPage = function() {
			location.href = "#/amalgamation_1";
		}
		//下一步
		$scope.nextPage = function() {
			var urls ="#/amalgamation_3";
			$scope.second.IDCARD_ID_NET = IDCARD_ID_NET;
			$scope.second.IDCARD_ID_TELE = IDCARD_ID_TELE;
			if($scope.validate()){
				urls="";
				return;
			}
			$scope.second.guhuataocan = $("#guhuataocan").val().trim(); //固话套餐
			Local.saveStoreJson("form", $scope.form);
			Local.saveStoreJson("orderList", $scope.orderList);
			Local.saveStoreJson("second", $scope.second);
			location.href = urls;
		}
		
		$scope.validate = function(){
			if(isNewUser_net && $scope.second.address==""){
				alert("请输入装机地址");
				return true;
			}
			
			if(!isNewUser_net && $scope.second.netAccount==""){
				alert("请填写宽带账号");
				return true;
			}
			
			if(needMove && $scope.second.moveAddress==""){
				alert("请填写移机地址");
				return true;
			}
			
			if(needTransfer_net && $scope.second.IDCARD_ID_NET==""){
				alert("请进行宽带蓝牙识别");
				return true;
			}
			
			if(!isNewUser_tele && $scope.second.phoneNumber==""){
				alert("请填写固话号码");
				return true;
			}
			
			if(needTranster_tel  && $scope.second.IDCARD_ID_TELE==""){
				alert("请进行固话蓝牙识别");
				return true;
			}
		}
	}
]);

app.registerCtrl("BroadbandCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		/**
		 * 当用户点击宽带信息的新用户 老用户按钮时调用
		 */
		$scope.changeUserBtn = function(id) {
				var selectBtn = $("#" + id);
				$("a[name='userBtn']").attr("class", "com_selectbtn");
				$(selectBtn).attr("class", "com_selectbtn com_selectbtnon");

				if (id == "newUserBtn") {
					isNewUser_net = true;
					$scope.second.netAccount = "";
					$scope.second.moveAddress = "";
					$scope.second.IDCARD_ID_NET="";
					$scope.initNewUserDIV();
				} else {
					isNewUser_net = false;
					$scope.initOldUserDIV();
				}
				resetBroadband();
			}
			/**
			 * 当用户点击新用户按钮时初始化新用户模块
			 */
		$scope.initNewUserDIV = function() {
			$("#newUserDiv_b").show("normal");
			$("#oldUserDiv_b").hide("normal");
			$("#needIPLayoutDiv").hide("normal");
			//查询宽带类型并装载到页面
			var url = "!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_NETWORK_TYPE";
			var feeChildId = $scope.orderList.feeStandardID;
			$srhttp.post(url, {
				"fee_good": feeChildId
			}, function(data) {
				if (data.body.rows.length <= 0) {
					alert("提示", "抱歉，您没有相关的业务");
					return;
				}
				$scope.broadbandType = data.body.rows;
				console.log($scope.broadbandType);
				resetBroadbandType();

				//$("#broadbandTypeLayoutDIV").show("normal");

				//若只有一个按钮，则默认帮客户选中
				/*if(data.body.rows.length==1){
				 $("a[name='broadbandTypeBtn']").first().attr("class","com_selectbtn com_selectbtnon");
				 selectBroadbandType($("a[name='broadbandTypeBtn']").first());
				 }*/
			})
		}

		/**
		 * 当用户点击老用户按钮时初始化新用户模块
		 */
		$scope.initOldUserDIV = function() {
				$("#newUserDiv_b").hide("normal");
				$("#oldUserDiv_b").show("normal");
				$("#needIPLayoutDiv").show("normal");

			}
			//加载速率
		$scope.loadMessageSpeed = function(networkType) {
				var param = {
					network_type: networkType,
					fee_good: $scope.orderList.feeStandardID
				};
				$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_NETWORK_RATE", param, function(data) {
					if (data.body.rows.length <= 0) {
						alert("提示", "抱歉，您没有相关的业务");
						return;
					}
					$scope.speed = data.body.rows;
					console.log($scope.networkType);
					resetSpeed();
					//若只有一个按钮，则默认帮客户选中
					/*if(data.body.rows.length==1){
					 $("a[name='broadbandTypeBtn']").first().attr("class","com_selectbtn com_selectbtnon");
					 selectBroadbandType($("a[name='broadbandTypeBtn']").first());
					 }*/
				})
			}
			//选择宽带类型事件
		$scope.broadbandTypeSelect = function(id) {
				var selectBtn = $("#broadbandTypeSelect_id_" + id);
				$(selectBtn).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
				var networkType = $(selectBtn).attr("broadbandTypeID");
				$scope.second.networkType = networkType;
				$scope.loadMessageSpeed(networkType);
			}
			//选择速率
		$scope.speedSelect = function(id) {
			var selectBtn = $("#speedSelect_id_" + id);
			var speedid = $(selectBtn).attr("speedid");
			$scope.second.speedid = speedid;
			$(selectBtn).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
			$rootScope.$broadcast("TelephoneCtrl");
		}
	}
]);

function resetBroadband() {
	$("#broadbandLayoutDiv").show("normal");
	$("#broadbandLayoutDiv").nextAll().hide("normal");
	$("#showBtnDiv").hide("normal");
	$("#prev_and_nextPage").hide();
	resetshowTelephone();
}

function resetBroadbandType() {
	$("#broadbandTypeLayoutDIV").show("normal");
	$("#broadbandTypeLayoutDIV").nextAll().hide("normal");
	$("#showBtnDiv").hide();
	$("#prev_and_nextPage").hide();
}

function resetSpeed() {
	$("#speedLayoutDiv").show("normal");
	$("#speedLayoutDiv").nextAll().hide("normal");
}

function resetTelephoneBtn() {
	$("#showBtnDiv").show();
	$("#prev_and_nextPage").show();
}

function resetshowTelephone() {
	needTeleInfo = false;
	$("#showBtn").text("录入固话信息");
	$("#telephoneLayoutDiv").hide();

}

function resetTelephone() {
	$("#telephoneDIV").find("a").removeClass("com_selectbtnon")
	$("#telephoneDIV").show();
	$("#telephoneDIV").nextAll().hide();
}

/**
 * 当用户点击【录入固话信息】时调用
 */
function showTelephoneDiv() {
	if (!needTeleInfo) {
		needTeleInfo = true;
		$("#showBtn").text("取消录入固话信息");
		
		scope.second.phoneNumber= "";
		scope.second.guhuataocan = "";
		scope.second.IDCARD_ID_TELE = "";
		
		$("#telephoneLayoutDiv").show();

		//scrollToBottom();
		// scrollHeightToBottom("telephoneDIV",41);
	} else {
		needTeleInfo = false;
		$("#showBtn").text("录入固话信息");
		$("#telephoneLayoutDiv").hide();

	}
}
app.registerCtrl("TelephoneCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		$scope.loadMessage = function() {
			resetTelephoneBtn();
			resetTelephone();
		}

		/**
		 * 当用户点击固话信息的新用户 老用户按钮时调用
		 */
		$scope.selectUserBtn = function(id) {
			var selectBtn = $("#" + id);
			$("a[name='userBtn_t']").attr("class", "com_selectbtn");
			$(selectBtn).attr("class", "com_selectbtn com_selectbtnon");
			if (id == "newUserBtn_t") {
				isNewUser_tele = true;
				$("#newUserDiv_t").show("normal");

				$("#footer").show("normal");
				$("#section").removeAttr("class");

				$("#oldUserDiv_t").hide("normal");
				//scrollHeightToBottom("newUserDiv_t",41)

			} else {
				isNewUser_tele = false;
				$("#newUserDiv_t").hide("normal");
				$("#oldUserDiv_t").show("normal");
			}
		}

		$scope.$on("TelephoneCtrl", function() {
			$scope.loadMessage();
		});
	}
]);
/**
 * 当用户点击宽带信息的老用户模块中是否需要移机时调用
 */
var needMove = false;

function selectNeedMove(selectBtn) {
	$("a[name='needMoveBtn']").attr("class", "com_selectbtn");
	$(selectBtn).attr("class", "com_selectbtn com_selectbtnon");

	if ($(selectBtn).attr("id") == "needMoveBtn_YES") {
		$("#moveAddressDiv").show("normal");
		needMove = true;
	} else {
		$("#moveAddressDiv").hide("normal");
		needMove = false;
	}
	$("#needTransferLayoutDiv").show("normal");
}

/**
 * 当用户点击宽带信息的老用户模块中是否需要过户时调用
 */
var needTransfer_net = false;

function selectNeedTransfe(selectBtn) {
	$("a[name='needTransferBtn']").attr("class", "com_selectbtn");
	$(selectBtn).attr("class", "com_selectbtn com_selectbtnon");

	if ($(selectBtn).attr("id") == "needTransferBtn_YES") {
		$("#oldUserIDReadLayoutDiv").show("normal");
		needTransfer_net = true;
	} else {
		$("#oldUserIDReadLayoutDiv").hide("normal");
		needTransfer_net = false;
	}
	resetTelephoneBtn();
	//initTelephone();
}

/**
 * 当用户点击【固话信息】的老用户模块中是否需要过户时调用
 */
var needTranster_tel = false;

function selectNeedTransfer_t(selectBtn) {
	$("a[name='needTransferBtn_t']").attr("class", "com_selectbtn");
	$(selectBtn).attr("class", "com_selectbtn com_selectbtnon");

	if ($(selectBtn).attr("id") == "needTransferBtn_t_YES") {
		$("#oldUserIDReadLayoutDiv_t").show();
		needTranster_tel = true;
		//scrollHeightToBottom("oldUserIDReadLayoutDiv_t",248);
	} else {
		$("#oldUserIDReadLayoutDiv_t").hide();
		needTranster_tel = false;
	}

}

/**
 * 当用户点击蓝牙读取时调用
 */
function bluetoothRead(isNetworkClick) {
	if (isNetworkClick) {
		isNetwork = true;
	} else {
		isNetwork = false;
	}
	check();
	
}


function onReadIDCardFinish(bluetoothInfoStr) {
	unmask();

	if (bluetoothInfoStr != "{}") {
		var bluetoothInfo = $.parseJSON(bluetoothInfoStr);

		//2015-06-17 添加身份证读取失败信息获取
		if (bluetoothInfo.result != undefined && bluetoothInfo.result != 0) {
			alert(getReadCardResult(bluetoothInfo.result));
			if (bluetoothInfo.result == -1) {
				if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
					$("#btBox").css("display", "block");
					$("#shadeDiv").css("display", "block");
				}
			}
			$('#bluetooth_read_btn').button('reset'); //还原蓝牙读取按钮的状态为可点击
			return;
		}
		userName = bluetoothInfo.name;
		cert_address = bluetoothInfo.address;
		gov = bluetoothInfo.issuedat;
		gender = bluetoothInfo.sex;
		cert_number = bluetoothInfo.cardno;

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
		from = date1;
		to = date2;

		//根据返回的身份证信息生成form对象，然后调用后台方法返回身份证信息在数据库中的ID
		var form = {
			"name": userName,
			"gender": gender,
			"paper_num": cert_number,
			"paper_stime": from,
			"paper_time": to,
			"str_office": gov,
			"paper_addr": cert_address
		};

		if (isNetwork) {
			IDCARD_ID_NET = InsertIDCard(form);
		} else {
			IDCARD_ID_TELE = InsertIDCard(form);
		}



		//请求合成身份证照片
		mask("身份证信息读取成功，正在进行照片合成……");
		myHttp.request("!ESale/System/IDCard/~java/IDCardImg.create", bluetoothInfo, function(data) {
			unmask();
			if (data.header.code == 0) {
				var url1 = "!service/file/~java/Downloader.get?type=Thumb&id=" + data.body.cardon; //正面照片
				var url2 = "!service/file/~java/Downloader.get?type=Thumb&id=" + data.body.cardoff; //反面照片
				if (isNetwork) {
					$("#frontDiv_img").css("background", "url('" + APP_CONFIG.SERVER_URL + url1 + "')");
					$("#contraryDiv_img").css("background", "url('" + APP_CONFIG.SERVER_URL + url2 + "')");
				} else {
					$("#frontDiv_img1").css("background", "url('" + APP_CONFIG.SERVER_URL + url1 + "')");
					$("#contraryDiv_img1").css("background", "url('" + APP_CONFIG.SERVER_URL + url2 + "')");
				}
			} else {
				alert("身份证照片合成失败！");
			}
		});
	} else {
		alert('身份证读取失败，请重试');
	}
	$("#bluetooth_read_btn").button('reset'); //还原蓝牙读取按钮的状态为可点击
}