var CORE = {
    version: "0.1",
    url: "framework.do",
    loginPage: "pages/login.jsp", //登录页面地址
    syscode: ""//业务系统编码
};
var errorDiv = "";
/**
 * 将一个字符串转换为一个JSON对象，并且将里面的数据进行unescape
 * @param str
 */
CORE.str2json = function (str) {
    return JSON.parse(str, function (key, value) {
        if (typeof value === 'string')
            return unescape(value);
        return value;
    });
};

/**
 * 将一个json数据对象转换为一个字符串
 * @param json
 */
CORE.json2str = function (json) {
    try {
        return JSON.stringify(json);
    } catch (e) {
        return "";
    }
};

/**
 * 将经过escape的json对象中的内容unescape
 * @param json
 */
CORE.unescapeJson = function (json) {
    return CORE.str2json(JSON.stringify(json));
};

/**
 * 跳转到登录页面
 */
CORE.gotoLogin = function () {
    document.location.href = this.loginPage;
};

/**
 * 李嘉伟 2013-04-12 复制一个json数据对象
 */
CORE.jsonClone = function (value) {
    if (value instanceof Array) {
        var buf = [];
        var i = value.length;
        while (i--) {
            buf[i] = CORE.jsonClone(value[i]);
        }
        return buf;
    } else if (value instanceof Object) {
        if (typeof(value) == "function")
            return value;
        var buf = {};
        for (var k in value) {
            buf[String(k)] = CORE.jsonClone(value[k]);//bug修复
        }
        return buf;
    } else {
        return value;
    }
};

/**
 * 向服务端发送数据资源请求
 * @param {Object} dataSource 数据资源名称
 * @param {Object} params 附带的参数
 * @param {Object} callback 回调函数
 */
CORE.request = function (dataSource, params, callback) {
    if ("false" != params["block"]) {
        //alert("oh");
        CORE.disableInputs(params['disableInput'] == false ? false : true);
        jQuery("body").showLoading();
    }
    $.ajax({
        url: this.url,
        type: params['type'] || "POST",
        dataType: 'text', //params['dataType'] || 'text',
        data: '__resultType=json&ds=' + dataSource + '&' + params['data'] + '&_sysCode=' + CORE.syscode + "&_t=" +
                new Date(),
        success: function (data, textStatus) {
            CORE.disableInputs(false);
            jQuery('body').hideLoading();
            if (callback == null) {
                return;
            }
            if (data == null) {
                return;
            }

            try {
                data = CORE.str2json(data);
            } catch (e) {
                //CORE.error("服务端返回的数据格式不正确", unescape(data));
                return;
            }

            //if (data.header == undefined) {
            if (data.header == undefined && data.body == undefined)
                callback(data);
            else if (params['dataType'] == 'text') {
                //                data = data.replaceAll
                //                var aa = '{"header":{"code":1000,"message":"查询失败，信息：ORA-01789: exe block has incorrect number of result columns ","isAlert":true},"body":""}';
                //data = eval("(" + data + ")");
                //if (data.header.code > 1000 && data.header.code < 2000) {
                if (data.header.code == -99) {
                    //没有登录，跳转到登录页面
                    CORE.confirm("您的会话已经超时，请重新登录", function () {
                        CORE.gotoLogin();
                    });
                } else if (data.header.code == -98) {
                    CORE.info("您无访问该资源的权限");
                } else if (data.header.code == -97) {
                    //校验不通过
                    var _html = "";
                    $.each(data.body, function (i, n) {
                        _html += "<li>" + n + "</li>"
                    });
                    CORE.info("<ul style='width:90%;text-align:left;'>" + _html + "</ul>");
                } else if (data.header.code != 0 && data.header.code <= 2000) {
                    CORE.error("操作失败，信息：<br>" + data.header.message,
                            data.body);
                } else {
                    try {
                        callback(JSON.stringify(data.body), data.header, textStatus);
                    } catch (e) {
                    }
                }
            } else {
                //if (data.header.code > 1000 && data.header.code < 2000) {
                if (data.header.code == -99) {
                    //没有登录，跳转到登录页面
                    CORE.gotoLogin();
                } else if (data.header.code == -98) {
                    CORE.info("您无访问该资源的权限");
                } else if (data.header.code == -97) {
                    //校验不通过
                    var _html = "";
                    $.each(data.body, function (i, n) {
                        _html += "<li>" + n + "</li>"
                    });
                    CORE.info("<ul style='width:90%;text-align:left;'>" + _html + "</ul>");
                } else if (data.header.code != 0 && data.header.code <= 2000) {
                    CORE.error("操作失败，信息：<br>" + data.header.message,
                            data.body);
                } else {
                    callback(data.body == undefined ? {} : data.body, data.header, textStatus);
                }
            }
        },
        error: function (data) {
            CORE.disableInputs(false);
            jQuery('body').hideLoading();
            CORE.error("操作失败", unescape(data.responseText));
        }
    });
};


