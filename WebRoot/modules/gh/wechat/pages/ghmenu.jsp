<%--
User: Larry
--%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="com.sunrise.framework.core.ApplicationManager" %>
<%@taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>首页</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <%--<r:include resource="!rdcp/~/pages/listBasePhone.jsp"/>--%>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>

    <script src="!gh/wechat/~/js/rem.js"></script>
    <script src="!gh/wechat/~/js/jquery.min.js" type="text/javascript"></script>
    <link rel="stylesheet" type="text/css" href="!gh/wechat/~/css/base.css"/>
    <link rel="stylesheet" type="text/css" href="!gh/wechat/~/css/page.css"/>
    <link rel="stylesheet" type="text/css" href="!gh/wechat/~/css/all.css"/>

</head>
<body>
<div class="head" style="text-align:left; padding-left:20px;">
    <span style="float:left; margin-top:6px; height:30px;"><img src="!gh/wechat/~/img/logo100.png" width="30" /></span>
    <span style="padding-left:20px;">工会服务教职工系统</span>

</div>
<div class="clearfloat"></div>
<div id="main" class="mui-clearfix">
    <!-- 搜索层 -->


    <div class="mui-content">
        <div class="banner swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide"><a href="javascript:void(0)"><img class="swiper-lazy" data-src="!gh/wechat/~/img/banner.jpg" alt=""></a></div>
                <div class="swiper-slide"><a href="javascript:void(0)"><img class="swiper-lazy" data-src="!gh/wechat/~/img/banner02.jpg" alt=""></a></div>
                <div class="swiper-slide"><a href="javascript:void(0)"><img class="swiper-lazy" data-src="!gh/wechat/~/img/banner03.jpg" alt=""></a></div>
                <div class="swiper-slide"><a href="javascript:void(0)"><img class="swiper-lazy" data-src="!gh/wechat/~/img/banner05.jpg" alt=""></a></div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
        <div class="mui-top clearfloat">
            <div class="list fl">
                <a href="tel:12351" >
                    <img src="!gh/wechat/~/img/ylh-icon1.png"/>
                    <p class="tit">12351热线</p>
                </a>
            </div>
            <div class="list fl">
                <a href="!gh/wechat/~/pages/hj_index.jsp">
                    <img src="!gh/wechat/~/img/ylh-icon2.png"/>
                    <p class="tit">会籍管理</p>
                </a>
            </div>
            <div class="list fl">
                   <a href="http://tian.whu.edu.cn/loginWechat">
                    <img src="!gh/wechat/~/img/ylh-icon3.png"/>
                    <p class="tit">提案系统</p>
                </a>
            </div>
        </div>
        <div class="mui-top clearfloat">
            <div class="list fl">
                <a href="!gh/wechat/~/pages/phfw.jsp">
                    <img src="!gh/wechat/~/img/ylh-icon4.png"/>
                    <p class="tit">普惠服务</p>
                </a>
            </div>
            <div class="list fl">
                <a href="!/gh/wechat/~/pages/dbjz/index.jsp">
                    <img src="!gh/wechat/~/img/ylh-icon5.png"/>
                    <p class="tit">大病救助</p>
                </a>
            </div>
            <div class="list fl">
                <a href="!/gh/wechat/~/pages/legalAid.jsp">
                    <img src="!gh/wechat/~/img/ylh-icon6.png"/>
                    <p class="tit">权益保护</p>
                </a>
            </div>
        </div>
        <div class="mui-top clearfloat">
            <div class="list fl">
                <a href="http://www.ceat.edu.cn/">
                    <img src="!gh/wechat/~/img/ylh-icon7.png"/>
                    <p class="tit">宣教课堂</p>
                </a>
            </div>
            <div class="list fl">
                <a href="!/gh/wechat/~/pages/W_activity.jsp">
                    <img src="!gh/wechat/~/img/ylh-icon8.png"/>
                    <p class="tit">文体天地</p>
                </a>
            </div>
            <div class="list fl">
                <a href="!/gh/wechat/~/pages/xax-detail.jsp">
                    <img src="!gh/wechat/~/img/ylh-icon9.png"/>
                    <p class="tit">献爱心</p>
                </a>
            </div>
        </div>




    </div>

    <div class="foot">

        版权所有：武汉大学工会

    </div>

</body>

<script src="!gh/wechat/~/js/fastclick.js"></script>
<script src="!gh/wechat/~/js/mui.min.js"></script>


<!--插件-->
<link rel="stylesheet" href="!gh/wechat/~/css/swiper.min.css">
<script src="!gh/wechat/~/js/swiper.jquery.min.js"></script>
<!--插件-->
<script >
    $(function () {
        var banner = new Swiper('.banner',{
            autoplay: 5000,
            pagination : '.swiper-pagination',
            paginationClickable: true,
            lazyLoading : true,
            loop:true
        });

        mui('.pop-schwrap .sch-input').input();
        var deceleration = mui.os.ios?0.003:0.0009;
        mui('.pop-schwrap .scroll-wrap').scroll({
            bounce: true,
            indicators: true,
            deceleration:deceleration
        });
        $('.top-sch-box .fdj,.top-sch-box .sch-txt,.pop-schwrap .btn-back').on('click',function () {
            $('html,body').toggleClass('holding');
            $('.pop-schwrap').toggleClass('on');
            if($('.pop-schwrap').hasClass('on')) {;
                $('.pop-schwrap .sch-input').focus();
            }
        });

    });
</script>

</html>