app.registerCtrl("ZhongDuanDingGou2Ctrl", ["$scope", "$srhttp", "$rootScope", "$sce",
	function($scope, $srhttp, $rootScope, $sce) {

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

		$rootScope.appTitle = "终端销售";

		//图片地址
		$scope.imgScr = APP_CONFIG.SERVER_URL + "!service/file/~java/Downloader.get?id=";
		$scope.imgHttp = APP_CONFIG.SERVER_URL;

		//控制图片和滚播隐藏、显示。因为有时候只有一张图，滚播插件会错误 
		$scope.show = {
			"img": true,
			"slides": true,
			"box": false,
			"shade": false,
			"stock":false
		}
		
		$scope.$watch('show.img',function(newValue,oldValue){
			console.log("改变成"+newValue);
		});

		$scope.form1 = {};
		$scope.form2 = {
			"sub_title": "", //商品描述
			"price": "", //价格
			"memberName": "", //供货商
			"stock": "", //库存
			"color": "", //颜色
			"ram": "", //内存

			"price_id": "", //价格ID，查串号要用到
			"sn": "", //模糊查询
			"page": "1", //页码

			"numbers": "1", //数量
			"back_money": "", //返利金额
			"month_sale": "", //月销量
			"sum_sale": "", //总销量
			"description": "", //商品基本信息
			"detail_id": "" //详细商品id
		};
		$scope.pictures1 = []; //单张图片
		$scope.pictures2 = []; //滚播图片

		$scope.form1 = Local.getStoreJson("form1");

		/*
		 * 接口请求访问对象
		 */
		$scope.request = {

			//加载商品title,商品信息
			loadTitle: function() {
				$.ajax({
					url: APP_CONFIG.SERVER_URL + "!ESale/Mall/Goods/~java/Goods.getGoods",
					type: "POST",
					data: {
						"id": $scope.form1.ID
					},
					dataType: "json",
					success: function(json) {
						$scope.form2.sub_title = json.sub_title; //商品title
						$scope.form2.memberName = json.memberName; //供货商
						$scope.pictures1 = json.pictures; //单张图
						$scope.pictures2 = json.pictures; //滚播图
						console.log($scope.pictures2);

						//如果超过两张图，隐藏单张图，显示滚播
						if ($scope.pictures2[1]) {
							$scope.show.img = false;
							//滚播插件
							$scope.$apply(function() {
								setTimeout(function() {
									$('#slides').slidesjs({
										width: 940,
										height: 940,
										navigation: false,
										generateNextPrev: false,
										play: {
											active: false,
											auto: true,
											interval: 4000,
											swap: true
										}
									});
								}, 10);
							});
						} else {
							$scope.show.slides = false;
						}

						//解码，并保留html
						if (json.description) {
							try {
								var finalHtml = unescape(json.description).replace(/src=\"\/esale\//g, "src=\"" + APP_CONFIG.SERVER_URL);

								if (finalHtml == undefined || finalHtml == null) {
									finalHtml = ""; //防止下面这行代码报错，$sce/unsafe
								}
								$scope.form2.description = $sce.trustAsHtml(finalHtml);
							} catch (e) {
								console.log("解码失败" + e.message);
								console.log(json.description);
							}
						} else {
							$scope.form2.description = $sce.trustAsHtml("&nbsp;");
						}
					}
				});
			},

			//加载颜色
			loadColor: function() {
				$srhttp.get("!ESale/Mall/Goods/~query/Q_GOOD_DETAIL_INFO", {
					"goodsId": $scope.form1.ID
				}, function(data) {
					try {
						if (data.header.code == 0) {
							$scope.color_rows = data.body.rows;

							setTimeout(function() {
								//选中第一个
								$scope.event.color_select(0);
							}, 1);
						} else {
							alert("获取不到颜色");
						}
					} catch (e) {
						alert("获取不到颜色信息");
					}
				});
			},

			//加载内存
			loadRam: function() {
				$srhttp.post("!ESale/Mall/Goods/~query/Q_GOOD_DETAIL_INFO", {
					"goodsId": $scope.form1.ID,
					"color": $scope.form2.color
				}, function(data) {
					try {
						if (data.header.code == 0) {
							$scope.ram_rows = data.body.rows;
							//默认选中第一个
							setTimeout(function() {
								/*$scope.form2.ram = data.body.rows[0].RAM;
								$("#ram_0").addClass("com_selectbtnon");*/
								$scope.event.ram_select(0);

							}, 1);
						} else {
							alert("获取不到内存");
						}
					} catch (e) {
						alert("获取不到内存信息");
					}
				});
			},

			//加载价格
			loadPrice: function() {
				$srhttp.post("!ESale/Mall/Goods/~query/Q_GOOD_SALE_DETAIL_INFO", {
					"goodsId": $scope.form1.ID,
					"color": $scope.form2.color,
					"ram": $scope.form2.ram
				}, function(data) {
					try {
						if (data.header.code == 0) {
							$scope.form2.price = data.body.rows[0].PRICE; //价格
							$scope.form2.back_money = data.body.rows[0].BACK_MONEY; //返利金额
							$scope.form2.month_sale = data.body.rows[0].MONTH_SALE; //月销量
							$scope.form2.sum_sale = data.body.rows[0].SUM_SALE; //总销量
							$scope.form2.detail_id = data.body.rows[0].ID; //商品详细ID
							$scope.form2.simulation_id = data.body.rows[0].SIMULATION_ID; //真机模拟ID
							$scope.form2.sn_type = data.body.rows[0].SN_TYPE; //是否输入串号
							$scope.form2.contract_id = data.body.rows[0].CONTRACT_ID; //合约产品ID
							//刷新库存量
							$scope.request.loadStock();
							//$scope.request.showSimulation($scope.form2.sn_type);

						} else {
							alert("获取不到价格");;
						}
					} catch (e) {
						alert("获取不到价格信息");
					}
				});
			},

			//加载库存量
			loadStock: function() {
				$srhttp.post("!ESale/Mall/Goods/~query/Q_GOOD_SALE_STOCK", {
					"goodsId": $scope.form1.ID,
					"color": $scope.form2.color,
					"ram": $scope.form2.ram
				}, function(data) {
					try {
						if (data.header.code == 0) {
							if (data.body.rows.length > 0) {
								$scope.form2.stock = data.body.rows[0].STOCK; //库存
								$scope.form2.price_id = data.body.rows[0].PRICE_ID; //价格ID
							} else {
								$scope.form2.stock = 0;
							}
						} else {
							alert("获取不到库存量");
						}
					} catch (e) {
						alert("获取不到库存量信息");
					}
				});
			},

			//加载串号
			loadCuanHao: function(page) {
				$scope.form2.page = page; //获取页码
				if ($scope.form2.stock == '0') {
					alert("库存为0，无串号可查询");
					return false;
				}
				$srhttp.get("!ESale/Business/Terminal/~query/new/Q_TERMINAL_SN_LIST", {
					"priceId": $scope.form2.price_id,
					"sn": $scope.form2.sn, //模糊查询
					"pageSize": "8",
					"page": $scope.form2.page
				}, function(data) {
					try {
						if (data.header.code == 0) {
							if (data.body.rows.length > 0) {
								$scope.rowsCuanHao = data.body.rows;
								//显示弹框
								$scope.show.box = true;
								$scope.show.shade = true;
							} else {
								$scope.rowsCuanHao = [];
							}
						} else {
							alert("获取不到串号");
						}
					} catch (e) {
						alert("获取不到串号信息");
					}
				});
			},
			/*showSimulation:function(type){
				if(type==0){
					$("#")
				}
			},
*/
			//串号下一页
			loadCuanHao_Next: function() {
				$scope.form2.page++;
				console.log("page:" + $scope.form2.page);
				//刷新下一页串号
				$scope.request.loadCuanHao($scope.form2.page);
			},

			//搜索
			loadCuanHao_search: function() {
				$scope.form2.page = 1;
				console.log("page:" + $scope.form2.page);
				//刷新下一页串号
				$scope.request.loadCuanHao($scope.form2.page);
			},

			//加载商品规格参数
			loadDetail: function() {
				$srhttp.get("!ESale/Business/Terminal/~query/Q_TERMINAL_PARAMS_LIST", {
					"id": $scope.form1.ID
				}, function(data) {
					try {
						if (data.header.code == 0) {
							$scope.detail_rows = data.body.rows;
						} else {
							alert("获取不到商品详情");
						}
					} catch (e) {
						alert("获取不到商品详细信息");
					}
				});
			},
			//真机模拟，跳转到链接
			showTerminal:function(type){
				if($scope.form2.simulation_id==undefined||$scope.form2.simulation_id==""){
					alert("请选择商品详细信息");
					return;
				}
				window.location.href="http://112.80.35.7:8092/jsfangzhen/manage/reDevicegetSimulationInfo_Public.action?SystemID=P001" +
				"&TerminalID="+$scope.form2.simulation_id+"&SimulationResourcesType="+type+"&TerminalType=2";
			},
			/*checkContract:function(){
				//合约销售
				$srhttp.post('!ESale/Business/Terminal/~query/new/Q_TERMINAL_CONTRACT_P',{id:$scope.form2.detail_id},function(data){
					if(data.header.code!=0||data.body.rows[0].PRO_ATTR_7==""){
						alert("抱歉，该终端无合约产品");
						return;
					}
				});
			},*/
			contractTerminal:function(){
				//库足低于购买数量时
				if (parseFloat($scope.form2.stock) < parseFloat($scope.form2.numbers)) {
					$scope.event.exit_true();
					return false;
				} else {
					$srhttp.post("!ESale/Business/Terminal/~java/Cart.add", {
						"goodsId": $scope.form2.detail_id,
						"quantity": $scope.form2.numbers,
						"type_id":5
					}, function(data) {
						try {
							if (data.header.code == 0) {
								//成功则跳转
								hrefJump('shoppingCar');
							} else {
								alert_toast(data.header.message);
							}
						} catch (e) {
							alert("出错" + e.message);
							if (e.message.indexOf("toast")) {
								alert("添加购物车成功");
							}
						}
					});
				}
			},
			//立即购买点击事件
			shop: function() {
				//库足低于购买数量时
				if (parseFloat($scope.form2.stock) < parseFloat($scope.form2.numbers)) {
					$scope.event.exit_true();
					return false;
				} else {
					$srhttp.post("!ESale/Business/Terminal/~java/Cart.add", {
						"goodsId": $scope.form2.detail_id,
						"quantity": $scope.form2.numbers,
						"type_id":2
					}, function(data) {
						try {
							if (data.header.code == 0) {
								//成功则跳转
								hrefJump('shoppingCar');
							} else {
								alert_toast(data.header.message);
							}
						} catch (e) {
							alert("出错" + e.message);
							if (e.message.indexOf("toast")) {
								alert("添加购物车成功");
							}
						}
					});
				}
			}
		}

		$scope.request.loadTitle();
		$scope.request.loadColor();
		$scope.request.loadDetail();
		/*
		 * 事件处理对象
		 */
		$scope.event = {

			//添加购买数量
			add: function() {
				if (isNaN($scope.form2.numbers)) {
					$scope.form2.numbers = 1;
				}
				$scope.form2.numbers++;
			},

			//减少购买数量
			subtract: function() {
				if (isNaN($scope.form2.numbers)) {
					$scope.form2.numbers = 1;
				}
				$scope.form2.numbers--;
				if ($scope.form2.numbers <= 0) {
					$scope.form2.numbers = 1;
				}
			},

			//颜色点击事件
			color_select: function(id) {
				var a = $("#color_" + id);
				if (a) {
					//修改样式
					$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");

					//修改选中项的值
					$scope.form2.color = $(a).text();
					//刷新内存
					$scope.request.loadRam();
				}
			},

			//内存点击事件
			ram_select: function(id) {
				var a = $("#ram_" + id);
				if (a) {
					//修改样式
					$(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");

					//修改选中项的值
					$scope.form2.ram = $(a).text();
					//刷新价格,这个loadPrice里面会刷新库存量
					$scope.request.loadPrice();
				}
			},

			//修改数量
			updateQuantity: function() {
				if ($scope.form2.numbers == "" || $scope.form2.numbers == "0") {
					$scope.form2.numbers = 1;
					console.log($scope.form2.numbers);
				} else {
					console.log($scope.form2.numbers);
				}
			},

			//显示串号框
			close: function() {
				$scope.show.box = false;
				$scope.show.shade = false;
			},
			//打开库存弹出框
			exit_true: function() {
				$scope.show.stock =true;
				$scope.show.shade = true;
			},
			//关闭库存弹出框
			exit_false: function() {
				$scope.show.stock = false;
				$scope.show.shade = false;
			},
			//跳转到终端订购
			exit_sall: function() {
				//todo
			}
		}
	}
]);

function AutoResizeImage(maxWidth, maxHeight, objImg) {
	var img = new Image();
	img.src = objImg.src;
	var hRatio;
	var wRatio;
	var Ratio = 1;
	var w = img.width;
	var h = img.height;
	wRatio = maxWidth / w;
	hRatio = maxHeight / h;
	if (maxWidth == 0 && maxHeight == 0) {
		Ratio = 1;
	} else if (maxWidth == 0) { //
		if (hRatio < 1) Ratio = hRatio;
	} else if (maxHeight == 0) {
		if (wRatio < 1) Ratio = wRatio;
	} else if (wRatio < 1 || hRatio < 1) {
		Ratio = (wRatio <= hRatio ? wRatio : hRatio);
	}
	if (Ratio < 1) {
		w = w * Ratio;
		h = h * Ratio;
	}
	objImg.height = h;
	objImg.width = w;
}