/**
 * 填充表单
 * @param form
 * @param data
 */
CORE.fillForm = function (form, data) {
    var form = eval(form);
    if (form == null || form == undefined)
        return;

    for (var i = 0; i < form.elements.length; i++) {
        var ele = form.elements[i];
        var tagName = ele.nodeName.toLowerCase();
        var type = ele.type.toLowerCase();
        var eleValue = data[ele.name];
        if (eleValue == undefined)
            continue;
        if (tagName == "input") {
            if (type == "checkbox" || type == "radio") {
                var msgLength = data[ele.name].length;
                ele.checked = false;
                for (var j = 0; j < msgLength; j++) {
                    var val = msgLength == 1 ? eleValue : eleValue[j];
                    if ($.trim(val) == $.trim(ele.value))
                        ele.checked = true;
                }
            } else if (type == "text" || type == "hidden") {
                ele.value = (data[ele.name]);
            }
        } else if (tagName == "select") {
            ele.setAttribute("tmpValue", eleValue);
            var options = ele.options;
            for (var j = 0; j < options.length; j++) {
                //alert(options[j].value);
                if ($.trim(options[j].value) == $.trim(eleValue)) {
                    options[j].selected = true;
                    break;
                }
            }
        } else if (tagName == "textarea") {
            ele.value = eleValue;
        }
    }
};

/**
 * 装载表单数据
 * @param {Object} formName 表单名称
 * @param {Object} dataSource 数据资源名称
 * @param {Object} params
 *
 * params参数
 * data : 附加的参数
 * ruleId : 表单校验规则配置ID
 */
CORE.loadForm = function (dataSource, formName, params) {
    $(".tip").hide().remove();
    var callback = function (msg) {
        var form = eval("document." + formName);
        if (form == null || form == undefined)
            return;
        //克隆formdata
        var formData = {};
        for (var msgKey in msg) {
            formData[msgKey.toLowerCase()] = msg[msgKey];
        }
        //判断params是否用大小写区分,默认是不采用
        if (params["useCase"] == undefined || params["useCase"] == "")
            params["useCase"] = false;

        for (var i = 0; i < form.elements.length; i++) {
            var ele = form.elements[i];
            var tagName = ele.nodeName.toLowerCase();
            var type = ele.type.toLowerCase();
            var eleValue = "";
            if (!params["useCase"])
                eleValue = formData[ele.name.toLowerCase()];
            else
                eleValue = formData[ele.name];
            if (eleValue == undefined)
                continue;
            if (tagName == "input") {
                if (type == "checkbox" || type == "radio") {
                    var msgLength = eleValue.length;
                    ele.checked = false;
                    for (var j = 0; j < msgLength; j++) {
                        var val = msgLength == 1 ? eleValue : eleValue[j];
                        if ($.trim(val) == $.trim(ele.value))
                            ele.checked = true;
                    }
                } else if (type == "text" || type == "hidden") {
                    ele.value = eleValue;
                }
            } else if (tagName == "select") {
                ele.setAttribute("tmpValue", eleValue);
                var options = ele.options;
                for (var j = 0; j < options.length; j++) {
                    //alert(options[j].value);
                    if ($.trim(options[j].value) == $.trim(eleValue)) {
                        options[j].selected = true;
                        break;
                    }
                }
            } else if (tagName == "textarea") {
                ele.value = eleValue;
            }
        }

        //判断有没有提供回调函数，如果有的话，则执行回调函数
        if (typeof params["loadComplete"] === "function")
            params["loadComplete"](formData);

        //装载验证规则
        CORE.loadRules(formName, params["ruleId"], params["reload"]);
    };

    this.request(dataSource, params, callback);
};


