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
	<title>登录</title>
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
var t;
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
  var code_key = "'degree','marriage_state','province','city','area','marriage_time','emp_type','salary','house','car','friend_status','org'";
  rdcp.request("!gh/wechat/~java/YftkAction.getCodes",{"code_key":code_key},function(data){
    codes = data;
    rdcp.form.load("user_form","!gh/wechat/~java/YftkAction.getUserInfo2",{"user_id":user_id},function(data){
      t = data.body;
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
      }
      initSelect();
    });
  });
  $(".return").click(function(){
    history.back(-2);
  });
},rdcp.defaultLoadModules2);
function initSelect(){
  initBasicSelect("degree");
  initBasicSelect("marriage_state");
  initHeightSelect();
  initBasicSelect("marriage_time");
  initBasicSelect("emp_type");
  initBasicSelect("salary");
  initBasicSelect("house");
  initBasicSelect("car");
  initBasicSelect("friend_status");
  initTreeSelect("hometown");
}
function initBasicSelect(id){
   var temp = defaultopt;
   var defaultVal = $("#"+id).val();
   var text;
   defaultopt.mode = "Basic usage";
   defaultopt.labels = ['请选择'];
   defaultopt.defaultValue = [defaultVal];
   defaultopt.onSet = function(event, inst){
     var t = inst.settings.anchor[0].id;
     var ul = t.replace("_dummy","");
     var input = ul.replace("_ul","");
     var temp = $("#"+ul).find("li[data-val='"+event.valueText+"']").html();
     $("#"+t).val(temp);
     $("#"+input).val(event.valueText);
   };
   for(var i=0;i<codes.length;i++){
     var html = "";
     var t = codes.codes[i];
     if(t.code_type==id){
        html += "<li data-val='"+t.code+"'>"+t.code_value+"</li>";
        $("#"+id+"_ul").append(html);
        if(t.code==defaultVal)
          text = t.code_value;
     }
   }
   $("#"+id+"_ul").mobiscroll().treelist(defaultopt);
   $("#"+id+"_ul_dummy").val(text);
}
function initTreeSelect(id){
  var temp = defaultopt;
  var input = $("#"+id).val();
  var defaultVal = new Array();
  defaultVal[2] = input;
  var text;

  var province,city,area;
  for(var i=0;i<codes.length;i++){
    var html = "";
    var t = codes.codes[i];
    if(t.code_type=="province"){
      html = "<li data-val='"+t.code+"'>"+t.code_value+"<ul id='province_"+t.code+"'></ul></li>";
      $("#"+id+"_ul").append(html);
    }
    if(t.code_type=="city"){
      html = "<li data-val='"+t.code+"'>"+t.code_value+"<ul id='city_"+t.code+"'></ul></li>";
      $("#province_"+t.parent_code).append(html);
    }
    if(t.code_type=="area"){
      html = "<li data-val='"+t.code+"'>"+t.code_value+"</li>";
      $("#city_"+t.parent_code).append(html);
      if(t.code==input){
        input = t.parent_code;
        area = t.code_value;
        defaultVal[1] = input;
      }
    }
  }
  for(var i=0;i<codes.length;i++){
    var t = codes.codes[i];
    if(t.code_type=="city"&&t.code==input){
      input = t.parent_code;
      city = t.code_value;
      defaultVal[0] = input;
    }
  }
  for(var i=0;i<codes.length;i++){
    var t = codes.codes[i];
    if(t.code_type=="province"&&t.code==input){
      province = t.code_value;
    }
  }
  defaultopt.mode = "listUnordered";
  defaultopt.labels = ['省','市','区'];
  defaultopt.defaultValue = defaultVal;
  defaultopt.onSet = function(event, inst){
    var t = inst.settings.anchor[0].id;
    var ul = t.replace("_dummy","");
    var input = ul.replace("_ul","");
    var vals = event.valueText.split(" ");
    var temp = "";
    for(var i=0;i<vals.length;i++){
       temp += $("#"+ul).find("li[data-val='"+vals[i]+"']").contents()[0].textContent;
    }
    $("#"+t).val(temp);
    $("#"+input).val(vals.pop());
  };
  $("#"+id+"_ul").mobiscroll().treelist(defaultopt);
  $("#"+id+"_ul_dummy").val(province+city+area);
}
function showSelect(id){
  $("#"+id+"_ul").mobiscroll("show");
}
function initHeightSelect(){
  var height = $("#height").val();
  var temp = defaultopt;
  var text;
  defaultopt.mode = "Basic usage";
  defaultopt.labels = ['请选择'];
  defaultopt.defaultValue = [height];
  defaultopt.onSet = function(event, inst){
    var t = inst.settings.anchor[0].id;
    var ul = t.replace("_dummy","");
    var input = ul.replace("_ul","");
    var temp = $("#"+ul).find("li[data-val='"+event.valueText+"']").html();
    $("#"+t).val(temp);
    $("#"+input).val(event.valueText);
  };
  for(var i=150;i<=190;i++){
     var html = "<li data-val='"+i+"'>"+i+"</li>";
     $("#height_ul").append(html);
  }
  $("#height_ul").mobiscroll().treelist(defaultopt);
  $("#height_ul_dummy").val(height);
}
function updateUserInfo(){
  var str = "{";
  $.each(t, function (n, value) {
    if(n!="is_effective"&&n!="org"){
      var temp = $("#"+n).val()==undefined?"":$("#"+n).val();
      str += "\""+n+"\":\""+temp+"\",";
    }
  });
  str = str.substring(0,str.length-1);
  str += "}";
  rdcp.request("!gh/wechat/~java/YftkAction.updateUserInfo",{"userInfo":str},function(data){
    if(data.header.code=="0"){
      alert("资料修改成功!");
      window.location.href = "!gh/wechat/~/pages/yftk/U_center.jsp";
    }
    else{
      alert("资料修改失败!");
    }
  });
}
</script>
<body class="g-jbzl">
<div class="warpe">
    <div class="head">
        <a href="javascript:;" class="return"><i class="icon-chevron-left"></i>返回</a>
        资料修改
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
                    <input type="text" id="nation" placeholder="点击输入" name="nation" class=""/>
                </li>
                <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">工作单位：</label>
                    <input type="text" id="department" placeholder="点击输入" name="department" class="" readonly=""/>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">身高：</label>
                    <input type="hidden" id="height" name="height"/>
                    <input type="text" id="height_ul_dummy" value="" readonly=""/>
                    <ul id="height_ul" style="display:none" class="mbsc-comp" type="">
                    </ul>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">学历：</label>
                    <input type="hidden" id="degree" name="degree"/>
                    <input type="text" id="degree_ul_dummy" value="" readonly=""/>
                    <ul id="degree_ul" style="display:none" class="mbsc-comp" type="">
                    </ul>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">婚姻状况：</label>
                    <input type="hidden" id="marriage_state" name="marriage_state"/>
                    <input type="text" id="marriage_state_ul_dummy" value="" readonly=""/>
                    <ul id="marriage_state_ul" style="display:none" class="mbsc-comp" type="">
                    </ul>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">籍贯：</label>
                    <input type="hidden" id="hometown" name="hometown"/>
                    <input type="text" id="hometown_ul_dummy" value="" readonly=""/>
                    <ul id="hometown_ul" style="display:none" class="mbsc-comp" type="">
                    </ul>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">何时结婚：</label>
                    <input type="hidden" id="marriage_time" name="marriage_time"/>
                    <input type="text" id="marriage_time_ul_dummy" value="" readonly=""/>
                    <ul id="marriage_time_ul" style="display:none" class="mbsc-comp" type="">
                    </ul>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">职业类别：</label>
                    <input type="hidden" id="emp_type" name="emp_type"/>
                    <input type="text" id="emp_type_ul_dummy" value="" readonly=""/>
                    <ul id="emp_type_ul" style="display:none" class="mbsc-comp" type="">
                    </ul>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">月薪：</label>
                    <input type="hidden" id="salary" name="salary"/>
                    <input type="text" id="salary_ul_dummy" value="" readonly=""/>
                    <ul id="salary_ul" style="display:none" class="mbsc-comp" type="">
                    </ul>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">购房情况：</label>
                    <input type="hidden" id="house" name="house"/>
                    <input type="text" id="house_ul_dummy" value="" readonly=""/>
                    <ul id="house_ul" style="display:none" class="mbsc-comp" type="">
                    </ul>
                </li>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">购车情况：</label>
                    <input type="hidden" id="car" name="car"/>
                    <input type="text" id="car_ul_dummy" value="" readonly=""/>
                    <ul id="car_ul" style="display:none" class="mbsc-comp" type="">
                    </ul>
                </li>
                <li class="animated bounceInLeft clear_border">
                   <label class="puff_left">征友状态：</label>
                   <input type="hidden" id="friend_status" name="friend_status"/>
                   <input type="text" id="friend_status_ul_dummy" value="" readonly=""/>
                   <ul id="friend_status_ul" style="display:none" class="mbsc-comp" type="">
                   </ul>
                </li>
            </ul>
        </div>
        <div class="inter_add">
              <ul>
              <li class="animated bounceInLeft clear_border">
                 <span class="puff_left">真实姓名：</span>
                 <input type="hidden" name="real_name" readonly=""/>
                 <span class="puff_right" id="real_name" ><font></font></span>
              </li>
              <li class="animated bounceInLeft clear_border">
                 <span class="puff_left">邮箱：</span>
                 <input type="hidden" name="email" readonly=""/>
                 <span class="puff_right" id="email"><font></font></span>
              </li>
              <li class="animated bounceInLeft clear_border">
                 <label class="puff_left">手机号：</label>
                 <input type="hidden" name="phone" readonly=""/>
                 <span class="puff_right" id="phone"><font></font></span>
              </li>
              <li class="animated bounceInLeft clear_border">
                <label class="puff_left">QQ：</label>
                <input type="hidden" name="qq" readonly=""/>
                <span class="puff_right" id="qq"><font></font></span>
              </li>
            </ul>
            <p>提示：真实姓名、邮箱、手机号、QQ 四项信息我们会为您保密,不会显示在您的个人资料页面上</p>
        </div>
    </form>
    <div class="id_bth inersest_bth animated bounceIn">
        <a href="javascript:void(0);" onclick="updateUserInfo();">保存</a>
    </div>
</div>
</body>
</html>