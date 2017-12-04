/**
 * @(#)rdcp.ui.all.js 14-10-10 下午12:04
 * CopyRight 2014.  All rights reserved
 *
 */
/**
 * User: Horizon
 *
 * 整合以下js
 *  'src/ui/rdcp.window.js', 'src/ui/rdcp.tree.js', 'src/ui/rdcp.grid.js', 'src/ui/rdcp.dateBox.js',
 *  'src/ui/rdcp.form.js', 'src/ui/rdcp.gform.js',
 *  'src/ui/rdcp.comboBox.js', 'src/ui/rdcp.tips.js', 'src/ui/rdcp.menu.js',
 *  'src/ui/rdcp.menu.lowerNavMenuBuilder.js',
 *  'src/ui/rdcp.mask.js', 'src/ui/rdcp.messages.js', 'src/ui/rdcp.dialog.js'
 */

//'src/ui/rdcp.window.js',
/**
 * 默认窗口参数
 */
rdcp.windowDefaults = {
    // 标题
    title: rdcp.lang.title,
    // 宽度
    width: 500,
    // 高度
    height: 300,
    // 引用某个页面
    href: null,
    // 是否模态
    modal: true,
    // 能否折叠
    collapsible: true,
    // 能否调整大小
    resizable: true,
    // 能否拖拽
    draggable: true,
    // 能否最小化
    minimizable: false,
    // 能否最大化
    maximizable: true,
    // 能否关闭
    closable: true,
    //初始化时是关闭状态
    closed: true
};

/**
 * 属性转换器<br />
 * 每个对象都必须有一个对应的转换器,如果不需要转换,则将转换器初始化为空数组
 * @type {Array}
 */
rdcp.windowAdapter = [];

/**
 * 初始化窗口对象,参数详情参考rdcp.windowDefaults
 * @param p {*}
 */
rdcp.window = function (p) {
    var $win = rdcp.id(p.id);
    var titleTmp = p.title;
    p.title = "<center>" + titleTmp + "</center>";
    var settings = rdcp.extend({}, rdcp.windowDefaults, p);
    settings = rdcp.adapt(settings, rdcp.windowAdapter);
    $win.window(settings);
};

/**
 * 显示窗口
 * @param id 弹出窗口的ID
 * @param p {*}
 */
rdcp.window.open = function (id, p) {
    var $win = rdcp.id(id);
    $win.window('open');
};

/**
 * 关闭窗口
 * @param id 窗口ID
 * @param p {*}
 */
rdcp.window.close = function (id, p) {
    var $win = rdcp.id(id);
    $win.window('close');
};

/**
 *  窗口刷新
 * @param id  窗口ID
 * @param p 参数
 * @param url  刷新所请求的地址
 */
rdcp.window.refresh = function (id, p, url) {
    var $win = rdcp.id(id);
    if (url == '' || url == null) {
        url = '#';
    }
    $win.window('refresh', url);
};


rdcp.panel = {};
/**
 * <pre>
 *     让EasyUI的panel加载指定的页面
 * </pre>
 *
 * @param id 容器Id
 * @param url 路径
 * @param formId 表单Id
 * @param p 扩展参数
 */
rdcp.panel.load = function (id, url, formId, p) {
    var tmp = "t=" + new Date().getTime();
    if (formId)
        tmp += "&" + $("#" + formId).serialize();
    url = url.indexOf("?") > -1 ? url + "&" + tmp : url + "?" + tmp;
    $("#" + id).panel('refresh', url);
}
// 'src/ui/rdcp.tree.js',
/**
 * 默认树参数
 * @type {{}}
 */
rdcp.treeDefaults = {
    // 动画
    animate: false,
    // 结构线
    lines: true,
    // 是否显示多选框
    checkbox: false,
    // 是否级联选中,checkbox = true时生效
    cascadeCheck: true,
    // 是否只能勾选根节点,checkbox = true时生效
    onlyLeafCheck: false,
    // 是否能拖拽
    dnd: false,
    onBeforeLoad: function (node, param) {
        if (node) {
            param.typeId = node.attributes.typeid;
            param.ptypeId = node.attributes.ptypeid;
        }

    }

};

/**
 * 属性转换器<br />
 * 每个对象都必须有一个对应的转换器,如果不需要转换,则将转换器初始化为空数组
 * @type {Array}
 */
rdcp.treeAdapter = [];

/**
 * 初始化树对象,参数详情参考rdcp.treeDefaults
 * @param p
 */
rdcp.tree = function (id, ds, p) {
    var $tree = rdcp.id(id);

    p = p == undefined ? {} : p;
    p.url = ds.indexOf("!") == 0 ? ds : "framework.do?ds=" + ds;

    var settings = rdcp.extend({}, rdcp.treeDefaults, p);
    settings = rdcp.adapt(settings, rdcp.treeAdapter);
    $tree.tree(settings);
};

/**
 * 展开所有节点
 * @param id 树ID
 * @param p {*}
 */
rdcp.tree.expandAll = function (id, p) {
    var $tree = rdcp.id(id);
    $tree.tree('expandAll');
};

/**
 * 收缩所有节点
 * @param id 树ID
 * @param p {*}
 */
