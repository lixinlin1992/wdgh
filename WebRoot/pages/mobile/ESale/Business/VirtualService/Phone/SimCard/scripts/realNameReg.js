/**
 * Created by Tralone on 2015/7/14.
 */

//$(".choice_btn").hide();

var frontPicId = "",
	backPicId = "";

var message = "";
//接口返回的状态码对应关系
var resultCodDef = {
	"00000": "实名制成功",
	"00002": "已实名制",
	"01204": "号码不存在",
	"01001": "客户资料不存在",
	"01029": "证件类型输入不合规",
	"01030": "证件号码输入不合规",
	"01028": "客户姓名输入不合规",
	"01031": "证件地址输入不合规",
	"01528": "证件下存在多个客户",
	"01001": "客户信息不存在",
	"01025": "代理商号码不是总部集中渠道登记的有效的手机号码",
	"01027": "系统中存在对应的15位身份证号码",
	"01022": "客户资料输入不合规",
	"01023": "客户下用户超过数量限制",
	"01527": "返档/补登在途不允许办理 ",
	"01529": "返档/补登客户为集团客户 ",
	"08888": "不能修改证件类型 不能修改证件号码 不能修改客户姓名 其它错误 ",
	"00201": "获取网别无数据或者该号码已销号！",
	"01599": "沃盟登记的渠道所在地市和实名登记号码所在的地市不在同一地市"
};

