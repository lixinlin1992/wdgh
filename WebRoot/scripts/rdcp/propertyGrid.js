/**
 * @(#)jquery.propertyeditor.js.js 11-6-9 上午8:57
 * CopyRight 2011.  All rights reserved
 *
 */

/**
 * 属性编辑器
 * 特性：
 * 1. 使用json格式的数据
 * 2. 属性编辑器类型可扩展
 * 3. 属性可指定值变更事件监听器
 *
 * 依赖 rdcp.js，jQuery
 * User: kinz
 */

RDCP.PROPERTY_GRIDS = {};
RDCP.PROPERTY_EDITORS = {};

loadScript("scripts/edit_area/edit_area_full.js");

/**
 * 属性编辑表格控件
 *
 * 使用方法：
 * <table id="PropertyGrid"></table>
 *
 * .....
 *
 * var grid = new RDCP.PropertyGrid({id:"PropertyGrid",properties:[]});
 *
 * @param options
 * 参数选项说明：
 * id           :   要创建的表格的，必需提供
 * properties   :   属性数据，采用json格式，后面再详细说明，创建时可不提供，可在后期设置
 * group        :   是否分组，true 表示分组，false 表示不分组。默认分组
 *
 *
 * properties 参数格式定义：
 *
 * {
 *  "code":{
 *      name    : "",
 *      code    : "code",
 *      type    : "",
 *      value   : "",
 *      readonly: "true",//是否只读
 *      required: "true",//是否必须
 *      description: "",//属性描述
 *      formatter: function(p){}
 *      options : "",
 *      onchange: function(property,oldvalue,newvalue){}//如果这里返回false，则属性的值不会被改变
 *  },
 * ......
 * }
 *
 *
 * 样式说明：
 * 表格   propertyGrid
 */
RDCP.PropertyGrid = function(options) {
    this.options = {};

    this.initialize(options);
};

