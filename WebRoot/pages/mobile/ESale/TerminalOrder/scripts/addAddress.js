app.registerCtrl("addAddressCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		$scope.areaStr = {
				'username': '', //收货人
				'name': '', //地址名称
				'address': '', //收货地址
				'phone': '', //电话号码
				'email': '', //电子邮箱
				'selectProId': '', //省份id
				'selectCityId': '', //市id
				'selectDistrictId': '', //区ID
				'address_id':'',//地址ID
				'defaulte': '' //1为默认地址，0为非默认地址
			}
			//传过来是 1是修改 2是添加
		$scope.typeIf = Local.getStoreJson("typeIf");

		if ($scope.typeIf == 1) {
			console.info('修改的');
			$scope.form = Local.getStoreJson("info");
			$scope.areaStr.username = $scope.form.contacts;
			$scope.areaStr.name = $scope.form.name;
			$scope.areaStr.address = $scope.form.address;
			$scope.areaStr.phone = $scope.form.phone;
			$scope.areaStr.email = $scope.form.email;
			$scope.areaStr.selectProId = $scope.form.province_id;
			$scope.areaStr.selectCityId = $scope.form.city_id;
			$scope.areaStr.selectDistrictId = $scope.form.district_id;
			$scope.areaStr.defaulet = $scope.form.is_default;
			$scope.areaStr.address_id = $scope.form.address_id;

			$srhttp.get("!ESale/Mall/Member/~query/Member.Q_GET_ALL_AREA", {
				'province_id': $scope.form.province_id,
				'district_id': $scope.form.district_id,
				'city_id': $scope.form.city_id
			}, function(data) {
				$scope.areaName = data.body;
				for (var i = 0; i < $scope.areaName.provinceInfo.length; i++) {
					var item = $scope.areaName.provinceInfo[i];
					for (var k in item) {
						if (k == $scope.form.province_id) {
							$scope.areaPrp = item[k];
							break;
						}
					}
				}
				for (var i = 0; i < $scope.areaName.districtInfo.length; i++) {
					var item = $scope.areaName.districtInfo[i];
					for (var k in item) {
						if (k == $scope.form.district_id) {
							$scope.areaRegion = item[k];
							break;
						}
					}
				}
				for (var i = 0; i < $scope.areaName.cityInfo.length; i++) {
					var item = $scope.areaName.cityInfo[i];
					for (var k in item) {
						if (k == $scope.form.city_id) {
							$scope.areaCity = item[k];
							break;
						}
					}
				}
			});
			$scope.urlString = '!ESale/Mall/Member/~query/Member.Q_MODIFY_ADDRESS';
		} else {
			console.log('添加');
			$scope.urlString = '!ESale/Mall/Member/~query/Member.Q_ADD_ADDRESS';
		}


		/*
		 * 弹框begin
		 */
		$('#addressInput input').click(function() {
			$('#addressShade,.com_calendar').css('display', 'block');
		})
		$('.com_shade').click(function() {
			$('#addressShade,.com_calendar').css('display', 'none');
		})

		//打印省份
		$srhttp.get("!ESale/Mall/Member/~query/Member.Q_GET_ALL_PROVINCE", {}, function(data) {
			$scope.pro = data;
		});
		//选择省份显示市
		$scope.showCity = function() {
				$srhttp.get("!ESale/Mall/Member/~query/Member.Q_GET_ALL_CITY", {
					'province_id': $scope.areaStr.selectProId
				}, function(data) {
					$scope.city = data;

				});
			}
			//选择市显示区
		$scope.showArea = function() {
			$srhttp.get("!ESale/Mall/Member/~query/Member.Q_GET_ALL_DISTRICT", {
				'city_id': $scope.areaStr.selectCityId
			}, function(data) {
				$scope.district = data;
			});
		}

		$('.com_calendar .c_button').click(function() {
				if ($('.com_calendar .c_body select').find("option:selected").text() != '' && $scope.selectProId != 0 && $scope.selectCityId != 0 && $scope.selectDistrictId != 0) {
					$('#addressShade,.com_calendar').css('display', 'none');
					$scope.areaPrp = $('.year select').find("option:selected").text();
					$scope.areaCity = $('.month select').find("option:selected").text();
					$scope.areaRegion = $('.day select').find("option:selected").text();
					$('#areaPrp').val($scope.areaPrp);
					$('#areaCity').val($scope.areaCity);
					$('#areaRegion').val($scope.areaRegion);
				} else {
					alert('请填写完整地区！');
				}
			})
			/*
			 * 弹框end
			 */

		//是否默认begin
		$('.default a').click(function() {
			$('.default a').removeClass('radiobtnon');
			$(this).addClass('radiobtnon');
		});
		//是否默认end
		//提交
		$scope.cancel = function() {
			location.href = '#/address';
			$scope.form = '';
		}
		$scope.next = function() {
			if ($scope.areaRegion == '' || $scope.areaRegion == undefined) {
				alert('所在地区不完整！');
			}
			if ($scope.areaStr.username == '' || $scope.areaStr.username == undefined) {
				alert('收货人不能为空！');
			}
			if ($scope.areaStr.name == '' || $scope.areaStr.name == undefined) {
				alert('地址名称不能为空！');
			}
			if ($scope.areaStr.address == '' || $scope.areaStr.address == undefined) {
				alert('详细地址不能为空！');
			}
			if ($scope.areaStr.phone == '' || $scope.areaStr.phone == undefined) {
				alert('联系电话不能为空！');
			}
			if ($scope.areaStr.email == '' || $scope.areaStr.email == undefined) {
				alert('电子邮箱格式不正确！');
			}


			$scope.areaStr.defaulet = $('.default .radiobtnon').attr('def');

			if ($scope.typeIf == 1) {
				$srhttp.get($scope.urlString, {
					'name': $scope.areaStr.name,
					'city_id': $scope.areaStr.selectCityId,
					'province_id': $scope.areaStr.selectProId,
					'district_id': $scope.areaStr.selectDistrictId,
					'contacts': $scope.areaStr.username,
					'address': $scope.areaStr.address,
					'phone': $scope.areaStr.phone,
					'email': $scope.areaStr.email,
					'is_default': $scope.areaStr.defaulet,
					'address_id': $scope.areaStr.address_id
				}, function(data) {
					location.href = "#/address";
					$scope.form = '';
				});
			} else {
				$srhttp.get($scope.urlString, {
					'name': $scope.areaStr.name,
					'city_id': $scope.areaStr.selectCityId,
					'province_id': $scope.areaStr.selectProId,
					'district_id': $scope.areaStr.selectDistrictId,
					'contacts': $scope.areaStr.username,
					'address': $scope.areaStr.address,
					'phone': $scope.areaStr.phone,
					'email': $scope.areaStr.email,
					'is_default': $scope.areaStr.defaulet,
				}, function(data) {
					location.href = "#/address";
					$scope.form = '';
				});

			}


		}


		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		$rootScope.appTitle = "收货地址";

	}
]);