/**
 * 设置表单为不可编辑状态
 * @param {Object} formName 表单名称
 * @param params
 * callback     回调函数
 * fields       指定要锁定的表单域，默认为全部
 * type         锁定类型，readonly/disable，默认为 readonly
 */
CORE.lockForm = function (formName, params) {
    var form = eval("document." + formName);
    if (form == null || form == undefined)
        return;

    params = params || {};
    params["fields"] = params["fields"] || [];
    params["type"] = params["type"] || "readonly";

    for (var i = 0; i < form.elements.length; i++) {
        var ele = form.elements[i];
        var tagName = ele.nodeName.toLowerCase();
        var type = ele.type.toLowerCase();
        //kinz add 2011-07-11 增加可对指定表单域进行锁定的支持，且对hidden类型不处理
        if (type == "hidden")
            continue;
        if (params["fields"].length > 0 && $.inArray(ele.name, params["fields"]) == -1)
            continue;

        if (params["type"] == "readonly")
            ele.readOnly = true;
        else
            ele.disabled = true;
        if (tagName == "select")
            ele.disabled = true;
        else if (type == "button")
            ele.disabled = true;
    }
    //判断有没有提供回调函数，如果有的话，则执行回调函数
    if (params != undefined && typeof params["callback"] === "function")
        params["callback"]();
};
/**
 * 设置表单为可编辑状态
 * @param {Object} formName 表单名称
 * @param params
 * callback     回调函数
 * fields       指定要锁定的表单域，默认为全部
 */
CORE.unlockForm = function (formName, params) {
    var form = eval("document." + formName);
    if (form == null || form == undefined)
        return;

    params["fields"] = params["fields"] || [];

    for (var i = 0; i < form.elements.length; i++) {
        var ele = form.elements[i];
        var tagName = ele.nodeName.toLowerCase();
        //kinz add 2011-07-11 增加可对指定表单域进行锁定的支持
        if (params["fields"].length > 0 && $.inArray(ele.name, params["fields"]) == -1)
            continue;
        var type = ele.type.toLowerCase();
        ele.readOnly = false;
        ele.disabled = false;
    }

    //判断有没有提供回调函数，如果有的话，则执行回调函数
    if (params != undefined && typeof params["callback"] === "function")
        params["callback"]();
};

/**
 * 使input失效
 * @param disable 是否可用
 */
CORE.disableInputs = function (disable) {
    //var _selector = (disable ? ":input:enabled" : ".auto_disabled");

    if (disable)
        $(document.body).find(":input:enabled").addClass("auto_disabled").attr("disabled", "disabled");
    else {
        $(document.body).find(".auto_disabled").removeAttr("disabled");
    }
};

/**
 * 装载下拉框选项
 * @param {Object} selectId 下拉框id
 * @param {Object} dataSource 数据资源名称
 * @param {Object} params 附带参数
 */
CORE.loadSelect = function (selectId, dataSource, params) {
    $("#" + selectId + " option[gen='true']").remove();
    var pro = $("#" + selectId);
    var callback = function (msg) {
        var options = "";
        var tmpVal = params["value"] || pro.attr("tmpValue");//临时值
        for (var i = 0; i < msg.length; i++) {
            var sel = ("" + msg[i]["value"] == "" + tmpVal) ? "selected" : "";
            options += "<option value=\"" + unescape(msg[i]['value']) + "\" " + sel + " gen='true'>" +
                    unescape(msg[i]['label']) + "</option>";
        }
        pro.append(options);
        //判断有没有提供回调函数，如果有的话，则执行回调函数
        if (typeof params["loadComplete"] === "function") {
            params["loadComplete"]();
        }
    };

    this.request(dataSource, params, callback);
};

