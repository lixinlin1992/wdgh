app.registerCtrl("HandleContractCtrl3", ["$scope", "$srhttp", "$rootScope", "$routeParams",
	function($scope, $srhttp, $rootScope, $routeParams) {
		$scope.form = {};
		$scope.index = 0;

		$scope.interface = {
			acti: function() {
					//因为是从移网跳转到这页面的，所以需要重新获取form
					$scope.form = Local.getStoreJson('form');
					$scope.form.actiId = '';
					$scope.form.actiVal = '';
					$scope.form.acti_nameId = '';
					$scope.form.acti_nameVal = '';
					$scope.form.first_fee = '';
					$scope.form.typeId = '';
					$scope.form.typeVal = '';
					$scope.form.nameId = '';
					$scope.form.nameVal = '';
					$scope.form.feeId = '';
					$scope.form.feeVal = '';
					$scope.form.first_fee = '';
					$scope.form.fee_init = '';
					$scope.form.fee_config = '';
					$scope.form.planId = '';
					$scope.form.planVal = '';
					$scope.form.LLB = '';
					$scope.form.YYB = '';
					$scope.form.ZFB = '';
					$scope.form.PERIODS = '';
					$srhttp.get('!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_HY_ACTI_TYPE', {
						id: $scope.form.goodsId
					}, function(data) {
						$scope.acti = data.body.rows;
						if ($scope.acti.length > 0) {
							if ($scope.form.actiId == '') {
								$scope.form.actiId = $scope.acti[0].ID;
							}
							if ($scope.form.actiId == "CU.CUNFEISONGFEI" || $scope.form.actiId == "CU.CUNFEISONGYEWU") {
								$scope.interface.acti_name();
							} else {
								$scope.interface.type();
							}

						} else {
							alert('此产品没有套餐可选！');
						}
					})
				},

				acti_name: function() {
					$srhttp.get('!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_DKHY_ACTI_NAME', {
						id: $scope.form.goodsId,
						acti_type: $scope.form.actiId
					}, function(data) {
						$scope.acti_name = data.body.rows;
						if ($scope.acti_name.length > 0) {
							if ($scope.form.acti_nameId == "") {

								$scope.form.acti_nameId = $scope.acti_name[0].ID;
							}
							$scope.interface.type();
						} else {
							alert('此产品没有套餐可选！');
						}
					})
				},
				type: function() {
					if ($scope.form.actiId == "CU.CUNFEISONGFEI" || $scope.form.actiId == "CU.CUNFEISONGYEWU") {
						$scope.src = '!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_DKHY_PACKAGE_TYPE';
					} else {
						$scope.src = '!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_HY_PACKAGE_TYPE';
					}
					$srhttp.get($scope.src, {
						id: $scope.form.goodsId,
						acti_type: $scope.form.actiId,
						acti_name: $scope.form.acti_nameId,
					}, function(data) {
						$scope.type = data.body.rows;
						if ($scope.type.length > 0) {
							if ($scope.form.typeId == '') {
								$scope.form.typeId = $scope.type[0].ID;
							}
							$scope.interface.name();
						} else {
							alert('此产品没有套餐可选！');
						}
						//$scope.interface.chooseOne();
					})
				},

				name: function() {
					if ($scope.form.actiId == "CU.CUNFEISONGFEI" || $scope.form.actiId == "CU.CUNFEISONGYEWU") {
						$scope.src2 = '!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_DKHY_PACKAGE_NAME';
					} else {
						$scope.src2 = '!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_HY_PACKAGE_NAME';
					}
					$srhttp.get($scope.src2, {
						id: $scope.form.goodsId,
						acti_type: $scope.form.actiId,
						package_type: $scope.form.typeId,
						acti_name: $scope.form.acti_nameId,
						//and a.act_name=[acti_name]
					}, function(data) {
						$scope.name = data.body.rows;
						if ($scope.name.length > 0) {
							if ($scope.form.nameId == '') {
								$scope.form.nameId = $scope.name[0].ID;
								/*$scope.form.first_fee = $scope.name[0].FIRST_FEE;
								$scope.form.LLB = $scope.name[0].LLB;
								$scope.form.YYB = $scope.name[0].YYB;

								if ($scope.name[0].ZFB) {
									$scope.form.ZFB = $scope.name[0].ZFB;
								}*/

							}
							$scope.interface.fee();
						} else {
							alert('此产品没有套餐可选！');
						}
						//$scope.interface.chooseOne();
					})
				},

				fee: function() {
					$srhttp.get('!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_HY_FEE', {
						id: $scope.form.goodsId,
						acti_type: $scope.form.actiId,
						package_type: $scope.form.typeId,
						package_name: $scope.form.nameId
					}, function(data) {
						$scope.fee = data.body.rows;
						if ($scope.fee.length > 0) {
							$scope.form.feeId = $scope.fee[0].ID;
							$scope.form.feeVal = $scope.fee[0].NAME;
							$scope.form.fee_config = $scope.fee[0].FEE;
							$scope.form.fee_init = $scope.fee[0].FEE_INIT;
							$scope.form.first_fee = $scope.fee[0].FIRST_FEE;
							$scope.form.LLB = $scope.fee[0].LLB;
							$scope.form.YYB = $scope.fee[0].YYB;

							//console.log("语音包"+$scope.form.YYB);

							if ($scope.fee[0].ZFB) {
								$scope.form.ZFB = $scope.fee[0].ZFB;
							}
							if ($scope.fee[0].PERIODS) {
								$scope.form.PERIODS = $scope.fee[0].PERIODS;
							}
							$scope.interface.plan();
						} else {
							alert('此产品没有套餐可选！');
						}
						//$scope.interface.chooseOne();
					})
				},

				plan: function() {
					$srhttp.get('!ESale/Business/VirtualService/Phone/SimCard/~query/portal/common/Q_PACKAGE_CONFIG_PLAN', {
						package_id: $scope.form.nameId
					}, function(data) {
						$scope.plan = data.body.rows;
						if ($scope.plan.length > 0) {
							if ($scope.form.planId == '')
								$scope.form.planId = $scope.plan[0].ID;
							$scope.interface.dinner();
						} else {
							alert('此产品没有套餐可选！');
						}
						//$scope.interface.chooseOne();
					})
				},

				dinner: function() {
					$srhttp.get('!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_DINNER_DETAIL_LIST', {
						package_id: $scope.form.planId
					}, function(data) {
						$scope.dinner = data.body.rows;
						if ($scope.dinner.length > 0) {

						} else {
							//alert('此产品没有套餐可选！');
						}
						$scope.interface.chooseOne();
					})
				},

				//选择按钮
				chooseOne: function() {

					var acti = "a[actiId='" + $scope.form.actiId + "']";
					$(acti).addClass('com_selectbtnon');
					$scope.form.actiVal = $('#acti .com_selectbtnon').text();
					var acti_name = "a[acti_nameId='" + $scope.form.acti_nameId + "']";
					$(acti_name).addClass('com_selectbtnon');
					$scope.form.acti_nameVal = $('#acti_name .com_selectbtnon').text();
					var type = "a[typeId='" + $scope.form.typeId + "']";
					$(type).addClass('com_selectbtnon');
					$scope.form.typeVal = $('#type .com_selectbtnon').text();

					var name = "a[nameId='" + $scope.form.nameId + "']";
					$(name).addClass('com_selectbtnon');
					$scope.form.nameVal = $('#name .com_selectbtnon').text();

					var fee = "a[feeId='" + $scope.form.feeId + "']";
					$(fee).addClass('com_selectbtnon');
					$scope.form.feeNote = $('#feeVal .com_selectbtnon').text();

					$scope.form.feeVal = $('#feeVal .com_selectbtnon').text();

					var plan = "a[planId='" + $scope.form.planId + "']";
					$(plan).addClass('com_selectbtnon');
					$scope.form.planVal = $('#plan .com_selectbtnon').text();



					if ($scope.acti_name) {
						if ($scope.acti.length == 1 && $scope.type.length == 1 && $scope.acti_name.length == 1 && $scope.name.length == 1 && $scope.fee.length == 1 && $scope.plan.length == 1) {
							if ($routeParams.type == '1') {
								//type=1代表是办合约自己的页面，否则是办融合那边跳转来的
								$scope.event.next();
							} else {
								//回到融合界面
								$scope.event.packageOver_next();
							}
						}
					} else {
						if ($scope.acti.length == 1 && $scope.type.length == 1 && $scope.name.length == 1 && $scope.fee.length == 1 && $scope.plan.length == 1) {
							if ($routeParams.type == '1') {
								//type=1代表是办合约自己的页面，否则是办融合那边跳转来的
								$scope.event.next();
							} else {
								//回到融合界面
								$scope.event.packageOver_next();
							}
						}
					}
				}
		}


		//linchuangrong:合约界面功能，或者融合功能的判断，type=1代表合约，否则是融合
		try {
			//1代表是办合约自己的页面
			if ($routeParams.type == '1') {
				$scope.interface.acti();
				$rootScope.appTitle = "办合约";
			} else {
				//如果type不等于1，说明acti_yiWang一定存在
				acti_yiWang = $scope.interface.acti;
			}
		} catch (e) {
			$scope.interface.acti();
			$rootScope.appTitle = "办合约";
		}

		$scope.event = {
			next: function() {
				Local.saveStoreJson('form', $scope.form);
				//console.log($scope.form);
				if ($scope.form.actiId == '' || $scope.form.actiId == undefined ||
					$scope.form.typeId == '' || $scope.form.typeId == undefined ||
					$scope.form.nameVal == '' || $scope.form.nameVal == undefined ||
					$scope.form.planId == '' || $scope.form.planId == undefined
				) {
					alert('套餐还没选择完整！');
					return;
				}
				//console.log($scope.form);
				location.href = '#/handleContract4';
			},

			//linchuangrong:移网功能模块下的，套餐选完，进行下一步
			packageOver_next: function() {
				if ($scope.form.actiId == '' || $scope.form.actiId == undefined ||
					$scope.form.typeId == '' || $scope.form.typeId == undefined ||
					$scope.form.nameVal == '' || $scope.form.nameVal == undefined ||
					$scope.form.planId == '' || $scope.form.planId == undefined
				) {
					alert('套餐还没选择完整！');
					return;
				}
				Local.saveStoreJson('yiWangPackage', $scope.form);
				//回到原界面
				saveYiWangInfo(); //这个方法，来自rongHe2.js
			},

			btnon: function(obj) {
				$(obj.currentTarget.parentElement).find('a').removeClass('com_selectbtnon');
				$(obj.target).addClass('com_selectbtnon');

				$scope.form.acti_nameVal = $(obj.target).text();
				$scope.form.acti_nameId = $(obj.target).attr('acti_nameid');


				$scope.form.actiVal = $("#acti .com_selectbtnon").text();
				$scope.form.actiId = $("#acti .com_selectbtnon").attr('actiId');

				$scope.form.typeId = $("#type .com_selectbtnon").attr('typeId');
				$scope.form.typeVal = $("#type .com_selectbtnon").text();

				$scope.form.nameId = $("#name .com_selectbtnon").attr('nameId');
				$scope.form.nameVal = $("#name .com_selectbtnon").text();

				$scope.form.planId = $("#plan .com_selectbtnon").attr('planId');
				$scope.form.planVal = $("#plan .com_selectbtnon").text();

				$scope.form.fee_init = $("#feeVal .com_selectbtnon").attr('fee_init');
				$scope.form.fee_config = $("#feeVal .com_selectbtnon").attr('fee_config');

				$scope.form.first_fee = $("#feeVal .com_selectbtnon").attr('first_fee');
				$scope.form.LLB = $("#feeVal .com_selectbtnon").attr('LLB');
				$scope.form.YYB = $("#feeVal .com_selectbtnon").attr('YYB');
				$scope.form.ZFB = $("#feeVal .com_selectbtnon").attr('ZFB');
				$scope.form.PERIODS = $("#feeVal .com_selectbtnon").attr('PERIODS');
			},
			//点击按钮重新调用接口
			acti: function() {
				$scope.form.acti_name = '';
				$scope.form.typeId = '';
				$scope.form.nameId = '';
				$scope.form.feeId = '';
				$scope.form.fee_init = '';
				$scope.form.fee_config = '';
				$scope.form.planId = '';
				//$scope.interface.acti();
				if ($scope.form.actiId == "CU.CUNFEISONGFEI" || $scope.form.actiId == "CU.CUNFEISONGYEWU") {
					$scope.interface.acti_name();
				} else {
					$scope.interface.type();
				}
				//console.log($scope.form);
			},
			acti_name: function() {
				$scope.form.typeId = '';
				$scope.form.nameId = '';
				$scope.form.feeId = '';
				$scope.form.fee_init = '';
				$scope.form.fee_config = '';
				$scope.form.planId = '';
				$scope.interface.type();
			},
			type: function() {
				$scope.form.nameId = '';
				$scope.form.feeId = '';
				$scope.form.fee_init = '';
				$scope.form.fee_config = '';
				$scope.form.planId = '';
				//$scope.interface.type();
				$scope.interface.name();
			},
			name: function() {
				$scope.form.feeId = '';
				$scope.form.planId = '';
				$scope.interface.fee();
				$scope.interface.plan();
			},
			plan: function() {
				$scope.interface.dinner();
			},
			fee: function(index) {
				//$scope.interface.fee();
				$scope.index = index;
				$scope.form.feeVal = $('#feeVal .com_selectbtnon').text();
				$scope.form.first_fee = $('#feeVal .com_selectbtnon').attr('first_fee');
			}
		}


	}
]);