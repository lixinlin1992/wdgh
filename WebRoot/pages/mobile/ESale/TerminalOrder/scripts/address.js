app.registerCtrl("AddressCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {
		$('.com_shade').click(function() {
			$('#operate,#opShade').css('display', 'none');
		});
		
		$('.closed').click(function() {
			$('#operate,#opShade').css('display', 'none');
		});
		
		/*
		 * 长按begin
		 */
		var timeout='';
		$scope.downS = function(id) {
			timeout = setTimeout(function() {
				$('#operate,#opShade').css('display', 'block');
				$scope.addressId = id;
				console.log(id);
			}, 1000);
		}
		$scope.mouseUp=function(){
			clearTimeout(timeout);
		}
		/*
		 * 长按end
		 */

		$scope.aClick = function(obj) {
			$('.goods_detail .radiobtn').removeClass('radiobtnon');
			$(obj.target).addClass('radiobtnon');
			$scope.address_id = $(obj.target).attr('addressId');
			Local.saveStore("addressId", $scope.address_id);
			hrefJump('zhongDuanDingGou3');
		}

		$srhttp.get("!ESale/Mall/Member/~query/Member.Q_ADDRESS_LIST", {}, function(data) {
			console.log(data);
			$scope.rows = data.body.rows;

		});

		$scope.info = function(id) {
			$srhttp.get("!ESale/Mall/Member/~query/Member.Q_LOAD_ADDRESS_FORM", {
				'address_id': id
			}, function(data) {
				console.log(data);
				$scope.info = data.body;
				Local.saveStoreJson('typeIf', '1');
				Local.saveStoreJson('info', $scope.info);
				location.href = '#/addAddress';
			});
		}
		$scope.delAddress = function(id) {
				$srhttp.get("!ESale/Mall/Member/~query/Member.Q_DELETE_ADDRESS", {
					'address_id': id
				}, function(data) {
					$('#operate,#opShade').css('display', 'none');
					$srhttp.get("!ESale/Mall/Member/~query/Member.Q_ADDRESS_LIST", {}, function(data) {
						console.log(data);
						$scope.rows = data.body.rows;

					});
				});
			}
		$scope.defAddress = function(id) {
				$srhttp.get("!ESale/Mall/Member/~query/Member.Q_SET_DEFAULT_ADDRESS", {
					'address_id': id
				}, function(data) {
					$('#operate,#opShade').css('display', 'none');
					$srhttp.get("!ESale/Mall/Member/~query/Member.Q_ADDRESS_LIST", {}, function(data) {
						console.log(data);
						$scope.rows = data.body.rows;

					});
				});
			}
			//		$scope.addAddress=function(){
			//			Local.saveStoreJson('typeIf','2');
			//			location.href='#/addAddress';
			//		}
		addAddress = function() {
			Local.saveStoreJson('typeIf', '2');
			location.href = '#/addAddress';
		}

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		$rootScope.appTitle = "地址列表";


	}
]);