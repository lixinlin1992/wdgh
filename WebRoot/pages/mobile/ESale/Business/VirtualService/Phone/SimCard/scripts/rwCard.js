CLIENT_CONFIG.OnConnect = function (orderId, agentSessionId) {
    //RwCard.loadRwcardAcx("usb");    //使用手机写卡器
    
    var callback = function (msg) {
		$("#shadeDiv").hide();
        try{
            //var makeResult;
            CLIENT_CONFIG.SESSIION_ID = sessionStorage._CLIENT_CONFIG_SESSIION_ID;
            if (msg.length == 20) {
                //makeResult = this.TransmitCardErr("", "", "", "", "", msg);
                RWCardClient.resultReturn("0");
                //kinz  2015-07-24 触发连接事件
                window.NG_ROOT_SCOPE.$broadcast("rwcardStatus",1);

                clearInfo();
                $.getJSON(APP_CONFIG.SERVER_URL+'!ESale/Mall/Order/~java/Order.getOrder', 'orderId=' + orderId, function (data) {
                    if (data.header.code == 0) {
                        $("<p style='padding: 10px;'>订单编号：" + data.body.code + "</p>").insertAfter($('#sys_tips h1'));
                        var business = data.body.ext['BUSINESS.INT'];
                        for (var i = 0; i < business.length; i++) {
                            if (business[i].key == 'PHONE_NUMBER') {
                                $("<p style='padding: 10px;'>开户号码：" + business[i].val + "</p>").insertAfter($('#sys_tips h1'));
                                break;
                            }
                        }
                    }
                });
            } else if (msg == "-2") {
                //makeResult = this.TransmitCardErr("", "", "", "", "此卡非白卡", "-1");
                window.NG_ROOT_SCOPE.$broadcast("rwcardStatus",0);
                RWCardClient.resultException("此卡非白卡");
                alert("此卡非白卡,无法与平台建立连接!");
            } else if(msg == "-3"){
                //makeResult = this.TransmitCardErr("", "", "", "", "获取白卡卡号失败", "-1");
                window.NG_ROOT_SCOPE.$broadcast("rwcardStatus",0);
                //alert("无法连接写卡器,无法与平台建立连接!");
                orderIdTemp = orderId;
                $("#alertBox_bluetooth").show();
            }else{
                window.NG_ROOT_SCOPE.$broadcast("rwcardStatus",0);
                RWCardClient.resultException("连接卡失败");
                alert("连接卡失败,无法与平台建立连接!");
            }
        }catch(e){}

    };
    makecard.readCardNo(callback,callback,[]);
    //nativeAsync("RWCard", "QueryCard", "", callback);

};

var orderIdTemp = "";

var bluetooth_false = function (){
    RWCardClient.resultException("无法连接写卡器");
    alert("连接阅读器失败!");
    $("#alertBox_bluetooth").hide();
}

var bluetooth_true = function (){
    RWCardClient.resultWait();
    makecard.saveBluetooth(null, null, [""]);
    btFlag = 4;
    check(orderIdTemp);
    $("#alertBox_bluetooth").hide();
}


