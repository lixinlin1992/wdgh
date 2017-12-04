<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" import="java.util.*" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%
    String path = request.getContextPath();
    String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
    String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
    request.setAttribute("_basePath", basePath);
%>
<base href="${_basePath}"/>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
	<meta charset="UTF-8">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
	<meta content="telephone=no" name="format-detection" />
	<title>登录</title>
	<link href="!gh/wechat/~/css/main.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/style.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/shake.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
	<script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
    <script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
    <script type="text/javascript" src="!gh/wechat/~/js/wo.js"></script>
</head>
<script type="text/javascript">
rdcp.ready(function(){
});
$(".return").click(function(){
    history.back(-1);
});
</script>
<body style="background-color: #fff !important;">
<div class="warpe">
    <div class="head">
        <a href="javascript:void(0);" class="return"><i class="icon-chevron-left"></i>返回</a>
        献爱心
    </div>
    <div class="main">
        <div class="postall margin_top clear_border">
            <a href="javascript:void(0);">
                <div class="post_t">
                    <img src="!gh/wechat/~/img/pic7.jpg">
                    <span>管理员：龙五</span>
                </div>
                <div class="post_img post_img02 animated bounceIn">
                    <img class="g-dyxx-detailimg" src="https://thumb.qschou.com/files/qschou.com/project/0f6c021a1-4823-4091-9ac3-b215633f49ec1497515163972230910000962451ad3c87194853522812a7e29da7.jpg@!love.png">
                </div>
                <div class="post_m">
                    <p class="text-nocut">从学校回到家里，他哽咽着对妈妈说：“学校的同学小朋友都叫我‘小蛋壳’，他们都说我有病不和我玩”。说完又放声大哭......这话，在“小蛋壳”妈妈听起来，心里很不是滋味。妈妈只能尽力安抚“小蛋壳”，不断告诉他要好好保护自己的身体，尽量小心避免受伤。因为一旦受伤，就会流血不止，还有可能造成残疾。在血友病孩子的心里，他们并不愿意做小“小蛋壳”。哭泣，是因为他们更想做一颗坚强的“小石头”。 </p>
                </div>

                <div class="group_txt">
                    <p><label>募捐信息</label> <i class="icon-volume-down color_y"></i></p>
                    <p class="animated fadeInRight"><label class="color_g">机构：</label><span>中华少年儿童慈善救助基金会</span></p>
                    <p class="animated fadeInLeft"><label class="color_g">参捐人数：</label><span>130人</span></p>
                    <p class="animated fadeInRight"><label class="color_g">已筹善款：</label><span>1000元</span></p>
                    <p class="animated fadeInLeft"><label class="color_g">目标：</label><span>30000元(5%)</span></p>
                    <p class="animated fadeInLeft"><label class="color_g">项目时间：</label><span>2015-12-22 至 长期</span></p>
                </div>
                <div class="post_b">
                    <span class="puff_left">30分钟前</span>
                </div>
            </a>
        </div>
    </div>
    <div class="main g-hdxq-main">
        <div class="postall">
            <div class="post_t post_t2">
                <span class=" icon-group"></span>
                <span>感谢 <span class="color-red" style="margin: 0;">5人</span> 参与募捐活动</span>
                <span class="puff_right"> <a href="javascript:;" class=" icon-bookmark-empty color_y"><font style="font-size: 1.2rem">报名</font> </a></span>
            </div>
            <div class="post_m">
                <p class="color_g animated fadeInRight">龙秋顺（3）、陈新伟（2）、黄春权、曾春鹏、诠谁</p>
            </div>
        </div>
    </div>

    <div class="wx_pay" id="payTips">
        <div class="mask"></div>
        <div class="box">
            <div class="tab_hd">
                <h2>请填写捐赠信息</h2>
                <div class="close"></div>
            </div>
            <div class="tab_bd">
                <div class="main main_payonce  current" cont="donate">
                    <div class="g-item">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：<input type="text"></div>
                    <div class="g-item">联系方式：<input type="text"></div>
                    <div class="g-item">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：
                        <select name="sex" id="sex">
                            <option value="保密">保密</option>
                            <option value="男">男</option>
                            <option value="女">女</option>
                        </select>
                    </div>
                    <div class="g-item">是否校友：
                        <select name="Classmates" id="Classmates">
                            <option value="保密">保密</option>
                            <option value="是">是</option>
                            <option value="否">否</option>
                        </select>
                    </div>
                    <div class="g-item">捐赠祝福：<input type="text"></div>
                    <div class="fix_input">
                        <div class="block">
                            <label class="a label_checked" for="ac0">
                                <input type="radio" class="check_radio" name="account" value="20" id="ac0" checked=""><i class="check_border"></i><span>20</span>元
                            </label>
                        </div>
                        <div class="sep"></div>
                        <div class="block">
                            <label class="a " for="ac1"><input type="radio" class="check_radio" name="account" value="50" id="ac1" checked=""><i class="check_border"></i><span>50</span>元
                            </label>
                        </div>
                        <div class="sep"></div>
                        <div class="block">
                            <label class="a " for="ac2"><input type="radio" class="check_radio" name="account" value="100" id="ac2" checked=""><i class="check_border"></i><span>100</span>元
                            </label>
                        </div>
                        <div class="sep"></div>
                        <div class="block">
                            <label class="a " for="ac3"><input type="radio" class="check_radio" name="account" value="500" id="ac3" checked=""><i class="check_border"></i><span>500</span>元
                            </label>
                        </div>
                        <div class="sep"></div>
                    </div>
                    <div class="other_input_wrap">
                        <div class="other_input">
                            <input type="number" pattern="[0-9]*" id="moneyInput">
                            <span class="l">其他</span>
                            <span class="r">元</span>
                        </div>
                        <div class="anonymous_wrap">
                            <label for="anonymous"><input type="checkbox" name="anonymous" value="1" id="anonymous"><i></i>匿名捐款</label>
                        </div>
                    </div>
                    <a href="javascript:void(0)" class="btn_a" id="btn_submit" money="20">立即捐款</a><div class="prot t2"><label for="check"><input type="checkbox" name="proto2" value="1" id="check" checked=""><i></i>同意</label><a href="javascript:;">《武汉大学教育基金会法律声明》</a>
                </div>
                </div>
            </div>
        </div>
    </div>


</div>
</body>
</html>