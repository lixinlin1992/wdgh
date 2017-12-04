/**
 * 公用函数库
 * 依赖core.js
 */
var COMMON = {};

//装载CSS
loadCSS("themes/default/css/jquery.autocomplete.css");


//装载script
loadScript("scripts/upload/ajaxfileupload.js");


function _split(val) {
    return val.split(/,\s*/);
}

function _extractLast(term) {
    return _split(term).pop();
}

/**
 * 创建通用自动完成下拉框
 * @param {Object} options
 *
 * options参数内容
 * inputName 要关联的输入框
 * tname  查询的表名
 * lcol  用于显示的字段
 * vcol 用于值的字段
 * scol 用于查询的字段
 * ocol 用于排序的字段
 * otype 排序类型
 *
 */
COMMON.autocomplete = function (options) {
    $("input[name='" + options["inputName"] + "']").autocomplete({
        source:function (request, response) {
            var val = $("input[name='" + options["inputName"] + "']").val();
            val = (options["multi"] || true) ? _extractLast(val) : val;
            var ds = options["datasource"] || "DS_COMMON_AUTOCOMPLETE";
            var params;
            if ("DS_COMMON_AUTOCOMPLETE" == ds) {
                params = "tname=" + options["tname"] + "&lcol=" + options["lcol"]
                        + "&vcol=" + options["vcol"] + "&scol=" + (options["scol"] || options["inputName"] )
                        + "&sval=" + val;
            } else {
                params = options["inputName"] + "=" + val + "&" + options["data"];
            }
            CORE.request(ds, {data:params,disableInput:false}, function (data, textStatus) {
                response($.map(data, function (item) {
                    return {
                        label:unescape(item.label),
                        value:unescape(item.value)
                    }
                }));
            });
        },
        minLength:options["min"] || 2,
        select:options["select"] || function (event, ui) {
            var terms = _split(this.value);
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push(ui.item.label);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            this.value = terms.join(", ");
            return false;
        },
        search:function () {
            // custom minLength
            var term = _extractLast(this.value);
            if (term.length < (options["min"] || 2)) {
                return false;
            }
        },
        open:function () {
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close:function () {
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        },
        focus:function () {
            // prevent value inserted on focus
            return false;
        }
    });
};

COMMON.upload = function (options, callback) {
    jQuery("body").showLoading({'addClass':'loading-indicator-bars'});
    $.ajaxFileUpload({
        url:options['url'],
        formName:options['formName'],
        dataType:options['dataType'] || 'json',

        success:options['success'] || function (data, status) {
            if (callback == undefined) {
                if (data.header.code != 0 && data.header.code <= 2000) {
                    CORE.error(data.header.message, unescape(data.body.toString()));
                } else {
                    CORE.info("上传成功");
                }
            } else {
                if (data.header.code != 0 && data.header.code <= 2000) {
                    CORE.error(data.header.message, unescape(data.body.toString()));
                } else {
                    callback(data.body, data.header);
                }
            }
        },
        error:options['error'] || function (data, status, e) {
            CORE.error("上传失败", unescape(e.stack));
            jQuery('body').hideLoading();
        },
        complete:options['complete'] || function () {
            jQuery('body').hideLoading();
        }
    });
};


String.prototype.replaceAll = function (findStr, repStr) {
    var srchNdx = 0;  // srchNdx will keep track of where in the whole line
    // of oldStr are we searching.
    var newStr = "";  // newStr will hold the altered version of oldStr.
    while (this.indexOf(findStr, srchNdx) != -1)
        // As long as there are strings to replace, this loop
        // will run.
    {
        newStr += this.substring(srchNdx, this.indexOf(findStr, srchNdx));
        // Put it all the unaltered text from one findStr to
        // the next findStr into newStr.
        newStr += repStr;
        // Instead of putting the old string, put in the
        // new string instead.
        srchNdx = (this.indexOf(findStr, srchNdx) + findStr.length);
        // Now jump to the next chunk of text till the next findStr.
    }
    newStr += this.substring(srchNdx, this.length);
    // Put whatever's left into newStr.
    return newStr;
};

String.prototype.trim = function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
};


//获得cookie
/*function getCookie(c_name) {
	 var name = escape(c_name);
	    //读cookie属性，这将返回文档的所有cookie
	    var allcookies = document.cookie;
	    //查找名为name的cookie的开始位置
	    name += "=";
	    var pos = allcookies.indexOf(name);
	    //如果找到了具有该名字的cookie，那么提取并使用它的值
	    if(pos != -1){                                      //如果pos值为-1则说明搜索"version="失败
	        var start = pos + name.length;                  //cookie值开始的位置
	        var end = allcookies.indexOf(";",start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
	        if (end == -1) end = allcookies.length;   //如果end值为-1说明cookie列表里只有一个cookie
	        var value = allcookies.substring(start,end); //提取cookie的值
	        return unescape(value);                         //对它解码
	    }else
	  return "";          //搜索失败，返回空字符串
}*/

//将用户名和密码写入cookie
function setCookies(c_name, c_value, hours, path) {
	    var expires = new Date();
	    expires.setTime(expires.getTime() + hours*3600000);
	    path = path == "" ? "" : ";path=" + path;
	    _expires = (typeof hours) == "string" ? "" : ";expires=" + expires.toUTCString();
	    document.cookie = c_name + "=" + c_value + _expires + path;
}

//删除cookie
function delCookies(c_name,path) {
	    var expires = new Date(0);
	    path = path == "" ? "" : ";path=" + path;
	    document.cookie = c_name + "="+ ";expires=" + expires.toUTCString() + path;
}

//seleect控件的一些扩展

//jquery的扩展
(function ($) {
    /**
     * 将选中的选项移动到目标下拉框
     * 操作对象：select元素
     * @param target
     */
    $.fn.moveSelectedTo = function (target) {
        //TODO: 暂不实现
    };
    /**
     * 将选中的选项复制到目标下拉框
     * 操作对象：select元素
     * @param target
     */
    $.fn.copySelectedTo = function (target,processor) {
        var $_self = $(this);
        var $_target = $(target);
        //获取选中的option
        $_self.find("option:selected").each(function(i,n){
            if($_target.find("option[value='" + $(n).val() + "']").length>0)
                return;
            var _clone_opt = $(n).clone();
            if(processor != undefined && (!processor(n,_clone_opt)))
                return;
            $_target.append(_clone_opt);
        });
    };

    /**
     * 将表单的数据转换为一个map，多个同名的元素将作为一个数组
     * 操作对象：form元素
     * 格式为：
     * {
     * "a":"1",
     * "b":["2","3"],
     * ......
     * }
     */
    $.fn.toMap = function () {
        var businessForm = $(this);
        var businessFormDataArray = businessForm.serializeArray();
        var businessFormDataMap = {};
        //将数组转换为map
        $.each(businessFormDataArray, function (i, n) {
            var _tmp_name = n["name"];
            var _tmp_ = businessFormDataMap[_tmp_name];
            if (_tmp_ != undefined) {
                //已经存在元素了，将这个元素的值转换为数组
                if (_tmp_.length) {
                    _tmp_.push(n["value"]);
                } else {
                    var _tmp_array = [];
                    _tmp_array.push(_tmp_);
                    _tmp_array.push(n["value"]);
                    businessFormDataMap[_tmp_name] = _tmp_array;
                }
            } else {
                businessFormDataMap[_tmp_name] = n["value"];
            }
        });
        return businessFormDataMap;
    };
})(jQuery);