rdcp.tree.collapseAll = function (id, p) {
    var $tree = rdcp.id(id);
    $tree.tree('collapseAll');
};


/**
 * 获取选中的节点
 * @param id 树ID
 * @param p {*}
 * @return Array 选中节点集合[node1, node2]
 */
rdcp.tree.getSelected = function (id, p) {
    var $tree = rdcp.id(id);
    return $tree.tree('getSelected');
};

/**
 * 获取勾选的节点
 * @param id 树ID
 * @param p {*}
 * @return {*} 选中的节点
 */
rdcp.tree.getChecked = function (id, p) {
    var $tree = rdcp.id(id);
    return $tree.tree('getChecked');
};

/**
 * 选中指定节点
 * @param id 树ID
 * @param nodeId 节点ID
 * @param p {*}
 * @return {*} 选中的节点
 */
rdcp.tree.selectNode = function (id, nodeId, p) {
    var $tree = rdcp.id(id);
    var node = $tree.tree('find', nodeId);
    $tree.tree('select', node.target);
    return node;
};

/**
 * 勾选指定节点
 * @param id 树ID
 * @param nodeIds 需要勾选的树节点ID, 可传入数组或以逗号分隔的字符串
 * @param p {*}
 * @return Array 勾选中的节点
 */
rdcp.tree.checkNode = function (id, nodeIds, p) {
    var $tree = rdcp.id(id);
    var ids = [];
    var nodes = [];

    if (rdcp.isArray(nodeIds)) {
        ids = nodeIds;
    } else {
        ids = nodeIds.split(",");
    }

    rdcp.each(ids, function () {
        var node = $tree.tree('find', this);
        $tree.tree('check', node.target);
        nodes.push(node);
    });
    return nodes;
};

/**
 * @param id  树ID
 * @param f  执行onClick后执行的回掉函数
 * @param p 参数
 * @return {*}  执行回调函数
 */
rdcp.tree.onClick = function (id, f) {
    var $tree = rdcp.id(id);
    $tree.tree('onClick', f);
};
// 'src/ui/rdcp.grid.js',
/**
 * 表格控件
 * User: wensen
 * Date: 2013-4-24
 * Time: 下午16:45
 * 功能：表格控件默认树形
 */
rdcp.gridDefaults = {
    fit: false,
    nowrap: true,
    autoRowHeight: false,
    striped: true,
    collapsible: true,
    sortOrder: 'desc',
    remoteSort: true,
    singleSelect: true,
    fitColumns: true,
    pagination: true,
    rownumbers: false,
    pagePosition: 'bottom',
    pageSize: 13,
    pageList: [13, 20, 25, 30],
    onBeforeLoad: function (param) {
        var $grid = $(this);
        var settings = $grid.datagrid("options");
        var formIds = settings.formIds;

        var formIdArray = rdcp.string2Array(formIds, ",");
        rdcp.each(formIdArray, function (index) {
            var formId = formIdArray[index];
            // 绑定提交事件
//            rdcp.id(formId).submit(function () {
//                rdcp.grid.reload(id);
//                return false;  //需要return false 否则会自动跳转
//            });
            $.extend(param, rdcp.formToMap(formId));
        });
    },
    onLoadError: function () {
        alert("加载失败");
    },
    loadFilter: function (data, parent) {
        var result = rdcp.unescapeJson(data);
        if (result.body != undefined) {
            rdcp.checkResponseCode(result.header);
            return  result.body;
        } else {
            return  result;
        }
    }
};

/**
 * 表格控件
 * @param id jquery的id选择器
 * @param ds 数据服务  （!test/ds/DS_USER_LIST_TEST 数据服务的访问方式）
 * @param formIds  搜索表单
 * @param p 参数
 *
 */
rdcp.grid = function (id, ds, formIds, p) {

    var $grid = rdcp.id(id);
    p.url = ds.indexOf("!") == 0 ? ds : "framework.do?ds=" + ds;
    p.formIds = formIds;

    var settings = rdcp.extend({}, rdcp.gridDefaults, p);
    $grid.datagrid(settings);

};

/**
 *  提交表单查询
 *  @param   gridId    jquery的id选择器
 *  @param   formId  from表单的id
 *
 */
rdcp.grid.reload = function (gridId) {
    var $grid = rdcp.id(gridId);
    $grid.datagrid('reload');
};

/**
 * 获取选中的多行
 * @param id jquery选择器
 * 返回的对象用：分隔
 *
 */
rdcp.getCheckedRow = function (id) {
    var $rows = rdcp.id(id).datagrid('getSelections');
    return $rows;
};

/**
 * 单击行
 * @param id jquery选择器
 * 返回的对象用：分隔
 *
 */
rdcp.clickRow = function (id, rowIndex) {
    var gridObj = rdcp.id(id);
    gridObj.datagrid('clearSelections');
    var i = gridObj.datagrid('selectRow', rowIndex);
    var $rows = gridObj.datagrid('getSelections');
    return $rows;
};

/**
 * 单击表格任意行，返回
 * 首先要监听表格
 * @param id jquery表格选择器
 * @param fn 函数
 * @param index 行索引
 */