/**
 * @param {Object} dataSource 数据资源名称
 * @param {Object} formName 要提交的表单名称
 * @param {Object} params 附带参数
 * @param {Object} callback 回调函数
 */
CORE.submitForm = function (dataSource, formName, params, callback) {
    //var fun = function(){
    //	CORE.request(dataSource, params, callback);
    //}
    if (formName != null) {
        if (!this.validateForm(formName)) {
            return;
        }
        /*
         params['data'] = ((params['data']!= undefined && params['data']!=null)?(params['data']+"&"):"")
         +"formName="+formName+((params['rule']!=null && params['rule']!=undefined)?"":("&_formRule="+params['rule']))
         +"&"+$("form[name='"+formName+"']").serialize();
         */
        params['data'] = ((params['data'] != undefined && params['data'] != null) ? (params['data'] + "&") : "")
                + "formName=" + formName +
                ((params['rule'] != null && params['rule'] != undefined) ? "" : ("&_formRule=" + params['rule']))
                + "&" + $(eval("document." + formName)).serialize();
    }

    CORE.request(dataSource, params, callback);
};


/**
 * 跳转到指定的数据源，与request不同，此处是浏览器跳转而不是Ajax方式（文件下载可采用该方式）
 * @param {Object} dataSource 数据资源名称，必需
 * @param {Object} params 参数，可为空 (a=b&b=c&...)
 * @param {Object} formName 表单名称，可为空
 * @param {target} target 跳转的目标（_blank, _self, 或者指定的其它目标），可为空（默认_self）
 */
CORE.goToDS = function (dsName, params, formName, target) {
    var genFormName = "_sunrise_core_tmp_formName";
    var oldForm = null;
    var genForm;

    //oldForm = $("form[name='"+formName+"']");
    if (formName != null)
        oldForm = $(eval("document." + formName));
    //var tmp = $("form[name='"+genFormName+"']");
    var tmp = $(eval("document." + genFormName));
    genForm = (tmp == null || tmp == undefined || tmp.length == 0) ? null : tmp[0];

    if (params == undefined || params == null)
        params = "ds=" + dsName;
    else
        params += "&ds=" + dsName;

    //如果传入了表单，则将该表单的所有内容复制到临时表单
    if (oldForm != undefined && oldForm != null && oldForm.length > 0)
        params += "&" + decodeURIComponent(oldForm.serialize(), true);


    var paramArray = params.split("&");

    if (target == undefined)
        target = "_blank";


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

    //alert(genForm.innerHTML);

    genForm.action = this.url + "?__d=" + new Date().getTime();
    genForm.target = target;
    genForm.submit();
};


/**
 * 页面加载后自动检查必填表单，并且添加“*”
 * @param dataSource
 * @param params
 * @return
 */
