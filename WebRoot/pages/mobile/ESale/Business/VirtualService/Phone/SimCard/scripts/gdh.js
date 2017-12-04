var selectPackage = {};
var message = "";
var imgData = {
    "front": '',
    'contrary': '',
    'writeCard': '',
    'hand': ''
};
var myPhoto = {};
app.registerCtrl("gdh", ["$scope", "$srhttp", "$rootScope",

	function($scope, $srhttp, $rootScope) {

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		$rootScope.appTitle = "广州集客";

		selectPackage.scope = $scope;
		selectPackage.srhttp = $srhttp;
		selectPackage.rootScope = $rootScope;
		//初始化属性
		$scope.form = {
				CUSTOMER_NAME: "", //客户姓名
				CERT_TYPE: "", //证件类型
				CERT_TYPE_NAME: "", //证件名称
				CERT_ADDRESS: "", //证件地址
				CONTACT_MAN: "", //联系人
				CONTACT_PHONE: "", //联系电话
				POSTAL_ADDRESS: "", //通讯地址
				GENDER: "", //性别
				ISS_USING: "", //签证机关
				CERT_NUMBER: "", //身份证号码
				CERT_VALID_FROM: "", //身份证生效日期
				CERT_VALID_TO: "", //身份证失效日期
				BIRTHDAY: "", //出生年月
				NATION: "", //民族

				ID_PIC_FRONT: "", //正面
				ID_PIC_PEO: "", //手持
				ID_PIC_BACK: "", //背面照
				ID_PIC_COPHONE: "", //集团营业执照正反面
				ID_PIC_USERPHONE: "", //使用人证件正反面
				ID_PIC_LEGALPHONE: "", //法人证件正反面
				
				BAND_TYPE:"",//宽带类型
				OLDBAND_NUM:"",//老宽带账号
				BAND_MODEL:"",//宽带模式
				DRESEE:"",//地址
				CUSTOMER_TYPE:"",//用户类型
				OLDCUSTOMER_NUM:"",//老用户电话
				NOTE:"",//备注
				PHONE1:{//手机号码及串号
					NUM:"",
					IMEI:"",
				},
				PHONE2:{//手机号码及串号
					NUM:"",
					IMEI:"",
				},
				PHONE3:{//手机号码及串号
					NUM:"",
					IMEI:"",
				},
				PHONE4:{//手机号码及串号
					NUM:"",
					IMEI:"",
				},
				PHONE5:{//手机号码及串号
					NUM:"",
					IMEI:"",
				},
				PHONE6:{//手机号码及串号
					NUM:"",
					IMEI:"",
				},
				PHONE7:{//手机号码及串号
					NUM:"",
					IMEI:"",
				},
				PHONE8:{//手机号码及串号
					NUM:"",
					IMEI:"",
				},
				PHONE9:{//手机号码及串号
					NUM:"",
					IMEI:"",
				},
			};
		
		$scope.submit = function() {
			$scope.form.CUSTOMER_NAME = "林创荣";
			$scope.form.GENDER = "男";
			$scope.form.CERT_ADDRESS = "广东省汕头市";
			$scope.form.CERT_NUMBER = "440947656565657483";
			$scope.form.ISS_USING = "汕头市公安局";
			$scope.form.CERT_VALID_FROM = "20120982";
			$scope.form.CERT_VALID_TO = "20203856";
			$scope.form.NATION = "汉族";
			$scope.form.BORN = "1994年10月14日";
			$scope.form.PICTURE = 'fafbghrhfdhdhtr';
			
			//添加满足判断
			if($scope.form.CUSTOMER_NAME==""){
				alert("请先进行身份验证!");
				return;
			};
			if($scope.form.BAND_TYPE==""){
				alert("请选择宽带类型!");
				return;
			};
			if($scope.form.BAND_TYPE=="老宽带"){
				if($scope.form.OLDBAND_NUM==""){
					alert("请输入老宽带账号!");
					return;
				};
			};
			if($scope.form.BAND_MODEL==""){
				alert("请选择宽带模式!");
				return;
			};
			if($scope.form.DRESEE==""){
				alert("请填写详细地址!");
				return;
			};
			if($scope.form.CUSTOMER_TYPE==""){
				alert("请选择固话类型!");
				return;
			};
			if($scope.form.CUSTOMER_TYPE=="老用户"){
				if($scope.form.OLDCUSTOMER_NUM==""){
					alert("请输入老用户号码!");
					return;
				}
			};
			if ($scope.form.NOTE.length > 100) {
					alert("备注请不要超过100个字符，已超出" + ($scope.form.NOTE.length - 100) + "个字符");
					return;
				};
			//添加满足判断

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
					"picture": $scope.form.PICTURE
				};
				var paramData = $scope.getParamData();
				//开始创建订单
				$scope.request.creatOrder(paramData);
		};
		
		//设置参数
		$scope.getParamData=function() {
			var result = {};
			result['list'] = {
				'list': []
			};

			result['ext'] = {
				'ext': {
					'BUSINESS': [{
						'key': 'BAND_TYPE',
						'val': $scope.form.BAND_TYPE,
						'key_as': '宽带类型'
					}, {
						'key': 'OLDBAND_NUM',
						'val': $scope.form.OLDBAND_NUM,
						'key_as': '老宽带账号'
					}, {
						'key': 'BAND_MODEL',
						'val': $scope.form.BAND_MODEL,
						'key_as': '宽带模式'
					}, {
						'key': 'DRESEE',
						'val': $scope.form.DRESEE,
						'key_as': '地址'
					}, {
						'key': 'CUSTOMER_TYPE',
						'val': $scope.form.CUSTOMER_TYPE,
						'key_as': '用户类型'
					}, {
						'key': 'OLDCUSTOMER_NUM',
						'val': $scope.form.OLDCUSTOMER_NUM,
						'key_as': '老用户电话'
					}, {
						'key': 'NOTE',
						'val': $scope.form.NOTE,
						'key_as': '备注'
					}, {
						'key': 'PHONE1_NUM',
						'val': $scope.form.PHONE1.NUM,
						'key_as': '手机1号码'
					}, {
						'key': 'PHONE1_IMEI',
						'val': $scope.form.PHONE1.IMEI,
						'key_as': '手机1串号'
					}, {
						'key': 'PHONE2_NUM',
						'val': $scope.form.PHONE2.NUM,
						'key_as': '手机2号码'
					}, {
						'key': 'PHONE2_IMEI',
						'val': $scope.form.PHONE2.IMEI,
						'key_as': '手机2串号'
					}, {
						'key': 'PHONE3_NUM',
						'val': $scope.form.PHONE3.NUM,
						'key_as': '手机3号码'
					}, {
						'key': 'PHONE3_IMEI',
						'val': $scope.form.PHONE3.IMEI,
						'key_as': '手机3串号'
					}, {
						'key': 'PHONE4_NUM',
						'val': $scope.form.PHONE4.NUM,
						'key_as': '手机4号码'
					}, {
						'key': 'PHONE4_IMEI',
						'val': $scope.form.PHONE4.IMEI,
						'key_as': '手机4串号'
					}, {
						'key': 'PHONE5_NUM',
						'val': $scope.form.PHONE5.NUM,
						'key_as': '手机5号码'
					}, {
						'key': 'PHONE5_IMEI',
						'val': $scope.form.PHONE5.IMEI,
						'key_as': '手机5串号'
					}, {
						'key': 'PHONE6_NUM',
						'val': $scope.form.PHONE6.NUM,
						'key_as': '手机6号码'
					}, {
						'key': 'PHONE6_IMEI',
						'val': $scope.form.PHONE6.IMEI,
						'key_as': '手机6串号'
					}, {
						'key': 'PHONE7_NUM',
						'val': $scope.form.PHONE7.NUM,
						'key_as': '手机7号码'
					}, {
						'key': 'PHONE7_IMEI',
						'val': $scope.form.PHONE7.IMEI,
						'key_as': '手机7串号'
					}, {
						'key': 'PHONE8_NUM',
						'val': $scope.form.PHONE8.NUM,
						'key_as': '手机8号码'
					}, {
						'key': 'PHONE8_IMEI',
						'val': $scope.form.PHONE8.IMEI,
						'key_as': '手机8串号'
					}, {
						'key': 'PHONE9_NUM',
						'val': $scope.form.PHONE9.NUM,
						'key_as': '手机9号码'
					}, {
						'key': 'PHONE9_IMEI',
						'val': $scope.form.PHONE9.IMEI,
						'key_as': '手机9串号'
					}],
					'BASE': [{
						'key': 'CardID',
						'val': $scope.form.CardID,
						'key_as': '身份证ID'
					}, {
						'key': 'CUSTOMER_NAME',
						'val': $scope.form.CUSTOMER_NAME,
						'key_as': '客户姓名'
					}, {
						'key': 'CERT_ADDRESS',
						'val': $scope.form.CERT_ADDRESS,
						'key_as': '证件地址'
					}, {
						'key': 'CONTACT_MAN',
						'val': $scope.form.CUSTOMER_NAME,
						'key_as': '联系人'
					}, {
						'key': 'ISS_USING',
						'val': $scope.form.GOV,
						'key_as': '签发机关'
					}, {
						'key': 'POSTAL_ADDRESS',
						'val': $scope.form.CERT_ADDRESS,
						'key_as': '通讯地址'
					}, {
						'key': 'GENDER',
						'val': $scope.form.GENDER,
						'key_as': '性别'
					}, {
						'key': 'CERT_NUMBER',
						'val': $scope.form.CERT_NUMBER,
						'key_as': '证件号码'
					}],
					'BASE.IMG': [{
						'key': 'ID_PIC_FRONT',
						'val': $scope.form.ID_PIC_FRONT,
						'key_as': '身份证正面照片'
					}, {
						'key': 'ID_PIC_BACK',
						'val': $scope.form.ID_PIC_BACK,
						'key_as': '身份证反面照片'
					}, {
						'key': 'ID_PIC_PEO',
						'val': $scope.form.ID_PIC_PEO,
						'key_as': '身份证手持照片'
					}],
					'BUSINESS.INT': [],
					'BASE.DATE': [{
						'key': 'CERT_VALID_FROM',
						'val': $scope.form.FROM,
						'key_as': '证件有效期开始'
					}, {
						'key': 'CERT_VALID_TO',
						'val': $scope.form.TO,
						'key_as': '证件有效期结束'
					}]
				}
			};
			return result;
		};
		$scope.request = {
				creatOrder: function(paramData) {
					$srhttp.post("!ESale/Mall/Order/~java/Order.create", {
						"list": rdcp.json2str({
							"list": []
						}),
						"ext": JSON.stringify(paramData.ext),
						"businessId": ""
					}, function(data) {
						if (data.header.code == 0) {
							var creatorName = data.body["creator_member_name"];
							var devId = data.body["member_id"];
							$scope.request.sendMessage(devId, creatorName + "的订单已经生成,请注意接收查看");
							alert("订单创建成功");
							hrefJump('orders');
						} else {
							alert("订单创建失败！" + e.message);
						}
					});
				},

				//不管定单处理成功失败，往后台写入信息
				sendMessage: function(memberId, msg) {
					$srhttp.get("!ESale/System/Base/~java/MessageTrans.sendMessage", {
						distination: memberId,
						param: msg
					}, function(data) {})
				},
			};
		
	}
]);

