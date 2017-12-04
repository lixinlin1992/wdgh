/**
 * 判断传入的对象是否数组
 * @param obj
 * @return {*|Boolean}
 */
rdcp.isArray = function (obj) {
    return $.isArray(obj);
};

/**
 * 通用遍历方法，可用于例遍对象和数组。
 * @param target 需要遍历的对象或数组
 * @param callback 每个成员/元素执行的回调函数。
 */
rdcp.each = function (target, callback) {
    $(target).each(callback);
};