CORE.loadRules = function (formName, ruleId, reload, loadComplete) {
    //只有指定了规则ID才会进行装载
    if (ruleId == null || ruleId == undefined)
        return;
    if ("true" == $("form[name='" + formName + "']").attr("ruleLoaded")) {
        //    if("true" == $(eval("document."+formName)).attr("rulesLoaded")){
        //已经装载了规则，如果没有指定重新装载，则不装载
        if (reload == undefined || reload == null || !reload)
            return;
    }
    $(".tip").hide().remove();
    $(".validate_rule_" + formName).hide().remove();//ADD: kinz 2013-08-09  在加载新规则的时候，先删除原有的规则
    var dataSource = "DS_VALID_RULE";
    var callback = function (msg) {
        //var inputList = $("form[name='" + formName + "'] :input");
        var inputList = eval("document." + formName);
        var tempName = "";
        for (var i = 0; i < inputList.length; i++) {
            var name = inputList[i].name;
            if (name == tempName) {
                continue;
            }
            /*
             if (inputList[i].type == "hidden")
             continue;
             */
            //alert(name+"   "+tempName);
            tempName = name;
            //			i=i+$("[name='"+name+"']").length;
            if (msg[name] != null) {
                var validateValue = msg[name];
                var span = $("#_v_" + name);
                if (span.length == 0) {
                    $("form[name='" + formName + "']").find("[name='" + name + "']:last")
                            .after("<span class=\"start\" style=\"color: red;width:30px;\" id='_v_" + name +
                                    "'></span>");
                }
                span = $("#_v_" + name);
                if (validateValue.nullable == "false" && 'none' != inputList[i].style.display &&
                        'hidden' != inputList[i].type) {
                    span.html("*");
                } else {
                    span.html("");
                }

                span.attr("class", "validate_rule_" + formName);//ADD: kinz 2013-08-09 设置表单规则
                span.attr("validate", unescape(validateValue.validate));
                span.attr("pattern", unescape(validateValue.pattern));
                span.attr("nullable", unescape(validateValue.nullable));
                span.attr("name", unescape(validateValue.name));
                span.attr("constraint", unescape(validateValue.constraint));
                span.attr("type", unescape(validateValue.type));
                if ($.trim(validateValue.invalidmessage) == "")
                    span.attr("invalidmessage", unescape(validateValue.name) + "格式不正确");
                else
                    span.attr("invalidmessage", unescape(validateValue.invalidmessage));
                if ($.trim(validateValue.nullmessage) == "")
                    span.attr("nullmessage", unescape(validateValue.name) + "不能为空");
                else
                    span.attr("nullmessage", unescape(validateValue.nullmessage));
                span.attr("code", unescape(validateValue.code))
            }
        }
        //标记校验规则已经装载
        //$("form[name='" + formName + "']").attr("ruleLoaded","true");
        $(eval($("document." + formName))).attr("ruleLoaded", "true");

        $(eval($("document." + formName))).append("<input type=\"hidden\" name=\"_formId\" value=\"" + ruleId + "\">");

        if (typeof loadComplete === 'function')
            loadComplete();
    };
    this.request(dataSource, {data: "rule=" + ruleId}, callback);
};

/**
 * 表单验证
 * @param dataSource
 * @param params
 * @return
 */
CORE.validateForm = function (formName) {
    errorDiv = "";
    var flag = 0;
    //$(".tip").hide().remove();
    //拿到表单里面的每个元素
    //var inputList = $("form[name='" + formName + "'] :input");
    var inputList = eval("document." + formName);

    var cache = {};//缓存已经处理的表单字段

    for (var i = 0; i < inputList.length; i++) {
        var name = inputList[i].name;
        var span = $("#_v_" + name);
        //从后台传来的信息中，如果传来的值不等于空。
        if (span.length > 0) {
            //判断该表单是否需要验证
            if (span.attr("validate") == "true") {

                var validateValue = {
                    "name": span.attr("name"),
                    "pattern": span.attr("pattern"),
                    "nullable": span.attr("nullable"),
                    "constraint": span.attr("constraint"),
                    "type": span.attr("type"),
                    "nullmessage": span.attr("nullmessage"),
                    "validate": span.attr("validate"),
                    "invalidmessage": span.attr("invalidmessage"),
                    "code": span.attr("code")
                };

                //验证checkbox和radio，只校验不能为空的情况
                if ((inputList[i].type == "checkbox" || inputList[i].type == "radio") &&
                        validateValue.nullable == "false" && cache[name] != "true") {
                    var isChecked = $(inputList).find("input[name='" + name + "']:checked");
                    if (isChecked.length == 0) {
                        errorDiv += "<li>" + (validateValue.nullmessage) + "</li>";
                        flag++;
                    }
                    cache[name] = "true";
                }

                //验证select，只校验不能为空的情况
                else if (inputList[i].tagName == "SELECT" && validateValue.nullable == "false") {
                    var selectedOption = $(inputList[i]).find("option:selected");
                    if (selectedOption.length == 0 || $.trim(selectedOption[0].value) == "") {
                        errorDiv += "<li>" + (validateValue.nullmessage) + "</li>";
                        flag++;
                    }
                }

                //检查该表单是否为必填项
                else if ($.trim(inputList[i].value) == "") {
                    if (validateValue.nullable == "false") {
                        errorDiv += "<li>" + (validateValue.nullmessage) + "</li>";
                        flag++;
                    }
                } else {
                    //校验长度
                    var msg = _validateLength(inputList[i].value, validateValue);
                    if (msg == null) {
                        //校验规则
                        msg = _validateRex(inputList[i].value, validateValue);
                    }
                    if (msg != null) {
                        errorDiv += "<li>" + msg + "</li>";
                        flag++;
                    }
                }
            }
        }
    }
    //alert(errorDiv);
    if (errorDiv != "") {
        CORE.info("<ul style='width:90%;text-align:left;'>" + errorDiv + "</ul>");
    }
    return flag <= 0;
};

