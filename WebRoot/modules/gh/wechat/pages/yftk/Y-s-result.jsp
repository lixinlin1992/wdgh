<%--
  Created by IntelliJ IDEA.
  User: sunjiaxin
  Date: 2017/7/2
  Time: 11:35
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>搜索结果</title>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <script type="text/javascript" src="!gh/wechat/~/scripts/Y-s-result.js"></script>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
    <link href="!gh/wechat/css/main.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/style.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/shake.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/animate.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="!gh/wechat/js/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="!gh/wechat/js/wo.js"></script>
    <%
        String gender = request.getParameter("gender");
        String marriageState = request.getParameter("marriageState");
        String height = request.getParameter("height");
        String age = request.getParameter("age");
        String province = request.getParameter("province");
        String degree = request.getParameter("degree");
        String org = request.getParameter("org");
    %>
    <input type="hidden" id="gender" value=<%=gender%>>
    <input type="hidden" id="marriageState" value=<%=marriageState%>>
    <input type="hidden" id="height" value=<%=height%>>
    <input type="hidden" id="age" value=<%=age%>>
    <input type="hidden" id="province" value=<%=province%>>
    <input type="hidden" id="degree" value=<%=degree%>>
    <input type="hidden" id="org" value=<%=org%>>
</head>

<div class="warpe">
    <div class="head">
        <a href="javascript:void(0);" class="return"><i class="icon-chevron-left"></i> 返回</a>
        搜索结果
    </div>
    <div class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide">
                <div class="content-slide" id="result">


                </div>
            </div>

        </div>
    </div>
</div>
<script type="text/javascript" src="!gh/wechat/js/idangerous.swiper.min.js"></script>
</html>
