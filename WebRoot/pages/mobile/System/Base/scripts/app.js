/**
 * @(#)app.js.js 2015/3/17 22:46
 * CopyRight 2015.  All rights reserved
 *
 */
/**
 * User: kinz
 */

var app = angular.module('hnwy', ["ngRoute"]);//加载hnwy模块，依赖ngRout模块，返回一个


app.config(function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
		// Allow same origin resource loads.
		'self',
		// Allow loading from our assets domain.  Notice the difference between * and **.
		APP_CONFIG.SERVER_URL + "**"
	]);
});

app.controller("AppCtrl", ["$rootScope",
	function($rootScope) {
		$rootScope.appTitle = APP_CONFIG.APP_NAME;
		$rootScope.backVisible = "none";
		$rootScope.titleVisible = "none";
		$rootScope.titleHeight = "0px";

		$rootScope.appTitles = {
			'/realNameReg': "实名制返档",
			'/orders': "我的订单",
			'/orderForProcess': "待处理订单",
			'/rwcard': "读写卡",
			'/myESaleB': "帐号管理",
			'/myInfo': "个人信息",
			'/rwcardStatus': "读写卡",
			'/home': APP_CONFIG.APP_NAME,
			'/fourGGroupOrder': "4G自由组合",
			'/threeGKaiHu': "3G开户",
			'/fourGYiTiHua': "4G一体化",
			'/twoGKaiHu': "2G开户",
			'/appInfo': "关于APP"
		};

		/**
		 * 控制后退的事件
		 */
		$rootScope.back = function() {

		};

		//设置全局变量
		window.NG_ROOT_SCOPE = $rootScope;
	}
]);

//添加路由事件
app.run(["$rootScope", "$location",
	function($rootScope, $location) {
		$rootScope.$on('$routeChangeSuccess', function(evt, next, previous) {
			//alert($rootScope.appTitle);
			//alert(next.$$route.originalPath);
			if (undefined != next.$$route.originalPath && "/home" == next.$$route.originalPath) {
				$rootScope.backVisible = "none";
				$rootScope.titleVisible = "none";
				$rootScope.titleHeight = "0px";
			} else {
				$rootScope.backVisible = "";
				$rootScope.titleVisible = "";
				$rootScope.titleHeight = "45px";
			}
			/*
			 * 2015年10月20日 15:00:40
			 * 林创荣
			 * 作用：页面切换时，如果是终端订购的界面，右上角切换为购物车图标，否则切换回首页图标
			 * begin
			 */
			var myUrl = window.location.href;
			var start = myUrl.indexOf("#") + 2;
			var end = myUrl.length;
			var value = myUrl.substring(start, end);
			if (value == "zhongDuanDingGou1" || value == "zhongDuanDingGou2" || value == "zhongDuanDingGou3" || value == "shoppingCar") {
				$(".nav_top .btn_right").removeClass("icon_home").addClass("icon_shoppingcar").attr("onclick", "hrefJump('shoppingCar')");
			} else if (value == 'address') {
				$('.nav_top .btn_right').removeClass('icon_home').removeClass("icon_shoppingcar").addClass('icon_add').attr('onclick', 'addAddress()');
			} else {
				$(".nav_top .btn_right").removeClass("icon_shoppingcar").removeClass("icon_add").addClass("icon_home").attr("onclick", "gotoIndex()");
			}

			//ios顶部电池栏样式
			setTimeout(function() {
				$rootScope.$apply(function() {
					if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
						if (value == "home") {
							$("#CONTAINER").css("top", "20px");
						} else {
							$("#CONTAINER").css("top", "65px");
						}
					}
				});
			}, 10);

			/*end*/

			if (undefined != next.$$route.originalPath)
				$rootScope.appTitle = $rootScope.appTitles[next.$$route.originalPath] || APP_CONFIG.APP_NAME;
		});
	}
]);

app.config(["$routeProvider", '$controllerProvider', '$httpProvider',
	function($routeProvider, $controllerProvider, $httpProvider) {
		$httpProvider.defaults.withCredentials = true;
		//app.registerCrl = $controllerProvider.register;//依赖加载js
	}
]);

