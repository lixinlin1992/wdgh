<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sunrise.service.security.entity.SysPUser"%>
<%@ page import="com.sunrise.framework.core.LoginUserSession"%>
<%@ page import="com.sunrise.framework.core.ApplicationManager"%>
<%@ page import="com.sunrise.framework.theme.ThemeFilter"%>
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
		<title>头部文件</title>
    	<jsp:include page="/scripts/RDCPJS/demo/base.jsp"/>
		<link href="themes/fire/css/common.css" rel="stylesheet" type="text/css" />
		<link href="themes/fire/css/top.css" rel="stylesheet" type="text/css" />
		<link href="themes/fire/css/navigation.css" rel="stylesheet" type="text/css" />		
		<link href="themes/fire/css/projectbuttom.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript">
        //var currentMenu = null;
        rdcp.ready(function() {
        	
        	rdcp.menuDefaults.menuBuilder = rdcp.menu.lowerNavMenuBuilder;

            rdcp.menu("navi", "!rdcp/ds/DS_USER_MENUS");
            rdcp.menu.openPage(0, "首页", "pages/fire/homepage/tasktodo.jsp", false);
            
        });
            /* //请求菜单数据并构建顶层菜单
            var buildMenu = function(data) {
                var html = "<ul style='width:100%;height:36px;overflow:auto;'>";
                for (var i = 0; i < data.length; i++) {
                    html += "<li id='menu_top_" + data[i].id + "'><a style='color: #fff' id='menu_t_a_"+data[i].id+"' href='javascript:;' onclick='showSubMenu(" +
                            data[i].id + ")'>" + unescape(data[i].name) + "</a></li>";
                }
                rdcp.id("nav").append(html);
                var cc = rdcp.id("menu_top_" + data[0].id + " a");

                
            };

            rdcp.request("DS_USER_MENU", {block : "false"}, buildMenu); */

        

        /* function showSubMenu(menuId) {
            if (currentMenu != null) {
                rdcp.id("menu_t_a_" + currentMenu).removeClass("nav-selected");
            }
            parent.left.loadMenu(menuId, 2);
            currentMenu = menuId;
            rdcp.id("menu_t_a_" + currentMenu).addClass("nav-selected");
        } */
        function outsys() {
            window.parent.frames["main"].outsys();
        }  
        
    </script>

	</head>

<body>
		<%
			SysPUser user = (SysPUser) session.getAttribute(LoginUserSession.UserSession_Key);
		%>
<!--headerBox-----Begin-->
<div class="SR_headerBox">
  <div class="SR_headerLeft">
    <div class="SR_logo"></div>
  </div>
  <div class="SR_headerRight">
    <table cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td><a href="" class="topLink1"><%=user.getName()%></a></td>

        <!--
        <td><a href="" class="topLink2">倒萨倒萨</a></td>
        <td><a href="" class="topLink3">倒萨倒萨</a></td>    -->
        <td><a href='javascript:;' onclick='outsys()' class="topLink4" >退出</a></td>
      </tr>
    </table>
  </div>
</div>
<div class="clear"></div>
<!--headerBox-----End-->

<!--导航模块Begin-->
<div id="navi-box" class="SR_navBox" style="cursor: pointer;">
  <div id="navi" class="SR_nav" >
  </div>
  <div id="openedList" class="SR_navRight">
  	<div class="navRightBtn" onmouseover="this.className='navRightBtnHover';" onmouseout="this.className='navRightBtn';"></div>
  </div>
</div>
<div id="open_page_list_container" class="open_menu_list" style="display:none;">
    <div id="opened_page_list">
    </div>
</div>
<div class="clear"></div>
<!--导航模块End-->
</body>
</html>
