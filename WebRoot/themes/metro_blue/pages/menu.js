/**
 * Created by TanYucheng 13-2-5 上午7:03
 * CopyRight 2013 Sunrise.  All rights reserved
 *
 *
 */

/**
 * 文件描述：菜单的封装
 *
 * @author TanYucheng
 */

var MENU = {
    version: "0.1", //表格版本
    provider: "jqMenu"//表格提供者
};

Function.prototype.binding = function () {
    if (arguments.length < 2 && typeof arguments[0] == "undefined") return this;
    var __method = this, args = jQuery.makeArray(arguments), object = args.shift();
    return function () {
        return __method.apply(object, args.concat(jQuery.makeArray(arguments)));
    }
}

var Class = function (subclass) {
    subclass.setOptions = function (options) {
        this.options = jQuery.extend({}, this.options, options);
        for (var key in options) {
            if (/^on[A-Z][A-Za-z]*$/.test(key)) {
                $(this).bind(key, options[key]);
            }
        }
    }
    var fn = function () {
        if (subclass._init && typeof subclass._init == 'function') {
            this._init.apply(this, arguments);
        }
    }
    if (typeof subclass == 'object') {
        fn.prototype = subclass;
    }
    return fn;
}

var MenuTopLayerClass = "menutopTriangleLayer";//菜单小三角弹出层容器的class名称
var MenuLayerClass = "menuPopLayer";//菜单弹出层容器的class名称
var MenuNavClass = "navi-btn";//菜单导航li的Class名称。

var IFrames = new Object();
IFrames.parentDiv = [];//父容器ID
IFrames.contentId = [];//iframe ID
IFrames.url = []; //iframe 及列表跳转URL
IFrames.note = [];//LI列表内容
IFrames.listname = [];//LI列表ID
IFrames.isAct = [];//是否为当前活动Frame
var maxHeight = 230;