RDCP.PropertyGrid.prototype = {
    initialize:function(options) {
        this.options["id"] = options["id"];
        this.options["properties"] = options["properties"] || {};
        this.options["group"] = options["group"];

        this.tableObj = $("#" + this.options["id"]);
        this.tableObj.addClass("propertyGrid");

        this.changed = false;

        this.setProperties(this.options["properties"]);

        RDCP.PROPERTY_GRIDS[this.options["id"]] = this;
    },

    /**
     * 设置属性数据
     * @param properties
     */
    setProperties:function(properties) {
        this.options["properties"] = properties;

        this.buildGrid();
    },

    /**
     * 获取属性数据，返回json对象
     * 如果指定了code参数，则只返回该code对应的属性
     * @param code
     */
    getProperties:function(code) {
        if (code != undefined)
            return this.options["properties"][code];
        else
            return this.options["properties"];
    },

    /**
     * 创建属性表格
     * 1. 先将表格的所有行都删除
     * 2. 创建表头
     */
    buildGrid:function() {
        //清空所有的ToolTip
        $(".tool_tip_clz").poshytip("destroy");
        this.tableObj.empty();
        this.changed = false;

        //创建表头
        this.tableObj.append("<tr><th>名称</th><th>值</th></tr>");
        this.groups = [];
        var _keys = [];
        $.each(this.options["properties"], function(i, p) {
            _keys.push(p.code);
        });
        if (this.options["group"]) {
            //获取分组数据

            for (var i = 0; i < _keys.length; i++) {
                var p = this.options["properties"][_keys[i]];
                //如果没有分组，则默认为"其它"
                if (p.group == undefined || p.group == null || $.trim(p.group) == "") {
                    p.group = "其它";
                } else if (jQuery.inArray(p.group, this.groups) < 0) {
                    this.groups.push(p.group);
                }
            }
            this.groups.push("其它");

            //对每个分组分别创建属性编辑行，暂时不考虑性能问题
            for (var i = 0; i < this.groups.length; i++) {
                var g = this.groups[i];
                this.buildGroupRow(g);
                //接下来创建该组的属性
                for (var j = 0; j < _keys.length; j++) {
                    var p = this.options["properties"][_keys[j]];
                    //只处理本分组的属性
                    if (g == p.group) {
                        //alert(g+"   "+p.group+"  "+p.name);
                        this.buildPropertyRow(p);
                    }
                }
            }
        } else {
            for (var i = 0; i < _keys.length; i++) {
                this.buildPropertyRow(this.options["properties"][_keys[i]]);
            }
        }

        //最后为每个属性添加ToolTip
        $(".tool_tip_clz").poshytip({className:"tip-yellowsimple",showAniDuration :false,hideAniDuration :false});
    },

    /**
     * 创建分组行，点击分组行能收缩展开该组属性
     * @param groupName
     */
    buildGroupRow:function(groupName) {
        var rowId = "p_" + this.options["id"] + "_group_" + groupName;
        this.tableObj.append("<tr id='" + rowId + "' class='group'><td colspan='2' code='" + groupName +
                "' status='collspan'>" +
                groupName + "</td></tr>");

        $("#" + rowId).click(function(evt) {
            var g = $(evt.target).attr("code");
            var s = $(evt.target).attr("status");
            if (s == "expand") {
                $(evt.target).closest("table").find("tr[group='" + g + "']").show();
                $(evt.target).attr("status", "collspan");
            } else {
                $(evt.target).closest("table").find("tr[group='" + g + "']").hide();
                $(evt.target).attr("status", "expand");
            }
        });
    },

    /**
     * 创建属性编辑行
     * @param p
     */
    buildPropertyRow:function(p) {
        //如果属性是隐藏的，则不进行处理
        if (p["type"] == 'hidden')
            return;
        var _desc = p["description"] == null ? "" : $.trim(unescape(p["description"]));
        this.tableObj.append("<tr group='" + p.group + "' class='propertyRow " + (_desc == "" ? "" : "tool_tip_clz") +
                "' " + (_desc == "" ? "" : (" title='" + _desc + "'")) + "><td class='name'>" + p.name +
                ("true" == p["required"] ? "<span style='color:red;'>*</span>" : "") + "</td><td code='" + p.code +
                "'></td></tr>");
        this.updateProperty(p);
    },

    /**
     * 更新属性表格中的属性
     * @param p
     */
    updateProperty:function(p) {
        var _e = RDCP.PROPERTY_EDITORS[p.editor];
        if (_e == undefined || _e == null)
            _e = RDCP.PROPERTY_EDITORS["text"];
        if (p["readonly"] == "true" || p["readonly"] == true) {
            if (typeof p["formatter"] === "function")
                this.tableObj.find("td[code='" + p.code + "']").empty().append(p["formatter"](p));
            else
                this.tableObj.find("td[code='" + p.code + "']").empty().append(p["value"]);
        } else {
            this.tableObj.find("td[code='" + p.code + "']").empty().append(_e.createEditor(this, p));
        }
    },

    /**
     * 返回属性是否发生了改变
     */
    isChanged:function() {
        return this.changed;
    },

    /**
     * 设置属性值
     * @param code
     * @param value
     */
    setPropertyValue:function(code, value, newparams) {
        var _p = this.options["properties"][code];
        value = value + "";
        if ((typeof _p["onchange"] === "function") && (_p["onchange"](_p, _p.value, value) == false))
            return;
        //判断新旧值是否相同
        if ($.trim(value) == $.trim(_p.value))
            return;

        //增加校验
        var _validateResult = this.validatePropertyValue(_p, value);
        if (_validateResult != null) {
            CORE.info(_validateResult);
            return;
        }

        this.changed = true;
        _p.value = value;

		//循环额外参数,添加到属性
		if(newparams != undefined && newparams != null && newparams != "")
			for(var newparam in newparams)
			{
				_p[newparam] = newparams[newparam];
			}		
		
        this.updateProperty(_p);
    },
    /**
     * 获取指定code的属性值
     * @param code
     */
    getPropertyValue:function(code) {
        var _p = this.getProperties(code);
        if (_p == undefined || _p == null)
            return "";
        else
            return _p.value;
    },

    /**
     * 对属性值进行校验，暂时只校验是否必填
     * @param p
     * @param value
     * @return 校验结果，如果校验通过，则返回null
     */
    validatePropertyValue:function(p, value) {
        if (value == null || $.trim(value) == "") {
            if ("true" == p["required"])
                return "[" + p["name"] + "] 不能为空";
        } else {

        }
        return null;
    }
};


