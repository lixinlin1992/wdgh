<%@ page language="java" import="com.sunrise.framework.core.ApplicationManager" pageEncoding="UTF-8" %>
<%@ page import="com.sunrise.framework.core.LoginUser" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.framework.theme.ThemeFilter" %>
<%@ page import="com.sunrise.service.security.MenuHelper" %>
<%@ page import="com.sunrise.service.security.entity.SysPMenu" %>
<%@ page import="java.util.List" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%
    String path = request.getContextPath();
    String basePath = path.length() == 1 ? path : (path + "/");

%>
<html>
<head>
    <title><%=ApplicationManager.getSystemName() %>
    </title>
    <base href="<%=basePath%>">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel="stylesheet" type="text/css" href="themes/default/css/jquery.jgrowl.css"/>
    <script type="text/javascript" src="scripts/sunrise/framework.js"></script>
    <script type="text/javascript" src="scripts/common/jquery.jgrowl.js"></script>
    <script type="text/javascript" src="scripts/sunrise/core.js"></script>
    <script type="text/javascript" src="pages/personalaffair/common/cookie.js"></script>
    <script type="text/javascript" src="themes/metro/pages/menu.js"></script>
    <link href="themes/metro/css/navi.css" rel="stylesheet" type="text/css"/>
    <link href="themes/metro/css/menu-css.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript">

        $(function () {
            //请求菜单数据并构建顶层菜单
            CORE.request("DS_USER_MENU", {block: "false"}, function (data) {
                MENU.buildMenu("navi", data);
            });
            //MENU.buildMenu("navi", Menulist.body);
            MENU.openIFrame("maincontentFrame", "首页", "pages/main.jsp", false);
        });

        function logOut() {
            CORE.confirm("确定退出?", function () {
                CORE.request("DS_USER_LOGOUT", {}, function (data) {
                    delCookies("loginName", "/");
                    delCookies("password", "/");
                    window.top.location.href = '<%=basePath%>';
                })
            });
        }
        function showTip(msg) {
            $.jGrowl(msg);
        }
    </script>
</head>
<body>
<div style="height:100px;width: 100%;"></div>
<div class="box-navi">
    <div id="top">
        <div id="logo"></div>
        <div id="topleft">
            <div class="search">
                <form>
                    <input type="text"/>

                    <div class="searchbutton"></div>
                </form>
            </div>
        </div>
        <div id="top-right">
            <ul>
                <li>
                    <div class="list-btn1"><a href="#">快速通道</a></div>
                </li>
                <li>
                    <div class="list-btn2"><a href="#">个人信息</a></div>
                </li>
                <li>
                    <div class="list-btn3"><a href="#">站内信息</a></div>
                </li>
                <li>
                    <div class="list-btn4"><a href="#" onclick="logOut();">退出登录</a></div>
                </li>
            </ul>
        </div>
    </div>
    <div id="navi-box">
        <div id="navi">
        </div>
        <div class="navi-right" onmouseover="this.className='navi-righthover'"
             onmouseout="this.className='navi-right'">
        </div>
    </div>
    <div id="main">
        <div id="main-left"></div>
        <div id="main-right">
        </div>
    </div>
    <div id="buttom">
    </div>
</div>
<div id="contentParent" class="contentParent" style="width: 100%;height:100%">
    <div id="maincontent" class="content" style="width: 100%;height:100%">
        <%--<iframe id="maincontentFrame" style="width: 100%;height: 100%" src="pages/right.jsp">--%>
        <%--</iframe>--%>
    </div>
</div>
<div id="open_menu_list" class="open_menu_list" style="display:none;position:absolute;z-index: 1000">
    <ul class="sub_menu">
    </ul>
</div>
</body>
</html>