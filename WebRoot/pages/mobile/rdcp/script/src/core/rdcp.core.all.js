/**
 * @(#)rdcp.code.all.js 14-10-10 上午9:19
 * CopyRight 2014.  All rights reserved
 *
 */
/**
 * User: Horizon
 *
 * 整合以下js
 *  'src/core/rdcp.json.js', 'src/core/rdcp.string.js', 'src/core/rdcp.array.js',
 *  'src/core/rdcp.dom.js', 'src/core/rdcp.adapter.js', 'src/core/rdcp.key.js'
 *
 */

//src/core/rdcp.json.js
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
};

rdcp.isPlainObject = function (obj) {
    return $.isPlainObject(obj);
};

/* JSONPath 0.8.0 - XPath for JSON
 *
 * Copyright (c) 2007 Stefan Goessner (goessner.net)
 * Licensed under the MIT (MIT-LICENSE.txt) licence.
 */
rdcp.jsonPath=function(obj, expr, arg) {
    var P = {
        resultType: arg && arg.resultType || "VALUE",
        result: [],
        normalize: function(expr) {
            var subx = [];
            return expr.replace(/[\['](\??\(.*?\))[\]']/g, function($0,$1){return "[#"+(subx.push($1)-1)+"]";})
                .replace(/'?\.'?|\['?/g, ";")
                .replace(/;;;|;;/g, ";..;")
                .replace(/;$|'?\]|'$/g, "")
                .replace(/#([0-9]+)/g, function($0,$1){return subx[$1];});
        },
        asPath: function(path) {
            var x = path.split(";"), p = "$";
            for (var i=1,n=x.length; i<n; i++)
                p += /^[0-9*]+$/.test(x[i]) ? ("["+x[i]+"]") : ("['"+x[i]+"']");
            return p;
        },
        store: function(p, v) {
            if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
            return !!p;
        },
        trace: function(expr, val, path) {
            if (expr) {
                var x = expr.split(";"), loc = x.shift();
                x = x.join(";");
                if (val && val.hasOwnProperty(loc))
                    P.trace(x, val[loc], path + ";" + loc);
                else if (loc === "*")
                    P.walk(loc, x, val, path, function(m,l,x,v,p) { P.trace(m+";"+x,v,p); });
                else if (loc === "..") {
                    P.trace(x, val, path);
                    P.walk(loc, x, val, path, function(m,l,x,v,p) { typeof v[m] === "object" && P.trace("..;"+x,v[m],p+";"+m); });
                }
                else if (/,/.test(loc)) { // [name1,name2,...]
                    for (var s=loc.split(/'?,'?/),i=0,n=s.length; i<n; i++)
                        P.trace(s[i]+";"+x, val, path);
                }
                else if (/^\(.*?\)$/.test(loc)) // [(expr)]
                    P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";")+1))+";"+x, val, path);
                else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
                    P.walk(loc, x, val, path, function(m,l,x,v,p) { if (P.eval(l.replace(/^\?\((.*?)\)$/,"$1"),v[m],m)) P.trace(m+";"+x,v,p); });
                else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
                    P.slice(loc, x, val, path);
            }
            else
                P.store(path, val);
        },
        walk: function(loc, expr, val, path, f) {
            if (val instanceof Array) {
                for (var i=0,n=val.length; i<n; i++)
                    if (i in val)
                        f(i,loc,expr,val,path);
            }
            else if (typeof val === "object") {
                for (var m in val)
                    if (val.hasOwnProperty(m))
                        f(m,loc,expr,val,path);
            }
        },
        slice: function(loc, expr, val, path) {
            if (val instanceof Array) {
                var len=val.length, start=0, end=len, step=1;
                loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0,$1,$2,$3){start=parseInt($1||start);end=parseInt($2||end);step=parseInt($3||step);});
                start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
                end   = (end < 0)   ? Math.max(0,end+len)   : Math.min(len,end);
                for (var i=start; i<end; i+=step)
                    P.trace(i+";"+expr, val, path);
            }
        },
        eval: function(x, _v, _vname) {
            try { return $ && _v && eval(x.replace(/@/g, "_v")); }
            catch(e) { throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a")); }
        }
    };

    var $ = obj;
    if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
        P.trace(P.normalize(expr).replace(/^\$;/,""), obj, "$");
        return P.result.length ? P.result : false;
    }
}
// 'src/core/rdcp.string.js',
/**
 * 去掉字符串起始和结尾的空格。
 * @param string
 * @return string
 */