rdcp.onRowSelected = function (id, fn, index) {
    var row = rdcp.id(id).datagrid('getSelected', index);
    fn.call(this, row);
};

/**
 * 单击表格行事件
 * 首先要监听表格 :加入onClickRow：函数
 * @param id jquery表格选择器
 * @param fn 函数
 * 调用方法rdcp.grid.onClickRow(表格id,function(data){})
 * */
rdcp.grid.onClickRow = function (id, fn, p) {
    var row = rdcp.id(id).datagrid('getSelected');
    if (row) {
        fn(row);
    }
};

// 'src/ui/rdcp.dateBox.js',
rdcp.dateBoxAdapter = [];
rdcp.dateBoxDefaults = {
    fit: true,
    formatter: function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        return y + '-' + m + '-' + d;
    },
    parser: function (s) {
        var t = Date.parse(s);
        if (!isNaN(t)) {
            return new Date(t);
        } else {
            return new Date();
        }
    }
};

/**
 *日期格式，精确到天
 * @param id
 * @param p
 */
rdcp.dateBox = function (id, p) {
    var $dateBox = rdcp.id(id);
    var settings = rdcp.extend({}, rdcp.dateBoxDefaults, p);
    settings = rdcp.adapt(settings, rdcp.dateBoxAdapter);
    settings.width = $dateBox.parent().width();
    settings.height = $dateBox.parent().height();
    $dateBox.datebox(settings);
};


/**
 *日期格式，精确到时分秒
 * @param id
 * @param p
 */
rdcp.datetimeBox = function (id, p) {
    var $dateBox = rdcp.id(id);
    $dateBox.datetimebox(p);
};
//'src/ui/rdcp.form.js',
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
// 'src/ui/rdcp.gform.js',
rdcp.gformDefaults = {
    // 整个向导表单创建完成,function(data, p){}
    onCreate:null,
    onStepCreate:null,

    onFieldCreate:null,

    //下一步
    onStepNext:null,
    //上一步
    onStepPre: null,
    //提交
    onSubmit:function(data,p){
        $.messager.alert('提示', '无法提交表单，请自定义onSubmit！', 'info');
    },



    //创建步骤
    createStep:function(data,p){
        var stepTmpl =
            "<div id='form_${form.code}' class='SR_faceContent' {{if index>0}}style='display:none'{{/if}} >" +
                "<h1>${form.name}</h1>" +
                "<div class='faceListBox'>" +
                "<table class='faceListTable'></table>" +
                "</div>" +
                "<div class='faceListTableBtnBox'>" +
                "<ul class='faceListTableUl'></ul>" +
                "</div>" +
                "</div>";
        data.stepContainer = $.tmpl(stepTmpl, {index: data.index, form: data.form});
        var  buttonBarContainer=data.stepContainer.find(".faceListTableUl");
        var  buttonData={index:data.index,buttonContainer:buttonBarContainer,form:data.form};
        if (data.index > 0){
            rdcp.gformDefaults.createPreBtn(buttonData,p);
        }
        if (data.index >= 0 && data.index < p.forms.length - 1){
            rdcp.gformDefaults.createNextBtn(buttonData,p);
        }
        if (data.index == p.forms.length - 1){
            rdcp.gformDefaults.createSubBtn(buttonData,p);
        }

        if(p.onStepCreate){
            p.onStepCreate(data,p);
        }


    },

    //创建字段
    _createField:function(data,p){
        var fieldContainerTmpl =
            "<tr>" +
                "<td class='faceListBoxTitle'>${field.name}</td>" +
                "<td class='faceListBoxFiled'></td>" +
                "</tr>";
        var fieldContainer = $.tmpl(fieldContainerTmpl, {field: data.field});
        data.fieldContainer=fieldContainer;

        //判断用户是否写了createField
        if(p.createField){
            if(p.createField(data,p)){
                data.stepContainer.find(".faceListTable").append(fieldContainer);
                return;
            }
        }
        var fieldDefault;
        if (data.field.type == "TextField") {
            fieldDefault="<input name='" + data.field.code + "' type='text'  />";
        }
        else if(data.field.type=="hiddenField"){
            fieldDefault="<input name='" + data.field.code + "' type='hidden'  />";
        }
        else if(data.field.type=="radioField"){
            fieldDefault="<input name='" + data.field.code + "' type='radio'  />";
        }
        else if(data.field.type=="readOnlyField"){
            fieldDefault="<input name='" + data.field.code + "' type='text' readonly='readonly'  />";
        }
        else if(data.field.type=="checkboxField"){
            fieldDefault="<input name='" + data.field.code + "' type='checkbox'   />";
        }
        else if(data.field.type=="passwordField"){
            fieldDefault="<input name='" + data.field.code + "' type='password'   />";
        }
        else if(data.field.type=="textareaField"){
            fieldDefault="<textarea name='"+data.field.code+"' rows='5' cols='20'></textarea>"
        }
        else if(data.field.type=="emptyField"){
            fieldDefault=data.field.code;
        }
        if(p.onFieldCreate){
            p.onFieldCreate(data,p);
        }
        fieldContainer.find(".faceListBoxFiled").append(fieldDefault);
        data.stepContainer.find(".faceListTable").append(fieldContainer);
    },
    //创建下一步按钮
    createNextBtn:function(data,p){
        var btnNext = $("<a href='javascript:void(0);' class='faceListTableBtn btnNext'>下一步</a>");
        btnNext.click(function () {
            if(p.onStepNext){
                if(!p.onStepNext(data,p)){
                    return;
                }
            }
            rdcp.id(p.id).find(".SR_faceContent").hide();
            rdcp.id(p.id).find("#form_" + p.forms[data.index + 1].code).show();
        });
        data.buttonContainer.append($("<li>").append(btnNext));

    },
    //创建上一步按钮
    createPreBtn:function(data,p){
        var btnPre = $("<a href='javascript:void(0);' class='faceListTableBtn btnPre'>上一步</a>");
        btnPre.click(function () {
            if(p.onStepPre){
                if(!p.onStepPre(data,p)){
                    return;
                }
            }
            rdcp.id(p.id).find(".SR_faceContent").hide();
            rdcp.id(p.id).find("#form_" + p.forms[data.index - 1].code).show();
        });
        data.buttonContainer.append($("<li>").append(btnPre));

    },
    //创建提交按钮
    createSubBtn:function(data,p){
        var btnSubmit = $("<a href='javascript:void(0);' class='faceListTableBtn btnSubmit'>提交</a>");
        btnSubmit.click(function () {
            p.onSubmit(data,p);
        });
        data.buttonContainer.append($("<li>").append(btnSubmit));
    },
    /**
     * 跳转到指定的step
     * @param stepNum 为step步骤号
     */
    toStep:function(stepIndex,p){
        if(p.forms[stepIndex]){
            rdcp.id(p.id).find(".SR_faceContent").hide();
            rdcp.id(p.id).find("#form_" + p.forms[stepIndex].code).show();
        }
        else{
            $.messager.alert('提示', 'index：'+stepIndex+'不存在', 'info');
        }
    }
};


