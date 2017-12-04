<%--
  Created by IntelliJ IDEA.
  User: sunjiaxin
  Date: 2017/7/1
  Time: 10:32
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>发现缘分</title>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <script type="text/javascript" src="!gh/wechat/~/scripts/Y-search.js"></script>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
    <link href="!gh/wechat/css/main.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/style.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/shake.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/animate.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="!gh/wechat/js/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="!gh/wechat/js/wo.js"></script>
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
<r:include resource="!comm/~/pages/commOrg.jsp"/>
<body class="g-yftk">
<div class="warpe">
    <div class="reveal-modal-bg dis_none"></div>
    <div class="head">
        <a href="!gh/wechat/~/pages/phfw.jsp" class="return1"><i class="icon-chevron-left"></i> 返回</a>
        发现缘分
    </div>
    <div class="I_div">
        <div class="inter_add">
            <ul>
                <li class="animated bounceInRight">

                    <span class="puff_left">性别</span>
                    <span class="puff_right">
                        <select id="gender" name="gender">
                            <option value="-1">全部</option>
                            <option value="1">男</option>
                            <option value="0">女</option>
                        </select>
                    </span>
                </li>
                <li class="animated bounceInRight">
                    <span class="puff_left">身高</span>
                    <span class="puff_right">
                        <select id="height" name="select-sg">
                            <option value="-1">全部</option>
                            <option value="1">1.5m~1.7m</option>
                            <option value="2">1.7m~1.8m</option>
                            <option value="3">1.8m以上</option>
                        </select>
                    </span>
                </li>
                <li class="animated bounceInLeft">
                    <span class="puff_left">年龄</span>
                    <span class="puff_right">
                        <select id="age" name="select-age">
                            <option value="-1">全部</option>
                            <option value="1">20岁~25岁</option>
                            <option value="2">25岁~28岁</option>
                            <option value="3">28岁~30岁</option>
                        </select>
                    </span>
                </li>
                <li class="animated bounceInRight">
                    <span class="puff_left">婚姻状况</span>
                    <span class="puff_right">
                        <select id="marriageState" name="marriageState">
                            <option value="-1">全部</option>
                            <option value="1">未婚</option>
                            <option value="2">离婚</option>
                            <option value="3">丧偶</option>
                        </select>
                    </span>
                </li>
                <li class="animated bounceInLeft" style="border-bottom:none;">
                    <span class="puff_left">所在地区</span>
                    <span class="puff_right">
                        <select id="province" name="s_province"><option value="-1">全部</option></select>
                    </span>
                </li>
            </ul>
        </div>
    </div>
    <div class="I_div">
        <div class="inter_add">
            <ul>
                <li class="animated bounceInLeft">
                    <span class="puff_left">学历</span>
                    <span class="puff_right">
                        <select id="degree" name="select-xueli">
                            <option value="-1">全部</option>
                        </select>
                    </span>
                </li>
                <li class="animated bounceInRight" style="border-bottom:none;">
                    <span class="puff_left">所在学校</span>
                    <span class="puff_right">
                        <select id="org" name="select-xx">
                            <option value="-1">全部</option>
                        </select>
                    </span>
                </li>
            </ul>
        </div>
    </div>
    <div class="I_div">
        <div class="id_bth inersest_bth animated bounceIn" style="margin-top: 2rem;">
            <p><a href="javascript:void(0);" onclick="searchFate()" >搜索</a></p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
        </div>

    </div>
    <footer class="g-yftk-footer">
        <div class="tabs my_tab3">
            <a href="javascript:void(0);" hidefocus="true" class="active">
                <p class="g-yftk-icon"><i class="g-yftk-icon1"></i></p>
                <p>发现缘分</p>
            </a>

            <a href="!gh/wechat/~/pages/yftk/Y_activity.jsp" hidefocus="true">

                <p class="g-yftk-icon"><i class="g-yftk-icon2"></i></p>
                <p>交友活动</p>
            </a>
            <a href="!gh/wechat/~/pages/yftk/U_center.jsp" hidefocus="true">
                <p class="g-yftk-icon"><i class="g-yftk-icon3"></i></p>
                <p>个人中心</p>
            </a>
        </div>
    </footer>

    <script type="text/javascript" src="!gh/wechat/js/idangerous.swiper.min.js"></script>

</div>
<script type="text/javascript">
    rdcp.ready(function() {
        rdcp.request("!gh/wechat/~java/Yftk.getDistricts", {}, function (data) {
            var p = data.body.rows;
            for (var i = 0; i < p.length; i++) {
                var html = "<option value='" + p[i].id + "'>" + p[i].name + "</option>";
                $("#province").append(html);
            }
        });

        rdcp.request("!gh/wechat/~java/Yftk.getParamCodes", {}, function (data) {
            var p = data.body.rows;
            for (var i = 0; i < p.length; i++) {
                var html = "<option value='" + p[i].code + "'>" + p[i].codeValue + "</option>";
                $("#" + p[i].codeType).append(html);
            }
        });
    });
</script>
</body>
</html>
