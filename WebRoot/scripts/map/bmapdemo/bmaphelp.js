/**
 * @(#)bmap.help.js 2012-12-18 下午15:57
 * CopyRight 2012 Sunrise.  All rights reserved
 * 
 * 
 */

/**
 * 百度地图操作函数库 依赖core.js
 * 
 * @author TanYucheng
 */

window.BMap = window.BMap || {};

//
BMap.load_script = function(xyUrl, callback) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = xyUrl;
	// 借鉴了jQuery的script跨域方法
	script.onload = script.onreadystatechange = function() {
		if ((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
			callback && callback();
			// Handle memory leak in IE
			script.onload = script.onreadystatechange = null;
			if (head && script.parentNode) {
				head.removeChild(script);
			}
		}
	};
	// Use insertBefore instead of appendChild to circumvent an IE6 bug.
	head.insertBefore(script, head.firstChild);
};

BMap.Convertor = {};

/**
 * 批量把谷歌、GPS坐标转换成百度坐标
 * 
 * @param {Object}
 *            points 要转换的坐标点数组
 * @param {Object}
 *            type 待转换坐标类型：0为GPS坐标，2为谷歌坐标
 * @param {Object}
 *            callbackName 换转成功后的回调函数名
 */
BMap.transMore = function(points, type, callback) {
	var xyUrl = "http://api.map.baidu.com/ag/coord/convert?from=" + type
			+ "&to=4&mode=1";
	var xs = [];
	var ys = [];
	var ps = new Object();// 每次返回的坐标数据
	ps.Points = [];
	ps.index = [];

	var resultPoints = [];// 存放成功转换后的结果返回

	var callbackNames = [];// 存放每次回调的函数的名称

	var maxCnt = 20;// 每次转换的最大个数
	var sendtimes = Math.floor(points.length / maxCnt) + 1;// 分发的次数
	var sendsuccesstimes = 0;// 分发的成功返回的次数

	var send = function() {
		var callbackName = 'cbk_' + Math.round(Math.random() * 10000); // 随机函数名
		callbackNames.push(callbackName);
		var url = xyUrl + "&x=" + xs.join(",") + "&y=" + ys.join(",")
				+ "&callback=BMap.Convertor." + callbackName;// 组装请求URL

		// 动态创建script标签
		BMap.load_script(url);

		BMap.Convertor[callbackName] = function(tansedpoints) {
			sendsuccesstimes++;// 成功的次数加1
			delete BMap.Convertor[callbackName]; // 调用完需要删除改函数
			var Tpoints = [];// 存放坐标数组
			$(tansedpoints).each(function(i) {
				var lng = tansedpoints[i].x;
				var lat = tansedpoints[i].y;
				var point = new BMap.Point(lng, lat);
				Tpoints.push(point);
			});

			ps.Points.push(Tpoints);
			ps.index.push(callbackName);

			// 重组坐标点
			if (sendsuccesstimes == sendtimes) {
				// alert("success");
				for ( var cbnindex in callbackNames) {
					$(ps.index).each(function(i) {
						if (ps.index[i] == callbackNames[cbnindex]) {
							for ( var pindex in ps.Points[i]) {
								resultPoints.push(ps.Points[i][pindex]);
							}
						}
					});
				}
				// callback && callback(resultPoints);
				if (callback != undefined && callback != null)
					callback(resultPoints);
			}
		};
		xs = [];// 重置数组
		ys = [];// 重置数组
	};

	for ( var index in points) {
		// 根据每次转换的最大个数分组请求转换
		if (index % maxCnt == 0 && index != 0) {
			send();
		}
		xs.push(points[index].lng);
		ys.push(points[index].lat);
		if (index == points.length - 1) {
			send();
		}
	}
};

/**
 * 在地图上绘画路线
 * 
 * @param {Object}
 *            points 坐标点数组
 */
BMap.drawPolyline = function(points) {
	map.centerAndZoom(points[points.length - 1], 16);// 设置路线终点为地图中心点
	var polyline = new BMap.Polyline(points, {
		strokeColor : "blue",
		strokeWeight : 6,
		strokeOpacity : 0.5
	});// 创建折线图层
	map.addOverlay(polyline);// 把图层添加到地图上
	var marker = new BMap.Marker(points[points.length - 1]); // 创建标注
	map.addOverlay(marker); // 将标注添加到地图中
	marker.setAnimation(BMAP_ANIMATION_BOUNCE); // 跳动的动画
};

/**
 * 清除地图覆盖物
 */
