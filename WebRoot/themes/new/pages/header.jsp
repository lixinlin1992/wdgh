<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.framework.core.ApplicationManager" %>
<%@ page import="com.sunrise.framework.theme.ThemeFilter" %>
<%
    String path = request.getContextPath();
    String basePath =
            request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
    <base href="<%=basePath%>">
    <title>头部文件</title>
    <link rel="stylesheet" type="text/css" href="themes/default/css/header.css"/>
    <script type="text/javascript" src="scripts/sunrise/framework.js"></script>
    <script type="text/javascript">
        var currentMenu = null;
        $(function() {
            //请求菜单数据并构建顶层菜单
            var buildMenu = function(data) {
                var html = "<ul style='width:100%;height:20px;overflow:auto;'>";
                for (var i = 0; i < data.length; i++) {
                    html += "<li id='menu_top_" + data[i].id + "'><a id='menu_t_a_"+data[i].id+"' href='javascript:;' onclick='showSubMenu(" +
                            data[i].id + ")'>" + unescape(data[i].name) + "</a></li>";
                }
                $("#nav").append(html);
                var cc = $("#menu_top_" + data[0].id + " a");

                //cc.click();

                //完成后装载主题信息
                var _currentTheme = "<%=ThemeFilter.getThemne()%>";
                CORE.request("DS_THEME_LIST",{},function(data){
                    //alert(data);
                    var _sl = $("#themes");
                    $.each(data,function(i,n){
                        _sl.append("<option value='"+i+"' "+(_currentTheme==i?"selected":"")+">"+n+"</option>");
                    });
                });
            };

            CORE.request("DS_USER_MENU", {block : "false"}, buildMenu);

        });

        function showSubMenu(menuId) {
            if (currentMenu != null) {
                $("#menu_t_a_" + currentMenu).removeClass("nav-selected");
            }
            parent.main.subMenuFrame.loadMenu(menuId, 2);
            currentMenu = menuId;
            $("#menu_t_a_" + currentMenu).addClass("nav-selected");
        }
        function outsys() {
            window.parent.frames["main"].outsys();
        }

        function exitDemo() {
            top.location.href = "framework.do?ds=DS_RDCP_EXIT_DEMO";
        }

        /**
         * 设置主题
         * @param theme
         */
        function themeChange(theme) {
            CORE.request("DS_SET_THEME", {data:"theme=" + theme}, function(data) {
                top.location.reload();
            });
        }
    </script>

</head>

<body>
<%SysPUser user = (SysPUser) session.getAttribute(LoginUserSession.UserSession_Key);%>
<%
    java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("yyyy");
    java.util.Date currentTime = new java.util.Date();
    String str_date1 = formatter.format(currentTime);
    String str_date2 = currentTime.toString();
%>
<div id="header">
    <div id="headerbarner">
        <table width="100%" border="0" style="border-collapse:collapse;">
            <tr>
                <td class="headerbarnet_left"></td>
                <td class="headerbarnet_right">
                    <p align="right">
                        <%if (ApplicationManager.isDemo()) {%>当前处于演示模式，<a href="javascript:;" onclick="exitDemo();">退出演示模式</a><%}%>&nbsp;&nbsp;&nbsp;&nbsp;
                        <%="您好," + user.getName() + "." %>
                        <a href='javascript:;' onclick='outsys()'>退出</a>&nbsp;&nbsp;&nbsp;&nbsp;
                        <select id="themes" onchange="themeChange(this.value)"></select>
                    </p>

                    <p align="right">
                        <script type="text/javascript">
                            function str2date(str) {
                                var d = null;
                                var reg = /^(\d{4})-(\d{2})-(\d{2})   (\d{2}):(\d{2}):(\d{2})\.(\d+)$/;
                                if (arr = str.match(reg))
                                    d = new Date(Number(arr[1]), Number(arr[2]) - 1, Number(arr[3]), Number(arr[4]),
                                            Number(arr[5]), Number(arr[6]), Number(arr[7]));
                                return d;
                            }
                            function date2str(d) {
                                var ret = "当前时间:" + d.getFullYear() + "年"
                                ret += ( "00 " + (d.getMonth() + 1)).slice(-2) + "月"
                                ret += ( "00 " + d.getDate()).slice(-2) + "日 "
                                ret += " 星期" + "日一二三四五六 ".charAt(new Date().getDay());
                                ret + d.getMilliseconds();
                                return ret;
                            }
                            document.write(date2str(new Date())+"&nbsp;<a href='pages/service/security/onlineUserList.jsp' target='contentFrame' onclick=''>在线人员</a>");
                        </script>
                        &nbsp;&nbsp;&nbsp;
                    </p>
                </td>
            </tr>
            <tr>
                <td id="nav" colspan="2"></td>
            </tr>
        </table>
    </div>
</div>
</body>
</html>
