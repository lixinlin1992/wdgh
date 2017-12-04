app.registerCtrl("BuyNumCardCtrl", ["$scope", "$srhttp", "$rootScope", "$routeParams",
	function($scope, $srhttp, $rootScope, $routeParams) {

		$scope.cbss = {
			user_cbss_id: '',
			user_cbss_pwd: '',
			user_cbss_dev: '',
			user_cbss_province: '',
		}
		$scope.type = 0;

		$scope.form = {
			'numId': '',
			'goodsId': '',
			'number': '',
			'busiId': '',
			'dksId': '',
			'dksName': '',
			'is_white': '',
			'is_rele': '',
			'netWork': '',
			'feeMoney':'',
			'product_type':''
		}
		$scope.pageSize = 9;
		$scope.numPageSize = 8;
		$scope.page = 1;
		$scope.title = '';
		$scope.brandId = '';
		$scope.goodsId = '';
		$scope.white = 'ChinaUnicom.Account.4G.BK';

		$(window).resize(function() {
			$scope.imgY = Math.ceil($('.goodsshow img').width() * 7 / 9);
			$(".goodsshow img").height($scope.imgY);
			$(".goodsshow").height($scope.imgY);
		});


		//获取用户CBSS信息结束

		//CBSS密码加密
		function passwdEncryption(pwd) {
			var hash = b64_sha1(pwd);
			var words = CryptoJS.enc.Base64.parse(hash);
			var base64 = CryptoJS.enc.Base64.stringify(words);
			return base64;
		}


		$scope.interface = {
			//商品
			dk_info: function() {
				if ($routeParams.type == '1') {
					$scope.dk = {
						'pageSize': $scope.pageSize,
						'brand_id': $scope.brandId,
						'network': $scope.netId,
						'rh_only': 0
					}
				} else {
					$scope.dk = {
						'pageSize': $scope.pageSize,
						'brand_id': $scope.brandId,
						'network': $scope.netId,
						'no_limit': true
					}
				}
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_DK_PRODUCT", $scope.dk, function(data) {
					if (!data.body.pageCount == 0) {
						$scope.dk = data.body.rows;
						$scope.firstFired = true;
						$scope.selectLast = function(index) {
							if (index == $scope.dk.length - 1) {
								if ($scope.firstFired) {
									$scope.firstFired = false;
									$scope.imgY = Math.ceil($('.goodsshow img').width() * 7 / 9);
									$(".goodsshow img").height($scope.imgY);
									$(".goodsshow").height($scope.imgY);
									return 'selected';
								} else {
									return 'selected';
								}

							} else {
								return 'unselected';
							}
						}
					}
					if (data.body.rows.length < $scope.pageSize) {
						$(".layout_centent .com_title #moreProduct").text("无更多商品");
					}
				})
			},
			CBSS: function() {
				//获取用户配置的CBSS相关信息
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/Q_CBSS_INFO", {
					'title': $scope.title,
				}, function(data) {
					if (data.header.code == 0) {
						if (data.body.rows.length > 0) {
							if (data.body.rows[0].CBSS_ID != '' || data.body.rows[0].CBSS_PWD != '') {
								$scope.cbss.user_cbss_id = data.body.rows[0].CBSS_ID;
								$scope.cbss.user_cbss_pwd = data.body.rows[0].CBSS_PWD;
								$scope.cbss.user_cbss_dev = data.body.rows[0].CBSS_DEV;
								$scope.cbss.user_cbss_province = data.body.rows[0].PROVINCE;
								//$scope.cbss.user_cbss_pwd = passwdEncryption($scope.cbss.user_cbss_pwd);
								$scope.cbss.user_cbss_pwd = $scope.cbss.user_cbss_pwd;
							} else {
								alert("系统检测到您尚未配置ESS/CBSS信息，请完善相关信息");
								return;
							}
							$scope.interface.getCbssNumberList($scope.page, $scope.title, function(list,Money) {
								if (list.length == 0) {
									alert("没有更多可用的号码");
									return;
								}
								$scope.list = list;
								$scope.feeMoney=Money;
								$scope.numAndFee=[];
								for(var i=0;i<$scope.list.length;i++){
									var a=[];
									a.push($scope.list[i]);
									a.push($scope.feeMoney[i]);
									$scope.numAndFee.push(a);
								}
							});
						} else {
							//理论上代码不会跳进这里
						}
					} else {
						alert("加载信息失败，请刷新页面后重试");
					}
				});
			},
			getCbssNumberList: function(page, title, fn) {
				if (!$scope.cbss.user_cbss_id || !$scope.cbss.user_cbss_pwd) {
					alert('未获取到ESS/CBSS工号');
					return;
				}
				var params = {
					province: $scope.cbss.user_cbss_province,
					userName: $scope.cbss.user_cbss_id,
					password: $scope.cbss.user_cbss_pwd,
					serial_number: title,
					page: page,
					lh_type: "1",
					getfee: "true",
					min_deposit: "",
					max_deposit: ""
				};
				$srhttp.post("!sale/cbss/~java/LoginCbss.getNumberList", params, function(data) {
					if (data.header) {
						if (data.header.code == 16) {
							fn(data.body, data.header.message.split(","));
						} else {
							alert("获取不到号码，请求失败或CBSS帐号密码错误");
						}
					} else {
						alert("获取号码失败！");
					}
				});
			},
			//号码
			numlist: function() {
				if($scope.brandId==""){
					//alert("请选择产品类型");
					return;
				}else if($scope.netId==undefined||$scope.netId==""){
					//alert("请选择网络类型");
					return;
				}
				$srhttp.get("!ESale/Mall/Goods/~query/Q_GOODS_NUMBER_COMMON", {
					'priceorder': 'priceLowToHigh',
					'typeId': 'ChinaUnicom.Account.Number',
					'account_type': '2',
					'pageSize': $scope.numPageSize,
					'businessId': $scope.white, //ChinaUnicom.Account.4G.BK
					'title': $scope.title,
					'brandId': $scope.brandId
				}, function(data) {

					if (!data.body.pageCount == 0) {
						$scope.numlist = data.body.rows;
					}
					$(".com_showmore a.more_btn").text("点击加载更多");
					//当无数据时，修改文本值
					if (data.body.rows.length < $scope.numPageSize) {
						$(".com_showmore a.more_btn").text("已无更多数据");
					}

				})
			},
			//业务
			brand: function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_BRAND_LIST", {}, function(data) {
					$scope.brand = data.body.rows;
				})
			},
			//网络
			net: function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_NETWORK_LIST", {
					brand_id: $scope.brandId
				}, function(data) {
					$scope.net = data.body.rows;
				})
			},

			//CBSS 显示隐藏
			CBSS_hide: function() {
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/Q_CBSS_INFO", {
					'title': $scope.title,
				}, function(data) {
					if (data.header.code == 0 && data.body.rows.length > 0 && data.body.rows[0].CBSS_ID) {
						//has_cbss_info = true;
						$scope.CBSS_hide = 1;
					}
				});
			}
		}

		//加载商品
		$scope.imgScr = APP_CONFIG.SERVER_URL + "!service/file/~java/Downloader.get?id=";
		//TODO linchuangrong:如果type==1，则执行买号卡，否则，走“办融合”的事件
		if ($routeParams.type == 1) {
			$scope.interface.dk_info();
			//$scope.interface.numlist();
			$scope.interface.brand();
			$scope.interface.CBSS_hide();
			$rootScope.appTitle = "买号卡";
		} else {
			console.log("买号卡的产品，此处进入办融合的事件处理......");
			dk_info = $scope.interface.dk_info; //将function赋值给“办融合”的一个变量
			dk_brand = $scope.interface.brand; //将function赋值给“办融合”的一个变量
		}

		$scope.event = {
			next: function(id, number, busiId, brandId, fee) {
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~java/Number.lock", {
					"id": id
				}, function(data) {
					if (data.header.code == 0) {
						if (data.body.flag == "1") {
							//传递参数
							$scope.form.numId = id;
							$scope.form.goodsId = $scope.goodsId;
							$scope.form.number = number;
							$scope.form.busiId = busiId;
							$scope.form.brandId = brandId;
							$scope.form.numFee = fee;
							$scope.form.feeMoney=fee;
							if ($scope.goodsId != '' && $scope.goodsId != undefined) {

								$scope.form.busiId = $scope.white; //号码类型，2G白卡，3G成卡，4G白卡等....
								Local.saveStoreJson('form', $scope.form);
								if ($scope.form.is_rele == '1') {
									$scope.form.buy = 1;
									//location.href = '#/buyNumCard2/1';
									location.href = '#/buyNumCard_net';
								} else {
									location.href = '#/buyNumCard2/1';
								}

							} else {
								alert('请选择产品！');
							}
						}
					} else {
						alert("该号码已被占用，请重试");
					}
				})
			},

			//TODO linchuangrong:办融合模块中，移网产品，选择完之后的下一步事件：选套餐
			yiWangNext: function() {
				$scope.form.goodsId = $scope.goodsId;
				if ($scope.goodsId == '' && $scope.goodsId == "undefined") {
					alert("请先选择产品");
					return;
				}
				Local.saveStoreJson('form', $scope.form);
				selectDanKaProduct(); //选中单卡产品后的事件处理，方法来自rongHe2.js
			},

			CBSS_next: function(number,feeMoney) {
				var patt = /4G.BK/;
				var a=patt.test($scope.white);
				if (!a) {
					alert("CBSS号码仅支持4G白卡的产品");
					return;
				}
				$scope.form.busiId = $scope.white; //号码类型，2G白卡，3G成卡，4G白卡等....
				$scope.form.number = number;
				$scope.form.feeMoney=feeMoney;
				$scope.form.goodsId = $scope.goodsId;
				if ($scope.goodsId != '' && $scope.goodsId != undefined) {
					Local.saveStoreJson('form', $scope.form);
					if ($scope.form.is_rele == '1') {
						$scope.form.buy = 1;
						//location.href = '#/buyNumCard2/1';
						location.href = '#/buyNumCard_net';
					} else {
						location.href = '#/buyNumCard2/1';
					}
				} else {
					alert('请选择产品！');
				}

			},
			//更多商品
			dk_pageSize: function() {
				$scope.pageSize += 9;
				$scope.interface.dk_info();
			},
			//显示更多
			listShowAdd: function() {
				$scope.numPageSize *= 2;
				if ($scope.type == 1) {
					$scope.interface.CBSS();
				} else {
					$scope.interface.numlist();
				}
			},
			//显示更多
			cbsShowAdd: function() {
				//$scope.numPageSize *= 2;
				//$scope.interface.CBSS_hide();
				//console.log("获取更多CBSS号码中");
				$scope.page += 1;
				$scope.interface.getCbssNumberList($scope.page, $scope.title, function(list,feeMoney) {
					if (list.length == 0) {
						alert("没有更多可用的号码");
						return;
					}
					$scope.list = list;
					$scope.feeMoney=feeMoney;
					$scope.numAndFee=[];
					for(var i=0;i<$scope.list.length;i++){
						var a=[];
						a.push($scope.list[i]);
						a.push($scope.feeMoney[i]);
						$scope.numAndFee.push(a);
					}
				});

			},
			//成卡白卡
			cardType: function(type) {
				$(".com_showmore a.more_btn").text("点击加载更多");
				$scope.cardType = type; //卡类型：1白卡，2成卡
				$("#card-type .right a").removeClass('choiceon_btn');
				if($scope.brandId==""){
					alert("请选择产品类型");
					return;
				}else if($scope.netId==undefined||$scope.netId==""){
					alert("请选择网络类型");
					return;
/*					if(type == 1){
						$scope.white = 'ChinaUnicom.Account.4G.BK';
					}else{
						$scope.white = 'ChinaUnicom.Account.4G.CK';
					}*/
				}else {
					if (type == 1) {
						$("#card-type .right a:eq(0)").addClass('choiceon_btn');
						if ($scope.brandId == "CN" || $scope.brandId == "CM") {
							console.info($scope.netId);
							$scope.white = ($scope.brandId + "." + "Account." + $scope.netId.split(".")[1] + ".BK");
						} else {
							$scope.white = 'ChinaUnicom.Account.' + $scope.netId.split(".")[1] + '.BK';
						}
					} else {
						$("#card-type .right a:eq(1)").addClass('choiceon_btn');
						if ($scope.brandId == "CN" || $scope.brandId == "CM") {
							$scope.white = ($scope.brandId + "." + "Account." + $scope.netId.split(".")[1] + ".CK");
						} else {
							$scope.white = 'ChinaUnicom.Account.' + $scope.netId.split(".")[1] + '.CK';
						}
					}
				}
				$scope.pageSize = 8;
				if ($scope.type == '0') {
					$scope.interface.numlist();
				} else {
					//如果是成卡，CBSS没有成卡
					if (type == "2") {
						$scope.list = [];
						$scope.numAndFee=[];
						$(".com_showmore a.more_btn").text("CBSS无成卡号码");
						return;
					} else {
						$scope.interface.CBSS();
					}

				}
			},

			//搜索功能
			NumSearch: function() {
				//页码为1
				$scope.page = 1;
				$scope.pageSize = 9;
				$scope.numPageSize = 8;
				//获得搜索的内容
				$scope.title = $(".search_text").val();
				//console.log('搜索功能' + $scope.title);
				$(".layout_centent .com_title #moreProduct").text("更多选择");
				if ($scope.type == 1) {
					$scope.interface.CBSS();
				} else {
					$scope.interface.numlist();
				}

			},
			goods: function(obj, id, white, name, rele, net, cardFee,product_type) {

				$scope.form.is_rele = rele;
				$scope.form.netWork = net;
				$scope.form.dksId = id;
				$scope.form.is_white = white;
				$scope.form.dksName = name;

				$scope.form.card_fee = cardFee;
				$scope.form.product_type=product_type;//卡费应收

				if ($(obj.currentTarget.children[0]).hasClass('active')) {
					$(obj.currentTarget.children[0]).removeClass('active');
					$(obj.currentTarget.children[0].children[0]).hide();
					$scope.goodsId = '';
				} else {
					$('.com_smallgoodslist .row .com_smallgoods').removeClass('active');
					$('.com_smallgoodslist .row .choiced').hide();
					$(obj.currentTarget.children[0]).addClass('active');
					$(obj.currentTarget.children[0].children[0]).show();
					$scope.goodsId = id;
					/*console.log($("#netBtnAll .choiceon_btn").text());
					 if ($("#netBtnAll .choiceon_btn").text() == '全部') {
					 $scope.white = '';
					 } else {
					 if (white == 0) {
					 $scope.white = 'ChinaUnicom.Account.' + $("#netBtnAll .choiceon_btn").text() + '.CK';
					 } else {
					 $scope.white = 'ChinaUnicom.Account.' + $("#netBtnAll .choiceon_btn").text() + '.BK';
					 }
					 }*/
					//号码网络类型
					console.log("网络类型：" + net);
					var netWork = "";
					if (net.indexOf("2G") >= 0) {
						netWork = "2G";
					} else if (net.indexOf("3G") >= 0) {
						netWork = "3G";
					} else if (net.indexOf("4G") >= 0) {
						netWork = "4G";
					} else {
						netWork = "";
					}
					if ($scope.brandId == "CN" || $scope.brandId == "CM") {
						$scope.white = ($scope.brandId + "." + "Account." + netWork + ".") + (white ? "BK" : 'CK');
					} else {
					//号码是白卡，还是成卡
					if (netWork != "") {
						if (white == 0) {
							$scope.white = 'ChinaUnicom.Account.' + netWork + '.CK';
						} else {
							$scope.white = 'ChinaUnicom.Account.' + netWork + '.BK';
						}
					} else {
						if (white == 0) {
							$scope.white = 'ChinaUnicom.Account.' + $("#netBtnAll .choiceon_btn").text() + '.CK';
						} else {
							$scope.white = 'ChinaUnicom.Account.' + $("#netBtnAll .choiceon_btn").text() + '.BK';
						}
					}
				}
				}
				$scope.numPageSize = 8;
				$scope.interface.numlist();
				//console.log( $scope.form);
			},
			//业务选择
			brandBtnAll: function() {
				if ($('#brandBtnAll a').hasClass('choiceon_btn')) {
					$('#brandBtnAll a').removeClass('choiceon_btn');
				}
				$('#brandBtnAll a:eq(0)').removeClass('choiceon_btn');
				$('#brandBtnAll a:eq(0)').addClass('choiceon_btn');
				$scope.brandId = $('#netBtnAll a:eq(0)').attr('brand_id');
				$scope.pageSize = 9;
				$scope.numPageSize = 8;
				if ($scope.type == 1) {
					$scope.interface.CBSS();
				} else {
					$scope.interface.numlist();
					$scope.interface.dk_info();
				}
			},
			brandBtn: function(obj) {
				$scope.netId="";
				$(obj.target).siblings().removeClass('choiceon_btn');
				$(obj.target).addClass('choiceon_btn');
				$scope.brandId = $(obj.target).attr('brand_id');
				$scope.pageSize = 9;
				$scope.numPageSize = 8;
				$(".layout_centent .com_title #moreProduct").text("更多选择");

				if ($scope.type == 1) {
					$scope.interface.CBSS();
				} else {
					$scope.interface.numlist();
					$scope.interface.net();
					$scope.interface.dk_info();
				}
			},
			netBtnAll: function() {
				if ($('#netBtnAll a').hasClass('choiceon_btn')) {
					$('#netBtnAll a').removeClass('choiceon_btn');
				}
				$('#netBtnAll a:eq(0)').removeClass('choiceon_btn');
				$('#netBtnAll a:eq(0)').addClass('choiceon_btn');
				$scope.netId = $('#netBtnAll a:eq(0)').attr('net_id');

				$scope.pageSize = 9;
				$scope.numPageSize = 8;

				if ($scope.type == 1) {
					$scope.interface.CBSS();
				} else {
					$scope.interface.numlist();
					$scope.interface.dk_info();
				}
			},
			netBtn: function(obj) {
				$(obj.target).siblings().removeClass('choiceon_btn');
				$(obj.target).addClass('choiceon_btn');
				$scope.netId = $(obj.target).attr('net_id');
				$scope.pageSize = 9;
				$scope.numPageSize = 8;
				if ($(obj.target).text() == '全部') {
					$scope.white = '';
				} else {
					//$scope.white =$scope.netId.split(".")[0] +'.Account.' +$scope.netId.split(".")[1]  + '.BK';
					$scope.white = 'ChinaUnicom.Account.' + $(obj.target).text() + '.BK';
				}
				$(".layout_centent .com_title #moreProduct").text("更多选择");
				if ($scope.type == 1) {
					$scope.interface.CBSS();
				} else {
					$scope.interface.numlist();
					$scope.interface.dk_info();
				}
			},
			sub: function(obj, type) {
				$scope.page = 1;
				$(".formlist a").removeClass('radiobtnon');
				$(obj.target).addClass('radiobtnon');
				$scope.type = type;
				if ($scope.type == '0') {
					$(".com_selectnumber").html();
					$scope.interface.dk_info();

				} else {
					$scope.interface.CBSS();
				}
			}
		}
	}
]);