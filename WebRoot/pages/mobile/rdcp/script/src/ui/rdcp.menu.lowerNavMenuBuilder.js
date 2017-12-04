rdcp.menu.lowerNavMenuBuilder = {};

rdcp.menu.lowerNavMenuBuilder.build = function ($container, menuTree) {

    $container.append($("<UL>"));

    rdcp.each(menuTree, function (index1) {

        var menu_level_1 = this;
        var $li = addMenu_level_1($container, menu_level_1);
        
        /*
        var $subMenuContainer = addSubMenuContainer(menu_level_1);
        addSubMenuContainerTips($li, $subMenuContainer);
        rdcp.each(menu_level_1.children, function (index2) {
            var menu_level_2 = this;
            addMenu_level_2(menu_level_2, menu_level_1.children.length == index2 + 1 ? true : false, $subMenuContainer);

            rdcp.each(menu_level_2.children, function (index3) {
                var menu_level_3 = this;
                addMenu_level_3(menu_level_3, $subMenuContainer);
            });
        });
        */
    });

    addOpenedPageContainerTips(rdcp.id("openedList"), rdcp.id("opened_page_list"));

    /**
     * 添加一级菜单到导航条
     *
     * @param $container 导航条ID
     * @param menu_level_1 一级菜单对象
     * @returns 一级菜单DOM对象
     */
    function addMenu_level_1($container, menu_level_1) {
        var $ul = $container.find("ul"); 	
        var $li = $("<LI>");
        var $a = $("<A>");
        $a.html(menu_level_1.text);
        $li.append($a);
        /*$li.addClass("navi-btn");
        $li.on("mouseover", function () {
            $li.addClass("navi-btnhover");
        });
        $li.on("mouseout", function () {
            $li.removeClass("navi-btnhover");
        });*/
        $li.on("click", function () {
            parent.left.loadMenu(menu_level_1.id, 2);
        });
        $ul.append($li);

        return $li;
    };


    /**
     * 根据一菜单对象创建对应的子菜单容器
     * 用于存储该一级菜单下的二、三级菜单
     * 所有容器存放在<div id="sub_menu_container"></div>里面
     *
     * @param menu_level_1一级菜单对象
     * @returns 子菜单容器DOM对象
     */
    function addSubMenuContainer(menu_level_1) {
        var $container = rdcp.id("sub_menu_container");
        var $menuContainer = $("<DIV>");
        $menuContainer.addClass("lowernav");
        $menuContainer.attr("id", "sub_menu_container_" + menu_level_1.id);
        $menuContainer.html("<table cellspacing='0'>" +
            "<tr>" +
            //"<td class='leftfarme'></td>" +
            "<td class='middle'>" +
            "<table><tr></tr></table>" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "</table>");

        $container.append($menuContainer);

        return $menuContainer;
    };

    /**
     * 给一级菜单的DOM对象（即<li>）添加显示子菜单容器显示事件
     * @param $li 一级菜单的DOM对象
     * @param $subMenuContainer 子菜单容器DOM对象
     */
    function addSubMenuContainerTips($li, $subMenuContainer) {
        rdcp.tooltip($li, {
            content: $subMenuContainer,
            //hideEvent: 'none',
            onShow: function () {
                var t = $(this);
                var state = t.tooltip('tip');
                state.css({
                    left: $(this).position().left + 8,
                    top: $(this).position().top + $(this).outerHeight() + 8
                });
                state.find(".tooltip-arrow-outer").css('margin-left', "-" + (state.width() / 2 - $(this).width() / 2 + 18) + "px");
                state.find(".tooltip-arrow").css('margin-left', "-" + (state.width() / 2 - $(this).width() / 2 + 18) + "px");
                t.tooltip('tip').unbind().bind('mouseenter',function () {
                    t.tooltip('show');
                }).bind('mouseleave', function () {
                        t.tooltip('hide');
                    });
            }
        });
    };

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
                state.find(".tooltip-arrow-outer").css('margin-left', (state.width() / 2 - $(this).width() / 2) + "px");
                state.find(".tooltip-arrow").css('margin-left', (state.width() / 2 - $(this).width() / 2) + "px");
                t.tooltip('tip').unbind().bind('mouseenter',function () {
                    t.tooltip('show');
                }).bind('mouseleave', function () {
                        t.tooltip('hide');
                    });
            }
        });
    };

    function addMenu_level_2(menu_level_2, isLastMenu, $subMenuContainer) {

        var html = "<td class='menuListContainer'>" +
            "<ul>" +
            "<li><h4>" + menu_level_2.text + "</h4></li>" +
            "</ul>" +
            "</td>";

        var $menuListContainer = $(html);

        if (!isLastMenu) {
            $menuListContainer.addClass("rightline");
        }

        $subMenuContainer.find(".middle > table > tbody > tr").append($menuListContainer);
    };

    function addMenu_level_3(menu_level_3, $subMenuContainer) {
        var html = "<li>" +
            "<table>" +
            "<tr>" +
            "<td class='collectTd'></td>" +
            "<td class='menuTd'></td>" +
            "</tr>" +
            "</table>" +
            "</li>";

        var $menuContainer = $(html);

        var $collectA = $("<A>");
        $collectA.attr("href", "javascript:void(0)");
        $collectA.addClass("collect");
        $menuContainer.find(".collectTd").append($collectA);
        $collectA.on("click", function () {
            alert("菜单收藏功能暂未实现");
        });

        var $menuA = $("<A>");
        $menuA.css("cursor", "pointer");
        $menuA.attr("href", "javascript:void(0)");
        $menuA.html(menu_level_3.text);
        $menuContainer.find(".menuTd").append($menuA);
        $menuA.on("click", function () {
            rdcp.menu.lowerNavMenuBuilder.openPage(menu_level_3.id, menu_level_3.text, menu_level_3.attributes.menuurl, true);
        });
        $menuA.on("mouseover", function () {
            $collectA.addClass("collectHover");
        });
        $menuA.on("mouseout", function () {
            $collectA.removeClass("collectHover");
        });

        $subMenuContainer.find(".middle .menuListContainer").last().find("ul").append($menuContainer);
    };


};

