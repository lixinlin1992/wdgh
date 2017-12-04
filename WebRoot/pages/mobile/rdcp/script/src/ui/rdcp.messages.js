rdcp.messagesAdapter = [];
rdcp.messagesDefaults = {
    autoClose: true,
    autoCloseDelay: 5000
};

rdcp.messages = function (ds, params, p) {
    var settings = rdcp.extend({}, rdcp.dateBoxDefaults, p);
    settings = rdcp.adapt(settings, rdcp.dateBoxAdapter);
    settings.ds = ds;
    settings.params = params;

    rdcp.request(ds, params, function (data) {
        if (settings.handler) {
            settings.handler(data);
        } else {
            rdcp.each(data.body.row, function (i) {
                $.messager.show({
                    title: '系统消息',
                    msg: this.cell[3],
                    showType: 'show'
                });
            });
        }
    }, settings)

};

//window.alert = function (msg) {
//    $.messager.alert('系统消息', msg);
//}
//
//window.confirm = function (msg,fn) {
//     $.messager.confirm("操作提示",msg,fn);
//}