var myPhoto = {};
app.registerCtrl("RealNameRegCtrl", ["$scope", "$srhttp",
	function($scope, $srhttp) {

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		myPhoto.request = $srhttp.request;

		$scope.img_code = "";

		$scope.form = {
			"USER_NUMBER": "", //客户号码,获取来源于HTML
			"CERT_NUMBER": "", //证件号码,获取来源于蓝牙
			"CERT_ADDRESS": "", //证件地址,获取来源于蓝牙

			"CUSTOMER_NAME": "", //客户姓名,获取来源于HTML
			"CONTACT_NAME": "", //联系人
			"CONTACT_PHONE": "", //联系电话
			"CONTACT_ADDRESS": "", //联系地址
			//以下2个参数，是访问第1个接口去获取数据
			"SALE_PLACE": "", //营业点，来源于访问接口
			"SALE_PERSON": "", //营业员，来源于访问接口

			//以下三个参数，是访问第2个接口去获取数据
			"DEVELOP_CODE": "", //总部发展人编码
			"CHAN_CODE": "", //总部渠道编码
			"CHAN_ID": "", //BSS渠道ID

			"GOV": "", //签发机关，蓝牙
			"GENDER": "", //性别，蓝牙
			"FROM": "", //证件有效日期开始，蓝牙
			"TO": "", //证件有交往效期，蓝牙

			"regResult": "", //实名制结果
			"DEVICE_NAME": "", //二合一设备型号
			"CardID": "", //身份证ID,这个不是身份证号码，是从数据库读到的ID+
			"COMPANY_TYPE": "CU", //中国联通、移动 、电信公司
			"BRAND_NAME": "中国联通",
			"businessId": "CU.RealName", //虚拟商品id来源于哪个营业商
			"NATION": "汉", //民族
			"CODE": "", //验证码
			"CODE_TYPE": "", //验证码类型，值为1=图形，值为2=短信

			"BORN": "", //出生日期
			"PICTURE": "", //头像的Base64编码

		};

		$scope.setText = function() {
			//测试用，测试数据
			$scope.form.CUSTOMER_NAME = "林创荣";
			$scope.form.CONTACT_MAN = "林创荣";
			$scope.form.GENDER = "男";
			$scope.form.USER_NUMBER = "13202698408";
			$scope.form.CONTACT_PHONE = "13202698408";
			$scope.form.CERT_ADDRESS = "广东省汕头市";
			$scope.form.CERT_NUMBER = "440514199410140814";
			$scope.form.GOV = "汕头市公安局";
			$scope.form.FROM = "20120982";
			$scope.form.TO = "20220982";
			$scope.form.NATION = "汉族";
			$scope.form.BORN = "19941014";
			$scope.form.PICTURE = 'fafbghrhfdhdhtr';
			$("#submit").addClass("theme_btn"); //使提交变成橙色
		}

		$scope.checkMobile = function(str) {
			var re = /^1\d{10}$/;
			return re.test(str);
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
							$("#name").removeAttr("readonly");
							$("#certNumber").removeAttr("readonly");
						} else if (data.body.VALUE == "2") { //或者如果只有蓝牙读取权限

						} else if (data.body.VALUE == "3") { //或者图片识别与蓝牙读取权限都有
							$("#name").removeAttr("readonly");
							$("#certNumber").removeAttr("readonly");
						}
					}
				} else {

				}
			});
		}
		$scope.loadBtnAccess();

		//联通、移动 、电信的选择
		$scope.selectCompany = function(index) {
			$("#company_" + index).parent().parent().find("a").removeClass("com_selectbtnon");
			$("#company_" + index).addClass("com_selectbtnon");
			//console.log($scope.form.COMPANY);
			if (index == 0) {
				$scope.form.COMPANY_TYPE = "CU"; //联通
				$scope.form.BRAND_NAME = "中国联通";
				$scope.form.businessId = "CU.RealName";
			} else if (index == 1) {
				$scope.form.COMPANY_TYPE = "CN"; //电信
				$scope.form.BRAND_NAME = "中国电信";
				$scope.form.businessId = "CN.RealName";
			} else if (index == 2) {
				$scope.form.COMPANY_TYPE = "CM"; //移动
				$scope.form.BRAND_NAME = "中国移动";
				$scope.form.businessId = "CM.RealName";
			}
		}

		//是易售宝则显示--联通、移动 、电信的选择
		/*$scope.checkOperator = function() {
			if (!(APP_CONFIG.OPERATOR == "ESALEB")) {
				$("#company").hide();
			} else {
				$("#readerTypeSelect").hide();
			}
		}
		$scope.checkOperator();*/

		//点击提交后的事件处理
		$scope.submit = function() {

			//如果是灰色按钮，则点击后无效
			if (!$("#submit").hasClass('theme_btn')) {
				return false;
			}

			$("#submit").removeClass("theme_btn"); //使提交变成灰色

			//判断填写的信息是否符合规范，非必填项的值
			$scope.form.USER_NUMBER = $.trim($scope.form.USER_NUMBER); //手机号==用户号码
			$scope.form.CUSTOMER_NAME = $.trim($scope.form.CUSTOMER_NAME); //姓名
			$scope.form.CERT_NUMBER = $.trim($scope.form.CERT_NUMBER); //证件号码

			if ($scope.form.USER_NUMBER == "") {
				alert("请输入11位号码");
				$("#submit").addClass("theme_btn"); //使提交变成橙色
				return false;
			}
			$scope.form.USER_NUMBER = $scope.form.USER_NUMBER.substring(0, 11);


			if (!$scope.checkMobile($scope.form.USER_NUMBER)) {
				console.log($scope.form.USER_NUMBER);
				$("#submit").addClass("theme_btn"); //使提交变成橙色
				alert("请输入有效的手机号码！");
				return;
			}

			//生成身份证ID
			$scope.cardForm = {
				"name": $scope.form.CUSTOMER_NAME,
				"gender": $scope.form.GENDER,
				"paper_addr": $scope.form.CERT_ADDRESS,
				"paper_num": $scope.form.CERT_NUMBER,
				"str_office": $scope.form.GOV,
				"paper_stime": $scope.form.FROM,
				"paper_time": $scope.form.TO,
				"nation": $scope.form.NATION,
				"born": $scope.form.BORN,
				"picture": $scope.form.PICTURE,
			}
			$scope.form.CardID = InsertIDCard($scope.cardForm);

			//校验联通手机号，成功号码，则开始提交
			var $mynumber = $scope.form.USER_NUMBER;

			$scope.checkIsChinaUnicom($mynumber);

		}

		/**
		 * 校验手机号码是否是正确的号码，如果是，则继续流程
		 */
		$scope.checkIsChinaUnicom = function(mynumber) {
			mask("请稍后,正在校验当前号码是否有效....");

			var numberPrefix = (mynumber + "").substring(0, 3);
			var url = "!ESale/Business/VirtualService/Phone/RealName/~query/Q_NUMBER_PREFIX";
			var params = {
				"type": $scope.form.COMPANY_TYPE
			};

			$srhttp.get(url, params, function(data) {
				try {
					unmask();
					var prefix = data.body.rows[0]["VAL"];
					if (prefix != undefined) {
						var isCU = false;
						var prefixs = prefix.split(',');
						$.each(prefixs, function(n, value) {
							if (numberPrefix == value) {
								isCU = true;
							}
						});

						if (isCU) {
							//开始执行提交订单的相应处理
							$scope.getOrderData();
						} else {
							$("#submit").addClass("theme_btn"); //使提交变成橙色
							alert("请输入正确的手机号码");
						}
					} else {
						$("#submit").addClass("theme_btn"); //使提交变成橙色
						alert("无法进行实名制，校验号码时出错！");
					}
				} catch (err) {
					$("#submit").addClass("theme_btn"); //使提交变成橙色
					alert("校验号码出错");
					return;
				} finally {

				}

			});

		}

		//请求服务器，查询营业点、营业员编码以及网点的发展人信息,接口1
		/*$scope.submitOrder = function() {
			$srhttp.get("!ESale/Business/VirtualService/Phone/RealName/~query/Q_REALNAME_PARAMS", {}, function(data) {
				if (data.header.code == '0') {
					for (var i = 0; i < 2; i++) {
						var key = data.body.rows[i]["KEY"];
						var value = data.body.rows[i]["VAL"];

						switch (key) {
							case "SALE_PLACE":
								$scope.form.SALE_PLACE = value;
								break;

							case "SALE_PERSON":
								$scope.form.SALE_PERSON = value;
								break;
						}
					}

					//判断信息无误后，开始访问第2个接口，获取网点配置信息
					$scope.readNameInfo();
				}
			});
		}*/

		//读取用户信息，接口2
		/*$scope.readNameInfo = function() {
			$srhttp.get("!ESale/Business/VirtualService/Phone/RealName/~query/Q_REALNAME_INFO", {}, function(data) {

				if (data.header.code == '0') {

					var rowCount = data.body.rows.length;
					for (var i = 0; i < rowCount; i++) {

						var key = data.body.rows[i]["KEY"];
						var value = data.body.rows[i]["VAL"];

						switch (key) {
							case "DEVELOP_CODE":
								$scope.form.DEVELOP_CODE = value;
								break;

							case "CHAN_CODE":
								$scope.form.CHAN_CODE = value;
								break;

							case "CHAN_ID":
								$scope.form.CHAN_ID = value;
								break;
						}
					}

					//调用联通的2G实名制接口,接口3
					$scope.validateUserInfo();

				}
			});
		}*/

		//联通的2G实名制方法，接口3
		/*$scope.validateUserInfo = function() {
			$srhttp.get("!ESale/System/Base/~java/RealName.check", $scope.form, function(data) {

				console.log($scope.form.USER_NUMBER);
				console.log($scope.form.CERT_NUMBER);
				console.log($scope.form.CERT_ADDRESS);
				console.log($scope.form.CUSTOMER_NAME);
				console.log($scope.form.CONTACT_MAN);
				console.log($scope.form.CONTACT_PHONE);
				console.log($scope.form.CONTACT_ADDRESS);
				console.log($scope.form.SALE_PLACE);
				console.log($scope.form.SALE_PERSON);
				console.log($scope.form.DEVELOP_CODE);
				console.log($scope.form.CHAN_CODE);
				console.log($scope.form.CHAN_ID);
				console.log($scope.form.GOV);
				console.log($scope.form.GENDER);
				console.log($scope.form.FROM);
				console.log($scope.form.TO);

				if (data.header.code == '0') {
					var code = data.header.message;

					if (code == "00000") {
						$scope.form.regResult = '实名制登记成功';
						message = "实名制登记成功！";
					} else if (code == "00002") {
						$scope.form.regResult = '此号码已经被实名登记';
						message = "此号码已经被实名登记，不需要再登记！";
					} else {
						if (resultCodDef[code] != undefined) {
							$scope.form.regResult = resultCodDef[code];
							message = $scope.form.regResult;
						} else {
							$scope.form.regResult = "处理失败，错误代码：" + code;
							message = "发生未知错误！错误代码：" + code;
						}
					}
					$scope.showMessage();

				} else {
					alert("无法与远程服务器建立连接！请稍后重试！");
				}
			});
		};*/

		//提交订单，接口4
		$scope.getOrderData = function() {
			//提单必须要商品ID，所以尽管这个业务实际上是没有商品的，但是这里也调用接口生成一个虚拟的商品ID
			var goodsId = ""; //虚拟商品ID
			$srhttp.get("!ESale/Mall/Goods/~query/Q_VIRTUAL_GOODS", {
				businessId: $scope.form.businessId
			}, function(data) {
				if (data.header.code == '0') {
					//判断商品是否为空：
					if (data.body.rows.length > 0) {
						goodsId = data.body.rows[0]["ID"];
					}
					//判断是否取到有效的商品ID
					if (goodsId == undefined || goodsId == "") {
						alert("对不起，无法创建订单,请检查是否匹配有实名制业务");
						$("#submit").addClass("theme_btn"); //使提交变成橙色
						return;
					}

					//提交订单所需要的参数
					var result = {};
					result['list'] = {
						'list': [{
							'goodsId': goodsId,
							'quantity': '1'
						}]
					};
					result['ext'] = {
						'ext': {
							'BUSINESS.HIDDEN': [{
								'key': 'ISP',
								'val': $scope.form.COMPANY_TYPE, //值为CU.CN.CM
								'key_as': '运营商'
							}],
							'BUSINESS.INT': [{
								'key': 'PHONE_NUMBER',
								'val': $scope.form.USER_NUMBER,
								'key_as': '号码'
							}],
							'BUSINESS': [{
								'key': 'BRAND_NAME',
								'val': $scope.form.BRAND_NAME,
								'key_as': '运营商'
							}, {
								'key': 'CardID',
								'val': $scope.form.CardID,
								'key_as': '身份证ID'
							}, {
								'key': 'DEVICE_NAME',
								'val': $scope.form.DEVICE_NAME,
								'key_as': '身份证读取设备型号'
							}],
							'BASE': [{
								'key': 'CUSTOMER_NAME',
								'val': $scope.form.CUSTOMER_NAME,
								'key_as': '客户姓名'
							}, {
								'key': 'CERT_ADDRESS',
								'val': $scope.form.CERT_ADDRESS,
								'key_as': '证件地址'
							}, {
								'key': 'CONTACT_NAME',
								'val': $scope.form.CONTACT_NAME,
								'key_as': '联系人'
							}, {
								'key': 'CONTACT_PHONE',
								'val': $scope.form.CONTACT_PHONE,
								'key_as': '联系电话'
							}, {
								'key': 'ISS_USING',
								'val': $scope.form.GOV,
								'key_as': '签发机关'
							}, {
								'key': 'CONTACT_ADDRESS',
								'val': $scope.form.CONTACT_ADDRESS,
								'key_as': '通信地址'
							}, {
								'key': 'GENDER',
								'val': $scope.form.GENDER,
								'key_as': '性别'
							}, {
								'key': 'NATION',
								'val': $scope.form.NATION,
								'key_as': '民族'
							}, {
								'key': 'CERT_NUMBER',
								'val': $scope.form.CERT_NUMBER,
								'key_as': '证件号码'
							}, {
								'key': 'SALE_PLACE',
								'val': $scope.form.SALE_PLACE,
								'key_as': '营业点'
							}, {
								'key': 'SALE_PERSON',
								'val': $scope.form.SALE_PERSON,
								'key_as': '营业员'
							}, {
								'key': 'DEVELOP_CODE',
								'val': $scope.form.DEVELOP_CODE,
								'key_as': '总部发展人编码'
							}, {
								'key': 'CHAN_CODE',
								'val': $scope.form.CHAN_CODE,
								'key_as': '总部渠道编码'
							}, {
								'key': 'CHAN_ID',
								'val': $scope.form.CHAN_ID,
								'key_as': 'BSS渠道ID'
							}, {
								'key': 'GOODS_ADD_TITLE',
								'val': $scope.form.USER_NUMBER,
								'key_as': '商品附加标题'
							}],
							'BASE.IMG': [{
								'key': 'ID_PIC_FRONT',
								'val': frontPicId,
								'key_as': '身份证正面照片'
							}, {
								'key': 'ID_PIC_BACK',
								'val': backPicId,
								'key_as': '身份证反面照片'
							}],
							'BASE.DATE': [{
									'key': 'CERT_VALID_FROM',
									'val': $scope.form.FROM,
									'key_as': '证件有效期开始'
								}, //证件有效日期开始
								{
									'key': 'CERT_VALID_TO',
									'val': $scope.form.TO,
									'key_as': '证件有效期结束'
								} //证件有效日期
							]
						}
					};

					$scope.form['list'] = rdcp.json2str(result.list);
					$scope.form['ext'] = rdcp.json2str(result.ext);
					$scope.form['CONTACT_ADDRESS']=$scope.form.CONTACT_ADDRESS;
					$scope.form['CONTACT_NAME']=$scope.form.CONTACT_NAME;
					$scope.form['CONTACT_PHONE']=$scope.form.CONTACT_PHONE;

					//调用创建订单方法
					$scope.create_order();
				}
			});
		}

		//创建订单，接口5
		$scope.create_order = function() {
			$srhttp.post("!ESale/Business/VirtualService/Phone/RealName/~java/Real.create", $scope.form, function(data) {

				//提交后，不管成功失败，先把验证码删除掉
				$scope.form.CODE = "";
				$scope.form.CODE_TYPE = "";

				if (data.header.code == 0) {
					$("#submit").addClass("theme_btn"); //使提交变成橙色
					alert(data.header.message);
					var creatorName = data.body["creator_member_name"];
					var devId = data.body["member_id"];
					$scope.sendMessage(devId, creatorName + "的订单已经生成,请注意接收查看");
					$("#code_div").hide();
					$("#img_code").hide();
				} else if (data.header.code == 1) {
					$("#submit").addClass("theme_btn"); //使提交变成橙色
					$scope.form.CODE_TYPE = data.body.codeType; //验证码类型，图片
					$("#code_div").show();
					$("#img_code").hide();
					alert("短信验证码已发送到手机，请先输入验证码");
				} else if (data.header.code == 2) {
					$("#submit").addClass("theme_btn"); //使提交变成橙色
					$scope.form.CODE_TYPE = data.body.codeType; //验证码类型短信
					$("#code_div").show();
					$("#img_code").show();
					$scope.img_code = data.body.img; //获取图片
					alert("请先输入图片验证码");
				} else if (data.header.code == 3) {
					$("#submit").addClass("theme_btn"); //使提交变成橙色
					alert(data.header.message);
					$("#code_div").hide();
					$("#img_code").hide();
				} else {
					$("#submit").addClass("theme_btn"); //使提交变成橙色
					alert(data.header.code+":"+data.header.message);
					$("#code_div").hide();
					$("#img_code").hide();
				}

				$("#submit").addClass("theme_btn"); //使提交变成橙色
			});
		}

		$scope.sendMessage = function(memberId, msg) {
			$srhttp.get("!ESale/System/Base/~java/MessageTrans.sendMessage", {
				distination: memberId,
				param: msg
			}, function(data) {
				if (data.header.code == 0) {
					//alert(message); //将之前实名的结果显示出来
				} else {
					//alert("往后台写入信息失败");
				}
			})
		}

	}
]);