/**
 * 创建向导表单
 * @param id 表单容器id
 * @param seqId 表单向导批次号
 * @param action 表单的提交地址
 * @param p 扩展属性
 */
rdcp.gform = function (id, seqId, action, p) {
    var settings = rdcp.extend({}, rdcp.gformDefaults, p);
    settings.id = id;
    settings.seqId = seqId;
    settings.action = action;
    // 获取向导表单数据
    var ds = "!ESale/System/Form/~java/Form.getForm?seqId=" + settings.seqId;
    rdcp.request(ds, null, function (data) {
        settings.forms = data.body;

        //移除上一次请求内容 防止内容重复
        rdcp.id(settings.id).find('.faceListForm').remove();


        if (settings.forms.length > 0){
            //生成整体页面容器
            var container = rdcp.id(settings.id).addClass("SR_faceContentBox").append("<form class='faceListForm'></form>");
            //对表单进行遍历
            rdcp.each(settings.forms, function (formIndex, form) {

                var stepData={index:formIndex,stepContainer:{},form:form};
                rdcp.gformDefaults.createStep(stepData,settings);

                //对字段就行遍历
                rdcp.each(form.fields,function(fieldIndex, field){
                    var fieldData={index:fieldIndex,field:field,stepContainer:stepData.stepContainer};
                    rdcp.gformDefaults._createField(fieldData,settings);
                });

                //把生成好的step加入页面中
                container.find(".faceListForm").append(stepData.stepContainer);
            });
            if(settings.onCreate){
                var formData={container:container,forms:data.body};
                settings.onCreate(formData,settings);
            }
        }
        else{
            $.messager.alert('提示','当前无可用的表单','info');
            return;
        }

    }, null);
};


//'src/ui/rdcp.comboBox.js',
rdcp.comboBoxAdapter = [];
rdcp.comboBoxDefaults = {
    // 自动选择方式：remote(远程）， local(本地）
    autoSelectType: "remote",

    // 自动选择索引：
    // 当autoSelectType == "remote"，该字段填SQL字段名，如:check，对应query里面的<param name="checked-col">checked</param>
    // 当autoSelectType == "local", 该字段填序号，0代表自动选择第一个，可传入数组或数字，如：0或[0,1]
    autoSelectItemIndex: "checked",
    multiple: false,
    editable: false,
    valueField: 'id',
    textField: 'text',
    panelHeight: "auto"

};