var MenuPopLayer = new Class({
    options: {
        trigger: null, //触发的元素或id,必填参数
        popupBlk: null, //弹出内容层元素或id,必填参数
        popupTop: null, //顶部小三角元素或id，必填参数
        closeBtn: null, //关闭弹出层的元素或id
        menuTopLayer: null, //小三角弹出层容器的ID名称
        menuLayer: null, //弹出层容器的ID名称
        popupTopLayerClass: MenuTopLayerClass, //小三角弹出层容器的class名称
        popupLayerClass: MenuLayerClass, //弹出层容器的class名称
        eventType1: "mouseenter", //触发事件的类型
        eventType2: "mouseleave",
        offsets: {                                //弹出层容器位置的调整值
            x: 0,
            y: 0
        },
        useFx: false, //是否使用特效
        useOverlay: false, //是否使用全局遮罩
        usePopupIframe: true, //是否使用容器遮罩
        isResize: true, //是否绑定window对象的resize事件
        isClick: true, //是否开启鼠标点击触发菜单事件
        onBeforeStart: function () {
        }            //自定义事件
    },
    _init: function (options) {
        this.setOptions(options);                //载入设置
        this.isSetPosition = this.isDoPopup = this.isOverlay = true;    //定义一些开关

        this.popupTopLayer = $(document.createElement("div")).addClass(this.options.popupTopLayerClass);     //初始化最外层容器
        this.popupTopIframe = $(document.createElement("iframe")).attr({border: 0, frameborder: 0});         //容器遮罩,用于屏蔽ie6下的select

        this.popupLayer = $(document.createElement("div")).addClass(this.options.popupLayerClass);     //初始化最外层容器
        this.popupIframe = $(document.createElement("iframe")).attr({border: 0, frameborder: 0});         //容器遮罩,用于屏蔽ie6下的select

        this.trigger = $(this.options.trigger);                         //把触发元素封装成实例的一个属性，方便使用及理解
        this.popupBlk = $(this.options.popupBlk);                       //把弹出内容层元素封装成实例的一个属性
        this.closeBtn = $(this.options.closeBtn);                       //把关闭按钮素封装成实例的一个属性

        this.popupTop = $(this.options.popupTop); //初始化顶部小三角

        $(this).trigger("onBeforeStart");                               //执行自定义事件。
        this._construct();                                               //通过弹出内容层，构造弹出层，即为其添加外层容器及底层iframe
        this.options.isClick ? this.trigger.bind("click", this._loadmenu.binding(this)) : null;
        this.trigger.bind(this.options.eventType1, this._loadmenu.binding(this));//给触发元素绑定触发事件
        this.trigger.bind(this.options.eventType2, this._loadmenu.binding(this));//给触发元素绑定触发事件

        this.popupBlk.bind(this.options.eventType1, this._loadmenu.binding(this));//给触发元素绑定触发事件
        this.popupBlk.bind(this.options.eventType2, this._loadmenu.binding(this));//给触发元素绑定触发事件

        this.popupTop.bind(this.options.eventType1, this._loadmenu.binding(this));//给触发元素绑定触发事件
        this.popupTop.bind(this.options.eventType2, this._loadmenu.binding(this));//给触发元素绑定触发事件

        this.options.isResize ? $(window).bind("resize", this.doresize.binding(this)) : null;
        this.options.closeBtn ? this.closeBtn.bind("click", this.close.binding(this)) : null;   //如果有关闭按钮，则给关闭按钮绑定关闭事件
    },
    _loadmenu: function () {                   //显示菜单
        if (this.isSetPosition) {
            this.setPosition(this.trigger.offset().left + this.options.offsets.x,
                    this.trigger.offset().top + this.trigger.get(0).offsetHeight + this.options.offsets.y);
        }
        this.options.useOverlay ? this._loadOverlay() : null;               //如果使用遮罩则加载遮罩元素
        (this.isOverlay && this.options.useOverlay) ? this.overlay.show() : null;
        if (this.isDoPopup && (this.popupLayer.css("display") == "none")) {
            this.open();
        } else {
            this.close();
        }
    },
    _construct: function () {                  //构造弹出层
        //alert("构造弹出层")
        this.popupTop.show();
        this.popupBlk.show();
        this.popupTopLayer.append(this.popupTop.css({opacity: 1})).appendTo($(document.body)).css({position: "absolute", 'z-index': 2, width: this.popupTop.get(0).offsetWidth, height: this.popupTop.get(0).offsetHeight});
        this.popupLayer.append(this.popupBlk.css({opacity: 1})).appendTo($(document.body)).css({position: "absolute", 'z-index': 2, width: this.popupBlk.get(0).offsetWidth, height: this.popupBlk.get(0).offsetHeight});

        this.options.usePopupIframe ? (this.popupTopLayer.append(this.popupTopIframe), this.popupLayer.append(this.popupIframe)) : null;
        this.recalculatePopupIframe();

        this.popupTopLayer.hide();
        this.popupLayer.hide();

    },
    _loadOverlay: function () {                //加载遮罩
        pageWidth = ($.browser.version == "6.0") ? $(document).width() - 21 : $(document).width();
        this.overlay ? this.overlay.remove() : null;
        this.overlay = $(document.createElement("div"));
        this.overlay.css({position: "absolute", "z-index": 1, left: 0, top: 0, zoom: 1, display: "none", width: pageWidth, height: $(document).height()}).appendTo($(document.body)).append("<div style='position:absolute;z-index:2;width:100%;height:100%;left:0;top:0;opacity:0.3;filter:Alpha(opacity=30);background:#000'></div><iframe frameborder='0' border='0' style='width:100%;height:100%;position:absolute;z-index:1;left:0;top:0;filter:Alpha(opacity=0);'></iframe>")
    },
    doresize: function () {
        this.overlay ? this.overlay.css({width: ($.browser.version == "6.0") ? $(document).width() -
                21 : $(document).width(), height: ($.browser.version == "6.0") ? $(document).height() -
                4 : $(document).height()}) : null;
        if (this.isSetPosition) {
            this.setPosition(this.trigger.offset().left + this.options.offsets.x,
                    this.trigger.offset().top + this.trigger.get(0).offsetHeight + this.options.offsets.y);
        }
    },
    setPosition: function (left, top) {          //通过传入的参数值改变弹出层的位置
        this.popupTopLayer.css({left: left, top: top - 6});
        var winwidth = $(document).width();
        var blkwidth = left + this.popupIframe.width();
        if (winwidth < blkwidth) {
            this.popupLayer.css({left: winwidth - this.popupIframe.width() - 21, top: top});
        } else {
            this.popupLayer.css({left: left, top: top});
        }
    },
    doEffects: function (way) {                //做特效
        way ==
                "open" ? (this.popupTopLayer.show(), this.popupLayer.show("fast")) : (this.popupLayer.hide("slow"), this.popupTopLayer.hide("slow"));

    },
    recalculatePopupIframe: function () {     //重绘popupIframe,这个不知怎么改进，只好先用这个笨办法。
        this.popupTopIframe.css({position: "absolute", 'z-index': -1, left: 0, top: 0, opacity: 0, width: this.popupTop.get(0).offsetWidth, height: this.popupTop.get(0).offsetHeight});

        this.popupIframe.css({position: "absolute", 'z-index': -1, left: 0, top: 0, opacity: 0, width: this.popupBlk.get(0).offsetWidth, height: this.popupBlk.get(0).offsetHeight});
    },
    open: function () {
        MENU.close();
        this.options.useFx ? this.doEffects("open") : (this.popupTopLayer.show(), this.popupLayer.show());
    },
    close: function () {                      //关闭方法
        this.options.useOverlay ? this.overlay.hide() : null;
        this.options.useFx ? this.doEffects("close") : (this.popupLayer.hide(), this.popupTopLayer.hide());
    }
});

