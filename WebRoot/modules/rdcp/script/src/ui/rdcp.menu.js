rdcp.menu = function (id, ds, p) {

    if(rdcp.menuDefaults.menuBuilder == null || rdcp.menuDefaults.menuBuilder == undefined){
        alert("请指定rdcp.menuDefaults.menuBuilder" + "\n如：rdcp.menu.lowerNavMenuBuilder");
        return;
    }
    var $container = rdcp.id(id);
    rdcp.request(ds, null, function (data) {
        rdcp.menuDefaults.menuBuilder.build($container, data);
    });
};

rdcp.menu.openPage = function (id, title, url, closable, p) {
    rdcp.menuDefaults.menuBuilder.openPage(id, title, url, closable);
};

rdcp.menuAdapter = [];
rdcp.menuDefaults = {
    menuBuilder: null
};