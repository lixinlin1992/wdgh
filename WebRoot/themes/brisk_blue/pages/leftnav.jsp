<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%
    String path = request.getContextPath();
    String basePath =
            request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>左边</title>
    <r:include resource="!rdcp/~/pages/base.jsp"/>
    <link href="themes/default/css/common.css" rel="stylesheet" type="text/css"/>
    <link href="themes/default/css/leftnav.css" rel="stylesheet" type="text/css"/>
    <style type="text/css">
    </style>
    <script type="text/javascript">
        var _CURRENT_MENU_LEVEL2 = -1;//记录当前打开的二级菜单
        var _CURRENT_MENU_LEVEL3 = -1;//记录当前打开的三级菜单

        function loadMenu(parentId, level) {
            if ($("#menu_" + parentId + " ul").html() != null) {

                level = 4;
            }
            if ($("#menu_" + parentId + " ul").css("display") == "none") {
                level = 5;
            }

            var buildMenu = null;
            if (level == 2) {
                if ($("#menu").attr("parentId") == ("" + parentId))
                    return;
                $("#menu").attr("parentId", parentId);
                $("#menu").html("");
                buildMenu = function (data) {
                    var p = $("#menu");
                    for (var i = 0; i < data['body'].length; i++) {
                        var _menu = data["body"][i];
                        p.append("<li><div class='SR_navTitle' id='SR_navTitle" + _menu.id + "' menu_id='" + _menu.id +
                                "'><a class='aNormal' id='a_navTitle" + _menu.id +
                                "'  href='javascript:;'onclick='navTitleClick(\"" + _menu.id + "\")'>" +
                                unescape(_menu.name) +
                                "</a></div><div class='SR_navTitleContent sub_of_" +
                                _menu.id + "' id='menu_" + _menu.id + "'></div></li>");
                    }

                    if (data["body"].length > 0) {
                        navTitleClick(data["body"][0].id);
                    }
                    //如果没有打开菜单，则打开菜单
                    try {
                        parent.showMenuBar();
                    } catch (e) {
                    }
                };

            } else if (level == 3) {
                var p = $("#menu_" + parentId);
                if (p.attr("loaded") == "true")
                    return;
                p.attr("loaded", "true");
                buildMenu = function (data) {
                    var p = $("#menu_" + parentId);
                    p.append("<ul id='sub_menu_" + parentId + "'></ul>");
                    p = $("#sub_menu_" + parentId);
                    for (var i = 0; i < data['body'].length; i++) {
                        var _menu = data["body"][i];
                        var href = $.trim(_menu.url) == "" ? "pages/building.jsp" : unescape(_menu.url);

                        p.append("<li class='SR_navSecondTitle' onclick='navSecondTitleClick(\"" + _menu.id +
                                "\",\"" + _menu.name + "\",\"" + href + "\")' id='sub_menu_" + _menu.id +
                                "'><a id='a_navSecondTitle" + _menu.id + "' target='page_frame_" + _menu.id + "'>" +
                                unescape(_menu.name) + "</a></li>");

                    }

//                    if (data["body"].length > 0) {
//                        navSecondTitleClick(data["body"][0].id, data["body"][0].name, $.trim(data['body'][0].url) ==
//                                "" ? "pages/building.jsp" : unescape(data['body'][0].url));
//                    }
                };
            }
            else {
                return;
            }
            rdcp.request("!sys/menu/~java/UserMenu", {parent_id: parentId, time: new Date().getTime()}, buildMenu);
        }

        function navTitleClick(id) {
            if (_CURRENT_MENU_LEVEL2 >= 0) {
                $(".sub_of_" + _CURRENT_MENU_LEVEL2).slideToggle(100);
                $("#a_navTitle" + _CURRENT_MENU_LEVEL2).attr("class", "aNormal");
            }
            if (_CURRENT_MENU_LEVEL2 == id) {
                $("#a_navTitle" + id).attr("class", "aNormal");
                _CURRENT_MENU_LEVEL2 = -1;
            } else {
                $(".sub_of_" + id).slideToggle(100);
                $("#a_navTitle" + id).attr("class", "aHover");
                _CURRENT_MENU_LEVEL2 = id;
                loadMenu(id, 3);
            }
        }

        function navSecondTitleClick(id, name, href) {
            parent.rdcp.menu.lowerNavMenuBuilder.openPage(id, name, href, true);

            if (_CURRENT_MENU_LEVEL3 >= 0)
                $("#a_navSecondTitle" + _CURRENT_MENU_LEVEL3).parent().attr("class", "SR_navSecondTitle");

            $("#a_navSecondTitle" + id).parent().attr("class", "SR_navSecond");

            _CURRENT_MENU_LEVEL3 = id;
        }

        rdcp.ready(function () {
            loadMenu(22, 2);
        });
    </script>
</head>
<body class="leftBg">
<!--左边可折叠式下拉菜单Start-->
<div class="SR_mainLeftNav">
    <ul id="menu">
    </ul>
</div>
<!--左边可折叠式下拉菜单End-->
<!--
	未解决问题:1.JS动画未制作。
    	               2.未放到整体页面进行测试。
-->
<!--左边可折叠式下拉菜单End-->
</body>
</html>