MENU.buildMenu = function (divName, data) {
    //如果没有加 # 则自动添加
    divName = ($.trim(divName).indexOf("#") == 0 ? "" : "#") + divName;
    var $ul = $("<ul></ul>");
    $(divName).append($ul);
    for (var i = 0; i < data.length; i++) {
        $ul.append("<li class='" + MenuNavClass +
                "' onmouseover='this.className=&quot;navi-btnhover&quot;' onmouseout='this.className=&quot;" +
                MenuNavClass + "&quot;' id='menu_top_" + data[i].id + "'>" + unescape(data[i].name) + "</li>");
        /*
         CORE.request("DS_USER_MENU", {block: "false", data: "parent_id=" + data[i].id}, function (resp) {
         });
         */
        MENU.subMenu(divName, data[i].id);
    }

    /*
     var html = "<ul>";
     for (var i = 0; i < data.length; i++) {
     if (SecondaryMenuList[data[i].id] != undefined) {
     html += "<li class='" + MenuNavClass + "' onmouseover='this.className=&quot;navi-btnhover&quot;' onmouseout='this.className=&quot;" + MenuNavClass + "&quot;' id='menu_top_" + data[i].id + "'>" + unescape(data[i].name) + "</li>";
     }
     }
     html += "</ul>"

     //如果没有加 # 则自动添加
     divName = ($.trim(divName).indexOf("#") == 0 ? "" : "#") + divName;
     $(divName).append(html);

     for (var i = 0; i < data.length; i++) {
     MENU.subMenu(divName, data[i].id);
     }
     */

    $(".navi-right").hover(function () {
        //alert("123");
        var $container = $(this);

        var offset = $container.offset();
        //alert(offset.top+30);
        $("#open_menu_list").css({left: $(document).width() - 160, top: offset.top + 36});
        $("#open_menu_list").show();

    }, function () {
        $("#open_menu_list").hide();
    });

    $("#open_menu_list").hover(function () {
        var $container = $(this);
        $container.show();
    }, function () {
        $("#open_menu_list").hide();

    });

    //历史菜单滚动，未调试通过
    /*$("#open_menu_list").hover(function () {
     var $container = $(this),
     $list = $container.find("ul"),
     height = IFrames.parentDiv.length*40*1.1,// 确保底部有足够的空间
     multiplier = height / maxHeight;     // 如果列表越高，倍数越大
     $container.show();
     // 需要原始高度，当mouseout恢复
     $container.data("origHeight", 40);

     // 设置下拉菜单列表出现位置
     $list
     .css({
     paddingTop:$container.top
     });

     // 如果列表高度小于最大值就不做任何事情
     if (multiplier > 1) {
     $container
     .css({
     height: maxHeight,
     overflow: "hidden"
     })
     .mousemove(function(e) {
     var offset = $container.offset();

     var relativeY = ((e.pageY - offset.top) * multiplier) - ($container.data("origHeight") * multiplier);
     if (relativeY > $container.data("origHeight")) {
     $list.css("top", -relativeY + $container.data("origHeight"));
     };
     });
     }

     }, function() {

     var $el = $(this);

     // 恢复正常
     $el
     .height($(this).data("origHeight"))
     .find("ul")
     .css({ top: 0 })
     .end()

     $("#open_menu_list").hide();

     });*/
};

