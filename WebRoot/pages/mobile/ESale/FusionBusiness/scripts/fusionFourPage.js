/**
 * Created by Administrator on 2015/7/20.
 */
var fusionFour = {}
var fusionParam;
app.registerCtrl("fusionFourPageCtrl", ["$rootScope", '$srhttp', '$scope', '$routeParams',
	function(root, $rdcp, $scope, $routeParams) {

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		//console.info(Local.getStoreJson("fusionParam"));
		fusionParam = Local.getStoreJson("fusionParam");
		fusionParam.networkType = "";
		fusionParam.phoneType = "";
		fusionParam.iptvType = "";
		fusionParam.cardID = "";
		fusionParam.name = "";
		fusionParam.cardAddr = "";
		fusionParam.issuedAt = "";
		fusionParam.sex = "";
		fusionParam.cardNo = "";
		fusionParam.effectedDate = "";
		fusionParam.expiredDate = "";
		fusionParam.front = "";
		fusionParam.contrary = "";

		fusionParam.kd_tiaoce = "";
		fusionParam.kd_gongliao = "";
		fusionParam.kd_shouxu = "";
		fusionParam.gh_tiaoce = "";
		fusionParam.gh_gongliao = "";
		fusionParam.gh_shouxu = "";

		fusionParam.iptv_type = "";
		fusionParam.kd_fs = "";
		fusionParam.kd_type = "";
		fusionParam.terminal_fee = "";
		fusionParam.iptv_fee = "";
		Local.saveStoreJson("fusionParam", "");

		root.appTitle = "融合业务";
		fusionFour.request = $rdcp.request;
		fusionFour.scope = $scope;

		//点击事件处理
		$scope.networkChange = function(id, name) {
			networkChange(id, name);
		};
		$scope.changeBtn2 = function(one) {
			changeBtn2(one);
		};
		$scope.onTypeSelect = function(id, payID, name) {
			isSelect(id);
			onTypeSelect(payID, name);
		};
		$scope.onBankSelect = function(id, bank2, name) {
			isSelect(id);
			onBankSelect(bank2, name);
		};
		$scope.onSuperSelect = function(id, bankID, name) {
			isSelect(id);
			onSuperSelect(bankID, name);
		};
		$scope.onModeSelect = function(id, terminalID, name) {
			isSelect(id);
			onModeSelect(terminalID, name);
		};
		$scope.onKDTypeSelect = function(id, typeID, name) {
			isSelect(id);
			onKDTypeSelect(typeID, name);
		};
		$scope.onIPTVTypeSelect = function(id, typeID, name) {
			isSelect(id);
			onIPTVTypeSelect(typeID, name);
		};
		$scope.onIPTVSelect = function(id, iptvID, name) {
			isCheck(id); //复选框效果
			onIPTVSelect(iptvID, name, true);
		};
		$scope.blueToothRead = function() { //读取身份证信息
			bluetoothRead();
		};
		$scope.changeBtn = function() {
			changeBtn();
		};
		$scope.onSpeedSelect = function(id, feelId, name) { //宽带速率选择
				isSelect(id);
				fusionParam.kd_speed_id = feelId;
				fusionParam.kd_speed = name;
				//获取宽带、固话信息
				getKDXX(getGHXX(function() {
					if (fusionParam.is_gx == "") {
						$("#guhua_info, #select_guhua").hide();
						$("#guhua_num").parent().parent().hide();
						$("#gh_fee").parent().parent().hide();
					}

					//不需要预存款（保留）
					$("#yw_fee").parent().parent().hide();
					$("#gh_fee").parent().parent().hide();
					$("#kd_fee").parent().parent().hide();
					//不需要预存款（保留）


					//初始化终端提供方式选择
					var datas = [{
						id: "0",
						name: "用户自备"
					}, {
						id: "1",
						name: "终端租用-高档资费"
					}, {
						id: "2",
						name: "免费使用"
					}, {
						id: "3",
						name: "终端销售-高档资费"
					}, {
						id: "5",
						name: "终端租用-中档资费"
					}, {
						id: "6",
						name: "终端租用-低档资费"
					}, {
						id: "7",
						name: "终端销售-中档资费"
					}, {
						id: "8",
						name: "终端销售-低档资费"
					}];
					$scope.broadbandAttrData = datas;
					$("#select_kd_fs").show();
					//loadJSONSelect("#select_kd_fs", datas, 2, "onKDTypeSelect", ["id", "name"]);
					//初始化终端类型选择
					var data = [{
						id: "A001",
						name: "ONU终端"
					}, {
						id: "A002",
						name: "家庭网关"
					}, {
						id: "A003",
						name: "ADSL_MODEM"
					}, {
						id: "A006",
						name: "CABLE MODEM"
					}, {
						id: "A009",
						name: "VDSL终端"
					}];
					//loadJSONSelect("#select_kd_type", datas, 2, "onModeSelect", ["id", "name"]);
					$scope.terminalData = data;
					$("#select_kd_type").show();

					//获取IPTV信息
					getIPTV(function() {
						if (fusionParam.iptv_items.length > 0) {
							$("#select_iptvinfo,#select_iptv").show();
							$scope.iptv_itemsData = fusionParam.iptv_items;
							//loadJSONSelect("#select_iptv", openAmalgData.iptv_items, 1, "onIPTVSelect", ["id", "IPTV_FEE"]);
						} else {
							$("#select_iptvinfo, #select_iptv").hide();
						}
						//获取增加、减免资费项
						getFeeItem(function() {
							//全部数据加载完成
							$("#detail_address").val(fusionParam.address);
							var payTypeData = [{
								id: "0",
								name: "现金"
							}, {
								id: "3",
								name: "托收"
							}];
							$scope.payTypeData = payTypeData;
							$("#select_type").show();
							fusionParam.pay_id = "";
							$("#kuandai_info, #select_kg, #select_card, #select_type,#threePage").show();
						});
					});
				}));
			}
			//IPTV选择

		function onIPTVSelect(id, name, checked) {
			console.log(id + "" + name + "" + checked);
			if (name.indexOf("南方传媒标准1") != -1) {
				if (checked) { //----------------
					//初始化终端提供方式选择
					var datas = [{
						id: "0",
						name: "用户自备"
					}, {
						id: "1",
						name: "终端租用-高档资费"
					}, {
						id: "2",
						name: "免费使用"
					}, {
						id: "3",
						name: "终端销售-高档资费"
					}, {
						id: "5",
						name: "终端租用-中档资费"
					}, {
						id: "6",
						name: "终端租用-低档资费"
					}, {
						id: "7",
						name: "终端销售-中档资费"
					}, {
						id: "8",
						name: "终端销售-低档资费"
					}];
					$scope.iptvtypeData = datas;
					$("#select_iptvtype").show("normal");
					//loadJSONSelect("#select_iptvtype", datas, 2, "onIPTVTypeSelect", ["id", "name"]);
				} else {
					$("#select_iptvtype").hide("normal");
					fusionParam.iptv_type = "";
				}
			}
		}

		//互联网电视终端提供方式选择
		function onIPTVTypeSelect(id, name) {
			fusionParam.iptv_type = id;
			console.log("互联网电视终端提供方式:" + id + "   " + name);
			if (name != "用户自备" && name != "免费使用") {
				$("#iptv_terminal").parent().parent().show();
			} else {
				$("#iptv_terminal").parent().parent().hide();
			}
		}

		//宽带终端提供方式选择
		function onKDTypeSelect(id, name) {
			fusionParam.kd_fs = id;
			console.log("提供方式id为:" + fusionParam.kd_fs);
			console.log("提供方式name为:" + name);
			if (name != "用户自备" && name != "免费使用" && name != "") {
				if (fusionParam.kd_type == "A001" && fusionParam.kd_type != "") {
					$("#kd_terminal").parent().parent().show();
					return;
				}
			}
			$("#kd_terminal").parent().parent().hide();
		}

		//宽带终端类型选择
		function onModeSelect(id, name) {
			fusionParam.kd_type = id;
			console.log("终端类型id为：" + fusionParam.kd_type);
			if (fusionParam.kd_fs != "0" && fusionParam.kd_fs != "2" && fusionParam.kd_fs != "") {
				if (name == "ONU终端") {
					$("#kd_terminal").parent().parent().show();
					return;
				} else {
					console.log("不是ONU终端");
				}
			}
			$("#kd_terminal").parent().parent().hide();
		}

		//上级银行选择
		function onSuperSelect(id, name) {
			fusionParam.bank_info.super_bank_code = id;
			changeBtn2();
		}

		//银行选择
		function onBankSelect(id, name) {
			fusionParam.bank_info.bank_code = id;
			fusionParam.bank_info.bank = name;
			$("#select_bankinfo").show("normal");
		}

		//换一组银行
		function changeBtn2(one) {
			if (one) {
				$("#pageIndex2").val("1");
			}
			var title = $.trim($("#search_name2").val());
			var params = {
				pageSize: "10",
				title: title,
				page: $("#pageIndex2").val(),
				code: fusionParam.bank_info.super_bank_code
			};
			$("#select_bankinfo").hide();
			$("#select_bank").show();
			//loadSelect("#select_bank", "!ESale/Mobile/Business/VirtualService/Phone/Amalgamation/~query/Q_BANK_LIST",params
			//    ,"找不到可选的银行",1,"onBankSelect", ["CODE", "BANK"], onLoadCall2);
			$rdcp.request(
				"!ESale/Mobile/Business/VirtualService/Phone/Amalgamation/~query/Q_BANK_LIST", //url
				params, //parms
				function(data) {
					if (data.header && data.header.code == 0) {
						onLoadCall2(data);
						var rows = data.body.rows;
						if (rows.length == 0) {
							alert("温馨提示", "找不到可选的银行");
							return;
						}
						$scope.bankSelectData2 = rows;
					} else {
						alert("错误", "加载数据出错！");
					}
				});
		}

		//加载后回调
		function onLoadCall2(data) {
			var page = parseInt(data.body.page);
			var count = parseInt(data.body.pageCount);
			if (count > 1) {
				$("#change_ele2").show();
			} else {
				$("#change_ele2").hide();
			}
			if (page >= count)
				page = 1;
			else
				page++;
			$("#pageIndex2").val(page);
		}

		//支付方式选择
		function onTypeSelect(id, name) {
			fusionParam.bank_info = {};
			fusionParam.bank_info.pay_mode_code = id;
			fusionParam.pay_name = name;
			if (name == "托收") {
				changeBtn();
			} else {
				$("#select_super, #select_bank, #select_bankinfo").hide();
			}
		}

		//换一组上级银行
		function changeBtn() {
			var params = {
				pageSize: "16",
				page: $("#pageIndex").val()
			};
			$("#select_bank, #select_bankinfo").hide();
			$("#select_super").show();
			//loadSelect("#select_super", "!ESale/Mobile/Business/VirtualService/Phone/Amalgamation/~query/Q_SPER_BANK",params
			//    ,"找不到可选的上级银行",2,"onSuperSelect", ["CODE", "NAME"], onLoadCall);
			$rdcp.request(
				"!ESale/Mobile/Business/VirtualService/Phone/Amalgamation/~query/Q_SPER_BANK", //url
				params, //parms
				function(data) {
					if (data.header && data.header.code == 0) {
						onLoadCall(data);
						var rows = data.body.rows;
						if (rows.length == 0) {
							alert("温馨提示", "找不到可选的上级银行");
							return;
						}
						$scope.bankSelectData = rows;
					} else {
						alert("错误", "加载数据出错！");
					}
				});
		}

		//加载后回调
		function onLoadCall(data) {
			var page = parseInt(data.body.page);
			var count = parseInt(data.body.pageCount);
			if (count > 1) {
				$("#change_ele").show();
			} else {
				$("#change_ele").hide();
			}
			if (page >= count)
				page = 1;
			else
				page++;
			$("#pageIndex").val(page);
		}


		//链接后台获取数据
		loadTariff();
		//加载融合套餐资费
		function loadTariff() {
			$rdcp.request(
				"!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_RH_FEE", //url
				{
					id: fusionParam.id
				}, //parms
				function(data) {
					//console.info("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_RH_FEE" + "?id=" + fusionParam.id);
					if (data.header && data.header.code == 0) {
						var rows = data.body.rows;
						if (rows.length == 0) {
							alert("温馨提示", "找不到可选的资费");
							$("#tariffDiv,#broadbandSpeedDiv").hide();
							return;
						}
						//fusionFour.fusionTariff = rows[0].NAME;//页面展示的资费
						$scope.fusionTariff = rows[0].NAME; //页面展示的资费
						fusionParam.rh_fee_id = rows[0].ID; //需提交的id数据
						onFeeSelect();
					} else {
						alert("错误", "加载数据出错！");
					}
				});
		}

		//加载宽带速率选择
		function onFeeSelect() {
			$rdcp.request(
				"!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_KD_PACKAGE", //url
				{
					id: fusionParam.id
				}, //parms
				function(data) {
					if (data.header && data.header.code == 0) {
						var rows = data.body.rows;
						if (rows.length == 0) {
							alert("温馨提示", "找不到相关的产品");
							return;
						}
						$scope.feeSelectData = rows;
					} else {
						alert("错误", "加载数据出错！");
					}
				});
		}

		//获取固话信息
		function getGHXX(fn) {
			$rdcp.request(
				"!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_GH_INFO", //url
				{
					id: fusionParam.id
				}, //parms
				function(data) {
					if (data.header != undefined && data.header.code == 0) {
						if (data.body.rows.length > 0) {
							var row = data.body.rows[0];
							$("#guhua_info1").text(row.IS_GX);
							$("#guhua_info2").text(row.GH_NAME);
							$("#guhua_info3").text(row.GH_FEE);
							fusionParam.is_gx = row.IS_GX;
							fusionParam.gh_name = row.GH_NAME;
							fusionParam.gh_fee = row.GH_FEE;
						} else {
							fusionParam.is_gx = "";
							fusionParam.gh_name = "";
							fusionParam.gh_fee = "";
						}
						if (fn)
							fn();
					} else {
						alert('提示', '获取固话数据失败');
					}
				});
		}

		//获取宽带资费、执行方式、执行资费
		function getKDXX(fn) {
			$rdcp.request(
				"!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_KD_INFO", //url
				{
					id: fusionParam.kd_speed_id
				}, //parms
				function(data) {
					//console.info(data.header.code);
					if (data.header != undefined && data.header.code == 0) {
						if (data.body.rows.length > 0) {
							var row = data.body.rows[0];

							$("#kuandai_info1").text(row.PACKAGE);
							$("#kuandai_info2").text(row.FEE);
							$("#kuandai_info3").text(row.TYPE);
							$("#kuandai_info4").text(row.ZXFS);
							$("#kuandai_info5").text(row.ZXZF);
							fusionParam.kd_zxfs = row.ZXFS;
							fusionParam.kd_zxfs_id = row.ZXFS_ID;
							fusionParam.kd_zxzf = row.ZXZF;
							fusionParam.kd_zxzf_id = row.ZXZF_ID;
							fusionParam.kd_name = row.PACKAGE;
							fusionParam.kd_fee = row.FEE;
							fusionParam.kd_jrlx = row.TYPE;
						} else {
							fusionParam.kd_zxfs = "";
							fusionParam.kd_zxfs_id = "";
							fusionParam.kd_zxzf = "";
							fusionParam.kd_zxzf_id = "";
							fusionParam.kd_name = "";
							fusionParam.kd_fee = "";
							fusionParam.kd_jrlx = "";
							alert('提示', '没有宽带信息');
						}
						if (fn)
							fn();
					} else {
						alert('提示', '获取宽带执行资费数据失败');
					}
				});
		}

		//获取IPTV信息
		function getIPTV(fn) {
			$rdcp.request(
				"!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_IPTV_INFO", //url
				{
					id: fusionParam.id
				}, //parms
				function(data) {
					if (data.header != undefined && data.header.code == 0) {
						if (data.body.rows.length > 0) {
							fusionParam.iptv_items = data.body.rows;
						} else {
							fusionParam.iptv_items = [];
						}
						if (fn)
							fn();
					} else {
						alert('提示', '获取互联网电视数据失败');
					}
				});
		}

		//获取增加、减免资费项
		function getFeeItem(fn) {
			$rdcp.request(
				"!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_RH_ZIFEI", //url
				{
					id: fusionParam.id
				}, //parms
				function(data) {
					//rdcp.request("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_RH_ZIFEI", "id="+openAmalgData.id, function(data) {
					if (data.header != undefined && data.header.code == 0) {
						if (data.body.rows.length > 0) {
							for (var i = 0; i < data.body.rows.length; i++) {
								var row = data.body.rows[i];
								if (row.TYPE == 1) {

								} else if (row.TYPE == 2) {
									if (row.CY == "KD" && row.NAME.indexOf("调试费") != -1)
										fusionParam.kd_tiaoce = row.FEE + "";
									else if (row.CY == "KD" && row.NAME.indexOf("工料费") != -1)
										fusionParam.kd_gongliao = row.FEE + "";
									else if (row.CY == "KD" && row.NAME.indexOf("手续费") != -1)
										fusionParam.kd_shouxu = row.FEE + "";
									else if (row.CY == "GH" && row.NAME.indexOf("调试费") != -1)
										fusionParam.gh_tiaoce = row.FEE + "";
									else if (row.CY == "GH" && row.NAME.indexOf("工料费") != -1)
										fusionParam.gh_gongliao = row.FEE + "";
									else if (row.CY == "GH" && row.NAME.indexOf("手续费") != -1)
										fusionParam.gh_shouxu = row.FEE + "";
								}
							}
						}
						if (fn)
							fn();
					} else {
						alert('提示', '获取资费项数据失败');
					}
				});
		}

		function getIPTVParams() {
			fusionParam["iptv_name"] = "";
			if (fusionParam.iptvType == "")
				return "";
			var objs = $("#select_iptv a");
			var datas = [];
			for (var i = 0; i < objs.length; i++) {
				if (datas.length == 0) {
					fusionParam.iptv_name = fusionParam.iptv_items[i].IPTV_NAME;
				}
				//if(objs.eq(i).hasClass("com_bigselectbtnon")) {
				if (objs.eq(i).hasClass("com_selectbtnon")) {
					var mode = "",
						type = "";
					if (fusionParam.iptv_items[i].IPTV_FEE.indexOf("南方传媒标准1") != -1) {
						mode = "A005";
						type = fusionParam.iptv_type;
					}
					datas.push({
						"name": fusionParam.iptv_items[i].IPTV_FEE,
						"type": fusionParam.iptv_items[i].ZXFS_ID,
						"code": fusionParam.iptv_items[i].ZXFS_ID,
						"terminalsrcmode": mode,
						"terminaltype1": type
					});
				}
			}
			if (datas.length == 0)
				return "error";
			return rdcp.json2str(datas);
		}

		function getBankInfo() {
			if (fusionParam.pay_name == undefined) {
				alert('提示', '请选择支付方式');
				return "";
			}
			if (fusionParam.pay_name == "托收") {
				if (fusionParam.bank_info.super_bank_code == undefined) {
					alert('提示', '请选择上级银行');
					return "";
				}
				if (fusionParam.bank_info.bank == undefined) {
					alert('提示', '请选择银行');
					return "";
				}
				var account = $.trim($("#bank_acct_no").val());
				var name = $.trim($("#bank_acct_name").val());
				var agree = $.trim($("#agreement_no").val());
				//var kind = $.trim($("#bank_busi_kind").val());
				var kind = "00500";
				if (account) {
					fusionParam.bank_info.bank_acct_no = account;
				} else {
					alert('提示', '请输入银行账号');
					return "";
				}
				if (name) {
					fusionParam.bank_info.bank_acct_name = name;
				} else {
					alert('提示', '请输入托收户名');
					return "";
				}
				if (agree) {
					fusionParam.bank_info.agreement_no = agree;
				} else {
					alert('提示', '请输入协议编码');
					return "";
				}
				if (kind) {
					fusionParam.bank_info.bank_busi_kind = kind;
				} else {
					alert('提示', '请输入业务编码');
					return "";
				}

			}
			return rdcp.json2str(fusionParam.bank_info);
		}

		$scope.check_wait = function() {
			mask("正在检验，请稍候...");
			setTimeout(function() {
				unmask();
				alert("提示", "您符合智慧沃家办理条件。");
			}, 5000);
		}

		function onLLBSelect(id, name) {
			$("#select_kg, #select_card").hide();
			fusionParam.wo_bag = "智慧沃家共享套餐-" + name + "（" + fusionParam.firstFee + "）";
			$("#select_kg, #select_card").show("normal");
		}

		//宽带类型选择
		function networkChange(id, type) {
			if ($("#" + id).hasClass("com_selectbtnon"))
				return;
			$("#" + id).parent().parent().find("a").removeClass("com_selectbtnon");
			$("#" + id).addClass("com_selectbtnon");

			fusionParam.networkType = type;
			if (type == "新装") {
				//新装的话不需要输入宽带号码
				$("#kuan_num").parent().parent().hide();
				$("#kuan_num").val("");
			} else {
				$("#kuan_num").parent().parent().show();
			}
		}

		//固话类型选择
		$scope.guhuaChange = function(id, type) {
			if ($("#" + id).hasClass("com_selectbtnon")) {
				fusionParam.phoneType = "";
				$("#guhua_num").parent().parent().hide();
				$("#" + id).removeClass("com_selectbtnon");
				return;
			}
			$("#" + id).parent().parent().find("a").removeClass("com_selectbtnon");
			$("#" + id).addClass("com_selectbtnon");
			fusionParam.phoneType = type;
			if (type == "新装") {
				$("#guhua_num").parent().parent().hide();
				$("#guhua_num").val("");
			} else {
				$("#guhua_num").parent().parent().show();
			}
		}
		$scope.iptvChange = function(id, type) {
				if ($("#" + id).hasClass("com_selectbtnon")) {
					$("#" + id).removeClass("com_selectbtnon");
					fusionParam.iptvType = "";
				} else {
					$("#" + id).addClass("com_selectbtnon");
					fusionParam.iptvType = type;
				}
			}
			//读取身份证信息

		function bluetoothRead() {
			//模拟身份证读取
			check();

		}

		//提交订单
		$scope.order_submit = function() {
			if (fusionParam.cardID == "") {
				alert('提示', '请读取身份证信息');
				return;
			}
			if (fusionParam.front == "") {
				alert('提示', '未获取到身份证照片');
				return;
			}
			if (fusionParam.kd_fs == "") {
				alert('提示', '请选择宽带终端提供方式');
				return;
			}
			if (fusionParam.kd_type == "") {
				alert('提示', '请选择宽带终端类型');
				return;
			}
			if (fusionParam.networkType == "" && fusionParam.type != "已有宽带") {
				alert('提示', '请选择宽带类型');
				return;
			}
			if ((fusionParam.networkType == "加入" || fusionParam.type == "已有宽带") && $("#kuan_num").val() == "") {
				alert('提示', '请输入宽带号码');
				return;
			}
			if (fusionParam.phoneType != "" && $("#guhua_num").val() == "") {
				alert('提示', '请输入固话号码');
				return;
			}
			if ($("#detail_address").val() == "") {
				alert('提示', '请输入装机地址');
				return;
			}
			if ($("#contract_phone").val() == "") {
				alert('提示', '请输入联系号码');
				return;
			}

			var paramData = getOrderData();
			if (paramData == "")
				return;
			mask("正在提交订单数据...");
			//$("footer").hide();
			var param = {
				"list": rdcp.json2str(paramData.list),
				"ext": rdcp.json2str(paramData.ext),
				"businessId": "ChinaUnicom.Amalgamation",
				payStatus: "-1"
			};
			//console.info("param--list"+rdcp.json2str(param.list));
			$rdcp.post(
				"!ESale/Mall/Order/~java/Order.create", //url
				param, //parms
				function(data) {
					//rdcp.request("!ESale/Mall/Order/~java/Order.create",{"list": rdcp.json2str(paramData.list), "ext": rdcp.json2str(paramData.ext),"businessId":"ChinaUnicom.Amalgamation",payStatus:"-1"},function(data){
					unmask();
					//console.info(JSON.stringify(data));
					if (data != null && data.header && data.header.code == 0) {
						var creatorName = data.body["creator_member_name"];
						var devId = data.body["member_id"];
						Base.sendMessage(devId, creatorName + "的订单已经生成,请注意接收查看");
						alert("提示", "订单创建成功");
						setTimeout(function() {
							ysb_unalert();
							//goto_home();//返回主页
							window.location.href = "#/home"
						}, 1000);
					} else {
						alert("提示", "订单创建失败！");
						//$("footer").show();
					}
				});
		}

		function getOrderData() {
			var result = {};
			var yw_fee = "",
				kd_fee = "",
				gh_fee = "";
			/*不需要预存款（保留）
			 var yw_fee = parseFloat($("#yw_fee").val());
			 if(isNaN(yw_fee) || yw_fee < 0) {
			 alert('提示', "请输入有效的移网预存款！");
			 return "";
			 }
			 yw_fee = yw_fee + "";

			 var kd_fee = parseFloat($("#kd_fee").val());
			 if(isNaN(kd_fee) || kd_fee < 0) {
			 alert('提示', "请输入有效的宽带预存款！");
			 return "";
			 }
			 kd_fee = kd_fee + "";

			 var gh_fee = "";
			 if(openAmalgData.is_gx) {
			 gh_fee = parseFloat($("#gh_fee").val());
			 if(isNaN(gh_fee) || gh_fee < 0) {
			 alert('提示', "请输入有效的固话预存款！");
			 return "";
			 }
			 gh_fee = gh_fee + "";
			 }
			 */

			var terminal_fee = "";
			if ($("#kd_terminal").parent().parent().is(":visible")) {
				terminal_fee = parseFloat($("#kd_terminal").val());
				if (isNaN(terminal_fee) || terminal_fee < 0) {
					alert('提示', "请输入有效的宽带终端减免费用！");
					return "";
				}
				terminal_fee = terminal_fee + "";
			}

			var iptv_fee = "";
			if ($("#iptv_terminal").parent().parent().is(":visible")) {
				iptv_fee = parseFloat($("#iptv_terminal").val());
				if (isNaN(iptv_fee) || iptv_fee < 0) {
					alert('提示', "请输入有效的互联网电视终端减免费用！");
					return "";
				}
				iptv_fee = iptv_fee + "";
			}

			//获取勾选的iptv信息
			var iptv_group = getIPTVParams();
			if (iptv_group == "error") {
				alert('提示', "请选择所需的互联网电视包！");
				return "";
			}

			if ($("#select_iptvtype").is(":visible") && fusionParam.iptv_type == "") {
				alert('提示', "请选择互联网电视终端提供方式！");
				return "";
			}

			var bank_info = getBankInfo();
			if (bank_info == "") {
				return "";
			}

			result['list'] = {
				'list': [{
					'goodsId': fusionParam.goodsId,
					'quantity': '1'
				}]
			};

			var rhtype = "0";
			if (fusionParam.kd_speed == "4M" && fusionParam.phoneType != "" && fusionParam.iptvType == "")
				rhtype = "1";
			else if ((fusionParam.kd_speed == "10M" || fusionParam.kd_speed == "20M") && fusionParam.phoneType != "" && fusionParam.iptvType == "")
				rhtype = "2";
			else if (fusionParam.iptvType != "" && fusionParam.phoneType == "")
				rhtype = "3";
			else if (fusionParam.kd_speed == "4M" && fusionParam.phoneType != "" && fusionParam.iptvType != "")
				rhtype = "4";
			else if ((fusionParam.kd_speed == "10M" || fusionParam.kd_speed == "20M") && fusionParam.phoneType != "" && fusionParam.iptvType != "")
				rhtype = "5";
			//alert("场景：" + rhtype);

			var rhCode = "true"; //true为新装宽带
			if (fusionParam.type == "已有宽带") {
				rhCode = "false";
			}

			//alert(ul.eq(0).find(".yw_ch").text());
			result['ext'] = {
				'ext': {
					'BUSINESS': [{
						'key': 'BRAND_NAME',
						'val': "中国联通",
						'key_as': '运营商'
					}, {
						'key': 'product_name',
						'val': fusionParam.name,
						'key_as': '产品包'
					}, {
						'key': 'kd_speed',
						'val': fusionParam.kd_speed,
						'key_as': '宽带速率'
					}, {
						'key': 'kd_jrlx',
						'val': fusionParam.kd_jrlx,
						'key_as': '接入类型'
					}, {
						'key': 'rhCode',
						'val': rhCode,
						'key_as': '标识新用户'
					}, {
						'key': 'kuan_num',
						'val': $("#kuan_num").val(),
						'key_as': '宽带号码'
					}, {
						'key': 'guhua_num',
						'val': $("#guhua_num").val(),
						'key_as': '固话号码'
					}, {
						'key': 'guhua_gx',
						'val': fusionParam.is_gx,
						'key_as': '固话是否共线'
					}, {
						'key': 'guhua_name',
						'val': fusionParam.gh_name,
						'key_as': '固话套餐'
					}, {
						'key': 'guhua_fee',
						'val': fusionParam.gh_fee,
						'key_as': '固话套餐资费'
					}, {
						'key': 'wotype',
						'val': fusionParam.wotype,
						'key_as': '套餐类型'
					}, {
						'key': 'rhtype',
						'val': rhtype,
						'key_as': '场景'
					}, {
						'key': 'wo_pag',
						'val': fusionParam.rh_fee_id,
						'key_as': '产品资费包'
					}, {
						'key': 'prod_naru',
						'val': fusionParam.kd_name,
						'key_as': '宽带套餐'
					}, {
						'key': 'prod_naru_package',
						'val': fusionParam.kd_fee,
						'key_as': '宽带基本套餐资费包'
					}, {
						'key': 'iptv_name',
						'val': fusionParam.iptv_name,
						'key_as': 'IPTV资费包名称'
					}, {
						'key': 'iptv_group',
						'val': iptv_group,
						'key_as': 'IPTV资费包子项'
					}, {
						'key': 'kd_zxzf',
						'val': fusionParam.kd_zxzf,
						'key_as': '宽带到期执行资费名称'
					}, {
						'key': 'expire_deal_mode',
						'val': fusionParam.kd_zxfs_id,
						'key_as': '到期执行方式编码'
					}, {
						'key': 'discnt_code',
						'val': fusionParam.kd_zxzf_id,
						'key_as': '到期执行资费编码'
					}, {
						'key': 'install_address',
						'val': fusionParam.address,
						'key_as': '地址关键字'
					}, {
						'key': 'detail_install_address',
						'val': $('#detail_address').val(),
						'key_as': '装机地址'
					}, {
						'key': 'city_code',
						'val': fusionParam.sale_code,
						'key_as': '地区编码'
					}, {
						'key': 'serialNumber',
						'val': fusionParam.number,
						'key_as': '4G新装号码'
					}, {
						'key': 'num_key',
						'val': $("#guhua_num").val(),
						'key_as': '新装固话号码关键字'
					}, {
						'key': 'productName',
						'val': "",
						'key_as': '组合套餐4G新装套餐名称'
					}, {
						'key': 'productPackageName',
						'val': "",
						'key_as': '组合套餐4G新装套餐资费包'
					}, {
						'key': 'product_type',
						'val': "",
						'key_as': '参加活动类型'
					}, {
						'key': 'prod_name',
						'val': "",
						'key_as': '活动名称'
					}, {
						'key': 'device_imei',
						'val': "",
						'key_as': '串号'
					}, {
						'key': 'terminal_type',
						'val': fusionParam.kd_fs,
						'key_as': '宽带终端提供方式'
					}, {
						'key': 'terminalsrc_mode',
						'val': fusionParam.kd_type,
						'key_as': '终端模式'
					}, {
						'key': 'terminal_fee',
						'val': terminal_fee,
						'key_as': '宽带终端减免'
					}, {
						'key': 'iptv_fee',
						'val': iptv_fee,
						'key_as': '电视终端减免'
					}, {
						'key': 'bank_info',
						'val': bank_info,
						'key_as': '银行托收信息'
					}, {
						'key': 'zuhezifeibao',
						'val': fusionParam.gh_fee,
						'key_as': '组合固话的套餐资费包'
					}, {
						'key': 'kuandai_tiaoce',
						'val': fusionParam.kd_tiaoce,
						'key_as': '宽带调测费'
					}, {
						'key': 'kuandai_gongliao',
						'val': fusionParam.kd_gongliao,
						'key_as': '宽带装移机工料费'
					}, {
						'key': 'kuandai_shouxu',
						'val': fusionParam.kd_shouxu,
						'key_as': '宽带装移机手续费'
					}, {
						'key': 'guhua_tiaoce',
						'val': fusionParam.gh_tiaoce,
						'key_as': '固话调测费'
					}, {
						'key': 'guhua_gongliao',
						'val': fusionParam.gh_gongliao,
						'key_as': '固话装移机工料费'
					}, {
						'key': 'guhua_shouxu',
						'val': fusionParam.gh_shouxu,
						'key_as': '固话装移机手续费'
					}, {
						'key': 'kuandai_fee',
						'val': kd_fee,
						'key_as': '新装宽带预存款'
					}, {
						'key': 'CardID',
						'val': fusionParam.cardID,
						'key_as': '身份证ID'
					}, {
						'key': 'guhua_fee',
						'val': gh_fee,
						'key_as': '新装固话预存款'
					}, {
						'key': 'CONTRACT_FEE_LIMIT',
						'val': yw_fee,
						'key_as': '移网预存款'
					}],
					'BASE': [{
						'key': 'CUSTOMER_NAME',
						'val': fusionParam.name,
						'key_as': '客户姓名'
					}, {
						'key': 'CERT_ADDRESS',
						'val': fusionParam.cardAddr,
						'key_as': '证件地址'
					}, {
						'key': 'CONTACT_MAN',
						'val': fusionParam.name,
						'key_as': '联系人'
					}, {
						'key': 'CONTACT_PHONE',
						'val': $('#contract_phone').val(),
						'key_as': '联系电话'
					}, {
						'key': 'ISS_USING',
						'val': fusionParam.issuedAt,
						'key_as': '签发机关'
					}, {
						'key': 'POSTAL_ADDRESS',
						'val': fusionParam.cardAddr,
						'key_as': '通讯地址'
					}, {
						'key': 'GENDER',
						'val': fusionParam.sex,
						'key_as': '性别'
					}, {
						'key': 'CERT_NUMBER',
						'val': fusionParam.cardNo,
						'key_as': '证件号码'
					}],
					'BASE.IMG': [{
						'key': 'ID_PIC_FRONT',
						'val': fusionParam.front,
						'key_as': '身份证正面照片'
					}, {
						'key': 'ID_PIC_BACK',
						'val': fusionParam.contrary,
						'key_as': '身份证反面照片'
					}],
					'BUSINESS.INT': [{
						'key': 'PHONE_NUMBER',
						'val': fusionParam.number,
						'key_as': '开户号码'
					}],
					'BASE.DATE': [{
							'key': 'CERT_VALID_FROM',
							'val': fusionParam.effectedDate,
							'key_as': '证件有效期开始'
						}, //证件有效日期开始
						{
							'key': 'CERT_VALID_TO',
							'val': fusionParam.expiredDate,
							'key_as': '证件有效期结束'
						} //证件有效日期
					]
				}

			};
			return result;
		}
	}
]);