//断开事件
CLIENT_CONFIG.OnDisconnect = function () {
    //kinz  2015-07-24 触发连接事件
    window.NG_ROOT_SCOPE.$broadcast("rwcardStatus",0);
    tipsChange('后台已断开', 5);
    //Reader.close();
    RWCardClient.resultReturn("0");
};
//接收消息
CLIENT_CONFIG.OnMessage = function (msg) {
    //$('#sys_tips').show();
    //$("<p style='padding: 10px;'>" + msg + "</p>").insertAfter($('#sys_tips p').first());
    alert(msg);
};
//读写卡成功
CLIENT_CONFIG.OnSuccess = function (msg) {
    AlertDialog("提示", msg);
};
//读写卡失败
CLIENT_CONFIG.OnFail = function (msg) {
    AlertDialog("提示", msg);
};
Reader.OnReaderConnect = function (result) {

    if (result == 'true') {

        $('header').show();
        $('#header_text').empty().append('写卡器已连接');
        $('.writecardbreak').removeClass('writecardbreak').addClass('writecardlink');
//            validateReadCard();
    }
    else {
        //未获取到写卡器，请插入写卡器
        // $('.computerlink').removeClass('computerlink').addClass('computerbreak');
        $('.writecardlink').removeClass('writecardlink').addClass('writecardbreak');
        $('#header_text').empty().append('未获取到写卡器');
    }

};
function clearInfo() {
    $('#sys_tips p').remove();//清除消息数据
}
//手动校验读卡是否成功
function validateReadCard() {
    var carNo = Reader.ReadCardNo();
    if (carNo && carNo.length == 36) {
        //检测到卡已插入
        $('#header_text').empty().append('检测到卡已插入');
//            $('.writecardbreak').removeClass('writecardbreak').addClass('writecardlink');
        //  $('.computerbreak').removeClass('computerbreak').addClass('computerlink');
    }
    else {
        //检测到卡未插入或者未能识辨
        $('#header_text').empty().append('检测到卡未插入或者未能识辨');
        $('.writecardlink').removeClass('writecardlink').addClass('writecardbreak');
        //  $('.computerlink').removeClass('computerlink').addClass('computerbreak');
    }
}
function checkReadCard() {
    $('#header_text').empty().append('检测中......');
//        validateReadCard();
    //loginOut();
}
function tipsChange(title, count) {
//    $('#header_text').empty().append(title + "，<span id='time_count'>" + count + "</span>秒后自动关闭");
//    timedCount(count);
    setTimeout(function () {
        $("#rwCard_tipsBox").slideUp("slow", function () {
            $('header').hide()
        });

        $('#header_text').empty().append(title);
        $('.computerlink').removeClass('computerlink').addClass('computerbreak');
//            $('header').slideUp('slow');
    }, 5000);
}
function timedCount(count) {
    document.getElementById('time_count').innerHTML = count;
    if (count > 0) {
        count = count - 1;
        setTimeout(function () {
            timedCount(count);
        }, 1000);
    }
}


function loginOut() {
    localStorage.removeItem('key');
    $.post(APP_CONFIG.SERVER_URL+"framework.do?ds=DS_USER_LOGOUT", function (data) {
                //location.href = $('base').attr('href') + "!ESale/Mobile/Mall/UI/~/pages/login.jsp";
                location.href="index.html";
            }
    );
}
var _isLoaded;
$(document).ready(function () {

    var header = "<header class='header' style='z-index: 1000;background: #01885a; border-bottom: 1px solid #cccccc;display: none;top:0px;width: 100%;position: fixed;'>" +
                        "<span class='appHeaderMark writecardbreak'></span><span class='appHeaderMark computerbreak'></span>" +
                        "<p id='header_text' style='color: #ffffff; line-height: 50px; text-indent:5px; float:left; width: 185px; padding: 0px; margin:0px;font-size: 0.8em'>" +
                        "</p>" +
                        "<a href='javascript:checkReadCard();' class='headerRightBtn'></a>" +
                        "</header>"
                var tips = "<div class='tipsBox' id='rwCard_tipsBox'style='display: none;top: 50px;'>" +
            //            "<div class='tipsContent' style='top: 40px;'>"+
            ////            "<div class='topTipsBox'>"+
            ////            "<span class='topTipsMark linkMark'></span>"+
            ////            "<p style='color:#ffffff; margin:0px;' id='tips_top_text'>后台已连接，在写卡完成之前请不要关闭或刷新当前界面</p>"+
            ////            "</div>" +
            //            "<div id='order_info'></div>"+
            //            "</div>"+
                        "<div class='tipsContent' id='sys_tips' style='top: 50px; height: 400px;' >" +
                        "<h1 class='tipsTitle'>系统消息</h1>" +
                        "</div>" +
                        "<div class='tipsBg'></div>" +
                        " </div>";
    //$('body').prepend(header + tips);
    //TopNav.init();
});

document.addEventListener('deviceready', function() {
	RWCardClient.setSessionId(Local.getStoreJson(sys.loginKey).body.sessionId);
 });