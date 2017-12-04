/**
 * Created by sea on 2015/8/4.
 */

var imgData = {
	"front": '',
	'contrary': '',
	'writeCard': '',
	'hand': '',
	'ckPic': ''
};
app.registerCtrl("YSBinputlistCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		$rootScope.appTitle = "移网开户";
		//提交订单所需信息
		$scope.orderList = {
				num: "", //开户号码
				pinPaiId: "", //运营商品牌id
				pinPaiName: "", //运营商
				areaId: "", //区域ID
				areaName: "", //归属地
				netId: "", //开户网络ID
				netName: "", //网络
				openAccountTypeId: "", //开户类型id
				openAccountTypeName: "", //开户类型
				packagetypeid: "", //套餐类型
				packagePlanId: "", //套餐计划id
				businessId: "",
				ckNum: "", //成卡卡号
				packageid: "", //套餐资费id
				firstMonthFeeName: "", //首月资费
				firstMonthFee: "", //首月资费id
				policyName: "", //政策名称
				iemiNum: "", //终端串号
				phoneBrand: "", //手机品牌
				phoneModel: "", //手机型号
				policyEventId: "", //活动id
				policyEvent: "", //活动名称
				contract: "", //合约期
				contractPackage: "", //(合约)套餐
				contractPlanId: "", //(合约)套餐计划id
				contractPlan: "", //(合约)套餐计划
				packageType: "", //套餐类型
				packageName: "", //套餐
				packagePlan: "", //套餐计划
				customName: "", //客户姓名
				contractLast: "", //套餐项目(套餐业务类型三选一)
				jmkfStatus: "0", //SIM是否减免是
				policyId: "", //政策ID
				policyType: "", //政策类型
				terminalId: "",
				contractId: "",
				terminalGoodId: "",
				peroids: "",
				bid: "",
				goodId: "", //商品编号
				frontPicId: "", //身份证正面照片
				backPicId: "", //身份证反面照片
				handPicId: "", //身份证凭证图片
				ckPicId: "", //成卡照片id
				policyId_4G: "", //4G政策id
				policyName_4G: "", //4G政策类型
				surefee: "",

				//身份证信息
				certNum: "", //身份证号码
				sex: "", //性别
				certTypeId: "", //证件ID
				certType: "", //证件类型
				certValidFrom: "", //有效期开始时间
				certValidTo: "", //有效期结束时间
				issuing: "", //签发机关
				certAddress: "", //证件地址
				contactPhoneNum: "", //联系号码
				postalAddress: "", //联系地址
				note: "" //备注
			}
			//$scope.hidenext = function(now){
			//    $(now).parent().nextAll().hide();
			//}

		$("#pinPaiLayoutDiv").siblings().hide(); //隐藏所有元素
		//加载后，发送广播，让第一个div可见
		setTimeout(function() {
			$scope.$broadcast("pinPaiLayoutCtrl", 1);
		}, 100);
		//下一页
		$scope.next = function() {
			$scope.orderList.surefee = $("#feeTotal").text();
			$scope.orderList.ckPicId = imgData.ckPic;
			//Local.saveStoreJson("orderList", $scope.orderList);//保存第一页的所有数据到local

			Local.saveStoreJson("orderList", $scope.orderList);
			location.href = "#/YSBinputlist2"; //跳转到第二页

		}
	}
]);
//品牌选择
app.registerCtrl("pinPaiLayoutCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载品牌数据
		$scope.loadMessage = function() {
			$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_BRAND_LIST", {}, function(data) {
				if (data.header.code == 0) {
					$scope.row1 = data.body.rows;
					//模拟点击中国联通+
					setTimeout(function() {
						$scope.$apply(function() {
							var id = 0;
							//如果只有一个品牌，则默认选中
							if ($scope.row1.length == 1) {
								id = 0;
							} else {
								for (var i = 0; i < $scope.row1.length; i++) {
									if ($scope.row1[i].ID == 'CU') {
										id = i;
										break;
									}
								}
							}
							$scope.pinpai_select(id);
						});
					}, 100);
				}
			});
		}

		//品牌选择
		$scope.pinpai_select = function(id) {
				$("#pinPaiLayoutDiv").nextAll().hide();
				$("#pinPaiLayoutDiv").next().show();
				var a = $("#pinpai_select_id_" + (id));
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
				$scope.orderList.pinPaiId = $(a).attr("pinpaiid"); //存储品牌ID
				$scope.orderList.pinPaiName = $(a).text(); //存储品牌名称(运营商)
				//发送广播
				$rootScope.$broadcast("areaLayoutCtrl", 1);

			}
			//接收广播
		$scope.$on('pinPaiLayoutCtrl', function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				$("#pinPaiLayoutDiv").show();
			} else {
				$("#pinPaiLayoutDiv").nextAll().hide();
			}
		});
	}
]);

