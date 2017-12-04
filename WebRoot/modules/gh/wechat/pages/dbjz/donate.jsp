<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" import="java.util.*" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%
    String path = request.getContextPath();
    String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
    String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
    String type= request.getParameter("type");
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
	<script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="!gh/wechat/~/js/idangerous.swiper.min.js"></script>
	<script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
</head>
<script type="text/javascript">
var type= "<%=type%>";
rdcp.ready(function(){
    var tabsSwiper = new Swiper('.swiper-container',{
        speed:500,
        onSlideChangeStart: function(){
            $(".tabs .active").removeClass('active');
            $(".tabs a").eq(tabsSwiper.activeIndex).addClass('active');
        }
    });
    $(".tabs a").on('touchstart mousedown',function(e){
        e.preventDefault();
        $(".tabs .active").removeClass('active')
        $(this).addClass('active')
        tabsSwiper.slideTo( $(this).index() )
    });
    $(".tabs a").click(function(e){
        e.preventDefault();
        $(".tabs .active").removeClass('active');
        $(this).addClass('active');
        tabsSwiper.slideTo( $(this).index() );
    });
    $(".return").click(function(){
        history.back(-2);
    });
  $("#a_"+type).click();
  loadNotices();
},rdcp.defaultLoadModules2);
function loadNotices(){
  rdcp.request("!gh/wechat/~java/Dbjz.getNotices",{},function(data){
    if(data.header.code == 0){
      for(var i=0;i<data.body.total;i++){
        var t = data.body.rows[i];
        var html = "<li class='animated fadeInRight'><a href='!gh/wechat/~/pages/dbjz/donateDetail.jsp?type=1&id="+t.id+"'>";
        html += "<p>"+t.title+"<p><p><span class='puff_left'>来自"+t.copy_from+"<span class='puff_right'>"+t.put_time+"</span></p></a>"
        $("#notice_ul").append(html);
      }
    }
    else{
      $.messager.alert("错误",data.errorMsg,"error");
    }
  });
}

</script>
<body style="background-color: #fff !important;">
<div class="warpe">
    <div class="head">
        <a href="javascript:void(0);" class="return"><i class="icon-chevron-left"></i>返回</a>
       <%-- <a href="javascript:void(0);" class="search"><i class="icon-home"></i> &nbsp;</a>--%>
        大病救助
    </div>
    <div class="tabs my_tab">
        <a href="javascript:void(0);" id="a_notice" class="active" hidefocus="true">公示公告</a>
        <a href="javascript:void(0);" id="a_donate" hidefocus="true">捐赠信息</a>
    </div>
    <div class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide">
                <div class="content-slide">
                    <div class="main">
                        <div class="finance">
                            <ul id="notice_ul">
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="swiper-slide">
                <div class="content-slide">
                        <div class="main">
                            暂无内容
                        </div>
                </div>
            </div>

        </div>
    </div>

</div>

</html>


