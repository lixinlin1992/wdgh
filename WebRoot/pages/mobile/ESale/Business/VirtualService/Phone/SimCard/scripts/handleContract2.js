app.registerCtrl("HandleContractCtrl2", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {

		$scope.cbss = {
			user_cbss_id: '',
			user_cbss_pwd: '',
			user_cbss_dev: '',
			user_cbss_province: '',
		}
		$scope.type = 0;

		$scope.pageSize = 12;
		$scope.page = 1;
		$scope.title = '';
		$scope.cardType = "1"; //默认白卡
		$scope.form = Local.getStoreJson('form');
		$scope.form.numId = '';
		$scope.form.numTitle = '';
		$scope.form.numBusId = '';
		$scope.form.numBrandId = '';
		$scope.form.PERIODS = '';
		$scope.form.feeMoney='';

		function passwdEncryption(pwd) {
			var hash = b64_sha1(pwd);
			var words = CryptoJS.enc.Base64.parse(hash);
			var base64 = CryptoJS.enc.Base64.stringify(words);
			return base64;
		}


		$scope.white = 'ChinaUnicom.Account.4G.BK';
		$scope.interface = {
			//号码
			numlist: function() {
					$srhttp.get("!ESale/Mall/Goods/~query/Q_GOODS_NUMBER_COMMON", {
						'priceorder': 'priceLowToHigh',
						'typeId': 'ChinaUnicom.Account.Number',
						'account_type': '2',
						'pageSize': $scope.pageSize,
						'businessId': $scope.white, //ChinaUnicom.Account.4G.BK
						'title': $scope.title,
						//'brandId': $scope.brandId
					}, function(data) {
						if (!data.body.pageCount == 0) {
							$scope.numlist = data.body.rows;
							//console.log($scope.numlist);
						}
						//当无数据时，修改文本值
						if (data.body.rows.length < $scope.pageSize) {
							$(".com_showmore a.more_btn").text("已无更多数据");
						}

					})
				},
				CBSS: function() {
					//获取用户配置的CBSS相关信息
					$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/Q_CBSS_INFO", '', function(data) {
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
								//$scope.interface.getCbssNumberList();
								$scope.interface.getCbssNumberList($scope.page, $scope.title, function(list,feeMoney) {
									if (list.length == 0) {
										//$("#number_list").html("");
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
				//CBSS 显示隐藏
				CBSS_hide: function() {
					$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/Q_CBSS_INFO", '', function(data) {
						if (data.header.code == 0 && data.body.rows.length > 0 && data.body.rows[0].CBSS_ID) {
							//has_cbss_info = true;
							$scope.CBSS_hide = 1;
						}
					});
				}
		}
		$scope.interface.numlist();
		$scope.interface.CBSS_hide();
		/*点击事件
		 *begin
		 */
		$scope.event = {
			next: function(id, number, busiId, brandId, fee) {
				$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~java/Number.lock", {
					"id": id
				}, function(data) {
					if (data.header.code == 0) {
						if (data.body.flag == "1") {
							$scope.form.numId = id;
							$scope.form.numTitle = number;
							$scope.form.numBusId = busiId;
							$scope.form.numBrandId = brandId;
							$scope.form.numFee = fee;
							$scope.form.feeMoney =fee;
							$scope.form.hy = 1;
							console.log($scope.form);

							//Local.saveStoreJson('form', $scope.form);
							if ($scope.form.goodCus == 1) {
								$scope.form.buy = 1;
								$scope.form.hand = 1;
								Local.saveStoreJson('form', $scope.form);
								location.href = '#/buyNumCard_net';
							} else {
								Local.saveStoreJson('form', $scope.form);
								location.href = '#/handleContract3/1';
							}

						}
					} else {
						alert("该号码已被占用，请重试");
					}
				})
			},

			chooseNum: function() {
				//页码为1
				$scope.page = 1;
				$scope.pageSize = 12;
				$scope.title = $('.search_text').val();
				if ($scope.type == '0') {
					$scope.interface.numlist();
				} else {
					$scope.interface.CBSS();
				}
			},

			cardType: function(type) {
				$(".com_showmore a.more_btn").text("点击加载更多");
				$scope.cardType = type; //卡类型：1白卡，2成卡
				$(".com_area .right a").removeClass('choiceon_btn');
				if (type == 1) {
					$(".com_area .right a:eq(0)").addClass('choiceon_btn');
					$scope.white = 'ChinaUnicom.Account.4G.BK';
				} else {
					$(".com_area .right a:eq(1)").addClass('choiceon_btn');
					$scope.white = 'ChinaUnicom.Account.4G.CK';
				}
				$scope.pageSize = 12;
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

			more: function() {
				$scope.pageSize += 10;
				if ($scope.type == '0') {
					$scope.interface.numlist();
				} else {
					$scope.interface.CBSS();
				}
			},

			cbsmore: function() {
				//$scope.pageSize += 4;
				//$scope.interface.CBSS_hide();
				//如果是成卡，则退出
				if ($scope.cardType == "2") {
					$scope.list = [];
					$(".com_showmore a.more_btn").text("CBSS无成卡号码");
					return;
				} else {
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
				}
			},

			sub: function(obj, type) {
				$(".com_showmore a.more_btn").text("点击加载更多");
				$scope.page = 1;
				$(".formlist a").removeClass('radiobtnon');
				$(obj.target).addClass('radiobtnon');
				$scope.type = type;
				if ($scope.type == '0') {
					$scope.interface.numlist();
				} else {
					if ($scope.cardType == "2") {
						$scope.list = [];
						$scope.numAndFee=[];
						$(".com_showmore a.more_btn").text("CBSS无成卡号码");
						return;
					} else {
						//号码全都是4G白卡
						$scope.form.numBusId = "ChinaUnicom.Account.4G.BK";
						$scope.interface.CBSS();
					}

				}
			},

			CBSS_next: function(numTitle,feeMoney) {
				$scope.form.numTitle = numTitle;
				$scope.form.feeMoney=feeMoney;
				Local.saveStoreJson('form', $scope.form);
				if ($scope.form.goodCus == 1) {
					$scope.form.buy = 1;
					$scope.form.hand = 1;
					Local.saveStoreJson('form', $scope.form);
					location.href = '#/buyNumCard_net';
				} else {
					Local.saveStoreJson('form', $scope.form);
					location.href = '#/handleContract3/1';
				}

			}
		}

		$rootScope.appTitle = "办合约";
	}
]);