/**
 * 显示提示信息对话框，使用jQueryUI的对话框
 * @param {Object} msg
 */
CORE.info = function (msg) {
    CORE.infoDlg({
        title: "信息提示",
        message: msg,
        buttons: {
            "确定": function () {
            }
        }
    });
};

/**
 * 显示提示信息，支持html
 * @param msg
 */
CORE.tip = function (msg) {
    //一直向上找showTip函数，如果没有，则在本页面加载tip脚本并进行显示
    var _tipFunc = undefined;
    var _parent = window;
    var _counter = 100;
    while (_parent != null && (_tipFunc = _parent.showTip) == undefined) {
        _parent = _parent.parent;
        if (_counter-- <= 0)
            break;
    }
    if (typeof _tipFunc === "function") {
        _tipFunc(msg);
    } else {
        //加载样式和脚本
        appendCss("themes/default/css/jquery.jgrowl.css");
        appendScript("scripts/common/jquery.jgrowl.js", function () {
            $.jGrowl(msg);
        });
    }
};

/**
 * 显示错误信息对话框
 * @param {Object} msg
 * @param {Object} detail
 */
CORE.error = function (msg, detail) {
    if (window != window.top) {
        window.top.CORE.error(msg, detail);
        return;
    }
    var dlgOpts = {
        title: "<img src=\"themes/default/images/core/error_16_16.png\" style=\"vertical-align:middle;\"> 错误",
        modal: true,
        width: 450,
        height: 150,
        resizeable: false,
        buttons: {
            "确定": function () {
                $("#_msg_error_div").dialog("close");
            },
            "详细": function () {
                var dDiv = $("#_msg_error_detail");
                if ("true" == dDiv.attr("show")) {
                    $("#_msg_error_div").dialog("resize", 450, 150);
                    dDiv.attr("show", "false");
                    dDiv.hide();
                } else {
                    $("#_msg_error_div").dialog("resize", 450, 250);
                    dDiv.attr("show", "true");
                    dDiv.show();
                }
                //detail.center({vertical:true});
            }
        }
    };
    var div = $("#_msg_error_div");
    if (div.length == 0) {
        $("body")
                .append("<div id='_msg_error_div' style='display:none;'><tale style='height:100%;'>" +
                        "<tr>" +
                        "<td height='10%'>" +
                        "<div id='_msg_error_title' class='msg_error'></div>" +
                        "</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td height='90%'>" +
                        "<textarea id='_msg_error_detail' class='msg_error_detail' style='width:100%;height:120px;border-width:0px;'></textarea>" +
                        "</td>" +
                        "</tr>" +
                        "</table></div>");
        div = $("#_msg_error_div");
    }
    var tDiv = $("#_msg_error_title");
    tDiv.html(msg);
    var dDiv = $("#_msg_error_detail");
    dDiv.html(detail);
    dDiv.attr("show", "false");
    dDiv.hide();

    div.dialog(dlgOpts);
    div.dialog("resize", 450, 150);
};

