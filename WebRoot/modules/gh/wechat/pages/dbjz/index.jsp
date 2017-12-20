<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" import="java.util.*" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.bean.DbjzMember" %>
<%
    String path = request.getContextPath();
    String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
    String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
    String userName = null;
    String userAccount = null;
    DbjzMember member = (DbjzMember)request.getSession().getAttribute("dbjzMember");
    boolean is_member = false;
    if(member == null){
      SysPUser user = (SysPUser) session.getAttribute(LoginUserSession.UserSession_Key);
      if(user != null) {
          userName = user.getName();
          userAccount = user.getAccount();
      }
    }
    else{
      is_member = true;
      userName = member.getName();
      userAccount = member.getAccount();
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
	<title>大病救助</title>
	<link href="!gh/wechat/~/css/main.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/style.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/shake.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
	<script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
    <script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
    <style type="text/css">
        .return1{
            font-size: 1.6rem;
            color: #fff;
            position: absolute;
            left: 1rem;
            top: 0rem;
        }
    </style>
</head>
<script type="text/javascript">
var userName = "<%=userName%>";
var userAccount = "<%=userAccount%>";
var is_member = <%=is_member%>;
rdcp.ready(function(){
  if(userName=="null"||userAccount=="null")
      window.location.href="!gh/wechat/~/pages/dbjz/login.jsp";
  else if(!is_member)
    autoLogin();
  else{
    $("#dbjz_name").html(userName);
    $("#dbjz_account").html("人事号:"+userAccount);
  }
  $(".return").click(function(){
      history.back(-2);
  });
});
function autoLogin(){
  rdcp.request("!gh/wechat/~java/Dbjz.login",{"userName":userName,"userAccount":userAccount},function(data){
    if(data.header.code == 0){
      if(data.body == "-1"){
         $.messager.alert("提示","自动登录失败,请手动登录大病求助系统","info",function(){
             window.location.href="!gh/wechat/~/pages/dbjz/login.jsp";
         });
      }
    }
  });
}

</script>
<body style="background-color: #fff !important;">
<div class="warpe g-dbjz">
    <div class="head">
        <a href="!gh/wechat/~/pages/ghmenu.jsp" class="return1"><i class="icon-chevron-left"></i>返回 </a>
        <a href="!gh/wechat/~/pages/ghmenu.jsp" class="search"><i class="icon-home"></i> &nbsp;</a>
        大病救助
    </div>
    <div class="inter_add" style="border-bottom: 1rem #ededed solid;">
        <ul>
            <li class="animated bounceInLeft clear_border">
                <a href="!gh/wechat/~/pages/dbjz/login.jsp">
                    <span class="puff_left"><img src="!gh/wechat/~/img/yftk_icon04.png" alt=""></span>
                    <span id="dbjz_name"></span>
                    <i class="icon-angle-right"></i>
                </a>
        </ul>
    </div>
    <%--<div class="interest_list" style="border-bottom: 1rem #ededed solid;">
        <ul>
            <li class="animated bounceInLeft clear_border">
                <a href="!gh/wechat/~/pages/dbjz/userInfo.jsp">
                    <img src="!gh/wechat/~/img/banner.jpg">
                    <div class="list_r">
                        <p><span id="dbjz_name"></span></p>
                        <p id="dbjz_account"></p>
                        <div class="useradmin">
                            <p><i class="icon-angle-right"></i> </p>
                            
                        </div>
                    </div>
                </a>
        </ul>
    </div>--%>
    <div class="inter_add" style="border-bottom: 1rem #ededed solid;">
        <ul>
            <li class="animated bounceInLeft clear_border">
                <a href="!gh/wechat/~/pages/dbjz/donate.jsp?type=notice">
                    <span class="puff_left"><img src="!gh/wechat/~/img/yftk_icon05.png" alt="">公示公告</span>
                    <i class="icon-angle-right"></i>
                </a>
            </li>
            <li class="animated bounceInLeft clear_border">
                <a href="!gh/wechat/~/pages/dbjz/donate.jsp?type=donate">
                    <span class="puff_left"><img src="!gh/wechat/~/img/yftk_icon02.png" alt="">捐赠信息</span>
                    <i class="icon-angle-right"></i>
                </a>
            </li>
        </ul>
    </div>
    
    <div class="nav margin_top">
        <div class="s_title">
            <p>
                <span class="puff_left">大病救助申请</span>
                 </span>
            </p>
        </div>
        <ul>
           <li class="margin_top">
                <a href="!gh/wechat/~/pages/dbjz/dbjz_submit.jsp">
                    <p><img src="!gh/wechat/~/img/dbjz_j01.png" class="animated bounceIn"></p>
                    <span>全部申请</span>
                </a>
            </li>
            <li class="margin_top">
                <a href="!gh/wechat/~/pages/dbjz/dbjz_apply.jsp">
                    <p><img src="!gh/wechat/~/img/dbjz_j02.png" class="animated rotateIn"></p>
                    <span>在线申请</span>
                </a>
            </li>
            <li class="margin_top">
                <a href="!gh/wechat/~/pages/dbjz/dbjz_submit.jsp">
                    <p><img src="!gh/wechat/~/img/dbjz_j03.png" class="animated bounceIn"></p>
                    <span>已提交的申请</span>
                </a>
            </li>
            <li class="margin_top">
                <a href="!gh/wechat/~/pages/dbjz/dbjz_submit_passed.jsp">
                    <p><img src="!gh/wechat/~/img/dbjz_j04.png" class="animated rotateIn"></p>
                    <span>审核通过</span>
                </a>
            </li>
        </ul>
    </div>
    
    <div class="nav margin_top">
        <div class="s_title">
            <p>
                <span class="puff_left">特困补助申请</span>
                 </span>
            </p>
        </div>
        <ul>
            <li class="margin_top">
                <a href="!gh/wechat/~/pages/dbjz/tkbz_submit.jsp">
                    <p><img src="!gh/wechat/~/img/dbjz_b01.png" class="animated bounceIn"></p>
                    <span>全部申请</span>
                </a>
            </li>
            <li class="margin_top">
                <a href="!gh/wechat/~/pages/dbjz/tkbz_apply.jsp">
                    <p><img src="!gh/wechat/~/img/dbjz_b02.png" class="animated rotateIn"></p>
                    <span>在线申请</span>
                </a>
            </li>
            <li class="margin_top">
                <a href="!gh/wechat/~/pages/dbjz/tkbz_submit.jsp">
                    <p><img src="!gh/wechat/~/img/dbjz_b03.png" class="animated bounceIn"></p>
                    <span>已提交的申请</span>
                </a>
            </li>
            <li class="margin_top">
                <a href="!gh/wechat/~/pages/dbjz/tkbz_submit_passed.jsp">
                    <p><img src="!gh/wechat/~/img/dbjz_j0b.png" class="animated rotateIn"></p>
                    <span>审核通过</span>
                </a>
            </li>
        </ul>
    </div>
    
   
</div>
</body>
</html>