//区域选择
app.registerCtrl("areaLayoutCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载区域数据
		$scope.loadMessage = function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_AREA_LIST", {
					"brand_id": $scope.orderList.pinPaiId
				}, function(data) {
					if (data.body.rows.length <= 0) {
						alert("提示", "抱歉，当前没有可开户的号码");
						$rootScope.$broadcast("areaLayoutCtrl", 0);
						return;
					}
					if (data.header.code == 0) {
						$scope.row2 = data.body.rows;
						//如果只有一个，则默认点击第一个
						if ($scope.row2.length == 1) {
							setTimeout(function() {
								$scope.area_select(0);
							}, 100);
						}
					}
				});
			}
			//区域选择
		$scope.area_select = function(id) {
				$("#areaLayoutDiv").nextAll().hide();
				$("#areaLayoutDiv").next().show();
				var a = $("#area_select_id_" + (id));
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
				$scope.orderList.areaId = $(a).attr("areaid"); //存储区域ID
				$scope.orderList.areaName = $(a).text(); //存储区域名称(中文+)
				//发送广播
				$rootScope.$broadcast("netLayoutCtrl", 1);
			}
			//接收广播
		$scope.$on('areaLayoutCtrl', function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				$("#pinPaiLayoutDiv").show();
			} else {
				$("#pinPaiLayoutDiv").nextAll().hide();
			}
		});
	}
]);
//开卡网络
app.registerCtrl("netLayoutCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载开卡网络数据

		$scope.loadMessage = function() {
			$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_NETWORK_LIST", {
				"brand_id": $scope.orderList.pinPaiId
			}, function(data) {
				if (data.header.code == 0) {
					//开户网络这里做特殊处理(未完成)
					$scope.row3 = data.body.rows;

				}
			});
		}


		//开卡网络选择
		$scope.netLayoutDiv_select = function(id) {

				$("#netLayoutDiv").nextAll().hide();
				$("#netLayoutDiv").next().show();
				var a = $("#netLayoutDiv_select_id_" + (id));
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
				$scope.orderList.netId = $(a).attr("netid");
				$scope.orderList.netName = $(a).text(); //存储开卡网络名称(中文+)
				//发送广播
				$rootScope.$broadcast("openAccountTypeCtrl", 1);
			}
			//接收广播
		$scope.$on('netLayoutCtrl', function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
			} else {}
		});
	}
]);
//开卡类型
app.registerCtrl("openAccountTypeCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载开卡类型数据

		$scope.loadMessage = function() {
			$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/common/Q_PACKAGE_CONFIG_ACCOUNT_TYPE", {
				netWork: $scope.orderList.netId
			}, function(data) {
				if (data.header.code == 0) {
					$scope.row4 = data.body.rows;
				}
			});
		}


		//开卡类型选择
		$scope.accountType_select = function(id) {
				var a = $("#accountType_select_id_" + (id));
				$scope.orderList.openAccountTypeId = a.attr("code");
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");


				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/common/Q_PACKAGE_CONFIG_BUSINESS", {
					"netWork": $scope.orderList.netId,
					"orderType": $scope.orderList.openAccountTypeId
				}, function(data) {
					$scope.orderList.bid = data.body.rows[0].BUSINESS_ID;
					$scope.orderList.businessId = data.body.rows[0].BUSINESS_ID;
				});


				//发送广播(判断是白卡还是成卡)
				//如果是成卡，进入成卡信息输入区域
				$scope.orderList.openAccountType = $(a).attr("code");
				$scope.orderList.openAccountTypeName = $(a).text(); //存储开卡类型名称(中文+)
				if ($(a).attr("code").indexOf("CARD") >= 0) {
					$rootScope.$broadcast("ckCtrl", 1);
				} else if ($(a).attr("code").indexOf("WHITE") >= 0 || $(a).attr("code").indexOf("JH") >= 0) {
					$("#openAccountTypeLayoutDiv").nextAll().hide();
					if ($scope.orderList.openAccountType.indexOf("CONTRACT") >= 0) {
						$rootScope.$broadcast("policyCtrl", 1);
					} else {
						$rootScope.$broadcast("packageTypeCtrl", 1);
					}
				} else {
					$("#policyLayoutDiv").hide();
				}
			}
			//接收广播
		$scope.$on('openAccountTypeCtrl', function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				setTimeout(function() {
					$("#CONTAINER").scrollTop(999);
				}, 200);
			}
		});
	}
]);
//成卡信息
app.registerCtrl("ckCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//蓝牙读取
		$scope.ckCardConfirm = function() {
				ckCard();
			}
			//成卡确定
		$scope.ckNumConfirm = function() {
			$scope.orderList.ckNum = $("#ckNum").val();

			if ($("#ckNum").val() == undefined || $("#ckNum").val() == "") {
				alert("提示", "请输入成卡卡号");
			} else {
				if ($scope.orderList.openAccountType.indexOf("CONTRACT") >= 0) {
					//发送广播
					$rootScope.$broadcast("policyCtrl", 1);
					setTimeout(function() {
						$("#CONTAINER").scrollTop(999);
					}, 100);
				} else {
					//发送广播
					$rootScope.$broadcast("packageTypeCtrl", 1);
				}
			}
		}

		//接收广播
		$scope.$on("ckCtrl", function(event, data) {
			if (data == 1) {
				$scope.ckNumTxt = "";
				$("#ckLayoutDiv").show();
				$("#ckLayoutDiv").nextAll().hide();
				$(".layout_secondbox").hide();
				setTimeout(function() {
					$("#CONTAINER").scrollTop(999);
				}, 100);
			}
		});
	}
]);
//政策选择
app.registerCtrl("policyCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载政策信息
		$scope.loadMessage = function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_POLICY_LIST", {
					"netWork": $scope.orderList.netId,
					"orderType": $scope.orderList.openAccountTypeId,
					"brand_id": $scope.orderList.pinPaiId
				}, function(data) {
					if (data.header.code == 0) {
						$scope.policyList = data.body.rows;
					}
				});
			}
			//政策选择
		$scope.policy_select = function(id) {
				var a = $("#policy_select_id_" + id);
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
				$scope.orderList.policyId = $(a).attr("policyId");
				$scope.orderList.policyType = $(a).attr("policyType");
				$scope.orderList.policyName = $(a).text(); //存储政策名称(中文+)
				$scope.orderList.businessId = $(a).attr("businessId");

				//发送广播
				if ($scope.orderList.policyType == 1) { //与手机有关的政策需要用手机串号获取合约期
					$rootScope.$broadcast("iemiCtrl", 1);
				} else if ($scope.orderList.policyType == 0) { //与手机无关的政策可以去获取活动
					$rootScope.$broadcast("policyEventCtrl", 1);
				}
			}
			//接收广播
		$scope.$on("policyCtrl", function(event, data) {
			if (data == 1) {
				$rootScope.$broadcast("ckCtrl", 0); //获得businessId
				$("#policyLayoutDiv").show();
				$("#policyLayoutDiv").nextAll().hide();
				$("#policyLayoutDiv").find(".layout_secondbox").hide();
				$scope.loadMessage();
				setTimeout(function() {
					$("#CONTAINER").scrollTop(999);
				}, 100);
			}
		});
	}
]);
//串号查询
app.registerCtrl("iemiCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//接收广播
		$scope.$on("iemiCtrl", function(event, data) {
			if (data == 1) {
				$scope.iemiNumTxt = "";
				$("#iemiLayoutDiv").show();
				$("#iemiLayoutDiv").nextAll().hide();
				/*$("#CONTAINER").scrollTop($("#iemiLayoutDiv").height());*/
				/*$("#policyLayoutDiv").nextAll().hide();*/
				/*$scope.loadMessage();*/
				setTimeout(function() {
					$("#CONTAINER").scrollTop(999);
				}, 100);
			} else {}
		});
		$scope.iemiConfirm = function() {
			$rootScope.$broadcast("terminalInfoCtrl", 1);
			$scope.orderList.iemiNum = $("#iemi").val();
		}
	}
]);
//手机信息
app.registerCtrl("terminalInfoCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载手机信息
		$scope.loadMessage = function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_TERMINAL_BY_SN_LIST", {
					"sn": $("#iemi").val()
				}, function(data) {

					if (data.body.rows.length > 0) {
						$scope.terminalInfo = data.body.rows[0];
						$scope.orderList.terminalId = $scope.terminalInfo.GOODID;
						$scope.orderList.phoneBrand = $scope.terminalInfo.BRANDNAME; //存储手机品牌(中文+)
						$scope.orderList.phoneModel = $scope.terminalInfo.GOODNAME; //存储手机型号(中文+)
						$("#terminalInfoLayoutDiv").show();
						$("#terminalInfoLayoutDiv").nextAll().hide();
						$rootScope.$broadcast("contractCtrl", 1);
					}
				});
			}
			//接收广播
		$scope.$on("terminalInfoCtrl", function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				setTimeout(function() {
					$("#CONTAINER").scrollTop(999);
				}, 100);
			}
		});
	}
]);