rdcp.comboBox = function (id, ds, p) {

    var settings = rdcp.extend({}, rdcp.comboBoxDefaults, p);
    settings = rdcp.adapt(settings, rdcp.comboBoxAdapter);
    settings.url = ds.indexOf("!") == 0 ? ds : "framework.do?ds=" + ds;

    var $comboBox = rdcp.id(id);

//    if (settings.url.indexOf("!") != 0) {
//        alert("数据源：" + ds + "为非模块化数据源，本控件不支持旧访问模式");
//        return;
//    }

    if ($comboBox[0].tagName != "INPUT") {
        alert("请不要对select标签生成combobox，请改用:<ipput id=\"" + $comboBox.attr("id") + "\" />");
        return;
    }

//    if (!$comboBox.hasClass("easyui-combobox")) {
//        alert("请在\n" + $comboBox[0].outerHTML + "\n中指定class=\"easyui-combobox\"，否则会出现onLoadSuccess调用两次的问题");
//        return;
//    }

//    settings.width = $comboBox.parent().width();
//    settings.height = $comboBox.parent().height();
    settings.onLoadSuccess_tmp = settings.onLoadSuccess;
    settings.onSelect_tmp = settings.onSelect;
    settings.onUnselect_tmp = settings.onUnselect;

    settings.onLoadSuccess = function (data) {
        if (settings.autoSelectType == "remote") {
            rdcp.each(data, function () {
                if ("true" == this[settings.autoSelectItemIndex]) {
                    rdcp.comboBox.setValue(id, this[settings.valueField]);
                }
            });
        } else if (settings.autoSelectType == "local") {
            rdcp.comboBox.selectByIndexs(id, settings.autoSelectItemIndex);
        } else {
            alert("What the hell?");
        }

        if (settings.onLoadSuccess_tmp) {
            settings.onLoadSuccess_tmp();
        }
    };

    settings.onSelect = function (record) {
        if (record != undefined) {
            $comboBox.val(rdcp.comboBox.getValues(id));
            if (settings.onSelect_tmp) {
                settings.onSelect_tmp();
            }
        }
    };

    settings.onUnselect = function (record) {
        if (record != undefined) {
            $comboBox.val(rdcp.comboBox.getValues(id));
            if (settings.onUnselect_tmp) {
                settings.onUnselect_tmp();
            }
        }
    };

    settings.onSelect();

    $comboBox.combobox(settings);

    var $textbox = $comboBox.combobox("textbox");
    $textbox.css("cursor", "pointer");

    $comboBox.combobox("panel").css("cursor", "pointer");

    // 如果combobox为只读或禁用，则添点combobox的input时不显示选择框
    if (settings.readonly != true && settings.disabled != true) {

        // 如果combobox不可编辑，则点击combobox的input时显示、隐藏选择框
        if (settings.editable == false) {
            $textbox.on("click", function () {
                var $panel = $comboBox.combobox("panel").parent();
                var isShow = $panel.css("display");
                if (isShow == "none") {
                    $comboBox.combobox("showPanel");
                } else {
                    $comboBox.combobox("hidePanel");
                }
            });
        }
    }

};

rdcp.comboBox.select = function (id, value, p) {
    rdcp.id(id).combobox("select", value);
};

rdcp.comboBox.selectByIndexs = function (id, indexs, p) {
    var $combobox = rdcp.id(id);

    if (rdcp.isArray(indexs)) {
        rdcp.each(indexs, function () {
            var intemIndex = $combobox.combobox('getData')[this].id;
            rdcp.comboBox.select(id, intemIndex);
        });
    } else {
        var intemIndex = $combobox.combobox('getData')[indexs].id;
        rdcp.comboBox.select(id, intemIndex);
    }
};

rdcp.comboBox.unselect = function (id, value, p) {
    rdcp.id(id).combobox("unselect", value);
};

rdcp.comboBox.getText = function (id, p) {
    return rdcp.id(id).combobox("getText");
};

rdcp.comboBox.getValue = function (id, p) {
    return rdcp.id(id).combobox("getValue");
};

rdcp.comboBox.getValues = function (id, p) {
    return rdcp.id(id).combobox("getValues");
};

rdcp.comboBox.setValue = function (id, value, p) {
    rdcp.id(id).combobox("setValue", value);
};

rdcp.comboBox.setValues = function (id, values, p) {
    rdcp.id(id).combobox("setValue", values);
};

/**
 * 加载最原始的下拉框
 * @param id
 * @param ds
 * @param p
 */
rdcp.dropdown = function (id, ds, p) {

    var settings = rdcp.extend({}, rdcp.comboBoxDefaults, p);
    settings = rdcp.adapt(settings, rdcp.comboBoxAdapter);
    settings.id = id;
    settings.ds = ds;

    var params = {};
    if (p != undefined)
        if (p.params != undefined)
            params = p.params;


    rdcp.request(ds, params, function (data) {

            var $select = rdcp.id(settings.id);
            $select.html("");
            var opts = data;
            var selectOption = null;
            rdcp.each(opts, function () {
                var val = this[settings.valueField];
                var txt = this[settings.textField];
                var checked = this[settings.autoSelectItemIndex];
                var $opt = $("<option value='" + val + "'>" + txt + "</option>");

                //if ("true" == checked) {
                if (selectOption == null) {
                    selectOption = this;
                }

                if (settings.formatter) {
                    var o = settings.formatter(this);
                    if (o)
                        $select.append(o);
                } else {
                    $select.append($opt);
                }
            });


            if (settings.autoSelectType == "remote") {
                $select.val(selectOption[settings.valueField]);
            } else if (settings.autoSelectType == "local") {
                $select.get(0).options[settings.autoSelectItemIndex].setAttribute("selected", "true");
            }
        }, settings
    )
    ;
}
;