app.config(["$routeProvider", "$controllerProvider",
	function($routeProvider, $controllerProvider) {
		app.registerCtrl = $controllerProvider.register;
		app.when = $routeProvider.when;
		$routeProvider.
		when("/home", {
			templateUrl: "Business/CellControl/pages/mainFunction.html"
		}).
		when("/cellmessage", {
			templateUrl: "Business/CellControl/pages/Cellmessage.html",
			controller: "Cellmessage"
		}).
			when("/celledit", {
				templateUrl: "Business/CellControl/pages/Cellmess_edit.html",
				controller: "Cellmess_edit"
			}).
		when("/compirmessage", {
			templateUrl: "Business/CompirControl/pages/Compirmessage.html",
			controller: "Compirmessage"
		}).
		when("/choosecell", {
				templateUrl: "Business/CompirControl/pages/ChooseCell.html",
				controller: "ChooseCell"
		}).
			when("/messageforphoto", {
				templateUrl: "Business/CompirControl/pages/Messageforptoto.html",
				controller: "Messageforphoto"
			}).
			when("/messageforedit", {
				templateUrl: "Business/CompirControl/pages/Messageforedit.html",
				controller: "Messageforedit"
			}).
		when("/frame/:page", {
			templateUrl: "ESale/Mall/UI/pages/frame.html",
			controller: "LegacyFrameCtrl"
		}).
		when("/readNameSys", {
			templateUrl: "ESale/Mall/UI/pages/readNameSys.html"
		}).
		when("/fusionBusiness", {
			templateUrl: "ESale/FusionBusiness/pages/fussionBusiness.html",
			controller: "FusionCtrl"
		}).
		when("/orders", {
			templateUrl: "ESale/Order/pages/orderList.html",
			controller: "OrderCtrl"
		}).
		when("/orderForProcess", {
			templateUrl: "ESale/Order/pages/orderForProcess.html",
			controller: "OrderForProcessControl"
		}).
		when("/orderDetail/:orderId", {
			templateUrl: "ESale/Order/pages/orderDetail.html",
			controller: "OrderDetail"
		}).
		when("/myESaleB", {
			templateUrl: "ESale/Mall/UI/pages/myESaleB.html",
			controller: "MyESaleBCtrl"
		}).
		when("/myInfo", {
			templateUrl: "ESale/Mall/UI/pages/myInfo.html",
			controller: "MyInfoCtrl"
		}).
		when("/realNameReg", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/realNameReg.html",
			controller: "RealNameRegCtrl"
		}).
		when("/rwcardStatus", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/rwcardStatus.html",
			controller: "RWCardStatusCtrl"
		}).
		when("/fourGGroupOrder", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/fourGGroupOrder.html",
			controller: "FourGGroupOrderCtrl"
		}).
		when("/appInfo", {
			templateUrl: "ESale/Mall/UI/pages/appInfo.html"
		}).
		when("/changePassword", {
			templateUrl: "ESale/Mall/UI/pages/changePassword.html",
			controller: "MyChangePassword"
		}).
		when("/activate", {
			templateUrl: "ESale/Mall/UI/pages/activate.html"
		}).
		when("/payPhoneBill", {
			templateUrl: "ESale/Mall/UI/pages/payPhoneBill.html",
			controller: "payPhoneBill"
		}).
		when("/YSBinputlist", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/YSBinputlist.html",
			controller: "YSBinputlistCtrl"
		}).
		when("/YSBinputlist2", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/YSBinputlist2.html",
			controller: "YSBinputlist2Ctrl"
		}).
		when("/YSBinputlist3", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/YSBinputlist3.html",
			controller: "YSBinputlist3Ctrl"
		}).
		when("/YSBinputlist4", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/YSBinputlist4.html",
			controller: "YSBinputlist4Ctrl"
		}).
		when("/myAccount", {
			templateUrl: "ESale/Mall/UI/pages/myAccount.html",
			controller: "MyAccountCtrl"
		}).
		when("/walletLog", {
			templateUrl: "ESale/Mall/UI/pages/walletLog.html",
			controller: "WalletLogCtrl"
		}).
		when("/twoGKaiHu", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/twoGKaiHu.html",
			controller: "twoGKaiHuCtrl"
		}).
		when("/threeGKaiHu", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/threeGKaiHu.html",
			controller: "ThreeGKaiHuCtrl"
		}).
		when("/fourGYiTiHua", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/fourGYiTiHua.html",
			controller: "FourGYiTiHuaCtrl"
		}).
		when("/chooseContract", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/chooseContract.html",
			controller: "ChooseContractCtrl"
		}).
		when("/openContract", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/openContract.html",
			controller: "OpenContractCtrl"
		}).
		when("/amalgamation_1", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/amalgamation_1.html",
			controller: "amalgamation1Ctrl"
		}).
		when("/realNameReg_bj", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/realNameReg_bj.html",
			controller: "realNameReg_bjCtrl"
		}).when("/myWeChat", {
                templateUrl: "ESale/Mall/UI/pages/myWeChat.html",
                controller: "MyWeChatCtrl"
            }).
		when("/shoppingCar", {
			templateUrl: "ESale/TerminalOrder/pages/shoppingCar.html",
			controller: "ShoppingCarCtrl"
		}).
		when("/zhongDuanDingGou1", {
			templateUrl: "ESale/TerminalOrder/pages/zhongDuanDingGou1.html",
			controller: "ZhongDuanDingGou1Ctrl"
		}).
		when("/zhongDuanDingGou2", {
			templateUrl: "ESale/TerminalOrder/pages/zhongDuanDingGou2.html",
			controller: "ZhongDuanDingGou2Ctrl"
		}).
		when("/zhongDuanDingGou3", {
			templateUrl: "ESale/TerminalOrder/pages/zhongDuanDingGou3.html",
			controller: "ZhongDuanDingGou3Ctrl"
		}).
		when("/terminalOrderDetail/:orderId", {
			templateUrl: "ESale/Order/pages/terminalOrderDetail.html",
			controller: "TerminalOrderDetailCtrl"
		}).
		when("/address", {
			templateUrl: "ESale/TerminalOrder/pages/address.html",
			controller: "AddressCtrl"
		}).
		when("/addAddress", {
			templateUrl: "ESale/TerminalOrder/pages/addAddress.html",
			controller: "addAddressCtrl"
		}).
		when("/kuanDai1", {
			templateUrl: "ESale/Business/VirtualService/Phone/Amalgamation/pages/kuanDai1.html",
			controller: "KuanDai1Ctrl"
		}).
		when("/kuanDai2", {
			templateUrl: "ESale/Business/VirtualService/Phone/Amalgamation/pages/kuanDai2.html",
			controller: "KuanDai2Ctrl"
		}).
		when("/buyNumCard/:type", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/buyNumCard.html",
			controller: "BuyNumCardCtrl"
		}).
		when("/buyNumCard2/:type", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/buyNumCard2.html",
			controller: "BuyNumCardCtrl2"
		}).
		when("/buyNumCard2_2", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/buyNumCard2_2.html",
			controller: "BuyNumCardCtrl2_2"
		}).
		when("/buyNumCard3", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/buyNumCard3.html",
			controller: "BuyNumCardCtrl3"
		}).
		when("/buyNumCard_net", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/buyNumCard_net.html",
			controller: "BuyNumCard_netCtrl"
		}).
		when("/handleContract/:type", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/handleContract.html",
			controller: "HandleContractCtrl"
		}).
		when("/handleContract2", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/handleContract2.html",
			controller: "HandleContractCtrl2"
		}).
		when("/handleContract3/:type", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/handleContract3.html",
			controller: "HandleContractCtrl3"
		}).
		when("/handleContract4", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/handleContract4.html",
			controller: "HandleContractCtrl4"
		}).
		when("/rongHe1", {
			templateUrl: "ESale/Business/VirtualService/Phone/Amalgamation/pages/rongHe1.html",
			controller: "RongHe1Ctrl"
		}).
		when("/rongHe2", {
			templateUrl: "ESale/Business/VirtualService/Phone/Amalgamation/pages/rongHe2.html",
			controller: "RongHe2Ctrl"
		}).
		when("/payTheBill", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/payTheBill.html",
			controller: "PayTheBillCtrl"
		}).
		when("/payTheBillResult", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/payTheBillResult.html",
			controller: "PayTheBillResultCtrl"
		}).
		//2015年11月29日 10:51:24  电信的做融合链接:type=1融合，type=2改融合套餐
		when("/zuoRongHe1/:type", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/zuoRongHe1.html",
			controller: "ZuoRongHe1Ctrl"
		}).
		when("/zuoRongHe2/:type", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/zuoRongHe2.html",
			controller: "ZuoRongHe2Ctrl"
		}).
		when("/zuoRongHe2_2/:type", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/zuoRongHe2_2.html",
			controller: "ZuoRongHe2_2Ctrl"
		}).
		when("/zuoRongHe3/:type", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/zuoRongHe3.html",
			controller: "ZuoRongHe3Ctrl"
		}).
		when("/zuoRongHe4/:type", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/zuoRongHe4.html",
			controller: "ZuoRongHe4Ctrl"
		}).
		when("/tianYiNumber1/:type", {
			templateUrl: "ESale/Business/VirtualService/Phone/DianXin/pages/tianYiNumber1.html",
			controller: "TianYiNumber1Ctrl"
		}).
		when("/tianYiNumber2_2/:type", {
			templateUrl: "ESale/Business/VirtualService/Phone/DianXin/pages/tianYiNumber2_2.html",
			controller: "TianYiNumber2_2Ctrl"
		}).
		when("/tianYiNumber3/:type", {
			templateUrl: "ESale/Business/VirtualService/Phone/DianXin/pages/tianYiNumber3.html",
			controller: "TianYiNumber3Ctrl"
		}).
		when("/tianYiNumber4/:type", {
			templateUrl: "ESale/Business/VirtualService/Phone/DianXin/pages/tianYiNumber4.html",
			controller: "TianYiNumber4Ctrl"
		}).
		when("/updatePackage", {
			templateUrl: "ESale/Business/VirtualService/Phone/DianXin/pages/updatePackage.html",
			controller: "UpdatePackageCtrl"
		}).
		when("/changeFourNumber", {
			templateUrl: "ESale/Business/VirtualService/Phone/DianXin/pages/changeFourNumber.html",
			controller: "ChangeFourNumberCtrl"
		}).
		when("/nfcRegister", {
			templateUrl: "ESale/Mall/UI/pages/nfcRegister.html",
			controller: "NfcRegisterCtrl"
		}).
		when("/oldUser1", {
			templateUrl: "ESale/Business/VirtualService/Phone/OldUser/pages/oldUser1.html",
			controller: "OldUser1Ctrl"
		}).
		when("/oldUser2", {
			templateUrl: "ESale/Business/VirtualService/Phone/OldUser/pages/oldUser2.html",
			controller: "OldUser2Ctrl"
		}).
		when("/oldUser3_1", {
			templateUrl: "ESale/Business/VirtualService/Phone/OldUser/pages/oldUser3_1.html",
			controller: "OldUser3_1Ctrl"
		}).
		when("/oldUser3_2", {
			templateUrl: "ESale/Business/VirtualService/Phone/OldUser/pages/oldUser3_2.html",
			controller: "OldUser3_2Ctrl"
		}).
		when("/oldUser4", {
			templateUrl: "ESale/Business/VirtualService/Phone/OldUser/pages/oldUser4.html",
			controller: "OldUser4Ctrl"
		}).
		when("/cbssBind", {
                templateUrl: "ESale/Mall/UI/pages/cbssBind.html",
                controller: 'cbssBindCtrl'
        }).
        when("/businessAcceptance", {
			templateUrl: "ESale/Business/VirtualService/Phone/Operation/pages/businessAcceptance.html",
			controller: "businessAcceptanceCtrl"
		}).
		when("/businessAcceptance_2", {
			templateUrl: "ESale/Business/VirtualService/Phone/Operation/pages/businessAcceptance_2.html",
			controller: "businessAcceptance2Ctrl"
		}).
		when("/callForward", {
			templateUrl: "ESale/Business/VirtualService/Phone/Operation/pages/callForward.html",
			controller: "callForwardCtrl"
		}).
		when("/personalInformation", {
			templateUrl: "ESale/Business/VirtualService/Phone/Operation/pages/personalInformation.html",
			controller: "businessAcceptance2Ctrl"
		}).
		when("/pointsFor", {
			templateUrl: "ESale/Business/VirtualService/Phone/Operation/pages/pointsFor.html",
			controller: "PointsForCtrl"
		}).
		when("/progressQuery", {
			templateUrl: "ESale/Business/VirtualService/Phone/Operation/pages/progressQuery.html",
			controller: "businessAcceptance2Ctrl"
		}).
		when("/servicePasswordChange", {
			templateUrl: "ESale/Business/VirtualService/Phone/Operation/pages/servicePasswordChange.html",
			controller: "servicePasswordChangeCtrl"
		}).
		when("/changePackage/:type", {
			templateUrl: "ESale/Business/VirtualService/Phone/Operation/pages/changePackage.html",
			controller: "changePackageCtrl"
		}).
		when("/changePackage2/:type", {
			templateUrl: "ESale/Business/VirtualService/Phone/Operation/pages/changePackage2.html",
			controller: "changePackage2Ctrl"
		}).
		when("/changePackage_net", {
			templateUrl: "ESale/Business/VirtualService/Phone/Operation/pages/changePackage_net.html",
			controller: "changePackage_netCtrl"
		}).
		when("/changePackage3", {
			templateUrl: "ESale/Business/VirtualService/Phone/Operation/pages/changePackage3.html",
			controller: "changePackage3Ctrl"
		}).
		otherwise({
			redirectTo: "/home"
		});
	}
]);

