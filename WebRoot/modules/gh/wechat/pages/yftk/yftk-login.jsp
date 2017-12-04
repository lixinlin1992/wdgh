<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2017/7/3
  Time: 1:27
  To change this template use File | Settings | File Templates.
--%>
<%--
  Created by IntelliJ IDEA.
  User: sunjiaxin
  Date: 2017/7/1
  Time: 10:32
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <title>登录缘分天空系统</title>
  <r:include resource="!rdcp/~/pages/listBase.jsp"/>
  <script type="text/javascript" src="!gh/wechat/~/scripts/Y-search.js"></script>

  <link href="!gh/wechat/css/main.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/style.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/shake.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/font-awesome.min.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/animate.min.css" rel="stylesheet" type="text/css">
  <link href="!gh/wechat/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
  <script type="text/javascript" src="!gh/wechat/js/jquery-1.8.3.min.js"></script>
  <script type="text/javascript" src="!gh/wechat/js/wo.js"></script>
</head>
<r:include resource="!comm/~/pages/commOrg.jsp"/>
<body class="g-yftk">
<div class="warpe">
  <div class="reveal-modal-bg dis_none"></div>
  <div class="head">
    <a href="#" class="return"><i class="icon-chevron-left"></i> </a>
    登录-缘分天空
  </div>
  <div class="main">
    <div class="regall">
      <div class="reginput">
        <input type="text" placeholder="注册邮箱">
      </div>
      <div class="reginput">
        <input type="text" placeholder="密码">
      </div>
      <div class="id_bth inersest_bth animated bounceIn" style="margin-top: 2rem;">
        <p><a href="!gh/wechat/~/pages/yftk/Y-search.jsp">登 录</a></p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>

      </div>

    </div>
  </div>
</div>
</body>
</html>