//区域选择
app.registerCtrl("AreaLayoutCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
	//后台请求数据
	/*	$scope.loadMessage = function() {
			$srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_AREA_CITY", {}, function(data) {
				//代码区
			});
		};*/

		//区域选择(龚道海)
		$scope.select = function(id1,id2) {
			if(id1=="new"){
				$scope.form.BAND_TYPE="新宽带";
			}else{
				$scope.form.BAND_TYPE="老宽带";
			}
			$("#"+id1).addClass("com_selectbtnon");
			$("#"+id2).removeClass("com_selectbtnon");
			if(id1=="old"){
				$("#old_num").show();
			}else{
				$("#old_num").hide();
			}
		};


		//接收广播
		$scope.$on('AreaLayoutCtrl', function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				$("#AreaDiv").show();
				setTimeout(function() {
					$("#CONTAINER").scrollTop(9999);
				}, 300);

				//钩选上次选中的项
				/*if($scope.form.AREA_ID!=""){
					$("#AreaDiv a[DataId*="+$scope.form.AREA_ID+"]").addClass("com_selectbtnon");
					//发送广播
					$rootScope.$broadcast("CertLayoutCtrl", 1);
				}*/
			} else {
				$("#AreaDiv").nextAll().hide();
			}
		});
	}
]);

