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

    <link href="!gh/wechat/css/main.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/style.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/shake.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/animate.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="!gh/wechat/js/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="!gh/wechat/js/wo.js"></script>
</head>
<body class="g-yftk">
<div class="warpe">
    <div class="reveal-modal-bg dis_none"></div>
    <div class="head">
        <a href="PHFW.html" class="return"><i class="icon-chevron-left"></i> </a>
        发现缘分

    </div>
    <div class="I_div">

    </div>
    <div class="I_div">
        <div class="inter_add">
            <ul>

                <li class="animated bounceInRight">
                    <a href="#">
                        <span class="puff_left">性别</span>
                        <span class="puff_right">
                            <select id="select-sex" name="select-sex">
                                <option value="保密">保密</option>
                                <option value="男">男</option>
                                <option value="女">女</option>
                            </select>
                        </span>
                        <i class="icon-angle-right"></i>
                    </a>
                </li>

                <li class="animated bounceInRight">
                    <a href="#">
                        <span class="puff_left">身高</span>
                        <span class="puff_right">
                            <select id="select-sg" name="select-sg">
                                <option value="保密">保密</option>
                                <option value="1.5m~1.7m">1.5m~1.7m</option>
                                <option value="1.7m~1.8m">1.7m~1.7m</option>
                                <option value="1.8m以上">1.8m以上</option>
                            </select>
                        </span>
                        <i class="icon-angle-right"></i>
                    </a>
                </li>
                <li class="animated bounceInLeft">
                    <a href="#">
                        <span class="puff_left">年龄</span>
                        <span class="puff_right">
                            <select id="select-age" name="select-age">
                                <option value="保密">保密</option>
                                <option value="20岁~25岁">20岁~25岁</option>
                                <option value="25岁~28岁">25岁~28岁</option>
                                <option value="28岁~30岁">28岁~30岁</option>
                            </select>
                        </span>
                        <i class="icon-angle-right"></i>
                    </a>
                </li>
                <li class="animated bounceInRight">
                    <a href="#">
                        <span class="puff_left">婚姻状况</span>
                        <span class="puff_right">
                            <select id="select-hy" name="select-hy">
                                <option value="保密">保密</option>
                                <option value="已婚">已婚</option>
                                <option value="未婚">未婚</option>
                            </select>
                        </span>
                        <i class="icon-angle-right"></i>
                    </a>
                </li>
                <li class="animated bounceInLeft" style="border-bottom:none;">
                    <a href="#">
                        <span class="puff_left">所在地区</span>
                        <span class="puff_right">
                            <select id="s_province" name="s_province"><option value="省份">省份</option><option value="北京市">北京市</option><option value="天津市">天津市</option><option value="上海市">上海市</option><option value="重庆市">重庆市</option><option value="河北省">河北省</option><option value="山西省">山西省</option><option value="内蒙古">内蒙古</option><option value="辽宁省">辽宁省</option><option value="吉林省">吉林省</option><option value="黑龙江省">黑龙江省</option><option value="江苏省">江苏省</option><option value="浙江省">浙江省</option><option value="安徽省">安徽省</option><option value="福建省">福建省</option><option value="江西省">江西省</option><option value="山东省">山东省</option><option value="河南省">河南省</option><option value="湖北省">湖北省</option><option value="湖南省">湖南省</option><option value="广东省">广东省</option><option value="广西">广西</option><option value="海南省">海南省</option><option value="四川省">四川省</option><option value="贵州省">贵州省</option><option value="云南省">云南省</option><option value="西藏">西藏</option><option value="陕西省">陕西省</option><option value="甘肃省">甘肃省</option><option value="青海省">青海省</option><option value="宁夏">宁夏</option><option value="新疆">新疆</option><option value="香港">香港</option><option value="澳门">澳门</option><option value="台湾省">台湾省</option></select>
                        </span>
                        <i class="icon-angle-right"></i>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <div class="I_div">
        <div class="inter_add">
            <ul>

                <li class="animated bounceInLeft">
                    <a href="#">
                        <span class="puff_left">学历</span>
                        <span class="puff_right">
                            <select id="select-xueli" name="select-xueli">
                                <option value="保密">保密</option>
                                <option value="本科">本科</option>
                                <option value="博士">博士</option>
                                <option value="硕士">硕士</option>
                            </select>
                        </span>
                        <i class="icon-angle-right"></i>
                    </a>
                </li>
                <li class="animated bounceInRight" style="border-bottom:none;">
                    <a href="#">
                        <span class="puff_left">所在学校</span>
                        <span class="puff_right">
                            <select id="select-xx" name="select-xx">
                                <option value="保密">保密</option>
                                <option value="武汉大学">武汉大学</option>
                                <option value="北京大学">北京大学</option>
                                <option value="南京大学">南京大学</option>
                            </select>
                        </span>
                        <i class="icon-angle-right"></i>
                    </a>
                </li>

            </ul>
        </div>
    </div>
    <div class="I_div">
        <div class="id_bth inersest_bth animated bounceIn" style="margin-top: 2rem;">
            <p><a href="Y-s-result.html">搜索</a></p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
        </div>

    </div>
    <footer class="g-yftk-footer">
        <div class="tabs my_tab3">
            <a href="#" hidefocus="true" class="active">
                <p class="g-yftk-icon"><i class="g-yftk-icon1"></i></p>
                <p>发现缘分</p>
            </a>
            <a href="Y-activity.html" hidefocus="true">
                <p class="g-yftk-icon"><i class="g-yftk-icon2"></i></p>
                <p>交友活动</p>
            </a>
            <a href="Y-GRZX.html" hidefocus="true" >
                <p class="g-yftk-icon"><i class="g-yftk-icon3"></i></p>
                <p>个人中心</p>
            </a>
        </div>
    </footer>

    <script type="text/javascript" src="!gh/wechat/js/idangerous.swiper.min.js"></script>

</div>
</body>
</html>