/**
 * 显示信息对话框
 * @param opts 确认信息的对话框参数，包含以下内容：
 *      title 对话框标题
 *      message  要确认的信息
 *      buttons 按钮，如果没有定义，则使用默认的按钮（取消、是、否）
 */
CORE.infoDlg = function (opts) {
    var dlgOpts = {
        title: "<img src=\"" + (opts["icon"] || "themes/default/images/core/info_16_16.png") +
                "\" style=\"vertical-align:middle;\"> " +
                (opts["title"] || "确认"),
        modal: opts["modal"] || true,
        width: 450,
        height: 150,
        buttons: opts["buttons"] || {
            "确定": function () {
            }
        }
    };
    //将所有的按钮加上关闭事件
    $.each(dlgOpts["buttons"], function (i, n) {
        dlgOpts["buttons"][i] = function () {
            $("#_msg_confirm_div").dialog("close");
            $(n);
        };
    });
    var div = $("#_msg_confirm_div");
    if (div.length == 0) {
        $("body").append("<div id=\"_msg_confirm_div\" class=\"msg_info\"></div>");
        div = $("#_msg_confirm_div");
    }

    div.html(opts["message"]);
    div.dialog(dlgOpts);
};

/**
 * 显示确认信息对话框
 * @param {Object} msg 确认信息
 * @param {Object} noFunc 选 是 的回调函数
 * @param {Object} cancelFunc 选 否 的回调函数
 * @return true，false
 */
CORE.confirm = function (msg, okFunc, noFunc) {
    CORE.infoDlg({
        icon: "themes/default/images/core/confirm_16_16.png",
        title: "确认",
        message: msg,
        buttons: {
            "取消": function () {
            },
            "否": noFunc,
            "是": okFunc
        }
    });
};


/**
 * 提供长度验证
 * @param {Object} value 表单值
 * @param {Object} vMsg 验证规则
 */
var _validateLength = function (value, vMsg) {
    if (typeof(vMsg.min) != "undefined" || $.trim(vMsg.min) != "") {
        if (vMsg.min > 0) {
            if (value.length < vMsg.min) {
                /*  $("[name='" + (vMsg.code) + "']").after("<label class=\"tip\">" + (vMsg.name) + "长度不能少于" + vMsg.min + "</label>");  */
                //errorDiv = errorDiv + "<p class=\"tip\">" + (vMsg.name) + "长度不能少于" + vMsg.min + "</p>";
                //$(".tip").show();
//                flag++;
                return (vMsg.name) + "长度不能少于" + vMsg.min;
            }
        }
    }

    if (typeof(vMsg.constraint) != "undefined" || $.trim(vMsg.constraint) != "") {
        if (vMsg.constraint > 0) {
            if (value.length > vMsg.constraint) {
                /*  $("[name='" + (vMsg.code) + "']").after("<label class=\"tip\">" + (vMsg.name) + "长度不能长于" + vMsg.constraint + "</label>"); */
//                errorDiv = errorDiv + "<p class=\"tip\">" + (vMsg.name) + "长度不能长于" + vMsg.constraint + "</p>";
//                $(".tip").show();
//                flag++;
                return (vMsg.name) + "长度不能长于" + vMsg.constraint;
            }
        }
    }

    //return flag <= 0;
    return null;
};

/**
 * 提供正则表达式验证
 * @param {Object} value 表单值
 * @param {Object} vMsg 验证规则
 */
var _validateRex = function (value, vMsg) {
//    var flag = 0;
    if (typeof(vMsg.pattern) != "undefined" || $.trim(vMsg.pattern) != "") {
        var rex = new RegExp(vMsg.pattern);
        if (!rex.test(value)) {
            /* $("[name='" + unescape(vMsg.code) + "']").after("<label class=\"tip\">" + vMsg.invalidmessage + "</label>"); */
            //errorDiv = errorDiv + "<p class=\"tip\">" + vMsg.invalidmessage + "</p>";
            //$(".tip").show();
//            flag++;
            return vMsg.invalidmessage;
        }
    }
//    return flag <= 0;
    return null;
};
