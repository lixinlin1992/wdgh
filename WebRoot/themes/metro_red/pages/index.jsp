<%@ page language="java" pageEncoding="UTF-8" %>
<%@taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <r:include resource="!rdcp/~/pages/base.jsp"/>
    <link href="themes/metro/css/navi.css" rel="stylesheet" type="text/css"/>
    <link href="themes/metro/css/menu-css.css" rel="stylesheet" type="text/css"/>
    <link href="themes/metro/css/lowernav.css" rel="stylesheet" type="text/css"/>
    <link href="themes/metro/css/projectbuttom.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript">
        rdcp.ready(function () {
            rdcp.menuDefaults.menuBuilder = rdcp.menu.lowerNavMenuBuilder;

            rdcp.menu("navi", "!menu/ds/DS_USER_MENUS");
            rdcp.menu.openPage(0, "首页", "!test/pages/testIndex.jsp", false);
        });
    </script>
</head>

<body class="easyui-layout">
<div data-options="region:'north'" style="border:0px;min-height:100px;overflow:hidden">
    <div class="box-navi">
        <div id="top">
            <div id="logo"></div>
            <div id="top-right">
                <ul>
                    <li>
                        <div class="list-btn1">
                            <a href="javascript:void(0);"
                               onclick="rdcp.menu.openPage(1, '主页', 'pages/main.jsp', true);">快速通道</a>
                        </div>
                    </li>
                    <li>
                        <div class="list-btn2">
                            <a href="javascript:void(0);">个人信息</a>
                        </div>
                    </li>
                    <li>
                        <div class="list-btn3">
                            <a href="javascript:void(0);">站内信息</a>
                        </div>
                    </li>
                    <li>
                        <div class="list-btn4">
                            <a href="javascript:void(0);" onclick="rdcp.logout();">退出登录</a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div id="navi-box">
            <div id="navi">
            </div>
            <div id="openedList" class="navi-right" onmouseover="this.className='navi-righthover'"
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
</div>
<div data-options="region:'center'" style=";border:0px;overflow:hidden">
    <div id="pageFrameContainer" style="width: 100%; height: 100%;">
        <%--<iframe id="page_frame_0" title="首页" src="pages/main.jsp" class="pageFrame"></iframe>--%>
    </div>
</div>

<div id="open_page_list_container" class="open_menu_list" style="display:none;">
    <div id="opened_page_list">
    </div>
</div>
<div id="sub_menu_container" style="display:none;">
</div>
</body>
</html>