<%--
User: Larry
--%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="com.sunrise.framework.core.ApplicationManager" %>
<%@page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
    <meta content="telephone=no" name="format-detection" />
    <title>献爱心详情</title>
    <link href="!gh/wechat/css/main.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/style.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/shake.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/animate.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
    <script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript">
rdcp.ready(function(){
   $(".return,.home").click(function(){
   		history.back(-1);
   	});
   $(".wx_pay .close ,.wx_pay .mask").on({
        "click":function () {
              $(".wx_pay").removeClass("sh")
          }
   });
   $("#payTips .fix_input label").on({
       "click":function () {
           $("#payTips .fix_input label").removeClass("label_checked");
           $(this).addClass("label_checked");
       }
   });
   $("#moneyInput").on({
   		"focus":function () {
               $(".wx_pay .fix_input label").removeClass("label_checked");
           }
   	});
   	rdcp.request("!gh/wechat/~query/Q_LOAD_DONATION_TOTAL",{},function(data){
   	   $("#donation_fee").html(data.body.fee+"元");
       $("#donation_user_cou").html(data.body.cou+"人");
       $("#donation_user_names").html(data.body.names);
       $("#donation_user_cou2").html(data.body.cou+"人");
   	});
});
function donation(){
  $(".wx_pay").addClass("sh");
}
function submitDonation(){
  var fee = $("#payTips .fix_input .label_checked .check_radio").val();
  var moneyInput = $("#moneyInput").val();
  var anonymous = $("#anonymous").attr("checked");
  var is_anonymous = anonymous==undefined?"0":1;
  fee = fee==undefined||fee==null?moneyInput:fee;
  if(fee==undefined || fee==null || fee==""){
    $.messager.alert("提示","请选择捐款金额!","info");
    return;
  }
  $("#fee").val(fee);
  $("#is_anonymous").val(is_anonymous);
  rdcp.form.submit("donate_form",{url:"!gh/wechat/~query/I_ADD_DONATION_ORDER",
      success: function(data) {
         if(data.header.code=="0"){
           $.messager.alert("提示","捐款成功，感谢您的爱心!","info",function(){
             window.location.href=window.location.href;
           });
         }
      }
  });
}
</script>
</head>
<body>
<div class="warpe">

    <div class="head">
        <a href="javascript:void(0);" class="return"><i class="icon-chevron-left"></i> 返回</a>
        献爱心详情
        <a href="javascript:void(0);" onclick="donation();" class="search animated fadeInRight" style="font-size: 1.4rem;">我要捐款</a>
    </div>
    <div class="main">
        <div class="postall margin_top clear_border">
            <a href="javascript:void(0);">
                <div class="post_t">
                    <img src="!gh/wechat/img/pic7.jpg">
                    <%--<span>系统管理员</span>--%>
                </div>
                <div class="post_img post_img02 animated bounceIn">
                    <img class="g-dyxx-detailimg" src="!gh/wechat/img/xax.png">
                </div>
                <div class="post_m">
                    <p class="text-nocut">从学校回到家里，他哽咽着对妈妈说：“学校的同学小朋友都叫我‘小蛋壳’，他们都说我有病不和我玩”。说完又放声大哭......这话，在“小蛋壳”妈妈听起来，心里很不是滋味。妈妈只能尽力安抚“小蛋壳”，不断告诉他要好好保护自己的身体，尽量小心避免受伤。因为一旦受伤，就会流血不止，还有可能造成残疾。在血友病孩子的心里，他们并不愿意做小“小蛋壳”。哭泣，是因为他们更想做一颗坚强的“小石头”。 </p>
                </div>

                <div class="group_txt">
                    <p><label>募捐信息</label> <i class="icon-volume-down color_y"></i></p>
                    <p class="animated fadeInRight"><label class="color_g">机构：</label><span>中华少年儿童慈善救助基金会</span></p>
                    <p class="animated fadeInLeft"><label class="color_g">参捐人数：</label><span id="donation_user_cou2"></span></p>
                    <p class="animated fadeInRight"><label class="color_g">已筹善款：</label><span id="donation_fee"></span></p>
                    <p class="animated fadeInLeft"><label class="color_g">目标：</label><span>30000元</span></p>
                    <p class="animated fadeInLeft"><label class="color_g">项目时间：</label><span>2015-12-22 至 长期</span></p>
                </div>
                <div class="post_b">
                    <span class="puff_left"></span>
                </div>
            </a>
        </div>
    </div>
    <div class="main g-hdxq-main">
        <div class="postall">
            <div class="post_t post_t2">
                <span class=" icon-group"></span>
                <span>感谢 <span class="color-red" style="margin: 0;" id="donation_user_cou"></span> 参与募捐活动</span>
                <span class="puff_right"> <a href="javascript:void(0);" onclick="donation();" class=" icon-bookmark-empty color_y"><font style="font-size: 1.2rem">捐款</font> </a></span>
            </div>
            <div class="post_m">
                <p class="color_g animated fadeInRight" id="donation_user_names"></p>
            </div>
        </div>
    </div>

    <div class="wx_pay" id="payTips">
        <div class="mask"></div>
        <div class="box">
          <form id="donate_form" name="donate_form">
            <input type="hidden" id="fee" name="fee"/>
            <input type="hidden" id="is_anonymous" name="is_anonymous"/>
            <div class="tab_hd">
                <h2>请填写捐赠信息</h2>
                <div class="close"></div>
            </div>
            <div class="tab_bd">
                <div class="main main_payonce  current" cont="donate">
                    <div class="g-item">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：<input type="text" id="name" name="name">
                    </div>
                    <div class="g-item">联系方式：<input type="text" id="contact" name="contact"/></div>
                    <div class="g-item">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：
                        <select name="sex" id="sex">
                            <option value="-1">保密</option>
                            <option value="1">男</option>
                            <option value="0">女</option>
                        </select>
                    </div>
                    <div class="g-item">是否校友：
                        <select name="is_school" id="is_school">
                            <option value="-1">保密</option>
                            <option value="1">是</option>
                            <option value="0">否</option>
                        </select>
                    </div>
                    <div class="g-item">捐赠祝福：<input type="text" id="blessing" name="blessing" style="width:300px;"></div>
                    <div class="fix_input">
                        <div class="block">
                            <label class="a label_checked" for="ac0">
                                <input type="radio" class="check_radio" name="fee_select" value="20" checked=""><i class="check_border"></i><span>20</span>元
                            </label>
                        </div>
                        <div class="sep"></div>
                        <div class="block">
                            <label class="a " for="ac1">
                                <input type="radio" class="check_radio" name="fee_select" value="50" checked=""><i class="check_border"></i><span>50</span>元
                            </label>
                        </div>
                        <div class="sep"></div>
                        <div class="block">
                            <label class="a " for="ac2">
                               <input type="radio" class="check_radio" name="fee_select" value="100" checked=""><i class="check_border"></i><span>100</span>元
                            </label>
                        </div>
                        <div class="sep"></div>
                        <div class="block">
                            <label class="a " for="ac3">
                               <input type="radio" class="check_radio" name="fee_select" value="500" checked=""><i class="check_border"></i><span>500</span>元
                            </label>
                        </div>
                        <div class="sep"></div>
                    </div>
                    <div class="other_input_wrap">
                        <div class="other_input">
                            <input type="number" pattern="[0-9]*" id="moneyInput" style="width:200px;">
                            <span class="l">其他</span>
                            <span class="r">元</span>
                        </div>
                        <div class="anonymous_wrap">
                            <label for="anonymous"><input type="checkbox" value="1" id="anonymous"><i></i>匿名捐款</label>
                        </div>
                    </div>
                    <a href="javascript:void(0)" onclick="submitDonation();" class="btn_a" money="20">立即捐款</a><div class="prot t2"><label for="check"><input type="checkbox" name="proto2" value="1" id="check" checked=""><i></i>同意</label><a href="javascript:;">《武汉大学教育基金会法律声明》</a>
                </div>
                </div>
            </div>
          </form>
        </div>
    </div>


</div>

</body>
</html>