/**
 * 将一个json数据对象转换为一个字符串
 * @param json
 */
rdcp.json2str = function (json) {
    try {
        return JSON.stringify(json);
    } catch (e) {
        return "";
    }
};

/**
 * 将经过escape的json对象中的内容 unescape
 * @param json
 */
rdcp.unescapeJson = function (json) {
    return rdcp.str2json(rdcp.json2str(json));
}

rdcp.isPlainObject = function (obj) {
    return $.isPlainObject(obj);
}