rdcp.trim = function (string) {
    return $.trim(string);
};


rdcp.replaceAll = function (src, findStr, repStr) {
    var srchNdx = 0;
    var newStr = "";
    while (src.indexOf(findStr, srchNdx) != -1) {
        newStr += src.substring(srchNdx, src.indexOf(findStr, srchNdx));
        newStr += repStr;
        srchNdx = (src.indexOf(findStr, srchNdx) + findStr.length);
    }
    newStr += src.substring(srchNdx, src.length);
    return newStr;
};

/**
 * 把字符串转换成数组
 * @param string 需要转换成数组的字符串
 * @param separator 分隔符,默认为英文逗号
 * @return [obj1, obj2] 转换后的数组
 */
rdcp.string2Array = function (string, separator) {
    if (string == null)
        return null;

    var s = separator == undefined ? "," : separator;
    return string.split(s);
};

/**
 * 将一个字符串转换为一个JSON对象，并且将里面的数据进行unescape
 * @param str
 */
rdcp.str2json = function (str) {
    if (typeof str === 'string') {
//        str = rdcp.trim(unescape(str));
        str = rdcp.trim(str);
        if (str == "")
            return {};
    }

//    return JSON.parse(str);
    return JSON.parse(str, function (key, value) {
        if (typeof value === 'string')
            return unescape(value);
        return value;
    });
};

rdcp.format = {};

rdcp.format.phoneNumber = function (number) {
//    if (number.length != 11) {
//        alert("传入的手机号码长度不正确");
//        return null;
//    } 不做长度限制 2013/6/14
    if (number.length == 11) {
        var s0_3 = number.substr(0, 3);
        var s4_7 = number.substr(3, 4);
        var s7_11 = number.substr(7, 4);
        return s0_3 + " " + s4_7 + " " + s7_11;
    } else if (number.length == 12) {
        var s0_4 = number.substr(0, 4);
        var s5_8 = number.substr(4, 4);
        var s8_12 = number.substr(8, 4);
        return s0_4 + " " + s5_8 + " " + s8_12;
    }

};
// 'src/core/rdcp.array.js',
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
//'src/core/rdcp.dom.js',
/**
 * 查找Dom元素,表达式与jQuery.find()一样使用
 * @param exp
 * @return {*} jQuery对象
 */
rdcp.find = function (exp) {
    return jQuery.find(exp);
};

/**
 * 根据id查找Dom元素
 * @param id
 * @return {*} jQuery对象
 */
rdcp.id = function (id) {
    if (id.indexOf('#') == 0) {
        //包含#
        return $(jQuery.find(id)[0]);
    } else {
        //不包含#
        return $(jQuery.find("#" + id)[0]);
    }
};

/**
 * 根据name查找Dom元素
 * @param name
 * @return {*} jQuery对象
 */
rdcp.name = function (name) {
    return jQuery.find('*[name=' + name + ']');
};

/**
 * 根据className查找Dom元素
 * @param className
 * @return {*} jQuery对象
 */
rdcp.cls = function (cls) {
    return $("." + cls);
};

/**
 * 判断元素的id在DOM树里是否存在
 * @param id
 * @return {boolean} 是否存在
 */