//与手机无关的政策可以去获取活动选择
app.registerCtrl("policyEventCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载活动信息
		$scope.loadMessage = function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_POLICYGOODS_LIST", {
					"policyid": $scope.orderList.policyId
				}, function(data) {
					if (data.body.rows.length <= 0) {
						alert("提示", "没有配置相应的活动");
						return;
					}
					if (data.header.code == 0) {
						$scope.policyEvent = data.body.rows;
						$("#policyEventLayoutDiv").show();
						$("#policyEventLayoutDiv").nextAll().hide();
						$("#policyLayoutDiv").nextAll().hide();
						$("#terminalInfoLayoutDiv").hide();
						$("#iemiLayoutDiv").hide();
						if ($scope.policyEvent.length == 1) {
							setTimeout(function() {
								$scope.policyEvent_select(0);
							}, 100);
						}
					}
				});
			}
			//活动选择
		$scope.policyEvent_select = function(id) {
				var a = $("#policyEvent_select_id_" + id);
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
				$scope.orderList.terminalId = $(a).attr("contractId");
				$scope.orderList.policyEvent = $(a).text();
				$scope.orderList.policyId_4G = $(a).attr("contractId");
				$scope.orderList.policyName_4G = $(a).text();
				//发送广播
				$rootScope.$broadcast("contractCtrl", 1);
			}
			//接收广播
		$scope.$on("policyEventCtrl", function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				setTimeout(function() {
					$("#CONTAINER").scrollTop(999);
				}, 100);
			}
		});
	}
]);
//合约期选择
app.registerCtrl("contractCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载合约期信息
		$scope.loadMessage = function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_PERIODS_BY_POLICY", {
					"area_id": $scope.orderList.areaId,
					"policyid": $scope.orderList.policyId,
					"terminalId": $scope.orderList.terminalId
				}, function(data) {
					if (data.body.rows.length <= 0) {
						ysb_alert("提升", "该终端商品[" + $scope.orderList.policyName + "]政策下没有配置相应的套餐计划");
						return;
					}
					if (data.header.code == 0) {
						$scope.contract = data.body.rows;
						$("#contractLayoutDiv").show();
						$("#contractLayoutDiv").nextAll().hide();
						if ($scope.contract.length == 1) {
							setTimeout(function() {
								$scope.contract_select(0);
							}, 100);
						}
					}
				});
			}
			//合约期选择
		$scope.contract_select = function(id) {
				var a = $("#contract_select_id_" + id);
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
				$scope.orderList.periods = $(a).attr("periods");
				$scope.orderList.contractId = $(a).attr("contract_id");
				$scope.orderList.contract = $(a).text(); //存储合约期
				//发送广播
				$rootScope.$broadcast("contractPackageCtrl", 1);
			}
			//接收广播
		$scope.$on("contractCtrl", function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				setTimeout(function() {
					$("#CONTAINER").scrollTop(999);
				}, 100);
			}
		});
	}
]);