RDCP.registerEditor = function(editor) {
    this.PROPERTY_EDITORS[editor.getCode()] = editor;
};


/**
 * 属性类型编辑器样例
 * @param options
 */
RDCP.PropertyEditor = function() {

};

RDCP.PropertyEditor.prototype = {
    /**
     * 获取编辑器能处理的属性类型
     */
    getCode:function() {
    },
    active:function() {
    },
    disactive:function() {
    },
    /**
     * 创建一个编辑器的DOM元素
     * @param grid
     * @param p
     */
    createEditor:function(grid, p) {
    }
};


/**
 *  以下实现了系统内置的编辑器
 *
 */
/**
 * 文本编辑器
 */
RDCP.TextPropertyEditor = function() {
};
RDCP.TextPropertyEditor.prototype = {
    getCode:function() {
        return "text";
    },
    createEditor:function(grid, p) {
        return "<input type='text' name='_pro_" + p.code + "' value='" +
                ((p.value == undefined || p.value == null) ? "" : p.value) +
                "' onchange='RDCP.PROPERTY_GRIDS[\"" + grid.options["id"] + "\"].setPropertyValue(\"" + p.code +
                "\",this.value);' onfocus='this.select();'>";
    }
};

/**
 * 百分比编辑器
 */
RDCP.PercentPropertyEditor = function() {
};
RDCP.PercentPropertyEditor.prototype = new RDCP.TextPropertyEditor();
RDCP.PercentPropertyEditor.prototype.getCode = function() {
    return "percent";
};
RDCP.PercentPropertyEditor.prototype.createEditor = function(grid, p) {
    return "<input type='text' name='_pro_" + p.code + "' value='" +
            ((p.value == undefined || p.value == null) ? "" : (p.value + "%")) +
            "' onchange='RDCP.PROPERTY_GRIDS[\"" + grid.options["id"] + "\"].setPropertyValue(\"" + p.code +
            "\",this.value);' onfocus='this.value=RDCP.PROPERTY_GRIDS[\"" + grid.options["id"] +
            "\"].getPropertyValue(\"" + p.code +
            "\");this.select();' onblur='this.value=RDCP.PROPERTY_GRIDS[\"" + grid.options["id"] +
            "\"].getPropertyValue(\"" + p.code + "\")+\"%\";'>";
};

/**
 * 布尔型的编辑器
 */
RDCP.BoolPropertyEditor = function() {
};
RDCP.BoolPropertyEditor.prototype = {
    getCode:function() {
        return "bool";
    },
    createEditor:function(grid, p) {
        //alert((p.value || $.trim(p.value) == "true"));
        var _html = "<input type='checkbox' name='_pro_" + p.code + "' " +
                (($.trim(p.value + "") == "true") ? "checked='checked'" : "" ) +
                " onclick='RDCP.PROPERTY_GRIDS[\"" + grid.options["id"] + "\"].setPropertyValue(\"" + p.code +
                "\",this.checked);'>";
        //alert(_html);
        return _html;
    }
};

/**
 * 下拉框的编辑器
 */
