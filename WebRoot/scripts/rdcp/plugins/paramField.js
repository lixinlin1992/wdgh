/**
 *
 * 数据源参数属性编辑器插件
 * 依赖于 rdcp.js 和 propertygrid.js
 *
 * 插件的结构是：
 * 左边是一个属性表单项的列表，右边是各个字段的属性编辑器
 *
 *
 */

/**
 * User: bearangel
 */


var _ParamFieldDialogFlag = false;

var _sourceTypeMap = {
    static: '静态参数',
    areaData: '区域参数',
    pageData: '页面参数'
}

//当前正在处理的数据源参数字段属性
var _currentParamProperty = null;
//当前正在处理的数据源参数字段属性的JSON对象
var _currentParamPropertyJson = null;
//字段的属性编辑
var _paramPropertyGrid = null;

RDCP.ParamFieldPropertyEditor = function() {
};

RDCP.ParamFieldPropertyEditor.prototype = {
    getCode:function() {
        return "param_field";
    },

    createEditor:function(grid, p) {
        var _html = "<table style='border: none;width: 100%;height: 100%;padding: 0px;border-collapse: collapse;margin: 0px;'>" +
                "<td style='border: none;margin: 0px;padding: 0px;'>" +
                "数据源参数" +
                "</td><td style='border:none;width:10px;' valign='top'>" +
                "<input type='button' value='设置' onclick='_showParamFieldEditor(\"" + grid.options["id"] +
                "\",\"" + p.code + "\",\"" + escape(p.name + " 设置") + "\")' style='height:18px;'>" +
                "</td></tr></table>";
        return _html;
    }
};


/**
 * 打开表单字段编辑对话框进行编辑
 * 如果已经打开，则只显示，并刷新相关的数据
 * @param property_grid_id 父属性编辑器的ID
 * @param code 表单字段属性编码
 * @param title 表单字段编辑对话框的标题
 */
function _showParamFieldEditor(property_grid_id, code, title) {
    if (_ParamFieldDialogFlag) {
        CORE.info("当前已经打开一个数据源参数属性编辑器，请先关闭");
        return;
    }
    _ParamFieldDialogFlag = true;
    var _dlgOpt = {
        title:unescape(title),
        modal : true,
        width : 670,
        height: 500,
        buttons : {
            "取消":function() {
                $("#_paramField_plugin_dlg").dialog("close");
            },
            "确定" : function() {
                //设置属性
                RDCP.PROPERTY_GRIDS[property_grid_id].setPropertyValue(code, CORE.json2str(_currentParamPropertyJson));
                $("#_paramField_plugin_dlg").dialog("close");
            }
        },
        onclose:function() {
            _ParamFieldDialogFlag = false;
        }
    };

    _currentParamProperty = RDCP.PROPERTY_GRIDS[property_grid_id].getProperties(code);
    if (typeof _currentParamProperty["value"] === "string")
        _currentParamPropertyJson = eval(_currentParamProperty["value"] == "" ? "[]" : _currentParamProperty["value"]);
    else
        _currentParamPropertyJson = _currentParamProperty["value"];

    if (document.getElementById("_paramField_plugin_dlg") == null) {
        $.ajax({
            url         :    'scripts/rdcp/plugins/paramField.html?t=' + new Date().getTime(),
            type        :    "GET",
            dataType    :    'text',//params['dataType'] || 'text',
            data        :    '',
            success     :    function(data, textStatus) {
                $(document.body).append(data);
                _updateParamFields(_currentParamPropertyJson);
                $("#_paramField_plugin_dlg").dialog(_dlgOpt);
            },
            error       :    function(data) {
            }
        });
    } else {
        _updateParamFields(_currentParamPropertyJson);
        $("#_paramField_plugin_dlg").dialog(_dlgOpt);
    }
}

function _updateParamFields(fieldData) {
    if (typeof fieldData === "string")
        fieldData = eval(fieldData == "" ? "[]" : fieldData);

    var _listTable = $("#_paramField_plugin_field_list");
    //先清空原有的属性
    _listTable.find("tr[type='fieldrow']").remove();
    if (_paramPropertyGrid != null)
        _paramPropertyGrid.setProperties({});

    var _fieldLength = 0;

    //加入新的属性
    $.each(fieldData, function(i, n) {
        _listTable.append("<tr type='fieldrow' fieldid='" + n["id"]["value"] +
                "' onclick='_editParamField(\"" + n["id"]["value"] + "\")'><td height='20' id='_name_td_" +
                n["id"]["value"] + "'>" +
                n["name"]["value"] + "</td><td id='_code_td_" + n["id"]["value"] + "'>" +
                n["code"]["value"] +"</td><td id='_key_td_" + n["id"]["value"] + "'>" +
                n["key"]["value"] +
                "</td><td>" + _sourceTypeMap[n["sourceType"]["value"]] +
                "</td>" +
                "<td align='center'>" +
                "<a href='javascript:' onclick='_moveUpParamField(\"" + n["id"]["value"] +
                "\");' title='上移'>↑</a>&nbsp;" +
                "<a href='javascript:' onclick='_moveDownParamField(\"" + n["id"]["value"] +
                "\");' title='下移'>↓</a>&nbsp;" +
                "<a href='javascript:' onclick='_removeParamField(\"" + n["id"]["value"] + "\");' title='移除'>—</a>" +
                "</td>" +
                "</tr>");
        if (_fieldLength == 0)
            _editParamField(n["id"]["value"]);
        _fieldLength++;
    });

    //如果没有属性，则显示空行，并显示添加按钮
    if (_fieldLength == 0) {
        _listTable.append("<tr type='fieldrow'><td height='20' colspan='5'>没有表单字段，请先添加</td></tr>");
    }
}


