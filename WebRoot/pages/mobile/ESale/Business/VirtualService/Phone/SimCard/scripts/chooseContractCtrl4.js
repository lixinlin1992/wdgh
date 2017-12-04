var imgData = {
	"front": '',
	'contrary': '',
};
var myPhoto = {};
app.registerCtrl("ChooseContractCtrl4", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		myPhoto.request = $srhttp.request;

		$rootScope.appTitle = "办合约";

		//路由转换
		app.when("/chooseContract3", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/chooseContract3.html",
			controller: "ChooseContractCtrl3"
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

		//获取上一页传递过来的参数
		$scope.form = Local.getStoreJson("form");

		//选择资费
		$scope.select_zf = function(type) {

			$("#monthSelect a[ng-click*=" + type + "]").addClass('radiobtnon').siblings().removeClass("radiobtnon");

			if (type == "全月") {
				$scope.form.FIRST_MONTH_FEE_NAME = "全月";
				$scope.form.productInfo = "3";
				$('#ff_message').text('全月：适合10号前购买的用户，套餐即时生效，入网当月即按照用户所选套餐收取套餐费，套餐包含内容不变。');
			} else if (type == "半月") {
				$scope.form.FIRST_MONTH_FEE_NAME = "半月";
				$scope.form.productInfo = "2";
				$('#ff_message').text('半月：适合11号到25号购买的用户，入网当月即按照用户所选套餐费减半收取，套餐包含内容减半。');
			} else if (type == "套餐外资费") {
				$scope.form.FIRST_MONTH_FEE_NAME = "套餐外资费";
				$scope.form.productInfo = "1";
				$('#ff_message').text('套外：适合25号以后购买的用户，本月无月租，不享受套餐内的通话和流量，通话及上网流量均按套餐费资费计费。');
			}
			console.log("首月资费为：" + $scope.form.FIRST_MONTH_FEE_NAME);

		}

		//提交订单
		$scope.createAndPay = function() {
			$scope.form.ID_PIC_FRONT = imgData.front; //正面照
			$scope.form.ID_PIC_BACK = imgData.contrary; //反面照
			$scope.form.ID_PIC_PEO = imgData.hand; //手持照

			$scope.form.money = $scope.form.money.trim();

			if (imgData.front == "" || imgData.contrary == "") {
				alert("请先通过蓝牙读取获得身份证正、反面照");
				return;
			}
			if ($scope.form.CUSTOMER_NAME == "") {
				alert("请先通过蓝牙读取身份证信息");
				return;
			}
			if ($scope.form.money == "") {
				alert("请先输入预存款");
				return;
			}

			if (isNaN($scope.form.money)) {
				alert("请输入正确的预存款格式");
				return;
			}
			if (parseFloat($scope.form.money) < parseFloat($scope.form.FEE_INIT)) {
				alert("预存款必须大于等于初始金额" + $scope.form.FEE_INIT);
				return;
			}

			if ($scope.form.TERMINAL_SN == "") {
				alert("请先输入终端串号");
				return;
			}
			if ($scope.form.CONTACT_PHONE == "" || $scope.form.CONTACT_PHONE.length != 11) {
				alert("请先输入11位联系电话");
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
			$scope.form.CardID = InsertIDCard($scope.cardForm);

			//提交订单需要的参数
			var result = {};

			result['list'] = {
				'list': [{
					'goodsId': $scope.form.goodsId, //完成
					'quantity': '1' //完成
				}]
			}
			result['ext'] = {
				'ext': {
					'BUSINESS.INT': [{
						'key': 'PHONE_NUMBER',
						'val': $scope.form.PHONE_NUMBER, //完成
						'key_as': '开户号码'
					}],
					'BUSINESS': [{
						'key': 'package_name',
						'val': $scope.form.package_name_name, //完成
						'key_as': '套餐名称'
					}, {
						'key': 'PRODUCT_NAME',
						'val': $scope.form.productName, //完成
						'key_as': '产品名称'
					}, {
						'key': 'BARAND_ID',
						'val': 'CU', //完成
						'key_as': '品牌id',
						type: 'HIDDEN'
					}, {
						'key': 'selectProductId',
						'val': $scope.form.package_name_name + $scope.form.PLAN_NAME + $scope.form.FIRST_MONTH_FEE_NAME, //完成
						'key_as': '产品ID'
					}, {
						'key': 'prod_name',
						'val': $scope.form.active_type_name, //不确定
						'key_as': '活动名称'
					}, {
						'key': 'BRAND_NAME',
						'val': "中国联通", //完成
						'key_as': '品牌'
					}, {
						'key': 'PLAN_NAME',
						'val': $scope.form.PLAN_NAME, //完成
						'key_as': '计划名称'
					}, {
						'key': 'FIRST_MONTH_FEE_NAME',
						'val': $scope.form.FIRST_MONTH_FEE_NAME, //完成
						'key_as': '首月支付类型'
					}, {
						'key': 'productInfo',
						'val': $scope.form.productInfo,
						'key_as': '首月支付ID'
					}, {
						'key': 'CardID',
						'val': $scope.form.CardID, //完成
						'key_as': '身份证ID'
					}, {
						'key': 'planId',
						'val': $scope.form.active_type_name, //活动ID，不确定，这里明明不是ID
						'key_as': '产品活动ID',
						type: 'HIDDEN'
					}, {
						'key': 'isalnum',
						'val': 1, //完成
						'key_as': '是否成卡',
						type: 'HIDDEN'
					}, {
						'key': 'SIMC_MARK',
						'val': "", //空
						'key_as': '是否减免费用',
						type: 'HIDDEN'
					}, {
						'key': 'PLANITEMCHOOSE',
						'val': "", //空
						'key_as': '套餐业务三选一',
						type: 'HIDDEN'
					}, {
						'key': 'CARDNUMBER',
						'val': "", //空
						'key_as': '成卡卡号'
					}, {
						'key': 'device_type',
						'val': "01", //完成
						'key_as': '手机终端'
					}, {
						'key': 'TERMINAL_SN',
						'val': $scope.form.TERMINAL_SN, //完成
						'key_as': '终端串号'
					}, {
						'key': 'PROD_VOICE',
						'val': $scope.form.YYB, //完成
						'key_as': '语音包'
					}, {
						'key': 'LLB_NAME',
						'val': $scope.form.LLB, //完成
						'key_as': '流量包'
					}, {
						'key': 'CONTRACT_FEE_LIMIT',
						'val': parseFloat($scope.form.money) - parseFloat($scope.form.FEE_INIT), //完成
						'key_as': '合约预存款额度'
					}, {
						'key': 'CONTRACT_TYPE',
						'val': $scope.form.CONTRACT_TYPE, //完成
						'key_as': '合约赠送话费'
					}, {
						'key': 'PERIODS',
						'val': $scope.form.PERIODS, //完成
						'key_as': '期数'
					}, {
						'key': 'POLICY_ID',
						'val': $scope.form.active_type_id, //不确定,说是活动ID
						'key_as': '政策id'
					}, {
						'key': 'POLICY_NAME',
						'val': $scope.form.active_type_name, //不确定，照抄原来的
						'key_as': '政策'
					}],
					'BASE': [{
						'key': 'CUSTOMER_NAME',
						'val': $scope.form.CUSTOMER_NAME, //完成
						'key_as': '客户姓名'
					}, {
						'key': 'CERT_ADDRESS',
						'val': $scope.form.CERT_ADDRESS, //完成
						'key_as': '证件地址'
					}, {
						'key': 'CONTACT_MAN',
						'val': $scope.form.CUSTOMER_NAME, //联系人==客户姓名
						'key_as': '联系人'
					}, {
						'key': 'ISS_USING',
						'val': $scope.form.ISS_USING, //完成
						'key_as': '签发机关'
					}, {
						'key': 'CONTACT_PHONE',
						'val': $scope.form.CONTACT_PHONE, //完成
						'key_as': '联系电话'
					}, {
						'key': 'POSTAL_ADDRESS',
						'val': $scope.form.CERT_ADDRESS, //完成
						'key_as': '通讯地址'
					}, {
						'key': 'GENDER',
						'val': $scope.form.GENDER, //完成
						'key_as': '性别'
					}, {
						'key': 'CERT_NUMBER',
						'val': $scope.form.CERT_NUMBER, //完成
						'key_as': '证件号码'
					}],
					'BASE.IMG': [{
						'key': 'ID_PIC_FRONT',
						'val': imgData.front, //完成
						'key_as': '身份证正面照片'
					}, {
						'key': 'ID_PIC_BACK',
						'val': imgData.contrary, //完成
						'key_as': '身份证反面照片'
					}],
					'BASE.DATE': [{
						'key': 'CERT_VALID_FROM',
						'val': $scope.form.CERT_VALID_FROM, //完成
						'key_as': '证件有效期开始'
					}, {
						'key': 'CERT_VALID_TO',
						'val': $scope.form.CERT_VALID_TO, //完成
						'key_as': '证件有效期结束'
					}]
				}
			};
			$scope.create_order(result);
		}

		$scope.create_order = function(result) {
			$srhttp.post("!ESale/Mall/Order/~java/Order.create", {
				"list": rdcp.json2str(result.list),
				"ext": rdcp.json2str(result.ext),
				'businessId': "CU.Account.HYHJ", //不知道这个传什么
				'surefee': $scope.form.money,
				'payStatus': '-1'
			}, function(data) {
				if (data.header.code == 0) {
					var creatorName = data.body["creator_member_name"];
					var id = data.body["id"];
					var devId = data.body["member_id"];
					$scope.sendMessage(devId, creatorName + "的订单已经生成,请注意接收查看");

					//todo 串号和成卡卡号更新 以后放到监听器里面执行
					$srhttp.post("!ESale/Business/CardManage/~query/U_CARD_STATUS", {
						card_num: "", //成卡卡号
						orderId: id
					}, function(data) {}, null);
					alert('订单已生成');
					Local.saveStoreJson("form", "{}");
					window.location.href = "#/orders";
					return;
				} else {
					alert('订单创建失败！');
				}
			})
		}

		//往后台写入信息
		$scope.sendMessage = function(memberId, msg) {
			$srhttp.get("!ESale/System/Base/~java/MessageTrans.sendMessage", {
				distination: memberId,
				param: msg
			}, function(data) {
				if (data.header.code == 0) {
					//alert("往 后台插入信息成功");
				} else {
					alert("处理异常，请稍后重试");
				}
			})
		}
	}
]);

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
				alert('提示', '储存身份证信息失败');
				return false;
			}
		},
		async: false
	});

	return result.ID;
}