function onReadIDCardFinish(bluetoothInfoStr) {
	//console.info("读取身份证信息完毕");
	unmask();
	if (bluetoothInfoStr != "{}") {
		var bluetoothInfo = $.parseJSON(bluetoothInfoStr);
		//2015-06-17 添加身份证读取失败信息获取
		if (bluetoothInfo.result != undefined && bluetoothInfo.result != 0) {
			alert("提示", getReadCardResult(bluetoothInfo.result));
			if (bluetoothInfo.result == -1) {
				if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
					//----------
					/*$("#btBox").css("display","block");
					 $("#shadeDiv").css("display","block");*/
				}
			}
			$('#bluetooth_read_btn').button('reset'); //还原蓝牙读取按钮的状态为可点击
			return;
		}

		//存储身份证原始信息
		var idCard_param = {
			"name": bluetoothInfo.name,
			"gender": bluetoothInfo.sex,
			"paper_addr": bluetoothInfo.address,
			"paper_num": bluetoothInfo.cardno,
			"str_office": bluetoothInfo.issuedat,
			"paper_stime": bluetoothInfo.effecteddate,
			"paper_time": bluetoothInfo.expireddate
		};
		fusionParam.cardID = InsertIDCard(idCard_param); //-----------
		fusionParam.name = bluetoothInfo.name;
		fusionParam.cardAddr = bluetoothInfo.address;
		fusionParam.issuedAt = bluetoothInfo.issuedat;
		fusionParam.sex = bluetoothInfo.sex;
		fusionParam.cardNo = bluetoothInfo.cardno;
		fusionParam.effectedDate = bluetoothInfo.effecteddate;
		fusionParam.expiredDate = bluetoothInfo.expireddate;

		//请求合成身份证照片
		mask("身份证信息读取成功，正在进行照片合成……");
		fusionFour.request(
			"!ESale/System/IDCard/~java/IDCardImg.create", //url
			bluetoothInfo, //parms
			function(data) {
				unmask();
				if (data.header && data.header.code == 0) {
					fusionParam.front = data.body.cardon; //正面照片id
					fusionParam.contrary = data.body.cardoff; //反面照片id

					fusionFour.scope.IDCardPositive = APP_CONFIG.SERVER_URL + "!service/file/~java/Downloader.get?type=Thumb&id=" + data.body.cardon; //正面照片
					fusionFour.scope.IDCardOpposite = APP_CONFIG.SERVER_URL + "!service/file/~java/Downloader.get?type=Thumb&id=" + data.body.cardoff; //反面照片

				} else {
					alert("提示", "身份证照片合成失败！");
				}
			});
	} else {
		//alert("提示", '身份证读取失败，请重试');
	}
	$("#bluetooth_read_btn").button('reset'); //还原蓝牙读取按钮的状态为可点击
}