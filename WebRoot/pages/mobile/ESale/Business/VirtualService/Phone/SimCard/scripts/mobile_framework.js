var Reader = {
    init: function (param, result) {
        if (/android/i.test(navigator.userAgent)) {
            if (result == undefined) {
                window.native.sync("RWCard", "init", param);
            } else {
                window.native.async("RWCard", "init", param, result);
            }
        }

        if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
            if(result==undefined){
                var result = function (msg) {

                    Reader.OnReaderConnect(msg);
                };
            }

            var deviceName=getSelectBT();
            if(deviceName!=undefined){
                makecard.init([deviceName]);
            }
            else{
                makecard.init();
            }
            makecard.connect(result, null);
        }
    },
    ListCard: function () {
        return "mobile_reader";
    },
    ConnectCard: function (readerName, result) {
        if (/android/i.test(navigator.userAgent)) {
            if (result == undefined) {
                return window.native.sync("RWCard", "connect", "");
            } else {
                window.native.async("RWCard", "connect", "", result);
            }
        }else{
            return "0";
        }
    },
    DisconnectCard: function (readerName, result) {
        /*if (/android/i.test(navigator.userAgent)) {
            if (result == undefined) {
                return window.native.sync("RWCard", "disconnect", "");
            } else {
                window.native.async("RWCard", "disconnect", "", result);
            }
        }*/

        if (/ipad|iphone|mac/i.test(navigator.userAgent)) {

        }
    },
    TransmitCard: function (apdu, readerName, result) {
        if (/android/i.test(navigator.userAgent)) {
            try {
                if (result == undefined) {
                    var apduResult = window.native.sync("RWCard", 'transmitAPDU', apdu);
                    var tempStr = "";
                    for (var i = 0; i < apduResult.length; i = i + 2) {
                        tempStr = tempStr + apduResult.substr(i, 2) + " ";
                    }
                    return tempStr;
                } else {
                    window.native.async("RWCard", 'transmitAPDU', apdu, result);
                }
            } catch (e) {
                return null;
            }

        }

        //if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
        //    var result;
        //
        //    var apduSuccess = function (msg) {
        //        result = msg;
        //    };
        //
        //    var fail = function (msg) {
        //        result = "";
        //    };
        //
        //    makecard.transmitCard(apduSuccess, fail, [apdu]);
        //    setTimeout("makecard.transmitCard(" + apduSuccess + "," + fail + "," + [apdu] + ")", 0);
        //    while (result == undefined);
        //
        //    return result;
        //}
    },
    GetErrMsg: function () {
        return "";
    },
    ReadCardNo: function () {
        var onConnected = function (msg) {
            Reader.OnReaderConnect(msg);

        };

        /*this.init('bluetooth',onConnected);
         this.ConnectCard();*/
        if (/ipad|iphone|mac/i.test(navigator.userAgent)){
            var callback = function (msg) {

                onReadCardFinish(msg);
            };
            makecard.queryUsimNo(callback, callback, [btVal]);
        }

        var result="";
        if (/android/i.test(navigator.userAgent)) {
//            var result = "";
//            this.TransmitCard("A0A40000023F00");
//            this.TransmitCard("A0A40000022FE2");
//            result = this.TransmitCard("A0B000000A");
//            onReadCardFinish(result);
            var callback = function (msg) {

                onReadCardFinish(msg);
            };
            makecard.queryUsimNo(callback, callback, []);
        }

        this.DisconnectCard();
        //return result;
    },
    close: function () {
        if (/android/i.test(navigator.userAgent)) {
            return window.native.sync("RWCard", "close", "");
        }

        if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
            makecard.disConnect();
        }


    },
    OnReaderConnect: function (result) {

    }
}

function OnKeyBack() {
    if (location.href.indexOf("pages/index.jsp") != -1 || location.href.indexOf("pages/login.jsp") != -1)
        QuitApp();
    else if (location.href.indexOf("pages/choosePayWay.jsp") != -1)history.go(-2);
    else
        history.back();
}

function QuitApp() {
    if (/android/i.test(navigator.userAgent)) {
        window.native.sync("Application", "quit", "");
    }

    if (/ipad|iphone|mac/i.test(navigator.userAgent)) {

    }
}

function SetCache(isCache) {
    if (/android/i.test(navigator.userAgent)) {
        if (isCache) {
            window.native.sync("Application", "setCache", "LOAD_NO_CACHE");
        } else {
            window.native.sync("Application", "setCache", "LOAD_NO_CACHE");
        }

    }

    if (/ipad|iphone|mac/i.test(navigator.userAgent)) {

    }
}

function AlertDialog(title, message) {
    if (/android/i.test(navigator.userAgent)) {
        //window.native.sync("Application", "alert", title + "||" + message);
        alert(message);

    }

    if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
        alert(message);
    }
}