//蓝牙读取按钮的点击事件函数
$('#bluetooth_read_btn').on('click', function() {
	//mask("正在读取中...");
	check();
});

//蓝牙读取接口的回调方法，将信息填入相应表单，覆盖mobile_framework.js的同名方法
function onReadIDCardFinish(bluetoothInfoStr) {
	unmask();
	if (bluetoothInfoStr != "{}") {
		var bluetoothInfo = $.parseJSON(bluetoothInfoStr);

		//添加身份证读取失败信息获取
		if (bluetoothInfo.result != undefined && bluetoothInfo.result != 0) {
			alert(getReadCardResult(bluetoothInfo.result));
			return;
		}

		$("#customer_name").val(bluetoothInfo.name).trigger('change'); //身份证名字

		$("#cert_number").val(bluetoothInfo.cardno).trigger('change'); //身份证号码

		var date1 = bluetoothInfo.effecteddate;
		date1 = date1.substring(0, 4) + "-" + date1.substring(4, 6) + "-" + date1.substring(6, 8);
		var date2 = bluetoothInfo.expireddate;
		date2 = date2.substring(0, 4) + "-" + date2.substring(4, 6) + "-" + date2.substring(6, 8);

		$("#cert_valid_from").val(date1).trigger('change'); //身份证有效期的开始时间（蓝牙那边读取出来的是2015.01.01，要把“.”换成“-”才能放进date类型的input）
		$("#cert_valid_to").val(date2).trigger('change'); //身份证有效期的结束时间
		$("#iss_using").val(bluetoothInfo.issuedat).trigger('change'); //身份证的发证机关
		$("#cert_address").val(bluetoothInfo.address).trigger('change'); //身份证地址
		$("#gender").val(bluetoothInfo.sex).trigger('change'); //性别

		try {
			$("#device_name").val(bluetoothInfo.DeviceName).trigger('change'); //二合一设备型号
		} catch (err) {
			console.log("设备型号无法读取到");
			$("#device_name").val("").trigger('change');
		}

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
		if (/android/i.test(navigator.userAgent)) {
			alert('身份证读取失败，请重试');
		}
	}
	unmask();

}