MENU.subMenu = function (divName, menuId) {
    if (!document.getElementById("trg_" + menuId)) {
        var menudiv = " <div class='" + MenuLayerClass + "' id='" + MenuLayerClass + "_" + menuId
                + "' style='position: absolute; z-index: 2; height:202px; display: none;'>" +
                "<div id='blk_" + menuId + "' class='blk' style='width:600px;'>" +
                "<div class='head' style='width: 110px;'></div>" +
                "<div class='main' style='width: 600px;'>" +
                "<div class='cotegary'>" +
                "<div class='topmark'>" +
                "<div class='topleft'></div>" +
                "<div class='topright'></div>" +
                "</div><ul id='menu_ul_" + menuId + "'></ul><div class='bottommark'>" +
                "<div class='bottomleft'></div>" +
                "<div class='bottomright'></div>" +
                "</div>" +
                "</div>" +
                "</div></div></div>";

        var menutopdiv = "<div class='" + MenuTopLayerClass + "' id='" + MenuTopLayerClass + "_" + menuId +
                "' style='position: absolute; z-index: 2; height: 6px; width: 100px;display: none;'><div id='trg_"
                + menuId +
                "' class='trg' style='width:100px;opacity: 0.8;'><div class='head' style='width: 100px;'></div></div></div>";

        //如果没有加 # 则自动添加
        $(document.body).append(menutopdiv + menudiv);

        new MenuPopLayer({
            trigger: "#menu_top_" + menuId,
            popupBlk: "#blk_" + menuId,
            popupTop: "#trg_" + menuId,
            menuTopLayer: MenuTopLayerClass + "_" + menuId,
            menuLayer: MenuLayerClass + "_" + menuId,
            useFx: false,
            isClick: true,
            offsets: {x: 0, y: 0}
        });

        CORE.request("DS_USER_MENU", {block: "false", data: "parent_id=" + menuId}, function (resp) {
            if (resp != undefined && resp != null && resp.length) {
                for (var i = 0; i < resp.length; i++) {
                    $subUl3 = $("<ul id='sub_ul_2_" + resp[i]["id"] + "'></ul>");
                    $subLi = $("<li class='category-detail-item'><dl><dt>" + resp[i]["name"]
                            + "</dt><dd></dd></dl></li>");
                    $subLi.find("dd").append($subUl3);
                    $("#menu_ul_" + resp[i]["parent_id"]).append($subLi);
                    CORE.request("DS_USER_MENU", {block: "false", data: "parent_id=" + resp[i]["id"]},
                            function (resp3) {
                                for (var j = 0; j < resp3.length; j++) {
                                    $("#sub_ul_2_" + resp3[j]["parent_id"]).append("<li><a href='" + resp3[j]["url"] +
                                            "' target='contentFrame_"
                                            + resp3[j]["id"]
                                            + "' onclick='javascript:MENU.openIFrame(&quot;"
                                            + resp3[j]["id"]
                                            + "&quot;,&quot;" + resp3[j]["name"]
                                            + "&quot;,&quot;" + resp3[j]["url"]
                                            + "&quot;);'>" + resp3[j]["name"] + "</a></li>");
                                }
                            });
                }
            }
        });
        /*
         var secondmenudiv = function (id) {
         //加载二级菜单
         var str1 = "<ul>";
         for (var i = 0; i < SecondaryMenuList[id].body.length; i++) {

         var secondid = SecondaryMenuList[id].body[i].id;
         if (ThreeMenuList[secondid] != undefined) {
         str1 += "<li class='category-detail-item'><dl><dt>" + SecondaryMenuList[id].body[i].name
         + "</dt>" + "<dd><ul>";

         //加载三级菜单
         for (var j = 0; j < ThreeMenuList[secondid].body.length; j++) {
         str1 += "<li><a href='" + ThreeMenuList[secondid].body[j].url + "' target='contentFrame_"
         + ThreeMenuList[secondid].body[j].id
         + "' onclick='javascript:MENU.openIFrame(&quot;"
         + ThreeMenuList[secondid].body[j].id
         + "&quot;,&quot;" + ThreeMenuList[secondid].body[j].name
         + "&quot;,&quot;" + ThreeMenuList[secondid].body[j].url
         + "&quot;);'>" + ThreeMenuList[secondid].body[j].name + "</a></li>";
         }
         str1 += "</ul></dd></dl></li>";
         }
         }
         ;
         str1 += "</ul>";
         return str1;
         }

         var menutopdiv = "<div class='" + MenuTopLayerClass + "' id='" + MenuTopLayerClass + "_" + menuId
         + "' style='position: absolute; z-index: 2; height: 6px; width: 100px;display: none;'><div id='trg_"
         + menuId +
         "' class='trg' style='width:100px;opacity: 0.8;'><div class='head' style='width: 100px;'></div></div></div>";

         var menudiv = " <div class='" + MenuLayerClass + "' id='" + MenuLayerClass + "_" + menuId
         + "' style='position: absolute; z-index: 2; height:202px; display: none;'>" +
         "<div id='blk_" + menuId + "' class='blk' style='width:600px;'>" +
         "<div class='head' style='width: 110px;'></div>" +
         "<div class='main' style='width: 600px;'>" +
         "<div class='cotegary'>" +
         "<div class='topmark'>" +
         "<div class='topleft'></div>" +
         "<div class='topright'></div>" +
         "</div>" + secondmenudiv(menuId) +

         "<div class='bottommark'>" +
         "<div class='bottomleft'></div>" +
         "<div class='bottomright'></div>" +
         "</div>" +
         "</div>" +
         "</div></div></div>";

         //如果没有加 # 则自动添加
         divName = ($.trim(divName).indexOf("#") == 0 ? "" : "#") + divName;
         $(document.body).append(menutopdiv + menudiv);

         new MenuPopLayer({
         trigger: "#menu_top_" + menuId,
         popupBlk: "#blk_" + menuId,
         popupTop: "#trg_" + menuId,
         menuTopLayer: MenuTopLayerClass + "_" + menuId,
         menuLayer: MenuLayerClass + "_" + menuId,
         useFx: false,
         isClick: true,
         offsets: {x: 0, y: 0}
         });
         */
    }
}

