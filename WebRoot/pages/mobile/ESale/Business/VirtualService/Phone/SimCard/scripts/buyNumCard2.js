app.registerCtrl("BuyNumCardCtrl2", ["$scope", "$srhttp", "$rootScope", "$routeParams",
	function($scope, $srhttp, $rootScope, $routeParams) {
		$scope.form = Local.getStoreJson("form");
		//console.log($scope.form);
		$scope.aId = {
			'typeId': '',
			'nameId': '',
			'planId': '',
			'listId': '',
			'typeVal': '',
			'planVal': '',
			'listVal': '',
			'nameVal': '',
			'first_fee': '',
			'fee_config': '',
			'fee_init': '',
			'LLB': '',
			'YYB': '',
			'ZFB': '',
			'PERIODS': ''
		};
		$scope.interface = {
			packageType: function() {
					//如果是从办融合跳转过来的，此时type!=1，需要重新获取
					if ($routeParams.type != 1) {
						$scope.form = Local.getStoreJson("form");
					}

					$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_DK_PACKAGE_TYPE", {
						'id': $scope.form.goodsId
					}, function(data) {
						$scope.pkType = data.body.rows;
						if ($scope.aId.typeId == '') {
							$scope.aId.typeId = $scope.pkType[0].ID;
							$scope.aId.typeVal = $scope.pkType[0].Name;
						}
						$scope.interface.packageName();
					})
				},
				packageName: function() {
					$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_DK_PACKAGE_NAME", {
						'id': $scope.form.goodsId,
						'package_type': $scope.aId.typeId
					}, function(data) {
						$scope.pkName = data.body.rows;
						if ($scope.pkName.length > 0) {
							if ($scope.aId.nameId == '') {
								$scope.aId.nameId = $scope.pkName[0].ID;
								$scope.aId.nameVal = $scope.pkName[0].NAME;
								$scope.aId.first_fee = $scope.pkName[0].FIRST_FEE;
								$scope.aId.fee_init = $scope.pkName[0].FEE_INIT;
								$scope.aId.fee_config = $scope.pkName[0].FEE;
								$scope.aId.LLB = $scope.pkName[0].LLB;
								$scope.aId.YYB = $scope.pkName[0].YYB;
								$scope.aId.PERIODS = $scope.pkName[0].PERIODS;
								if ($scope.pkName[0].ZFB) {
									$scope.aId.ZFB = $scope.pkName[0].ZFB;
								}
								if ($scope.pkName[0].PERIODS) {
									$scope.aId.PERIODS = $scope.pkName[0].PERIODS;
								}
							}
							$scope.interface.packagePlan();
						} else {
							alert('此产品没有对应套餐');
							return;
						}

					})
				},
				packagePlan: function() {
					$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/common/Q_PACKAGE_CONFIG_PLAN", {
						'package_id': $scope.aId.nameId
					}, function(data) {
						$scope.pkPlan = data.body.rows;
						if ($scope.pkPlan.length > 0) {
							if ($scope.aId.planId == '') {
								$scope.aId.planId = $scope.pkPlan[0].ID;
								$scope.aId.planVal = $scope.pkPlan[0].NAME;
							}
							$scope.interface.dinnerList();
						} else {
							alert('此产品没有对应套餐');
							return;
						}
					})
				},
				dinnerList: function() {
					$srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_DINNER_DETAIL_LIST", {
						package_id: $scope.aId.planId
					}, function(data) {
						$scope.dinnerList = data.body.rows;
						setTimeout(function() {
							$scope.$apply(function() {
								$scope.interface.chooseOne();
							})
						}, 10);


					})
				},
				chooseOne: function() {

					var typeId = "a[typeId='" + $scope.aId.typeId + "']";
					var nameId = "a[nameId='" + $scope.aId.nameId + "']";
					var planId = "a[planId='" + $scope.aId.planId + "']";
					//var listId = "a[listId='" + $scope.aId.listId + "']";
					$(typeId).addClass('com_selectbtnon');
					$(nameId).addClass('com_selectbtnon');
					$(planId).addClass('com_selectbtnon');
					//$(listId).addClass('com_selectbtnon');
					$scope.aId.typeVal = $("#type .com_selectbtnon").text();
					$scope.aId.nameVal = $("#name .com_selectbtnon").text();
					$scope.aId.planVal = $("#plan .com_selectbtnon").text();

					if ($scope.pkType.length == 1 && $scope.pkName.length == 1 && $scope.pkPlan.length == 1) {
						if($routeParams.type==1){
							$scope.event.next();
						}else{
							$scope.event.yiWangNext();
						}
					}
				}
		}

		//TODO linchuangrong:如果type==1，则执行买号卡，否则，走“办融合”的事件
		if ($routeParams.type == 1) {
			$scope.interface.packageType();
			$("a[listId='CU.4G.GDLOCAL.50.P1']").addClass('com_selectbtnon');
			$rootScope.appTitle = "买号卡";
		} else {
			console.log("买号卡的套餐，此处进入办融合的事件处理......");
			dk_packageType = $scope.interface.packageType;
			$("a[listId='CU.4G.GDLOCAL.50.P1']").addClass('com_selectbtnon');
		}

		$scope.event = {
			next: function() {
				$scope.form = jQuery.extend($scope.form, $scope.aId);
				//console.log($scope.form);
				Local.saveStoreJson('form', $scope.form);
				location.href = '#/buyNumCard3';
			},
			
			//TODO linchuangrong:选完单卡套餐，点击下一步事件，回到rongHe2界面
			yiWangNext:function(){
				console.log("回到'办融合'的界面......");
				$scope.form = jQuery.extend($scope.form, $scope.aId);//将两个对象的参数，合并成一个
				Local.saveStoreJson("yiWangPackage",$scope.form);
				//回到原界面
                saveYiWangInfo(); //这个方法，来自rongHe2.js
			},
			
			btnon: function(obj) {
				$(obj.currentTarget.parentElement).find('a').removeClass('com_selectbtnon');
				$(obj.target).addClass('com_selectbtnon');
				$scope.aId.typeVal = $("#type .com_selectbtnon").text();
				$scope.aId.nameVal = $("#name .com_selectbtnon").text();
				$scope.aId.planVal = $("#plan .com_selectbtnon").text();
				$scope.aId.typeId = $("#type .com_selectbtnon").attr('typeId');
				$scope.aId.nameId = $("#name .com_selectbtnon").attr('nameId');
				$scope.aId.planId = $("#plan .com_selectbtnon").attr('planId');

				$scope.aId.first_fee = $("#name .com_selectbtnon").attr('first_fee');
				$scope.aId.fee_init = $("#name .com_selectbtnon").attr('fee_init');
				$scope.aId.fee_config = $("#name .com_selectbtnon").attr('fee_config');
				$scope.aId.LLB = $("#name .com_selectbtnon").attr('LLB');
				$scope.aId.YYB = $("#name .com_selectbtnon").attr('YYB');
				$scope.aId.ZFB = $("#name .com_selectbtnon").attr('ZFB');
				$scope.aId.PERIODS = $("#name .com_selectbtnon").attr('PERIODS');
			},
			typeBtn: function() {
				$scope.aId.nameVal = '';
				$scope.aId.planVal = '';
				$scope.aId.nameId = '';
				$scope.aId.planId = '';
				$scope.interface.packageType();
			},
			nameBtn: function() {
				$scope.aId.planVal = '';
				$scope.aId.planId = '';
				$scope.interface.packageName();
			},
			planBtn: function() {
				$scope.aId.listVal = '';
				$scope.aId.listId = '';
				$scope.interface.packagePlan();
			}

		}
	}
])