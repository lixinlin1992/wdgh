<%--
  Created by IntelliJ IDEA.
  User: sunjiaxin
  Date: 2017/7/2
  Time: 15:03
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <script type="text/javascript" src="!gh/wechat/~/scripts/yftk-user-detail.js"></script>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport"/>
    <title>基本信息</title>
    <link href="!gh/wechat/css/main.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/style.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/shake.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/animate.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="!gh/wechat/js/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="!gh/wechat/js/wo.js"></script>
    <%
        String userId = request.getParameter("userId");
    %>
    <input type="hidden" id="userId" value=<%=userId%>>
</head>
<body>
<div class="warpe">
    <div class="reveal-modal-bg dis_none"></div>
    <div class="navcenter dis_none">
        <ul>
            <li class="animated fadeInLeft margin_left">
                <a href="#">
                    <span><img src="!gh/wechat/img/icon_jb.png"></span>
                    <p>举报</p>
                </a>
            </li>
            <li class="animated fadeInRight">
                <a href="#">
                    <span><img src="!gh/wechat/img/icon_bj.png"></span>
                    <p>编辑</p>
                </a>
            </li>
            <li class="animated fadeInLeft">
                <a href="#" class="closed">
                    <span><img src="!gh/wechat/img/icon_gb.png"></span>
                    <p>关闭</p>
                </a>
            </li>
            <li class="animated fadeInRight">
                <a href="community_list.html">
                    <span><img src="!gh/wechat/img/icon_list.png"></span>
                    <p>人员列表</p>
                </a>
            </li>
        </ul>
    </div>
    <div class="head">
        <a href="javascript:void(0);" class="return"><i class="icon-chevron-left"></i> 返回</a>
        基本信息
    </div>
    <div class="main">
        <div class="postall margin_top clear_border">
            <div class="user-detail clearfix" sex="1" data_url="/u/104417033">
                <div class="left_content ">

                    <div class="vip_zx"></div>
                    <div class="qiangyuan_img" id="userImg" style="">

                </div>
            </div>
            <div class="right_content" id="note">


            </div>
        </div>
        <div class="group_txt" id="detail">

        </div>
        <div class="group_txt">
            <p><label>我的择友要求</label> <i class="icon-volume-down color_y"></i></p>
            <p class="animated fadeInLeft"><label class="color_g">性别：</label><span>女</span></p>
            <p class="animated fadeInLeft"><label class="color_g">年龄：</label><span>33岁</span></p>
            <p class="animated fadeInLeft"><label class="color_g">婚姻状态：</label><span>未婚</span></p>
            <p class="animated fadeInRight"><label class="color_g">所在单位：</label><span>武汉大学</span></p>
            <p class="animated fadeInLeft"><label class="color_g">籍贯：</label><span>湖北</span></p>
            <p class="animated fadeInRight"><label class="color_g">名族：</label><span>汉族</span></p>
            <p class="animated fadeInLeft"><label class="color_g">身高：</label><span>176厘米</span></p>
            <p class="animated fadeInRight"><label class="color_g">职业：</label><span>无</span></p>
            <p class="animated fadeInLeft"><label class="color_g">购车：</label><span>无</span></p>
            <p class="animated fadeInLeft"><label class="color_g">住房：</label><span>无</span></p>
        </div>
        <div class="id_bth inersest_bth animated bounceIn" style="margin-top: 2rem;">

            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
        </div>
    </div>
</div>


</div>

</body>
</html>
