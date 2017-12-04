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
}