function ClearWebCache() {
    //alert("clearCache");
    if (/android/i.test(navigator.userAgent)) {
        window.native.sync("Application", "clearWebCache", "");

    }

    if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
        //alert("IOS");
        try {
            var success = function (status) {
                alert('缓存清除成功: ' + status);
            }

            var error = function (status) {
                alert('缓存清除失败: ' + status);
            }

            window.cache.clear(success, error);
        } catch (e) {
            alert("缓存清除异常:" + e.message);
        }

    }
}

function AndroidOcr(callback){
	function success(msg) {
        		console.log('AndroidOcr success>-----'+msg);
        		callback(msg);
        	}
        	function error(){
        	    console.log('AndroidOcr success>-----');
        		callback();
        	}
	androidocr.ocr(success,error,[_AndroidOcrImgPath]);
}

var _AndroidOcrImgPath={};
function TakePhoneUpload(params) {
    if (/android/i.test(navigator.userAgent)) {
        //window.native.async("Camera", "takePhoto", params, "OnUploadFinish");
        function onSuccess(imageURI) {
            console.log('Camera success>-----'+imageURI);   
            	console.log('Camera success>-----'+params);   
            var temStr=(params+"").replace(/\'/g,"\"");
            	console.log('Camera success>-----'+temStr);   
            var json = JSON.parse(temStr+'');
            _AndroidOcrImgPath[json._param]=imageURI;
        
        	function success(msg) {
                alert("上传成功！");
        		console.log('upload success>-----'+msg);
        		OnUploadFinish(msg);
                getparams(params,imageURI);
        	}
        	function error(){
                alert("上传失败！");
        	    console.log('upload success>-----');
        	
        		OnUploadFinish();
        	}
/*		    androidocr.upload(success,error,[APP_CONFIG.SERVER_URL,Local.getStoreJson(sys.loginKey).body.sessionId,imageURI,params]);*/
            androidocr.upload(success,error,[APP_CONFIG.SERVER_URL,Local.getStoreJson("sessionid"),imageURI,params]);
		}
		
		function onFail(message) {
			console.log('onSuccess>-----'+message);
		    alert('Failed because: ' + message);
		}
		navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
    	destinationType: Camera.DestinationType.FILE_URI });

		
    }

    if (/ipad|iphone|mac/i.test(navigator.userAgent)) {

    }
}

var _mTemCallbackList={};
function nativeAsync(module,method,params,callback) {
    var temParams={};
    temParams.id=new Date().getTime();
    temParams.params=params;
    _mTemCallbackList[temParams.id]=callback;
    window.native.async(module, method,JSON.stringify(temParams), "nativeCallback");
}
/**
 * var res={id:123,result:"res"};
 * @param res
 */
function nativeCallback(res){
    var json=JSON.parse(res);
    var callback= _mTemCallbackList[json.id];
    callback(json.result);
    delete _mTemCallbackList[json.id];
}

function OnUploadFinish(result) {

}
function getparams(params,imageURI){

}
function OnUploadBegin(path) {

}

function GetIDCardInfo(asyncMethod, name) {


    //if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
        var Success = function (msg) {
            onReadIDCardFinish(msg);
        };

        var Fail = function (msg) {
            alert(msg)
            //alert("获取身份证信息失败，请重试");
            onReadIDCardFinish("{}");
        };

        makecard.readIDCard(Success, Fail, [name]);
    //}
}

var _ReaderNetWorkDelay;
//设置网络延迟
function setReaderNetWorkDelay(delay){
    _ReaderNetWorkDelay=delay;
}
/*function
 (infoString) {
 alert(infoString);
 }*/

//获取蓝牙身份证读取的错误信息
function getReadCardResult(code) {
	var delay=-1;
	if(_ReaderNetWorkDelay){
		delay=_ReaderNetWorkDelay;
	}
	if(code=="-1"){
        $("#alertBox_bluetooth").show();
		return "重新读取中...";
	}else if(code=="-4"||code=="-8"){
		return "请放置身份证或者移动身份证摆放位置";
	}else{
		return "网络超时请重试(" + code+","+delay+")";
	}
    /*switch (code) {
        case -1:
            return "无法连接阅读器，请尝试关闭阅读器后再打开";
//        case -2:
//            return "阅读器繁忙，请重试";
//        case -3:
//            return "与服务器交互出错，请检查网络连接是否正常";
//        case -4:
//            return "没有检测到身份证";
//        case -5:
//            return "网络超时，请重试";
//        case -6:
//            return "阅读器数据传输发生错误，请重试";
//        case -7:
//            return "阅读器出现错误，请重试";
        case -8:
            return "请放置身份证或者移动身份证摆放位置";
//        case -9:
//            return "无法连接到服务器，请检查网络是否连通";
//        case -10:
//            return "没有可用的后台服务";
//        case -11:
//            return "后台认证失败";
//        case -12:
//            return "无法读取序列号，请更换阅读器";
//        default:
//            return "读取失败！未知的错误:" + code;
        default:
            return "网络超时请重试(" + code+","+delay+")";
    }*/
}

