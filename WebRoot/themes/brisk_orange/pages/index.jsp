<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.framework.core.ApplicationManager" %>
<%@ page import="com.sunrise.framework.theme.ThemeFilter" %>
<%@ page import="com.sunrise.framework.var.Var" %>
<%@taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + request.getServerPort()
            + path + "/";
    basePath = basePath.substring(0,7)+basePath.substring(7).replace("//","/");
%>
<%
    SysPUser user = (SysPUser) session.getAttribute(LoginUserSession.UserSession_Key);
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
    <base href="<%=basePath%>" />
    <link rel="shortcut icon" type="image/x-icon" href="pages/images/favicon.ico" media="screen" />
    <title><%=ApplicationManager.getSystemName() %>
    </title>
    <link rel="shortcut icon" href="pages/images/logo_16.ico" type="image/x-icon" />
    <r:include resource="!rdcp/~/pages/base.jsp"/>
<!--
    <link href="themes/fire/css/common.css" rel="stylesheet" type="text/css"/>
    <link href="themes/fire/css/top.css" rel="stylesheet" type="text/css"/>
    <link href="themes/fire/css/navigation.css" rel="stylesheet" type="text/css"/>
    <link href="themes/fire/css/projectbuttom.css" rel="stylesheet" type="text/css"/>
    <link href="themes/fire/css/btn.css" rel="stylesheet" type="text/css"/>
    -->
    <script type="text/javascript" src="!property/base/scripts/tabs/baseTabs.js"></script>
    <script type="text/javascript">
        //var currentMenu = null;
        var _MENU_OPEN_ARR=new Array();//存放已打开的菜单ID

        rdcp.ready(function () {

            //登录会话更新，60秒钟刷新一次
            setInterval(function () {
                rdcp.request("!sys/security~java/UpdateSession", {}, null, {mask: false});
            }, 60000);

            rdcp.menuDefaults.menuBuilder = rdcp.menu.lowerNavMenuBuilder;

            //rdcp.menu("navi", "!sys/menu/~query/Q_USER_MENUS");

            addOpenedPageContainerTips(rdcp.id("openedList"), rdcp.id("opened_page_list"));
            
            openMenuMark(221);
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
        ;


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
        ;
        
        function refreshPage(id,title, herf, closable){

            if(!isExistOpenMenu(id)){
                openMenuMark(id);
                var $pageOpenerContainer_history = $("<DIV>");
                $pageOpenerContainer_history.addClass("projectbuttom");
                $pageOpenerContainer_history.on("mouseover", function () {
                    $pageOpenerContainer_history.addClass("projectbuttom_hover");
                });
                $pageOpenerContainer_history.on("mouseout", function () {
                    $pageOpenerContainer_history.removeClass("projectbuttom_hover");
                });

                var $openerA = $("<A>");
                $openerA.attr("href", "javascript:void(0)");
                $openerA.attr("id", "open_menu_"+id);
                $openerA.css("width", "130px");
                $openerA.html(title);
                $openerA.on("click", function () {
                    //rdcp.id("main").hide();
                    rdcp.id("pageFrameContainer").hide();
                    loadPage(id,herf);
                    rdcp.id("body_page").show();
                });
                $pageOpenerContainer_history.append($openerA);

                if (closable) {
                    var $closerA = $("<A>");
                    $closerA.attr("href", "javascript:void(0)");
                    $closerA.addClass("close");
                    $closerA.on("click", function () {
                        //关闭当前显示上一页面
                        $(this).parent().remove();
                        closeMenuMark(id);
                        //var $iframe = rdcp.id("page_frame_" + id);
                        //$iframe.prev().show();
                        //$iframe.remove();
                    });
                    $pageOpenerContainer_history.append($closerA);
                }

                rdcp.id("opened_page_list").append($pageOpenerContainer_history);
            }else{
                parent.openMenuMark(id);
            }
            loadPage(id,herf);
        }

        /**
        *加载页面
        * @param id
        * @param herf
         */
        function loadPage(id,herf){
            clickMenuMark(id);
            rdcp.id("body_page").panel("refresh",herf);
        }

         /**
         *登记的打开的菜单，并从新对菜单排序
         * @param id
          */
        function openMenuMark(id){
        	 //alert("id="+id);
             if(isExistOpenMenu(id)){
                 delMenuOpenArr(id);
             }
             //alert(_MENU_OPEN_ARR.length);
             _MENU_OPEN_ARR.push(id);
             //alert("2="+_MENU_OPEN_ARR.length);
         }

        /**
        *点击菜单时，从新对菜单排序
        * @param id
         */
        function clickMenuMark(id){
            delMenuOpenArr(id);
            _MENU_OPEN_ARR.push(id);
        }

        /**
        *关闭菜单
        * @param id
         */
        function closeMenuMark(id){
            delMenuOpenArr(id);
            openMenuOpenLast();
        }

         /*
          *删除菜单标记
          *
          * @param id
          */
        function delMenuOpenArr(id){
            for(var i=0;i<_MENU_OPEN_ARR.length;i++){
                if(_MENU_OPEN_ARR[i]==id){
                    _MENU_OPEN_ARR.splice(i,1);
                }
            }
        }

        /*
         *  方法:Array.remove(dx) 通过遍历,重构数组
         *  功能:删除数组元素.
         *  参数:dx删除元素的下标.
         */
        /*Array.prototype.remove=function(dx)
        {
            if(isNaN(dx)||dx>this.length){return false;}
            for(var i=0,n=0;i<this.length;i++)
            {
                if(this[i]!=this[dx])
                {
                    this[n++]=this[i]
                }
            }
            this.length-=1
        }*/

        function isExistOpenMenu(id){
            for(var i=0;i<_MENU_OPEN_ARR.length;i++){
                if(_MENU_OPEN_ARR[i]==id){
                    return true;
                }
            }
            return false;
        }

        function openMenuOpenLast(){
            document.getElementById("open_menu_"+_MENU_OPEN_ARR[_MENU_OPEN_ARR.length-1]).click();
        }
        function logout(){
            $.messager.confirm('确认退出', '确定要退出系统吗？', function (r) {
                if (r) {
                    rdcp.request("DS_USER_LOGOUT", "", function () {
                        document.location.href = "pages/login.jsp";
                    });
                }
            });
        }
    </script>

</head>

<body class="easyui-layout" style="border: 0px;">

<div data-options="region:'north'" style="border:0px;min-height:100px;overflow:hidden">
    <div class="SR_headerBox">
        <div class="SR_headerLeft">
            <div class="SR_logo"></div>
        </div>
        <div class="SR_headerRight">
            <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td>
                        <a href="javascript:void(0);" class="topLink1"><%=user.getName()%></a>
                    </td>
                    <!--<td><a href="" class="topLink2">倒萨倒萨</a></td>-->
                    <td><a href="${_basePath}" class="topLink3">进入首页</a></td>
                    <td><a href='javascript:;' onclick='logout();' class="topLink4">退出</a></td>
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

        <div data-options="region:'center'">
            <div id="easytabs" class="easyui-tabs" fit="true" border="false">
                <div title="首页">
                    <iframe style="width:100%;height:99%;" scrolling="auto" frameborder="0" src="pages/welcome.jsp"></iframe>
                </div>
            </div>
        </div>
        <!--
        <div data-options="region:'center'" style="border: 0px;overflow: hidden;">
            <div id="pageFrameContainer" style="width: 100%; height: 100%;">-->
                <!-- <iframe id="main" name="main" src="pages/fire/homepage/tasktodo.jsp"  class="pageFrame"></iframe> -->
           <!-- </div>
            <div id="body_page" style="width: 100%; height: 100%;"
                 class="easyui-panel" data-options="region:'center',fit:true">
            </div>
        </div>
        -->
    </div>
</div>
<div id="open_page_list_container" class="open_menu_list" style="display:none;">
    <div id="opened_page_list">
    </div>
</div>
<input type="hidden" id="CUR_USER_ID" value="<%=Var.get("RU.CUR_USER.id")%>" >
</body>
</html>
