/**
 * Created with jse7en.
 * User: jse7en
 * Date: 13-5-7
 * Time: 下午2:09
 */
rdcp.dialogDefault = {
    title: rdcp.lang.title,
    width: 500,
    height: 300,
    href: null,
    modal: true,        // 是否有遮蒙
    collapsible: true,  // 能否折叠
    resizable: true,    // 能否调整大小
    draggable: true,
    minimizable: false,
    maximizable: true,
    closable: true,
    buttons: []
};

rdcp.dialog = function (p) {
    var _dlg = rdcp.id(p.id);
    rdcp.dialogDefault.buttons = [
        {
            text: '取消',
//        iconCls: 'icon-r-no',
//        plain: true,
            handler: function () {
                rdcp.dialog.close(p.id);
            }
        }
    ];
    var _settings = rdcp.extend({}, rdcp.dialogDefault, p);
    rdcp.id(p.id).show();
    _dlg.dialog(_settings).dialog("open");
};

rdcp.dialog.show = function (id) {
    var _dlg = rdcp.id(id);
    _dlg.dialog("open");
};

rdcp.dialog.close = function (id) {
    var _dlg = rdcp.id(id);
    _dlg.dialog("close");
};

/**
 * 对话框
 * @param title
 * @param msg
 * @param fnc
 */
rdcp.confirm = function (title, msg, fnc) {
    if ($.messager) {
        $.messager.confirm(title, msg, fnc);
    } else {
        func(confirm(msg));
    }
};