//苹果设备则隐藏设备选择下拉列表
device_show = function() {
	if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
		$("#readerTypeSelect").hide();
	}
}
device_show();

/** 当用户点击蓝牙读取时调*/
function bluetoothRead() {
	//mask("正在读取中...");
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

			$("#name").val(bluetoothInfo.name).trigger('change');
			$("#cert_address").val(bluetoothInfo.address).trigger('change');
			$("#gov").val(bluetoothInfo.issuedat).trigger('change');
			$("#gender").val(bluetoothInfo.sex).trigger('change');
			$("#certNumber").val(bluetoothInfo.cardno).trigger('change');
			$("#nation").val(bluetoothInfo.nation).trigger('change');
			$("#born").val(bluetoothInfo.born).trigger('change');
			$("#picture").val(bluetoothInfo.picture).trigger('change');
			try {
				$("#device_name").val(bluetoothInfo.DeviceName).trigger('change'); //二合一设备型号
			} catch (err) {
				console.log("设备型号无法读取到");
				$("#device_name").val("").trigger('change');
			}

			//alert("设备为："+bluetoothInfo.DeviceName);
			//alert("身份证读取成功");

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
			//使提交变成橙色
			$("#submit").addClass("theme_btn");

			/*//请求合成身份证照片,说是不需要图片，所以注释了
			myPhoto.request("!ESale/System/IDCard/~java/IDCardImg.create", bluetoothInfo, function(data) {
				if (data.header.code == 0) {
					//正面照，反面照
					frontPicId = data.body.cardon;
					backPicId = data.body.cardoff;
				} else {
					alert("身份证照片合成失败！");
				}
				unmask();
			});*/

		} else {
			/*if (/android/i.test(navigator.userAgent)) {
				alert('身份证读取失败，请重试');
			}*/
		}
	} catch (err) {
		alert("处理异常，请稍后重试");
	} finally {
		unmask();
	}
}

