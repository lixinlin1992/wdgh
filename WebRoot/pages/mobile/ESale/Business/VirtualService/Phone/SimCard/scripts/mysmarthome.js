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
	
	
	//展示手机号码块
	$scope.num=1;
	$scope.form={
			'numId': '',
			'goodsId': '',
			'number': '',
			'busiId': '',
			'dksId': '',
			'dksName': '',
			'is_white': '',
			'is_rele': '',
			'netWork': '',
	};
	$scope.page = 1;
	$scope.pageSize = 9;
	$scope.numPageSize = 8;
		$srhttp.get("!ESale/Mall/Goods/~query/Q_GOODS_NUMBER_COMMON", {
			'priceorder': 'priceLowToHigh',
			'typeId': 'ChinaUnicom.Account.Number',
			'account_type': '2',
			'pageSize':$scope.numPageSize,
			'businessId':'ChinaUnicom.Account.4G.BK', //ChinaUnicom.Account.4G.BK
			'title':'',// $scope.title,
			'brandId': 'CU',//$scope.brandId,//业务选择
		}, function(data) {
			if (!data.body.pageCount == 0) {
				$scope.numlist = data.body.rows;
			}
			//当无数据时，修改文本值
			if (data.body.rows.length < $scope.numPageSize) {
				$(".com_showmore a.more_btn").text("已无更多数据");
			};
		});
		
	$scope.chose=function(num){
		for ( var int = 1; int < 10; int++) {
			if($("#num"+int).val()==num){
				if(int!=1||$scope.num!=1){
					alert("你不能重复选择号码");
				}
				return;
			}
		}
		$("#num"+$scope.num).val(num);
		if($scope.num==1){
			$scope.form.PHONE1.NUM=num;
		}
		if($scope.num==2){
			$scope.form.PHONE2.NUM=num;
		}
		if($scope.num==3){
			$scope.form.PHONE3.NUM=num;
		}
		if($scope.num==4){
			$scope.form.PHONE4.NUM=num;
		}
		if($scope.num==5){
			$scope.form.PHONE5.NUM=num;
		}
		if($scope.num==6){
			$scope.form.PHONE6.NUM=num;
		}
		if($scope.num==7){
			$scope.form.PHONE7.NUM=num;
		}
		
		if($scope.num==8){
			$scope.form.PHONE8.NUM=num;
		}
		if($scope.num==9){
			$scope.form.PHONE9.NUM=num;
		}
	};	
	
	$scope.chosenum=function(num){
		$scope.num=num;
	};
	$scope.listShowAdd=function(){
		$scope.numPageSize *= 2;
		$srhttp.get("!ESale/Mall/Goods/~query/Q_GOODS_NUMBER_COMMON", {
			'priceorder': 'priceLowToHigh',
			'typeId': 'ChinaUnicom.Account.Number',
			'account_type': '2',
			'pageSize':$scope.numPageSize,
			'businessId':'ChinaUnicom.Account.4G.BK', //ChinaUnicom.Account.4G.BK
			'title':'',// $scope.title,
			'brandId': 'CU',//$scope.brandId,//业务选择
		}, function(data) {
			if (!data.body.pageCount == 0) {
				$scope.numlist = data.body.rows;
			}
			//当无数据时，修改文本值
			if (data.body.rows.length < $scope.numPageSize) {
				$(".com_showmore a.more_btn").text("已无更多数据");
			};
		});
	};
	
	
	
	

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		$rootScope.appTitle = "智慧沃家";

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
				CardID:"",//身份证ID
				
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
			
			/*$scope.form.CUSTOMER_NAME = "林创荣";
			$scope.form.GENDER = "男";
			$scope.form.CERT_ADDRESS = "广东省汕头市";
			$scope.form.CERT_NUMBER = "440947656565657483";
			$scope.form.ISS_USING = "汕头市公安局";
			$scope.form.CERT_VALID_FROM = "20120982";
			$scope.form.CERT_VALID_TO = "20203856";
			$scope.form.NATION = "汉族";
			$scope.form.BORN = "19941014";
			$scope.form.PICTURE = 'fafbghrhfdhdhtr';*/
			
			//添加满足判断
			if($scope.form.CUSTOMER_NAME==""){
				alert("请先进行身份验证!");
				return;
			};
			if($scope.form.CERT_NUMBER==""){
				alert("请先进行身份验证!");
				return;
			};
			if($scope.form.CONTACT_PHONE==""){
				alert("请输入电话号码!");
				return;
			};
			if($scope.form.CONTACT_PHONE!=""){
				var re=/^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/;//号码
				var a=re.test($scope.form.CONTACT_PHONE);
				if(!a){
					alert("电话号码格式错误!");
					return;
				}
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
				if($scope.form.OLDBAND_NUM!=""){
					var re=/[A-Za-z0-9]+$/;//宽带账号
					var a=re.test($scope.form.OLDBAND_NUM);
					if(a){
					}else{
						alert("宽带格式不正确!");
						return;
					}
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
			//验证是否输入手机号码
			if($scope.form.PHONE1.NUM==""){
				alert("请选择号码！");
				return;
			};
			//验证手机号码及串号
			if($scope.form.PHONE1.NUM!=""||$scope.form.PHONE1.IMEI!=""){
				var re=/\d{15}/;//串号
				var re1=/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;//号码
				var a=re.test($scope.form.PHONE1.IMEI);
				var b=re1.test($scope.form.PHONE1.NUM);
				console.info(b+"1 "+a);
				if(a||b){
				}else{
					alert("串号或号码的格式不正确！");
					return;
				};
			
			};
			if($scope.form.PHONE2.NUM!=""||$scope.form.PHONE2.IMEI!=""){
				var re=/\d{15}/;//串号
				var re1=/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;//号码
				var a=re.test($scope.form.PHONE2.IMEI);
				var b=re1.test($scope.form.PHONE2.NUM);
				console.info(b+" 2"+a);
				if(a||b){
				}else{
					alert("串号或号码的格式不正确！");
					return;
				};
			
			};
			if($scope.form.PHONE3.NUM!=""||$scope.form.PHONE3.IMEI!=""){
				var re=/\d{15}/;//串号
				var re1=/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;//号码
				var a=re.test($scope.form.PHONE3.IMEI);
				var b=re1.test($scope.form.PHONE3.NUM);
				console.info(b+" 3"+a);
				if(a||b){
				}else{
					alert("串号或号码的格式不正确！");
					return;
				};
			
			};
			if($scope.form.PHONE4.NUM!=""||$scope.form.PHONE4.IMEI!=""){
				var re=/\d{15}/;//串号
				var re1=/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;//号码
				var a=re.test($scope.form.PHONE4.IMEI);
				var b=re1.test($scope.form.PHONE4.NUM);
				console.info(b+" 4"+a);
				if(a||b){
				}else{
					alert("串号或号码的格式不正确！");
					return;
				};
			
			};
			if($scope.form.PHONE5.NUM!=""||$scope.form.PHONE5.IMEI!=""){
				var re=/\d{15}/;//串号
				var re1=/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;//号码
				var a=re.test($scope.form.PHONE5.IMEI);
				var b=re1.test($scope.form.PHONE5.NUM);
				console.info(b+" 5"+a);
				if(a||b){
				}else{
					alert("串号或号码的格式不正确！");
					return;
				};
			
			};
			if($scope.form.PHONE6.NUM!=""||$scope.form.PHONE6.IMEI!=""){
				var re=/\d{15}/;//串号
				var re1=/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;//号码
				var a=re.test($scope.form.PHONE6.IMEI);
				var b=re1.test($scope.form.PHONE6.NUM);
				console.info(b+" 6"+a);
				if(a||b){
				}else{
					alert("串号或号码的格式不正确！");
					return;
				};
			
			};
			if($scope.form.PHONE7.NUM!=""||$scope.form.PHONE7.IMEI!=""){
				var re=/\d{15}/;//串号
				var re1=/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;//号码
				var a=re.test($scope.form.PHONE7.IMEI);
				var b=re1.test($scope.form.PHONE7.NUM);
				console.info(b+" 7"+a);
				if(a||b){
				}else{
					alert("串号或号码的格式不正确！");
					return;
				};
			
			};
			if($scope.form.PHONE8.NUM!=""||$scope.form.PHONE8.IMEI!=""){
				var re=/\d{15}/;//串号
				var re1=/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;//号码
				var a=re.test($scope.form.PHONE8.IMEI);
				var b=re1.test($scope.form.PHONE8.NUM);
				console.info(b+"8 "+a);
				if(a||b){
				}else{
					alert("串号或号码的格式不正确！");
					return;
				};
			
			};
			if($scope.form.PHONE9.NUM!=""||$scope.form.PHONE9.IMEI!=""){
				var re=/\d{15}/;//串号
				var re1=/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;//号码
				var a=re.test($scope.form.PHONE9.IMEI);
				var b=re1.test($scope.form.PHONE9.NUM);
				console.info(b+" 9"+a);
				if(a||b){
				}else{
					alert("串号或号码的格式不正确！");
					return;
				};
			
			};
			
			/*if($scope.form.CUSTOMER_TYPE==""){
				alert("请选择固话类型!");
				return;
			};*/
			if($scope.form.CUSTOMER_TYPE=="老用户"){
				if($scope.form.OLDCUSTOMER_NUM==""){
					alert("请输入老用户号码!");
					return;
				};
				var re=/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
				var b=re.test($scope.form.OLDCUSTOMER_NUM);
				var re1=/\d{3}-\d{8}|\d{4}-\d{7}/;
				var c=re1.test($scope.form.OLDCUSTOMER_NUM);
				if(b||c){
				}else{
					alert("请输入正确的电话号码！");
					return;
				};
			};
			if ($scope.form.NOTE.length > 100) {
					alert("备注请不要超过100个字符，已超出" + ($scope.form.NOTE.length - 100) + "个字符");
					return;
				};
			//添加满足判断

			//生成身份证ID
				$scope.IDcardForm = {
					"name": $scope.form.CUSTOMER_NAME,
					"gender": $scope.form.GENDER,
					"paper_addr": $scope.form.CERT_ADDRESS,
					"paper_num": $scope.form.CERT_NUMBER,
					"str_office": $scope.form.ISS_USING,
					"paper_stime": $scope.form.CERT_VALID_FROM,
					"paper_time": $scope.form.CERT_VALID_TO,
					"nation": $scope.form.NATION,
					"born": $scope.form.BORN,
					"picture": $scope.form.PICTURE
				};
				$scope.form.CardID = InsertIDCard($scope.IDcardForm);
				if ($scope.form.CardID == '') {
	                  alert("身份证信息提交失败");
	                  return;
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
						'key': 'CONTACT_PHONE',
						'val': $scope.form.CONTACT_PHONE,
						'key_as': '号码'
					},{
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
						'val': $scope.form.ISS_USING,
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
						'val': imgData["front"],
						'key_as': '身份证正面照片'
					}, {
						'key': 'ID_PIC_BACK',
						'val': imgData["contrary"],
						'key_as': '身份证反面照片'
					}, {
						'key': 'ID_PIC_PEO',
						'val': imgData["hand"],
						'key_as': '身份证手持照片'
					}],
					'BUSINESS.INT': [],
					'BASE.DATE': [{
						'key': 'CERT_VALID_FROM',
						'val': $scope.form.CERT_VALID_FROM,
						'key_as': '证件有效期开始'
					}, {
						'key': 'CERT_VALID_TO',
						'val': $scope.form.CERT_VALID_TO,
						'key_as': '证件有效期结束'
					}]
				}
			};
			//循环判断手机及串号是否有值
			for ( var int = 1; int < 10; int++) {
				var a=int;
				var b=eval('$scope.form.PHONE'+a+'.NUM');
				var c=eval('$scope.form.PHONE'+a+'.IMEI');
				if(b!=""){
					result.ext.ext.BUSINESS.push({
						'key': 'PHONE'+int+'_NUM',
						'val': b,
						'key_as': '手机'+int+'号码'
					});
				};
				if(c!=""){
					result.ext.ext.BUSINESS.push({
						'key': 'PHONE'+int+'_IMEI',
						'val': c,
						'key_as': '手机'+int+'串号'
					});
				};
			}
			return result;
		};
		$scope.request = {
				creatOrder: function(paramData) {
					$srhttp.post("!ESale/Mall/Order/~java/Order.create", {
						"list": rdcp.json2str({
							"list": []
						}),
						"ext": JSON.stringify(paramData.ext),
						"businessId": "CU.HN.NY.ZHWJ"
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
/*	var a=true;
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
		
		
	};*/
	
	//展开小项
	var a1=true;
	var a2=true;
	var a3=true;
	var a4=true;
	var a5=true;
	var a6=true;
	var a7=true;
	var a8=true;
	$scope.addform1=function(){
		if(a1){
			$("#form1").show();
			$("#m1").removeClass("btn_add").addClass("btn_minus");
			a1=false;
		}else{
			$("#form1").hide();
			$("#m1").removeClass("btn_minus").addClass("btn_add");
			a1=true;
		}
	};
	$scope.addform2=function(){
		if(a2){
			$("#form2").show();
			$("#m2").removeClass("btn_add").addClass("btn_minus");
			a2=false;
		}else{
			$("#form2").hide();
			$("#m2").removeClass("btn_minus").addClass("btn_add");
			a2=true;
		}
	};
	$scope.addform3=function(){
		if(a3){
			$("#form3").show();
			$("#m3").removeClass("btn_add").addClass("btn_minus");
			a3=false;
		}else{
			$("#form3").hide();
			$("#m3").removeClass("btn_minus").addClass("btn_add");
			a3=true;
		}
	};
	$scope.addform4=function(){
		if(a4){
			$("#form4").show();
			$("#m4").removeClass("btn_add").addClass("btn_minus");
			a4=false;
		}else{
			$("#form4").hide();
			$("#m4").removeClass("btn_minus").addClass("btn_add");
			a4=true;
		}
	};
	$scope.addform5=function(){
		if(a5){
			$("#form5").show();
			$("#m5").removeClass("btn_add").addClass("btn_minus");
			a5=false;
		}else{
			$("#form5").hide();
			$("#m5").removeClass("btn_minus").addClass("btn_add");
			a5=true;
		}
	};
	$scope.addform6=function(){
		if(a6){
			$("#form6").show();
			$("#m6").removeClass("btn_add").addClass("btn_minus");
			a6=false;
		}else{
			$("#form6").hide();
			$("#m6").removeClass("btn_minus").addClass("btn_add");
			a6=true;
		}
	};
	$scope.addform7=function(){
		if(a7){
			$("#form7").show();
			$("#m7").removeClass("btn_add").addClass("btn_minus");
			a7=false;
		}else{
			$("#form7").hide();
			$("#m7").removeClass("btn_minus").addClass("btn_add");
			a7=true;
		}
	};
	$scope.addform8=function(){
		if(a8){
			$("#form8").show();
			$("#m8").removeClass("btn_add").addClass("btn_minus");
			a8=false;
		}else{
			$("#form8").hide();
			$("#m8").removeClass("btn_minus").addClass("btn_add");
			a8=true;
		}
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
		var xyf=false;//第一个
		var lyf=false;//第一个
		$scope.select1 = function(id1,id2) {
			if(id1=="new1"&&!xyf){//点击第一个状态为未选中
				$scope.form.CUSTOMER_TYPE="新用户";
				$("#"+id1).addClass("com_selectbtnon");
				$("#"+id2).removeClass("com_selectbtnon");
				$("#old_num1").hide();
				xyf=true;//状态为选中
				lyf=false;//第二个的状态为未选中
			}else if(id1=="new1"&&xyf){//点击第一个状态为选中
				$scope.form.CUSTOMER_TYPE="";
				$("#"+id1).removeClass("com_selectbtnon");
				$("#old_num1").hide();
				xyf=false;
			}else if(id1=="old1"&&!lyf){//点击第二个状态为未选中
				$scope.form.CUSTOMER_TYPE="老用户";
				$("#"+id1).addClass("com_selectbtnon");
				$("#"+id2).removeClass("com_selectbtnon");
				$("#old_num1").show();
				lyf=true;//状态为未选中
				xyf=false;//第一个状态为未选中
			}else if(id1=="old1"&&lyf){//点击第二个，状态为选中
				$scope.form.CUSTOMER_TYPE="";
				$("#"+id1).removeClass("com_selectbtnon");
				$("#old_num1").hide();
				lyf=false;//状态为未选中
			}
		};
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

		$("#from").val(date1).trigger('change'); //身份证有效期的开始时间（蓝牙那边读取出来的是2015.01.01，要把“.”换成“-”才能放进date类型的input）
		$("#to").val(date2).trigger('change'); //身份证有效期的结束时间
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