BMap.clsall = function() {
	map.clearOverlays();
};

/**
 * 获取地图可视区域的大致GPS坐标
 * 
 * @param {Object}
 *            points 坐标点数组
 */
BMap.getgpsbounds = function(callback) {
	var bs = map.getBounds(); // 获取可视区域
	var boundspoints = [];
	boundspoints.push(bs.getSouthWest());// 可视区域左下角百度坐标
	boundspoints.push(bs.getNorthEast());// 可视区域右上角百度坐标

	BMap.transMore(boundspoints, 0, baidupt2gpspt);
	function baidupt2gpspt(points) {
		var resultbounds = [];
		for ( var index in points) {
			// x = 2*x1-x2，y = 2*y1-y2
			var lng = 2 * boundspoints[index].lng - points[index].lng;
			var lat = 2 * boundspoints[index].lat - points[index].lat;
			resultbounds.push(new BMap.Point(lng, lat));
		}
		if (callback != undefined && callback != null)
			callback(resultbounds);
	}
};

/**
 * 获取当前地图的可视区域的基站信息
 * 
 * @param{Object} points 当前地图的可视区域
 * @param{Object} callback 获取基站信息后的回调函数
 */
BMap.getproperty = function(points, callback) {
	CORE.request("DS_MAP_BI_PROPERTY_LIST", {
		data : "LONGITUDE_W=" + points[0].lng + "&LONGITUDE_E=" + points[1].lng
				+ "&LATITUDE_S=" + points[0].lat + "&LATITUDE_N="
				+ points[1].lat
	}, function(data) {
		if (callback != undefined && callback != null)
			callback(data);
	});
};

/**
 * 批量向地图添加标注点
 * 
 * @param{Object} data point 百度坐标点 markerinfo 标注点的弹窗信息
 * 
 */
BMap.addMarkers = function(data, param) {
	$(data.points).each(function(i) {
		var marker = new BMap.Marker(data.points[i]);// 创建标注
		// alert(data.markerinfos[i]);
		map.addOverlay(marker); // 将标注添加到地图中
		var infowindow = new BMap.InfoWindow(data.markerinfos[i]);
		marker.addEventListener("click", function() {
			this.openInfoWindow(infowindow);
			/*
			 * document.getElementById('container').onload = function (){
			 * infoWindow.redraw(); };
			 */
		});// 绑定监听事件

	});

};

