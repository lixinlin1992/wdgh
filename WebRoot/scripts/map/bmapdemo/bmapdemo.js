/*2012.12.31 demojs 
 * 
 * 依赖grid.js、core.js
 * 
 */

loadScript("scripts/map/bmapdemo/bmap.help.js");
loadScript("scripts/map/themes/grid.js");

// 查询基站的数据，其中经纬度必须有。
var propertyparams = {
	colNames : [ '物业编码', '站点名称', '站号', '经度', '纬度', '站点地址' ],
	colModel : [ {
		name : '物业编码',
		index : 'PROPERTY_CODE',
		width : 120,
		align : "center"

	}, {
		name : '站点名称',
		index : 'ST_PHYS_NAME',
		width : 140,
		align : "center"
	}, {
		name : '站号',
		index : 'PROPERTY_ID',
		width : 140,
		align : "center"
	}, {
		name : '经度',
		index : 'LONGITUDE',
		width : 220,
		align : "center"
	}, {
		name : '纬度',
		index : 'LATITUDE',
		width : 220,
		align : "center"
	}, {
		name : '站点地址',
		index : 'ADDRESS',
		width : 410,
		align : "center"
	} ]
};

// 查询巡检信息地理位置获取，其中经纬度必须有
var inspectionparams = {
	colNames : [ '经度', '纬度', '更新时间', '手机识别码' ],
	colModel : [ {
		name : '经度',
		index : 'LONGITUDE'
	}, {
		name : '纬度',
		index : 'LATITUDE'
	}, {
		name : '更新时间',
		index : 'CREATE_DATE'
	}, {
		name : '手机识别码',
		index : 'IMEI'
	} ]
};

// demo指标
var demoparams = {
	colNames : [ '网点', '时间段', '发展量', '2G数量', '3G数量' ],
	colModel : [ {
		name : '网点',
		index : 'PROPERTY',
		width : 150,
		align : "center"
	}, {
		name : '时间段',
		index : 'DATE',
		width : 200,
		align : "center"
	}, {
		name : '发展量',
		index : 'COUNT',
		width : 150,
		align : "center"
	}, {
		name : '2G数量',
		index : '2G',
		width : 120,
		align : "center"
	}, {
		name : '3G数量',
		index : '3G',
		width : 120,
		align : "center"
	} ]
};

var area=[];

// 天河区网点demo测试数据
var tianhequ = new Object();
tianhequ.points = [];
tianhequ.markerinfos = [];
tianhequ.points.push(new BMap.Point(113.339989, 23.158997));
tianhequ.points.push(new BMap.Point(113.383108, 23.168034));
tianhequ.points.push(new BMap.Point(113.414728, 23.151554));

//越秀区网点demo测试数据
var yuexiuqu = new Object();
yuexiuqu.points = [];
yuexiuqu.markerinfos = [];
yuexiuqu.points.push(new BMap.Point(113.272005,23.145572));//越秀公园
yuexiuqu.points.push(new BMap.Point(113.27179,23.139657));//纪念堂
yuexiuqu.points.push(new BMap.Point(113.263094,23.140388));//广州院学院

//海珠区网点demo测试数据
var haizhuqu = new Object();
haizhuqu.points = [];
haizhuqu.markerinfos = [];
haizhuqu.points.push(new BMap.Point(113.327053,23.102299));//客村
haizhuqu.points.push(new BMap.Point(113.303626,23.098909));//中山大学
haizhuqu.points.push(new BMap.Point(113.324394,23.088537));//海珠区政府

//番禺区网点demo测试数据
var panyuqu = new Object();
panyuqu.points = [];
panyuqu.markerinfos = [];
panyuqu.points.push(new BMap.Point(113.399924,23.054756));//大学城
panyuqu.points.push(new BMap.Point(113.338121,22.919281));//沙湾机场
panyuqu.points.push(new BMap.Point(113.437581,22.874269));//小乌公园

