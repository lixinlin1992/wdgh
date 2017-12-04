/**
 * @(#)rdcp.js.js 11-6-9 上午9:11
 * CopyRight 2011.  All rights reserved
 *
 */


/**
 * 快速开发配置平台核心脚本文件
 * 依赖 jsonPath
 * User: kinz
 */

var RDCP = {
    version :   "1.0",
    author  :   "Kinz Zhang",
    date    :   "2011-06-09"
};

var __SectorParams = {};

//在页面退出的时候清空参数缓存
$(window).bind('unload',
        function() {
            __SectorParams = {};
        }).trigger('unload');

/**
 * 调用Element的函数
 * @param id element的ID，对应模板中的code属性
 * @param name sector中的函数名称，如果为空则调用main函数
 * @param params 函数参数
 */
RDCP.invokeElement = function(id, name, param) {
    var _funcName = id + "." + name;
    try {
        var _function = eval("var _a="+_funcName+";_a;");
    } catch(e) {
        //可能不存在指定的函数，直接退出
        return null;
    }

    //缓存参数
    __SectorParams[_funcName] = param;

    if (typeof _function === 'function') {
        return _function(param);
    } else {
        //不是一个函数，不进行处理
        return null;
    }
};

/**
 * 获取参数
 * @param id sector的ID，对应模板中的code属性
 * @param exp 参数表达式，使用jsonPath语法，如果没有指定，则返回整个对象
 */
RDCP.getParameter = function(id, name, exp) {
    var _funcName = id + "." + name;
    if (exp == null || exp == undefined)
        return __SectorParams[_funcName];
    else
        return jsonPath(__SectorParams[_funcName], exp);
};

/**
 * 删除参数
 * @param id sector的ID，对应模板中的code属性
 * @param exp 参数表达式
 */
RDCP.removeParameter = function(id, name, exp) {
};
