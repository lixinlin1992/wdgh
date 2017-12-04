<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" import="java.util.*" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%@ taglib prefix="s" uri="/struts-tags" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.bean.DbjzMember" %>
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
	<title>会籍管理</title>
    <link href="!gh/wechat/~/css/main2.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/~/css/style2.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/~/css/shake2.css" rel="stylesheet" type="text/css">
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
<%
    String account ="";
    boolean isLogin  = false;
    SysPUser user = (SysPUser) session.getAttribute(LoginUserSession.UserSession_Key);
    if(user != null)
    {
        account = request.getParameter("account")==null?user.getAccount():request.getParameter("account");
        isLogin = true ;
    }

%>
<script type="text/javascript">
    isLoginON = <%=isLogin%>;
    if(!isLoginON)
    {
        window.location = "!gh/wechat/~/pages/ghlogin.jsp?page=hj_index";
    }

</script>
<script>
    $(document).ready(function(){
        //添加场景
        $("#scene_bth").click(function(){
            $(".reveal-modal-bg").fadeIn(500);
            $(".scene_modal").fadeIn(500);
        });
        $(".reveal-modal-bg,.closed").click(function(){
            $(".modal_img,.reveal-modal-bg").fadeOut(500);
            $(".scene_modal").fadeOut(500);
        });
        //展开悬浮菜单
        $("#side_bth",this).toggle(function(){
            $(".g-tian-nav").fadeIn(200);
        },function(){
            $(".g-tian-nav").fadeOut(200);
        });

        $('.return1').on('click',function(){
            $('body').addClass('animate')
            $(".bigbg").show();
        });
        $('.close,.bigbg').on('click',function(){
            $('body').removeClass('animate');
            $(".bigbg").hide();
        });

    });
</script>
<body style="background-color: #fff !important;">
<div class="warpe g-dbjz">
    <div class="head">
        <a href="!gh/wechat/~/pages/ghmenu.jsp" class="return"><i class="icon-chevron-left"></i>返回 </a>
        会籍管理

        <a href="#" class="search" id="side_bth"><i class="icon-plus" id="plus_btn"></i> &nbsp;</a>
        <ul class="g-tian-nav" id="p_select">
            <li>
                <a href="" onclick="toEdit();return false">
                    编辑信息
                </a>
            </li>
        </ul>

    </div>
    <div class="inter_add" style="border-bottom: 1rem #ededed solid;">
        <%--<ul>--%>
            <%--<li class="animated bounceInLeft clear_border">--%>
                <%--<a href="!gh/wechat/~/pages/dbjz/userInfo.jsp">--%>
                    <%--<span class="puff_left"><img src="!gh/wechat/~/img/yftk_icon04.png" alt=""></span>--%>
                    <%--<span id="dbjz_name"></span>--%>
                    <%--<i class="icon-angle-right"></i>--%>
                <%--</a>--%>
        <%--</ul>--%>

    <form name="trade_form" id="trade_form" method="post">

        <%--<div class="inter_add">--%>
            <ul>
                <li class="animated bounceInLeft clear_border">
                    <a href="javascript:;">
                        <span class="puff_left"><img src="!gh/wechat/~/img/yftk_icon04.png" alt=""></span>
                        <span class="puff_left">会籍状态：</span>
                        <span class="puff_right">
						<input  type="text" id="trade_status" name="trade_status" readonly/>
					</span>
                    </a>
                </li>
            </ul>
        <%--</div>--%>
        <%--<div class="inter_add">--%>
            <p1>
            <ul>
                <li id  = "gonghao"  class="animated bounceInLeft">
                    <a href="javascript:;">
                        <span class="puff_left"><img src="!gh/wechat/~/img/yftk_icon04.png" alt=""></span>
                        <span class="puff_left">工号：</span>
                        <span class="puff_right">
						<input  type="text" id="account" name="account" readonly/>
					</span>

                    </a>
                </li>
                <li class="animated bounceInLeft">
                    <a href="javascript:;">
                        <span class="puff_left"><img src="!gh/wechat/~/img/yftk_icon04.png" alt=""></span>
                        <span class="puff_left">姓名：</span>
                        <span class="puff_right">
						<input  type="text" id="name" name="name" readonly/>
					</span>

                    </a>
                </li>
                <li class="animated bounceInLeft">
                    <a href="javascript:;">
                        <span class="puff_left"><img src="!gh/wechat/~/img/yftk_icon04.png" alt=""></span>
                        <span class="puff_left">性别：</span>
                        <span class="puff_right">
						<input  type="text" id="sex" name="sex" readonly/>
					</span>

                    </a>
                </li>
            </ul>
            </p1>
        <%--</div>--%>

    </form>
    </div>
    <div class="inter_add" style="border-bottom: 1rem #ededed solid;">
        <ul>
            <p2>
            <li class="animated bounceInLeft clear_border">
                <a href="!gh/wechat/~/pages/hj_info.jsp?option=0">
                    <span class="puff_left"><img src="!gh/wechat/~/img/yftk_icon05.png" alt="">详细信息</span>
                    <i class="icon-angle-right"></i>
                </a>
            </li>
            </p2>
            <p3>
            <li class="animated bounceInLeft clear_border">
                <a href="" onclick="applyTo();return false">
                    <span class="puff_left"><img src="!gh/wechat/~/img/yftk_icon02.png" alt="">申请入会</span>
                    <i class="icon-angle-right"></i>
                </a>
            </li>
            </p3>
            <p4>
            <li class="animated bounceInLeft clear_border">
                <a href="" onclick="toQuit();return false">
                    <span class="puff_left"><img src="!gh/wechat/~/img/yftk_icon02.png" alt="">申请退会</span>
                    <i class="icon-angle-right"></i>
                </a>
            </li>
            </p4>
            <p5>
                        <div class="post_t post_t2 w_txt">
                            <span class=" icon-file-text"></span>
                              说明
                        </div>
                        <div class="post_m" style="margin-bottom: 10px">
                            <p class="color_g animated fadeInRight">因超过六个月未缴纳会费导致被退会，请及时补交所欠会费！</p>
                        </div>
