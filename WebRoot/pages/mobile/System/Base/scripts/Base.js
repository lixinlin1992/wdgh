/**
 * Created by anchor on 2014/10/22.
 */
var Base = {};

Base.updateHref = function(ele) {
	var $ele = ele ? $(ele) : $("a");

	$ele.each(function(idx) {
		var orgUrl = $(this).attr("href");
		var lc = $(this).attr("lc");
		if (orgUrl.indexOf("!") != 0 || 'true' != lc)
			return;
		$(this).attr("href", APP_CONFIG.SERVER_URL + orgUrl);
	});
};

/**
 *
 * @param memberId
 * @param msg
 * @param fn
 */
Base.sendMessage = function(memberId, msg, fn) {
	if (rdcp) {
		rdcp.request("!ESale/System/Base/~java/MessageTrans.sendMessage", {
			distination: memberId,
			param: msg
		}, function(data) {
			if (fn != undefined) {
				if (data.header.code == 0)
					fn(true);
				else
					fn(data.header.message);
			}
		}, {
			mask: false,
			filterError: false
		});
	} else {
		Base.sendMessageBy$(memberId, msg, fn);
	}

};

/**
 *  不依赖rdcp 使用jquery
 * @param memberId
 * @param msg
 * @param fn
 */
Base.sendMessageBy$ = function(memberId, msg, fn) {
	$.getJSON("!ESale/System/Base/~java/MessageTrans.sendMessage", {
		distination: memberId,
		param: msg
	}, function(data) {
		if (fn != undefined) {
			if (data.header.code == 0)
				fn(true);
			else
				fn(data.header.message);
		}
	});
};

Base.OCR = function OCR(faceImageId, backImageId, obj) {
		if (faceImageId && backImageId) {
			if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
				var url = "!ESale/System/Ocr/~java/IDCardOCR.request";
				rdcp.request(url, {
						sync: true,
						'faceImageId': faceImageId,
						'backImageId': backImageId,
						timeout: 60000
					},
					function(data) {
						if (data.header.code == "0") {
							var d = data.body;
							$("#form input[name='name']").val(d.NAME);
							$("#form input[name='paper_num']").val(d.CARD_NUM);
							$("#form input[name='paper_addr']").val(d.ADDRESS);
							$("#form input[name='str_office']").val(d.STR_OFFICE)
							if (d.GENDER == '女') {
								$("#form input[name='gender'][value='女']").attr("checked", "checked");
							}
							if (d.VALID_TO) {
								var year = d.VALID_TO.substring(0, 4) + '';
								var month = d.VALID_TO.substring(4, 6) + '';
								var day = d.VALID_TO.substring(6, 8) + '';
								$("#form input[name='paper_time']").val(year + "-" + month + "-" + day);
							}
							if (d.VALID_FROM) {
								var year = d.VALID_FROM.substring(0, 4) + '';
								var month = d.VALID_FROM.substring(4, 6) + '';
								var day = d.VALID_FROM.substring(6, 8) + '';
								$("#form input[name='paper_stime']").val(year + "-" + month + "-" + day);
							}
						}
						if (obj) $(obj).button('reset');
					}, {
						mask: false
					});
			} else {
				var result = GetIDCardInfo();
				if (result) {
					result = JSON.parse(result);
					$("#form input[name='name']").val(result['姓名']);
					$("#form input[name='paper_num']").val(result['公民身份号码']);
					$("#form input[name='paper_addr']").val(result['住址']);
					$("#form input[name='str_office']").val(result['签发机关'])
					if (result['性别'] == '女') {
						$("#form input[name='gender'][value='女']").attr("checked", "checked");
					}
					if (result['有效期限']) {
						var t = result['有效期限'].split('-');
						var s = t[0] ? t[0].replace(/\./g, '-') : '';
						var e = t[1] ? t[1].replace(/\./g, '-') : '';
						$("#form input[name='paper_stime']").val(s);
						$("#form input[name='paper_time']").val(e);
					}
				} else {
					AlertDialog('提示', '未获取到识别信息');
				}
				if (obj) $(obj).button('reset');
			}
		} else {
			AlertDialog('提示', '识别错误，请重新拍照识别');
			if (obj) $(obj).button('reset');
		}

		//    var url = "!ESale/System/Ocr/~java/IDCardOCR.request";
		//    rdcp.request(url, {sync:true,'faceImageId':faceImageId,'backImageId':backImageId,timeout:60000}, function (data) {
		//        if (data.header.code == "0") {
		//            var d=data.body;
		//            $("#form input[name='name']").val(d.NAME);
		//            $("#form input[name='paper_num']").val(d.CARD_NUM );
		//            $("#form input[name='paper_addr']").val(d.ADDRESS );
		//            $("#form input[name='str_office']").val(d.STR_OFFICE)
		//            if (d.GENDER  == '女') {
		//                $("#form input[name='gender'][value='女']").attr("checked", "checked");
		//            }
		//            if(d.VALID_TO){
		//                var year=d.VALID_TO.substring(0,4)+'';
		//                var month=d.VALID_TO.substring(4,6)+'';
		//                var day=d.VALID_TO.substring(6,8)+'';
		//                $("#form input[name='paper_time']").val(year+"-"+month+"-"+day);
		//            }
		//            if(d.VALID_FROM){
		//                var year=d.VALID_FROM.substring(0,4)+'';
		//                var month=d.VALID_FROM.substring(4,6)+'';
		//                var day=d.VALID_FROM.substring(6,8)+'';
		//                $("#form input[name='paper_stime']").val(year+"-"+month+"-"+day);
		//            }
		//        }
		//        else if(data.result == "0"){
		//            alert("识别异常,相关信息请手动输入");
		//            $(obj).empty().append('重新识别');
		//        }
		//        if(obj)$(obj).button('reset');
		//    },{mask:false});
	}
	//头部
