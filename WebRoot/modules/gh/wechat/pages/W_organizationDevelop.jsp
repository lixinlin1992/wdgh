<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
  <meta content="telephone=no" name="format-detection" />
  <title>社团建设</title>
  <r:include resource="!rdcp/~/pages/listBase.jsp"/>
  <link href="!gh/wechat/css/main.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/style.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/shake.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/font-awesome.min.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/animate.min.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
  <script type="text/javascript" src="!gh/wechat/js/jquery-1.8.3.min.js"></script>
  <script type="text/javascript" src="!gh/wechat/js/wo.js"></script>
  <style>
    .search{font-size: 1.4rem;}
  </style>
  <style type="text/css">
    .return1{
      font-size: 1.6rem;
      color: #fff;
      position: absolute;
      left: 1rem;
      top: 0rem;
    }
  </style>
  <%
    SysPUser user = (SysPUser) session.getAttribute(LoginUserSession.UserSession_Key);
    String userName = "";
    String userId = "";
    if(user != null){
      userName = user.getName();
      userId = user.getAccount();
    }
  %>
</head>
<r:include resource="!comm/~/pages/commOrg.jsp"/>
<body>
<div class="warpe">
  <div class="reveal-modal-bg dis_none"></div>
  <div class="head">
    <a href="!gh/wechat/~/pages/ghmenu.jsp" class="return1"><i class="icon-chevron-left"></i>返回 </a>
    社团建设
  </div>
   <div class="tabs my_tab4">
        <a href="!gh/wechat/~/pages/W_activity.jsp" hidefocus="true" >文体活动</a>
        <a href="!gh/wechat/~/pages/W_organizationDevelop.jsp" hidefocus="true" class="active">社团建设</a>
        <a href="!gh/wechat/~/pages/W_movie.jsp" hidefocus="true">电影消息</a>
        <a href="!gh/wechat/~/pages/W_suzhituozhan.jsp" hidefocus="true" >素质拓展</a>
    </div>
  <div class="interest_list" style="border-bottom: 1rem #ededed solid;">
    <ul>
      <li class="animated bounceInLeft clear_border">
        <a href="!gh/wechat/~/pages/W_organization.jsp">
          <img src="!gh/wechat/img/phfw_icon01.png">
          <div class="list_r">
            <p><span>社团组织</span></p>
            <p class="g-phfw-img"><img src="!gh/wechat/img/phfw_img01.jpg" alt=""></p>
          </div>
        </a>
    </ul>
  </div>
  <div class="interest_list" style="border-bottom: 1rem #ededed solid;">
    <ul>
      <li class="animated bounceInLeft clear_border">
        <a href="!gh/wechat/~/pages/W_orgActivity.jsp">
          <img src="!gh/wechat/~/img/phfw_icon02.png">
          <div class="list_r">
            <p><span>社团活动</span></p>
            <p class="g-phfw-img"><img src="!gh/wechat/~/img/phfw_img02.jpg" alt=""></p>
          </div>
        </a>
    </ul>
  </div>
 <%-- <div class="interest_list" style="border-bottom: 1rem #ededed solid;">
    <ul>
      <li class="animated bounceInLeft clear_border">
        <a href="javascript:void(0);" onclick="hospital()">
          <img src="!gh/wechat/~/img/phfw_icon03.png">
          <div class="list_r">
            <p><span>预约挂号</span></p>
            <p class="g-phfw-img"><img src="!gh/wechat/~/img/phfw_img03.jpg" alt=""></p>
          </div>
        </a>
    </ul>
  </div>
  <div class="interest_list" style="border-bottom: 1rem #ededed solid;">
    <ul>
      <li class="animated bounceInLeft clear_border">
        <a href="!gh/wechat/~/pages/yftk/login.jsp">
          <img src="!gh/wechat/~/img/phfw_icon04.png">
          <div class="list_r">
            <p><span>缘分天空</span></p>
            <p class="g-phfw-img"><img src="!gh/wechat/~/img/phfw_img04.jpg" alt=""></p>
          </div>
        </a>
    </ul>
  </div>--%>

</div>
<%--<script type="text/javascript">
   var userId = "<%=userId%>";
   var userName = "<%=userName%>";
//var userId = 00008629;
// var userName = "田纲";
  function hospital()
  {
    if(userId==""||userName=="")
    {
    window.location= "!gh/wechat/~/pages/ghlogin.jsp";
      //  window.location = "http://210.42.122.109:8080?sno=" + userId + "&sname=" + userName;
    }
    else {
      window.location = "http://210.42.122.109:8080?sno=" + userId + "&sname=" + userName;

      //window.location= "!gh/wechat/~/pages/ghlogin.jsp";
    }
  }
</script>--%>
</body>
</html>
