var brand_yiWang = function() {}; //加载移网产品，提供外部调用
var selectRongHeProduct = function() {}; //显示移网产品界面
var acti_yiWang = function() {}; //加载移网活动、套餐，提供外部调用
var saveYiWangInfo = function() {}; //获取选中的套餐，并保存起来

var dk_info = function() {}; //加载单卡信息，产品
var dk_brand = function() {}; //加载单卡网络
var dk_packageType = function() {}; //加载单卡套餐
var selectDanKaProduct = function() {}; //选中单卡产品的事件

var imgData = {
	"front": '',
	'contrary': '',
	'hand': ''
};

var myPhoto = {}; //存储照片

app.registerCtrl("RongHe2Ctrl", ["$scope", "$srhttp", "$rootScope", "$sce", "$timeout",
	function($scope, $srhttp, $rootScope, $sce, $timeout) {
		//底部导航样式变化
		replaceClass('home');
		$rootScope.appTitle = "办融合";

		myPhoto.request = $srhttp.request;
		myPhoto.post = $srhttp.post;

		//公共变量
		$scope.publicParams = {
			"yiWangIndex": 0, //移网的下标==第几个移网
		}

		$scope.rongHe1 = {};
		$scope.rongHe1 = Local.getStoreJson("rongHe1");

		$scope.rongHe2 = {
			"member_area": "", //网点地市编码
			"DESCRIPTION": "", //
			"kd_number": "", //需要校验的宽带号码，在已有宽带时，才会出现

			"wotype": "", //1是组合版，0是共享版
			"rh_name": "", //
			"rh_fee": "", //
			"rh_fee_id": "", //
			"zhekou": "", //
			"zhekou_id": "", //
			"kd_zxzf": "", //
			"kd_zxzf_id": "", //
			"prod_naru": "", //宽带套餐
			"prod_naru_code": "", //宽带套餐编码
			"prod_naru_package": "", //宽带套餐资费包
			"prod_naru_package_code": "", //宽带套餐资费包
			"prod_naru_package_type": "", //宽带资费包年/包月
			"kd_speed": "", //
			"kd_jrlx": "", //
			"gh_name": "", //
			"gh_name_id": "", //
			"gh_fee": "", //
			"gh_fee_id": "", //
			"gh_bname": "", //
			"gh_first": "", //是否有全月半月选择

			"gh_number": "", //固话号码
			"kd_address": "", //宽带地址
			"gh_address": "", //固话装机地址
		}


		$scope.rongHe2.wotype = $scope.rongHe1.wotype; //共享版，组合版

		$scope.arrays = {
			"kuandai_fee": [],
			"guhua_fee": [],

			"rh_zf_rows": [],
			"kuanDaiZiFei_rows": [], //宽带资费包
			"kuanDaiMode_rows": [], //到期执行指定资费
			"kuanDaiDaoQi_rows": [], //宽带到期执行资费
			"city_rows": [], //区域选择
			"rh_type_rows": [], //融合信息里智慧沃家类型
			"speed_rows": [], //速率
			"jrlx_rows": [], //接入类型
			"gh_name_rows": [], //固话产品

			"iptv_name_rows": [], //
			"iptv_zf_rows": [], //资费， 包年，还是包月
			"iptv_zdy_rows": [], //自定义IPTV的数量总和

			"iptv_show": [],
		}

		$scope.show = {
			"rh_info": true, //融合信息模块
			"rh_info_type": true, //融合类型
			"rh_info_fee": false, //融合资费
			"rh_info_first": false, //融合首月资费

			"kd_info": true, //宽带信息模块
			"kd_info_fee": false, //宽带资费
			"speed": true, //速率模块
			"jrlx": true, //接入方式模块
			"kuanDaiNumber": false, //宽带号码输入框
			"kd_info_zxfs": false, //宽带到期执行方式
			"kd_address": false,

			"gh_info": true, //固话信息模块
			"gh_info_num": true, //固话号码输入框
			"gh_info_first": false, //固话首月资费
			"gh_info_name": false, //固话产品
			"gh_address": false, //

			"iptv_info": true, //IPTV
			"ziDingYi_iptv": false, //自定义的IPTV
			"addIPTV_btn": false, //自定义IPTV添加按钮 
			"peiZhi_iptv": false, //配置产品的IPTV层

			"addYiWang_btn": false, //自定义移网添加按钮 
			"cuanhao": true, //移网串号
			"yw_acti": true, //移网活动类型
			"yw_actiname": true, //移网活动名称 

			"writeInfoDiv": true, //移网，固话，宽带，融合的父层
			"numberDiv": false, //号码层

			"productDiv": false, //合约产品界面
			"packageDiv": false, //移网套餐界面
			"danKaProductDiv": false, //单卡产品界面
			"danKaPackageDiv": false, //单卡套餐界面

		}

		//存储身份证信息，不可修改，一套模版来的begin
		$scope.form = {
			"CUSTOMER_NAME": "", //客户姓名
			"CERT_NUMBER": "", //证件号码
			"CERT_ADDRESS": "", //证件地址
			"GOV": "", //签发机关
			"GENDER": "男", //性别
			"NATION": "", //民族
			"BORN": "", //出生日期

			"ID_PIC_FRONT": "", //身份证正面照片
			"ID_PIC_BACK": "", //身份证反面照片
			"ID_PIC_PEO": "", //手持照片

			"FROM": "", //证件有效期开始
			"TO": "", //证件有效期结束

			"CardID": "", //身份证ID

			"PICTURE": "", //头像的Base64编码
			"NOTE": "", //备注
		}

		$scope.request = {

			//4.初始化自定义产品
			initZDYLoad: function() {
				console.log("自定义产品");

				if ($scope.rongHe1.kuanDaiType != "新装宽带") {
					//显示宽带号码输入框
					$scope.show.kuanDaiNumber = true;
					//隐藏宽带地址
					$scope.show.kd_address = false;
				} else {
					$scope.show.kd_address = true;
					//$scope.show.kd_info = false;//这里不能隐藏，APP版把速率和接入方式放在这里了
				}

				//隐藏融合模块
				$scope.show.rh_info_type = false; //这个类型，其实是不要隐藏的，等下会重新显示出来
				$scope.show.rh_info_fee = false;
				$scope.show.rh_info_first = false;

				$scope.show.gh_info_num = false;
				$scope.show.gh_info_first = false;

				$scope.request.getFeeItem(function() {
					//加载智慧沃家类型
					$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/admin/Q_RH_PRODUCT_TYPE", {}, function(data) {
						try {
							if (data.header.code == "0") {
								if (data.body.rows.length > 0) {
									$scope.arrays.rh_type_rows = data.body.rows;
									$scope.show.rh_info_type = true; //显示出来

									//IPTV
									$scope.show.ziDingYi_iptv = true;
									$scope.show.addIPTV_btn = true;
									//获取IPTV产品名称，根据产品名称，获取
									$scope.request.load_IPTVName();

								} else {
									alert("获取数据失败");
								}
							}
						} catch (e) {
							alert("加载智慧沃家类型出错" + e.message);
						}
					});
				});
			},

			//4.初始化配置产品
			initLoad: function() {
				console.log("配置产品");
				if ($scope.rongHe1.kuanDaiType != "新装宽带") {
					//显示宽带号码输入框
					$scope.show.kuanDaiNumber = true;
					$scope.show.kd_address = false;
				} else {
					console.log("新装宽带，则隐藏宽带号码框");
					$scope.show.kd_address = true;
					//$scope.show.kd_info = false;//这里不能隐藏，APP版把速率和接入方式放在这里了，这里这个值是“宽带包年，包月”
				}

				//获取宽带到期执行方式（包年才有）
				if ($scope.rongHe2.prod_naru_package_type == "1") {
					console.log("$scope.rongHe2.prod_naru_package_type==1，宽带为包年，则显示到期执行方式");
					$scope.show.kd_info = true;
					$scope.show.kd_speed = false;
					$scope.show.kd_jrlx = false;
					$scope.show.kd_info_fee = false;
					$scope.show.kd_info_zxfs = true;
					$scope.request.loadKuanDaiMode();
				} else {
					console.log("宽带到期执行方式是包月，没有宽带资费选项");
				}

				if ($scope.rongHe2.wotype == "0") {
					//隐藏融合的首月资费
					$scope.show.rh_info_first = true;
					console.log("共享版");
					console.log("共享版，$scope.rongHe2.wotype等于0，显示融合的首月资费");
				} else {
					console.log("组合版");
					//组合版没有融合首月资费的选择
					$scope.show.rh_info_first = false;
					//配置产品，组合版的话，隐藏融合模块
					$scope.show.rh_info = false;
					console.log("组合版，$scope.rongHe2.wotype等于1，隐藏融合的首月资费");
				}

				//是否有固话
				if ($scope.rongHe2.gh_name) {
					console.log("配置产品，有固话名，则显示固话模块");
					//显示固话模块
					$scope.show.gh_info = true;
					//隐藏固话号码输入框
					$scope.show.gh_info_num = false;
					if ($scope.rongHe2.wotype == "1") {
						//组合版没有固话首月资费的选择
						$scope.show.gh_info_first = false;
						console.log();
					} else {
						//共享版没有固话首月资费的选择
						$scope.show.gh_info_first = false;
					}
				} else {
					console.log("配置产品，没有固话名，则隐藏固话模块");
					$scope.show.gh_info = false;
				}

				//配置产品，而且共享版时，仅显示首月资费，否则全部隐藏
				$scope.show.rh_info_type = false;
				$scope.show.rh_info_fee = false;
				console.log("配置产品，而且共享版时，仅显示首月资费，否则将“融合模块”全部隐藏");
				//配置产品，没有宽带速率和接入类型
				$scope.show.kd_speed = false;
				$scope.show.kd_jrlx = false;
				console.log("配置产品，没有宽带速率和接入类型");

				$scope.request.getFeeItem(function() {
					//配置产品的IPTV,如果不放在这里，可能产生异步问题导致json出错
					$scope.show.peiZhi_iptv = true;
					$scope.request.getIPTV();
				});


			},

			//获取增加、减免资费项
			getFeeItem: function(fn) {
				$scope.arrays.kuandai_fee = [];
				$scope.arrays.guhua_fee = [];

				$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_RH_ZIFEI", {
					"id": $scope.rongHe1.id
				}, function(data) {
					if (data.header != undefined && data.header.code == 0) {
						$scope.arrays.fee_items = data.body.rows; //这句话其实没用过
						if (data.body.rows.length > 0) {
							for (var i = 0; i < data.body.rows.length; i++) {
								var row = data.body.rows[i];
								if (row.TYPE == 1) {
									//增加资费项
									if (row.CY == "IPTV" || row.CY == "KD") {
										if (row.CY == "KD" && $scope.rongHe1.kuanDaiType != "新装宽带" && row.NAME.indexOf("普通预存款") == -1) {
											//纳入只收取预存款，其它过滤掉
											continue;
										}
										if (row.CY == "KD" && row.NAME.indexOf("ADSL") != -1 &&
											$scope.rongHe2.kd_jrlx != "ADSL") {
											//接入类型不为ADSL时过滤掉ADSL猫押金
											continue;
										}
										if (row.CY == "KD" && row.NAME.indexOf("终端预付款") != -1 &&
											$scope.rongHe2.kd_jrlx == "ADSL") {
											//接入类型为ADSL时过滤掉光纤猫押金
											continue;
										}
										$scope.arrays.kuandai_fee.push({
											feeMode: row.FEE_MODE,
											feeItem: row.CBSS_ID,
											fee: row.FEE + ""
										});
									} else if (row.CY == "GH") {
										$scope.arrays.guhua_fee.push({
											feeMode: row.FEE_MODE,
											feeItem: row.CBSS_ID,
											fee: row.FEE + ""
										});
									} else if (row.CY == "YW" && row.NAME.indexOf("预存款") != -1) {
										$scope.arrays["yiwang_fee" + row.YW_NUM] = row.FEE + "";
									}
								} else if (row.TYPE == 2) {
									//减免资费项
									if (row.CY == "KD" && row.NAME.indexOf("调试费") != -1)
										$scope.rongHe2.kd_tiaoce = row.FEE + "";
									else if (row.CY == "KD" && row.NAME.indexOf("工料费") != -1)
										$scope.rongHe2.kd_gongliao = row.FEE + "";
									else if (row.CY == "KD" && row.NAME.indexOf("手续费") != -1)
										$scope.rongHe2.kd_shouxu = row.FEE + "";
									else if (row.CY == "GH" && row.NAME.indexOf("调试费") != -1)
										$scope.rongHe2.gh_tiaoce = row.FEE + "";
									else if (row.CY == "GH" && row.NAME.indexOf("工料费") != -1)
										$scope.rongHe2.gh_gongliao = row.FEE + "";
									else if (row.CY == "GH" && row.NAME.indexOf("手续费") != -1)
										$scope.rongHe2.gh_shouxu = row.FEE + "";
									else if (row.CY == "YW" && row.NAME.indexOf("卡费") != -1)
										$scope.rongHe2["card_fee" + row.YW_NUM] = row.FEE + "";
								}
							}
						}
						if (fn) {
							fn();
						}
					} else {
						alert("获取数据失败");
					}
				});
			},

			//1.加载产品说明
			loadDetail: function() {
				$.ajax({
					url: APP_CONFIG.SERVER_URL + "!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_RH_DETAIL",
					type: "POST",
					async: true,
					data: {
						"id": $scope.rongHe1.id
					},
					dataType: "json",
					success: function(data) {
						try {
							if (data.header.code == 0 && data.body.rows.length > 0) {
								var datas = data.body.rows[0];

								//TODO
								/*openAmalgData.wo4G_params = [];
		            			openAmalgData.kd_check_data = [];*/

								if ($scope.rongHe1.rh_type == "1") {
									//自定义产品

								} else {
									//配置产品
									$scope.rongHe2.wotype = $scope.rongHe1.wotype;
									$scope.rongHe2.rh_name = $scope.rongHe1.rh_name;
									$scope.rongHe2.rh_fee = unescape(datas.RH_FEE);
									$scope.rongHe2.rh_fee_id = unescape(datas.RH_ID);
									$scope.rongHe2.zhekou = unescape(datas.ZHEKOU);
									$scope.rongHe2.zhekou_id = unescape(datas.ZHEKOU_ID);
									$scope.rongHe2.kd_zxzf = unescape(datas.KD_ZXZF);
									$scope.rongHe2.kd_zxzf_id = unescape(datas.KD_ZXZF_ID);
									$scope.rongHe2.prod_naru = unescape(datas.KD_NAME); //宽带套餐
									$scope.rongHe2.prod_naru_code = unescape(datas.KD_NAME_ID); //宽带套餐编码
									$scope.rongHe2.prod_naru_package = unescape(datas.KD_FEE); //宽带套餐资费包
									$scope.rongHe2.prod_naru_package_code = unescape(datas.KD_FEE_ID); //宽带套餐资费包
									$scope.rongHe2.prod_naru_package_type = unescape(datas.FEE_TYPE); //宽带资费包年/包月
									$scope.rongHe2.kd_speed = unescape(datas.KD_SPEED);
									$scope.rongHe2.kd_jrlx = unescape(datas.KD_JRLX);
									$scope.rongHe2.gh_name = unescape(datas.GH_NAME);
									$scope.rongHe2.gh_name_id = unescape(datas.GH_NAME_ID);
									$scope.rongHe2.gh_fee = unescape(datas.GH_FEE);
									$scope.rongHe2.gh_fee_id = unescape(datas.GH_FEE_ID);
									$scope.rongHe2.gh_bname = unescape(datas.GH_BNAME);
									$scope.rongHe2.gh_first = unescape(datas.GH_TYPE); //是否有全月半月选择
									//console.log($scope.rongHe2);
								}
								$scope.rongHe2.DESCRIPTION = unescape(datas.DESCRIPTION);
								if ($scope.rongHe2.DESCRIPTION == "undefined" || $scope.rongHe2.DESCRIPTION == "") {
									$scope.rongHe2.DESCRIPTION = "没有什么描述";
								}
								$scope.rongHe2.DESCRIPTION = $sce.trustAsHtml($scope.rongHe2.DESCRIPTION);
								$scope.$apply();

								//获取网点地市编码member_area，JSP是直接拿到的，这里需要访问接口
								$scope.request.loadArea();
							}
						} catch (e) {
							alert("加载产品说明出错" + e.message);
						}
					}
				});
			},

			//2.加载网点地市编码member_area
			loadArea: function() {
				$srhttp.get("!ESale/Mall/Member/~java/Member.getMemberArea", {}, function(data) {
					if (data.header.code == 0) {
						//获取网点区域
						$scope.rongHe2.member_area = data.body;
						console.log("网点地市编码member_area=    " + $scope.rongHe2.member_area);
						//加载区域选择
						$scope.request.loadCity();
					}
				});
			},

			//3.加载-区域选择列表
			loadCity: function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_SALE_RES", {}, function(data) {
					try {
						if (data.header.code == 0) {
							if (data.body.rows.length > 0) {
								$scope.arrays.city_rows = data.body.rows;
							} else {
								alert("无区域可选"); //更换产品资费就可能有
							}

							//加载配置产品，或者自定义产品
							if ($scope.rongHe1.rh_type == "1") {
								//自定义产品
								$scope.request.initZDYLoad();
							} else {
								$scope.request.initLoad();
							}
						} else {
							alert("获取区域失败，请联系代理商！");
						}
					} catch (e) {
						alert("加载区域选择列表出错" + e.message);
					}
				});
			},

			//配置产品的IPTV产品
			getIPTV: function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_IPTV_INFO", {
					"id": $scope.rongHe1.id
				}, function(data) {
					try {
						if (data.header.code == 0 && data.body.rows.length > 0) {

							$scope.arrays.iptv_name_rows = data.body.rows;
							//初始化IPTV列表
							$scope.request.initIPTVInfo();
						} else {
							$scope.show.iptv_info = true;
							console.log("配置产品，没有配置IPTV");

							//如果是配置产品，初始化移网信息
							if ($scope.rongHe1.rh_type != 1) {
								$scope.request.initYwInfo();
							} else {
								console.log("自定义");
							}
						}
					} catch (e) {
						alert("加载配置产品的IPTV产品出错" + e.message);
					}
				});
			},

			//加载融合资费
			loadRongHeZiFei: function(id) {
				$.ajax({
					url: APP_CONFIG.SERVER_URL + "!ESale/Business/VirtualService/Phone/Amalgamation/~query/admin/Q_RH_ZF",
					type: "post",
					data: {
						"type": id
					},
					dataType: "json",
					async: false,
					success: function(data) {
						try {
							if (data.header.code == 0) {
								//解码
								for (var i = 0; i < data.body.rows.length; i++) {
									data.body.rows[i].NAME = unescape(data.body.rows[i].NAME)
								}
								$scope.arrays.rh_zf_rows = data.body.rows;
							} else {
								$scope.arrays.rh_zf_rows = [];
								alert("无数据");
							}
						} catch (e) {
							alert("加载融合资费出错" + e.message);
						}
					}
				});
			},

			//获取组合版折扣
			loadZheKou: function(id) {
				$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_RH_ZHEKOU", {
					"id": id
				}, function(data) {
					try {
						if (data.header.code == 0 && data.body.rows.length > 0) {
							$scope.rongHe2.zhekou = data.body.rows[0].CBSS_NAME;
							$scope.rongHe2.zhekou_id = data.body.rows[0].CBSS_ID;
						} else {
							alert("未能获取到组合版折扣，请联系代理商！");
						}
					} catch (e) {
						alert("获取组合版折扣出错" + e.message);
					}
				});
			},

			//加载宽带速率，接入类型
			loadFilter: function(fn) {
				$srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_FILTER", {
					"type": "CBSS"
				}, function(data) {
					if (data.header.code == 0) {
						$scope.arrays.speed_rows = [];
						$scope.arrays.jrlx_rows = [];
						var rows = data.body.rows;
						for (var i = 0; i < rows.length; i++) {
							if (rows[i].TYPE == "speed") {
								$scope.arrays.speed_rows.push(rows[i]);
							} else {
								$scope.arrays.jrlx_rows.push(rows[i]);
							}
						}

						if (fn) {
							//这里fn是加载固话信息
							fn();
						}
					}
				});
			},

			//获取宽带套餐,row只会返回一个值
			loadKuanDaiPackage: function() {
				//如果是刚才选了宽带速率，再重新回来选融合，则马上加载宽带资费包
				if (!$scope.rongHe2.kd_speed_id && !$scope.rongHe2.prod_naru_id) {
					return;
				}
				$srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/admin/Q_KD_NAME", {
					"speedId": $scope.rongHe2.kd_speed_id,
					"xt_type": "CBSS"
				}, function(data) {
					try {
						if (data.header.code == 0) {
							//这里是唯一的宽带套餐ID
							$scope.rongHe2.prod_naru = data.body.rows[0].CBSS_NAME;
							$scope.rongHe2.prod_naru_id = data.body.rows[0].ID;
							$scope.rongHe2.prod_naru_code = data.body.rows[0].CBSS_ID; //宽带套餐编码
							//根据宽带套餐ID，加载宽带资费
							$scope.request.loadKuanDaiZiFei();
						} else {
							alert("未能获取到宽带套餐，请联系代理商！");
						}
					} catch (e) {
						alert("获取宽带套餐出错" + e.message);
					}
				});
			},

			//加载宽带资费包
			loadKuanDaiZiFei: function() {
				if (!$scope.rongHe2.rh_name_id) {
					alert("请先选择融合类型");
					return;
				}
				$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/admin/Q_KD_ZF", {
					"kdNameId": $scope.rongHe2.prod_naru_id,
					"areaId": $scope.rongHe2.member_area,
					"rhType": $scope.rongHe2.rh_name_id
				}, function(data) {
					try {
						if (data.header.code == 0) {
							if (data.body.rows.length > 1) {
								$scope.arrays.kuanDaiZiFei_rows = data.body.rows;
								//显示宽带资费
								$scope.show.kd_info = true;
								$scope.show.kd_info_fee = true;
								console.log("$scope.arrays.kuanDaiZiFei_rows.length为" + data.body.rows.length);
							} else if (data.body.rows.length == 1) {

								$scope.show.kd_info = true;
								$scope.arrays.kuanDaiZiFei_rows = data.body.rows;

								$timeout(function() {
									$scope.$apply();
									console.log("宽带资费数据唯一，默认隐藏，模拟点击事件开始");
									$scope.show.kd_info_fee = false;
									$("#kd_info_fee_0").trigger('click');
								}, 100);
							} else {
								alert("无宽带资费数据");
							}
						} else {
							alert("获取宽带资费包失败，请联系代理商！");
						}
					} catch (e) {
						alert("加载宽带资费包出错" + e.message);
					}
				});
			},

			//加载宽带到期执行方式
			loadKuanDaiMode: function() {
				$.ajax({
					url: APP_CONFIG.SERVER_URL + "!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_MODE_NAME",
					type: "post",
					data: {
						type: "KD"
					},
					dataType: "json",
					async: false,
					success: function(data) {
						try {
							if (data.header.code == 0) {
								//解码
								for (var i = 0; i < data.body.rows.length; i++) {
									data.body.rows[i].CBSS_NAME = unescape(data.body.rows[i].CBSS_NAME);
									data.body.rows[i].NAME = unescape(data.body.rows[i].NAME);
								}
								$scope.arrays.kuanDaiMode_rows = data.body.rows;
							} else {
								alert("获取宽带到期执行方式失败，请联系代理商！");
							}
						} catch (e) {
							alert("加载宽带到期执行方式出错" + e.message);
						}
					}
				})
			},

			//加载到期执行资费
			loadKuanDaiDaoQi: function() {
				$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/admin/Q_DAOQI_ZF", {
					"kdZfId": $scope.rongHe2.prod_naru_package_id
				}, function(data) {
					try {
						if (data.header.code == 0) {
							//这里row有值时，只会有一个值
							if (data.body.rows.length > 0) {
								$scope.rongHe2.kd_zxzf = data.body.rows[0].CBSS_NAME;
								$scope.rongHe2.kd_zxzf_id = data.body.rows[0].CBSS_ID;
								console.log("宽带到期执行资费：" + $scope.rongHe2.kd_zxzf);
							}
						} else {
							alert("获取数据失败，请联系代理商！");
						}
					} catch (e) {
						alert("加载到期执行资费出错" + e.message);
					}
				});
			},

			//加载融合首月资费之后的事件处理
			loadRH_FEE: function(type) {
				$srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_RH_FEE", {
					"fee_id": $scope.rongHe2.rh_fee_id,
					"type": type
				}, function(data) {
					try {
						if (data.header.code == 0) {
							$scope.rongHe2.wo_bag = data.body.rows[0].CBSS_NAME;
							$scope.rongHe2.wo_bag_id = data.body.rows[0].CBSS_ID;
						} else {
							alert("获取数据失败，请联系代理商！");
						}
					} catch (e) {
						alert("加载融合首月资费出错" + e.message);
					}
				});
			},

			//获取固话产品信息
			loadGuHuanName: function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/admin/Q_GH_NAME", {
					"rhType": $scope.rongHe2.rh_name_id, //融合产品ID
					"areaId": $scope.rongHe2.member_area
				}, function(data) {
					try {
						if (data.header.code == 0) {
							if (data.body.rows.length > 1) {
								$scope.arrays.gh_name_rows = data.body.rows;
								$scope.show.gh_info_name = true;

							} else if (data.body.rows.length == 1) {
								$scope.arrays.gh_name_rows = data.body.rows;
								$scope.show.gh_info_name = false;
								$timeout(function() {
									$scope.$apply();
									console.log("点击事件开始");
									$("#gh_info_name_0").trigger('click');
								}, 100);
							} else {
								alert("获取不到固话产品");
							}
						} else {
							alert("获取数据失败，请联系代理商！");
						}
					} catch (e) {
						alert("获取固话产品信息出错" + e.message);
					}
				});
			},

			//初始化IPTV列表，配置产品，自定义产品都有调用到，高清或者标清
			initIPTVInfo: function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_IPTV_TYPE", {}, function(data) {
					try {
						if (data.header.code == 0) {
							if (data.body.rows.length > 0) {
								$scope.arrays.iptv_type_rows = data.body.rows;
							} else {
								alert("无IPTV类型");
							}

							//如果是配置产品，初始化移网信息
							if ($scope.rongHe1.rh_type != 1) {
								$scope.request.initYwInfo();
							} else {
								console.log("自定义");
							}

						} else {
							alert("获取IPTV类型数据失败");
						}
					} catch (e) {
						alert("初始化IPTV列表出错" + e.message);
					}
				});
			},

			//加载IPTV产品名称，自定义产品
			load_IPTVName: function() {
				$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/admin/Q_IPTV_NAME", {}, function(data) {
					try {
						if (data.header.code == 0 && data.body.rows.length > 0) {
							$scope.arrays.iptv_datas_rows = data.body.rows;
							//加载机顶盒
							$scope.request.load_JDH();
						} else {
							alert("获取不到IPTV产品名称");
						}
					} catch (e) {
						alert("加载IPTV产品名称出错" + e.message);
					}
				});
			},

			//加载机顶盒，自定义产品
			load_JDH: function() {
				$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/admin/Q_JDH", {
					"areaId": $scope.rongHe2.member_area
				}, function(data) {
					try {
						if (data.header.code == 0 && data.body.rows.length > 0) {
							$scope.arrays.iptv_jdhs_rows = data.body.rows;

							//获取IPTV高清还是标清
							$scope.request.initIPTVInfo();
						} else {
							alert("获取不到机顶盒");
						}
					} catch (e) {
						alert("加载机顶盒出错" + e.message);
					}
				});
			},

			//添加IPTV
			addIptv: function(number) {
				$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/admin/Q_IPTV_ZF", {
					"keyword": number
				}, function(data) {
					try {
						if (data.header.code == 0 && data.body.rows.length > 0) {
							$scope.arrays.iptv_zf_rows = data.body.rows;
						} else {
							alert("未能获取到IPTV类型，请联系代理商！");
						}
					} catch (e) {
						alert("出错" + e.message);
					}
				});
			},

			//获取IPTV资费,自定义产品
			loadIPTV_FEE_ZDY: function(obj) {
				$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_IPTV_FEE", {
					"iptv_id": $(obj.target).attr("data-iptvid"),
					"alias_id": $(obj.target).attr("data-aliasid"),
					"iptv_type": $(obj.target).attr("data-id")
				}, function(data) {
					try {
						if (data.header.code == 0 && data.body.rows.length > 0) {
							$(obj.target).attr("data-iptvfee", data.body.rows[0].CBSS_NAME);
							$(obj.target).attr("data-iptvfeeid", data.body.rows[0].ID);
							$(obj.target).attr("data-iptvfeecode", data.body.rows[0].CBSS_ID);

							//如果机顶盒是唯一的，则默认选中，并隐藏
							if ($scope.arrays.iptv_jdhs_rows.length <= 1) {
								$timeout(function() {
									$scope.$apply();
									console.log("正在模拟点击机顶盒");

									//隐藏机顶盒，只隐藏自己的机顶盒
									$(obj.target).parents(".iptv_zdy_div").find(".iptv_jdh_div").hide();
									$(obj.target).parents(".layout_secondbox").find(".iptv_jdh_0").trigger("click");
								}, 100);
							}
						} else {
							alert("未能获取到IPTV资费，请联系代理商！");
						}
					} catch (e) {
						alert("获取IPTV资费出错" + e.message);
					}
				});
			},

			//配置产品，获取IPTV资费，执行资费，机顶盒资费
			loadIPTV_FEE_PZ: function(obj) {
				$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_IPTV_FEE", {
					"iptvid": $(obj.target).attr("data-iptvid"),
					"alias_id": $(obj.target).attr("data-aliasid"),
					"jdh_id": $(obj.target).attr("data-jdhid"),
					"iptv_type": $(obj.target).attr("data-id")
				}, function(data) {
					try {
						if (data.header.code == 0 && data.body.rows.length > 0) {
							$(obj.target).attr("data-iptvfee", data.body.rows[0].IPTV_FEE);
							$(obj.target).attr("data-iptvfeecode", data.body.rows[0].IPTV_FEE_ID);
							$(obj.target).attr("data-jdhfee", data.body.rows[0].JDH_FEE);
							$(obj.target).attr("data-jdhfeeid", data.body.rows[0].JDH_FEE_ID);
							$(obj.target).attr("data-zxzf", data.body.rows[0].ZXZF);
							$(obj.target).attr("data-zxzfid", data.body.rows[0].ZXZF_ID);
							console.log("获取到IPTV资费、机顶盒资费成功........");
						} else {
							alert("未能获取到IPTV资费、机顶盒资费，请联系代理商！");
						}
					} catch (e) {
						alert("获取IPTV资费，执行资费出错" + e.message);
					}
				});
			},

			//获取机顶盒的资费，存到高清，标清的a里面
			loadJDH_FEE: function(obj, typeBtn) {
				$srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_JDH_FEE", {
					"iptv_fee": typeBtn.attr("data-iptvfeeid"),
					"jdh_id": $(obj.target).attr("data-id")
				}, function(data) {
					try {
						if (data.header.code == 0 && data.body.rows.length > 0) {
							typeBtn.attr("data-zxzf", data.body.rows[0].ZXZF);
							typeBtn.attr("data-zxzfid", data.body.rows[0].ZXZF_ID);
							typeBtn.attr("data-jdhfee", data.body.rows[0].JDH_FEE);
							typeBtn.attr("data-jdhfeeid", data.body.rows[0].JDH_FEE_ID);
						} else {
							alert("未能获取到机顶盒资费，请联系代理商！");
						}
					} catch (e) {
						alert("出错" + e.message);
					}
				});
			},

			//初始化移网信息  配置产品
			initYwInfo: function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_YW_INFO", {
					"wotype": $scope.rongHe2.wotype,
					"id": $scope.rongHe1.id
				}, function(data) {
					if (data.header.code == 0 && data.body.rows.length > 0) {
						console.log("配置产品--获取移网信息成功......");
						var rows = data.body.rows;
						var count = 1;
						if ($scope.rongHe2.wotype == "0") {
							count = rows[0].COUNT; //共享版
							console.log("wotype=0,共享版");
						} else {
							count = rows.length; //组合版
							console.log("wotype=1,组合版");
						}

						//存储移网信息的数组，数组里有对象，对象里存储移网的套餐，号码，首月资费，预存款等
						$scope.arrays.yiWang_rows = [];
						for (var i = 0; i < count; i++) {

							$scope.arrays.yiWang_rows[i] = {
								"yw_num": "",
								"yw_first": "",
								"yw_fee": "",
								"data-type": "",
								"data-actitype": "",
								"fee_config": "",
								"fee_init": "",
								"data-packname": "",
								"yw_acti": "",
								"yw_actiname": "",
								"yw_pack": ""
							};

							if ($scope.rongHe2.wotype == "0") {
								//共享版
								$scope.arrays.yiWang_rows[i].yw_num = "未选择";
							} else {
								//组合版
								$scope.arrays.yiWang_rows[i].yw_num = "未选择";
								$scope.arrays.yiWang_rows[i].yw_first = "未选择";
								$scope.arrays.yiWang_rows[i].yw_fee = "未设置";

								if (rows[i].TYPE == "1") {
									//$("#yiWangInfo_" + i + " .yw_ch").hide();
								}
								//下面四个元素，到时候要放进"新装","纳入"按钮里，data-type，data-actitype，data-actiname，data-packname
								$scope.arrays.yiWang_rows[i]["data-type"] = rows[i].TYPE;
								$scope.arrays.yiWang_rows[i]["data-actitype"] = rows[i].ACTI_TYPE;

								if (rows[i].ACTI_NAME == "存120送240") {
									rows[i].ACTI_NAME = "存120元送240元";
								} else if (rows[i].ACTI_NAME == "存240送480") {
									rows[i].ACTI_NAME = "存240元送480元";
								}
								$scope.arrays.yiWang_rows[i]["data-actiname"] = rows[i].ACTI_NAME;

								//预存款，后台配置的预存款初始值fee_init，不可低于的预存款值fee_config
								$scope.arrays.yiWang_rows[i]["fee_config"] = rows[i].YCK;
								$scope.arrays.yiWang_rows[i]["fee_init"] = rows[i].YCK_INIT;
								if (!$scope.arrays.yiWang_rows[i]["fee_config"]) {
									$scope.arrays.yiWang_rows[i]["fee_config"] = 0;
								}
								if (!$scope.arrays.yiWang_rows[i]["fee_init"]) {
									$scope.arrays.yiWang_rows[i]["fee_init"] = 0;
								}

								var productName = "";
								if (rows[i].PACKAGE_TYPE.indexOf("3G/4G一体化套餐") != -1) {
									if (rows[i].PACKAGE_NAME.indexOf("元套餐") != -1) {
										productName = '4G全国套餐-' + rows[i].PACKAGE_NAME;
									} else {
										productName = '4G全国套餐-' + rows[i].PACKAGE_NAME.replace("套餐", "元套餐");
									}
								} else if (rows[i].PACKAGE_TYPE.indexOf("辽宁4G本地套餐") != -1) {
									if (rows[i].PACKAGE_NAME.indexOf("元套餐") != -1) {
										productName = '4G本地套餐-' + rows[i].PACKAGE_NAME;
									} else {
										productName = '4G本地套餐-' + rows[i].PACKAGE_NAME.replace("套餐", "元套餐");
									}
								} else {
									if (rows[i].PACKAGE_NAME.indexOf("元套餐") != -1) {
										productName = rows[i].PACKAGE_TYPE + "-" + rows[i].PACKAGE_NAME;
									} else {
										productName = rows[i].PACKAGE_TYPE + "-" + rows[i].PACKAGE_NAME.replace("套餐", "元套餐");
									}
								}
								$scope.arrays.yiWang_rows[i]["data-packname"] = productName;

								if (!rows[i].ACTI_TYPE) {
									$scope.show.yw_acti = false;
								}
								if (!rows[i].ACTI_NAME) {
									$scope.show.yw_actiname = false;
								}
								$scope.arrays.yiWang_rows[i]["yw_acti"] = rows[i].ACTI_TYPE;
								$scope.arrays.yiWang_rows[i]["yw_actiname"] = rows[i].ACTI_NAME;
								$scope.arrays.yiWang_rows[i]["yw_pack"] = productName;

							}
						}

						//共享版，最开始只显示“号码”
						if ($scope.rongHe2.wotype == "0") {
							$timeout(function() {
								$scope.$apply(function() {
									for (var i = 0; i < count; i++) {
										console.log("除了号码，其他全部隐藏...");
										var obj = "#yiWangInfo_" + i + " p:eq(0)";
										$(obj).nextAll().hide();

										/*//如果是合约惠机，需要填写串号
										if ($scope.arrays.yiWang_rows[i]["yw_acti"].indexOf("合约惠机") != -1) {
											$("#yiWangInfo_" + i + " #yiWangInfo").find(".yw_ch").show();
										} else {
											$("#yiWangInfo_" + i + " #yiWangInfo").find(".yw_ch").hide();
										}*/
									}
								});
							}, 100);
						} else {
							//组合版,隐藏串号输入框，类型，号码输入框
							$timeout(function() {
								$scope.$apply(function() {
									for (var i = 0; i < count; i++) {
										$("#yiWangInfo_" + i + " .yw_ch").hide();
										$("#yiWangInfo_" + i + " .yw_type").hide();
										$("#yiWangInfo_" + i + " .yw_number").hide();
									}
								});
							}, 100);
						}
					}
				});
			},

			//不管定单处理成功失败，往后台写入信息
			sendMessage: function(memberId, msg) {
				$srhttp.get("!ESale/System/Base/~java/MessageTrans.sendMessage", {
					distination: memberId,
					param: msg
				}, function(data) {
					if (data.header.code == 0) {
						//alert("往 后台插入信息成功");
					} else {
						//alert("处理异常，请稍后重试");
					}
				})
			},

			//提交订单
			creatOrder: function() {
				try {
					$scope.form.ID_PIC_FRONT = imgData.front; //正面照
					$scope.form.ID_PIC_BACK = imgData.contrary; //反面照
					$scope.form.ID_PIC_PEO = imgData.hand; //手持照

					if ($scope.rongHe1.kuanDaiType == "新装宽带" && !$scope.rongHe2.city_code1) {
						alert('请选择宽带所属地区');
						return;
					}
					if ($scope.rongHe1.kuanDaiType == "新装宽带" && !$scope.rongHe2.kd_address) {
						alert('请填写宽带标准地址');
						return;
					}
					if (!$scope.rongHe2.rh_name) {
						alert('请选择融合业务类型');
						return;
					}
					if (!$scope.rongHe2.rh_fee) {
						alert('请选择融合业务资费');
						return;
					}
					if ($scope.rongHe2.wotype == "0" && !$scope.rongHe2.wo_bag) {
						alert('请选择融合首月资费');
						return;
					}
					if (!$scope.rongHe2.prod_naru_package) {
						alert('请选择宽带资费');
						return;
					}
					if ($scope.rongHe2.prod_naru_package_type == "1" && !$scope.rongHe2.expire_deal_mode) {
						alert('请选择宽带到期执行方式');
						return;
					}
					if ($scope.rongHe1.kuanDaiType != "新装宽带" && !$scope.rongHe2.kd_number) {
						alert('请输入宽带纳入号码');
						return;
					}
					if ($scope.rongHe1.rh_type == "0" && $scope.rongHe2.gh_name_id && !$scope.rongHe2.phoneType) {
						alert('请选择固话安装类型');
						return;
					}
					if ($scope.rongHe2.phoneType && $scope.rongHe2.phoneType == "新装" && $scope.rongHe1.kuanDaiType != "新装宽带") {
						if (!$scope.rongHe2.city_code2) {
							alert('请选择固话所属地区');
							return;
						}
						if (!$scope.rongHe2.gh_address) {
							alert('请填写固话标准地址');
							return;
						}
					}
					if ($scope.rongHe2.phoneType && !$scope.rongHe2.gh_number) {
						alert('请输入固话号码');
						return;
					}
					if ($scope.rongHe2.phoneType && !$scope.rongHe2.gh_name) {
						alert('请选择固话产品名称');
						return;
					}
					if ($scope.rongHe2.phoneType && $scope.rongHe2.wotype == "1" && $scope.rongHe2.gh_first == "1" && !$scope.rongHe2.zuhezifeibao) {
						alert('请选择固话首月资费');
						return;
					}

					if (!$scope.form.ID_PIC_FRONT) {
						alert('请先读取身份证信息');
						return;
					}
					if (!$scope.form.CONTACT_PHONE) {
						alert('请输入联系号码');
						return;
					}
					if ($scope.form.NOTE.length > 100) {
						alert("备注请不要超过100个字符，已超出" + ($scope.form.NOTE.length - 100) + "个字符");
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
						"picture": $scope.form.PICTURE
					}
					$scope.form.CardID = InsertIDCard($scope.cardForm);
					if (!$scope.form.CardID) {
						alert("存储身份证信息失败，提交失败");
						return;
					}

					var paramData = $scope.event.getAmalgOrderData();
					if (paramData == "") {
						return;
					}

					$srhttp.post("!ESale/Mall/Order/~java/Order.create", {
						"list": rdcp.json2str(paramData.list),
						"ext": rdcp.json2str(paramData.ext),
						"businessId": "ChinaUnicom.Amalgamation",
						"payStatus": "-1"
					}, function(data) {
						if (data.header.code == 0) {
							var creatorName = data.body["creator_member_name"];
							var devId = data.body["member_id"];
							$scope.request.sendMessage(devId, creatorName + "的订单已经生成,请注意接收查看");
							alert("订单创建成功");
							hrefJump('orders');
						} else {
							alert("订单创建失败" + data.header.message);
						}
					});
				} catch (e) {
					alert("1.出错：" + e.message);
					return;
				}

			}
		}

		$scope.event = {

			//选中样式修改
			selectReplaceClass: function(obj) {
				$(obj.target).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
			},

			//选择融合类型
			selectRongHeType: function(obj, id, name) {
				$scope.event.selectReplaceClass(obj);
				$scope.rongHe2.wotype = id == "ChinaUnicom.Amalgamation.ZHWJZHB" ? "1" : "0";
				$scope.rongHe2.rh_name_id = id;
				$scope.rongHe2.rh_name = name;
				$scope.rongHe2.rh_fee_id = "";
				$scope.rongHe2.rh_fee = "";
				$scope.rongHe2.zhekou = "";
				$scope.rongHe2.zhekou_id = "";

				//每次重新点击融合类型，都需要先清空移网数组
				$scope.arrays.yiWang_rows = [];
				//如果是共享版，默认添加一个移网号码
				if ($scope.rongHe2.wotype == "0") {
					//默认添加一个移网号码
					$scope.event.addYwInfo();
					$scope.show.addYiWang_btn = true; //显示添加按钮 
					console.log("$scope.rongHe2.wotype=" + $scope.rongHe2.wotype + ",共享版");
				} else {
					$scope.show.addYiWang_btn = false; //显示添加按钮 
					console.log("$scope.rongHe2.wotype=" + $scope.rongHe2.wotype + ",组合版");
				}


				//加载融合资费
				$scope.show.rh_info_fee = true;
				$scope.show.rh_info_first = false;
				$scope.request.loadRongHeZiFei(id);
				console.log("融合资费后面的事件处理");

				//重置宽带信息状态
				$scope.rongHe2.expire_deal_mode = ""; //到期执行方式编码
				$scope.rongHe2.expire_deal_name = ""; //到期执行方式编码
				$scope.rongHe2.discnt_code = ""; //到期执行资费编码
				$scope.rongHe2.discnt_name = ""; //到期执行资费
				$scope.rongHe2.prod_naru_package = "";
				$scope.rongHe2.prod_naru_package_code = "";
				$scope.rongHe2.prod_naru_package_id = "";
				$scope.rongHe2.kd_zxzf = "";
				$scope.rongHe2.kd_zxzf_id = "";
				$scope.rongHe2.kd_number = "";
				/*
				openAmalgData.kd_check = false;
				openAmalgData.kd_check_data = [];*/
				$scope.show.kd_info_zxfs = false;
				$scope.show.kd_info_fee = false;
				$scope.show.kd_info_detail = false;

				//重置固话信息状态
				$scope.rongHe2.phoneType = "";
				$scope.rongHe2.zuhezifeibao = "";
				$scope.rongHe2.gh_first = "";
				$scope.rongHe2.gh_name = "";
				$scope.rongHe2.gh_fee = "";

				$scope.rongHe2.gh_info_num = "";
				$scope.show.gh_info_num = false;
				$scope.show.gh_info_name = false;
				$scope.show.gh_info_first = false;


				//获取宽带套餐,“宽带套餐”会进一步获取“宽带资费”
				$scope.request.loadKuanDaiPackage(); //因为还没选速率，所以不会访问，除非是选完速率，再回来重新选类型
				$scope.show.kd_speed = true;
				$scope.show.kd_jrlx = true;

				//加载宽带速率，接入方式，回调里执行加载固话信息
				$scope.request.loadFilter($scope.request.loadGuHuanName);

			},

			//选择融合资费
			selectRongHeZiFei: function(obj, id, name) {
				$scope.event.selectReplaceClass(obj);
				$scope.rongHe2.rh_fee_id = id;
				$scope.rongHe2.rh_fee = name;
				$scope.rongHe2.wo_bag = "";
				$scope.rongHe2.wo_bag_id = "";

				//重置宽带信息状态
				$scope.rongHe2.expire_deal_mode = ""; //到期执行方式编码
				$scope.rongHe2.expire_deal_name = ""; //到期执行方式编码
				$scope.rongHe2.discnt_code = ""; //到期执行资费编码
				$scope.rongHe2.discnt_name = ""; //到期执行资费
				$scope.rongHe2.prod_naru_package = "";
				$scope.rongHe2.prod_naru_package_code = "";
				$scope.rongHe2.prod_naru_package_id = "";
				$scope.rongHe2.kd_zxzf = "";
				$scope.rongHe2.kd_zxzf_id = "";

				//显示融合首月资费
				if ($scope.rongHe2.wotype == '0') {
					$scope.show.rh_info_first = true;
				} else {
					//这里还有代码，是移网的
					$scope.show.addYiWang_btn = false;
					//根据1+N，来默认添加N个移网号码
					var count = 1;
					if (name.indexOf("1+2") != -1) {
						count = 2;
					} else if (name.indexOf("1+3") != -1) {
						count = 3;
					}
					console.log("name为" + name + "，count为" + count);

					//先清空移网数组，再循环添加
					$scope.arrays.yiWang_rows = [];

					//执行添加N个移网号码
					for (var i = 0; i < count; i++) {
						$scope.event.addYwInfo();
					}

					//获取组合版折扣
					$scope.request.loadZheKou(id);
				}
			},

			//融合首月资费
			select_rh_first: function(obj, type) {
				$scope.event.selectReplaceClass(obj);
				if (type == 1) {
					$scope.rongHe2.firstFee = "全月资费";
				} else if (type == 2) {
					$scope.rongHe2.firstFee = "半月资费";
				} else if (type == 3) {
					$scope.rongHe2.firstFee = "套外资费";
				}
				$scope.request.loadRH_FEE(type);
			},

			//速率
			selectSpeed: function(obj, id, name) {
				$scope.event.selectReplaceClass(obj);
				$scope.rongHe2.kd_speed_id = id;
				$scope.rongHe2.kd_speed = name;
				//获取宽带套餐,“宽带套餐”会进一步获取“宽带资费”
				$scope.request.loadKuanDaiPackage();

				//重置IPTV
				$scope.arrays.iptv_zdy_rows = [];

			},

			//接入类型
			selectJrlx: function(obj, id, name) {
				$scope.event.selectReplaceClass(obj);
				$scope.rongHe2.kd_jrlx_id = id;
				$scope.rongHe2.kd_jrlx = name;

				//重置IPTV
				$scope.arrays.iptv_zdy_rows = [];
			},

			//宽带资费包选择
			selectKuanDaiZiFei: function(obj, id, code, type, name) {
				console.log("点击事件成功：宽带资费包选择" + name);
				$scope.event.selectReplaceClass(obj);
				$scope.rongHe2.prod_naru_package = name;
				$scope.rongHe2.prod_naru_package_id = id;
				$scope.rongHe2.prod_naru_package_code = code;
				$scope.rongHe2.prod_naru_package_type = type;

				$scope.rongHe2.expire_deal_mode = ""; //到期执行方式编码
				$scope.rongHe2.expire_deal_name = ""; //到期执行方式编码
				$scope.rongHe2.discnt_code = ""; //到期执行资费编码
				$scope.rongHe2.discnt_name = ""; //到期执行资费

				$scope.show.kd_info_zxfs = false;

				//获取宽带到期执行方式（包年才有），包年type=1
				if (type == "1") {
					$scope.show.kd_info_zxfs = true;
					//显示到期执行方式
					$scope.request.loadKuanDaiMode();
				} else {
					$scope.show.kd_info_zxfs = false;
				}
				//获取宽带到期执行资费， 有时有，有时无数据
				$scope.request.loadKuanDaiDaoQi();
			},

			//宽带执行方式选择
			selectKuanDaiMode: function(obj, code, name) {
				$scope.event.selectReplaceClass(obj);
				$scope.rongHe2.expire_deal_mode = code; //到期执行方式编码
				$scope.rongHe2.expire_deal_name = name; //到期执行方式编码
				if (code == "b") {
					$scope.rongHe2.discnt_code = $scope.rongHe2.kd_zxzf_id; //到期执行资费编码
					$scope.rongHe2.discnt_name = $scope.rongHe2.kd_zxzf; //到期执行资费
				} else if (code == "t") {
					$scope.rongHe2.discnt_code = $scope.rongHe2.kd_zxzf_id; //到期执行资费编码
					$scope.rongHe2.discnt_name = $scope.rongHe2.kd_zxzf; //到期执行资费
				}
			},

			//区域选择--宽带
			selectCity1: function(obj, code, name) {
				$scope.event.selectReplaceClass(obj);
				$scope.rongHe2.city_code1 = code;
				$scope.rongHe2.city_name1 = name;
				console.log("$scope.rongHe2.city_code1等于" + $scope.rongHe2.city_code1);
				console.log("$scope.rongHe2.city_name1等于" + $scope.rongHe2.city_name1);
			},

			//区域选择--固话
			selectCity2: function(obj, code, name) {
				$scope.event.selectReplaceClass(obj);
				$scope.rongHe2.city_code2 = code;
				$scope.rongHe2.city_name2 = name;
				console.log("$scope.rongHe2.city_code2等于" + $scope.rongHe2.city_code2);
				console.log("$scope.rongHe2.city_name2等于" + $scope.rongHe2.city_name2);
			},

			//固话类型
			select_gh_type: function(obj, type) {
				//如果已经被选中，又再次点击，即取消操作
				if ($(obj.target).hasClass("com_selectbtnon")) {
					console.log($scope.rongHe1.rh_type + "-----------" + $scope.rongHe2.gh_name);
					if ($scope.rongHe1.rh_type == "0" && $scope.rongHe2.gh_name) {
						console.log("不可以取消");
						return; //配置产品，有固话，不允许取消选择
					}
					console.log("可以取消");
					$(obj.target).removeClass("com_selectbtnon");

					$scope.rongHe2.gh_name = "";
					$scope.rongHe2.gh_name_id = "";
					$scope.rongHe2.gh_fee = "";
					$scope.rongHe2.gh_fee_id = "";
					//清空填写的地址
					$scope.rongHe2.city_code2 = "";
					$scope.rongHe2.city_name1 = "";

					//重置固话状态
					$scope.rongHe2.phoneType = "";
					$scope.rongHe2.zuhezifeibao = "";
					//隐藏掉下级
					$scope.show.gh_info_name = false;
					$scope.show.gh_info_num = false;
					$scope.show.gh_info_first = false;
					return;
				} else {
					//如果之前没被选中，则现在选中
					$(obj.target).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
					$scope.show.gh_info_num = true;

					$scope.rongHe2.phoneType = type; //新装或纳入
					//显示号码框
					$scope.show.gh_info_num = true;

					if (type == "新装" && $scope.rongHe1.kuanDaiType != "新装宽带") {
						//已有宽带和固话新装时，需填写装机地址
						$scope.show.gh_address = true;
					} else {
						$scope.show.gh_address = false;
					}

					if ($scope.arrays.gh_name_rows.length > 1) {
						//固话产品有多个，需要网点选择，等于1时，默认选中，然后隐藏掉
						$scope.show.gh_info_name = true;
						return;
					}
					if ($scope.rongHe2.wotype == "1" && $scope.rongHe2.gh_first == "1") {
						//组合（包年）需要选择首月资费
						$scope.show.gh_info_first = true;
						console.log("组合版，且$scope.rongHe2.gh_first = 1，显示固话首月资费");
					} else {
						console.log("wotype=" + $scope.rongHe2.wotype + "，共享版，隐藏固话首月资费");
						$scope.rongHe2.zuhezifeibao = $scope.rongHe2.gh_fee ? $scope.rongHe2.gh_fee : "";
					}
				}
			},

			//固话产品选择
			select_gh_name: function(obj, type, name, id, fee, fee_id) {
				console.log("点击事件进行中....");
				console.log("固话产品名：" + name);
				$scope.event.selectReplaceClass(obj);

				$scope.rongHe2.gh_first = type;
				$scope.rongHe2.gh_name = name;
				$scope.rongHe2.gh_name_id = id;
				$scope.rongHe2.gh_fee = fee;
				$scope.rongHe2.gh_fee_id = fee_id;

				console.log($scope.rongHe2.wotype + "```````````" + $scope.rongHe2.gh_first);
				console.log("$scope.rongHe2.wotype=" + $scope.rongHe2.wotype);
				if ($scope.rongHe2.wotype == "1" && $scope.rongHe2.gh_first == "1") {
					//组合（包年）需要选择首月资费
					$scope.show.gh_info_first = true;
				} else {
					$scope.rongHe2.zuhezifeibao = $scope.rongHe2.gh_fee ? $scope.rongHe2.gh_fee : "";
					$scope.show.gh_info_first = false;
				}
			},

			//固话首月资费
			select_gh_first: function(obj, type) {
				$scope.event.selectReplaceClass(obj);
				$scope.rongHe2.zuhezifeibao = type;
				$scope.rongHe2.zuhezifeibaoId = "";
				console.log("固话首月资费$scope.rongHe2.zuhezifeibao=" + $scope.rongHe2.zuhezifeibao);
				if (type == "首月全量全价")
					$scope.rongHe2.zuhezifeibaoId = "7044800";
				else if (type == "首月半量半价")
					$scope.rongHe2.zuhezifeibaoId = "7044900";
				else if (type == "首月按量计费")
					$scope.rongHe2.zuhezifeibaoId = "7045000";
			},

			//添加IPTV
			addIPTV: function() {

				console.log("$scope.rongHe2.wotype=" + $scope.rongHe2.wotype);
				if (!$scope.rongHe2.kd_speed || !$scope.rongHe2.kd_jrlx) {
					alert("请先选择融合信息、宽带速率和接入类型");
					return;
				}

				var count = $(".iptv_zdy_div span span").size();

				//添加iptv,需要后台有这么多个iptv
				if (count < $scope.arrays.iptv_datas_rows.length) {
					$scope.request.addIptv("IPTV_" + (count + 1));

					if ((count + 1) >= $scope.arrays.iptv_datas_rows.length) {
						$scope.show.addIPTV_btn = false;
					}
				}

				$scope.arrays.iptv_zdy_rows = []; //先清空
				for (var i = 0; i < (count + 1); i++) {
					$scope.arrays.iptv_zdy_rows[i] = {};
					$scope.arrays.iptv_zdy_rows[i] = $scope.arrays.iptv_datas_rows[i];
					$scope.arrays.iptv_zdy_rows[i].ALIAS_NAME = ""; //添加包年或包月
					$scope.arrays.iptv_zdy_rows[i].ALIAS_ID = ""; //添加包年或包月ID
					console.log($scope.arrays.iptv_zdy_rows);
				}

				//清空刚才选中的IPTV信息
				$timeout(function() {
					$scope.$apply(function() {
						//移除所有a的选中样式
						$(".iptv_zdy_div").find("a").removeClass("com_selectbtnon");
						//隐藏所有高清，标清选项
						$(".layout_centent").find(".iptv_type_div").hide();
						//隐藏所有的机顶盒
						$(".layout_centent").find(".iptv_jdh_div").hide();
					})
				}, 100);
			},

			//选择包年，还是包月
			select_iptv_class: function(obj, id, name) {
				console.log(name);
				//如果之前已经是选中，则此次点击视为取消选中
				if ($(obj.target).hasClass("com_selectbtnon")) {
					//取消自己的样式
					$(obj.target).removeClass("com_selectbtnon");
					//隐藏IPTV类型,同时取消掉选中样式
					$(obj.target).parents(".layout_secondbox").find(".iptv_type_div").hide().find("a").removeClass("com_selectbtnon");
					//隐藏机顶盒，只隐藏自己的机顶盒
					$(obj.target).parents(".iptv_zdy_div").find(".iptv_jdh_div").hide().find("a").removeClass("com_selectbtnon");
					return;
				}
				//否则
				$scope.event.selectReplaceClass(obj);
				var index = $(obj.target).parents(".layout_secondbox").attr("data-index");
				console.log("index是：" + index);
				try {
					$scope.arrays.iptv_zdy_rows[index].ALIAS_NAME = name;
					$scope.arrays.iptv_zdy_rows[index].ALIAS_ID = id;
				} catch (e) {
					alert(e.message);
				}

				//显示IPTV类型,同时取消掉选中样式
				$(obj.target).parents(".layout_secondbox").find(".iptv_type_div").show().find("a").removeClass("com_selectbtnon");

				//隐藏机顶盒，只隐藏自己的机顶盒
				$(obj.target).parents(".iptv_zdy_div").find(".iptv_jdh_div").hide().find("a").removeClass("com_selectbtnon");
			},

			//自定义IPTV的类型选择（高清，标清）
			select_zdy_iptv_type: function(obj, name) {
				console.log("速率" + $scope.rongHe2.kd_speed);
				console.log("接入类型" + $scope.rongHe2.kd_jrlx);
				console.log(name);
				if ($scope.rongHe2.kd_speed == "4M" && $scope.rongHe2.kd_jrlx == "ADSL" && name == "高清") {
					$(obj.target).addClass("noClick");
					alert("此产品下（4M,ADSL），不可选高清");
					return;
				} else {
					$(obj.target).addClass("yesClick");
					console.log("高清可点击");
					$scope.event.selectReplaceClass(obj);

					console.log("点击成功");

					//显示机顶盒，只显示自己的机顶盒
					$(obj.target).parents(".iptv_zdy_div").find(".iptv_jdh_div").show().find("a").removeClass("com_selectbtnon");

					//如果点击成功，去获取IPTV资费
					$scope.request.loadIPTV_FEE_ZDY(obj);
				}
			},

			//配置产品的iptv高清还是标清
			select_iptv_type: function(obj, name) {
				console.log("速率" + $scope.rongHe2.kd_speed);
				console.log("接入类型" + $scope.rongHe2.kd_jrlx);
				console.log(name);
				if ($scope.rongHe2.kd_speed == "4M" && $scope.rongHe2.kd_jrlx == "ADSL" && name == "高清") {
					$(obj.target).addClass("noClick");
					alert("此产品下（4M,ADSL），不可选高清");
					console.log("高清不可点击");
					return;
				} else {
					$(obj.target).addClass("yesClick");
					console.log("高清可点击");
					$scope.event.selectReplaceClass(obj);

					//获取IPTV资费，机顶盒资费，执行资费
					$scope.request.loadIPTV_FEE_PZ(obj);
				}
			},

			//机顶盒点击事件
			select_iptv_jdh: function(obj) {
				$scope.event.selectReplaceClass(obj);
				console.log("机顶盒点击成功.......");

				var typeBtn = $(obj.target).parents(".layout_secondbox").find(".iptv_type_div").find("a[class*=com_selectbtnon]");
				console.log(typeBtn.text());

				//获取机顶盒资费，传入参数：自己，（高清，标清）按钮 
				$scope.request.loadJDH_FEE(obj, typeBtn);
			},

			//添加一个移网
			addYwInfo: function() {
				$timeout(function() {
					$scope.$apply(function() {
						var index = $(".layout_secondbox[type*=yiWang]").size();
						console.log("已经有" + index + "个移网");
						if (index >= 10) {
							$scope.show.addYiWang_btn = false;
							return false;
						}

						//插入初始化的元素
						$scope.arrays.yiWang_rows[index] = {};
						$scope.arrays.yiWang_rows[index]["yw_num"] = "未选择";
						$scope.arrays.yiWang_rows[index]["yw_first"] = "未选择";
						$scope.arrays.yiWang_rows[index]["yw_fee"] = "未设置";
						$scope.arrays.yiWang_rows[index]["yw_acti"] = "未选择";
						$scope.arrays.yiWang_rows[index]["yw_actiname"] = "未选择";
						$scope.arrays.yiWang_rows[index]["yw_pack"] = "未选择";

						if ($scope.rongHe2.wotype == "0") {
							//共享版
							$timeout(function() {
								$scope.$apply(function() {
									console.log("隐藏自己的活动类型，活动名称......");
									$("#yiWangInfo_" + index + " .yw_acti").hide();
									$("#yiWangInfo_" + index + " .yw_actiname").hide();
									$("#yiWangInfo_" + index + " .yw_pack").hide();
									$("#yiWangInfo_" + index + " .yw_first").hide();
									$("#yiWangInfo_" + index + " .yw_fee").hide();
									$("#yiWangInfo_" + index + " .yw_ch").hide();
									$("#yiWangInfo_" + index + " .yw_type").hide();
									$("#yiWangInfo_" + index + " .yw_number").hide();
								});
							}, 100);
						} else {
							//组合版
							$timeout(function() {
								$scope.$apply(function() {
									$("#yiWangInfo_" + index + " .yw_ch").hide();
									$("#yiWangInfo_" + index + " .yw_type").hide();
									$("#yiWangInfo_" + index + " .yw_number").hide();
								});
							}, 100);
						}
					});
				}, 100);
			},

			//移网类型选择：新装，纳入 
			selectYiWangType: function(obj, type, index) {

				//移网下标
				$scope.publicParams.yiWangIndex = index;

				$scope.event.selectReplaceClass(obj);
				//如果是合约惠机，需要填写串号
				try {
					if ($scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]["yw_acti"].indexOf("合约惠机") != -1) {
						$("#yiWangInfo_" + $scope.publicParams.yiWangIndex + " #yiWangInfo").find(".yw_ch").show();
					} else {
						$("#yiWangInfo_" + $scope.publicParams.yiWangIndex + " #yiWangInfo").find(".yw_ch").hide();
					}
				} catch (e) {
					console.log("exception:这个错是因为自定义产品刚开始没有活动名称，所以indexOf报错");
				}


				//将预存款fee_init显示在input里，
				$("#yw_fee").val($scope.arrays.yiWang_rows[index]["fee_config"]);
				console.log("将预存款fee_config显示在input里");

				if (type == "新装") {
					console.log("新装");
					$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]['data-clas'] = "新装";
					$("#yiWangInfo_" + index + " .yw_type").hide();
					$("#yiWangInfo_" + index + " .yw_number").hide();

					if ($scope.rongHe2.wotype == "0") {
						console.log("自定义--新装--共享版,或者，配置--新装--共享版");
						console.log("接下来：需要选号码，回来就结束");
						$scope.show.writeInfoDiv = false;
						$scope.show.numberDiv = true;
						$("#yiWangInfo_" + index + " .yw_num").show();
						//清空号码数组，然后加载号码
						$scope.page = 1;
						$scope.arrays.numbers = [];
						$scope.request2.getPage();
						console.log("完成---------------------");

					} else if ($scope.rongHe1.rh_type == "1" && $scope.rongHe2.wotype != "0") {
						console.log("自定义--新装--组合版");
						console.log("接下来：选产品，套餐，手机号码，回来选首月资费和预存款");

						//弹出框
						$("#productBox").show();
						$("#shadeDiv2").show();

					} else if ($scope.rongHe1.rh_type == "0" && $scope.rongHe2.wotype != "0") {
						console.log("配置--新装--组合版");
						console.log("接下来：选号，弹框（首月资费，预存款）");
						$scope.show.writeInfoDiv = false;
						$scope.show.numberDiv = true;

						//清空号码数组，然后加载号码
						$scope.page = 1;
						$scope.arrays.numbers = [];
						$scope.request2.getPage();
						console.log("完成---------------------");
					}
				} else if (type == "纳入") {

					$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]['data-clas'] = "纳入";

					if ($scope.rongHe2.wotype == "0") {
						console.log("自定义--纳入--共享版，或者，配置--纳入--共享版");
						console.log("接下来：选择类型，填写号码");
						console.log("完成---------------------");
						$("#yiWangInfo_" + index + " .yw_num").hide();
						$("#yiWangInfo_" + index + " .yw_type").show();
						$("#yiWangInfo_" + index + " .yw_number").show();
					} else if ($scope.rongHe1.rh_type == "1" && $scope.rongHe2.wotype != "0") {
						console.log("自定义--纳入--组合版");
						console.log("接下来：选产品，套餐，不用选号码，回来道首月资费和预存款，填写号码，出现类型；如果类型是（4G），弹出是否保留原产品。");

						$("#productBox").show();
						$("#shadeDiv2").show();
					} else if ($scope.rongHe1.rh_type == "0" && $scope.rongHe2.wotype != "0") {
						console.log("配置--纳入--组合版");
						console.log("接下来：隐藏掉号码，弹框（选首月资费，预存款），出现（类型），填写号码；如果类型是（4G），弹出是否保留原产品。");
						console.log("完成---------------------");
						//隐藏号码
						$("#yiWangInfo_" + index + " .yw_num").hide();

						//出现类型选择，号码输入框
						$("#yiWangInfo_" + index).find(".yw_type,.yw_number").show();

						//弹出框,选首月资费和预存款
						$scope.event.alertBox();

					}
				}
			},

			//弹出框
			alertBox: function() {
				//弹出框,选首月资费和预存款
				$("#shadeDiv2").show();
				$("#editBox").show();
				$("#yw_fee").val($scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]["fee_config"]);
			},

			//取消弹框
			edit_false: function() {
				$("#shadeDiv2").hide();
				$("#editBox").hide();
				$("#saveProduct").hide();
			},

			//确定 ，弹出框的确定事件,获取首月资费和预存款
			getFirstFee: function() {
				//如果没选首月资费，点击无效
				if ($("#zf3").hasClass("com_selectbtnon")) {
					$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex].yw_first = "首月全量全价";
				} else if ($("#zf2").hasClass("com_selectbtnon")) {
					$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex].yw_first = "首月套餐减半";
				} else if ($("#zf1").hasClass("com_selectbtnon")) {
					$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex].yw_first = "首月按量计费";
				}

				var fee = $("#yw_fee").val().trim();
				try {
					if (isNaN(fee) || fee < 0 || fee == "") {
						alert("预存款格式有错");
						return;
					} else {
						if (parseFloat(fee) < $scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]["fee_config"]) {
							alert("预存款必须大于" + $scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]["fee_config"]);
							return;
						} else {
							$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]["yw_fee"] = parseFloat(fee);
						}
					}
				} catch (e) {
					alert("预存款格式有错");
					return;
				}
				//去掉遮罩层
				$scope.event.edit_false();
			},

			//弹框，保留原产品
			saveProduct: function(flag) {
				if (flag == "是") {
					//隐藏前面的html元素
					$("#yiWangInfo_" + $scope.publicParams.yiWangIndex + " #yiWangInfo").find(".yw_num,.yw_acti,.yw_actiname,.yw_pack,.yw_first,.yw_fee,.yw_ch").hide();
					//赋值，1==保留原产品，0==不保留原产品套餐，使用当前新套餐
					$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]['data-keep'] = 1;
					//去掉遮罩层
					$scope.event.edit_false();
				} else {
					$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]['data-keep'] = 0;
					//去掉遮罩层
					$scope.event.edit_false();
				}
			},

			//弹出框中，选择产品类型
			selectProductType: function(obj, text) {

				if (text == "合约") {
					$scope.show.productDiv = true;
					$scope.show.writeInfoDiv = false;

					//加载合约产品列表，调用来自于handleContract1.js
					brand_yiWang();

				} else {
					//TODO 买号卡
					$scope.show.danKaProductDiv = true;
					$scope.show.writeInfoDiv = false;
					dk_info(); //加载单卡产品，调用来自于buyumCard.js
					dk_brand();
				}
				//确定后，隐藏掉弹出框
				$("#productBox").hide();
				$("#shadeDiv2").hide();
			},

			//选中移网产品
			selectRongHeProduct: function() {
				//选择合约产品、套餐
				$scope.show.productDiv = false;
				$scope.show.packageDiv = true;

				//加载套餐选项，调用来自于handleContract3.js
				acti_yiWang();
			},

			//TODO 选中单卡产品
			selectDanKaProduct: function() {
				//接下来选套餐
				$scope.show.danKaProductDiv = false;
				$scope.show.danKaPackageDiv = true;

				//加载单卡套餐选项，调用来自于handleContract3.js
				dk_packageType();
			},

			//保存移网套餐，然后根据是新装，还是纳入，来决定：是否显示号码选择界面，是否弹出首月资费框
			saveYiWangInfo: function() {

				$scope.show.packageDiv = false;
				$scope.show.danKaPackageDiv = false;

				var data = Local.getStoreJson("yiWangPackage");
				if (data.fee_init == undefined || data.fee_init == '') {
					data.fee_init = 0;
				}
				if (data.fee_config == undefined || data.fee_config == '') {
					data.fee_config = 0;
				}
				//预存款初始值
				$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]['fee_init'] = data.fee_init;
				$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]['fee_config'] = data.fee_config;
				console.log("fee_init:" + data.fee_init);
				console.log("fee_config:" + data.fee_config);

				//赋值
				var acti_type = "";
				var acti_name = "";
				if (data.actiVal) {
					//活动类型
					acti_type = data.actiVal;
					if (acti_type.indexOf("合约惠机") != -1) {
						//活动名称
						acti_name = data.feeNote;
						//如果是合约惠机，则显示串号input
						$("#yiWangInfo_" + $scope.publicParams.yiWangIndex + " #yiWangInfo").find(".yw_ch").show();
					} else {
						$("#yiWangInfo_" + $scope.publicParams.yiWangIndex + " #yiWangInfo").find(".yw_ch").hide();
					}
				}
				$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]['data-actitype'] = acti_type;
				$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]['data-actiname'] = acti_name;

				var productName = "";
				if (data.typeVal.indexOf("3G/4G一体化套餐") != -1) {
					if (data.nameVal.indexOf("元套餐") != -1) {
						productName = '4G全国套餐-' + data.nameVal;
					} else {
						productName = '4G全国套餐-' + data.nameVal.replace("套餐", "元套餐");
					}
				} else if (data.typeVal.indexOf("辽宁4G本地套餐") != -1) {
					if (data.nameVal.indexOf("元套餐") != -1) {
						productName = '4G本地套餐-' + data.nameVal;
					} else {
						productName = '4G本地套餐-' + data.nameVal.replace("套餐", "元套餐");
					}
				} else {
					if (data.nameVal.indexOf("元套餐") != -1) {
						productName = data.typeVal + "-" + data.nameVal;
					} else {
						productName = data.typeVal + "-" + data.nameVal.replace("套餐", "元套餐");
					}
				}

				$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]['data-packname'] = productName;
				$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]['yw_acti'] = acti_type;
				$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]['yw_actiname'] = acti_name;
				$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]['yw_pack'] = productName;

				if ($scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]['data-clas'] == "新装") {
					//新装的话，还需要选号
					$scope.show.numberDiv = true;
					//清空号码数组，然后加载号码
					$scope.page = 1;
					$scope.arrays.numbers = [];
					$scope.request2.getPage();
				} else {
					//纳入的话，直接选首月资费
					$scope.show.writeInfoDiv = true;
					$("#yiWangInfo_" + $scope.publicParams.yiWangIndex + " #yiWangInfo").find(".yw_num").hide();
					$("#yiWangInfo_" + $scope.publicParams.yiWangIndex + " #yiWangInfo").find(".yw_type").show();
					$("#yiWangInfo_" + $scope.publicParams.yiWangIndex + " #yiWangInfo").find(".yw_number").show();

					//弹出框,选首月资费和预存款
					$scope.event.alertBox();

				}

			},

			//获取参数
			getAmalgOrderData: function() {
				try {
					var result = {};

					//iptv参数
					$scope.arrays.iptv_group = $scope.event.getIPTVParams(); //获取数组

					if ($scope.arrays.iptv_group == "error") {
						alert("IPTV数据获取失败，不可提交");
						return "";
					}
					if ($scope.rongHe1.rh_type == "0") {
						//配置产品的IPTV必须全选
						if ($scope.arrays.iptv_name_rows.length != $scope.arrays.iptv_group.length) {
							console.log("需要选中的IPTV数量为：" + $scope.arrays.iptv_name_rows.length);
							console.log("iptv数组的长度为：" + $scope.arrays.iptv_group.length);
							alert('IPTV为必选项');
							return "";
						}
					}

					//移网参数
					var datas = $("#yiWangDiv a.marker");
					var number4g = "",
						chuanhao = "",
						acti_type = "",
						acti_name = "",
						productName = "",
						productPackageName = "",
						type = "",
						num_type = "";

					$scope.arrays.wo4G_params = [];
					$scope.arrays.wo4G_text = [];

					for (var i = 0; i < datas.size(); i++) {
						num_type = datas.eq(i).attr("data-clas");
						if (num_type == "纳入") {
							//加入老号码
							num_type = "1"
							number4g = $scope.arrays.yiWang_rows[i]["yw_number"];
							type = $("#yiWangInfo_" + i + " .yw_type").find("select").val();

							if (!number4g) {
								alert('请输入移网号码' + (i + 1));
								return "";
							}
							if (!type) {
								alert('请选择移网号码类型');
								return "";
							}

							//判断老号码是否已经存在
							for (var j = 0; j < $scope.arrays.wo4G_params.length; j++) {
								if ($scope.arrays.wo4G_params[j].type == "1" && $scope.arrays.wo4G_params[j].trans_net_type_code == type && $scope.arrays.wo4G_params[j].serialNumber == number4g) {
									alert('存在重复的移网纳入号码' + number4g);
									return "";
								}
							}
						} else {
							//新装
							num_type = "0";
							if ($scope.arrays.yiWang_rows[i]["yw_num"] == "未选择") {
								alert('请选择移网号码' + (i + 1));
								return "";
							}
							number4g = $scope.arrays.yiWang_rows[i]["yw_num"];
							$scope.rongHe2.PHONE_NUMBER = number4g;
						}

						chuanhao = $scope.arrays.yiWang_rows[i]["yw_ch"] ? $scope.arrays.yiWang_rows[i]["yw_ch"] : "";
						acti_type = datas.eq(i).attr("data-actitype") ? datas.eq(i).attr("data-actitype") : "";
						acti_name = datas.eq(i).attr("data-actiname") ? datas.eq(i).attr("data-actiname") : "";
						if (acti_type.indexOf("合约惠机") != -1) {
							acti_name = acti_type + acti_name;
						}
						productName = datas.eq(i).attr("data-packname") ? datas.eq(i).attr("data-packname") : "";
						productPackageName = $scope.arrays.yiWang_rows[i]["yw_first"];
						console.log("此时的首月资费为" + productPackageName);
						if (productPackageName == "undefined" || productPackageName == undefined) {
							console.log("此时的首月资费为undefined");
							productPackageName = "";
						}

						var yiwang_fee = [];

						if (isNaN(parseFloat($scope.arrays.yiWang_rows[i]["fee_init"]))) {
							$scope.arrays.yiWang_rows[i]["fee_init"] = 0;
							console.log("这里无预存款，所以将fee_init设置为0");
						}

						var yw_fee = parseFloat($scope.arrays.yiWang_rows[i]["yw_fee"]) - parseFloat($scope.arrays.yiWang_rows[i]["fee_init"]);

						if (num_type == "1" && datas.eq(i).attr("data-keep") == "1") {
							//纳入号码、保留原产品，套餐为空
							chuanhao = "";
							acti_type = "";
							acti_name = "";
							productName = "";
							productPackageName = "";
							yw_fee = "";
						} else if (acti_type && acti_type.indexOf("合约惠机") != -1 && !chuanhao) {
							alert('请输入串号');
							return "";
						}

						if ($scope.rongHe2.wotype == "0") {
							//共享版用配置的预存款
							yw_fee = $scope.arrays["yiwang_fee" + (i + 1)] ? $scope.arrays["yiwang_fee" + (i + 1)] : "";
						}

						var acti_type_code = "";
						if (acti_type.indexOf("存费送费") != -1)
							acti_type_code = "CFSF001";
						else if (acti_type.indexOf("存费送业务") != -1)
							acti_type_code = "ZSYW001";
						else if (acti_type.indexOf("合约惠机") != -1)
							acti_type_code = "HYHJ001";

						if (yw_fee) {
							yiwang_fee = [{
								feeMode: "2",
								feeItem: "100000",
								fee: yw_fee
							}];
						}

						var jianmian_fee = $scope.arrays["card_fee" + (i + 1)] ? $scope.arrays["card_fee" + (i + 1)] : "0";
						var yw_text = "类型：" + datas.eq(i).attr("data-clas") + "，号码：" + number4g + "，活动类型：" + acti_type + "，活动名称：" + acti_name + "，套餐：" + productName + "，首月资费：" + productPackageName + "，串号：" + chuanhao + "，减免卡费：" + jianmian_fee + "，预存款：" + yw_fee;
						$scope.arrays.wo4G_text.push(yw_text);

						$scope.arrays.wo4G_params.push({
							productName: productName,
							productPackageName: productPackageName,
							device_imei: chuanhao,
							product_type: acti_type_code,
							prod_name: acti_name,
							serialNumber: number4g,
							type: num_type,
							trans_net_type_code: type,
							jianmian_fee: jianmian_fee,
							yiwang_fee: yiwang_fee
						});

						if (num_type == "1") {
							continue;
						}

						if (true) {
							if (result.list) {
								result.list.list.push({
									'goodsId': $("#yiWangInfo_" + i + " .yw_num").attr("data-id"),
									'quantity': '1'
								});
							} else {
								result['list'] = {
									'list': [{
										'goodsId': $("#yiWangInfo_" + i + " .yw_num").attr("data-id"),
										'quantity': '1'
									}]
								};
							}
						}
					}

					if (!result.list) {
						result['list'] = {
							'list': []
						};
					}

					//校验移网号码逻辑
					if ($scope.arrays.wo4G_params.length == 0) {
						alert('应用程序错误，不存在任何移网号码');
						return "";
					}

					$scope.rongHe2.rhtype = "0";
					if ($scope.rongHe2.kd_speed == "4M" && $scope.rongHe2.phoneType && $scope.arrays.iptv_group.length == 0)
						$scope.rongHe2.rhtype = "1";
					else if (($scope.rongHe2.kd_speed == "10M" || $scope.rongHe2.kd_speed == "20M") && $scope.rongHe2.phoneType && $scope.arrays.iptv_group.length == 0)
						$scope.rongHe2.rhtype = "2";
					else if ($scope.arrays.iptv_group.length != 0 && !$scope.rongHe2.phoneType)
						$scope.rongHe2.rhtype = "3";
					else if ($scope.rongHe2.kd_speed == "4M" && $scope.rongHe2.phoneType && $scope.arrays.iptv_group.length != 0)
						$scope.rongHe2.rhtype = "4";
					else if (($scope.rongHe2.kd_speed == "10M" || $scope.rongHe2.kd_speed == "20M") && $scope.rongHe2.phoneType && $scope.arrays.iptv_group.length != 0)
						$scope.rongHe2.rhtype = "5";

					$scope.rongHe2.rhScene = "";
					if ($scope.rongHe1.kuanDaiType != "新装宽带" && (!$scope.rongHe2.phoneType || $scope.rongHe2.phoneType == "新装"))
						$scope.rongHe2.rhScene = "0"; //新装宽带+新装固话或无固话
					else if ($scope.rongHe1.kuanDaiType != "新装宽带" && (!$scope.rongHe2.phoneType || $scope.rongHe2.phoneType == "新装"))
						$scope.rongHe2.rhScene = "1"; //纳入宽带+新装固话或无固话
					else if ($scope.rongHe1.kuanDaiType != "新装宽带" && ($scope.rongHe2.phoneType && $scope.rongHe2.phoneType == "纳入"))
						$scope.rongHe2.rhScene = "2"; //纳入宽带+纳入固话
					else if ($scope.rongHe1.kuanDaiType != "新装宽带" && ($scope.rongHe2.phoneType && $scope.rongHe2.phoneType == "纳入"))
						$scope.rongHe2.rhScene = "3"; //新装宽带+纳入固话

					result['ext'] = {
						'ext': {
							'BASE': [{
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
								'key': 'CONTACT_PHONE',
								'val': $scope.form.CONTACT_PHONE,
								'key_as': '联系电话'
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

					//处理固话增加资费（纳入时只收取预存款）
					if ($scope.rongHe2.phoneType && $scope.rongHe2.phoneType != "新装") {
						var zj_items = [];
						for (var i = 0; i < $scope.arrays.guhua_fee.length; i++) {
							if ($scope.arrays.guhua_fee[i].feeItem != "100000") {
								continue;
							}
							zj_items.push($scope.arrays.guhua_fee[i]);
						}
						$scope.arrays.guhua_fee = zj_items;
					}

					$scope.event.getNewParams(result);
					return result;
				} catch (e) {
					alert("2.出错：" + e.message);
					return "";
				}

			},

			//获取 IPTV参数
			getIPTVParams: function() {
				try {
					var datas = [];
					//自定义时，要求选了“新装”、“纳入”，就必须把其他选项，也选中
					if ($scope.rongHe1.rh_type == "1") {
						var items_year_month = $(".iptv_zdy_div  a.year_month.com_selectbtnon").size();
						var items_type = $(".iptv_zdy_div  a.type.com_selectbtnon").size(); //参数，都存在这个a里
						var items_jdh = $(".iptv_zdy_div  a.jdh.com_selectbtnon").size();
						console.log("" + items_year_month);
						console.log("" + items_type);
						console.log("" + items_jdh);
						if (items_year_month != items_type || items_type != items_jdh) {
							alert("请选择IPTV类型或机顶盒");
							return "error";
						}
					}

					var objs;
					if ($scope.rongHe1.rh_type == "1") {
						objs = $(".iptv_zdy_div .iptv_type_div .com_selectbtnon");
					} else {
						objs = $(".iptv_peizhi_div .com_selectbtnon");
					}

					console.log("选中的IPTV数量为：" + objs.size());
					for (var i = 0; i < objs.size(); i++) {
						var iptvs = [];
						var name = objs.eq(i).attr("data-iptvname") ? objs.eq(i).attr("data-iptvname") : "";
						var code = objs.eq(i).attr("data-iptvcode") ? objs.eq(i).attr("data-iptvcode") : "";
						var zxfs = objs.eq(i).attr("data-zxzf") ? "b" : "t";
						var zxzf = objs.eq(i).attr("data-zxzfid") ? objs.eq(i).attr("data-zxzfid") : "";
						var zxzf_name = objs.eq(i).attr("data-zxzf") ? objs.eq(i).attr("data-zxzf") : "";
						iptvs.push({
							name: objs.eq(i).attr("data-iptvfee"),
							id: objs.eq(i).attr("data-iptvfeecode"),
							type: zxfs,
							code: zxzf
						});
						iptvs.push({
							name: objs.eq(i).attr("data-jdhfee"),
							id: objs.eq(i).attr("data-jdhfeeid"),
							type: "",
							code: ""
						});
						datas.push({
							iptv_name: name,
							iptv_id: code,
							iptv: iptvs
						});

						var text = "[资费：" + objs.eq(i).attr("data-iptvfee") + "，到期执行方式：" + (zxfs == "b" ? "到期执行指定资费" : "到期停机") + "，到期执行资费：" + zxzf_name + "]，" + "[资费：" + objs.eq(i).attr("data-jdhfee") + "]";

						$scope.arrays.iptv_show.push({
							"name": name,
							"text": text
						});
					}
					console.log(datas);
					return datas;
				} catch (e) {
					alert("3.出错：" + e.message);
					return "error";
				}

			},

			//获取1+n的参数
			getNewParams: function(result) {
				try {
					var kd_fee = [];
					if ($scope.rongHe1.kuanDaiType == "新装宽带") {
						kd_fee = $scope.arrays.kuandai_fee;
					}

					//获取宽带参数
					var kuandai = {
						wo_pag: $scope.rongHe2.wo_bag ? $scope.rongHe2.wo_bag : "",
						wo_pagId: $scope.rongHe2.wo_bag_id ? $scope.rongHe2.wo_bag_id : "",
						oldSerialNumber: $scope.rongHe2.kd_number, //宽带号码
						ronghezhekou: $scope.rongHe2.zhekou_id,
						productName: $scope.rongHe2.prod_naru,
						productId: $scope.rongHe2.prod_naru_code,
						prod_naru_package: $scope.rongHe2.prod_naru_package,
						prod_naru_packageId: $scope.rongHe2.prod_naru_package_code,
						prod_naru_package_type: $scope.rongHe2.prod_naru_package_type,
						expire_deal_mode: $scope.rongHe2.expire_deal_mode ? $scope.rongHe2.expire_deal_mode : "",
						discnt_code: $scope.rongHe2.discnt_code ? $scope.rongHe2.discnt_code : "",
						kuandai_tiaoce: $scope.rongHe2.kd_tiaoce ? $scope.rongHe2.kd_tiaoce : "0",
						kuandai_shouxu: $scope.rongHe2.kd_shouxu ? $scope.rongHe2.kd_shouxu : "0",
						kuandai_gongliao: $scope.rongHe2.kd_gongliao ? $scope.rongHe2.kd_gongliao : "0",
						kuandai_fee: kd_fee,
						iptv_group: $scope.arrays.iptv_group
					}

					//获取固话参数
					var guhua = {
						guhua_productName: $scope.rongHe2.phoneType ? $scope.rongHe2.gh_name : "",
						guhua_productId: $scope.rongHe2.phoneType ? $scope.rongHe2.gh_name_id : "",
						zuhezifeibao: $scope.rongHe2.zuhezifeibao ? $scope.rongHe2.zuhezifeibao : "",
						zuhezifeibaoId: $scope.rongHe2.zuhezifeibaoId ? $scope.rongHe2.zuhezifeibaoId : "",
						num_key: $scope.rongHe2.gh_number,
						guhua_tiaoce: $scope.rongHe2.gh_tiaoce ? $scope.rongHe2.gh_tiaoce : "0",
						guhua_shouxu: $scope.rongHe2.gh_shouxu ? $scope.rongHe2.gh_shouxu : "0",
						guhua_gongliao: $scope.rongHe2.gh_gongliao ? $scope.rongHe2.gh_gongliao : "0",
						guhua_fee: $scope.arrays.guhua_fee
					};

					var city_code = "",
						city_name = "",
						address = "";

					if ($scope.rongHe1.kuanDaiType == "新装宽带") {
						city_code = $scope.rongHe2.city_code1;
						city_name = $scope.rongHe2.city_name1;
						address = $scope.rongHe2.kd_address;
					} else if ($scope.rongHe2.phoneType && $scope.rongHe2.phoneType == "新装") {
						city_code = $scope.rongHe2.city_code2;
						city_name = $scope.rongHe2.city_name2;
						address = $scope.rongHe2.gh_address;
					}

					result['ext']['ext']['BUSINESS.INT'] = [{
						'key': 'PHONE_NUMBER',
						'val': $scope.rongHe2.PHONE_NUMBER ? $scope.rongHe2.PHONE_NUMBER : "01",
						'key_as': '开户号码'
					}];

					result['ext']['ext']['BUSINESS'] = [{
						'key': 'product_name',
						'val': $scope.rongHe1.name,
						'key_as': '融合产品'
					}, {
						'key': 'wotype_name',
						'val': $scope.rongHe2.wotype == "1" ? "组合版" : "共享版",
						'key_as': '共享/组合'
					}, {
						'key': 'city_name',
						'val': city_name,
						'key_as': '地区'
					}, {
						'key': 'install_address',
						'val': address,
						'key_as': '标准地址'
					}, {
						'key': 'wo_pag',
						'val': $scope.rongHe2.wo_bag ? $scope.rongHe2.wo_bag : "",
						'key_as': '共享流量包'
					}, {
						'key': 'wo_pag',
						'val': $scope.rongHe2.zhekou,
						'key_as': '融合折扣'
					}, {
						'key': 'kd_type',
						'val': $scope.rongHe1.kuanDaiType,
						'key_as': '宽带-类型'
					}, {
						'key': 'kd_speed',
						'val': $scope.rongHe2.kd_speed,
						'key_as': '宽带-速率'
					}, {
						'key': 'kd_jrlx',
						'val': $scope.rongHe2.kd_jrlx,
						'key_as': '宽带-接入类型'
					}, {
						'key': 'kd_number',
						'val': $scope.rongHe2.kd_number,
						'key_as': '宽带-纳入号码'
					}, {
						'key': 'kd_name',
						'val': $scope.rongHe2.prod_naru,
						'key_as': '宽带-产品名称'
					}, {
						'key': 'kd_fee',
						'val': $scope.rongHe2.prod_naru_package,
						'key_as': '宽带-产品资费'
					}, {
						'key': 'kd_zxfs',
						'val': $scope.rongHe2.expire_deal_name ? $scope.rongHe2.expire_deal_name : "",
						'key_as': '宽带-到期执行方式'
					}, {
						'key': 'kd_zxzf',
						'val': $scope.rongHe2.discnt_name ? $scope.rongHe2.discnt_name : "",
						'key_as': '宽带-到期执行资费'
					}, {
						'key': 'kd_tiaoce',
						'val': $scope.rongHe2.kd_tiaoce ? $scope.rongHe2.kd_tiaoce : "",
						'key_as': '宽带-调测费'
					}, {
						'key': 'kd_shouxu',
						'val': $scope.rongHe2.kd_shouxu ? $scope.rongHe2.kd_shouxu : "",
						'key_as': '宽带-手续费'
					}, {
						'key': 'kd_gongliao',
						'val': $scope.rongHe2.kd_gongliao ? $scope.rongHe2.kd_gongliao : "",
						'key_as': '宽带-工料费'
					}, {
						'key': 'gh_type',
						'val': $scope.rongHe2.phoneType ? $scope.rongHe2.phoneType : "无固话",
						'key_as': '固话-类型'
					}, {
						'key': 'gh_name',
						'val': $scope.rongHe2.phoneType ? $scope.rongHe2.gh_name : "",
						'key_as': '固话-产品名称'
					}, {
						'key': 'gh_first',
						'val': $scope.rongHe2.zuhezifeibao ? $scope.rongHe2.zuhezifeibao : "",
						'key_as': '固话-首月资费'
					}, {
						'key': 'gh_number',
						'val': $scope.rongHe2.gh_number,
						'key_as': '固话-号码'
					}, {
						'key': 'gh_tiaoce',
						'val': $scope.rongHe2.gh_tiaoce ? $scope.rongHe2.gh_tiaoce : "",
						'key_as': '固话-调测费'
					}, {
						'key': 'gh_shouxu',
						'val': $scope.rongHe2.gh_shouxu ? $scope.rongHe2.gh_shouxu : "",
						'key_as': '固话-手续费'
					}, {
						'key': 'gh_gongliao',
						'val': $scope.rongHe2.gh_gongliao ? $scope.rongHe2.gh_gongliao : "",
						'key_as': '固话-工料费'
					}, {
						'key': 'uremark',
						'val': $scope.form.NOTE,
						'key_as': '业务备注'
					}];

					result['ext']['ext']['HIDDEN'] = [{
						'key': 'wotype',
						'val': $scope.rongHe2.wotype,
						'key_as': '共享/组合'
					}, {
						'key': 'rhScene',
						'val': $scope.rongHe2.rhScene,
						'key_as': '类型'
					}, {
						'key': 'rhtype',
						'val': $scope.rongHe2.rhtype,
						'key_as': '场景'
					}, {
						'key': 'city_code',
						'val': city_code,
						'key_as': '地区编码'
					}, {
						'key': 'kuandai',
						'val': JSON.stringify(kuandai),
						'key_as': '宽带参数'
					}, {
						'key': 'guhua',
						'val': JSON.stringify(guhua),
						'key_as': '固话参数'
					}, {
						'key': 'wo4G',
						'val': JSON.stringify($scope.arrays.wo4G_params),
						'key_as': '移网参数'
					}];

					//组装展示参数
					for (var i = 0; i < $scope.arrays.iptv_show.length; i++) {
						result['ext']['ext']['BUSINESS'].push({
							"key": "iptv_key" + i,
							"val": $scope.arrays.iptv_show[i].text,
							"key_as": $scope.arrays.iptv_show[i].name
						});
					}
					for (var i = 0; i < $scope.arrays.wo4G_text.length; i++) {
						result['ext']['ext']['BUSINESS'].push({
							"key": "yw_key" + i,
							"val": $scope.arrays.wo4G_text[i],
							"key_as": "移网号码" + (i + 1)
						});
					}
				} catch (e) {
					alert("4.出错：" + e.message);
					return "";
				}

			}

		}

		//第一步，加载产品说明，如果是配置产品， 顺便获取到宽带信息，宽带套餐，固话信息
		$scope.request.loadDetail();
		selectRongHeProduct = $scope.event.selectRongHeProduct; //选中合约产品
		saveYiWangInfo = $scope.event.saveYiWangInfo; //保存一个移网产品、套餐信息
		selectDanKaProduct = $scope.event.selectDanKaProduct; //选中单卡产品

		//移网--网络类型改变事件，select  option
		changeType = function(obj) {
			console.log($(obj).find("option:selected").text());
			console.log($(obj).val());
			console.log("当前是第index:" + $(obj).parents(".layout_secondbox").attr("index") + "个移网");

			//移网下标
			$scope.publicParams.yiWangIndex = $(obj).parents(".layout_secondbox").attr("index");
			console.log("当前填写的手机号：" + $scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex].yw_number);
			$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex]["yw_type"] = $(obj).val();

			if ($(obj).find("option:selected").text() == "4G") {
				//组合版的情况下，弹出框，是否保留原产品，wotype=0是共享版，非0是组合版
				if ($scope.rongHe2.wotype != "0") {
					$("#shadeDiv2").show();
					$("#saveProduct").show();
				}
				//共享版选中4G，不需要做任何处理
			}
		}


		//页码
		$scope.page = 1;
		//搜索框里的文本值
		$scope.title = "";
		//搜索功能
		$scope.NumSearch = function() {
			$scope.page = 1;
			$("#more").text("点击加载更多");
			$scope.request2.getPage();
		};
		//第二个接口对象，里面有  获取号码，产品，活动类型，套餐
		$scope.request2 = {
			//加载号码
			getPage: function() {
				$srhttp.get("!ESale/Mall/Goods/~query/Q_GOODS_NUMBER_COMMON", {
					"businessId": "ChinaUnicom.Account.4G.BK",
					"brandId": "",
					"pageSize": 10,
					"page": $scope.page,
					"areaId": "",
					//"typeId": "ChinaUnicom.Account.Number"
					"title": $scope.title,
					"priceorder": "priceLowToHigh" //排序
				}, function(data) {
					if (!data.body.pageCount == 0) {
						$scope.arrays.numbers = data.body.rows;
					}
					//当无数据时，修改文本值
					if (data.body.rows == "") {
						$("#more").text("已无更多号码");
					}
				});
			},

			//锁卡
			lockNumber: function(id, fn) {
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~java/Number.lock", {
					"id": id
				}, function(data) {
					if (data.header.code == 0) {
						if (data.body.flag == "1") {
							if (fn) {
								fn();
							}
						}
					} else {
						alert("该号码已被占用，请选择其他号码");
					}
				})
			},
		}

		$scope.event2 = {
			//加载更多号码
			more: function() {
				$scope.page = $scope.page + 1;
				$srhttp.get("!ESale/Mall/Goods/~query/Q_GOODS_NUMBER_COMMON", {
					"businessId": "ChinaUnicom.Account.4G.BK",
					"brandId": "",
					"pageSize": 10,
					"page": $scope.page,
					"areaId": "",
					//"typeId": "ChinaUnicom.Account.Number"
					"title": $scope.title,
					"priceorder": "priceLowToHigh" //排序
				}, function(data) {
					$scope.arrays.numbers = $scope.arrays.numbers.concat(data.body.rows);

					//当无数据时，修改文本值
					if (data.body.rows == "") {
						$("#more").text("已无更多数据");
					}
				});
			},

			//选择号码
			selectNumber: function(index) {
				var a = "#selectNumber_" + index;
				var phoneNumber = $(a).attr("name"); //号码
				var id = $(a).attr("data"); //号码ID
				$scope.arrays.yiWang_rows[$scope.publicParams.yiWangIndex].yw_num = phoneNumber;
				$("#yiWangInfo_" + $scope.publicParams.yiWangIndex + " .yw_num").attr("data-id", id);
				$("#yiWangInfo_" + $scope.publicParams.yiWangIndex + " .yw_num").show();

				console.log("选中号码：" + phoneNumber);

				//锁卡
				$scope.request2.lockNumber(id, function() {
					//回到之前界面
					$scope.show.writeInfoDiv = true;
					$scope.show.numberDiv = false;
					//只要是组合版，就弹出框，选择首月资费
					if ($scope.rongHe2.wotype == "1") {
						$scope.event.alertBox();
					}
				});
			},
		}
	}
]);