/**
 * @(#)security.help.js.js 11-5-21 下午3:03
 * CopyRight 2011.  All rights reserved
 *
 */
/**
 * 提供权限控制相关辅助
 *
 * 依赖于 temp/functions.js, user_function_$(id).js, menus.js 等运行时自动生成的脚本文件
 *
 * 开启功能权限控制，
 *
 * $(".security").securityCheck();
 *
 * <input type="button" class="security" function="1001" value="添加">
 * 如果这个按钮对应的功能当前用户没有权限，则不显示在页面当中
 *
 *
 * User: kinz
 */

(function($) {
    $.securityCheck = $.securityCheck || {};

    /**
     * 检查当前用户是否有权限使用指定id的功能
     * @param funcId
     */
    $.checkPermision = function(funcId) {
        //检查是否导入了用户功能授权脚本，如果没有导入，则不进行处理
        if (_USER_FUNCTIONS == undefined || _USER_FUNCTIONS == null || _ALL_FUNCTION == undefined ||
                _ALL_FUNCTION == null)
            return true;

        //如果没有指定功能ID，也不进行处理
        if (funcId == undefined || funcId == null)
            return true;

        //找到这个功能
        var func = _ALL_FUNCTION[funcId];
        //alert(func.n);
        //如果功能不需要授权，则也不进行处理
        if (func == null || func.a == '0') {
            return true;
        } else if (func.a == '1') {
            //普通授权，需要控制权限。如果没有权限，则隐藏这个控件
            return $.inArray(parseInt(funcId), _USER_FUNCTIONS) >= 0;
        } else if (func.a == '2') {
            //检查依赖功能的权限
            return $.checkPermision(func.d);
        } else {
            //不清楚的授权模式，不进行处理
            return true;
        }
    };

    $.fn.securityCheck = function() {

        $.each(this, function(i, n) {
            n = $(n);
            var funcId = n.attr("function");

            if (!$.checkPermision(funcId))
                n.hide();
        });
    };

})(jQuery);

//在装载完成后
$(document).ready(function() {
    $(".security").securityCheck();
});