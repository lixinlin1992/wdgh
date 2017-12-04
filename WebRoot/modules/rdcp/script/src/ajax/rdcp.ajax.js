/**
 * 转换适配器
 * @type {Array}
 */
rdcp.requestAdapter = [];

/**
 *请求资源的默认参数
 */
rdcp.requestDefaults = {
    block: 'false', //是否加载遮罩层
    disableInput: 'false', //禁止输入
    type: 'post', //以post方式提交请求
    async: 'true' //是否同步加载 ， true-异步  false-同步
};

/**
 * 发送请求
 * @param url 请求的地址。
 *          1. 如果传入地址以“!”开始，即模式化路径，则直接按路径访问
 *          2. 如果传入地址不以“!”开始，则旧模式路径，则自动在前面拼上framework.do?ds=
 *
 * @param params 请求参数
 *          1. 字符串  "id=1&name=admin"
 *          2. 对象 {id:1, name:"admin"}
 *          3. 其他 rdcp.id("testListForm").serialize() + "&id=1&name=admin"
 *          （可把一个或多个form转换成字符串参数，并可拼上一些自定义的字符串参数）

 *
 * @param callback 请求成功后的回调函数
 * @param p
 */
rdcp.request = function (url, params, callback, p) {

    p = p == undefined ? {} : p;
    p["mask"] = p["mask"] == undefined ? true : p["mask"];
    p["mask_msg"] = p["mask_msg"] || "正在加载...";
    if (p["mask"])
        rdcp.mask($(document.body), p["mask_msg"]);
    p.url = url.indexOf("!") == 0 ? url : "framework.do?ds=" + url;

    if (rdcp.isPlainObject(params)) {
        var params_tmp = {};
        params_tmp.__resultType = "json";
        params_tmp._sysCode = rdcp.syscode;
        params_tmp.t = new Date();

        params = rdcp.extend({}, params, params_tmp);
        p.data = params;
    } else {
        var params_tmp = "";
        params_tmp += "__resultType=json&" + params + "&_sysCode=" + rdcp.syscode + "&t=" + new Date();
        p.data = params_tmp;
    }

    p.success = function (data, textStatus, jqXHR) {
        rdcp.unmask($(document.body));
        // 把返回的数据转换成json对象
        data = rdcp.str2json(data);

        // 检查code状态，如果出现权限、登陆等问题则自动退出本方法
        if (data.header != undefined && !rdcp.checkResponseCode(data.header))
            return;

        if (callback) {
            callback(data);
        }
    };

    // p.error = function (XMLHttpRequest, textStatus, errorThrown) {
    //     rdcp.unmask($(document.body));
    //     alert("请求失败，请确定是否有权限进行操作。或者联系系统管理员以获取帮助。");
    //     if (callback) {
    //         callback(XMLHttpRequest);
    //     }
    // };

    var settings = rdcp.extend({}, rdcp.requestDefaults, p);
    settings = rdcp.adapt(settings, rdcp.requestAdapter);

    $.ajax(settings);
};

/**
 * 向服务器发送请求资源
 * @param ds  --数据资源名称
 * @param param     --参数
 * @param callback    --回调函数
 * @param p --附加参数
 */
rdcp.requestOld = function (ds, params, callback, p) {
    var settings = rdcp.extend({}, rdcp.requestDefaults, p);
    if (settings.block) {
        rdcp.disableInputs(settings.disableInput == false ? false : true);
    }
    $.ajax({
        url: ds.indexOf("!") == 0 ? ds : "framework.do?ds=" + ds,
        type: settings.type,
        dataType: 'text',
        data: '__resultType=json&' + params + '&_sysCode=' + rdcp.syscode + "&_t=" +
                new Date(),
        async: settings.async,
        success: function (data, textStatus) {
            rdcp.disableInputs(false);
            if (callback == null) {
                return;
            }
            if (data == null) {
                return;
            }
            try {
                data = rdcp.str2json(data);
            } catch (e) {
                return;
            }
            if (data.header == undefined && data.body == undefined) {
                callback(data);
            } else if (params.dataType == 'text') {
                try {
                    callback(JSON.stringify(data.body), data.header, textStatus);
                } catch (e) {
                    return;
                }
            } else {
                callback(data.body, data.header, textStatus);
            }
        },
        error: function (data) {
            rdcp.disableInputs(false);
            alert("请求出错了...");
        }
    });
};

/**
 *校验返回的code是否是正常登录
 * @param header
 */