//花都区网点demo测试数据
var huaduqu = new Object();
huaduqu.points = [];
huaduqu.markerinfos = [];
huaduqu.points.push(new BMap.Point(113.219257,23.376123));//花都新华
huaduqu.points.push(new BMap.Point(113.211783,23.383818));//广州北站
huaduqu.points.push(new BMap.Point(113.180163,23.422821));//洪秀全故居

//荔湾区网点demo测试数据
var liwanqu = new Object();
liwanqu.points = [];
liwanqu.markerinfos = [];
liwanqu.points.push(new BMap.Point(113.252602,23.131548));//陈家祠
liwanqu.points.push(new BMap.Point(113.246565,23.116526));//黄沙
liwanqu.points.push(new BMap.Point(113.232408,23.090465));//鸿图苑

//黄埔区网点demo测试数据
var huangpuqu = new Object();
huangpuqu.points = [];
huangpuqu.markerinfos = [];
huangpuqu.points.push(new BMap.Point(113.493276,23.114133));//华坑村
huangpuqu.points.push(new BMap.Point(113.458493,23.113069));//大沙镇
huangpuqu.points.push(new BMap.Point(113.44987,23.110277));//广州远洋宿舍

//萝岗区网点demo测试数据
var luogangqu = new Object();
luogangqu.points = [];
luogangqu.markerinfos = [];
luogangqu.points.push(new BMap.Point(113.508296,23.18438));//萝岗镇
luogangqu.points.push(new BMap.Point(113.491623,23.218194));//长村
luogangqu.points.push(new BMap.Point(113.515913,23.216998));//水尾

//南沙区网点demo测试数据
var nanshaqu = new Object();
nanshaqu.points = [];
nanshaqu.markerinfos = [];
nanshaqu.points.push(new BMap.Point(113.599132,22.77687));//九王庙公园
nanshaqu.points.push(new BMap.Point(113.5655,22.792464));//飞云顶
nanshaqu.points.push(new BMap.Point(113.5208,22.799261));//坦尾

//白云区网点demo测试数据
var baiyuqu = new Object();
baiyuqu.points = [];
baiyuqu.markerinfos = [];
baiyuqu.points.push(new BMap.Point(113.261585,23.182686));//时代花园
baiyuqu.points.push(new BMap.Point(113.264028,23.193515));//百顺台花园
baiyuqu.points.push(new BMap.Point(113.278329,23.202683));//白云骏景

area.push(tianhequ);
area.push(yuexiuqu);
area.push(haizhuqu);
area.push(panyuqu);

area.push(huaduqu);
area.push(liwanqu);
area.push(huangpuqu);
area.push(luogangqu);

area.push(nanshaqu);
area.push(baiyuqu);

/**
 * 设置区域内各网点标注信息
 * @param {Object}
 *            boundary 行政区域（如天河区）
 * 
 */
function setareamarkerinfo(boundary) {
	//console.log("已经进入标记点：");
	function callback(data){
		$(tianhequ.points)
		.each(
				function(i) {
		var markerinfo = "<div id='container' style='width: 600px; height: 150px; margin: 0 auto' onclick='BMap.test()'></div>"
				+ BMap.setMarkerInfo(data.rows[i].cell, demoparams);
		area[index].markerinfos.push(markerinfo);
		});
		//console.log("开始标记");
		BMap.addMarkers(area[index],demoparams);
	};
	switch(boundary)
	{
		case "天河区":
			index=0;
			break;
		case "越秀区":
			index=1;
			break;
		case "海珠区":
			index=2;
			break;
		case "番禺区":
			index=3;
			break;
		case "花都区":
			index=4;
			break;
		case "荔湾区":
			index=5;
			break;
		case "黄埔区":
			index=6;
			break;
		case "萝岗区":
			index=7;
			break;
		case "南沙区":
			index=8;
			break;
		case "白云区":
			index=9;
			break;
	
	}
	GRID.create('list', 'DS_MAP_DEMO_LIST_'+index, demoparams, 'griddemo');
	CORE.request("DS_MAP_DEMO_LIST_"+index,demoparams,callback);
};