//日志上传
function uploadDeviceLog(){
    if (/android/i.test(navigator.userAgent)) {
        window.native.sync('Application','uploadLog','')
    }
}
/*
 public static final int STATE_READER_NONE = 0;//初始化
 public static final int STATE_READER_START = 1;//开始状态
 public static final int STATE_READER_CONNECTING = 2;//正在连接阅读器
 public static final int STATE_READER_CONNECTED = 3;//阅读器连接成功
 public static final int STATE_NET_NONE = 4;//无法连接到服务器，请检查网络是否连通
 public static final int STATE_NET_CONNECTING = 5;//正在连接服务器
 public static final int STATE_NET_CONNECTED = 6;//成功连接服务器
 public static final int STATE_READER_TRANSFORMING = 7;//与阅读器传输数据
 public static final int STATE_NET_TRANSFORMING = 8;//与后台传输数据
 */
//阅读器状态变更
function onSRCarderStateChange(state){

}

/*
 功能:设置读取身份证传递业务数据
 参数:json对象
 */
function setReadIDCardData(json){
    var jsonStr=JSON.stringify(json);
    var success=function(){

        };

        var fail=function(){

        };

        makecard.init();
        makecard.setBusinessData(success,fail,[jsonStr]);
}

/**
*更新服务器列表
*/
function getControlService(){
    makecard.refreshServerList(null, null, []);
}

document.addEventListener('deviceready', function() {
    if(/android/i.test(navigator.userAgent)){
        function success(msg){
            console.log("NFC读取成功>>>>>>>>>>>>>>>>");
            onReadIDCardFinish(msg);
        }
        NFCReader.init(success,null,[]);
    }else{
        makecard.init();
    }

});


/*
 蓝牙设备列表
 */

var btVal = "";
var orderInfo = "";
var btFlag = 0;

//检测蓝牙设备
var check=function(info)
{
    if(info != null){
        orderInfo = info;
    }

    if($("#flag").val() == 0){
        var callback = function(msg){
            if(msg == "") {
                $("#btBox").show();
                $("#shadeDiv").css("display","block");
                getList();
            }else{
                ysb_shade("蓝牙二合一设备正在读取中，请稍后……");
                setTimeout(GetIDCardInfo('onReadIDCardFinish', ""), 80);
            }
        }
        makecard.isHaveBluetooth(callback,callback,[]);
    }else {

        $("#btBox").show();
        $("#shadeDiv").css("display", "block");
        getList();
    }

}

//选择蓝牙设备
function chooseBT(ele,val)
{
    btVal = val;
    if($("#flag").val() != null){
    btFlag = $("#flag").val();
}

    makecard.saveBluetooth(null, null, [btVal]);

    $("#btBox").css("display", "none");

    if(btFlag != null) {
        if (btFlag != 1) {
            if (btFlag == 3) {
                //关于app里的保存设备
                //makecard.saveBluetooth(null, null, [btVal]);
                alert("已保存设备:" + btVal);

            } else if (btFlag == 4) {
                //远程写卡
                CLIENT_CONFIG.OnConnect(orderInfo, "");

            } else {
                //读身份证
                if (btFlag == 2) {
                    var $btn = $("#bluetooth_read_btn").button('loading');
                    $("#shadeDiv").css("display", "none");
                }
                else {
                    ysb_shade("蓝牙二合一设备正在读取中，请稍后……");
                }

                GetIDCardInfo('onReadIDCardFinish', btVal);
            }

        }
        else {
            //读成卡
            try {
                ysb_shade("蓝牙二合一设备正在读取中，请稍后……");
                setTimeout(Reader.ReadCardNo(), 80);
            } catch (e) {
                ysb_unshade();
                ysb_alert("提示", "读卡失败，请重试或者人工输入" + e);
                return false;
            }
        }
    }

    /*var canConnet = function (msg){
        console.log(msg);
        if(msg == 0){
            if(btFlag != null) {
                if (btFlag != 1) {
                    if (btFlag == 3) {
                        //关于app里的保存设备
                        alert("已保存设备:" + btVal);

                    } else if (btFlag == 4) {
                        //远程写卡
                        var saveResult = function (msg) {
                            if (msg == 0) {
                                CLIENT_CONFIG.OnConnect(orderInfo, "");
                            }
                        }
                        makecard.saveBluetooth(saveResult, saveResult, [btVal]);

                    } else {
                        //读身份证
                        if (btFlag == 2) {
                            var $btn = $("#bluetooth_read_btn").button('loading');
                            $("#shadeDiv").css("display", "none");
                        }
                        else {
                            ysb_shade("蓝牙二合一设备正在读取中，请稍后……");
                        }

                        GetIDCardInfo('onReadIDCardFinish', btVal);
                    }

                }
                else {
                    //读成卡
                    try {
                        ysb_shade("蓝牙二合一设备正在读取中，请稍后……");
                        setTimeout(Reader.ReadCardNo(), 80);
                    } catch (e) {
                        ysb_unshade();
                        ysb_alert("提示", "读卡失败，请重试或者人工输入" + e);
                        return false;
                    }
                }
            }
        }else{
            $("#alertBox_bluetooth").show();
            btFlag = null;
        }
        console.log(btFlag);
    }

    makecard.saveBluetooth(canConnet, canConnet, [btVal]);*/

    //sessionStorage.setItem("bluetooth",val);


}

