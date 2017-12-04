<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" import="java.util.*" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.bean.YftkUser" %>
<%
    String path = request.getContextPath();
    String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
    String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
    YftkUser user = (YftkUser)request.getSession().getAttribute("YftkUser");
    boolean is_login = false;
    String nick_name = null;
    String img_path = null;
    int user_id = -1;
    if(user != null){
      is_login = true;
      nick_name = user.getNick_name();
      img_path = user.getImg_path();
      user_id = user.getUser_id();
    }
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
	<title>个人中心</title>
	<link href="!gh/wechat/~/css/main.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/style.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/shake.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
	<script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
    <script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
</head>
<script type="text/javascript">
var is_login = <%=is_login%>;
var user_id = <%=user_id%>;
var img_path = "<%=img_path%>";
rdcp.ready(function(){
  if(!is_login){
    alert("还未登录");
    window.location.href = "!gh/wechat/~/pages/yftk/login.jsp";
  }
  $(".return").click(function(){
      history.back(-2);
  });
},rdcp.defaultLoadModules2);
function loginOut(){
  rdcp.request("!gh/wechat/~java/YftkAction.loginOut",{},function(data){
    if(data.header.code=="0")
      window.location.href = "!gh/wechat/~/pages/yftk/login.jsp";
  });
}
</script>
<body style="background-color: #fff !important;" class="g-yftk-grzx">
<div class="warpe">
    <div class="head">
      <a href="!gh/wechat/~/pages/yftk/Y-search.jsp" class="return"><i class="icon-chevron-left"></i>返回</a>
      <a href="!gh/wechat/~/pages/ghmenu.jsp" class="search"><i class="icon-home"></i> &nbsp;</a>
        个人中心
    </div>
    <div class="interest_list" style="border-bottom: 1rem #ededed solid;">
        <ul>
            <li class="animated bounceInLeft clear_border">
                <a href="!gh/wechat/~/pages/yftk/U_userinfo.jsp">
                    <img src="<%=img_path==null?"!gh/wechat/~/img/banner.jpg":img_path%>">
                    <div class="list_r">
                        <p><span>昵称</span></p>
                        <p><%=nick_name%></p>
                        <div class="useradmin">
                        </div>
                    </div>
                </a>
        </ul>
    </div>
    <div class="inter_add">
        <ul>
            <li class="animated fadeInLeft">
                <a href="!gh/wechat/~/pages/yftk/U_userinfo.jsp">
                    <span class="puff_left"><img src="!gh/wechat/~/img/yftk_icon01.png" alt="">基本资料</span>
                    <i class="icon-angle-right"></i>
                </a>
            </li>
            <li class="animated fadeInRight">
                <a href="!gh/wechat/~/pages/yftk/U_nxdb.jsp">
                    <span class="puff_left"><img src="!gh/wechat/~/img/yftk_icon02.png" alt="">内心独白</span>
                    <i class="icon-angle-right"></i>
                </a>
            </li>
            <li class="animated fadeInLeft">
                <a href="!gh/wechat/~/pages/yftk/U_zytj.jsp">
                    <span class="puff_left"><img src="!gh/wechat/~/img/yftk_icon03.png" alt="">择友条件</span>
                    <i class="icon-angle-right"></i>
                </a>
            </li>
             <li class="animated fadeInLeft">
                <a href="!gh/wechat/~/pages/yftk/U_zhgl.jsp">
                    <span class="puff_left"><img src="!gh/wechat/~/img/yftk_icon04.png" alt="">账号管理</span>
                    <i class="icon-angle-right"></i>
                </a>
            </li>
        </ul>
    </div>
    <div class="id_bth inersest_bth animated bounceIn">
      <p><a href="javascript:void(0);" onclick="loginOut();">退 出</a></p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
    </div>
    <footer class="g-yftk-footer">
        <div class="tabs my_tab3">
            <a href="!gh/wechat/~/pages/yftk/Y-search.jsp" hidefocus="true">
                <p class="g-yftk-icon"><i class="g-yftk-icon1"></i></p>
                <p>发现缘分</p>
            </a>
            <a href="!gh/wechat/~/pages/yftk/Y_activity.jsp" hidefocus="true">
                <p class="g-yftk-icon"><i class="g-yftk-icon2"></i></p>
                <p>交友活动</p>
            </a>
            <a href="javascript:void(0);" hidefocus="true"  class="active">
                <p class="g-yftk-icon"><i class="g-yftk-icon3"></i></p>
                <p>个人中心</p>
            </a>
        </div>
    </footer>
</div>
</body>
</html>