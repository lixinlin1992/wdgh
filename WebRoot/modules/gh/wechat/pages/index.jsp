<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2017/6/22
  Time: 20:44
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>首页</title>
  <meta name="keywords" content="">
  <meta name="description" content="">
  <script src="js/rem.js"></script>
  <script src="js/jquery.min.js" type="text/javascript"></script>
  <link rel="stylesheet" type="text/css" href="css/base.css"/>
  <link rel="stylesheet" type="text/css" href="css/page.css"/>
  <link rel="stylesheet" type="text/css" href="css/all.css"/>





</head>
<!--loading页开始-->

<!--loading页结束-->
<body>
<div class="head" style="text-align:left; padding-left:20px;">
  <span style="float:left; margin-top:6px; height:30px;"><img src="img/logo100.png" width="30" /></span>
  <span style="padding-left:20px;">工会服务教职工系统</span>

</div>
<div class="clearfloat"></div>
<div id="main" class="mui-clearfix">
  <!-- 搜索层 -->


  <div class="mui-content">
    <div class="banner swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide"><a href="javascript:void(0)"><img class="swiper-lazy" data-src="img/banner.jpg" alt=""></a></div>
        <div class="swiper-slide"><a href="javascript:void(0)"><img class="swiper-lazy" data-src="img/banner02.jpg" alt=""></a></div>
        <div class="swiper-slide"><a href="javascript:void(0)"><img class="swiper-lazy" data-src="img/banner03.jpg" alt=""></a></div>
        <div class="swiper-slide"><a href="javascript:void(0)"><img class="swiper-lazy" data-src="img/banner05.jpg" alt=""></a></div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
    <div class="mui-top clearfloat">
      <div class="list fl">
        <a href="#">
          <img src="img/ylh-icon1.png"/>
          <p class="tit">12351热线</p>
        </a>
      </div>
      <div class="list fl">
        <a href="hj.html">
          <img src="img/ylh-icon2.png"/>
          <p class="tit">会籍管理</p>
        </a>
      </div>
      <div class="list fl">
        <a href="second.html">
          <img src="img/ylh-icon3.png"/>
          <p class="tit">提案系统</p>
        </a>
      </div>
    </div>
    <div class="mui-top clearfloat">
      <div class="list fl">
        <a href="PHFW.html">
          <img src="img/ylh-icon4.png"/>
          <p class="tit">普惠服务</p>
        </a>
      </div>
      <div class="list fl">
        <a href="dbjz.html">
          <img src="img/ylh-icon5.png"/>
          <p class="tit">大病救助</p>
        </a>
      </div>
      <div class="list fl">
        <a href="qybh.html">
          <img src="img/ylh-icon6.png"/>
          <p class="tit">权益保护</p>
        </a>
      </div>
    </div>
    <div class="mui-top clearfloat">
      <div class="list fl">
        <a href="http://www.ceat.edu.cn/ ">
          <img src="img/ylh-icon7.png"/>
          <p class="tit">宣教课堂</p>
        </a>
      </div>
      <div class="list fl">
        <a href="WTTD.html">
          <img src="img/ylh-icon8.png"/>
          <p class="tit">文体天地</p>
        </a>
      </div>
      <div class="list fl">
        <a href="#">
          <img src="img/ylh-icon9.png"/>
          <p class="tit">献爱心</p>
        </a>
      </div>
    </div>




  </div>

  <div class="foot">
    版权所有：武汉大学信息中心

  </div>

</body>

<script src="js/fastclick.js"></script>
<script src="js/mui.min.js"></script>


<!--插件-->
<link rel="stylesheet" href="css/swiper.min.css">
<script src="js/swiper.jquery.min.js"></script>
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