//合约套餐选择
app.registerCtrl("contractPackageCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载合约套餐信息
		$scope.loadMessage = function() {
				var param = {
					"area_id": $scope.orderList.areaId,
					"policyid": $scope.orderList.policyId,
					"terminalId": $scope.orderList.terminalId,
					"contract_id": $scope.orderList.contractId,
					"peroids": $scope.orderList.periods
				};
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_CONTRACT_BY_PERIODS", param, function(data) {
					if (data.header.code == 0) {
						$scope.contractPackage = data.body.rows;
						if ($scope.contractPackage.length == 1) {
							setTimeout(function() {
								$scope.contractPackage_select(0);
							}, 100);
						}
					}
				});
			}
			//合约套餐选择
		$scope.contractPackage_select = function(id) {
				var a = $("#contractPackage_select_id_" + id);
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
				$scope.orderList.contractPlanId = $(a).attr("packageid");
				$scope.orderList.policyEventId = $(a).attr("contractpackagegoodid");
				$scope.orderList.contractPackage = $(a).text(); //存储合约套餐

				//发送广播
				$rootScope.$broadcast("contractDetailCtrl", 1); //合约明细
				$rootScope.$broadcast("contractPlanCtrl", 1); //合约套餐计划


			}
			//接收广播
		$scope.$on("contractPackageCtrl", function(event, data) {
			if (data == 1) {
				$("#contractPackageLayoutDiv").show();
				$("#contractPackageLayoutDiv").nextAll().hide();
				$scope.loadMessage();
				setTimeout(function() {
					$("#CONTAINER").scrollTop(999);
				}, 100);
			}
		});
	}
]);
//合约明细
app.registerCtrl("contractDetailCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载合约套餐信息
		$scope.loadMessage = function() {
				var param = {
					"terminalId": $scope.orderList.terminalId,
					"contract_id": $scope.orderList.contractId,
					"peroids": $scope.orderList.periods
				};
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_CONTRACT_LIST", param, function(data) {
					if (data.header.code == 0) {
						$scope.contractDetail = data.body.rows;
					}
				});
			}
			//接收广播
		$scope.$on("contractDetailCtrl", function(event, data) {
			if (data == 1) {
				$("#contractDetailLayoutDiv").show();
				$("#contractDetailLayoutDiv").nextAll().hide();
				$scope.loadMessage();
				setTimeout(function() {
					$("#CONTAINER").scrollTop(999);
				}, 200);
			}
		});
	}
]);
//
//合约套餐计划列表
app.registerCtrl("contractPlanCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载合约套餐计划列表
		$scope.loadMessage = function() {
			$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_DINNER_PLAN_BY_PID", {
				"package_id": $scope.orderList.contractPlanId
			}, function(data) {
				if (data.header.code == 0) {
					$scope.contractPlan = data.body.rows;
				}
				if ($scope.contractPlan.length == 1) {
					autoSelect("#contractPlanLayoutDiv");
					$scope.orderList.contractPlanId = $scope.contractPlan[0].CODE;
					$scope.orderList.contractPlan = $scope.contractPlan[0].NAME;
					if ($scope.orderList.businessId.indexOf("CUNFEISONGYEWU") >= 0) {
						$rootScope.$broadcast("contractTableCtrl", 0); //合约套餐列表
						$rootScope.$broadcast("contractLastCtrl", 1); //套餐业务三选一
					} else {
						$rootScope.$broadcast("contractTableCtrl", 1); //合约套餐列表
					}
				}
			});
		}
		$scope.contractPlan_select = function(id) {
				var a = $("#contractPlan_select_id_" + id);
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
				$scope.orderList.contractPlanId = $(a).attr("contractPlan_id");
				$scope.orderList.contractPlan = $(a).text();
				if ($scope.orderList.businessId.indexOf("CUNFEISONGYEWU") >= 0) {
					$rootScope.$broadcast("contractTableCtrl", 0); //合约套餐列表
					$rootScope.$broadcast("contractLastCtrl", 1); //套餐业务三选一
				} else {
					$rootScope.$broadcast("contractTableCtrl", 1); //合约套餐列表
				}
			}
			//接收广播
		$scope.$on("contractPlanCtrl", function(event, data) {
			$("#contractPlanLayoutDiv").show();
			$("#contractPlanLayoutDiv").nextAll().hide();
			$scope.loadMessage();
			setTimeout(function() {
				$("#CONTAINER").scrollTop(9999);
			}, 400);
			if (data == 1) {
				$("#nav_bottom").show();
				$scope.orderList.contractLast = "";
			}
		});
	}
]);