rdcp.isDOMExists = function (id) {
    if ($("#" + id).length > 0) {
        return true;
    }
    return false;
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
rdcp.formToMap = function (formId) {
    var $form = rdcp.id(formId);
    var fields = $form.serializeArray();
    var data = {};
    //将数组转换为map
    rdcp.each(fields, function (index, field) {

        var fieldName = field['name'];
        var fieldValue = field['value'];

        if (data[fieldName]) {
            data[fieldName] = data[fieldName] + "," + fieldValue;
        } else {
            data[fieldName] = fieldValue;
        }
    });

    return data;
};

/**
 * 使input失效
 * @param disable 是否可用
 */
rdcp.disableInputs = function (disable) {
    if (disable)
        $(document.body).find(":input:enabled").addClass("auto_disabled").attr("disabled", "disabled");
    else {
        $(document.body).find(".auto_disabled").removeAttr("disabled");
    }
};

/**
 * 当前页面跳转
 *
 * @param url 地址
 * @param params 需要传递的参数
 * @param p 可扩展参数
 */
rdcp.go = function (url, params, p) {
    var baseurl = $($("base").get(0)).attr("href");

    if (url.indexOf("/") == 0) {
        url = url.substr(1, url.length);
    }

    window.location = baseurl + url;
};

/**
 * <pre>
 *     让Div使用post的方式加载指定的页面
 *     rdcp.load("container", "xxx.jsp?busiId=testCam&busiType=testCam", {
 *         formId: "form",
 *         params: {a: 12, b: 13}
 *     });
 * </pre>
 *
 * @param id 容器Id
 * @param url 路径
 * @param data:{formId:xxx, params:{p1:xx, p2:xx}}
 * @param p 扩展参数
 *      onLoad      加载完成之后要执行的操作
 */
rdcp.load = function (id, url, data, p) {
    if (url == undefined || url == null || $.trim(url) == "")
        return;

    var tmp = "t=" + new Date().getTime();

    var params = {};
    var urlParams = {};
    var formParams = {};

    if (url.indexOf("?") > -1) {
        var urlParamsStr = url.substr(url.indexOf("?") + 1, url.length);
        rdcp.each(urlParamsStr.split("&"), function () {
            var key = this.split("=")[0];
            var val = this.split("=")[1];
            urlParams[key] = val;
        });
        url = url.substr(0, url.indexOf("?") + 1) + "&" + tmp;
        $.extend(params, urlParams);
    } else {
        url = url + "?" + tmp;
    }

    if (data) {
        if (data.formId) {
            rdcp.each(rdcp.id(data.formId).serializeArray(), function () {
                formParams[this.name] = this.value;
            });
            $.extend(params, formParams);
        }
        if (data.params) {
            $.extend(params, data.params);
        }
    }

    var container = (id instanceof jQuery) ? id : $("#" + id);

    try {
        rdcp.mask($(document.body), "正在加载...");
        container.load(url, params, function () {
            rdcp.unmask($(document.body));
            container.find(".FRAGMENT").each(function (idx) {
                rdcp.load($(this), $(this).attr("src"));
            });

            if (p && p["onLoad"])
                p["onLoad"]();
        });
    } catch (e) {
        rdcp.unmask($(document.body));
    }
};

/**
 * 重新加载元素内容
 * @param ele 要加载的元素，如果不指定，则表示加载所有的
 */
rdcp.reload = function (ele) {
    var $ele = ele ? $(ele) : $(".FRAGMENT");

    $ele.each(function (idx) {
        rdcp.load($(this), $(this).attr("src"));
    });
};
// 'src/core/rdcp.adapter.js',
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

// 'src/core/rdcp.key.js'
rdcp.key = {
    onEnterPress: []
}

rdcp.key.enter = function (onPress) {
    rdcp.key.onEnterPress.push(onPress);

    $(document).keypress(function (e) {
        if (e.which == 13) {
            rdcp.each(rdcp.key.onEnterPress, function (i) {
                rdcp.key.onEnterPress[i]();
            });
        }
    });
}
