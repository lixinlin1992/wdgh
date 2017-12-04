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
	<title>择友条件</title>
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
  var code_key = "'org','marriage_state','degree'";
  rdcp.request("!gh/wechat/~java/YftkAction.getCodes",{"code_key":code_key},function(data){
    codes = data;
    rdcp.form.load("user_form","!gh/wechat/~java/YftkAction.getFriendCondition",{"user_id":user_id},function(data){
      t = data.body;
      for(var i=0;i<codes.length;i++){
        var d = codes.codes[i];
        if(d.code_type=="org"&&d.code==t.org){
          //$("#department").val(d.code_value+$("#department").val());
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
  initAgeSelect();
  initHeightSelect();
  initBasicSelect("org");
  initBasicSelect("marriage_state");
  initBasicSelect("degree");
}
function initBasicSelect(id){
   var temp = defaultopt;
   var defaultVal = $("#"+id).val();
   var text;
   defaultopt.mode = "Basic usage";
   defaultopt.labels = ['请选择'];
   defaultopt.placeholder = '不限';
   defaultopt.defaultValue = [defaultVal];
   defaultopt.onSet = function(event, inst){
     var t = inst.settings.anchor[0].id;
     var ul = t.replace("_dummy","");
     var input = ul.replace("_ul","");
     var temp = $("#"+ul).find("li[data-val='"+event.valueText+"']").html();
     $("#"+t).val(temp);
     $("#"+input).val(event.valueText);
   };
   $("#"+id+"_ul").append("<li data-val=''>不限</li>");
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
function initAgeSelect(){
  var min_age = $("#min_age").val();
  var max_age = $("#max_age").val();
  var temp = defaultopt;
  var text;
  defaultopt.mode = "Basic usage";
  defaultopt.labels = ['请选择'];
  defaultopt.placeholder = '不限';
  defaultopt.defaultValue = [min_age];
  defaultopt.onSet = function(event, inst){
    var t = inst.settings.anchor[0].id;
    var ul = t.replace("_dummy","");
    var input = ul.replace("_ul","");
    var temp = $("#"+ul).find("li[data-val='"+event.valueText+"']").html();
    $("#"+t).val(temp);
    $("#"+input).val(event.valueText);
  };
  $("#min_age_ul").append("<li data-val=''>不限</li>");
  $("#max_age_ul").append("<li data-val=''>不限</li>");
  for(var i=18;i<=99;i++){
     var html = "<li data-val='"+i+"'>"+i+"</li>";
     $("#min_age_ul").append(html);
     $("#max_age_ul").append(html);
  }
  $("#min_age_ul").mobiscroll().treelist(defaultopt);
  $("#min_age_ul_dummy").val(min_age);
  defaultopt.defaultValue = [max_age];
  $("#max_age_ul").mobiscroll().treelist(defaultopt);
  $("#max_age_ul_dummy").val(max_age);
}
function initHeightSelect(){
  var min_height = $("#min_height").val()+"CM";
  var max_height = $("#max_height").val()+"CM";
  var temp = defaultopt;
  var text;
  defaultopt.mode = "Basic usage";
  defaultopt.labels = ['请选择'];
  defaultopt.placeholder = '不限';
  defaultopt.defaultValue = [min_height];
  defaultopt.onSet = function(event, inst){
    var t = inst.settings.anchor[0].id;
    var ul = t.replace("_dummy","");
    var input = ul.replace("_ul","");
    var temp = $("#"+ul).find("li[data-val='"+event.valueText+"']").html();
    $("#"+t).val(temp);
    $("#"+input).val(event.valueText);
  };
  $("#min_height_ul").append("<li data-val=''>不限</li>");
  $("#max_height_ul").append("<li data-val=''>不限</li>");
  for(var i=145;i<=195;i++){
     var html = "<li data-val='"+i+"'>"+i+"CM</li>";
     $("#min_height_ul").append(html);
     $("#max_height_ul").append(html);
  }
  $("#min_height_ul").mobiscroll().treelist(defaultopt);
  $("#min_height_ul_dummy").val(min_height);
  defaultopt.defaultValue = [max_height];
  $("#max_height_ul").mobiscroll().treelist(defaultopt);
  $("#max_height_ul_dummy").val(max_height);
}
function updateFriendCondition(){
  var str = "{";
  $.each(t, function (n, value) {
      var temp = $("#"+n).val()==undefined?"":$("#"+n).val();
      str += "\""+n+"\":\""+temp+"\",";
  });
  str = str.substring(0,str.length-1);
  str += "}";
  alert(str);
  rdcp.request("!gh/wechat/~java/YftkAction.updateFriendCondition",{"friendCondition":str},function(data){
    if(data.header.code=="0"){
      alert("修改成功!");
      window.location.href = "!gh/wechat/~/pages/yftk/U_center.jsp";
    }
    else{
      alert("修改失败!");
    }
  });
}
</script>
<body class="g-jbzl">
<div class="warpe">
    <div class="head">
        <a href="javascript:;" class="return"><i class="icon-chevron-left"></i>返回</a>
        择友条件
  </div>
    <from id="user_form" name="user_form">
        <input type="hidden" id="user_id" name="uesr_id" value="<%=user_id%>"/>
        <input type="hidden" id="id" name="id"/>
        <div class="part part2">
            <ul>
                 <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">年龄下限：</label>
                    <input type="hidden" id="min_age" name="min_age"/>
                    <input type="text" id="min_age_ul_dummy" value="" readonly=""/>
                    <ul id="min_age_ul" style="display:none" class="mbsc-comp" type=""></ul>
                </li>
                <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">年龄上限：</label>
                    <input type="hidden" id="max_age" name="max_age"/>
                    <input type="text" id="max_age_ul_dummy" value="" readonly=""/>
                    <ul id="max_age_ul" style="display:none" class="mbsc-comp" type=""></ul>
                </li>
                <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">身高下限：</label>
                    <input type="hidden" id="min_height" name="min_height"/>
                    <input type="text" id="min_height_ul_dummy" value="" readonly=""/>
                    <ul id="min_height_ul" style="display:none" class="mbsc-comp" type=""></ul>
                </li>
                <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">身高上限：</label>
                    <input type="hidden" id="max_height" name="max_height"/>
                    <input type="text" id="max_height_ul_dummy" value="" readonly=""/>
                    <ul id="max_height_ul" style="display:none" class="mbsc-comp" type=""></ul>
                </li>
                <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">单位：</label>
                    <input type="hidden" id="org" name="org"/>
                    <input type="text" id="org_ul_dummy" value="" readonly=""/>
                    <ul id="org_ul" style="display:none" class="mbsc-comp" type=""></ul>
                </li>
                <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">婚姻状况：</label>
                    <input type="hidden" id="marriage_state" name="marriage_state"/>
                    <input type="text" id="marriage_state_ul_dummy" value="" readonly=""/>
                    <ul id="marriage_state_ul" style="display:none" class="mbsc-comp" type="">
                    </ul>
                </li>
                <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">学历：</label>
                    <input type="hidden" id="degree" name="degree"/>
                    <input type="text" id="degree_ul_dummy" value="" readonly=""/>
                    <ul id="degree_ul" style="display:none" class="mbsc-comp" type="">
                    </ul>
                </li>
                <li class="animated bounceInRight">
                    <label class="puff_left">民族：</label>
                    <input type="text" id="nation" placeholder="点击输入" name="nation" class=""/>
                </li>
                <li class="animated bounceInLeft clear_border">
                    <label class="puff_left">籍贯：</label>
                    <input type="text" id="hometown" placeholder="点击输入" name="hometown" class=""/>
                </li>
            </ul>
        </div>
    </form>
    <div class="id_bth inersest_bth animated bounceIn">
        <a href="javascript:void(0);" onclick="updateFriendCondition();">保存</a>
    </div>
</div>
</body>
</html>