//合约套餐列表
app.registerCtrl("contractTableCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载合约套餐信息
		$scope.loadMessage = function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_DINNER_DETAIL_LIST_N", {
					"package_id": $scope.orderList.contractPlanId
				}, function(data) {
					if (data.header.code == 0) {
						$scope.contractTable = data.body.rows;

					}
				});
			}
			//接收广播
		$scope.$on("contractTableCtrl", function(event, data) {
			$("#contractTableLayoutDiv").show();
			$("#contractTableLayoutDiv").nextAll().hide();
			$scope.loadMessage();
			setTimeout(function() {
				$("#CONTAINER").scrollTop(9999);
			}, 200);
			if (data == 1) {
				$("#nav_bottom").show();
				$scope.orderList.contractLast = "";
			} else {
				$("#nav_bottom").hide();
			}
		});
	}
]);
//套餐业务三选一
app.registerCtrl("contractLastCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		$scope.contractLast_select = function(id) {
				var a = $("#contractLast_select_id_" + id);
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
				$scope.orderList.contractLast = $(a).text();
				$("#nav_bottom").show();
				setTimeout(function() {
					$("#CONTAINER").scrollTop(9999);
				}, 100);
			}
			//接收广播
		$scope.$on("contractLastCtrl", function(event, data) {
			if (data == 1) {
				$("#contractLastLayoutDiv").show();
				setTimeout(function() {
					$("#CONTAINER").scrollTop(999);
				}, 100);
			} else {
				$("#contractLastLayoutDiv").hide();
			}
		});
	}
]);

