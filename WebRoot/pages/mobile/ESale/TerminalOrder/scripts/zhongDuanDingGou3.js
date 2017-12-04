app.registerCtrl("ZhongDuanDingGou3Ctrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		$rootScope.appTitle = "终端销售";

		//商品列表
		$scope.rows = [];

		//图片地址
		$scope.imgScr = APP_CONFIG.SERVER_URL + "!service/file/~java/Downloader.get?id=";
		$scope.imgHttp = APP_CONFIG.SERVER_URL;

		$scope.submitFlag = true; //如果没有传递carIds，则设置为false
		$scope.cuanHaoFlag=false;//因开始时，没有填写串号，所以没有提交权限

		$scope.params = {
			"carIds": [], //购物车ID数组
			"sureFee": "0", //订单价格
			"expressFee": "0", //邮费
			"addressId": "", //地址ID
			"note": "", //备注
			"contract":"",//合约产品
			"returnFee": "0" //返利金额
		}
		$scope.params.carIds = Local.getStore("carIds"); //传来的购物车ID数组
		var addressId = Local.getStore("addressId"); //传来的收货地址ID，可能为空

		$scope.address = {
			"id": "", //ID
			"area": "", //省市
			"address": "", //收货地址
			"contacts": "", //姓名
			"phone": "", //联系电话
			"email": "" //邮箱
		}

		$scope.rowsPhoneCuanHao = []; //串号输入框数量

		//需要支付价格=订单价+邮费
		$scope.finalMoney = function() {
			return Math.round((parseFloat($scope.params.sureFee) + parseFloat($scope.params.expressFee)) * 100) / 100;
		}

		//显示一条收货地址数据
		$scope.showAddress = function(data) {
			$scope.address.id = data['ID'];
			$scope.address.area = data['AREA'];
			$scope.address.address = data['ADDRESS'];
			$scope.address.contacts = data['CONTACTS'];
			$scope.address.phone = data['PHONE'];
			$scope.address.email = data['EMAIL'];
		}

		$scope.event = {
			blur: function(index, quantity) {
				var obj = $scope.rowsPhoneCuanHao[index];
				console.log("对象是：" + obj);
				console.log(obj);
				$scope.request.validSNStatus(obj, quantity);
			}
		}

		/*
		 * 接口访问类
		 */
		$scope.request = {

			//加载购物车列表
			loadCar: function() {
				//如果已经被提交过订单，则查不到购物车信息了,此时购物车数组为[]
				if ($scope.params.carIds == "") {
					alert("获取不到商品或已提交订单，请重新操作");
					$scope.submitFlag = false;
					return;
				}
				$srhttp.post("!ESale/Business/Terminal/~query/Q_CART_LIST", {
					"id": $scope.params.carIds
				}, function(data) {
					setTimeout(function() {
						if (data.header.code == 0) {
							$scope.rows = data.body.rows;
							//如果有购物车信息
							for (var i = 0; i < $scope.rows.length; i++) {
								//存储购物车的ID,数量，price_id,串号值，用来设置串号输入框的数量，其实这里拿到的ID，是price_id
								$scope.rowsPhoneCuanHao[i] = {
									"title": "",
									"id": "",
									"value": "",
									"quantity": "",
									"type_id":"",
									"sn_type":""
								};
								$scope.rowsPhoneCuanHao[i].title = $scope.rows[i].GOODS_TITLE;
								$scope.rowsPhoneCuanHao[i].id = $scope.rows[i].GOODS_ID;
								$scope.rowsPhoneCuanHao[i].quantity = $scope.rows[i].QUANTITY;
								$scope.rowsPhoneCuanHao[i].type_id =$scope.rows[i].TYPE_ID;
								$scope.rowsPhoneCuanHao[i].sn_type =$scope.rows[i].SN_TYPE;
								//邮费总价
								$scope.params.expressFee = parseFloat($scope.params.expressFee) + parseFloat($scope.rows[i].TERMINAL_EXPRESS_FEE * $scope.rows[i].QUANTITY);
								$scope.params.expressFee=0;//说是不需要邮费
								//订单总价
								$scope.params.sureFee = parseFloat($scope.params.sureFee) + parseFloat($scope.rows[i].FEE * $scope.rows[i].QUANTITY);
								$scope.params.sureFee = Math.round($scope.params.sureFee * 100) / 100; //格式化为小数点后2位
								//返利金额
								$scope.params.returnFee = parseFloat($scope.params.returnFee) + parseFloat($scope.rows[i].RETURN_FEES);
								//合约销售
								$scope.params.contract = $scope.rows[i].CONTRACT;



								/*if($scope.rowsPhoneCuanHao[i].type_id==5){
									$srhttp.post('!ESale/Business/Terminal/~query/new/Q_TERMINAL_CONTRACT_P',{id:$scope.rowsPhoneCuanHao[i].id},function(data){
										$scope.rowsPhoneCuanHao[i].contract=data.body.rows[0].PRO_ATTR_7;
									});
								}*/

								$scope.$apply();
							}
						}

					}, 10);
				});
			},
			/*checkShowSn:function(data){
				$srhttp.post('!ESale/Business/Terminal/~query/new/Q_TERMINAL_CONTRACT_P',{id:$scope.form2.detail_id},function(data){
					if(data.header.code!=0||data.body.rows[0].SN_TYPE==""){
						alert("抱歉，该终端无合约产品");
						return;
					}
				});
			},*/
			//检查串号是否正确
			validSNStatus: function(obj, quantity) {
				var id = obj.id;
				//串号非必填

				if (obj.value != '') {
					var list = obj.value.split(",");
					if (list.length == quantity) {
						$srhttp.post('!ESale/Business/Terminal/~query/Q_TERMINAL_SN_LIST_STATUS', {
							'sn': obj.value,
							'priceId': id,
							"quantity": quantity
						}, function(data) {
							if (data.header.code == 0) {
								if (data.body.rows.length == 0) {
									$("#SNN_" + id).empty().append('全部串号不可用');
									$scope.cuanHaoFlag = false;//不可提交
								} else if (data.body.rows.length == list.length) {
									$("#SNN_" + id).empty().append('全部串号可用');
									$scope.cuanHaoFlag = true;
								} else {
									var content = "";
									var arr = new Array();
									for (var j = 0; j < data.body.rows.length; j++) {
										arr.push(data.body.rows[j]["SN"]);
									}
									for (var j = 0; j < list.length; j++) {
										if (($.inArray(list[j], arr)) == -1) {
											if (content == "") {
												content += list[j];
											} else {
												content += "," + list[j];
											}
										}
									}
									$("#SNN_" + id).empty().append('串号' + content.substring(0, content.length - 1) + "不可用");
									$scope.cuanHaoFlag = false;//不可以提交
								}
							}
						}, null);
					} else {
						$("#SNN_" + id).empty().append('串号个数不匹配');
					}
				} else {
					if(obj.sn_type==0&&obj.value==""){
						$scope.cuanHaoFlag = true;
						$("#SNN_" + id).empty();
						return;
					}
					$("#SNN_" + id).empty().append('请录入串号');
				}
			},


			//加载所有收货地址
			loadAddressList: function(id) {
				$srhttp.get("!ESale/Mall/Member/~query/Member.Q_ADDRESS_LIST", {}, function(data) {
					if (data.header.code == 0) {
						$scope.address_rows = data.body.rows; //收货地址数组
						//console.log("收货地址---------------");
						//console.log($scope.address_rows);
						if ($scope.address_rows.length > 0) {
							if (id == '' || id == "undefined" || id == null) {
								$scope.showAddress($scope.address_rows[0]); //选中默认第一条收货地址
							} else {
								for (var i = 0; i < $scope.address_rows.length; i++) {
									if ($scope.address_rows[i]['ID'] == id) {
										$scope.showAddress($scope.address_rows[i]);
										break;
									}
								}
							}
						} else {
							//隐藏
						}
					}
				});
			},

			//创建订单
			creatOrder: function() {
				if ($scope.submitFlag == false) {
					alert("获取不到商品或已提交订单，请重新操作");
					return;
				}
				if($scope.cuanHaoFlag==false||$("input[name=message]").text()!=""){
					alert("请先填写正确的串号");
					return;
				}
				if ($scope.address.id == "" || $scope.address.id == "undefined" || $scope.address.id == null) {
					alert("请选择收货地址");
					return;
				}
				var params = {
					"id": $scope.params.carIds,
					payStatus: -1,
					surefee: $scope.params.sureFee, //订单价格
					expressFee: $scope.params.expressFee, //邮费
					EXPRESS_FEE: $scope.params.expressFee, //邮费
					ADDRESS_ID: $scope.address.id, //收货地址ID
					order_note: $scope.params.note, //备注
					businessId: "Terminal.Sale"
				}
				//将数据插进params
				for(var i=0;i<$scope.rowsPhoneCuanHao.length;i++){
					var key=$scope.rowsPhoneCuanHao[i].id;
					params[key]=$scope.rowsPhoneCuanHao[i].value;
				}
				//访问接口，创建订单
				$srhttp.post("!ESale/Business/Terminal/~java/Cart.createOrder", params, function(data) {
					try {
						if (data.header.code == 0) {
							alert("提交成功");
							hrefJump('orders');
						} else {
							alert("创建订单失败，请重新添加购物车");
						}
					} catch (e) {
						alert("出错" + e.message);
					}
					Local.saveStore("addressId", "");
				});
			}
		}

		$scope.request.loadCar();

		//获取设置的收货地址，如果为空，则显示默认查询到的收货地址的第一条记录

		$scope.request.loadAddressList(addressId);

		//校验是否需要输入串号

		//$scope.request.checkShowSn();
	}
]);