/**
 * Created by carl on 2015/7/4.
 * html保存本地数据数据接口
 */

var Local = {
    version: '1.01',
    note: '本地数据操作',
    author: 'carl'
};

/**
 * 保存数据到本地
 * @param key 键
 * @param data 字符串数据
 */
Local.saveStore = function (key, data) {//保存数据在本地
    var flag = false;
    if (key) {
        window.localStorage[key] = data;
        flag = true;
    }
    return flag;
}

/**
 * 获取本地数据
 * @param key 键
 * @returns {*}
 */
Local.getStore = function (key) {//获取当前存储对象
    return window.localStorage[key];
}

/**
 * 保存json对象数据
 * @param key 键
 * @param data json对象
 * @returns {boolean}
 */
Local.saveStoreJson = function (key, data) {//保存数据在本地json格式
    var flag = false;
    if (key && data) {
        Local.saveStore(key, JSON.stringify(data));
        flag = true;
    }
    return flag;
}

/**
 * 获取json数据
 * @param key 键
 * @returns {*}
 */
Local.getStoreJson = function (key) {//获取当前存储对象
    var obj = window.localStorage[key];
    if (obj != undefined && obj != 'undefined') {
        return jQuery.parseJSON(obj);
    }
    return null;
}

/**
 * 打开遮罩层
 * @param msg
 */
var mask = function (msg) {
    $("body").attr("style", "overflow-y:hidden");
    $("#shadeDiv").css("display", "block");
    $("#loadingDiv").css("display", "block");
    $("#loadingMessage").text(msg);
}

/**
 * 关闭遮罩层
 * @param msg
 */
var unmask = function () {
    $("body").removeAttr("style");
    $("#shadeDiv").css("display", "none");
    $("#loadingDiv").css("display", "none");
}
