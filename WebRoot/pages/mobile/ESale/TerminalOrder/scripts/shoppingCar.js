app.registerCtrl("ShoppingCarCtrl", ["$scope", "$srhttp", "$rootScope",
	function($scope, $srhttp, $rootScope) {

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		$rootScope.appTitle = "终端销售";

		//存储购物车数据
		$scope.rows = [];
		//合计总价
		$scope.finalMoney = 0;

		//图片地址
		$scope.imgScr = APP_CONFIG.SERVER_URL + "!service/file/~java/Downloader.get?id=";
		$scope.imgHttp = APP_CONFIG.SERVER_URL;

		$scope.edit = {
			index: "", //下标
			color: "", //颜色
			ram: "", //内存容量
			GOODS_ID: "", //手机ID
			oldQuantity: "", //旧数量
			QUANTITY: "" //新数量
		}

		$scope.arrays = [];

		//选中商品的总价
		$scope.money_count = function() {
			setTimeout(function() {
				$scope.$apply(function() {
					var size = $("#shoppingCarDiv .com_checkoxon").size();
					$scope.finalMoney = 0;
					for (var index = 0; index < size; index++) {
						try {
							//console.log("当前下标是" + index);
							var price = $("#shoppingCarDiv .com_checkoxon").eq(index).parent().find(".price span:eq(0)").attr("data");
							var quantity = $("#shoppingCarDiv .com_checkoxon").eq(index).parent().find(".price span:eq(1)").attr("data");
							var money = (price * quantity);
							$scope.finalMoney += money;
							$scope.finalMoney = Math.round($scope.finalMoney * 100) / 100; //格式化为小数点后2位
						} catch (e) {
							console.log(e.message);
						}
					}
				});
			}, 1);
		}

		/*
		 * 接口访问
		 */
		$scope.request = {
			//加载购物车列表 
			loadCar: function() {
				$srhttp.post("!ESale/Business/Terminal/~query/Q_CART_LIST", {type_id:"2,5"}, function(data) {
					try {
						if (data.header.code == 0) {
							$scope.rows = data.body.rows;
							//钩选之前选中的商品
							setTimeout(function() {
								for (var j = 0; j < $("#shoppingCarDiv .com_checkox").size(); j++) {
									if ($scope.arrays.indexOf($("#checkBox_" + j).attr("data")) > -1) {
										//刷新
										$scope.$apply();
										//模拟点击
										//$("#checkBox_"+j).trigger('click');
										angular.element('#checkBox_' + j).trigger('click');
									}
								}
							}, 300);


							//刷新总价格
							$scope.money_count();
						}
					} catch (e) {
						alert("出错" + e.message);
					}
				});
			},

			//修改购物车数量
			loadUpdateQuantity: function(goodsId, quantity) {
				$srhttp.post("!ESale/Business/Terminal/~java/Cart.add", {
					"goodsId": goodsId,
					"quantity": quantity,
					"type_id": 2
				}, function(data) {
					try {
						if (data.header.code == 0) {
							//刷新购物车列表
							$scope.request.loadCar();
						} else {
							alert("修改出错");
						}
						$("#editBox").hide();
						$("#shadeDiv2").hide();
					} catch (e) {
						alert("出错");
					}
				});
			}
		}

		//加载列表 
		$scope.request.loadCar();


		/*
		 * 事件处理
		 */
		$scope.event = {

			//选中所有框
			allCheckBox: function() {

				if ($("#allCheckBox").hasClass("com_checkoxon")) {
					$("#allCheckBox").removeClass("com_checkoxon");
					$("#shoppingCarDiv .com_checkox").removeClass("com_checkoxon");
				} else {
					$("#allCheckBox").addClass("com_checkoxon");
					$("#shoppingCarDiv .com_checkox").addClass("com_checkoxon");
				}

				//先清空数组
				$scope.arrays = [];
				//将数组插进数组，用来记忆选中打钩的商品
				var size = $("#shoppingCarDiv .com_checkoxon").size();
				for (var index = 0; index < size; index++) {
					try {
						var param = $("#shoppingCarDiv .com_checkoxon").eq(index).attr("data");
						$scope.arrays.push(param);
					} catch (e) {
						alert("出错" + e.message);
					}
				}
				console.log($scope.arrays);

				//刷新总价
				$scope.money_count();
			},

			//选中商品
			select: function(index) {
				//删除掉allCheckBox的选中状态
				$("#allCheckBox").removeClass("com_checkoxon");
				var data = $("#shoppingCarDiv .com_checkox").eq(index).attr("data"); //存储的购物车ID
				if ($("#shoppingCarDiv .com_checkox").eq(index).hasClass("com_checkoxon")) {
					$("#shoppingCarDiv .com_checkox").eq(index).removeClass("com_checkoxon");
					//获取该元素在数组中的下标
					var arrayIndex = $scope.arrays.indexOf(data);
					//console.log("下标是：" + arrayIndex);
					$scope.arrays.splice(arrayIndex, 1); //根据下标，删除该元素
				} else {
					$("#shoppingCarDiv .com_checkox").eq(index).addClass("com_checkoxon");
					//如果数组里没有这个元素，则将购物车ID存进数组，使页面编辑刷新后，可以自动重新钩选之前打钩的商品
					if ($scope.arrays.indexOf(data) < 0) {
						//添加元素
						$scope.arrays.push($("#shoppingCarDiv .com_checkox").eq(index).attr("data"));
					}
				}

				//刷新总价
				$scope.money_count();
			},

			//编辑商品数量
			editBox: function(index, color, ram, goodsId, oldQuantity) {
				//赋值
				$scope.edit.index = index;
				$scope.edit.color = color;
				$scope.edit.ram = ram;
				$scope.edit.GOODS_ID = goodsId;
				$scope.edit.oldQuantity = oldQuantity;
				$scope.edit.QUANTITY = oldQuantity;

				//显示
				$("#editBox").show();
				$("#shadeDiv2").show();
			},

			//添加一个数量
			addOneCar: function(index) {
				$scope.edit.QUANTITY++;
			},

			//减少一个数量
			removeOneCar: function(index) {
				$scope.edit.QUANTITY--;
				if ($scope.edit.QUANTITY <= 0) {
					$scope.edit.QUANTITY = 1;
				}
			},

			//修改购物车事件,(count代表 "增加/删除"的数量)
			updateCar: function(goodsId, count, add_remove) {

				var quantity = '1';

				//如果有值，说明点击了  + -  按钮 
				if (add_remove == "+" || add_remove == "-") {
					quantity = "" + add_remove + '1';
				} else if (add_remove == 'all') {
					quantity = '0'; //添加数量为0时，会将所有数量清空，也就是删除商品
				} else {
					quantity = count;
				}

				//执行修改购物车数量
				$scope.request.loadUpdateQuantity(goodsId, quantity);
			},

			//失去焦点
			input_blur: function(index) {
				var newValue = $("#quantity_" + index).val();
				console.log(newValue);
				if (isNaN(newValue) || newValue <= 0) {
					alert("请输入正确的数字");
				}
			},

			//修改购物车里商品的数量，触发接口，修改数据库
			updateQuantity: function(index, oldValue, goodsId) {
				var newValue = $("#quantity_" + index).val();
				console.log("旧值：" + oldValue);
				console.log("新值：" + newValue);
				//新值，旧值相等，则什么事也不处理
				if (newValue == oldValue) {
					$("#shadeDiv2").hide();
					$("#editBox").hide();
					return false;
				}
				//如果是非数字
				if (isNaN(newValue) || newValue <= 0) {
					alert("请输入正确的数字");
					$("#quantity_" + index).val(oldValue);
					return false;
				} else {
					//隐藏
					$("#editBox").hide();
					$("#shadeDiv2").hide();

					var quantity = parseFloat(newValue) - parseFloat(oldValue);
					$scope.event.updateCar(goodsId, quantity, 'update');
				}
			},

			//结算
			nextPage: function() {
				//判断是否有选中购物车
				if ($("#shoppingCarDiv .com_checkoxon").size() == 0) {
					alert("请先选中商品");
					return false;
				}

				var carIds = [];
				var flag = true; //判断是否同一个供货商
				//获取到选中的购物车ID，拼进数组里
				$("#shoppingCarDiv .com_checkoxon").each(function(index, elem) {

					console.log("当前下标是" + index);
					var oneProvider = "" + $("#shoppingCarDiv .com_checkoxon").eq(index).attr("provider");
					var twoProvider = "" + $("#shoppingCarDiv .com_checkoxon").eq(index + 1).attr("provider");
					console.log(twoProvider);
					//如果成立，说明前面的所有项，都是同一个供货商，可以结束了
					if (twoProvider == "" || twoProvider == "undefined" || twoProvider == null) {
						flag = true;
					} else if (oneProvider != twoProvider) {
						alert("只能结算同一个代理商的商品");
						flag = false;
						return false;
					}

					//插进数组
					carIds.push($(this).attr("data"));
				});

				//如果选中商品，全部属于同一个供货商，则继续程序
				if (flag == true) {
					Local.saveStore("carIds", carIds);
					hrefJump('zhongDuanDingGou3');
				}

			}
		}
	}
]);

edit_yes = function() {
	$("#shadeDiv2").hide();
	$("#editBox").hide();
}
edit_false = function() {
	$("#shadeDiv2").hide();
	$("#editBox").hide();
}