//套餐类型
app.registerCtrl("packageTypeCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载套餐类型数据
		$scope.loadMessage = function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/Package/~query/packageTypeManage/Q_GET_PACKAGE_TYPE", {
					"netWork": $scope.orderList.netId
				}, function(data) {
					if (data.body.rows.length <= 0) {
						alert("[" + $scope.orderList.openAccountTypeName + "]无套餐明细，后续将会更新相关信息");
						$(".nav_bottom").show();
						return;
					}
					if (data.header.code == 0) {
						$scope.row6 = data.body.rows;
						if ($scope.row6.length == 1) {
							setTimeout(function() {
								$scope.packageType_select(0);
							}, 10);
						}
					}
				});
			}
			//套餐类型选择
		$scope.packageType_select = function(id) {
				var a = $("#packageType_select_id_" + (id));
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
				$scope.orderList.packagetypeid = a.attr("packagetypeid");
				$scope.orderList.packageType = $(a).text(); //存储套餐类型
				//发送广播(判断是否为自由组合套餐系列)
				if ($scope.orderList.packagetypeid.indexOf("GROUP") >= 0) {
					$rootScope.$broadcast("packageGroupCtrl", 1);
				} else {
					$rootScope.$broadcast("packageCtrl", 1);
				}
			}
			//接收广播
		$scope.$on("packageTypeCtrl", function(event, data) {
			if (data == 1) {
				$("#packageTypeLayoutDiv").show();
				$("#packageTypeLayoutDiv").nextAll().hide();
				$(".layout_secondbox").hide();
				$("#nav_bottom").hide();
				$scope.loadMessage();
				setTimeout(function() {
					$("#CONTAINER").scrollTop(999);
				}, 200);
			}
		});
	}
]);

