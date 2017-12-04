<%--
<%@ page import="java.util.List" %>
<!--
Created by IntelliJ IDEA.
User: sunjiaxin
Date: 2017/6/21
Time: 7:52
To change this template use File | Settings | File Templates.
-->
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <title>电影详情</title>
  <r:include resource="!rdcp/~/pages/listBase.jsp"/>
  <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
  <link href="!comm/css/addTable.css" rel="stylesheet" type="text/css">
  <link href="!service/file~/css/editfile.css" rel="stylesheet" type="text/css"/>
  <link href="!gh/wechat/css/main.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/style.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/shake.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/font-awesome.min.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/animate.min.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
  <script type="text/javascript" src="!gh/wechat/js/jquery-1.8.3.min.js"></script>
  <script type="text/javascript" src="!gh/wechat/js/wo.js"></script>
  <script type="text/javascript" src="!gh/wechat/~/scripts/W_activityIntroduction.js"></script>
  &lt;%&ndash;<%
    String cultureId = request.getParameter("culture_id");
  %>
  <input type="hidden" id="cultureId" value=<%=cultureId%>>&ndash;%&gt;
</head>
<r:include resource="!comm/~/pages/commOrg.jsp"/>
<body style="background-color: #fff !important;">
<div class="warpe">
  <div class="head">
    <a href="#" class="return"><i class="icon-chevron-left"></i>返回</a>
    电影详情
  </div>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <div class="content-slide">
          <div class="main">
            <div class="postall margin_top clear_border">
              <a href="#">

                <div class="post_m">
                  <p class="text-nocut">&nbsp;&nbsp;&nbsp;&nbsp;人类和变形金刚开战，擎天柱失踪，拯救未来的关键就埋藏在历史的秘密之中，那是地球上变形金刚的历史。拯救世界的责任落在一支非同寻常的队伍身上：凯德·伊格尔（马克·沃尔伯格 饰）、大黄蜂、一位英国爵士（安东尼·霍普金斯 饰）还有一位牛津大学教授（劳拉·哈德克 饰）。每个人一生中都会遇到这样一个时刻，它召唤着我们去改变世界。一直被追捕的人将成为英雄，英雄会变成反派。我们和他们的世界，只能存活一个。</p>
                </div>
                <div class="post_img post_img02 animated bounceIn">
                  <img class="g-dyxx-detailimg" src="http://img5.mtime.cn/CMS/News/2017/06/11/173706.73924125_620X620.jpg">
                </div>
                <div class="group_txt">
                  <p><label>影片信息</label> <i class="icon-volume-down color_y"></i></p>
                  <p class="animated fadeInRight"><label class="color_g">上映日期：</label><span>2017-06-17（本周六）</span></p>
                  <p class="animated fadeInLeft"><label class="color_g">影片类型：</label><span>动作,冒险,科幻</span></p>
                  <p class="animated fadeInRight"><label class="color_g">地区：</label><span>美国</span></p>
                  <p class="animated fadeInLeft"><label class="color_g">影片时长：</label><span>150分钟</span></p>
                </div>
                <div class="post_b">
                  <span class="puff_left">30分钟前</span>
                </div>
              </a>
            </div>
          </div>


        </div>

</body>
</html>--%>
<%@ page import="java.util.List" %>
<!--
Created by IntelliJ IDEA.
User: sunjiaxin
Date: 2017/6/21
Time: 7:52
To change this template use File | Settings | File Templates.
-->
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <title>电影详情</title>
  <r:include resource="!rdcp/~/pages/listBase.jsp"/>
  <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
  <link href="!comm/css/addTable.css" rel="stylesheet" type="text/css">
  <link href="!service/file~/css/editfile.css" rel="stylesheet" type="text/css"/>
  <link href="!gh/wechat/css/main.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/style.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/shake.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/font-awesome.min.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/animate.min.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
  <script type="text/javascript" src="!gh/wechat/js/jquery-1.8.3.min.js"></script>
  <script type="text/javascript" src="!gh/wechat/js/wo.js"></script>
  <script type="text/javascript" src="!gh/wechat/~/scripts/W_activityIntroduction.js"></script>
  <%
    String cultureId = request.getParameter("culture_id");
  %>
  <input type="hidden" id="cultureId" value=<%=cultureId%>>
</head>
<r:include resource="!comm/~/pages/commOrg.jsp"/>
<body style="background-color: #fff !important;">
<div class="warpe">
  <div class="head">
    <a href="!gh/wechat/~/pages/W_movie.jsp" class="return"><i class="icon-chevron-left"></i>返回</a>
    电影详情
  </div>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <div class="content-slide">
          <div class="main" id="main">

          </div>
        </div>
      </div>

    </div>

  </div>

</div>


</body>
</html>