rdcp.dropdown2 = function (id, ds, p) {

    var settings = rdcp.extend({}, rdcp.comboBoxDefaults, p);
    settings = rdcp.adapt(settings, rdcp.comboBoxAdapter);
    settings.id = id;
    settings.ds = ds;

    rdcp.request(ds, {}, function (data) {

        var $select = rdcp.id(settings.id);
        $select.html("");
        var opts = data;
        var selectOption = null;
        rdcp.each(opts, function () {
            var val = this[settings.valueField];
            var txt = this[settings.textField];
            var checked = this[settings.autoSelectItemIndex];
            var $opt = $("<option value='" + val + "'>" + txt + "</option>");

            if ("true" == checked) {
                selectOption = selectOption == null ? this : selectOption;
            }

            if (settings.formatter) {
                var o = settings.formatter(this);
                if (o)
                    $select.append(o);
            } else {
                $select.append($opt);
            }
        });

        /*
         if (settings.autoSelectType == "remote") {
         $select.val(selectOption[settings.valueField]);
         } else if (settings.autoSelectType == "local") {
         $select.get(0).options[settings.autoSelectItemIndex].setAttribute("selected", "true");
         }
         */
        //判断有没有提供回调函数，如果有的话，则执行回调函数
        if (typeof p["loadComplete"] === "function") {
            p["loadComplete"]();
        }

    }, settings);
};
// 'src/ui/rdcp.tips.js',
rdcp.tipsAdapter = [];

rdcp.tipsDefaults = {
    showDelay: 0,
    hideDelay: 100,
    trackMouse: false
};

rdcp.tip = function (msg) {
    $.messager.show({
        title: '系统消息',
        msg: msg,
        showType: 'show'
    });
};

rdcp.tooltip = function ($target, p) {
    var settings = rdcp.extend({}, rdcp.tipsDefaults, p);
    settings = rdcp.adapt(settings, rdcp.tipsAdapter);
    $target.tooltip(settings);
};

rdcp.tooltip.lowerNavMenu = function ($target, menu, p) {
    rdcp.tooltip($target, {
        content: function () {
            return rdcp.id("sub_menu_list_" + menu.id);
        },
        hideEvent: 'none',
        onShow: function () {
            var t = $(this);
            var state = t.tooltip('tip');
            state.css({
                left: $(this).position().left + 8,
                top: $(this).position().top + $(this).outerHeight() + 8
            });
            state.find(".tooltip-arrow-outer").css('margin-left',
                "-" + (state.width() / 2 - $(this).width() / 2 + 18) + "px");
            state.find(".tooltip-arrow").css('margin-left',
                "-" + (state.width() / 2 - $(this).width() / 2 + 18) + "px");
            t.tooltip('tip').focus().unbind().bind('blur', function () {
                t.tooltip('hide');
            });
        }
    });
    return rdcp.id("sub_menu_list_" + menu.id);
};





// 'src/ui/rdcp.menu.js',
rdcp.menu = function (id, ds, p) {

    if(rdcp.menuDefaults.menuBuilder == null || rdcp.menuDefaults.menuBuilder == undefined){
        alert("请指定rdcp.menuDefaults.menuBuilder" + "\n如：rdcp.menu.lowerNavMenuBuilder");
        return;
    }
    var $container = rdcp.id(id);
    rdcp.request(ds, null, function (data) {
        rdcp.menuDefaults.menuBuilder.build($container, data);
    });
};

rdcp.menu.openPage = function (id, title, url, closable, p) {
    rdcp.menuDefaults.menuBuilder.openPage(id, title, url, closable);
};

rdcp.menuAdapter = [];
rdcp.menuDefaults = {
    menuBuilder: null
};
// 'src/ui/rdcp.menu.lowerNavMenuBuilder.js',
rdcp.menu.lowerNavMenuBuilder = {};