//客户基础资料
app.registerCtrl("CusInfoCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载客户基础资料
	/*	$scope.loadMessage = function() {
				//加载证件类型数据
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/potal/Q_CERT_TYPE_LIST", {}, function(data) {
					$scope.certs = data;
					$("#cert_type option:eq(0)").attr("selected", "selected"); //默认第一个被选中
				});
			};*/
			//接收广播
/*		$scope.$on('CusInfoCtrl', function(event, data) {
			$scope.loadMessage();
			$scope.certType1 = data;

			$("#CusInfoDiv").show();
			setTimeout(function() {
				$("#CONTAINER").scrollTop(9999);
			}, 300);
			$rootScope.$broadcast("CardTypeCtrl", 1);
		});*/
	
/*		$scope.addform = function(id1) {
			var a=$("#num"+id1).val();
			var b=$("#imei"+id1).val();
			if(a!=""&&b!=""){
				$("#form"+id1).show();
			}
		};*/
	
	//展开大项
	var a=true;
	$scope.unfold=function(){
		if(a){
			$(".layout_secondbox").show();
			$("#unfold").addClass("morebtnup");
			a=false;
		}else{
			$(".layout_secondbox").hide();
			$("#unfold").removeClass("morebtnup");
			a=true;
		};
		
		
	};
	
	//展开小项
	var a1=true;
	$scope.addform1=function(){
		if(a1){
			$(".formlist1").show();
			$("#form1").addClass("morebtnup");
			$("#form1").html("折叠");
			a1=false;
		}else{
			$(".formlist1").hide();
			$("#form1").removeClass("morebtnup");
			$("#form1").html("展开");
			a1=true;
		};
	};
	//展开小项
	var a2=true;
	$scope.addform2=function(){
		if(a2){
			$(".formlist2").show();
			$("#form2").addClass("morebtnup");
			$("#form2").html("折叠");
			a2=false;
		}else{
			$(".formlist2").hide();
			$("#form2").removeClass("morebtnup");
			$("#form2").html("展开");
			a2=true;
		};
	};
	//展开小项
	var a3=true;
	$scope.addform3=function(){
		if(a3){
			$(".formlist3").show();
			$("#form3").addClass("morebtnup");
			$("#form3").html("折叠");
			a3=false;
		}else{
			$(".formlist3").hide();
			$("#form3").removeClass("morebtnup");
			$("#form3").html("展开");
			a3=true;
		};
	};
	//展开小项
	var a4=true;
	$scope.addform4=function(){
		if(a4){
			$(".formlist4").show();
			$("#form4").addClass("morebtnup");
			$("#form4").html("折叠");
			a4=false;
		}else{
			$(".formlist4").hide();
			$("#form4").removeClass("morebtnup");
			$("#form4").html("展开");
			a4=true;
		};
	};
	//展开小项
	var a5=true;
	$scope.addform5=function(){
		if(a5){
			$(".formlist5").show();
			$("#form5").addClass("morebtnup");
			$("#form5").html("折叠");
			a5=false;
		}else{
			$(".formlist5").hide();
			$("#form5").removeClass("morebtnup");
			$("#form5").html("展开");
			a5=true;
		};
	};
	//展开小项
	var a6=true;
	$scope.addform6=function(){
		if(a6){
			$(".formlist6").show();
			$("#form6").addClass("morebtnup");
			$("#form6").html("折叠");
			a6=false;
		}else{
			$(".formlist6").hide();
			$("#form6").removeClass("morebtnup");
			$("#form6").html("展开");
			a6=true;
		};
	};
	//展开小项
	var a7=true;
	$scope.addform7=function(){
		if(a7){
			$(".formlist7").show();
			$("#form7").addClass("morebtnup");
			$("#form7").html("折叠");
			a7=false;
		}else{
			$(".formlist7").hide();
			$("#form7").removeClass("morebtnup");
			$("#form7").html("展开");
			a7=true;
		};
	};
	//展开小项
	var a8=true;
	$scope.addform8=function(){
		if(a8){
			$(".formlist8").show();
			$("#form8").addClass("morebtnup");
			$("#form8").html("折叠");
			a8=false;
		}else{
			$(".formlist8").hide();
			$("#form8").removeClass("morebtnup");
			$("#form8").html("展开");
			a8=true;
		};
	};
	//展开小项
	var a9=true;
	$scope.addform9=function(){
		if(a9){
			$(".formlist9").show();
			$("#form9").addClass("morebtnup");
			$("#form9").html("折叠");
			a9=false;
		}else{
			$(".formlist9").hide();
			$("#form9").removeClass("morebtnup");
			$("#form9").html("展开");
			a9=true;
		};
	};
	
	
		//选择宽带类型
		$scope.select = function(id1,id2,id3) {
			if(id1=="ADSL"){
				$scope.form.BAND_MODEL="ADSL";
			}else if(id1=="FTTH"){
				$scope.form.BAND_MODEL="FTTH";
			}else{
				$scope.form.BAND_MODEL="LAN";
			}
			$("#"+id1).addClass("com_selectbtnon");
			$("#"+id2).removeClass("com_selectbtnon");
			$("#"+id3).removeClass("com_selectbtnon");
		};
		//选择固话
		$scope.select1 = function(id1,id2) {
			if(id1=="new1"){
				$scope.form.CUSTOMER_TYPE="新用户";
			}else{
				$scope.form.CUSTOMER_TYPE="老用户";
			}
			$("#"+id1).addClass("com_selectbtnon");
			$("#"+id2).removeClass("com_selectbtnon");
			if(id1=="old1"){
				$("#old_num1").show();
			}else{
				$("#old_num1").hide();
			}
		};

		//手机和串号选择
		
		
		
		}
]);