BMap.test = function() {
	// 添加图表
	chart = new Highcharts.Chart({
		chart : {
			renderTo : "container",
			type : 'line',
			marginRight : 130,
			marginBottom : 25
		},
		title : {
			text : '广州市森锐电子科技有限公司',
			x : -20
		// center
		},
		subtitle : {
			text : 'Source: sunrise',
			x : -20
		},
		xAxis : {
			categories : [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
					'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
		},
		yAxis : {
			title : {
				text : '指标'
			},
			plotLines : [ {
				value : 0,
				width : 1,
				color : '#808080'
			} ]
		},
		tooltip : {
			formatter : function() {
				return '<b>' + this.series.name + '</b><br/>' + this.x + ': '
						+ this.y;
			}
		},
		legend : {
			layout : 'vertical',
			align : 'right',
			verticalAlign : 'top',
			x : -10,
			y : 100,
			borderWidth : 0
		},
		series : [
				{
					name : '发展量',
					data : [ 7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3,
							18.3, 13.9, 9.6 ]
				},
				{
					name : '2G数量',
					data : [ -0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1,
							20.1, 14.1, 8.6, 2.5 ]
				},
				{
					name : '3G数量',
					data : [ -0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3,
							9.0, 3.9, 1.0 ]
				},
				{
					name : '其它业务',
					data : [ 3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2,
							10.3, 6.6, 4.8 ]
				} ]
	});
};

BMap.testCreateChart = function() {
	var colors = Highcharts.getOptions().colors, categories = [ 'MSIE',
			'Firefox', 'Chrome', 'Safari', 'Opera' ], name = 'Browser brands', data = [
			{
				y : 55.11,
				color : colors[0],
				drilldown : {
					name : 'MSIE versions',
					categories : [ 'MSIE 6.0', 'MSIE 7.0', 'MSIE 8.0',
							'MSIE 9.0' ],
					data : [ 10.85, 7.35, 33.06, 2.81 ],
					color : colors[0]
				}
			},
			{
				y : 21.63,
				color : colors[1],
				drilldown : {
					name : 'Firefox versions',
					categories : [ 'Firefox 2.0', 'Firefox 3.0', 'Firefox 3.5',
							'Firefox 3.6', 'Firefox 4.0' ],
					data : [ 0.20, 0.83, 1.58, 13.12, 5.43 ],
					color : colors[1]
				}
			},
			{
				y : 11.94,
				color : colors[2],
				drilldown : {
					name : 'Chrome versions',
					categories : [ 'Chrome 5.0', 'Chrome 6.0', 'Chrome 7.0',
							'Chrome 8.0', 'Chrome 9.0', 'Chrome 10.0',
							'Chrome 11.0', 'Chrome 12.0' ],
					data : [ 0.12, 0.19, 0.12, 0.36, 0.32, 9.91, 0.50, 0.22 ],
					color : colors[2]
				}
			},
			{
				y : 7.15,
				color : colors[3],
				drilldown : {
					name : 'Safari versions',
					categories : [ 'Safari 5.0', 'Safari 4.0',
							'Safari Win 5.0', 'Safari 4.1', 'Safari/Maxthon',
							'Safari 3.1', 'Safari 4.1' ],
					data : [ 4.55, 1.42, 0.23, 0.21, 0.20, 0.19, 0.14 ],
					color : colors[3]
				}
			}, {
				y : 2.14,
				color : colors[4],
				drilldown : {
					name : 'Opera versions',
					categories : [ 'Opera 9.x', 'Opera 10.x', 'Opera 11.x' ],
					data : [ 0.12, 0.37, 1.65 ],
					color : colors[4]
				}
			} ];

	function setChart(name, categories, data, color) {
		chart.xAxis[0].setCategories(categories, false);
		chart.series[0].remove(false);
		chart.addSeries({
			name : name,
			data : data,
			color : color || 'white'
		}, false);
		chart.redraw();
	}

	chart = new Highcharts.Chart(
			{
				chart : {
					renderTo : 'container',
					type : 'column'
				},
				title : {
					text : 'Browser market share, April, 2011'
				},
				subtitle : {
					text : 'Click the columns to view versions. Click again to view brands.'
				},
				xAxis : {
					categories : categories
				},
				yAxis : {
					title : {
						text : 'Total percent market share'
					}
				},
				plotOptions : {
					column : {
						cursor : 'pointer',
						point : {
							events : {
								click : function() {
									var drilldown = this.drilldown;
									if (drilldown) { // drill down
										setChart(drilldown.name,
												drilldown.categories,
												drilldown.data, drilldown.color);
									} else { // restore
										setChart(name, categories, data);
									}
								}
							}
						},
						dataLabels : {
							enabled : true,
							color : colors[0],
							style : {
								fontWeight : 'bold'
							},
							formatter : function() {
								return this.y + '%';
							}
						}
					}
				},
				tooltip : {
					formatter : function() {
						var point = this.point, s = this.x + ':<b>' + this.y
								+ '% market share</b><br/>';
						if (point.drilldown) {
							s += 'Click to view ' + point.category
									+ ' versions';
						} else {
							s += 'Click to return to browser brands';
						}
						return s;
					}
				},
				series : [ {
					name : name,
					data : data,
					color : 'white'
				} ],
				exporting : {
					enabled : false
				}
			});
};

// 展示图表图层
BMap.testCreateChartdemo = function(name, type) {
	if (type == "column") {
		chart = new Highcharts.Chart({
			chart : {
				renderTo : name,
				type : 'column'
			},
			title : {
				text : ''
			},
			subtitle : {
				text : ''
			},
			xAxis : {
				categories : [ '' ]
			},
			yAxis : {
				min : 0,
				title : {
					text : ''
				}
			},
			legend : {
				layout : 'vertical',
				backgroundColor : '#FFFFFF',
				align : 'left',
				verticalAlign : 'top',
				x : 100,
				y : 70,
				floating : true,
				shadow : true
			},
			tooltip : {
				formatter : function() {
					return '' + this.x + ': ' + this.y;
				}
			},
			plotOptions : {
				column : {
					pointPadding : 0.2,
					borderWidth : 0
				}
			},
			series : [ {
				name : '网点',
				data : [ 49.9 ]

			}, {
				name : '发展量',
				data : [ 83.6 ]

			}, {
				name : '2G',
				data : [ 48.9 ]

			}, {
				name : '3G',
				data : [ 42.4 ]

			} ]
		});
	} else if (type == "pie") {
		chart = new Highcharts.Chart({
			chart : {
				renderTo : name,
				plotBackgroundColor : null,
				plotBorderWidth : null,
				plotShadow : false
			},
			title : {
				text : '各区域业务量对比(2012)'
			},
			tooltip : {
				pointFormat : '{series.name}: <b>{point.percentage}%</b>',
				percentageDecimals : 1
			},
			plotOptions : {
				pie : {
					allowPointSelect : true,
					cursor : 'pointer',
					dataLabels : {
						enabled : true,
						color : '#000000',
						connectorColor : '#000000',
						formatter : function() {
							return '<b>' + this.point.name + '</b>: '
									+ this.percentage + ' %';
						}
					}
				}
			},
			series : [ {
				type : 'pie',
				name : '发展量(2012)',
				data : [ [ '天河区', 45.0 ], [ '越秀区', 26.8 ], {
					name : '海珠区',
					y : 12.8,
					sliced : true,
					selected : true
				}, [ '花都区', 8.5 ], [ '番禺区', 6.2 ], [ '其他', 0.7 ] ]
			} ]
		});

	}
};

// 设置每一个点的标记
BMap.setMarkerInfo = function(data, params) {
	// 如果没有指定 colNames 参数，则自动根据 colModel 构建
	if (params["colNames"] == null || params["colNames"] == undefined) {
		params["colNames"] = [];
		$.each(params["colModel"], function(i, n) {
			params["colNames"].push(n["name"]);
		});
	} else {
		// 如果传入了 colNames ，对colModel 和colNames 的中文名进行比较，以colNames的为准
		for ( var i = 0; i < params["colNames"].length; i++) {
			params["colModel"][i]["name"] = params["colNames"][i];
		}
	}
	var info = "";
	$(data)
			.each(
					function(i) {
						if (i == 0) {
							info = "<h4>"
									+ params["colNames"][i]
									+ ":"
									+ data[i]
									+ "</h4><img style='float:right;margin:4px' id='imgDemo' src='pages/map/images/maptest.jpg' width='139' height='104' title='"
									+ data[1] + "'/>";
						} else {
							info = info + "<p>" + params["colNames"][i] + ":"
									+ data[i] + "</p>";
						}
					});
	return info;
};

/**
 * 根据data数据，获得点数组
 */
BMap.getGPSPoints = function(data, params) {
	var lngindex, latindex;
	// 对colModel 的中文名进行比较，以colNames的为准
	for ( var i = 0; i < params["colModel"].length; i++) {
		if (params["colModel"][i]["name"] == "经度")
			lngindex = i;
		else if (params["colModel"][i]["name"] == "纬度")
			latindex = i;
	}

	if (lngindex != null && latindex != null) {
		var points = [];
		$(data.rows).each(function(i) {
			var lng = data.rows[i].cell[lngindex];
			var lat = data.rows[i].cell[latindex];
			var point = new BMap.Point(lng, lat);
			points.push(point);
		});
		return points;
	}
};

// 添加行政区域
BMap.getBoundary = function(boundary) {
	var bdary = new BMap.Boundary();
	bdary.get(boundary, function(rs) { // 获取行政区域
		map.clearOverlays(); // 清除地图覆盖物
		var count = rs.boundaries.length; // 行政区域的点有多少个
		for ( var i = 0; i < count; i++) {
			var ply = new BMap.Polygon(rs.boundaries[i], {
				strokeWeight : 2,
				strokeColor : "#ff0000"
			}); // 建立多边形覆盖物
			map.addOverlay(ply); // 添加覆盖物
			map.setViewport(ply.getPath()); // 调整视野
		}
	//demo
		//console.log("准备进入标记点");
		setareamarkerinfo(boundary);//demo添加标记点
		
	});
};

//绘画线路上小车行驶示意图
BMap.run = function(points) {
	var myIcon = new BMap.Icon("pages/map/images/child2.png", new BMap.Size(16,
			32), { // 小车图片
		// offset: new BMap.Size(0, -5), //相当于CSS精灵
		imageOffset : new BMap.Size(0, -10)
	// 图片的偏移量。为了是图片底部中心对准坐标点。
	});
	var pts = points; // 获得一系列点的数组
	var paths = pts.length; // 获得有几个点

	var carMk = new BMap.Marker(pts[0], {
		icon : myIcon
	});
	map.addOverlay(carMk);
	var i = 0;
	// var t=0;
	function resetMkPoint(i) {

		// if(t==3)
		// {BMap.clsall();};
		// alert(t);
		carMk.setPosition(pts[i]);
		if (i < paths) {
			setTimeout(function() {
				i++;
				resetMkPoint(i);
			}, 200);
		} else {
			// i=0;
			// t++;
			/*
			 * setTimeout(function(){ i++; resetMkPoint(i); },200);
			 */
			map.removeOverlay(carMk);
		}
	}
	setTimeout(function() {
		resetMkPoint(i);
	}, 200);
};

var areas = [ "天河区", "白云区", "越秀区", "花都区", "海珠区", "番禺区", "萝岗区", "黄埔区", "南沙区",
		"荔湾区" ];
var colors = [ "#86ee00", "#5f7f3f", "#9fe9fb", "#86ee00", "#ff00ff",
		"#5f7f3f", "#00ff00", "#ff0000", "#86ee00", "#9fe9fb" ];

// 添加行政区域 demo用到
BMap.getBoundarydemo = function() {
	var bdary = new BMap.Boundary();

	$(areas).each(
			function(i) {
				bdary.get(areas[i], function(rs) { // 获取行政区域
					// map.clearOverlays(); // 清除地图覆盖物
					// var c = colors[j];
					var count = rs.boundaries.length; // 行政区域的点有多少个

					for ( var j = 0; j < count; j++) {
						var ply = new BMap.Polygon(rs.boundaries[j], {
							fillColor : colors[i],
							strokeWeight : 2,
							strokeColor : "#ff5500"
						}); // 建立多边形覆盖物
						map.addOverlay(ply); // 添加覆盖物
						// map.setViewport(ply.getPath()); // 调整视野
						if (j == 0)// 只在一个上添加
						{
							var myCompOverlay = new ComplexCustomOverlay(
									areaPoints[i], areas[i]);
							ply.addEventListener("click", function() {
								if (myCompOverlay._div.style.display == "") {
									myCompOverlay.hide();

								} else {
									myCompOverlay.show();
								}


							});

							/*
							 * ply.addEventListener("mouseout", function(){
							 * console.log(myCompOverlay._name
							 * +document.activeElement.id );
							 * if(myCompOverlay._div.style.id
							 * !=document.activeElement.id)
							 * myCompOverlay.hide(); });
							 */
							map.addOverlay(myCompOverlay);
						}
					}
				});
			});
	/*
	 * var myCompOverlay = new ComplexCustomOverlay(new
	 * BMap.Point(113.384401,23.142382), areas[0]);
	 * //map.centerAndZoom(areaPoints[i],12); map.addOverlay(myCompOverlay);
	 */

};


var areaPoints = [ new BMap.Point(113.384401, 23.142382),// 天河
new BMap.Point(113.312321, 23.290178),// 白云区
new BMap.Point(113.282354, 23.143977),// 越秀区
new BMap.Point(113.241822, 23.416985),// 花都区
new BMap.Point(113.335318, 23.07331),// 海珠区
new BMap.Point(113.399637, 22.964144),// 番禺区
new BMap.Point(113.471501, 23.202849),// 萝岗区
new BMap.Point(113.507433, 23.1019),// 黄埔区
new BMap.Point(113.55896, 22.782535),// 南沙区
new BMap.Point(113.211567, 23.079095) // 荔湾区
];

/*
 * BMap.showareademo = function() { BMap.clsall();
 * $(areaPoints).each(function(i) { var myCompOverlay = new
 * ComplexCustomOverlay(areaPoints[i], areas[i]); //
 * map.centerAndZoom(areaPoints[i],15); map.addOverlay(myCompOverlay); }); };
 */

//显示饼图 demo用到
BMap.showpiedemo = function() {
	// alert(map.getOverlay(myPieOverlay));
	// if(myPieOverlay)
	// alert(document.getElementById("pie"));
	/*
	 * if(document.getElementById("pie")!=undefined &&
	 * document.getElementById("pie")!=null) { var pie = $("#pie");//按钮
	 * //node.parentNode.removeChild(node); //下面效果相同
	 * document.body.removeChild(pie);//在body中删除id为P2的元素
	 * //document.body.removeNode();执行这条语句将清空body里面的任何元素
	 *  }
	 */
	myPieControl = new PieControl("pie");
	// myPieOverlay.enableDragging();
	// 创建控件
	// var myZoomCtrl = new ZoomControl();
	// 添加到地图当中
	map.addControl(myPieControl);
};

//显示图例 demo用到
BMap.showtulidemo = function() {
	tuliControl= new TuLiControl();
	map.addControl(tuliControl);
};