rdcp.menu.lowerNavMenuBuilder.build = function ($container, menuTree) {

    $container.append($("<UL>"));

    rdcp.each(menuTree, function (index1) {

        var menu_level_1 = this;
        var $li = addMenu_level_1($container, menu_level_1);

        /*
         var $subMenuContainer = addSubMenuContainer(menu_level_1);
         addSubMenuContainerTips($li, $subMenuContainer);
         rdcp.each(menu_level_1.children, function (index2) {
         var menu_level_2 = this;
         addMenu_level_2(menu_level_2, menu_level_1.children.length == index2 + 1 ? true : false, $subMenuContainer);

         rdcp.each(menu_level_2.children, function (index3) {
         var menu_level_3 = this;
         addMenu_level_3(menu_level_3, $subMenuContainer);
         });
         });
         */
    });

    addOpenedPageContainerTips(rdcp.id("openedList"), rdcp.id("opened_page_list"));

    /**
     * 添加一级菜单到导航条
     *
     * @param $container 导航条ID
     * @param menu_level_1 一级菜单对象
     * @returns 一级菜单DOM对象
     */
    function addMenu_level_1($container, menu_level_1) {
        var $ul = $container.find("ul");
        var $li = $("<LI>");
        var $a = $("<A>");
        $a.html(menu_level_1.text);
        $li.append($a);
        /*$li.addClass("navi-btn");
         $li.on("mouseover", function () {
         $li.addClass("navi-btnhover");
         });
         $li.on("mouseout", function () {
         $li.removeClass("navi-btnhover");
         });*/
        $li.on("click", function () {
            parent.left.loadMenu(menu_level_1.id, 2);
        });
        $ul.append($li);

        return $li;
    };


    /**
     * 根据一菜单对象创建对应的子菜单容器
     * 用于存储该一级菜单下的二、三级菜单
     * 所有容器存放在<div id="sub_menu_container"></div>里面
     *
     * @param menu_level_1一级菜单对象
     * @returns 子菜单容器DOM对象
     */
    function addSubMenuContainer(menu_level_1) {
        var $container = rdcp.id("sub_menu_container");
        var $menuContainer = $("<DIV>");
        $menuContainer.addClass("lowernav");
        $menuContainer.attr("id", "sub_menu_container_" + menu_level_1.id);
        $menuContainer.html("<table cellspacing='0'>" +
            "<tr>" +
            //"<td class='leftfarme'></td>" +
            "<td class='middle'>" +
            "<table><tr></tr></table>" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "</table>");

        $container.append($menuContainer);

        return $menuContainer;
    };

    /**
     * 给一级菜单的DOM对象（即<li>）添加显示子菜单容器显示事件
     * @param $li 一级菜单的DOM对象
     * @param $subMenuContainer 子菜单容器DOM对象
     */
    function addSubMenuContainerTips($li, $subMenuContainer) {
        rdcp.tooltip($li, {
            content: $subMenuContainer,
            //hideEvent: 'none',
            onShow: function () {
                var t = $(this);
                var state = t.tooltip('tip');
                state.css({
                    left: $(this).position().left + 8,
                    top: $(this).position().top + $(this).outerHeight() + 8
                });
                state.find(".tooltip-arrow-outer").css('margin-left', "-" + (state.width() / 2 - $(this).width() / 2 + 18) + "px");
                state.find(".tooltip-arrow").css('margin-left', "-" + (state.width() / 2 - $(this).width() / 2 + 18) + "px");
                t.tooltip('tip').unbind().bind('mouseenter',function () {
                    t.tooltip('show');
                }).bind('mouseleave', function () {
                    t.tooltip('hide');
                });
            }
        });
    };

    function addOpenedPageContainerTips($opener, $openedPagesContainer) {
        rdcp.tooltip($opener, {
            content: $openedPagesContainer,
            onShow: function () {
                var t = $(this);
                var state = t.tooltip('tip');
                state.css({
                    left: $(this).position().left + $(this).width() - state.width() - 13,
                    top: $(this).position().top + $(this).outerHeight() + 8
                });
                state.find(".tooltip-arrow-outer").css('margin-left', (state.width() / 2 - $(this).width() / 2) + "px");
                state.find(".tooltip-arrow").css('margin-left', (state.width() / 2 - $(this).width() / 2) + "px");
                t.tooltip('tip').unbind().bind('mouseenter',function () {
                    t.tooltip('show');
                }).bind('mouseleave', function () {
                    t.tooltip('hide');
                });
            }
        });
    };

    function addMenu_level_2(menu_level_2, isLastMenu, $subMenuContainer) {

        var html = "<td class='menuListContainer'>" +
            "<ul>" +
            "<li><h4>" + menu_level_2.text + "</h4></li>" +
            "</ul>" +
            "</td>";

        var $menuListContainer = $(html);

        if (!isLastMenu) {
            $menuListContainer.addClass("rightline");
        }

        $subMenuContainer.find(".middle > table > tbody > tr").append($menuListContainer);
    };

    function addMenu_level_3(menu_level_3, $subMenuContainer) {
        var html = "<li>" +
            "<table>" +
            "<tr>" +
            "<td class='collectTd'></td>" +
            "<td class='menuTd'></td>" +
            "</tr>" +
            "</table>" +
            "</li>";

        var $menuContainer = $(html);

        var $collectA = $("<A>");
        $collectA.attr("href", "javascript:void(0)");
        $collectA.addClass("collect");
        $menuContainer.find(".collectTd").append($collectA);
        $collectA.on("click", function () {
            alert("菜单收藏功能暂未实现");
        });

        var $menuA = $("<A>");
        $menuA.css("cursor", "pointer");
        $menuA.attr("href", "javascript:void(0)");
        $menuA.html(menu_level_3.text);
        $menuContainer.find(".menuTd").append($menuA);
        $menuA.on("click", function () {
            rdcp.menu.lowerNavMenuBuilder.openPage(menu_level_3.id, menu_level_3.text, menu_level_3.attributes.menuurl, true);
        });
        $menuA.on("mouseover", function () {
            $collectA.addClass("collectHover");
        });
        $menuA.on("mouseout", function () {
            $collectA.removeClass("collectHover");
        });

        $subMenuContainer.find(".middle .menuListContainer").last().find("ul").append($menuContainer);
    };


};