var TopNavDefault = {
	title: "",
	titleClass: "topNavTitle",
	rightClass: "topRightBtn",
	rightIcon: "icon_home",
	leftClass: "topLeftBtn",
	leftIcon: "icon_return",
	leftFunction: function() {
		Go.back();
	},
	rightFunction: function() {
		Go.index();
	}
};

var TopNav = {};
TopNav.init = function(p) {
	var setting = $.extend({}, TopNavDefault, p);
	setting.title = setting.title ? setting.title : $('title').text();
	var title = setting.title;
	setting.title = title && title.length > 20 ? title.substring(0, 20) + "..." : title;
	/* var tpl = "<div class='topNav'  id='TOP_NAV'>" +
	 "<h1 class='"+setting.titleClass+"'>"+setting.title+"</h1>" +
	 "<a class='"+setting.leftClass+" "+setting.leftIcon+"' href='javascript://'></a>" +
	 "<a class='"+setting.rightClass+" "+setting.rightIcon+"' href='javascript://'></a>" +
	 "</div><div id='TOP_NAV_BACK'style='margin-top: 0px;'></div>";*/
	var tpl = "<header><div class='nav_top' id='TOP_NAV'><h1 class='title'>" + setting.title +
		"</h1><a class='btn_left icon_left' href='javascript://'></a><a class='btn_right icon_home' href='javascript://'></a></div>" +
		" <div class='com_decoration_line'> <img src='!ESale/Mobile/Mall/UI/~/images/common/decoration.png' alt=''/></div></header>";
	$('body').prepend(tpl);
	$('#TOP_NAV a').eq(0).bind('click', setting.leftFunction);
	$('#TOP_NAV a').eq(1).bind('click', setting.rightFunction);
	$('#TOP_NAV_BACK').css("height", $('#TOP_NAV').height());
}

var GoUrl = {
	"index": "!ESale/Mobile/Mall/UI/~/pages/newIndex.jsp?navType=icon_esaleb",
	"login": "!ESale/Mobile/Mall/UI/~/pages/login.jsp"
}
var Go = {};
/*
 回退函数 接管手机端app的返回事件
 */
Go.back = function() {
	OnKeyBack();
};
/*
 返回登入界面 统一通过该方式触发返回登入界面
 */
Go.login = function() {
		window.location.href = GoUrl.login;
	}
	/*
	 进入首页
	 */
Go.index = function() {
	window.location.href = GoUrl.index;
};

//上一次按返回键的时间，如果在首页500毫秒内连续按两次回退，则退出应用
var lastBackTime = -1;

function QuitApp() {
	if (/android/i.test(navigator.userAgent)) {
		window.native.sync("Application", "quit", "");
	}

	if (/ipad|iphone|mac/i.test(navigator.userAgent)) {

	}
}

function OnKeyBack() {
	var time = new Date().getTime();
	//alert(time);
	if (location.href.indexOf(APP_CONFIG.HOME_PAGE) != -1 || location.href.indexOf("/login.html") != -1) {
		if (lastBackTime != -1 && time - lastBackTime < 500) {
			QuitApp();
		} else {
			lastBackTime = time;
			//mask("继续点击返回退出程序");
		}
	} else {
		lastBackTime = -1;
		history.back();
	}
}


function ysb_alert(title, message) {
	if (message == undefined) {
		message = title;
		title = "提示";
	}


	$("body").attr("style", "overflow-y:hidden");
	$("#alertTitle").text(title);
	$("#alertMessage").html(message);//2015年12月18日 17:00:28   linchuangrong修改,原值为text,改成html
	$("#shadeDiv").show();
	$("#alertDiv").show("normal");
}

function ysb_unalert() {
	$("body").removeAttr("style");
	$("#shadeDiv").css("display", "none");
	$("#alertDiv").css("display", "none");
}

//替换alert函数
window.alert = ysb_alert;

function toast(msg) {
	window.native.toast(msg);
}


