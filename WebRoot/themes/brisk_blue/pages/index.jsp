<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.framework.core.ApplicationManager" %>
<%@ page import="com.sunrise.framework.theme.ThemeFilter" %>
<%@taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + request.getServerPort()
            + path + "/";
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
    <base href="<%=basePath%>">
    <title><%=ApplicationManager.getSystemName() %>
    </title>
    <r:include resource="!rdcp/~/pages/base.jsp"/>
    <link href="themes/default/css/common.css" rel="stylesheet" type="text/css"/>
    <link href="themes/default/css/top.css" rel="stylesheet" type="text/css"/>
    <link href="themes/default/css/navigation.css" rel="stylesheet" type="text/css"/>
    <link href="themes/default/css/projectbuttom.css" rel="stylesheet" type="text/css"/>
    <link href="themes/default/css/btn.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript">
        //var currentMenu = null;
        rdcp.ready(function () {

            //登录会话更新，60秒钟刷新一次
            setInterval(function () {
                rdcp.request("!sys/security~java/UpdateSession", {}, null, {mask: false});
            }, 60000);

            rdcp.menuDefaults.menuBuilder = rdcp.menu.lowerNavMenuBuilder;

            //rdcp.menu("navi", "!sys/menu/~query/Q_USER_MENUS");

            addOpenedPageContainerTips(rdcp.id("openedList"), rdcp.id("opened_page_list"));
            rdcp.menu.openPage(221, "首页", "pages/welcome.jsp", false);
            rdcp.request("!sys/menu/~java/UserMenu", {time: new Date().getTime()}, buildNavBar);
        });

        function buildNavBar(data) {
            var $container = rdcp.id("navi");

            $container.append($("<UL>"));
            rdcp.each(data['body'], function (idx) {

                var menu_level_1 = this;
                var $li = addMenu_level_1($container, menu_level_1);
            });
        }


        /**
         * 添加一级菜单到导航条
         *
         * @param $container 导航条ID
         * @param menu_level_1 一级菜单对象
         * @returns 一级菜单DOM对象
         */
        function addMenu_level_1($container, m) {
            var $ul = $container.find("ul");
            var $li = $("<LI>");
            var $a = $("<A>");
            $a.html(m.name);
            $li.append($a);
            $li.on("click", function () {
                parent.left.loadMenu(m.id, 2);
            });
            $ul.append($li);

            return $li;
        }


        function addOpenedPageContainerTips($opener, $openedPagesContainer) {
            rdcp.tooltip($opener, {
                content: $openedPagesContainer,
                onShow: function () {
                    var t = $(this);
                    var state = t.tooltip('tip');
                    state.css({
                        left: $(this).position().left + $(this).width() - state.width() - 13,
                        top: $(this).position().top + $(this).outerHeight() + 8
                    });
                    state.find(".tooltip-arrow-outer").css('margin-left',
                            (state.width() / 2 - $(this).width() / 2) + "px");
                    state.find(".tooltip-arrow").css('margin-left', (state.width() / 2 - $(this).width() / 2) + "px");
                    t.tooltip('tip').unbind().bind('mouseenter',function () {
                        t.tooltip('show');
                    }).bind('mouseleave', function () {
                                t.tooltip('hide');
                            });
                }
            });
        }

    </script>

</head>

<body class="easyui-layout" style="border: 0px;">
<%
    SysPUser user = (SysPUser) session.getAttribute(LoginUserSession.UserSession_Key);
%>
<div data-options="region:'north'" style="border:0px;min-height:100px;overflow:hidden">
    <div class="SR_headerBox">
        <div class="SR_headerLeft">
            <div class="SR_logo"></div>
        </div>
        <div class="SR_headerRight">
            <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td><a href="" class="topLink1"><%=user.getName()%>
                    </a></td>
                    <!--
                    <td><a href="" class="topLink2">倒萨倒萨</a></td>
                    <td><a href="" class="topLink3">倒萨倒萨</a></td>  -->
                    <td><a href='javascript:;' onclick='rdcp.logout();' class="topLink4">退出</a></td>
                </tr>
            </table>
        </div>
    </div>
    <div class="clear"></div>
    <!--headerBox-----End-->

    <!--导航模块Begin-->
    <div id="navi-box" class="SR_navBox" style="cursor: pointer;">
        <div id="navi" class="SR_nav">
        </div>
        <div id="openedList" class="SR_navRight">
            <div class="navRightBtn" onmouseover="this.className='navRightBtnHover';"
                 onmouseout="this.className='navRightBtn';"></div>
        </div>
        <div class="navSwitchTip">切换窗口</div>
    </div>
</div>
<div data-options="region:'center'" style="border: 0px;">
    <div class="easyui-layout" data-options="fit:true" style="border: 0px;">
        <div data-options="region:'west'"
             style="border: 0px;width: 200px;height: 100%;overflow: hidden; overflow-x: hidden;">
            <iframe id="left" name="left" src="pages/leftnav.jsp" class="pageFrame"></iframe>
        </div>
        <div data-options="region:'center'" style="border: 0px;overflow: hidden;">
            <div id="pageFrameContainer" style="width: 100%; height: 100%;">
                <!-- <iframe id="main" name="main" src="pages/fire/homepage/tasktodo.jsp"  class="pageFrame"></iframe> -->
            </div>
        </div>
    </div>
</div>

<div id="open_page_list_container" class="open_menu_list" style="display:none;">
    <div id="opened_page_list">
    </div>
</div>
</body>
</html>
