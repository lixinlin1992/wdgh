var longitude="";
var latitude="";

//获取位置信息
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
function onSuccess(position) {
	longitude= position.coords.longitude;
	latitude= position.coords.latitude;
}
function onError(error) {
	alert('code: '    + error.code    + '\n' +
	'message: ' + error.message + '\n');
}

var imageurl="";
var import_order_id="";
function success(msg) {
	$("#localimg").attr("src", imageurl);
	alert("上传成功！");
}
function error(){
	alert("上传失败！");
}
//upload方法
function upload(params){
	navigator.camera.getPicture(function(imageURI){
		imageurl=imageURI;
		var sessionid=Local.getStoreJson("sessionid");
		androidocr.upload(success,error,[APP_CONFIG.SERVER_URL,sessionid,imageURI,params]);
	}, 	function(message) {
		navigator.notification.alert("拍照失败，原因：" + message, null, "警告");
	}, {
		destinationType: Camera.DestinationType.FILE_URI,
		sourceType: Camera.PictureSourceType.PHOTOLIBRARY
	});

}
function getparams(params,imageURI){
	while(params.indexOf("'") >= 0)
		params=params.replace(/'/,'"');
	$("#"+$.parseJSON(params).note+$.parseJSON(params)['div_name']).attr("src", imageURI);
}
// /扩展日期格式化方法
Date.prototype.Format = function(fmt)
{ //author: meizz
	var o = {
		"M+" : this.getMonth()+1,                 //月份
		"d+" : this.getDate(),                    //日
		"h+" : this.getHours(),                   //小时
		"m+" : this.getMinutes(),                 //分
		"s+" : this.getSeconds(),                 //秒
		"q+" : Math.floor((this.getMonth()+3)/3), //季度
		"S"  : this.getMilliseconds()             //毫秒
	};
	if(/(y+)/.test(fmt))
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("("+ k +")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	return fmt;
}
app.registerCtrl("Messageforedit", ["$scope", "$srhttp", "$rootScope", "$routeParams",
	function($scope, $srhttp, $rootScope, $routeParams) {
		var sessionid=Local.getStoreJson("sessionid");
		$rootScope.apptitle="添加抄表记录";
		$(".appHeader").find("a").eq(1).show();
		$(".appHeader").find("a").eq(2).hide();

		$scope.getcurrenttime=function(){
			$("#currenttime").val(new Date().Format("yyyy-MM-dd"));
		}

		$scope.mylist=Local.getStoreJson("g_form").body;
		import_order_id=$scope.mylist.ammeter_reading_id;
		console.info($scope.mylist);
		alert(window.location.pathname);

//保存信息到服务器
		$scope.g_save=function(){
			if($("#currenttime").val()!=""&&$("#currentnum").val()!=""){
				if(!/^[0-9]{4}(-[0-9]{2})(-[0-9]{2})$/.test($("#currenttime").val())){
					alert("日期格式不正确！");
					return;
				}else if(!/^[0-9]+.?[0-9]+$/.test($("#currentnum").val())){
					alert("抄表度数不正确！");
					return;
				}else{
					$srhttp.post("!property/ammeterReadingManagement/~query/Q_AMMETER_READING_UPDATE",{
						__resultType:'json',
						_sysCode:"",
						ammeter_id:$scope.mylist.ammeter_id,
						ammeter_reading_id:$scope.mylist.ammeter_reading_id,
						area_name:$scope.mylist.area_name,
						code:$scope.mylist.code,
						data_reading:$("#currentnum").val(),
						date_reading:$("#currenttime").val(),
						electricity_name:$scope.mylist.electricity_name,
						file_url:"",
						max_reading:$scope.mylist.max_reading,
						pre_ammeter_reading_id:"",
						pre_data_reading:$scope.mylist.pre_data_reading,
						pre_date_reading:$scope.mylist.pre_date_reading,
						pre_round_number:$scope.mylist.pre_round_number,
						property_code:$scope.mylist.property_code,
						property_id:$scope.mylist.property_id,
						property_name:$scope.mylist.property_name,
						property_type_name:$scope.mylist.property_type_name,
						round_number:$scope.mylist.round_number
					},function(data){
						if(data.header.code==0){
							alert("更新成功！");
						}
					})
				}
			}else{
				alert("输入不能为空！");
				return;
			}
		}

		function loadImage() {
			//拍照并显示在屏幕
			navigator.camera.getPicture(onLoadImageSuccess, onLoadImageFail, {destinationType: Camera.DestinationType.DATA_URL});
		}
		//拍照成功后回调
		function onLoadImageSuccess(imageURI) {
			//这里的图片经过了base64编码
			var src = "data:image/jpeg;base64," + imageURI;
			$("#getImage").attr("src", src);
			$("#getImage").show();
		}
		//所有获取图片失败都回调此函数
		function onLoadImageFail(message) {
			navigator.notification.alert("拍照失败，原因：" + message, null, "警告");
		}

		//本地获取图片方法
		function loadImageLocal() {
			upload("{'import_order_id':'"+import_order_id+"','div_name'"+":'"+0+"','table_name':"+"'"+"PAY_AMMETER_READING"+"','note':'"+"PAY_AMMETER_READING"+"','longitude':'"+longitude+"','latitude':'"+latitude+"','time':'"+new data()+"'}");
			//获取本地图片并显示在屏幕
			/*		navigator.camera.getPicture(onLoadImageLocalSuccess, onLoadImageFail, {
			 destinationType: Camera.DestinationType.FILE_URI,
			 sourceType: Camera.PictureSourceType.PHOTOLIBRARY
			 });*/
		}
		//本地图片选择成功后回调此函数
		function onLoadImageLocalSuccess(imageURI) {
			var params="{'busiId':'Account','busiType':'APP','size':1000,'_param':'" + 'localImg' + "','JSESSIONID':'" + sessionid + "'}";
			androidocr.upload(success,error,[APP_CONFIG.SERVER_URL,Local.getStoreJson("sessionid"),imageURI,params]);
			$("#getImageLocal").attr("src", imageURI);
			$("#getImageLocal").show();
		}
		//拍照上传并显示在屏幕
		function loadImageUpload() {
			//拍照上传并显示在屏幕
			navigator.camera.getPicture(onLoadImageUploadSuccess, onLoadImageFail, {
				destinationType: Camera.DestinationType.FILE_URI
			});
		}
		//图片拍照成功后回调此函数
		function onLoadImageUploadSuccess(imageURI) {
			//此处执行文件上传的操作，上传成功后执行下面代码
			var options = new FileUploadOptions(); //文件参数选项
			options.fileKey = "file";//向服务端传递的file参数的parameter name
			options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);//文件名
			options.mimeType = "image/jpeg";//文件格式，默认为image/jpeg
			var ft = new FileTransfer();//文件上传类
			ft.onprogress = function (progressEvt) {//显示上传进度条
				if (progressEvt.lengthComputable) {
					navigator.notification.progressValue(Math.round(( progressEvt.loaded / progressEvt.total ) * 100));
				}
			}
			navigator.notification.progressStart("提醒", "当前上传进度");
			ft.upload(imageURI, encodeURI(APP_CONFIG.SERVER_URL), function () {
				navigator.notification.progressStop();//停止进度条
				$("#getImageUpload").attr("src", imageURI);
				$("#getImageUpload").show();
				navigator.notification.alert("文件上传成功！", null, "提醒");
			}, null, options);
		}
			//电表拍照上传
			$scope.g_elephoto=function(event){
				var note=event.target.getAttribute("note");
				if(confirm("是否上传照片？")){
					$scope.g_takePhoto(note);
				}else{
					loadImage();
				}
			}
			//基站拍照上传
			$scope.g_cellphoto=function(event){
				var note=event.target.getAttribute("note");
				if(confirm("是否上传照片？")){
					$scope.g_takePhoto(note);
				}else{
					loadImage();
				}
			}
			//选择本地图片进行上传
			$scope.g_getlocalphoto=function(){
				//$scope.g_takePhoto(type);
				loadImageLocal();
			}
			//框架的拍照方法
			$scope.g_takePhoto = function(note) {
				TakePhoneUpload("{'import_order_id':'"+import_order_id+"','div_name'"+":'"+0+"','table_name':"+"'"+"PAY_AMMETER_READING"+"','note':'"+note+"','longitude':'"+longitude+"','latitude':'"+latitude+"','time':'"+new data()+"'}");
			}






	}
]);