// grid表格测试数据
var data = {
	"header" : {
		"code" : "0",
		"message" : "success",
		"isAlert" : "false"
	},
	"body" : {
		"page" : "1",
		"total" : "-1",
		"records" : "0",
		"colName" : [ "PROPERTY%5fCODE", "ST%5fPHYS%5fNAME", "PROPERTY%5fID",
				"LONGITUDE", "LATITUDE", "ADDRESS" ],
		"rows" : [
				{
					"id" : "02G312234",
					"cell" : [
							"02G312234",
							"%u91d1%u4e9a%u82b1%u56ed%u897f",
							"41920",
							"113%2e3036",
							"23%2e11323",
							"%u5e7f%u5dde%u5e02%u4e8c%u6c99%u5c9b%u91d1%u4e9a%u82b1%u56ed%u91d1%u4e9a%u5357%u8857%u4e00%u5ea77%u697c%u7ea620%u5e73%u65b9%u7c73" ]
				},
				{
					"id" : "02W312110",
					"cell" : [ "02W312110", "%u7a7a%u519b%u533b%u9662",
							"41854", "113%2e3076", "23%2e11396",
							"%u5e7f%u5dde%u5e02%u4e1c%u98ce%u4e1c%u8def801%u53f7" ]
				} ]
	}
};

// 显示人员路线
function showline() {
	var imei = document.getElementById("imei");
	// alert(imei.value);

	map.clearOverlays();// 从地图中移除覆盖物。

	drawPolylinecallback = function(points) {
		BMap.drawPolyline(points);
		BMap.run(points);// 人员运行展示
	};

	CORE.request("DS_MAP_BI_INSPECTION_LIST", {
		data : "IMEI=" + imei.value
	}, function(data) {
		var points = BMap.getGPSPoints(data, inspectionparams);
		;
		BMap.transMore(points, 0, drawPolylinecallback);// 批量转换坐标并画线
	});

}
function clsall() {
	map.clearOverlays();
}

// 显示基站信息
function showproperty() {
	map.clearOverlays();// 从地图中移除覆盖物。如果覆盖物从未被添加到地图中，则该移除不起任何作用。

	// 获得基站信息的回调函数
	getpropertycallback = function(data) {
		var markerdata = new Object();
		markerdata.points = [];
		markerdata.markerinfos = [];

		var gpspoints = BMap.getGPSPoints(data, propertyparams);// 未转换前的坐标

		// 坐标转换后的回调函数
		transcallback = function(points) {
			// alert("坐标转换后："+points);
			markerdata.points = points;
			$(data.rows)
					.each(
							function(i) {
								var markerinfo = "<div id='container' style='width: 600px; height: 150px; margin: 0 auto' onclick='BMap.test()'></div>"
										+ BMap.setMarkerInfo(data.rows[i].cell,
												propertyparams);
								markerdata.markerinfos.push(markerinfo);

								// markerinfo +=
								// document.getElementById("container").innerHTML;

							});
			// alert("标记前：");
			BMap.addMarkers(markerdata);// 标记点
		};
		BMap.transMore(gpspoints, 0, transcallback);// 先进行坐标转换，在回调里处理弹窗信息
	};

	// 坐标转换完之后的回调函数
	getgpsboundsCallback = function(points) {
		/*
		 * testcallback= function(points){ var markerdata = new Object();
		 * markerdata.points = points; markerdata.markerinfos = [];
		 * markerdata.markerinfos.push("西南1");
		 * markerdata.markerinfos.push("东北2"); BMap.addMarkers(markerdata);//标记点 };
		 * BMap.transMore(points,0,testcallback);
		 */
		BMap.getproperty(points, getpropertycallback);
	};
	BMap.getgpsbounds(getgpsboundsCallback);// 获取地图可视区域的GPS坐标
}

// 显示行政区域信息
function showBoundary() {
	var boundary = document.getElementById("boundary");
	BMap.getBoundary(boundary.value);

}

// 显示图表
function showChart() {
	BMap.clsall();
	var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(113.331311,
			23.142898), "container");
	// map.centerAndZoom(new BMap.Point(113.331311,23.142898),15);
	map.addOverlay(myCompOverlay);
	// alert(document.getElementById("container").innerHTML);
}

