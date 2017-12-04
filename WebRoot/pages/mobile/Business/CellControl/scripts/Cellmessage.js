var isreadyforlocation=false;
//获取位置信息
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
function onSuccess(position) {
	var longitude= position.coords.longitude;
		/*$("#Longitude").html("经度"+position.coords.longitude.toString().substr(0,position.coords.longitude.toString().indexOf(".")+3));//经度*/
	$("#Longitude").html("经度"+position.coords.longitude);//经度
	var latitude= position.coords.latitude;
		/*$("#Latitude").html("纬度"+position.coords.latitude.toString().substr(0,position.coords.latitude.toString().indexOf(".")+3));//维度*/
	$("#Latitude").html("纬度"+position.coords.latitude);//维度
	isreadyforlocation=true;
}
function onError(error) {
	alert('code: '    + error.code    + '\n' +
	'message: ' + error.message + '\n');
}

app.registerCtrl("Cellmessage", ["$scope", "$srhttp", "$rootScope", "$routeParams",
			function($scope, $srhttp, $rootScope, $routeParams) {
				var arry=[];//定义一空数组
				var resert=false;
				$rootScope.apptitle="基站管理";
				var clicknum=1;
		$scope.getdata=function(a,b,c,d,opt){
			$srhttp.post("!property/mobile/~query/Q_BI_PROPERTY_LIST",{
				hsesTypeId:"",
				hsorgId:"",
				hspropertyTypeId:"",
				page:a,
				rows:b,
				sesType:"",
				sorgName:"",
				spropertyType:"",
				spropertyname:d
			},function(data){
				$("#g1").show();
				$("#g2").hide();
				$("#g3").hide();
				if(data instanceof Object){
				if (data.header.code == 0) {
					if(resert){
						resert=false;
						arry=[];
					}
					for(var j=0;j<data.body.rows.length;j++){
						arry.push(data.body.rows[j]);
					}
					$scope.mylist=arry;
					Local.saveStoreJson("Cellmessage",arry);
					if(data.body.rows.length<10){
						$("#g3").show();
						$("#g1").hide();
					}
				}else{
					alert("请求数据失败！");
				}}
			},opt);
				};
				//$scope.getdata(1,10);
				//监听位置信息是否获取到
				var a=0;
				if(Local.getStoreJson("Cellmessage")==null){
					var interval=setInterval(function(){
						a++;
						if(isreadyforlocation){
							clearInterval(interval);
							$scope.getdata(1,10);
						}
						if(a==10){
							alert("位置信息获取失败！");
						}
					},1000);
				}else{
					$scope.mylist=Local.getStoreJson("Cellmessage");
				}


				$scope.getmoredata=function(){
					clicknum++;
					$("#g1").hide();
					$("#g2").show();
					var spropertycodeandname= $("#spropertycode").val();
					if(spropertycodeandname==""){
						$scope.getdata(1*clicknum,10,"","",{mask:false});
					}else if(/^[0-9a-zA-Z]+$/.test(spropertycodeandname)) {
						$scope.getdata(1*clicknum,10,spropertycodeandname,"",{mask:false});
					}else{
						$scope.getdata(1*clicknum,10,"",spropertycodeandname,{mask:false});
					}
				}

				$scope.g_query=function(){
					clicknum=1;
					resert=true;
					var spropertycodeandname= $("#spropertycode").val();
					$scope.getdata(1, 10, "", spropertycodeandname);
				};
		$scope.g_edit=function(event){
			var a=event.target.getAttribute("attr1");
			var b=event.target.getAttribute("attr2");
			var c=event.target.getAttribute("attr3");
			var d=event.target.getAttribute("attr4");
				var g_adress={
					PROPERTYCODE:a,
					PROPERTYNAME:b,
					PROPERTYADDR:c,
					PROPERTYID:d
				}
			console.info(g_adress);
				Local.saveStoreJson("g_form",g_adress);
				hrefJump('celledit');
				};

	}
]);