//蓝牙读取按钮的点击事件函数
$('#bluetooth_read_btn').on('click', function() {
	check();
});

//蓝牙读取接口的回调方法，将信息填入相应表单，覆盖mobile_framework.js的同名方法
function onReadIDCardFinish(bluetoothInfoStr) {

	if (bluetoothInfoStr != "{}") {
		var bluetoothInfo = $.parseJSON(bluetoothInfoStr);

		//添加身份证读取失败信息获取
		if (bluetoothInfo.result != undefined && bluetoothInfo.result != 0) {
			alert(getReadCardResult(bluetoothInfo.result));
			unmask();
			return;
		}

		$("#customer_name").val(bluetoothInfo.name).trigger('change'); //身份证名字

		//性别
		if (bluetoothInfo.sex == "男") {
			$("#man").addClass("radiobtnon");
			$("#woman").removeClass("radiobtnon");
			$("#gender").val("男").trigger('change');
		} else {
			$("#woman").addClass("radiobtnon");
			$("#man").removeClass("radiobtnon");
			$("#gender").val("女").trigger('change');
		}

		$("#cert_number").val(bluetoothInfo.cardno).trigger('change'); //身份证号码

		var date1 = bluetoothInfo.effecteddate;
		date1 = date1.substring(0, 4) + "-" + date1.substring(4, 6) + "-" + date1.substring(6, 8);
		var date2 = bluetoothInfo.expireddate;
		date2 = date2.substring(0, 4) + "-" + date2.substring(4, 6) + "-" + date2.substring(6, 8);

		$("#cert_valid_from").val(date1).trigger('change'); //身份证有效期的开始时间（蓝牙那边读取出来的是2015.01.01，要把“.”换成“-”才能放进date类型的input）
		$("#cert_valid_to").val(date2).trigger('change'); //身份证有效期的结束时间
		$("#iss_using").val(bluetoothInfo.issuedat).trigger('change'); //身份证的发证机关
		$("#cert_address").val(bluetoothInfo.address).trigger('change'); //身份证地址
		$("#nation").val(bluetoothInfo.nation).trigger('change'); //身份证地址

		$("#postal_address").val(bluetoothInfo.address).trigger('change'); //通讯地址与证件地址一样

		//请求合成身份证照片
		mask("正在合成身份证照片，请稍等...");
		selectPackage.srhttp.request("!ESale/System/IDCard/~java/IDCardImg.create", bluetoothInfo, function(data) {

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
		//alert('身份证读取失败，请重试');
	}
	unmask();

}

/*
 * 读卡号填写在成卡框
 */

function ckCard() {
	if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
		check();
	} else {
		mask("蓝牙二合一设备正在读取中，请稍后……");
		setTimeout("Reader.ReadCardNo()", 80);
	}
}

function onReadCardFinish(Card) {
	if (Card == -3) {
		alert("连接阅读器失败");
		return;
	}
	if (Card == -1) {
		alert("打开卡失败");
		return;
	}
	if (Card != undefined && Card != "") {
		if (Card.substr(0, 2) == "98") {
			unmask();
			Card = Card.replace(/\s/g, "");
			var cardRet = Card.substr(0, 20);
			var cardNum = dealCardNum(cardRet);
			if (cardNum.length != "20") {
				alert("提示", "读出卡号有问题，请重试或者人工输入");
				return false;
			}
			cardNum = cardNum.substr(0, 19);
			$("#ckNum").val(cardNum).trigger('change');
		} else {
			unmask();
			var cardNum = Card.substr(0, 20);
			//var cardNum=dealCardNum(cardRet);
			if (cardNum.length != "20") {
				alert("提示", "读出卡号有问题，请重试或者人工输入");
				return false;
			}
			cardNum = cardNum.substr(0, 19);
			$("#ckNum").val(cardNum).trigger('change');
		}
		return true;
	} else {
		unmask();
		alert(Card);
		return false;
	}
}

//苹果设备的图片上传功能
function uploadImg(id) {
	mask("文件上传中...");
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

			if (!(id == "writeCard")) {
				$('#progressBar').css("width", "0%");
				document.getElementById('progressBar').innerHTML = '0%';
			}


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

				//如果不是成卡图，则加载进度条
				if (!(id == "writeCard")) {
					var percentComplete = Math.round(evt.loaded * 100 / evt.total);
					$('#progressBar').css("width", percentComplete.toString() + "%"); //使用bootstrap滑动条显示上传进度
					document.getElementById('progressBar').innerHTML = percentComplete.toString() + '%';
				}

			} else {
				document.getElementById('progressBar').innerHTML = 'unable to compute';
			}
		},
		uploadComplete: function(evt) {
			var response = rdcp.str2json(evt.target.responseText)[0];
			imgData[id] = response.id;
			$("#" + id).parent().css("background", "url('" + APP_CONFIG.SERVER_URL + response.thumbURL + "')");
			unmask();
		}
	});
}

//拍照上传
function OnUploadBegin() {
	$("#upload_text").empty().append("图片正在上传，请耐心等待...");
}

//拍照上传图片回调
function OnUploadFinish(result) {

	if (result) {
		//window.native.toast("处理结果是：" + result);
		result = $.parseJSON(result)[0];
		if (result.id) {
			$('#progressBar').css("width", "100%").empty().append('100%');
			imgData[result._param] = result.id;
			$("#new_img_" + result._param).parent().css("background", "url('" + APP_CONFIG.SERVER_URL + result.thumbURL + "')");
		}
		$("#upload_text").empty().append("图片上传成功");
	} else {
		$("#upload_text").empty().append("图片上传失败!请重新上传...");
	}
}