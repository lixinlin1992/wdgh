<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" import="java.util.*" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
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
	<title>大病救助</title>
	<link href="!gh/wechat/~/css/main.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/style.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/shake.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
	<script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
	<script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
<%--<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>

<%@taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>

	<r:include resource="!rdcp/~/pages/listBase.jsp"/>


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
		<script type="text/javascript" src="!gh/wechat/~/js/jquery-1.8.3.min.js"></script>
		<script type="text/javascript" src="!gh/wechat/~/js/wo.js"></script>
		<script type="text/javascript" src="!gh/wechat/~/js/idangerous.swiper.min.js"></script>--%>
<%
	DbjzMember member = (DbjzMember)request.getSession().getAttribute("dbjzMember");
%>

</head>

<body style="background-color: #fff !important;">
<div class="warpe">
	<div class="head">
		<a href="!gh/wechat/~/pages/dbjz/index.jsp" class="return"><i class="icon-chevron-left"></i> 返回</a>
		在线申请
	</div>
	<div class="main">
		<div class="part part2 margin_top" style="margin-bottom: 0rem;">
			<ul>
				<li class="animated fadeInRight">
					<input type="text" id="name"  class="text_r" readonly>
					<label class="puff_left">姓名：</label>
				</li>

				<li class="animated fadeInRight">
					<input type="text" id="account"placeholder="" class="text_r" readonly>
					<label class="puff_left">人事号：</label>
				</li>
				<li class="animated fadeInLeft">
					<input type="text" id="gh" placeholder="" class="text_r" readonly>
					<label class="puff_left">单位：</label>
				</li>
				<li class=" animated fadeInRight">
					<input type="text" id="tel" placeholder="" class="text_r">
					<label class="puff_left">联系电话：</label>
				</li>
				<li class=" animated fadeInRight">
					<input type="text" id="bzqk" placeholder="" class="text_r">
					<label class="puff_left">入会后申请补助情况：</label>
				</li>
				<li class=" animated fadeInRight">
					<input type="text" id="hzjb" placeholder="" class="text_r">

					<label class="puff_left">患何种疾病：</label>
				</li>

				<li class=" animated fadeInRight">
					<input type="text" id="zyje" placeholder="" class="text_r">
					<label class="puff_left">本年度住院医疗费总金额：</label>
				</li>

			</ul>
		</div>
	</div>
	<div class="id_bth inersest_bth animated bounceIn">
		<a href="javascript:void(0);" onclick="dbjz_apply_sumbit()">提 交</a>
	</div>
</div>
<script type="text/javascript">
    rdcp.ready(function(){});
    var name = "<%=member.getName()%>";
    var account = "<%=member.getAccount()%>";
    var gh = "<%=member.getGh()%>";
    $("#name").val(name);
    $("#account").val(account);
    $("#gh").val(gh);

    function dbjz_apply_sumbit() {
        var tel = $("#tel").val();
        var bzqk = $("#bzqk").val();
        var hzjb = $("#hzjb").val();
        var zyje = $("#zyje").val();
        if(tel == null || tel == ""){
            $.messager.alert("提示","请输入联系电话","info");
            return;
        }
        if(hzjb == null || hzjb == ""){
            $.messager.alert("提示","请填写患何种疾病","info");
            return;
        }
        if(zyje == null || zyje == ""){
            $.messager.alert("提示","请填写本年度住院医疗费总金额","info");
            return;
        }
        rdcp.request("!gh/wechat/~java/Dbjz.dbjzApply",{"username":name,"number":account,"titleory":gh,"telueuid":tel,"bzqkstemio":bzqk,"hhzjbntnal":hzjb,"zfjeriptio":zyje},function(data){
            if(data.header.code == 0)
			{
			    $.messager.alert("提示","大病救助申请成功，等待审核！","info",function () {
                    window.location.href="!gh/wechat/~/pages/dbjz/index.jsp";
                });
			}
    });



    }
</script>
</body>
</html>