rdcp.menu.lowerNavMenuBuilder.openPage = function (id, title, url, closable) {

    var iframeId = "page_frame_" + id;

    $("iframe[id^='page_frame_']").hide();

    if (rdcp.isDOMExists(iframeId)) {
        rdcp.id(iframeId).show();
    } else {							
        var $iframeContainer = rdcp.id("pageFrameContainer");

        var $page_frame = $("<IFRAME>");
        $page_frame.attr("id", iframeId);
        $page_frame.attr("title", title);
        $page_frame.attr("src", url);
        $page_frame.addClass("pageFrame");

        $iframeContainer.append($page_frame);


        var $pageOpenerContainer = $("<DIV>");
        $pageOpenerContainer.addClass("projectbuttom");
        $pageOpenerContainer.on("mouseover", function () {
            $pageOpenerContainer.addClass("projectbuttom_hover");
        });
        $pageOpenerContainer.on("mouseout", function () {
            $pageOpenerContainer.removeClass("projectbuttom_hover");
        });

        var $openerA = $("<A>");
        $openerA.attr("href", "javascript:void(0)");
        $openerA.attr("id", "open_menu_"+id);
        $openerA.css("width", "130px");
        $openerA.html(title);
        $openerA.on("click", function () {
        	//rdcp.id("main").hide();
            parent.$("#body_page").hide();
            parent.$("#pageFrameContainer").show();
            $("iframe[id^='page_frame_']").hide();
            rdcp.id("page_frame_" + id).show();
            parent.clickMenuMark(id);
        });
        $pageOpenerContainer.append($openerA);

        if (closable) {
            var $closerA = $("<A>");
            $closerA.attr("href", "javascript:void(0)");
            $closerA.addClass("close");
            $closerA.on("click", function () {
                $(this).parent().remove();
                var $iframe = rdcp.id("page_frame_" + id);
                /*$iframe.prev().show(); */
                $iframe.remove();

                parent.closeMenuMark(id);
            });
            $pageOpenerContainer.append($closerA);
        }

        rdcp.id("opened_page_list").append($pageOpenerContainer);
    }
};