function _addParamField() {
    if (_currentParamPropertyJson == null) {
        return;
    }

    var _field_add_dlg_opt = {
        title:"添加表单字段",
        modal : true,
        width : 320,
        height: 170,
        modal:true,
        buttons : {
            "确定" : function() {
                with (document._paramField_Plugin_Add_Form) {
                    if ($.trim(name.value) == "") {
                        CORE.info("名称不能为空");
                        name.focus();
                        return;
                    }
                    if($.trim(sourceType.value) == "static"){
                        if ($.trim(code.value) == "") {
                            CORE.info("静态参数不能为空");
                            code.focus();
                            return;
                        }
                    }else{
                        if ($.trim(key.value) == "") {
                            CORE.info("取值键不能为空");
                            key.focus();
                            return;
                        }
                    }

                    _currentParamPropertyJson.push(_createEmptyParamFieldData(name.value, code.value,key.value,sourceType.value));
                }
                //_currentFieldProperty["value"] = CORE.json2str(_currentFieldPropertyJson);
                _updateParamFields(_currentParamPropertyJson);
                $("#_paramField_plugin_add_dlg").dialog("close");
            }
        }
    };

    document._paramField_Plugin_Add_Form.reset();
    $("#_paramField_plugin_add_dlg").dialog(_field_add_dlg_opt);
}

function _editParamField(id) {
    var _tmpField = null;
    $.each(_currentParamPropertyJson, function(i, n) {
        if (id == n["id"]["value"]) {
            _tmpField = n;
        }
    });
    if (_tmpField == null)
        return;

    if (_paramPropertyGrid == null)
        _paramPropertyGrid = new RDCP.PropertyGrid({
            id:"_paramField_plugin_field_editor",
            group:false,
            properties:{}
        });
    _tmpField["name"]["onchange"] = function(p, oldvalue, newvalue) {
        $("#_name_td_" + _tmpField["id"]["value"]).html(newvalue);
    };
    _tmpField["code"]["onchange"] = function(p, oldvalue, newvalue) {
        $("#_code_td_" + _tmpField["id"]["value"]).html(newvalue);
    };
    _tmpField["key"]["onchange"] = function(p, oldvalue, newvalue) {
        $("#_key_td_" + _tmpField["id"]["value"]).html(newvalue);
    };
    _tmpField["sourceType"]["formatter"] = function(p) {
        return _sourceTypeMap[p.value];
    }
    _paramPropertyGrid.setProperties(_tmpField);
}

function _removeParamField(id) {
    //先不做确认
    for (var i = 0; i < _currentParamPropertyJson.length; i++) {
        if (id == _currentParamPropertyJson[i]["id"]["value"]) {
            _currentParamPropertyJson.splice(i, 1);
            break;
        }
    }

    _updateParamFields(_currentParamPropertyJson);
}

//上移字段
function _moveUpParamField(id) {
    for (var i = 0; i < _currentParamPropertyJson.length; i++) {
        if (id == _currentParamPropertyJson[i]["id"]["value"]) {
            if (i == 0)
                return;
            var _tmp = _currentParamPropertyJson[i];
            _currentParamPropertyJson[i] = _currentParamPropertyJson[i - 1];
            _currentParamPropertyJson[i - 1] = _tmp;
            _updateParamFields(_currentParamPropertyJson);
            break;
        }
    }
}

//下移字段
function _moveDownParamField(id) {
    for (var i = 0; i < _currentParamPropertyJson.length; i++) {
        if (id == _currentParamPropertyJson[i]["id"]["value"]) {
            if (i == _currentParamPropertyJson.length - 1)
                return;
            var _tmp = _currentParamPropertyJson[i];
            _currentParamPropertyJson[i] = _currentParamPropertyJson[i + 1];
            _currentParamPropertyJson[i + 1] = _tmp;
            _updateParamFields(_currentParamPropertyJson);
            break;
        }
    }
}


/**
 * 创建空的表单字段域数据，不同类型将返回不同的数据
 */
function _createEmptyParamFieldData(name, code,key,sourceType) {
    var _fieldData = {
        "id":{
            name:"ID",
            code:"id",
            value:"" + new Date().getTime(),
            type:"hidden"
        },
        "name":{
            name:"名称",
            code:"name",
            value:name,
            type:"text"
        },
        "code":{
            name:"静态参数",
            code:"code",
            value:code,
            type:"text"
        },
        "key":{
            name:"取值键",
            code:"key",
            value:key,
            type:"text"
        },
        "sourceType":{
            name:"数据来源",
            code:"sourceType",
            value:sourceType,
            type:"select",
            readonly:"true"
        }
    };

    return _fieldData;
}


//注册属性编辑器
RDCP.registerEditor(new RDCP.ParamFieldPropertyEditor());