/**监听用户号码的输入框，如果位数超过11位则自动截取前11位*/
function handleChange() {
	userNumber = $("#number").val();
	if (userNumber.length > 11) {
		$("#number").val(userNumber.slice(0, 11)).trigger('change');
	}
}

//生成身份证ID
function InsertIDCard(obj) {
	var result = {};
	result.name = obj.name; //姓名
	result.sex = obj.gender ? (obj.gender == '男' ? '1' : '2') : "1"; //性别
	result.nation = obj.nation; //民族
	result.address = obj.paper_addr ? obj.paper_addr : ' '; //地址
	result.cardNo = obj.paper_num ? obj.paper_num : ' '; //身份号码
	result.issuedAt = obj.str_office ? obj.str_office : '无'; //签发机关
	result.effectedDate = obj.paper_stime ? obj.paper_stime.replace(/-/g, '') : ' '; //开始时间
	result.expiredDate = obj.paper_time ? obj.paper_time.replace(/-/g, '') : ' '; //终止有效期
	result.CardReaderId = '0000000000';
	result.born = obj.born;
	result.picture = obj.picture;
	result.ID = "";

	$.ajax({
		type: "post",
		url: APP_CONFIG.SERVER_URL + "!ESale/System/IDCard/~java/IDCardINFO.InsertIDCard?data=" + encodeURIComponent(JSON.stringify(result)),
		//data:result,
		success: function(data) {
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