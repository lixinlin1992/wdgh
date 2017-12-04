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
    int user_id = user.getUser_id();
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
	<title>基本资料</title>
	<link href="!gh/wechat/~/css/main.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/style.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/shake.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/datetime/mobiscroll.custom-3.0.0.min.css" rel="stylesheet" type="text/css">
	<!--<link href="!gh/wechat/~/css/datetime/bootstrap.css" rel="stylesheet" type="text/css">-->
	<script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
    <script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
    <script type="text/javascript" src="!gh/wechat/~/js/datetime/mobiscroll.custom-3.0.0.min.js"></script>
    <!--<r:include resource="!gh/wechat/~/pages/base/datetime.jsp"/>-->
</head>
<script type="text/javascript">
var user_id = <%=user_id%>;
var codes;
var defaultopt = {
     theme: "android-holo",
     lang: "zh",
     display: "bottom",
     mode: "",
     width: [90, 160, 170],
     placeholder: '点击选择',
     defaultValue:[],
     labels: [],
     onSet:null
};
rdcp.ready(function(){
  rdcp.request("!gh/wechat/~java/YftkAction.getCodes",{},function(data){
    codes = data;
    rdcp.form.load("user_form","!gh/wechat/~java/YftkAction.getUserInfo2",{"user_id":user_id},function(data){
      var t = data.body;
      var hometown = t.hometown;
      var province,city,area;
      $("#gender_ul_dummy").val(t.gender=="1"?"男":"女");
      $("#real_name").append(t.real_name);
      $("#email").append(t.email);
      $("#phone").append(t.phone);
      $("#qq").append(t.qq);
      for(var i=0;i<codes.length;i++){
        var d = codes.codes[i];
        if(d.code_type=="org"&&d.code==t.org){
         $("#department").val(d.code_value+$("#department").val());
        }
        if(d.code_type=="degree"&&d.code==t.degree){
         $("#degree").val(d.code_value);
        }
        if(d.code_type=="marriage_state"&&d.code==t.marriage_state){
         $("#marriage_state").val(d.code_value);
        }
        if(d.code_type=="marriage_time"&&d.code==t.marriage_time){
         $("#marriage_time").val(d.code_value);
        }
        if(d.code_type=="emp_type"&&d.code==t.emp_type){
         $("#emp_type").val(d.code_value);
        }
        if(d.code_type=="salary"&&d.code==t.salary){
         $("#salary").val(d.code_value);
        }
        if(d.code_type=="house"&&d.code==t.house){
         $("#house").val(d.code_value);
        }
        if(d.code_type=="car"&&d.code==t.car){
         $("#car").val(d.code_value);
        }
        if(d.code_type=="friend_status"&&d.code==t.friend_status){
         $("#friend_status").val(d.code_value);
        }
        if(d.code_type=="friend_status"&&d.code==t.friend_status){
         $("#friend_status").val(d.code_value);
        }
        if(d.code_type=="area"&&d.code==hometown){
          area = d.code_value;
          hometown = d.parent_code;
        }
      }
      for(var i=0;i<codes.length;i++){
        var d = codes.codes[i];
        if(d.code_type=="city"&&d.code==hometown){
          city = d.code_value;
          hometown = d.parent_code;
        }
      }
      for(var i=0;i<codes.length;i++){
        var d = codes.codes[i];
        if(d.code_type=="province"&&d.code==hometown){
          province = d.code_value;
          $("#hometown").val(province+city+area);
        }
      }
    });
  });
  $(".return").click(function(){
      history.back(-2);
  });
},rdcp.defaultLoadModules2);
</script>
<body class="g-jbzl">
<div class="warpe">
    <div class="head">
        <a href="javascript:void(0);" class="return"><i class="icon-chevron-left"></i>返回</a>
        基本资料
         <a href="!gh/wechat/~/pages/yftk/U_useredit.jsp" class="search animated fadeInRight" style="font-size: 1.4rem;">编辑</a>
  </div>
    <from id="user_form" name="user_form">
        <input type="hidden" id="user_id" name="uesr_id" value="<%=user_id%>"/>
        <div class="part part2">
            <ul>
                <li>
                    <input type="text" id="nick_name" name="nick_name" readonly=""/>
                    <label class="puff_left">昵称：</label>
                </li>
                <li>
                    <label class="puff_left">性别：</label>
                    <input type="hidden" id="gender" name="gender" class="" readonly="">
                    <input type="text" id="gender_ul_dummy" value="" readonly=""/>
                </li>
                <li class="animated bounceInLeft">
                    <label class="puff_left">出生日期：</label>
                    <input type="text" id="birthday" name="birthday" readonly=""/>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">生肖：</label>
                    <input type="text" id="sx" name="sx" readonly=""/>
                </li>
                <li class="animated bounceInRight">
                    <label class="puff_left">民族：</label>
                    <input type="text" id="nation" name="nation" readonly=""/>
                </li>
                <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">工作单位：</label>
                    <input type="text" id="department" name="department" readonly=""/>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">身高：</label>
                    <input type="text" id="height" name="height" readonly=""/>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">学历：</label>
                    <input type="text" id="degree" name="degree" readonly=""/>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">婚姻状况：</label>
                    <input type="text" id="marriage_state" name="marriage_state" readonly=""/>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">籍贯：</label>
                    <input type="text" id="hometown" name="hometown" readonly=""/>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">何时结婚：</label>
                    <input type="text" id="marriage_time" name="marriage_time" readonly=""/>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">职业类别：</label>
                    <input type="text" id="emp_type" name="emp_type" readonly=""/>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">月薪：</label>
                    <input type="text" id="salary" name="salary" readonly=""/>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">购房情况：</label>
                    <input type="text" id="house" name="house" readonly=""/>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">购车情况：</label>
                    <input type="text" id="car" name="car" readonly=""/>
                </li>
                <li class="animated bounceInLeft clear_border">
                   <label class="puff_left">征友状态：</label>
                   <input type="text" id="friend_status" name="friend_status" readonly=""/>
            </ul>
        </div>
        <div class="inter_add">
              <ul>
              <li class="animated bounceInLeft clear_border">
                 <span class="puff_left">真实姓名：</span>
                 <span class="puff_right" id="real_name" ><font></font></span>
              </li>
              <li class="animated bounceInLeft clear_border">
                 <span class="puff_left">邮箱：</span>
                 <span class="puff_right" id="email"><font></font></span>
              </li>
              <li class="animated bounceInLeft clear_border">
                 <label class="puff_left">手机号：</label>
                 <span class="puff_right" id="phone"><font></font></span>
              </li>
              <li class="animated bounceInLeft clear_border">
                <label class="puff_left">QQ：</label>
                <span class="puff_right" id="qq"><font></font></span>
              </li>
            </ul>
        </div>
        <div class="id_bth inersest_bth animated bounceIn">
            <p><a href="javascript:void(0);" onclick=" ">保存</a></p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
        </div>
    </form>
</div>
</body>
</html>