<%--                <li class="animated bounceInLeft clear_border">
                    提示:因超过六个月未缴纳会费导致被退会，请及时补交所欠会费！
                        <i class="icon-angle-right"></i>
                    </a>
                </li>--%>
            </p5>
        </ul>
    </div>

</div>
<script type="text/javascript">
    var status ;
    var account = "<%=account%>";
    rdcp.ready(function(){
        if(isLoginON)
        {
            rdcp.request( "!gh/wechat/~query/Q_LOAD_USER_TRADE_STATUS",{"account":account},function (data) {
                status = data.body.trade_status;
                if(data.body.trade_status == 0)
                {
                    $("p2").hide();
                    $("p3").show();
                    $("p4").hide();
                    $("p5").hide();
                    $("#side_bth").hide();
                    $("#plus_btn").hide();
                    $("#p_select").hide();
                    /*window.location = "!gh/wechat/~/pages/hj_to_apply.jsp";*/
                }
                else if(data.body.trade_status == 2)
                {
                   /* window.location = "!gh/wechat/~/pages/hj_quited.jsp";*/
                    $("p2").hide();
                    $("p3").show();
                    $("p4").hide();
                    $("p5").hide();
                    $("#side_bth").hide();
                    $("#plus_btn").hide();
                    $("#p_select").hide();
                }
                else if(data.body.trade_status == 1)
                {
                    $("p3").hide();
                    $("p5").hide();
                }
                else if(data.body.trade_status == 3)
                {
                    $("p2").hide();
                    $("p3").hide();
                    $("p4").hide();
                    $("#side_bth").hide();
                    $("#plus_btn").hide();
                    $("#p_select").hide();
                    $("p5").show();

                }
                else
                {
                    /*window.location = "!gh/wechat/~/pages/hj_to_apply.jsp";*/
                    $("p3").hide();
                    $("p4").hide();
                    $("p5").hide();
                    $("hForm").hide();
                }
            });
        }
        rdcp.form.load("trade_form", "!gh/wechat/~query/Q_LOAD_USER_TRADE_INFO", {"account":account}, function (data) {

        });

    });
    function edit_submit() {
        var memo = $("#memo").val();
        var account = $("#account").val();
        rdcp.request("!gh/wechat/~query/Q_USER_TRADE_INFO_UPDATE",{"account":account,"memo":memo},function(data){
            if(data==1)
            {
                alert("修改保存成功");
                window.location="!gh/wechat/~/pages/hj_info.jsp";
            }

            //   $.messager.alert("提示","操作成功!","info");
            //   rdcp.grid.reload("listdt");
            //  $("#delTradeDlg").dialog("close");

        });
    }
    function pageReturn() {
        window.location="!gh/wechat/~/pages/ghmenu.jsp";
    }
function applyTo(){
    var account = $("#account").val();
    rdcp.request("!gh/tradeManage/~query/Q_GET_APPLY_NUM",{"account":account,"type":0},function(data) {
        var p = data.body;
        if(p.num>0){
            $.messager.alert('提示', '用户已申请，请等待审核结果！', 'info', function () {
                // cancel();
            });
        }else{
            window.location = "!gh/wechat/~/pages/hj_apply.jsp";
        }
    });
    }
    function toQuit(){
        var account = $("#account").val();
        rdcp.request("!gh/tradeManage/~query/Q_GET_APPLY_NUM",{"account":account,"type":2},function(data) {
            var p = data.body;
            if(p.num>0){
                $.messager.alert('提示', '用户已申请，请等待审核结果！', 'info', function () {
                    // cancel();
                });
            }else{
                window.location = "!gh/wechat/~/pages/hj_info_quited.jsp";
            }
        });

    }
    function toEdit(){
        var account = $("#account").val();
        rdcp.request("!gh/tradeManage/~query/Q_GET_APPLY_NUM",{"account":account,"type":1},function(data) {
            var p = data.body;
            if(p.num>0){
                $.messager.alert('提示', '用户已申请，请等待审核结果！', 'info', function () {
                    // cancel();
                });
            }else{
                window.location = "!gh/wechat/~/pages/hj_info.jsp?option=1";
            }
        });
    }
</script>
</body>
</html>