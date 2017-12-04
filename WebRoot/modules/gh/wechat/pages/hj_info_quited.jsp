<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" import="java.util.*" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%
	String path = request.getContextPath();
	String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
	String option = request.getParameter("option");
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
	<title>退会申请</title>

	<link href="!gh/wechat/~/css/main2.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/style2.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/shake2.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
	<script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
	<script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="!property/base/~/scripts/validate/validate.js"></script>

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
            window.location = "!gh/wechat/~/pages/ghlogin.jsp?page=hj_info";
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
            var option = "<%=option%>"
            if(option=='0'){
                $("#edit_btn").hide();
            }else if(option=='0'){
                $("#edit_btn").show();
            }
        });
	</script>
</head>
<body>
<div class="warpe">
	<div class="bigbg" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;display: none;z-index: 9999;"></div>
	<div class="head"  style="position: relative;">
		<a href="javascript:void(0);" onclick="pageReturn();" class="return1">
			<i class="icon-chevron-left"></i>返回</a>
		退会申请
	</div>
	<form name="trade_form" id="trade_form" method="post">
		<input type="hidden" name="apply_type" id="apply_type" value="2">
		<input type="hidden" name="user_account" id="user_account">
		<input type="hidden" name="user_name" id="user_name">
		<input type="hidden" name="sex" id="sex">
		<input type="hidden" name="card_no" id="card_no">
		<input type="hidden" name="tele_phone" id="tele_phone">
		<input type="hidden" name="dept_id" id="dept_id">
		<input type="hidden" name="email" id="email">
		<div class="inter_add">
			<ul>
				<li class="animated bounceInLeft">
					<a href="javascript:;">
						<span class="puff_left">请输入退会原因：</span>
						<textarea id="reason" name="reason" style="width:100%;height:20%;margin-top: 10px"></textarea>
					</a>
				</li>
			</ul>
		</div>
	</form>
	<div class="id_bth inersest_bth animated bounceIn">
		<a id="edit_btn" href="javascript:void(0)" onclick="edit_submit();">提交申请</a>
	</div>
</div>


<script type="text/javascript">
    var account = "<%=account%>";
    function user_data(account){
        rdcp.form.load("trade_form","!gh/tradeManage/~query/Q_QUITED_USER_INFO", {"account":account}, function (data){
            var p = data.body;
            $("#user_name").val(p.name);
            $("#sex").val(p.sex);
            $("#card_no").val(p.card_no);
            $("#tele_phone").val(p.tele_phone);
            $("#dept_id").val(p.dept_id);
            $("#email").val(p.email);
        });
    }
</script>
<script type="text/javascript">
    var account = "<%=account%>";
    rdcp.ready(function(){
//        $.messager.alert('提示', '确定退会？', 'info', function () {});
        user_data(account);
    });
//    function user_data(account){
//        rdcp.form.load("trade_form","!gh/tradeManage/~query/TEXT_QUITED", {"account":account}, function (data){
//            var p = data.body;
//            $("#user_name").val(p.name);
//            $("#sex").val(p.sex);
//            $("#card_no").val(p.card_no);
//            $("#tele_phone").val(p.tele_phone);
//            $("#dept_id").val(p.dept_id);
//        });
//	}
    function edit_submit() {
        var account = "<%=account%>";
        $("#account").val(account);
        $("#user_account").val(account);
        var reason=$("#reason").val();
//		user_data(account);
            if (reason.length==0||reason==""){
                $.messager.alert('提示', '请输入退会原因！', 'info', function () {

				});
            }else{
                rdcp.form.submit("trade_form", {
                    url: "!gh/tradeManage/~query/Q_APPLY_QUIT_TRADE",
                    success: function (data) {
                        $.messager.alert('提示', '退会申请提交成功，请等待审核结果！', 'info', function () {
                            window.location="!gh/wechat/~/pages/hj_index.jsp";

                        });

                    }
                }, {"mask": true});

            }
    }
    function pageReturn() {
        window.location="!gh/wechat/~/pages/hj_index.jsp";
    }
</script>
</body>
</html>