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