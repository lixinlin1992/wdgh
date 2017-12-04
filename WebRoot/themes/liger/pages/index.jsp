<%@ page language="java" import="com.sunrise.framework.core.ApplicationManager" pageEncoding="UTF-8" %>
<%@ page import="com.sunrise.framework.core.LoginUser" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.framework.theme.ThemeFilter" %>
<%@ page import="com.sunrise.service.security.MenuHelper" %>
<%@ page import="com.sunrise.service.security.entity.SysPMenu" %>
<%@ page import="java.util.List" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%
//	String path = request.getContextPath();
//	String basePath = request.getScheme() + "://"
//			+ request.getServerName() + ":" + request.getServerPort()
//			+ path + "/";
  String path = request.getContextPath();
  String basePath = path.length()==1?path:(path+"/"); 

%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title><%=ApplicationManager.getSystemName() %>
    </title>
    <base href="<%=basePath%>">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link href="themes/default/css/ligerUISkins/Aqua/css/ligerui-all.css" rel="stylesheet" type="text/css"/>
    <link rel="stylesheet" type="text/css" href="themes/default/css/header.css"/>
    <link rel="stylesheet" type="text/css" href="themes/default/css/jquery.jgrowl.css"/>
    <script type="text/javascript" src="scripts/sunrise/framework.js"></script>
    <script type="text/javascript" src="scripts/common/jquery.jgrowl.js"></script>
    <script type="text/javascript" src="scripts/sunrise/core.js"></script>
    <script src="scripts/ligerUI/js/core/base.js" type="text/javascript"></script>
    <script src="scripts/ligerUI/js/ligerui.min.js" type="text/javascript"></script>
    <script type="text/javascript">
        var tab = null;
        var accordion = null;
        var tree = null;

        function init() {

            //布局
            $("#layout").ligerLayout({ topHeight:40, allowTopResize:false, leftWidth:190, height:'100%', onHeightChanged:f_heightChanged, bottomHeight:22, allowBottomResize:false});

            var height = $(".l-layout-center").height();

            //Tab
            $("#framecenter").ligerTab({ height:height });

            //面板
            $("#accordion1").ligerAccordion({ height:height - 24, speed:null });

            $(".l-link").hover(function () {
                $(this).addClass("l-link-over");
            }, function () {
                $(this).removeClass("l-link-over");
            });
            //树
            $("._menu_tree").ligerTree({
                checkbox:false,
                slide:false,
                nodeWidth:120,
                attribute:['nodename', 'url'],
                onSelect:function (node) {
                    if (!node.data.url) return;
                    var tabid = $(node.target).attr("tabid");
                    if (!tabid) {
                        tabid = new Date().getTime();
                        $(node.target).attr("tabid", tabid)
                    }
                    /*if ($(">ul >li", tab.tab.links).length >= 4)
                     {
                     var currentTabid = $("li.l-selected", tab.tab.links).attr("tabid"); //当前选择的tabid
                     if (currentTabid == "home") return;
                     tab.overrideTabItem(currentTabid, { tabid: tabid, url: node.data.url, text: node.data.text });
                     return;
                     }*/
                    f_addTab(tabid, node.data.text, node.data.url);
                }
            });

            tab = $("#framecenter").ligerGetTabManager();
            accordion = $("#accordion1").ligerGetAccordionManager();
            tree = $("#tree1").ligerGetTreeManager();
            $("#pageloading").hide();
        }

        $(function () {
            init();
            //完成后装载主题信息
            var _currentTheme = "<%=ThemeFilter.getThemne()%>";
            CORE.request("DS_THEME_LIST", {}, function (data) {
                //alert(data);
                var _sl = $("#themes");
                $.each(data, function (i, n) {
                    _sl.append("<option value='" + i + "' " + (_currentTheme == i ? "selected" : "") + ">" + n +
                            "</option>");
                });
            });
        });
        function f_heightChanged(options) {
            if (tab)
                tab.addHeight(options.diff);
            if (accordion && options.middleHeight - 24 > 0)
                accordion.setHeight(options.middleHeight - 24);
        }
        function f_addTab(tabid, text, url) {
            tab.addTabItem({ tabid:tabid, text:text, url:url });
        }

        /**
         * 设置主题
         * @param theme
         */
        function themeChange(theme) {
            CORE.request("DS_SET_THEME", {data:"theme=" + theme}, function (data) {
                top.location.reload();
            });
        }

        function outsys() {
            //parent.outsys();
            CORE.confirm("确定退出?", function () {
                CORE.request("DS_USER_LOGOUT", {}, function (data) {
                    window.top.location.href = '<%=basePath%>';
                })
            });
        }
        function showTip(msg) {
            $.jGrowl(msg);
        }

        function exitDemo() {
            top.location.href = "framework.do?ds=DS_RDCP_EXIT_DEMO";
        }
    </script>
    <style type="text/css">
        body, html {
            height: 100%;
        }

        body {
            padding: 0px;
            margin: 0;
            overflow: hidden;
        }

        .l-link {
            display: block;
            height: 26px;
            line-height: 26px;
            padding-left: 10px;
            text-decoration: underline;
            color: #333;
        }

        .l-link2 {
            text-decoration: underline;
            color: white;
        }

        .l-layout-top {
            background: #102A49;
            /*color: White;*/
        }

        .l-layout-bottom {
            background: #E5EDEF;
            text-align: center;
        }

        #pageloading {
            position: absolute;
            left: 0px;
            top: 0px;
            background: white url('loading.gif') no-repeat center;
            width: 100%;
            height: 100%;
            z-index: 99999;
        }

        .l-link {
            display: block;
            line-height: 22px;
            height: 22px;
            padding-left: 20px;
            border: 1px solid white;
            margin: 4px;
        }

        .l-link-over {
            background: #FFEEAC;
            border: 1px solid #DB9F00;
        }
    </style>