MENU.close = function () {
    $("." + MenuTopLayerClass).hide();
    $("." + MenuLayerClass).hide();//关闭页面上所有菜单元素
}

//打开三级菜单页面
MENU.openIFrame = function (id, name, url, canClose) {
    var count = $.inArray("content_" + id, IFrames.parentDiv);//判断是否已经打开。
    if (count < 0)//小于0为没有打开
    {
        var frameid = "contentFrame_" + id;
        var divid = "content_" + id;
        var openmenulist = "open_menu_list_" + id;

        var contentiframediv = "<div id='" + divid + "' class='content' style='width: 100%;height:100%'></div>";
        var $contentiframediv = $(contentiframediv);//创建DOM对象
        var $contentiframe = $(document.createElement("iframe")).attr({id: frameid, src: url, class: "contentFrame", border: 0, frameborder: 0, style: "width:100%;height:100%"});         //容器遮罩,用于屏蔽ie6下的select

        var $contentdiv = $("#contentParent");   //获取UL对象
        $contentiframediv.append($contentiframe); //将$htmlLi追加到$ul元素的li列表
        $contentdiv.append($contentiframediv);

        var addli = "<li id='" + openmenulist + "'><div id='open_menu_" + id
                + "' class='projectbuttom'"
                + " onmouseover='this.className=&quot;projectbuttom_hover&quot;'"
                + " onmouseout='this.className=&quot;projectbuttom&quot;'"
                + ">"
            /*+ "<a class='openlink' href='" + url + "' target='" + frameid + "'>" + name + "</a>"*/
                + "<a class='openlink' href='#' onclick='MENU.showFrame(&quot;"
                + divid + "&quot;);return false;'>" + name + "</a>"
                + (canClose == undefined || canClose ? ("<a class='close' href='#' target='" + frameid +
                "' onclick='MENU.removeFrame(&quot;"
                + frameid + "&quot;);return false;'></a></div></li>") : "");

        var $htmlLi = $(addli);  //创建DOM对象
        var $ul = $(".sub_menu");   //获取UL对象
        $ul.append($htmlLi); //将$htmlLi追加到$ul元素的li列表

        IFrames.parentDiv.push(divid);
        IFrames.contentId.push(frameid);
        IFrames.listname.push(openmenulist);
        IFrames.url.push(url);
        IFrames.note.push(name);
        for (var i = 0; i < IFrames.isAct.length; i++) {
            IFrames.isAct[i] = false;
        }
        IFrames.isAct.push(true);
    } else {
        for (var i = 0; i < IFrames.isAct.length; i++) {
            if (i != count) {
                IFrames.isAct[i] = false;
            } else {
                IFrames.isAct[i] = true;
            }
        }
    }
    MENU.changeFrameStatic();
}