RDCP.SelectPropertyEditor = function() {
};
RDCP.SelectPropertyEditor.prototype = {
    getCode:function() {
        return "select";
    },
    createEditor:function(grid, p) {
        var _options = p.options;
        if (typeof _options === 'string') {
            //如果是字符串类型，则采用 label=value&label=value的方式
            var _tmp = _options.split(",");
            _options = {};
            for (var i = 0; i < _tmp.length; i++) {
                var idx = _tmp[i].indexOf(":");
                if (idx == -1)
                    _option[_tmp[i]] = _tmp[i];
                else
                    _options[_tmp[i].substring(0, idx)] = _tmp[i].substring(idx + 1);
            }
        }

        var _html = "<select name='_pro_" + p.code + "' onchange='RDCP.PROPERTY_GRIDS[\"" + grid.options["id"] +
                "\"].setPropertyValue(\"" + p.code +
                "\",this.value);'>";

        var optionsCount = 0;
        $.each(_options, function(v, l) {
            //alert(l + "   " + v);
            _html += "<option value=" + v;
            if ($.trim(p.value) == $.trim(v)) {
                _html += " selected";
            }
            _html += ">" + l;
            _html += "</option>";
            //当第一次初始化时候，属性编辑器内存没有值，进行初始赋值
            if (optionsCount == 0 && p.value == "")
                p.value = v;
            optionsCount++;
        });
        _html += "</select>";
        return _html;
    }
};

/**
 * 文本框编辑器
 */
RDCP.TextAreaPropertyEditor = function() {
};
RDCP.TextAreaPropertyEditor.prototype = {
    getCode:function() {
        return "textarea";
    },
    createEditor:function(grid, p) {
        var _html = "<table style='border: none;width: 100%;height: 100%;padding: 0px;border-collapse: collapse;margin: 0px;'>" +
                "<td style='border: none;margin: 0px;padding: 0px;'>" +
                "<div style='margin:0px;border: 0px; overflow: hidden; width:120px;height: 100%;padding: 0px;resize:none;'>" +
                "<textarea rows='1' name='_pro_" +
                p.code + "' value='" +
                "' onchange='RDCP.PROPERTY_GRIDS[\"" + grid.options["id"] + "\"].setPropertyValue(\"" + p.code +
                "\",this.value);' onfocus='this.select();' readonly id='_p_e_" + p.code +
                "' style='overflow-y:hidden;text-overflow:ellipsis; resize: none; border: none; marging:0px; padding: 0px;'>" +
                ((p.value == undefined || p.value == null) ? "" : p.value) +
                "</textarea></div></td><td style='border:none;width:10px;' valign='top'>" +
                "<input type='button' value='设置' onclick='_showTextAreaEditor(\"" + p.name +
                "\",document.getElementById(\"_p_e_" + p.code + "\"))' style='height:18px;'>" +
                "</td></tr></table>";
        //alert(_html);
        return _html;
    }
};

/**
 * 显示编辑器
 * @param ele
 */
function _showTextAreaEditor(title, ele) {
    var _dlgOpt = {
        title:title,
        modal : true,
        width : 450,
        height: 450,
        buttons : {
            "确定" : function() {
                ele.value = $("#ta_textarea").val();
                $(ele).trigger('change');
                $("#_textareaeditor").dialog("close");
            }
        }
    };

    if (document.getElementById("_textareaeditor") == null)
        $(document.body)
                .append("<div id='_textareaeditor' style='height:97%;display: none;'><textarea id='ta_textarea" +
                "' style='width: 100%;height: 100%;'>" + ele.value + "</textarea></div>");
	else
		$("#ta_textarea").val(ele.value);
		
    $("#_textareaeditor").dialog(_dlgOpt);
}

/**
 * 多格式文本编辑
 */
RDCP.RichTextPropertyEditor = function() {
};
RDCP.RichTextPropertyEditor.prototype = {
    getCode:function() {
        return "html";
    },
    getSyntax:function() {
        return "html";
    },
    createEditor:function(grid, p) {
        var _html = "<table style='border: none;width: 100%;height: 100%;padding: 0px;border-collapse: collapse;margin: 0px;'><tr>" +
                "<td style='border: none;margin: 0px;padding: 0px;'>" +
                "<div style='margin:0px;border-bottom: medium none; border-left: medium none; overflow: hidden; border-top: medium none; border-right: medium none;width:120px;height: 100%;padding: 0px;'>" +
                "</div></td><td style='border:none;width:10px;' valign='top'>" +
                "<input type='button' value='设置' onclick='_showRichTextEditor(\"" + grid.options["id"] + "\",\"" + 
                p.code + "\",\"" + this.getSyntax() +
                "\")' style='height:18px;'>" +
                "</td></tr></table>";
        //alert(_html);
        return _html;
    }
};