function getSelectBT()
{
    return btVal;
}

function ysb_shade(message){
    $("body").attr("style","overflow-y:hidden");
    $("#shadeDiv").css("display","block");
    $("#loadingDiv").css("display","block");
    $("#loadingMessage").text(message);
}

function ysb_unshade(){
    $("body").removeAttr("style");
    $("#shadeDiv").css("display","none");
    $("#loadingDiv").css("display","none");
}

function ysb_alert(title,message){
    $("body").attr("style","overflow-y:hidden");
    $("#shadeDiv").show("normal")
    $("#alertDiv").show("normal");
    $("#alertTitle").text(title);
    $("#alertMessage").text(message);
}

function ysb_unalert(){
    if($("#alertMessage").text() == "插件加载出错，请重新刷新页面")
    {
        //window.location.reload();
        $("#loadingDiv").hide();
        $("#shadeDiv").css("display","none");
        $("body").removeAttr("style");
        $("#alertDiv").css("display","none");
    }
    else{
        $("#loadingDiv").hide();
        $("#shadeDiv").css("display","none");
        $("body").removeAttr("style");
        $("#alertDiv").css("display","none");
    }

}

//关闭弹窗
function cancel()
{
    $("#shadeDiv").css("display","none");
    $('#btBox').hide();
    // makecard.setDeviceListEvent(null,null,[]);
    $("#loadingDiv").hide();
}

//加载蓝牙列表
function loadBluetooth(bluetoothList)
{
    $("div[name='btContent']").html("");
    var content="";

    for(var i=0;i<bluetoothList.length;i++)
    {
        var radio = ' <input style="position: absolute; top:9px; left:5px;" type="radio" name="select" onclick="chooseBT(this,\'' + bluetoothList[i].name + '\')"/>'
        if(bluetoothList[i].name == sessionStorage.getItem("bluetooth"))
        {
            radio = ' <input style="position: absolute; top:9px; left:5px;" type="radio" name="select" onclick="chooseBT(this,\'' + bluetoothList[i].name + '\')" checked/>'
        }
        content += '<div style="padding: 5px 0px; position: relative; border-bottom:1px solid #eeeeee;">'
            +'<label>'
            +'<input type="hidden" name="btKey" value="' + bluetoothList[i].name + '">'
            + radio
            +'<span  style="display: block; margin:0px 70px 0px 30px; line-height: 26px;color:blue;">' + bluetoothList[i].name + '</span>'
            +'</label></div>'
    }
    $("div[name='btContent']").append(content);
    if($("input[name='btKey']").length >= 5)
    {
        $("div[name='btContent']").css({"height":"200","overflow-y":"scroll" })
    }
}

function getList()
{
    //if(/ipad|iphone|mac/i.test(navigator.userAgent))
    //{
    var bluetoothList;
    var btFail = function(msg){
        if(msg == "-1") {
            cancel();
            alert("请开启手机的蓝牙开关!");
        }
    };
    makecard.setDeviceListEvent(function (list) {
        bluetoothList = rdcp.str2json(list);
        loadBluetooth(bluetoothList);
        //sessionStorage.setItem("allBluetooth", rdcp.json2str(bluetoothList));
    }, btFail, []);
    /*setInterval(function(){
     if(bluetoothList != null && bluetoothList != "")
     loadBluetooth(bluetoothList);
     },5000);*/

    //}
}

/*
 蓝牙设备列表
 */

var bluetooth_false = function (){
    RWCardClient.resultException("无法连接写卡器");
    alert("无法连接写卡器,无法与平台建立连接!");
    $("#alertBox_bluetooth").hide();
}

var bluetooth_true = function (){
    RWCardClient.resultWait();
    check();
    $("#alertBox_bluetooth").hide();
}