$(document).ready(function() {
	if ($("#shadeDiv").length == 0) {
		$("body").append('<div id="shadeDiv" class="com_shade" style="display: none;"></div>');
	}
	if ($("#alertDiv").length == 0) {
		$("body").append('<div id="alertDiv" class="com_alert" style="top: 150px;display: none;"><div><h2 id="alertTitle" class="title">系统消息</h2><a class="closed" onclick="ysb_unalert();" href="javascript://"></a></div><div class="content"><span id="alertMessage" style="display:block;margin-top: 15px;line-height: 30px;text-align: center;color: #888888;">XXX已成功</span></div><div class="bottom_btnbox"><a class="normal_btn" href="javascript://" onclick="ysb_unalert();">确定</a></div></div>');
	}
	if ($("#btBox").length == 0) {
		$("body").append('<div id="btBox" class="com_alert" style="top: 150px;display: none;"><h2 class="title" style="position: relative;">请选择你的蓝牙<a class="closed" href="javascript://"  onclick="cancel()"></a></h2><div class="content" name="btContent" > </div></div>');
	}
	if ($("#alertBox").length == 0) {
		$("body").append('<div id="alertBox" class="com_alert" style="top: 150px;display: none;"><div><h2 id="alertTitle" class="title">提示</h2><a class="closed" onclick="exit_false();" href="javascript://"></a></div><div class="content"><span id="alertMessage" class="loadingtxt" style="margin-top: 15px;font-size:1.2em;">确定退出吗？</span></div><div class="bottom_btnbox"><div class="left"><a class="normal_btn" href="javascript://" onclick="exit_yes()">确定</a></div><div class="right"><a class="normal_btn" href="javascript://" onclick="exit_false()">取消</a></div></div></div>');
	}
	if ($("#alertBox_zhejiang").length == 0) {
		$("body").append('<div id="alertBox_zhejiang" class="com_alert" style="top: 150px;display: none;"><h2 id="alertTitle" class="title">提示</h2><div class="content"><span id="alertMessage" class="loadingtxt" style="margin-top: 15px;font-size:1.2em;">确定提交吗？</span></div><div class="bottom_btnbox"><div class="left"><a class="normal_btn" href="javascript://" onclick="submit_yes()">确定</a></div><div class="right"><a class="normal_btn" href="javascript://" onclick="exit_false()">取消</a></div></div></div>');
	}
	if ($("#alertBox_bluetooth").length == 0) {
		$("body").append('<div id="alertBox_bluetooth" class="com_alert" style="top: 150px;display: none;"><div><h2 id="alertTitle" class="title">提示</h2><a class="closed" onclick="exit_false();" href="javascript://"></a></div><div class="content"><span id="alertMessage" class="loadingtxt" style="margin-top: 15px;font-size:1.2em;">连接阅读器失败，是否更换新的阅读器？</span></div><div class="bottom_btnbox"><div class="left"><a class="normal_btn" href="javascript://" onclick="bluetooth_true()">是</a></div><div class="right"><a class="normal_btn" href="javascript://" onclick="bluetooth_false()">否</a></div></div></div>');
	}

});

//页面跳转
function hrefJump(value, params) {
	/*if(value=="orderForProcess"){
		$(".bottom_menu a").removeClass("active");
		$("#orderForProcessBtn").addClass("active");
	}else if(value=="orders"){
		$(".bottom_menu a").removeClass("active");
		$("#ordersBtn").addClass("active");
	}else if(value=="home"||value=="Card"||value=="selectPackage"||value=="realNameReg"||value=="CampusMarket"||value=="zhiHuiWoJia1"){
		$(".bottom_menu a").removeClass("active");
		$("#homeBtn").addClass("active");
	}else if(value=="rwcardStatus"){
		$(".bottom_menu a").removeClass("active");
		$("#rwcardStatusBtn").addClass("active");
	}else if(value=="myESaleB"){
		$(".bottom_menu a").removeClass("active");
		$("#myESaleBBtn").addClass("active");
	}*/
	var myHref = "#/" + value;
	window.location.href = myHref;
}

function gotoIndex() {
	var start = APP_CONFIG.HOME_PAGE.indexOf("#") + 2;
	var end = APP_CONFIG.HOME_PAGE.length;
	var url = APP_CONFIG.HOME_PAGE.substring(start, end);
	hrefJump(url);
}

//底部导航，样式变化
function replaceClass(value) {
	if (value == "orderForProcess") {
		$(".bottom_menu a").removeClass("active");
		$("#orderForProcessBtn").addClass("active");
	} else if (value == "orders") {
		$(".bottom_menu a").removeClass("active");
		$("#ordersBtn").addClass("active");
	} else if (value == "home") {
		$(".bottom_menu a").removeClass("active");
		$("#homeBtn").addClass("active");
	} else if (value == "rwcardStatus") {
		$(".bottom_menu a").removeClass("active");
		$("#rwcardStatusBtn").addClass("active");
	} else if (value == "myESaleB") {
		$(".bottom_menu a").removeClass("active");
		$("#myESaleBBtn").addClass("active");
	}
}