</head>
<body style="padding:0px;">
<%LoginUser user = (LoginUser) session.getAttribute(LoginUserSession.UserSession_Key);%>
<%
    java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("yyyy");
    java.util.Date currentTime = new java.util.Date();
    String str_date1 = formatter.format(currentTime);
    String str_date2 = currentTime.toString();
%>
<div id="pageloading"></div>
<div id="layout" style="width:100%">
    <div position="top" id="header">
        <table width="100%" border="0" style="border-collapse:collapse;" id="headerbarner">
            <tr>
                <td class="headerbarnet_left"></td>
                <td class="headerbarnet_right">
                    <p align="right">
                        <%if (ApplicationManager.isDemo()) {%>当前处于演示模式，<a href="javascript:;"
                                                                          onclick="exitDemo();">退出演示模式</a><%}%>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <%="您好," + user.getName() + "." %>
                        <a href='javascript:;' onclick='outsys()'>退出</a>&nbsp;&nbsp;&nbsp;&nbsp;
                        <select id="themes" onchange="themeChange(this.value)"></select>
                    </p>
                </td>
            </tr>
        </table>
    </div>
    <div position="left" title="<%=ApplicationManager.getSystemName()%>" id="accordion1">
        <%
            List<SysPMenu> topMenus = MenuHelper.getUserMenus(user.getId(), user.isSuperAdmin(), 0l);
            if (topMenus != null) {
                for (SysPMenu m : topMenus) {
                    List<SysPMenu> l2Menus = MenuHelper.getUserMenus(user.getId(), user.isSuperAdmin(), m.getId());
        %>
        <div title="<%=m.getName()%>" class="l-scroll">
            <%
                if (l2Menus != null) {
                    for (SysPMenu l2m : l2Menus) {
                        List<SysPMenu> l3Menus = MenuHelper
                                .getUserMenus(user.getId(), user.isSuperAdmin(), l2m.getId());
            %>
            <ul isexpand="false" class="_menu_tree">
                <li><span><%=l2m.getName()%></span>
                    <ul>
                        <% if (l3Menus != null) {
                            for (SysPMenu l3m : l3Menus) {%>
                        <li url="<%=l3m.getMenu_url()%>"><span><%=l3m.getName()%></span></li>
                        <%
                                }
                            }
                        %>
                    </ul>
                </li>
            </ul>
            <%
                    }
                }
            %>
        </div>
        <%
                }
            }
        %>
    </div>
    <div position="center" id="framecenter">
        <div tabid="home" title="首页" style="height:300px">
            <iframe frameborder="0" name="home" id="home" src="pages/right.jsp"></iframe>
        </div>
    </div>
    <div position="bottom">
        <%=ApplicationManager.getSystemName() %>  CopyRight2011&copy;版权所有 广州市森锐电子科技有限公司
    </div>
</div>
</body>
</html>