/**
 * http请求服务
 * 要使用该服务必须依赖该服务
 */
app.service('$srhttp', ['$http', '$location',
	function($http) {
		var service = {
			/**
			 * 向URL发送GET
			 * @param url
			 * @param params
			 * @param callback
			 * @param opt
			 */
			get: function(url, params, callback, opt) {
				opt = opt || {};
				opt["method"] = "GET";
				this.request(url, params, callback, opt);
			},

			/**
			 * 向URL发送POST
			 * @param url
			 * @param params
			 * @param callback
			 * @param opt
			 */
			post: function(url, params, callback, opt) {
				opt = opt || {};
				opt["method"] = "POST";
				this.request(url, $.param(params), callback, opt);
			},
			/**
			 * request请求方法
			 * @param url 请求地址
			 * @param params 请求参数
			 * @param callback 回调函数
			 * @param opt 其他配置 method-[GET,POST]，mask-[true,false]，mask_msg - [string]
			 */
			request: function(url, params, callback, opt) {
				console.log("正在请求后台：" + url);
				var p = $.extend({}, {
					method: "GET",
					mask_msg: '正在加载...'
				}, opt);
				if (p.mask == undefined || p.mask)
				//rdcp.mask($(document.body), p["mask_msg"]);
					mask(p["mask_msg"]);
				if (p.method == "POST") {
					var config = {
						url: APP_CONFIG.SERVER_URL + url,
						method: p.method,
						data: params,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
						},
						transformResponse: appendTransform($http.defaults.transformResponse, function(value) {
							try {
								//进行unescape处理
								var valueStr = JSON.stringify(value);
								console.log(valueStr);
								value = JSON.parse(unescape(valueStr));
								return value;
							} catch (e) {
								console.error(e.message);
								return null;
							}
						})
					};
				} else {
					var config = {
						url: APP_CONFIG.SERVER_URL + url,
						method: p.method,
						params: params,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
						},
						transformResponse: appendTransform($http.defaults.transformResponse, function(value) {
							try {
								//进行unescape处理
								var valueStr = JSON.stringify(value);
								console.log(valueStr);
								value = JSON.parse(unescape(valueStr));
								return value;
							} catch (e) {
								console.error(e.message);
								return null;
							}
						})
					};
				}
				//返回转换
				function appendTransform(defaults, transform) {

					// We can't guarantee that the default transformation is an array
					defaults = angular.isArray(defaults) ? defaults : [defaults];

					// Append the new transformation to the defaults
					return defaults.concat(transform);
				}

				//http请求
				$http(config).
				success(function(data, status, headers, config) {
					console.log(data);
					if (p.mask == undefined || p.mask)
						unmask();

					//rdcp.unmask($(document.body), p["mask_msg"]);
					//成功回调
					if (callback) {
						callback(data);
					}
				}).
				error(function(data, status, headers, config) {
					console.log(data);
					//if (p.mask == undefined || p.mask)
					unmask();
					//rdcp.unmask($(document.body), p["mask_msg"]);
					//错误回调
					if (callback) {
						callback(data);
					}
				});
			}
		};
		return service;
	}
]);

//包含文件控制器
app.controller('IncludeController', ['$scope',
	function($scope) {
		$scope.template = {
			base: 'System/Base/pages/base.html',
			rwcard: 'ESale/Business/VirtualService/Phone/SimCard/pages/rwcard.html',
			footer: 'System/Base/pages/nav.html',
			header: 'System/Base/pages/header.html'
		};
	}
]);