rdcp.checkResponseCode = function (header) {

    if (header.code == -99 || header.code == 401) {
        //没有登录，跳转到登录页面
        rdcp.forwardLoginPage();
        return false;
    } else if (header.code == -98 || header.code == 403) {
        alert("您无访问该资源的权限");
        return false;
    } else if (header.code == 404) {
        alert("你请求的资源不存在");
        return false;
    } else if (header.code == -97) {
        //校验不通过
        alert('您输入的校验错误');
        rdcp.forwardLoginPage();
        return false;
    } else if (header.code != 0 && header.code <= 2000) {
        if ($.messager) {
            $.messager.alert('错误', header.message, 'error');
        } else {
            alert(header.message);
        }
        return false;
    }
    return true;
};

/**
 * 退出登陆
 */
rdcp.logout = function () {
    if ($.messager) {
        $.messager.confirm('确认退出', '确定要退出系统吗？', function (r) {
            if (r) {
                rdcp.request("DS_USER_LOGOUT", "", function () {
                    rdcp.forwardLoginPage();
                });
            }
        });

    } else {
        if (confirm("确定要退出系统吗？"))
            rdcp.request("DS_USER_LOGOUT", "", function () {
                rdcp.forwardLoginPage();
            });

    }
};

/**
 * 跳转到登录页面
 */
rdcp.forwardLoginPage = function () {
    document.location.href = "";
};


/**
 * 跳转到指定的路径
 * @param url 要跳转到路径
 * @param p
 *          p.params                附带参数
 *          p.form          附带表单名称
 *          p.target                  跳转目标
 */
rdcp.goto = function (url, p) {
    var genFormName = "_sunrise_core_tmp_formName";
    var oldForm = null;
    var genForm;

    p = p || {};

    //oldForm = $("form[name='"+formName+"']");
    if (p["form"] != null)
        oldForm = $(eval("document." + p["form"]));
    //var tmp = $("form[name='"+genFormName+"']");
    var tmp = $(eval("document." + genFormName));
    genForm = (tmp == null || tmp == undefined || tmp.length == 0) ? null : tmp[0];

    var params = p["params"] || "";

    //如果传入了表单，则将该表单的所有内容复制到临时表单
    if (oldForm != undefined && oldForm != null && oldForm.length > 0)
        params += (params == "" ? "" : "&") + decodeURIComponent(oldForm.serialize(), true);
    var paramArray = params.split("&");

    if (genForm == undefined || genForm == null) {
        //表单未创建，自动创建一个表单
        genForm = document.createElement("form");
        genForm.name = genFormName;
        //genForm.method = "get";
        genForm.method = "post";
        var div = document.createElement("div");
        div.style.display = "none";
        div.appendChild(genForm);
        document.body.appendChild(div);
    } else {
        //清空原有表单
        genForm.innerHTML = "";
    }
    genForm.reset();
    for (var i = 0; i < paramArray.length; i++) {
        var pa = paramArray[i].split("=");
        $(genForm).append("<input type=\"hidden\" name=\"" + pa[0] + "\" value=\"" + (pa.length > 1 ? (pa[1]) : "") +
                "\">");
    }

    genForm.action = url + (url.indexOf("?") != -1 ? "&" : "?") + "__d=" + new Date().getTime();
    genForm.target = p["target"] === null ? "_self" : p["target"];
    genForm.submit();
};

/**
 * 跳转到指定的数据源，与request不同，此处是浏览器跳转而不是Ajax方式（文件下载可采用该方式）
 * @param {Object} dataSource 数据资源名称，必需
 * @param {Object} params 参数，可为空 (a=b&b=c&...)
 * @param {Object} formName 表单名称，可为空
 * @param {target} target 跳转的目标（_blank, _self, 或者指定的其它目标），可为空（默认_self）
 */
rdcp.goToDS = function (dsName, params, formName, target) {
    rdcp.goto(dsName.indexOf("!") == 0 ? dsName : ("framework.do?ds=" + dsName),
            {params: params, form: formName, target: target});
};

/**
 *
 * @param p {"1":"操作成功","2":"操作失败"}
 * @returns {Function}
 */
rdcp.request.tips = function (p, func) {
    return function (data, textStatus, jqXHR) {
        rdcp.tip(p[data["header"]["code"]] ||
                ("0" == data["header"]["code"] ? "操作成功" : ("操作失败：" + data["header"]["message"])));
        if (func) func(data, textStatus, jqXHR);
    };
};