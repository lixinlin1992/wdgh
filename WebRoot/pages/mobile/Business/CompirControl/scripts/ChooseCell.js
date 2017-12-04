//获取位置信息
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
function onSuccess(position) {
	var longitude= position.coords.longitude;
	$("#Longitude").html("经度"+position.coords.longitude);//经度
	var latitude= position.coords.latitude;
	$("#Latitude").html("纬度"+position.coords.latitude);//维度
}
function onError(error) {
	alert('code: '    + error.code    + '\n' +
	'message: ' + error.message + '\n');
}


app.registerCtrl("ChooseCell", ["$scope", "$srhttp", "$rootScope", "$routeParams",
	function($scope, $srhttp, $rootScope, $routeParams) {
		var arry=[];//定义一空数组
		var resert=false;
		$rootScope.apptitle="选择站点";
		$(".appHeader").find("a").eq(1).show();
		$(".appHeader").find("a").eq(2).hide();
		var clicknum=1;
		//获取信息
		$scope.getdata=function(a,b,c,d,opt){
			$srhttp.post("!property/ammeterReadingManagement/~query/Q_READING_PROP_LIST",{
				page:a,
				propcode:c,
				propname:d,
				rows:b
			},function(data){
				$("#g1").show();
				$("#g2").hide();
				$("#g3").hide();
				if(data instanceof Object){
				console.info(data);
				if (data.header.code == 0) {
					if(resert){
						resert=false;
						arry=[];
					}
					for(var j=0;j<data.body.rows.length;j++){
						arry.push(data.body.rows[j]);
					}
					$scope.mylist=arry;
					Local.saveStoreJson("ChooseCell",arry);
					if(data.body.rows.length<10){
						$("#g3").show();
						$("#g1").hide();
					}
				}else{
					alert("请求数据失败！");
				}}
			},opt);
		};
		if(Local.getStoreJson("ChooseCell")==null){
			$scope.getdata(1,10);
		}else{
			$scope.mylist=Local.getStoreJson("ChooseCell");
		}
		$scope.getmoredata=function(){
			clicknum++;
			$("#g1").hide();
			$("#g2").show();
			var PROP_CODE="";
			var PROP_NAME="";
			var PROP_CODE_NAME= $("#PROP_CODE_NAME").val();
			if(/^[0-9a-zA-Z]+$/.test(PROP_CODE_NAME)){
				PROP_CODE=PROP_CODE_NAME;
			}else{
				PROP_NAME=PROP_CODE_NAME;
			}
			$scope.getdata(1*clicknum,10,PROP_CODE,PROP_NAME,{mask:false});

		}
		$scope.g_query=function(){
			clicknum=1;
			resert=true;
			var PROP_CODE="";
			var PROP_NAME="";
			var PROP_CODE_NAME= $("#PROP_CODE_NAME").val();
			if(/^[0-9a-zA-Z]+$/.test(PROP_CODE_NAME)){
				PROP_CODE=PROP_CODE_NAME;
			}else{
				PROP_NAME=PROP_CODE_NAME;
			}
				$scope.getdata(1,10,PROP_CODE,PROP_NAME);
		};
		$scope.g_edit=function(event){
			var a=event.target.getAttribute("attr1");
			var b=event.target.getAttribute("attr2");
			var c=event.target.getAttribute("attr3");
			var d=event.target.getAttribute("attr4");
			var e=event.target.getAttribute("attr5");
			var g_obj={
				PROP_ID:a,
				PROP_CODE:b,
				PROP_NAME:c,
				PROPERTY_TYPE_NAME:d,
				PROP_ADDRESS:e
			}
			$srhttp.post("!property/ammeterReadingManagement/~query/Q_AMMETER_READING_AMMETER_LIST",{
				propertyId:a
			},function(data){
				if(data instanceof Object){
				if (data.body.rows.length>0) {
					Local.saveStoreJson("g_form2",data);
					Local.saveStoreJson("g_form",g_obj);
					hrefJump("messageforphoto");
				}else{
					alert("该站点没有审核通过的电表合同或者电表!");
				}}
			});


		}

	}
]);