<%--
User: Larry
--%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="com.sunrise.framework.core.ApplicationManager" %>
<%@page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
    <meta content="telephone=no" name="format-detection" />
    <title>献爱心列表</title>
    <link href="!gh/wechat/~/css/main.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/~/css/style.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/~/css/shake.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">
    <link href="!gh/wechat/~/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="js/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="js/wo.js"></script>
</head>
<body style="background-color: #fff !important;" class="g-xax">
<div class="warpe">
    <div class="head">
        <a href="#" class="return"><i class="icon-chevron-left"></i> </a>
        献爱心列表

    </div>

    <div class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide">
                <div class="content-slide">
                    <div class="main">

                        <ul class="movielist">
                            <li class="item">
                                <a href="xax-detail.html" data-bid="b_MWTWF" data-lab="{ index:1, movie_id:248645, module_name:'cell' }">
                                    <div class="movie-cover">
                                        <img class="lazy" data-src="https://thumb.qschou.com/files/qschou.com/project/0f6c021a1-4823-4091-9ac3-b215633f49ec149751516517082306700049ed52f045e8e33e7e51a69708879efe.jpg@!love.png" src="https://thumb.qschou.com/files/qschou.com/project/0f6c021a1-4823-4091-9ac3-b215633f49ec149751516517082306700049ed52f045e8e33e7e51a69708879efe.jpg@!love.png">
                                    </div>
                                    <div class="movie-content ">
                                        <div class="flexRow flex-item flex-middle text-ellipsis">
                                            <span class="movie-name color-red">微爱珞珈</span>
                                        </div>
                                        <p>参捐人数：<span class="color-blue">130</span>人</p>
                                        <p>已筹善款：<span class="color-red">13000</span>元</p>
                                        <p>目标：<span class="color-red">990000</span>元</p>
                                        <p>进度：<span class="color-red">990000（5%）</span></p>
                                        <p>项目时间：2015-12-22 至 长期</p>
                                    </div>
                                </a>
                            </li>
                            <li class="item">
                                <a href="xax-detail.html" data-bid="b_MWTWF" data-lab="{ index:1, movie_id:248645, module_name:'cell' }">
                                    <div class="movie-cover">
                                        <img class="lazy" data-src="https://thumb.qschou.com/files/qschou.com/project/0f6c021a1-4823-4091-9ac3-b215633f49ec149751516517082306700049ed52f045e8e33e7e51a69708879efe.jpg@!love.png" src="https://thumb.qschou.com/files/qschou.com/project/0f6c021a1-4823-4091-9ac3-b215633f49ec149751516517082306700049ed52f045e8e33e7e51a69708879efe.jpg@!love.png">
                                    </div>
                                    <div class="movie-content ">
                                        <div class="flexRow flex-item flex-middle text-ellipsis">
                                            <span class="movie-name color-red">微爱珞珈</span>
                                        </div>
                                        <p>参捐人数：<span class="color-blue">130</span>人</p>
                                        <p>已筹善款：<span class="color-red">13000</span>元</p>
                                        <p>目标：<span class="color-red">990000</span>元</p>
                                        <p>进度：<span class="color-red">990000（5%）</span></p>
                                        <p>项目时间：2015-12-22 至 长期</p>
                                    </div>
                                </a>
                            </li>
                            <li class="item">
                                <a href="xax-detail.jsp" data-bid="b_MWTWF" data-lab="{ index:1, movie_id:248645, module_name:'cell' }">
                                    <div class="movie-cover">
                                        <img class="lazy" data-src="https://thumb.qschou.com/files/qschou.com/project/0f6c021a1-4823-4091-9ac3-b215633f49ec149751516517082306700049ed52f045e8e33e7e51a69708879efe.jpg@!love.png" src="https://thumb.qschou.com/files/qschou.com/project/0f6c021a1-4823-4091-9ac3-b215633f49ec149751516517082306700049ed52f045e8e33e7e51a69708879efe.jpg@!love.png">
                                    </div>
                                    <div class="movie-content ">
                                        <div class="flexRow flex-item flex-middle text-ellipsis">
                                            <span class="movie-name color-red">微爱珞珈</span>
                                        </div>
                                        <p>参捐人数：<span class="color-blue">130</span>人</p>
                                        <p>已筹善款：<span class="color-red">13000</span>元</p>
                                        <p>目标：<span class="color-red">990000</span>元</p>
                                        <p>进度：<span class="color-red">990000（5%）</span></p>
                                        <p>项目时间：2015-12-22 至 长期</p>
                                    </div>
                                </a>
                            </li>
                            <li class="item">
                                <a href="xax-detail.jsp" data-bid="b_MWTWF" data-lab="{ index:1, movie_id:248645, module_name:'cell' }">
                                    <div class="movie-cover">
                                        <img class="lazy" data-src="https://thumb.qschou.com/files/qschou.com/project/0f6c021a1-4823-4091-9ac3-b215633f49ec149751516517082306700049ed52f045e8e33e7e51a69708879efe.jpg@!love.png" src="https://thumb.qschou.com/files/qschou.com/project/0f6c021a1-4823-4091-9ac3-b215633f49ec149751516517082306700049ed52f045e8e33e7e51a69708879efe.jpg@!love.png">
                                    </div>
                                    <div class="movie-content ">
                                        <div class="flexRow flex-item flex-middle text-ellipsis">
                                            <span class="movie-name color-red">微爱珞珈</span>
                                        </div>
                                        <p>参捐人数：<span class="color-blue">130</span>人</p>
                                        <p>已筹善款：<span class="color-red">13000</span>元</p>
                                        <p>目标：<span class="color-red">990000</span>元</p>
                                        <p>进度：<span class="color-red">990000（5%）</span></p>
                                        <p>项目时间：2015-12-22 至 长期</p>
                                    </div>
                                </a>
                            </li>
                            <li class="item">
                                <a href="xax-detail.html" data-bid="b_MWTWF" data-lab="{ index:1, movie_id:248645, module_name:'cell' }">
                                    <div class="movie-cover">
                                        <img class="lazy" data-src="https://thumb.qschou.com/files/qschou.com/project/0f6c021a1-4823-4091-9ac3-b215633f49ec149751516517082306700049ed52f045e8e33e7e51a69708879efe.jpg@!love.png" src="https://thumb.qschou.com/files/qschou.com/project/0f6c021a1-4823-4091-9ac3-b215633f49ec149751516517082306700049ed52f045e8e33e7e51a69708879efe.jpg@!love.png">
                                    </div>
                                    <div class="movie-content ">
                                        <div class="flexRow flex-item flex-middle text-ellipsis">
                                            <span class="movie-name color-red">微爱珞珈</span>
                                        </div>
                                        <p>参捐人数：<span class="color-blue">130</span>人</p>
                                        <p>已筹善款：<span class="color-red">13000</span>元</p>
                                        <p>目标：<span class="color-red">990000</span>元</p>
                                        <p>进度：<span class="color-red">990000（5%）</span></p>
                                        <p>项目时间：2015-12-22 至 长期</p>
                                    </div>
                                </a>
                            </li>
                            <li class="item">
                                <a href="xax-detail.html" data-bid="b_MWTWF" data-lab="{ index:1, movie_id:248645, module_name:'cell' }">
                                    <div class="movie-cover">
                                        <img class="lazy" data-src="https://thumb.qschou.com/files/qschou.com/project/0f6c021a1-4823-4091-9ac3-b215633f49ec149751516517082306700049ed52f045e8e33e7e51a69708879efe.jpg@!love.png" src="https://thumb.qschou.com/files/qschou.com/project/0f6c021a1-4823-4091-9ac3-b215633f49ec149751516517082306700049ed52f045e8e33e7e51a69708879efe.jpg@!love.png">
                                    </div>
                                    <div class="movie-content ">
                                        <div class="flexRow flex-item flex-middle text-ellipsis">
                                            <span class="movie-name color-red">微爱珞珈</span>
                                        </div>
                                        <p>参捐人数：<span class="color-blue">130</span>人</p>
                                        <p>已筹善款：<span class="color-red">13000</span>元</p>
                                        <p>目标：<span class="color-red">990000</span>元</p>
                                        <p>进度：<span class="color-red">990000（5%）</span></p>
                                        <p>项目时间：2015-12-22 至 长期</p>
                                    </div>
                                </a>
                            </li>
                            <li class="item">
                                <a href="xax-detail.html" data-bid="b_MWTWF" data-lab="{ index:1, movie_id:248645, module_name:'cell' }">
                                    <div class="movie-cover">
                                        <img class="lazy" data-src="https://thumb.qschou.com/files/qschou.com/project/0f6c021a1-4823-4091-9ac3-b215633f49ec149751516517082306700049ed52f045e8e33e7e51a69708879efe.jpg@!love.png" src="https://thumb.qschou.com/files/qschou.com/project/0f6c021a1-4823-4091-9ac3-b215633f49ec149751516517082306700049ed52f045e8e33e7e51a69708879efe.jpg@!love.png">
                                    </div>
                                    <div class="movie-content ">
                                        <div class="flexRow flex-item flex-middle text-ellipsis">
                                            <span class="movie-name color-red">微爱珞珈</span</div>
                                        <p>参捐人数：<span class="color-blue">130</span>人</p>
                                        <p>已筹善款：<span class="color-red">13000</span>元</p>
                                        <p>目标：<span class="color-red">990000</span>元</p>
                                        <p>进度：<span class="color-red">990000（5%）</span></p>
                                        <p>项目时间：2015-12-22 至 长期</p>
                                    </div>
                                </a>
                            </li>
                            <li class="item">
                                <a href="xax-detail.html" data-bid="b_MWTWF" data-lab="{ index:1, movie_id:248645, module_name:'cell' }">
                                    <div class="movie-cover">
                                        <img class="lazy" data-src="https://thumb.qschou.com/files/qschou.com/project/0f6c021a1-4823-4091-9ac3-b215633f49ec149751516517082306700049ed52f045e8e33e7e51a69708879efe.jpg@!love.png" src="https://thumb.qschou.com/files/qschou.com/project/0f6c021a1-4823-4091-9ac3-b215633f49ec149751516517082306700049ed52f045e8e33e7e51a69708879efe.jpg@!love.png">
                                    </div>
                                    <div class="movie-content ">
                                        <div class="flexRow flex-item flex-middle text-ellipsis">
                                            <span class="movie-name color-red">微爱珞珈</span>
                                        </div>
                                        <p>参捐人数：<span class="color-blue">130</span>人</p>
                                        <p>已筹善款：<span class="color-red">13000</span>元</p>
                                        <p>目标：<span class="color-red">990000</span>元</p>
                                        <p>进度：<span class="color-red">990000（5%）</span></p>
                                        <p>项目时间：2015-12-22 至 长期</p>
                                    </div>
                                </a>
                            </li>
                        </ul>

                    </div>
                </div>
            </div>

        </div>

    </div>

</div>
<script type="text/javascript" src="js/idangerous.swiper.min.js"></script>

</body>
</html>