function _showRichTextEditor(id,code,syntax) {
    var _dlgOpt1 = {
        title:"",
        modal : true,
        width : 450,
        height: 450,
        buttons : {
            "确定" : function() {
            	RDCP.PROPERTY_GRIDS[id].setPropertyValue(code,editAreaLoader.getValue("rte_textarea"));
                $("#_richtexeditor").dialog("close");
            }
        }
    };


    if (document.getElementById("_richtexeditor") == null) {
        $(document.body)
                .append("<div id='_richtexeditor' style='height:97%;display: none;'><textarea id='rte_textarea" +
                "' style='width: 100%;height: 100%;'></textarea></div>");
    }
    //初始化编辑器
    editAreaLoader.init({
        id: "rte_textarea"    // id of the textarea to transform
        ,start_highlight: true    // if start with highlight
        ,allow_resize: "none"
        ,allow_toggle: false
        ,word_wrap: true
        ,language: "zh"
        ,syntax: syntax
    });
    editAreaLoader.setValue("rte_textarea", RDCP.PROPERTY_GRIDS[id].getPropertyValue(code));

    $("#_richtexeditor").dialog(_dlgOpt1);
}

/**
 * 数据源选择器
 */
RDCP.DataSourcePicker = function() {
};
RDCP.DataSourcePicker.prototype = {
    getCode:function() {
        return "dspicker";
    },
    createEditor:function(grid, p) {
    	var dsname = "";
    	var dscode = "";
    	if(p.value != undefined && p.value != null){
    		var dsParamArr = p.value.split(":");
    		if(dsParamArr.length >1){
    			dscode = dsParamArr[0];
    			dsname = dsParamArr[1];
    		}else{
    			dscode = dsParamArr[0];
    			dsname = dscode;
    		}
    	}
        var _html = "<table style='border: none;width: 100%;height: 100%;padding: 0px;border-collapse: collapse;margin: 0px;'>" +
                "<td style='border: none;margin: 0px;padding: 0px;'>" +
                "<div style='margin:0px;border: 0px; overflow: hidden; width:120px;height: 100%;padding: 0px;resize:none;'>" +
                "<input type='text' onfocus='this.select();' name='_pro_label_" + p.code + 
                "' id = '_p_ds_label_" + p.code + "' value='" + dsname + 
                "' style='overflow-y:hidden;text-overflow:ellipsis; resize: none; border: none; marging:0px; padding: 0px;'/>" +
                "<input type='hidden' name='_pro_" +
                p.code + "' value='" + dscode +
                "' readonly id='_p_ds_" + p.code + "' />" + 
                "</div></td><td style='border:none;width:10px;' valign='top'>" +
                "<input type='button' value='设置' onclick='_pickDataSource(\"" + grid.options["id"] +
                "\",\"" + p.code + "\")' style='height:18px;'/>" +
                "</td></tr></table>";
        //alert(_html);
        return _html;
    }
};

/**
 * 设置数据源
 * @param ele
 */
function _pickDataSource(property_grid_id, code) {
	selectDatasource({
		selected:function(ds){						
//            RDCP.PROPERTY_GRIDS[property_grid_id].setPropertyValue(code,ds[0].code+":"+ds[0].name);
            RDCP.PROPERTY_GRIDS[property_grid_id].setPropertyValue(code,ds[0].code);
            document.getElementById("_p_ds_"+code).value = ds[0].code;
            document.getElementById("_p_ds_label_"+code).value = ds[0].name;
			return true;
		}
	});
}

RDCP.registerEditor(new RDCP.DataSourcePicker());
RDCP.registerEditor(new RDCP.TextPropertyEditor());
RDCP.registerEditor(new RDCP.PercentPropertyEditor());
RDCP.registerEditor(new RDCP.BoolPropertyEditor());
RDCP.registerEditor(new RDCP.SelectPropertyEditor());
RDCP.registerEditor(new RDCP.TextAreaPropertyEditor());
RDCP.registerEditor(new RDCP.RichTextPropertyEditor());