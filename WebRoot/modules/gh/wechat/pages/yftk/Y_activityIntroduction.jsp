<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2017/7/2
  Time: 13:35
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <title>活动详情</title>
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
  <script type="text/javascript" src="!gh/wechat/~/scripts/Y_activityIntroduction.js"></script>
  <%
    String cultureId = request.getParameter("culture_id");
  %>
  <input type="hidden" id="cultureId" value=<%=cultureId%>>
</head>
<r:include resource="!comm/~/pages/commOrg.jsp"/>
<body style="background-color: #fff !important;">
<div class="warpe">
  <div class="head">
    <a href="javascript:void(0);" class="return"><i class="icon-chevron-left"></i>返回</a>
    活动详情
  </div>
  <div class="main" id="main_list">
    <div class="postall margin_top clear_border">
<%--      <a href="javascript:;">
        <div class="post_t">
          <img src="!gh/wechat/~/img/pic7.jpg">
          <span>管理员：龙五</span>
        </div>
        <div class="post_m">
          <p>已登录进婚恋信息网络系统的朋友请填写电子版和纸质版“联谊活动报名登记表”，并准备一张本人近期生活照，传送给工会办公室</p>
          <p><span class="puff_left color_y">时间：本周六</span> <span class="puff_right color_y">地点：知音湖</span> </p>
        </div>
        <div class="post_img post_img02 animated bounceIn">
          <img src="!gh/wechat/~/img/pic7.jpg">
        </div>
        <div class="group_txt">
          <p><label>活动须知</label> <i class="icon-volume-down color_y"></i></p>
          <p class="animated fadeInRight"><label class="color_g">开始日期：</label><span>2017-06-17（本周六）</span></p>
          <p class="animated fadeInLeft"><label class="color_g">结束日期：</label><span>2017-06-18（本周日）</span></p>
          <p class="animated fadeInRight"><label class="color_g">人数限制：</label><span>35人</span></p>
          <p class="animated fadeInLeft"><label class="color_g">联系方式：</label><span>027-67884374</span></p>
          <p class="animated fadeInRight"><label class="color_g">费  用：</label><span>无</span></p>
          <p class="animated fadeInLeft"><label class="color_g">具体地点：</label><span>蔡甸知音湖（武汉职工疗养院）</span></p>
          <p class="animated fadeInRight"><label class="color_g">活动提示：</label><span>注意合理着装，注意安全</span></p>
        </div>
        <div class="post_b">
          <span class="puff_left">30分钟前</span>
        </div>
      </a>--%>
    </div>
  </div>

</div>


</body>
</html>
