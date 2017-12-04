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
var num="";
function success(msg) {
	alert("上传成功！");
	$("#localimg"+num).attr("src", imageurl);
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

//扩展日期格式化方法
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
app.registerCtrl("Messageforphoto", ["$scope", "$srhttp", "$rootScope", "$routeParams",
	function($scope, $srhttp, $rootScope, $routeParams) {
		var sessionid=Local.getStoreJson("sessionid");
		$rootScope.apptitle="添加抄表记录";
	$scope.getcurrenttime=function(event){
		var id=event.target.getAttribute("attr");
		$("#currenttime"+id).val(new Date().Format("yyyy-MM-dd"));
	}
	$scope.save=function(event){
		var i=event.target.getAttribute("attr");
		//for(var i=0;i<$scope.mylist2.length;i++){
		if($("#currenttime"+i).val()==""||$("#currentnum"+i).val()==""){
			alert("本次抄表日和本次抄表读数不能为空！");
			return;
		}
		if(!/^[0-9]{4}(-[0-9]{2})(-[0-9]{2})$/.test($("#currenttime"+i).val())){
			alert("日期格式不正确！");
			return;
		}
		if(!/^\d+$/.test($("#currentnum"+i).val())){
			alert("抄表读书不正确！");
			return;
		}
		var createDate=$("#currenttime"+i).val();
		var reading=$("#currentnum"+i).val();

		console.info(createDate+"  "+reading);
		$srhttp.post("!property/ammeterReadingManagement/~query/Q_AMMETER_READING_ADD",{
			 __resultType:'json',
			 _sysCode:"",
			 ammeterId:$scope.mylist2[i].AMMETER_ID,
			 ammeterReadingId:$scope.mylist2[i].AMMETER_READING_ID,
			 createDate:createDate,
			 lastDate:$scope.mylist2[i].DATE_READING,
			 maxReading:99999,
			 numCount:1,
			 preRoundNumber:0,
			 propertyCode:$scope.mylist.PROP_CODE,
			 propertyId:$scope.mylist.PROP_ID,
			 propertyName:$scope.mylist.PROP_NAME,
			 propertyTypeName:$scope.mylist.PROPERTY_TYPE_NAME,
			 reading:reading,
			 roundNumber:0,
			 t:new Date(),
			 thisAmReaId:$scope.mylist2[i].THIS_AMREAD_ID
		},function(data){
			if(data.header.code==0){
				alert("更新成功！");
			}else{
				alert("更新失败！");
			}
		});
		//}
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
	function loadImageLocal(AMMETER_READING_ID,div_name,table_name,note) {
		upload("{'import_order_id':'"+AMMETER_READING_ID+"','div_name'"+":'"+div_name+"','table_name':"+"'"+table_name+"','note':'"+note+"','longitude':'"+longitude+"','latitude':'"+latitude+"','time':'"+new data()+"'}");
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


		$scope.mylist=Local.getStoreJson("g_form");
		$scope.mylist2=Local.getStoreJson("g_form2").body.rows;
		console.info("===================");
		console.info($scope.mylist2);
console.info($scope.mylist);

//电表拍照上传
		$scope.g_elephoto=function(event){
			var AMMETER_READING_ID=event.target.getAttribute("AMMETER_READING_ID");
			var div_name=event.target.getAttribute("div_name");
			num=div_name;
			var table_name=event.target.getAttribute("table_name");
			var note=event.target.getAttribute("note");
			console.info("--------------------------------------------");
			console.info(AMMETER_READING_ID+"    "+div_name+"   "+table_name);
			if(confirm("是否上传照片？")){
				$scope.g_takePhoto(AMMETER_READING_ID,div_name,table_name,note);
			}else{
				loadImage();
			}
		}
//基站拍照上传
		$scope.g_cellphoto=function(event){
			var AMMETER_READING_ID=event.target.getAttribute("AMMETER_READING_ID");
			var div_name=event.target.getAttribute("div_name");
			num=div_name;
			var table_name=event.target.getAttribute("table_name");
			var note=event.target.getAttribute("note");
			if(confirm("是否上传照片？")){
				$scope.g_takePhoto(AMMETER_READING_ID,div_name,table_name,note);
			}else{
				loadImage();
			}
		}
//选择本地图片进行上传
		$scope.g_getlocalphoto=function(event){
			var AMMETER_READING_ID=event.target.getAttribute("AMMETER_READING_ID");
			var div_name=event.target.getAttribute("div_name");
			num=div_name;
			var table_name=event.target.getAttribute("table_name");
			var note=event.target.getAttribute("note");
			//$scope.g_takePhoto(type);
			loadImageLocal(AMMETER_READING_ID,div_name,table_name,note);
		}
//框架的拍照方法	$scope.g_takePhoto(AMMETER_READING_ID,div_name,table_name);
		$scope.g_takePhoto = function(AMMETER_READING_ID,div_name,table_name,note) {
			console.info("--------------------------------------------");
			console.info(AMMETER_READING_ID+"    "+div_name+"   "+table_name);
			//TakePhoneUpload("{'busiId':'Account','busiType':'APP','size':1000,'_param':'" + type + "','JSESSIONID':'" + sessionid + "'}", "print");
			TakePhoneUpload("{'import_order_id':'"+AMMETER_READING_ID+"','div_name'"+":'"+div_name+"','table_name':"+"'"+table_name+"','note':'"+note+"','longitude':'"+longitude+"','latitude':'"+latitude+"','time':'"+new data()+"'}");
		}
	}
]);