//自由组合套餐系列
app.registerCtrl("packageGroupCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		$scope.groupOption = [];
		var index = 0;
		//加载数据
		$scope.loadMessage = function() {
			$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/common/Q_PACKAGE_CONFIG_MAIN", {
				"package_id": $scope.orderList.packagetypeid
			}, function(data) {
				if (data.header.code == 0) {
					$scope.group = data.body.rows;
					$scope.loadOption(index);
				}
			});
		}
		$scope.loadOption = function(index) {
				$scope.orderList.packageid = $scope.group[index].ID;
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/common/Q_PACKAGE_CONFIG_PLAN", {
					"package_id": $scope.orderList.packageid
				}, function(data) {
					if (data.header.code == 0) {
						$scope.groupOption[index] = data.body.rows;
						console.log($scope.groupOption[index].unshift({
							"FEE": 0,
							"NAME": "不需要"
						}));
						index = index + 1;
						console.log(index);
						if (index < $scope.group.length) {
							$scope.loadOption(index);
						}
						$("#packageGroupLayoutDiv").children().first().show(); //加载完成，显示流量包
					}
				});
			}
			//自由组合套餐选择
		$scope.packagegroup_select = function(groupId, id) {
				$("#nav_bottom").hide();
				var a = $("#packagegroup_select_" + groupId + "_" + id);
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
				$("#packageGroupTitleDiv_" + groupId).parent().nextAll().hide();
				$("#packageGroupTitleDiv_" + groupId).parent().next().show();
				$("#packageGroupTitleDiv_" + groupId).parent().next().find("a").removeClass("com_selectbtnon"); //移除所有选中效果

				//判断合计是否显示，显示则计算总金额，负责归零
				if (!$("#packageGroupTotalTitleDiv").is(":hidden")) {
					$scope.total = 0;
					$("#packageGroupLayoutDiv .com_selectbtnon").each(function() {
						$scope.total += parseInt($(this).attr("fee"));
					});
					$("#nav_bottom").show();
				}
				setTimeout(function() {
					$("#CONTAINER").scrollTop(999);
				}, 100);
			}
			//接收广播
		$scope.$on("packageGroupCtrl", function(event, data) {
			if (data == 1) {
				$("#packageGroupLayoutDiv").show();
				$("#packageGroupLayoutDiv").nextAll().hide();
				$(".layout_secondbox").hide();
				$("#nav_bottom").hide();
				$scope.loadMessage();
				setTimeout(function() {
					$("#CONTAINER").scrollTop(999);
				}, 200);
			}
			/*$("#packageGroupLayoutDiv").children().first().show();*/ //这么不可设置为可见，因为还没加载完
		});
	}
]);
//套餐资费
app.registerCtrl("packageCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载数据
		$scope.loadMessage = function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/Package/~query/packageTypeManage/Q_GET_PACKAGE", {
					"package_id": $scope.orderList.packagetypeid
				}, function(data) {
					if (data.body.rows.length <= 0) {
						alert("该[" + $scope.orderList.packageType + "]无套餐资费，请选择其他套餐");
						$scope.row7 = "{}";
						return;
					}
					if (data.header.code == 0) {
						$scope.row7 = data.body.rows;
						if ($scope.row7.length == 1) {
							setTimeout(function() {
								$scope.package_select(0);
							}, 100);
						}
					}
				});
			}
			//套餐资费选择
		$scope.package_select = function(id) {
				var a = $("#package_select_id_" + (id));
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
				$scope.orderList.packageid = $(a).attr("packageid");
				$scope.orderList.packageName = $(a).text(); //存储套餐资费

				//发送广播
				$rootScope.$broadcast("packagePlanCtrl", 1);
			}
			//接收广播
		$scope.$on("packageCtrl", function(event, data) {
			if (data == 1) {
				$("#packageLayoutDiv").show();
				$("#packageLayoutDiv").prev().hide();
				$("#packageLayoutDiv").nextAll().hide();
				$("#nav_bottom").hide();
				$scope.loadMessage();
				setTimeout(function() {
					$("#CONTAINER").scrollTop(999);
				}, 200);
			}
		});
	}
]);
//套餐计划
app.registerCtrl("packagePlanCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载数据
		$scope.loadMessage = function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/common/Q_PACKAGE_CONFIG_PLAN", {
					"package_id": $scope.orderList.packageid
				}, function(data) {
					if (data.header.code == 0) {
						$scope.row8 = data.body.rows;
						if ($scope.row8.length == 1) {
							autoSelect("#packagePlanLayoutDiv");
							$scope.orderList.packagePlanId = $scope.row8[0].CODE;
							$scope.orderList.packagePlan = $scope.row8[0].NAME; //存储套餐计划
							//发送广播
							$rootScope.$broadcast("packageDetailCtrl", 1);
						}
					}
				});
			}
			//套餐计划选择
		$scope.packagePlan_select = function(id) {
				var a = $("#packagePlan_select_id_" + (id));
				$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
				$scope.orderList.packagePlanId = $(a).attr("packageplanid");
				$scope.orderList.packagePlan = $(a).text(); //存储套餐计划
				//发送广播
				$rootScope.$broadcast("packageDetailCtrl", 1);
			}
			//接收广播
		$scope.$on("packagePlanCtrl", function(event, data) {
			if (data == 1) {
				$("#packagePlanLayoutDiv").show();
				$("#packagePlanLayoutDiv").nextAll().hide();
				$("#nav_bottom").hide();
				$scope.loadMessage();
				setTimeout(function() {
					$("#CONTAINER").scrollTop(999);
				}, 100);
			}
		});
	}
]);

