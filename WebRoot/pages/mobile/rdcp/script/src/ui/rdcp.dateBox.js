rdcp.dateBoxAdapter = [];
rdcp.dateBoxDefaults = {
    fit: true,
    formatter: function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        return y + '-' + m + '-' + d;
    },
    parser: function (s) {
        var t = Date.parse(s);
        if (!isNaN(t)) {
            return new Date(t);
        } else {
            return new Date();
        }
    }
};

/**
 *日期格式，精确到天
 * @param id
 * @param p
 */
rdcp.dateBox = function (id, p) {
    var $dateBox = rdcp.id(id);
    var settings = rdcp.extend({}, rdcp.dateBoxDefaults, p);
    settings = rdcp.adapt(settings, rdcp.dateBoxAdapter);
    settings.width = $dateBox.parent().width();
    settings.height = $dateBox.parent().height();
    $dateBox.datebox(settings);
};


/**
 *日期格式，精确到时分秒
 * @param id
 * @param p
 */
rdcp.datetimeBox = function (id, p) {
    var $dateBox = rdcp.id(id);
    $dateBox.datetimebox(p);
};