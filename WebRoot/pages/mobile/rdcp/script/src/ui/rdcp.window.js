/**
 * 默认窗口参数
 */
rdcp.windowDefaults = {
    // 标题
    title: rdcp.lang.title,
    // 宽度
    width: 500,
    // 高度
    height: 300,
    // 引用某个页面
    href: null,
    // 是否模态
    modal: true,
    // 能否折叠
    collapsible: true,
    // 能否调整大小
    resizable: true,
    // 能否拖拽
    draggable: true,
    // 能否最小化
    minimizable: false,
    // 能否最大化
    maximizable: true,
    // 能否关闭
    closable: true,
    //初始化时是关闭状态
    closed: true
};

/**
 * 属性转换器<br />
 * 每个对象都必须有一个对应的转换器,如果不需要转换,则将转换器初始化为空数组
 * @type {Array}
 */
rdcp.windowAdapter = [];

/**
 * 初始化窗口对象,参数详情参考rdcp.windowDefaults
 * @param p {*}
 */
rdcp.window = function (p) {
    var $win = rdcp.id(p.id);
    var titleTmp = p.title;
    p.title = "<center>" + titleTmp + "</center>";
    var settings = rdcp.extend({}, rdcp.windowDefaults, p);
    settings = rdcp.adapt(settings, rdcp.windowAdapter);
    $win.window(settings);
};

/**
 * 显示窗口
 * @param id 弹出窗口的ID
 * @param p {*}
 */
rdcp.window.open = function (id, p) {
    var $win = rdcp.id(id);
    $win.window('open');
};

/**
 * 关闭窗口
 * @param id 窗口ID
 * @param p {*}
 */
rdcp.window.close = function (id, p) {
    var $win = rdcp.id(id);
    $win.window('close');
};

/**
 *  窗口刷新
 * @param id  窗口ID
 * @param p 参数
 * @param url  刷新所请求的地址
 */
rdcp.window.refresh = function (id, p, url) {
    var $win = rdcp.id(id);
    if (url == '' || url == null) {
        url = '#';
    }
    $win.window('refresh', url);
};


rdcp.panel = {};
/**
 * <pre>
 *     让EasyUI的panel加载指定的页面
 * </pre>
 *
 * @param id 容器Id
 * @param url 路径
 * @param formId 表单Id
 * @param p 扩展参数
 */
rdcp.panel.load = function (id, url, formId, p) {
    var tmp = "t=" + new Date().getTime();
    if (formId)
        tmp += "&" + $("#" + formId).serialize();
    url = url.indexOf("?") > -1 ? url + "&" + tmp : url + "?" + tmp;
    $("#" + id).panel('refresh', url);
}