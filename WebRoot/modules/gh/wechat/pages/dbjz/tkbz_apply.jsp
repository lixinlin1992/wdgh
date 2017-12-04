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
	<title>特困补助</title>
	<link href="!gh/wechat/~/css/main.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/style.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/shake.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
	<script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
	<script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
<%--
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="com.bean.DbjzMember" %>
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
		<title>特困补助</title>
		<link href="!gh/wechat/~/css/main.css" rel="stylesheet" type="text/css">
		<link href="!gh/wechat/~/css/style.css" rel="stylesheet" type="text/css">
		<link href="!gh/wechat/~/css/shake.css" rel="stylesheet" type="text/css">
		<link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
		<link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">
		<link href="!gh/wechat/~/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
		<script type="text/javascript" src="!gh/wechat/~/js/jquery-1.8.3.min.js"></script>
		<script type="text/javascript" src="!gh/wechat/~/js/wo.js"></script>
		<script type="text/javascript" src="!gh/wechat/~/js/idangerous.swiper.min.js"></script>
--%>
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
					<input type="text" id="name" placeholder="" class="text_r">
					<label class="puff_left">姓名：</label>
				</li>
				<li class="animated fadeInLeft">
					<div class="radio_bth">
						<label><input type="radio" name="radio" checked>男</label>
						<label><input type="radio" name="radio">女</label>
					</div>
					<label class="puff_left">性别：</label>
				</li>
				<li class="animated fadeInLeft">
					<input type="text" id ="birthday"placeholder="" class="text_r">
					<label class="puff_left">出生年月：</label>
				</li>
				<li class="animated fadeInLeft">
					<input type="text" id="zwzc"placeholder="" class="text_r">
					<label class="puff_left">职务职称：</label>
				</li>
				<li class="animated fadeInLeft">
					<input type="text" id="bysr"placeholder="" class="text_r">
					<label class="puff_left">本人月收入：</label>
				</li>
				<li class="animated fadeInLeft">
					<input type="text" id="jtcy"placeholder="" class="text_r">
					<label class="puff_left">家庭人员：</label>
				</li>
				<li class="animated fadeInLeft">
					<input type="text" id="poxm"placeholder="" class="text_r">
					<label class="puff_left">配偶姓名：</label>
				</li>
				<li class="animated fadeInLeft">
					<input type="text" id="poysr"placeholder="" class="text_r">
					<label class="puff_left">配偶月收入：</label>
				</li>
				<li class="animated fadeInLeft">
					<input type="text" id="jtzsr"placeholder="" class="text_r">
					<label class="puff_left">家庭总收入：</label>
				</li>
				<li class="animated fadeInLeft">
					<input type="text" id="pozwzc" placeholder="" class="text_r">
					<label class="puff_left">配偶职务职称：</label>
				</li>
				<li class="animated fadeInLeft">
					<input type="text" id="pogzdw"placeholder="" class="text_r">
					<label class="puff_left">配偶工作单位：</label>
				</li>
				<li class="animated fadeInLeft">
					<input type="text" id="address"placeholder="" class="text_r">
					<label class="puff_left">家庭住址：</label>
				</li>

				<li class=" animated fadeInRight">
					<input type="text" id="tel"placeholder="" class="text_r">
					<label class="puff_left">联系电话：</label>
				</li>
				<li class="animated fadeInLeft">
					<input type="text" id="bzqk"placeholder="" class="text_r">
					<label class="puff_left">近年补助情况：</label>
				</li>
				<li class="animated fadeInLeft">
					<input type="text" id="content"placeholder="" class="text_r">
					<label class="puff_left">生活致困情况：</label>
				</li>


			</ul>
		</div>
	</div>
	<div class="id_bth inersest_bth animated bounceIn">
		<a href="javascript:void(0);" onclick="tkbz_apply_sumbit()">提 交</a>
	</div>
</div>
<script type="text/javascript">
    rdcp.ready(function(){});
    var name = "<%=member.getName()%>";
    var account = "<%=member.getAccount()%>";
    var gh= "<%=member.getGh()%>";
    var sex = "<%=member.getSex()%>";
    $("#name").val(name);


    function tkbz_apply_sumbit() {
        var birthday = $("#birthday").val();
        var zwzc = $("#zwzc").val();
        var bysr = $("#bysr").val();
        var jtcy = $("#jtcy").val();
        var poxm = $("#poxm").val();
        var poysr = $("#poysr").val();
        var jtzsr = $("#jtzsr").val();
        var pozwzc = $("#pozwzc").val();
        var pogzdw = $("#pogzdw").val();
        var address = $("#address").val();
        var tel = $("#tel").val();

        var bzqk = $("#bzqk").val();
        var content = $("#content").val();
        if(birthday == null || birthday == "") {
            $.messager.alert("提示", "请输入出生年月", "info");
            return;
        }
        if(zwzc == null || zwzc == "") {
            $.messager.alert("提示", "请输入职务职称", "info");
            return;
        }if(bysr == null || bysr == "") {
            $.messager.alert("提示", "请输入本人月收入", "info");
            return;
        }if(jtcy== null || jtcy == "") {
            $.messager.alert("提示", "请输入家庭人员", "info");
            return;
        }
        if(poxm == null || poxm == "") {
            $.messager.alert("提示", "请输入配偶姓名", "info");
            return;
        }if(poysr == null || poysr == "") {
            $.messager.alert("提示", "请输入配偶月收入", "info");
            return;
        }if(jtzsr == null || jtzsr == "") {
            $.messager.alert("提示", "请输入家庭总收入", "info");
            return;
        }if(pozwzc == null || pozwzc == "") {
            $.messager.alert("提示", "请输入配偶职务职称", "info");
            return;
        }if(pogzdw == null || pogzdw == "") {
            $.messager.alert("提示", "请输入配偶工作单位", "info");
            return;
        }if(address== null || address == "") {
            $.messager.alert("提示", "请输入家庭住址", "info");
            return;
        }
        if(tel == null || tel == "") {
            $.messager.alert("提示", "请输入联系电话", "info");
            return;
        }
        if(bzqk == null || bzqk == "") {
            $.messager.alert("提示", "请输入近年补助情况", "info");
            return;
        }if(content == null || content== "") {
            $.messager.alert("提示", "请输入生活致困情况", "info");
            return;
        }

        var birthday = $("#birthday").val();
        var zwzc = $("#zwzc").val();
        var bysr = $("#bysr").val();
        var jtcy = $("#jtcy").val();
        var poxm = $("#poxm").val();
        var poysr = $("#poysr").val();
        var jtzsr = $("#jtzsr").val();
        var pozwzc = $("#pozwzc").val();
        var pogzdw = $("#pogzdw").val();
        var address = $("#address").val();
        var tel = $("#tel").val();
        var bzqk = $("#bzqk").val();
        var content = $("#content").val();
        rdcp.request("!gh/wechat/~java/Dbjz.tkbzApply",{"name":name,"number":account,"gh":gh,"sex":sex,"birthday":birthday,"zwzc":zwzc,"bysr":bysr,"jtcy":jtcy,"poxm":poxm,"poysr":poysr,"jtzsr":jtzsr,"pozwzc":pozwzc,"pogzdw":pogzdw,"address":address,"tel":tel,"bzqk":bzqk,"content":content},function(data){
            if(data.header.code == 0)
			{
			    $.messager.alert("提示","特困补助申请成功，等待审核！","info" ,function () {
                    window.location.href="!gh/wechat/~/pages/dbjz/index.jsp";
                });
			}
    });



    }
</script>
</body>
</html>