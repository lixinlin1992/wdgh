
//获取位置信息
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
function onSuccess(position) {
/*	$("#Longitude").html("经度"+position.coords.longitude.toString().substr(0,position.coords.longitude.toString().indexOf(".")+3));//经度
	$("#Latitude").html("维度"+position.coords.latitude.toString().substr(0,position.coords.latitude.toString().indexOf(".")+3));//维度*/
	$("#Longitude").html("经度"+position.coords.longitude);//经度
	$("#Latitude").html("维度"+position.coords.latitude);//维度
	/*			var element = document.getElementById('geolocation');
	 element.innerHTML = 'Latitude: '          + position.coords.latitude         + '<br />' +
	 'Longitude: '         + position.coords.longitude        + '<br />' +
	 'Altitude: '          + position.coords.altitude         + '<br />' +
	 'Accuracy: '          + position.coords.accuracy         + '<br />' +
	 'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
	 'Heading: '           + position.coords.heading          + '<br />' +
	 'Speed: '             + position.coords.speed            + '<br />' +
	 'Timestamp: '         + position.timestamp               + '<br />';*/
}
function onError(error) {
	alert('code: '    + error.code    + '\n' +
	'message: ' + error.message + '\n');
}
app.registerCtrl("Cellmess_edit", ["$scope", "$srhttp", "$rootScope", "$routeParams",
	function($scope, $srhttp, $rootScope, $routeParams) {
		$rootScope.apptitle="基站信息管理";

		$scope.isexmp=true;
		//获取基站信息
		$scope.g_adress=Local.getStoreJson("g_form");
		//加载数据
		$scope.getdata=function(){
		$srhttp.post("!property/mobile/~query/Q_LOAD_PROPERTY_INFO_MOBILE",{propertyId:$scope.g_adress.PROPERTYID},function(data){//77155
			if(data instanceof Object){
			if(data.header.code==0){
				console.info(data);
				if(data.body.IS_EXAMPLE&&data.body.IS_EXAMPLE=="否"){
					$scope.isexmp=false;
				}
				$scope.row=data.body;
			}else{
				alert(data.header.message);
			}}
		});
		}
		$scope.getdata();
	//保存信息
		$scope.g_save=function(event){
			var g_arrys=$("#g_message").serializeArray();
			if(g_arrys[0].value=="是"){
				g_arrys[0].value=1;
			}
			if(g_arrys[0].value=="否"){
				g_arrys[0].value=0;
			}
			for(var i=0;i<g_arrys.length;i++){
				for(var j in g_arrys[i]){
					if(g_arrys[i][j]==""){
						alert("还有未输入项！");
						return;
					}
					if(j=="value"){
						if(/^\d+(\.\d+)?$/.test(g_arrys[i][j])){
						}else{
							alert("输入格式有误！");
							return;
						}
					}
				}
			}
			if(parseInt(g_arrys[0].value)!==1&&parseInt(g_arrys[0].value)!==0){
				alert("标杆格式输入错误：1是，0否");
				return;
			}
			var a=event.target.getAttribute("attr1");
		$srhttp.post("!property/mobile/~query/Q_UPDATE_PROPERTY_INFO_MOBILE?"+$("#g_message").serialize(),{propertyId:a},function(data){
				if(data.header.code==0){
					alert("更新成功！");
					history.back();
				}else{
					alert(data.header.message);
				}
			});
		}
	//取消信息
		$scope.g_cancel=function(){
			$("#g_message").find("input").val("");
		}

	}
]);

function calculateEDcPower() {
	var temp = ($("#output").val() * 53.5 / 0.9 / 1000).toFixed(4);
	$("#dcPower").val(temp);
	calculateSumPower();
	if($("#share_eletronic").val() != "")
		calculateSharePercent();
}

function calculateSumPower() {
	var edcpower = $("#dcPower").val() == '' ? 0 : $("#dcPower").val();
	var eacpower = $("#acPower").val() == '' ? 0 : $("#acPower").val();
	var e1_5pcount = $("#ue1_5pcount").val() == '' ? 0 : $("#ue1_5pcount").val();
	var e2_5pcount = $("#ue_2pcount").val() == '' ? 0 : $("#ue_2pcount").val();
	var e3pcount = $("#ue_3pcount").val() == '' ? 0 : $("#ue_3pcount").val();
	var e5pcount = $("#ue_5pcount").val() == '' ? 0 : $("#ue_5pcount").val();
	var sumpower = '';
	sumpower = parseFloat(edcpower) + parseFloat(eacpower) + parseFloat((e1_5pcount * 1.5 + e2_5pcount * 2 + e3pcount * 3 + e5pcount * 5) * 0.735);
	$("#sumPower").val(sumpower.toFixed(4));
}

function calculateSharePercent()
{
	if($("#output").val() == "" || isNaN($("#output").val()) || $("#output").val() == "0")
	{
		alert("提示","请先填写正确格式的开关电源输出总电流","info");
		$("#output").val("");
		$("#share_eletronic").val("");
		return false;
	}
	$("#share_percent").val(parseFloat($("#share_eletronic").val()) / parseFloat($("#output").val()) * 100)
}