rdcp.menu.lowerNavMenuBuilder.openPage = function (id, title, url, closable) {

    var iframeId = "page_frame_" + id;

    $("iframe[id^='page_frame_']").hide();

    if (rdcp.isDOMExists(iframeId)) {
        rdcp.id(iframeId).show();
    } else {
        var $iframeContainer = rdcp.id("pageFrameContainer");

        var $page_frame = $("<IFRAME>");
        $page_frame.attr("id", iframeId);
        $page_frame.attr("title", title);
        $page_frame.attr("src", url);
        $page_frame.addClass("pageFrame");

        $iframeContainer.append($page_frame);


        var $pageOpenerContainer = $("<DIV>");
        $pageOpenerContainer.addClass("projectbuttom");
        $pageOpenerContainer.on("mouseover", function () {
            $pageOpenerContainer.addClass("projectbuttom_hover");
        });
        $pageOpenerContainer.on("mouseout", function () {
            $pageOpenerContainer.removeClass("projectbuttom_hover");
        });

        var $openerA = $("<A>");
        $openerA.attr("href", "javascript:void(0)");
        $openerA.attr("id", "open_menu_"+id);
        $openerA.css("width", "130px");
        $openerA.html(title);
        $openerA.on("click", function () {
            //rdcp.id("main").hide();
            parent.$("#body_page").hide();
            parent.$("#pageFrameContainer").show();
            $("iframe[id^='page_frame_']").hide();
            rdcp.id("page_frame_" + id).show();
            parent.clickMenuMark(id);
        });
        $pageOpenerContainer.append($openerA);

        if (closable) {
            var $closerA = $("<A>");
            $closerA.attr("href", "javascript:void(0)");
            $closerA.addClass("close");
            $closerA.on("click", function () {
                $(this).parent().remove();
                var $iframe = rdcp.id("page_frame_" + id);
                /*$iframe.prev().show(); */
                $iframe.remove();

                parent.closeMenuMark(id);
            });
            $pageOpenerContainer.append($closerA);
        }

        rdcp.id("opened_page_list").append($pageOpenerContainer);
    }
};

// 'src/ui/rdcp.mask.js',
rdcp.mask = function ($container, msg, p) {
    //kinz 2014-07-04 计算高度，令到遮罩可以覆盖整个页面，进度提示始终在中间
    var clientHeight = $container[0].clientHeight;
    if (clientHeight < window.screen.availHeight)
        clientHeight = window.screen.availHeight;

//    alert(clientHeight + "    " + scrollHeight+"   "+height);

    $('<div class="datagrid-mask" style="display:block;height: 100%;z-index: 9998;"></div>').appendTo($container).css("height",
        clientHeight);
    var msg = $('<div class="datagrid-mask-msg" style="display:block;left:50%;z-index: 9999;"></div>').html(msg).appendTo($container);
    msg.css('marginLeft', -msg.outerWidth() / 2);
    msg.css("top", "45%");
    msg.css("position", "fixed");
};

rdcp.unmask = function ($container) {
    $container.children('div.datagrid-mask-msg').remove();
    $container.children('div.datagrid-mask').remove();
};
// 'src/ui/rdcp.messages.js',
rdcp.messagesAdapter = [];
rdcp.messagesDefaults = {
    autoClose: true,
    autoCloseDelay: 5000
};

rdcp.messages = function (ds, params, p) {
    var settings = rdcp.extend({}, rdcp.dateBoxDefaults, p);
    settings = rdcp.adapt(settings, rdcp.dateBoxAdapter);
    settings.ds = ds;
    settings.params = params;

    rdcp.request(ds, params, function (data) {
        if (settings.handler) {
            settings.handler(data);
        } else {
            rdcp.each(data.body.row, function (i) {
                $.messager.show({
                    title: '系统消息',
                    msg: this.cell[3],
                    showType: 'show'
                });
            });
        }
    }, settings)

};

//window.alert = function (msg) {
//    $.messager.alert('系统消息', msg);
//}
//
//window.confirm = function (msg,fn) {
//     $.messager.confirm("操作提示",msg,fn);
//}
// 'src/ui/rdcp.dialog.js'
/**
 * Created with jse7en.
 * User: jse7en
 * Date: 13-5-7
 * Time: 下午2:09
 */
rdcp.dialogDefault = {
    title: rdcp.lang.title,
    width: 500,
    height: 300,
    href: null,
    modal: true,        // 是否有遮蒙
    collapsible: true,  // 能否折叠
    resizable: true,    // 能否调整大小
    draggable: true,
    minimizable: false,
    maximizable: true,
    closable: true,
    buttons: []
};

rdcp.dialog = function (p) {
    var _dlg = rdcp.id(p.id);
    rdcp.dialogDefault.buttons = [
        {
            text: '取消',
//        iconCls: 'icon-r-no',
//        plain: true,
            handler: function () {
                rdcp.dialog.close(p.id);
            }
        }
    ];
    var _settings = rdcp.extend({}, rdcp.dialogDefault, p);
    rdcp.id(p.id).show();
    _dlg.dialog(_settings).dialog("open");
};

rdcp.dialog.show = function (id) {
    var _dlg = rdcp.id(id);
    _dlg.dialog("open");
};

rdcp.dialog.close = function (id) {
    var _dlg = rdcp.id(id);
    _dlg.dialog("close");
};

/**
 * 对话框
 * @param title
 * @param msg
 * @param fnc
 */
rdcp.confirm = function (title, msg, fnc) {
    if ($.messager) {
        $.messager.confirm(title, msg, fnc);
    } else {
        func(confirm(msg));
    }
};