//套餐明细
app.registerCtrl("packageDetailCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		//加载数据
		$scope.loadMessage = function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_DINNER_DETAIL_LIST_N", {
					"package_id": $scope.orderList.packagePlanId
				}, function(data) {
					if (data.body.rows.length <= 0) {
						alert("[" + $scope.orderList.packageName + "]无套餐明细，后续将会更新相关信息");
						//发送广播
						$rootScope.$broadcast("packageDetailCtrl", 0);
						return;
					} else if (data.header.code == 0) {
						$scope.row9 = data.body.rows;
					}
				});
				$(".nav_bottom").show();
			}
			//接收广播
		$scope.$on("packageDetailCtrl", function(event, data) {
			if (data == 1) {
				$scope.loadMessage();
				$("#packageDetailDiv").show();
				$("#nav_bottom").show();
				setTimeout(function() {
					$("#CONTAINER").scrollTop(999);
				}, 100);
			} else {
				$("#packageDetailDiv").hide();
				$("#nav_bottom").show();
			}
		});
	}
]);

/**
 * 图片上传(copy别人的)
 * @param selectBtn 那个按钮本身
 * copy by SevenCloud 2015年4月21日 15:10:14
 */
function uploadImg(id) {

	var p = {
		'busiId': 'Account',
		'busiType': 'APP',
		'size': '1000'
	};
	rdcp.mobileUpload({
		id: id,
		form: p, //上传时参数 提交到后台的参数
		url: '!service/file/~java/Uploader.upload',
		fileSelected: function(data) { //文件选择后触发
			$('#progressBar').css("width", "0%");
			document.getElementById('progressBar').innerHTML = '0%'; //
			//用fileReader请看网上详解 这里这是用于图片预览效果
			var reader = new FileReader();
			reader.onload = function(e) {}
			reader.readAsDataURL(data.file); //本地读取文件 可以实现预览效果的
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
			$("#" + id).parent().css("background", "url('" + response.thumbURL + "')");
			$("#ckPicId").val(imgData[id]);
		}
	});
}

/*
 * 读卡号填写在成卡框
 */

function ckCard() {
	/*if (/ipad|iphone|mac/i.test(navigator.userAgent)) {*/
	var callback = function(msg){
		if(msg == "") {
			check();
		}else{
			ysb_shade("蓝牙二合一设备正在读取中，请稍后……");
			setTimeout(Reader.ReadCardNo(), 80);
		}
	}
	makecard.isHaveBluetooth(callback,callback,[]);

	/*} else {
		mask("蓝牙二合一设备正在读取中，请稍后……");
		setTimeout("Reader.ReadCardNo()", 80);
	}*/
}

function onReadCardFinish(Card) {
	if (Card == -3) {
		//alert("连接阅读器失败");
		$("#alertBox_bluetooth").show();
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
			$("#ckNum").val(cardNum);
		} else {
			unmask();
			var cardNum = Card.substr(0, 20);
			//var cardNum=dealCardNum(cardRet);
			if (cardNum.length != "20") {
				alert("提示", "读出卡号有问题，请重试或者人工输入");
				return false;
			}
			cardNum = cardNum.substr(0, 19);
			$("#ckNum").val(cardNum);
		}
		return true;
	} else {
		unmask();
		alert(Card);
		return false;
	}
}

function dealCardNum(cardStr) {
	var cardLength = cardStr.length;
	var cardNum = "";
	for (var i = 0; i < cardLength; i++) {
		if (i % 2 == 0) {
			cardNum += cardStr.charAt(i + 1);
		} else {
			cardNum += cardStr.charAt(i - 1);
		}
	}
	return cardNum;
}

//使用系统自带的照相功能上传图片
function takePhoto(type) {
	$('#progressBar').css("width", "0%").empty().append('0%');
	var sessionId = Local.getStoreJson(sys.loginKey).body.sessionId; //会话id
	TakePhoneUpload("{'busiId':'Account','busiType':'APP','size':1000,'_param':'" + type + "','SESSIONID':'" + sessionId + "'}", "print");
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

//自动选择
function autoSelect(id) {
	$(id).attr("style", "display:none");
}