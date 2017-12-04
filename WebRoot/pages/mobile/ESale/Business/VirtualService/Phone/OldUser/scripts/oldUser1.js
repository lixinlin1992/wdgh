app.registerCtrl("OldUser1Ctrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		
		$rootScope.appTitle = "老用户";
		replaceClass("home");
		
		$scope.form = {
			goodsId: '',
			goodsName: '',
			goodsPackgeId: '',
			goodsFee: '',
			goodCus: ''
		};
		//筛选产品
		$scope.form.brandId = '';
		$scope.form.brandVal = '';
		$scope.form.acti_type_id = '';
		$scope.form.acti_type_val = '';

		$scope.form.netId = '';
		$scope.form.netVal = '';
		$scope.pageSize = 6;

		$(window).resize(function() {
			$scope.imgY = Math.ceil($('.goodsshow img').width() * 13 / 9);
			$(".goodsshow img").height($scope.imgY);
			$(".goodsshow").height($scope.imgY);
		});
		/*接口事件
		 *begin
		 */
		$scope.interface = {
			//品牌
			brand: function() {
					$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_BRAND_LIST", {}, function(data) {
						$scope.brand = data.body.rows;
						$scope.interface.net();
					})
				},
				//网络2G3G4G
				net: function() {
					$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_NETWORK_LIST", {
						brand_id: $scope.form.brandId
					}, function(data) {
						$scope.net = data.body.rows;
						$scope.interface.policy();
					})
				},
				//套餐
				policy: function() {
					$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/acti/Q_CONTRACT_ACTI_TYPE", {
						brand_id: $scope.form.brandId,
						filter: true
					}, function(data) {
						$scope.policy = data.body.rows;
						$scope.interface.hy_info();
					})
				},
				//产品
				hy_info: function() {

					$scope.hy = {
						'pageSize': $scope.pageSize,
						'brand_id': $scope.form.brandId,
						'package_id': $scope.form.netId,
						'acti_type': $scope.form.acti_type_id,
						'is_cus': 0
					}

					$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_HY_PRODUCT",
						$scope.hy,
						function(data) {
							if (data.body.pageCount != 0) {
								$scope.hyProduct = data.body.rows;
								$scope.firstFired = true;
								$scope.selectLast = function(index) {
									if (index == $scope.hyProduct.length - 1) {
										if ($scope.firstFired) {
											$scope.firstFired = false;
											$scope.imgY = Math.ceil($('.goodsshow img').width() * 13 / 9);
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
								if ($scope.pageSize - 6 > $scope.hyProduct.length) {
									$(".com_showmore a.more_btn").text("没有更多数据");
								}
							} else {
								$scope.hyProduct = '';
								$(".com_showmore a.more_btn").text("没有匹配数据");
							}
						});
				}

		}

		/*接口事件
		 *end
		 */

		$scope.interface.brand();

		$scope.imgScr = APP_CONFIG.SERVER_URL + "!service/file/~java/Downloader.get?id=";


		/*点击事件
		 *begin
		 */
		$scope.event = {
			next: function() {
				if ($scope.form.goodsId == '') {
					alert('请选择商品');
					return;
				}
				Local.saveStoreJson('form', $scope.form);

				location.href = '#/oldUser2';
			},

			//linchuangrong:做融合的移网功能，特殊下一步
			productOver_next: function() {
				if ($scope.form.goodsId == '') {
					alert('请选择商品');
					return;
				}
				Local.saveStoreJson('form', $scope.form);

				//rongHe2.js里的方法，选中产品后
				selectRongHeProduct();
			},

			btnon: function(obj) {
				$(obj.currentTarget.parentElement).find('a').removeClass('com_selectbtnon');
				$(obj.target).addClass('com_selectbtnon');

				$scope.form.brandVal = $("#brand .com_selectbtnon").text();
				$scope.form.brandId = $("#brand .com_selectbtnon").attr('brandId');

				$scope.form.netVal = $("#net .com_selectbtnon").text();
				$scope.form.netId = $("#net .com_selectbtnon").attr('netId');

				$scope.form.acti_type_val = $("#policy .com_selectbtnon").text();
				$scope.form.acti_type_id = $("#policy .com_selectbtnon").attr('netId');

				$scope.pageSize = 6;
			},
			brand: function() {
				$scope.interface.net();
				$('#net div:eq(0) a').addClass('com_selectbtnon');
				$('#policy div:eq(0) a').addClass('com_selectbtnon');
				$scope.form.netId = '';
				$scope.form.netVal = '全部';
				$scope.form.acti_type_id = '';
				$scope.form.acti_type_val = '全部';
				$(".com_showmore a.more_btn").text("显示更多数据");
			},
			net: function() {
				$scope.interface.hy_info();
				$(".com_showmore a.more_btn").text("显示更多数据");
			},
			policy: function() {
				$scope.interface.hy_info();
				$(".com_showmore a.more_btn").text("显示更多数据");
			},
			goods: function(obj, id, name, packgeId, fee, cus, brand_id, cardFee) {
				if ($(obj.currentTarget.children[0]).hasClass('active')) {
					$(obj.currentTarget.children[0]).removeClass('active');
					$(obj.currentTarget.children[0].children[0]).hide();
					$scope.form.goodsId = '';
					$scope.form.goodsName = '';
					$scope.form.goodsPackgeId = '';
					$scope.form.goodsFee = '';
					$scope.form.goodCus = '';
					$scope.form.brandId = '';
				} else {
					$('.com_smallgoodslist .row .com_smallgoods').removeClass('active');
					$('.com_smallgoodslist .row .choiced').hide();
					$(obj.currentTarget.children[0]).addClass('active');
					$(obj.currentTarget.children[0].children[0]).show();
					$scope.form.goodsId = id;
					$scope.form.goodsName = name;
					$scope.form.goodsPackgeId = packgeId;
					$scope.form.goodsFee = fee;
					$scope.form.goodCus = cus;
					$scope.form.brandId = brand_id;

					$scope.form.card_fee = cardFee;
					//console.log("卡费应收：" + $scope.form.card_fee);
				}
				//console.log($scope.form);
			},

			more: function() {
				$scope.pageSize += 6;
				$scope.interface.hy_info();
				if ($scope.pageSize - 6 > $scope.hyProduct.length) {
					$(".com_showmore a.more_btn").text("没有更多数据");
				}
			},

		}

	}
]);