// 自定义图表覆盖层
function ComplexCustomOverlay(point, name) {
	this._point = point;
	this._name = name;
	// this._data = data;
}

ComplexCustomOverlay.prototype = new BMap.Overlay();

ComplexCustomOverlay.prototype.initialize = function(map) {
	this._map = map;
	var div = this._div = document.createElement("div");
	div.id = this._name;
	div.style.position = "absolute";// 
	div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
	div.style.width = "150px";
	div.style.height = "200px";
	div.style.display = "none";
	// div.style.padding = "200px";
	// div.margin = 0;
	// 将DIV添加到覆盖物容器中
	// map.getPanes().labelPane.appendChild(div);
	map.getPanes().floatPane.appendChild(div);
	// map.getPanes().markerMouseTarget.appendChild(div);
	
	// BMap.testCreateChartdemo(this._name,"pie");
	BMap.testCreateChartdemo(this._name, "column");

	return div;
};

// 重绘更新位置信息
ComplexCustomOverlay.prototype.draw = function() {
	if (this._div && this._point) {
		var map = this._map;
		var pixelPosition = map.pointToOverlayPixel(this._point);
		pixelPosition.x -= parseInt(this._div.style.width) / 2;
		pixelPosition.y -= parseInt(this._div.style.height);
		this._div.style.left = pixelPosition.x + "px";
		this._div.style.top = pixelPosition.y + "px";

	}
};

//自定义图表覆盖层显示
ComplexCustomOverlay.prototype.show = function() {
	if (this._div) {
		this._div.style.display = "";
		// console.log("show111");
	}
};

//自定义图表覆盖隐藏
ComplexCustomOverlay.prototype.hide = function() {
	if (this._div) {
		this._div.style.display = "none";
	}
};

// 自定义左下角饼图覆盖层
function PieControl(name) {
	this._name = name;
	// 默认停靠位置和偏移量
	this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT;
	this.defaultOffset = new BMap.Size(10, 10);
	// this._data = data;
}

// 通过JavaScript的prototype属性继承于BMap.Control
PieControl.prototype = new BMap.Control();

PieControl.prototype.initialize = function(map) {
	this._map = map;
	var div = this._div = document.createElement("div");
	div.id = this._name;
	div.style.position = "absolute";//
	div.style.zIndex = "9999";
	div.style.width = "280px";
	div.style.height = "200px";

	// 添加DOM元素到地图中
	map.getContainer().appendChild(div);
	// this._div = div;
	BMap.testCreateChartdemo(this._name, "pie");
	// BMap.testCreateChartdemo(this._name,"column");

	return div;
};

PieControl.prototype.show = function() {
	if (this._div) {
		this._div.style.display = "";
	}
};

PieControl.prototype.hide = function() {
	if (this._div) {
		this._div.style.display = "none";
	}
};

// 自定义左上角图例覆盖层
function TuLiControl() {
	this._name = "tuli";
	// 默认停靠位置和偏移量
	this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
	this.defaultOffset = new BMap.Size(10, 10);
	// this._data = data;
}
// 通过JavaScript的prototype属性继承于BMap.Control
TuLiControl.prototype = new BMap.Control();

TuLiControl.prototype.initialize = function(map) {
	this._map = map;
	var div = this._div = document.createElement("div");
	div.id = this._name;
	div.style.width = "70px";
	div.style.height = "80px";
	div.style.background = "url('pages/map/demo_images/demo_tuli.jpg')";
	map.getContainer().appendChild(div);

	return div;
};

TuLiControl.prototype.show = function() {
	if (this._div) {
		this._div.style.display = "";
	}
};

TuLiControl.prototype.hide = function() {
	if (this._div) {
		this._div.style.display = "none";
	}
};

// 根据右边栏得到区域
function getareademo() {
	//console.log("准备进入标记点");
	var areas = document.getElementById("areaselect");
	BMap.getBoundary(areas.options[areas.selectedIndex].text);
	
}