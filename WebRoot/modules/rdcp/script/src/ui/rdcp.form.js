/**
 * Created with jse7en.
 * User: jse7en
 * Date: 13-5-8
 * Time: 下午3:52
 */
rdcp.formDefaults = {
    url: "",
    success: undefined,
    onSubmit: function () {
        var pass = $(this).form('validate');
        //if (!pass) rdcp.mask.loaded($(this));
        return pass;
    },
    onBeforeLoad: undefined,
    onLoadSuccess: undefined,
    onLoadError: undefined
};

rdcp.form = {};

/**
 * 添加表单
 * @param id 表单id
 * @param opts 参数，祥见rdcp.formDefaults
 */
rdcp.form.submit = function (id, opts) {

    var _form = rdcp.id(id);
    //rdcp.mask.loading(_form);
    var _settings = rdcp.extend({}, rdcp.formDefaults, opts);


    //李嘉伟 2013-10-30 添加判断中文转码问题
    if (undefined != opts.url && escape(opts.url).indexOf("%u") >= 0) {
        var troubleParams = "";
        var troubleParas = opts.url.split("&");
        for (var index in troubleParas) {
            var troublePara = troubleParas[index];
            var troubleParaMap = troublePara.split("=");
            if (troubleParaMap != undefined && troubleParaMap.length > 1)
                troubleParams += troubleParaMap[0] + "=" + encodeURIComponent(troubleParaMap[1]) + "&";
            else
                troubleParams += troublePara + "&";
        }
        opts.url = troubleParams;
    }


    _settings.url = opts.url.indexOf("!") == 0 ? opts.url : "framework.do?ds=" + opts.url;
    _settings._success = _settings.success;
    _settings.success = function (data) {
        //rdcp.mask.loaded(_form);

        var passCheckCode = true;
        try {
            //data = JSON.parse(unescape(data));
            //data = rdcp.str2json(data);
            if (data.header != undefined) {
                passCheckCode = rdcp.checkResponseCode(data.header);
            }
            if (_settings._success && passCheckCode != false) {
                _settings._success(data);
            }
        } catch (e) {
            if ($("#_error_dlg").length) {
                $("#_error_content").html(data);
            } else {
                var _error_dlg = $("<div id='_error_dlg'><div id='_error_content'></div> </div>");
                _error_dlg.find('#_error_content').append(data);
                _error_dlg.hide();
                $("body").append(_error_dlg);
            }
            rdcp.dialog({id: "_error_dlg", title: "请求出错"});
            return;
        }

    };
    _form.attr("method", "post");           //method为get时，url会丢失
    //_form.form('submit', _settings);
    rdcp.request(_settings.url, _form.serialize(), _settings.success);
};


/**
 * 根据请求，将数据加载进表单
 * @param id form id
 * @param ds 请求的url
 * @param params 请求的参数，祥见rdcp.request
 */
rdcp.form.load = function (id, url, params, onload) {
    var $form = rdcp.id(id);

    url = url.indexOf("!") == 0 ? url : "framework.do?ds=" + url;

    rdcp.request(url, params, function (data) {
        $form.form('load', data.body);
        if (onload) {
            onload(data);
        }
    });
};


/**
 * 清空并校验表单
 * @param id
 */
rdcp.form.clear = function (id) {
    rdcp.id(id).form('clear');
};

/**
 * 重置表单，不进行校验
 * @param id
 */
rdcp.form.reset = function (id) {
    var target = rdcp.id(id)[0];
    target.reset();
    var t = $(target);
    if ($.fn.combo) {
        t.find('.combo-f').combo('reset');
    }
    if ($.fn.combobox) {
        t.find('.combobox-f').combobox('reset');
    }
    if ($.fn.combotree) {
        t.find('.combotree-f').combotree('reset');
    }
    if ($.fn.combogrid) {
        t.find('.combogrid-f').combogrid('reset');
    }
    if ($.fn.spinner) {
        t.find('.spinner-f').spinner('reset');
    }
    if ($.fn.timespinner) {
        t.find('.timespinner-f').timespinner('reset');
    }
    if ($.fn.numberbox) {
        t.find('.numberbox-f').numberbox('reset');
    }
    if ($.fn.numberspinner) {
        t.find('.numberspinner-f').numberspinner('reset');
    }
//    清除表单中验证不通过样式
    rdcp.id(id).find("input,select,textarea").each(function () {
        $(this).removeClass("validatebox-invalid");
    });
};

rdcp.form.validate = function (id) {
    return rdcp.id(id).form('validate');
};

rdcp.form.loading = function (id) {
    var panel;
    if (id && id instanceof jQuery) {
        panel = id.parent();
    } else {
        panel = rdcp.id(id).parent();
    }
    $('<div class="datagrid-mask" style="display:block"></div>').appendTo(panel);
    var msg = $('<div class="datagrid-mask-msg" style="display:block;left:50%"></div>').html("正在加载中，请稍候。。。").appendTo(panel);
    msg.css('marginLeft', -msg.outerWidth() / 2);
};

rdcp.form.loaded = function (id) {
    var panel;
    if (id && id instanceof jQuery) {
        panel = id.parent();
    } else {
        panel = rdcp.id(id).parent();
    }
    panel.find('div.datagrid-mask-msg').remove();
    panel.find('div.datagrid-mask').remove();
};