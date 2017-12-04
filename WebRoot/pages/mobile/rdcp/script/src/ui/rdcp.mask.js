rdcp.mask = function ($container, msg, p) {
    //kinz 2014-07-04 计算高度，令到遮罩可以覆盖整个页面，进度提示始终在中间
    var clientHeight = $container[0].clientHeight;
    if (clientHeight < window.screen.availHeight)
        clientHeight = window.screen.availHeight;

//    alert(clientHeight + "    " + scrollHeight+"   "+height);

    $('<div class="datagrid-mask" style="display:block;height: 100%;z-index: 9998;"></div>').appendTo($container).css("height",
            clientHeight);
    var msg = $('<div class="datagrid-mask-msg" style="display:block;left:50%;z-index: 9999;"></div>').html(msg).appendTo($container);
    msg.css('marginLeft', -msg.outerWidth() / 2);
    msg.css("top", "45%");
    p = p == undefined ? {} : p;
    p["msg_position"] = p["msg_position"] || "fixed";
    msg.css("position", p["msg_position"]);
};

rdcp.unmask = function ($container) {
    $container.children('div.datagrid-mask-msg').remove();
    $container.children('div.datagrid-mask').remove();
};