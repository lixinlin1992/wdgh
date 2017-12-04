rdcp.mask = function ($container, msg, p) {
    $('<div class="datagrid-mask" style="display:block"></div>').appendTo($container);
    var msg = $('<div class="datagrid-mask-msg" style="display:block;left:50%"></div>').html(msg).appendTo($container);
    msg.css('marginLeft', -msg.outerWidth() / 2);
};

rdcp.unmask = function ($container) {
    $container.children('div.datagrid-mask-msg').remove();
    $container.children('div.datagrid-mask').remove();
};