//移除指定Frame
MENU.removeFrame = function (frameid) {
    var count = $.inArray(frameid, IFrames.contentId);

    //解决JQUERY 无法删除IFrame问题
    var el;
    while ((el = document.getElementById(IFrames.contentId[count])).length) {
        el[0].parentNode.removeChild(el[0]);
    }
    $("#" + IFrames.listname[count]).remove();
    $("#" + IFrames.parentDiv[count]).remove();

    IFrames.parentDiv.splice(count, 1);
    IFrames.contentId.splice(count, 1);
    IFrames.listname.splice(count, 1);
    IFrames.url.splice(count, 1);
    IFrames.note.splice(count, 1);
    IFrames.isAct.splice(count, 1);

    var actframenum = IFrames.contentId.length;
    if (actframenum > 0) {
        for (var i = 0; i < actframenum - 1; i++) {
            IFrames.isAct[i] = false;
        }
        IFrames.isAct[actframenum - 1] = true;
    }
    MENU.changeFrameStatic();
}

//显示指定Frame
MENU.showFrame = function (id) {
    var count = $.inArray(id, IFrames.parentDiv);
    //alert(count);
    for (var i = 0; i < IFrames.parentDiv.length; i++) {
        if (i == count) {
            IFrames.isAct[i] = true;
        } else {
            IFrames.isAct[i] = false;
        }
    }
    MENU.changeFrameStatic();
}

/*改变Frame的状态*/
MENU.changeFrameStatic = function () {
    _setFrameVisable = function (id, Actstatic) {
        var k = document.getElementById(id);
        if (Actstatic) {
            k.style.display = '';
        } else {
            k.style.display = 'none';
        }
    }

//    if (IFrames.isAct.length == 0) {
//        _setFrameVisable("maincontent", true);
//    } else {
    _setFrameVisable("maincontent", false);
    for (var i = 0; i < IFrames.isAct.length; i++) {
        _setFrameVisable(IFrames.parentDiv[i], IFrames.isAct[i]);
    }
//    }
}

