/**
 * 对象适配器<br />
 * @param obj 需要适配的对象
 * @param adapter 适配器
 * @return {*} 适配后的对象
 */
rdcp.adapt = function (obj, adapter) {
    if (adapter != undefined) {
        for (var i = 0; i < adapter.length; i++) {
            obj[adapter[i].to] = obj[adapter[i].from];
            var iskeep = adapter[i].iskeep == undefined ? false : adapter[i].iskeep;
            if (iskeep == false) {
                obj[adapter[i].from] = undefined;
                obj[adapter[i].from] = null;
                delete obj[adapter[i].from];
            }
        }
    }
    return obj;
};

/**
 * 用一个或多个其他对象来扩展一个对象，返回被扩展的对象。
 * @param target 转换目标
 * @param obj1 待转换对象1
 * @param obj2 待转换对象2
 * @return {*} 转换后对象
 */
rdcp.extend = function (target, obj1, obj2) {
    return $.extend(target, obj1, obj2);
};