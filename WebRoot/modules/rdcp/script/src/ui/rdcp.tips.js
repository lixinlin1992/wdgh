rdcp.tipsAdapter = [];

rdcp.tipsDefaults = {
    showDelay: 0,
    hideDelay: 100,
    trackMouse: false
};

rdcp.tip = function (msg) {
    $.messager.show({
        title: '系统消息',
        msg: msg,
        showType: 'show'
    });
};

rdcp.tooltip = function ($target, p) {
    var settings = rdcp.extend({}, rdcp.tipsDefaults, p);
    settings = rdcp.adapt(settings, rdcp.tipsAdapter);
    $target.tooltip(settings);
};

rdcp.tooltip.lowerNavMenu = function ($target, menu, p) {
    rdcp.tooltip($target, {
        content: function () {
            return rdcp.id("sub_menu_list_" + menu.id);
        },
        hideEvent: 'none',
        onShow: function () {
            var t = $(this);
            var state = t.tooltip('tip');
            state.css({
                left: $(this).position().left + 8,
                top: $(this).position().top + $(this).outerHeight() + 8
            });
            state.find(".tooltip-arrow-outer").css('margin-left',
                    "-" + (state.width() / 2 - $(this).width() / 2 + 18) + "px");
            state.find(".tooltip-arrow").css('margin-left',
                    "-" + (state.width() / 2 - $(this).width() / 2 + 18) + "px");
            t.tooltip('tip').focus().unbind().bind('blur', function () {
                t.tooltip('hide');
            });
        }
    });
    return rdcp.id("sub_menu_list_" + menu.id);
};




