// JavaScript Document
/*动态判断手机分辨率适配
(function (doc, win) {
          var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
              var clientWidth = docEl.clientWidth;
              if (!clientWidth) return;
              docEl.style.fontSize = 16 * (clientWidth / 320) + 'px';
            };

          if (!doc.addEventListener) return;
          win.addEventListener(resizeEvt, recalc, false);
          doc.addEventListener('DOMContentLoaded', recalc, false);
        })(document, window);
*/

$(document).ready(function(){
	<!--控制字数，超出后显示省略号-->
	jQuery(function(){
		//使用id选择器;例如:tab对象->tr->td对象.
		$(".post_m p,.post_m_l p").not('.text-nocut').each(function(i){
			//获取td当前对象的文本,如果长度大于25;
			if($(this).text().length>40){
				//给td设置title属性,并且设置td的完整值.给title属性.
				$(this).attr("title",$(this).text());
				//获取td的值,进行截取。赋值给text变量保存.
				var text=$(this).text().substring(0,40)+"...";
				//重新为td赋值;
				$(this).text(text);
			}
		});
	});
	//返回
	$(".return,.home").click(function(){
		history.back(-1);
	});
	//弹出子菜单
	$(".navbtn").click(function(){
		$(".navcenter,.reveal-modal-bg").fadeIn();
	});
	//分享弹窗
	$(".fx_bth").click(function(){
		$(".modal_img,.reveal-modal-bg").fadeIn(500);
	});
	$(".reveal-modal-bg,.closed").click(function(){
		$(".modal_img,.reveal-modal-bg").fadeOut(500);
		$(".navcenter").fadeOut(500);
	});

	$(".wx_pay .fix_input label").on({
		"click":function () {
            $(".wx_pay .fix_input label").removeClass("label_checked");
			$(this).addClass("label_checked");
        }
	});

	$("#moneyInput").on({
		"focus":function () {
            $(".wx_pay .fix_input label").removeClass("label_checked");
        }
	});

	$(".g-hdxq-main .icon-bookmark-empty").on({
		"click":function () {
            $(".wx_pay").addClass("sh")
        }
	});

	$(".wx_pay .close ,.wx_pay .mask").on({
		"click":function () {
            $(".wx_pay").removeClass("sh")
        }
	})
});