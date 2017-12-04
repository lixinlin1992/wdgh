<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<style type="text/css">
body,html,#allmap {
	width: 100%;
	height: 100%;
	overflow: hidden;
	margin: 0;
}

#l-map {
	height: 100%;
	width: 78%;
	float: left;
	border-right: 2px solid #bcbcbc;
}

#r-result {
	height: 100%;
	width: 20%;
	float: left;
}
</style>
<!-- 引入框架 -->
<jsp:include page="/pages/framework/base.jsp" />
<!-- 百度地图API -->
<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.4"></script>
<!-- highchart图表 -->
<script type="text/javascript" src="scripts/map/highcharts.js"></script>
<!-- 图表报表打印和图片输出  -->
<script type="text/javascript"
	src="http://code.highcharts.com/modules/exporting.js"></script>
<!-- demo示例JS -->
<script type="text/javascript" src="scripts/map/bmapdemo/bmapdemo.js"></script>

<title>地图监控DEMO</title>
<script type="text/javascript">
	//parent.switchSysBar();
	var map;//地图对象
	var chart;//图表对象
	var myPieControl;//饼图控件
	var tuliControl;//图例控件
	var index;//区域序号
	$(document)
			.ready(
					function() {
						map = new BMap.Map("allmap"); // 创建Map实例
						map.centerAndZoom("广州", 12); // 初始化地图,设置中心点坐标和地图级别。
						//map.addControl(new BMap.NavigationControl()); //添加默认缩放平移控件
						map.addControl(new BMap.NavigationControl({
							anchor : BMAP_ANCHOR_BOTTOM_RIGHT,
							type : BMAP_NAVIGATION_CONTROL_SMALL
						}));//右下角，仅包含平移和缩放按钮
						map.enableScrollWheelZoom(); //启用滚轮放大缩小
						var cr = new BMap.CopyrightControl({
							anchor : BMAP_ANCHOR_TOP_RIGHT
						});
						map.addControl(cr); //添加版权控件
						var bs = map.getBounds();
						cr
								.addCopyright({
									id : 1,
									content : "<a style='font-size:12px'>地图监控DEMO CopyRight2012©版权所有 广州市森锐电子科技有限公司</a>",
									bounds : bs
								});
						showtype();//根椐选择的级别显示不同的内容

						/* //拖拽事件
						map.addEventListener("dragend", function showInfo(){
							map.removeOverlay(myPieOverlay);
							BMap.showpiedemo();
							//map.addOverlay(myPieOverlay);
							});
						//showareademo()//展示柱区域状图 */

					});
	/**
	*地图上显示的级别类型
	*/
	function showtype() {
		var i, area, selecttype;
		area = document.getElementsByName("area");
		for (i = 0; i < area.length; i++) {
			if (area[i].checked)
				break;
		}
		;
		if (i >= area.length) {
			alert("没有选择任何对象");
		} else {
			if (i == 0) {//根椐区域显示
				BMap.clsall();//移除所有覆盖物
				BMap.getBoundarydemo();//各区域图表
				BMap.showpiedemo();//左下角饼图
				BMap.showtulidemo();//图例
				document.getElementById('selectarea').style.display = "none";//区域选择隐藏
				selecttype = document.getElementsByName("selecttype");
				selecttype[0].checked = true;
				selecttype[0].disabled = false;
				selecttype[1].disabled = true;
				selecttype[2].disabled = true;
				document.getElementById('grid').style.display = "none";//明细报表隐藏
			} else if (i == 1) {//根据网点显示
				BMap.clsall();//移除所有覆盖物
				map.removeControl(myPieControl);//移除左下角饼图控件
				map.removeControl(tuliControl);//移除左上图例控件
				document.getElementById('selectarea').style.display = "";//区域选择显示
				selecttype = document.getElementsByName("selecttype");
				selecttype[1].checked = true;
				selecttype[0].disabled = true;
				selecttype[1].disabled = false;
				selecttype[2].disabled = false;
				getareademo();//根据右边选择的区域，显示对应区域内的信息
				document.getElementById('grid').style.display = "";//明细报表显示
			}
		}
	};
</script>
</head>
<body>

	<div id="bmapdemo" style="width: 100%">
		<table width="100%" height="100%" bordercolor="#009999" border="1">
			<tr>
				<td width="100%" height="24px">
					<form style="height: '24px'">
						选择显示的级别： <input type="radio" value="1" checked="checked"
							name="area" onclick="showtype()" />区域显示 <input type="radio"
							value="2" name="area" onclick="showtype()" />网点/营业厅
					</form></td>
				<td width="230px" height="100%" rowspan="2" valign="top">
					<div id="bmapright" style="width: 230px">

						<div style="heigth: 24px">
							<input type="radio" value="1" checked="checked" name="selecttype" />区域显示
							<input type="radio" value="2" name="selecttype" />网点 <input
								type="radio" value="3" name="selecttype" />自定义
						</div>
						<p />
						<hr />

						<div id="selectarea" style="heigth: 50px">
							请选择行政区域：<select name="areaselect" id="areaselect"
								onclick="getareademo()">
								<option value="89">天河区</option>
								<option value="87">越秀区</option>
								<option value="90">白云区</option>
								<option value="88">海珠区</option>
								<option value="95">番禺区</option>
								<option value="91">花都区</option>
								<option value="86">荔湾区</option>
								<option value="93">萝岗区</option>
								<option value="92">黄埔区</option>
								<option value="94">南沙区</option>
							</select>
							<p />
							<hr />
						</div>

						<div style="heigth: 750px">
							日期：<br />从<input type="datetime" value="2012-01-01" /><br />到<input
								type="datetime" value="2013-01-01" /> <br /> <input
								type="button" value="开始搜索" /> <br />
							<hr />
						</div>
						<div style="heigth: 150px">
							<input type='checkbox' name='Option' value=1 checked="checked">网点数量
							<br /> <input type='checkbox' name='Option' value=2
								checked="checked">发展量 <br /> <input type='checkbox'
								name='Option' value=3 checked="checked">2G发展量 <br /> <input
								type='checkbox' name='Option' value=4 checked="checked">3G发展量
							<p />
							<hr />

						</div>
					</div>
				</td>
			</tr>
			<tr>
				<td width="100%" height="100%">
					<div id="allmap"></div></td>
			</tr>
			<tr>
				<td colspan="3" align="left">
					<div id="grid" style="height: 100px">
						<form id="griddemo">明细报表:</form>
						<div>
							<table id="list" align="left"></table>
							<div id="pagerdt"></div>
						</div>
					</div>
				</td>
			</tr>
		</table>

	</div>



</body>
</html>
