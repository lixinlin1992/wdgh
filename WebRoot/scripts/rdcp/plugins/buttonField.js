/**
 * User: bearangel
 * Date: 11-11-30
 * Time: 上午11:10
 * 按钮属性编辑器插件
 * 依赖于 rdcp.js 和 propertygrid.js
 */

var _currentFieldProperty = null;
var _currentFieldPropertyJson = null;

RDCP.ButtonFieldPropertyEditor = function() {
};

RDCP.ButtonFieldPropertyEditor.prototype = {
    getCode:function() {
        return "button_field";
    },

    createEditor:function(grid, p) {
        var _html = "<table style='border: none;width: 100%;height: 100%;padding: 0px;border-collapse: collapse;margin: 0px;'>" +
                "<td style='border: none;margin: 0px;padding: 0px;'>" +
                "按钮设置" +
                "</td><td style='border:none;width:10px;padding: 0px;' valign='top'>" +
                "<input type='button' value='设置' onclick='_showButtonFieldEditor(\"" + grid.options["id"] +
                "\",\"" + p.code + "\",\"" + escape(p.name) + "\")' style='height:18px;'>" +
                "</td></tr></table>";
        return _html;
    }
};


function _showButtonFieldEditor(property_grid_id, code, title){
    var _dlgOpt = {
        title:unescape(title),
        modal : true,
        width : 300,
        height: 220,
        buttons : {
            "取消":function() {
                $("#_buttonField_plugin_dlg").dialog("close");
            },
            "确定" : function() {
                //设置属性
                RDCP.PROPERTY_GRIDS[property_grid_id].setPropertyValue(code, CORE.json2str(_createButtonFieldData()));
                $("#_buttonField_plugin_dlg").dialog("close");
            }
        }
    };

    _currentFieldProperty = RDCP.PROPERTY_GRIDS[property_grid_id].getProperties(code);
    if (typeof _currentFieldProperty["value"] === "string")
        _currentFieldPropertyJson = eval(_currentFieldProperty["value"] == "" ? "[]" : _currentFieldProperty["value"]);
    else
        _currentFieldPropertyJson = _currentFieldProperty["value"];


    if (document.getElementById("_buttonField_plugin_dlg") == null) {
        $.ajax({
            url         :    'scripts/rdcp/plugins/buttonField.html?t=' + new Date().getTime(),
            type        :    "GET",
            dataType    :    'text',//params['dataType'] || 'text',
            data        :    '',
            success     :    function(data, textStatus) {
                $(document.body).append(data);
                _fillForm(_currentFieldPropertyJson[0])
                $("#_buttonField_plugin_dlg").dialog(_dlgOpt);
            },
            error       :    function(data) {
            }
        });
    } else {
        _fillForm(_currentFieldPropertyJson[0])
        $("#_buttonField_plugin_dlg").dialog(_dlgOpt);
    }

}

/**
 * 填充表单
 * @param propertyJson
 */
function _fillForm(propertyJson){
    if(propertyJson==null){
        return;
    }
    $("#button_name").val(propertyJson['name']);
    $("#button_value").val(propertyJson['value']);
    $("#button_class").val(propertyJson['class']);
    $("#button_onclick").val(propertyJson['onclick']);
}

/**
 * 返回按钮的json数据
 */
function _createButtonFieldData(){
    var _fieldData = [{
        name:$("#button_name").val(),
        value:$("#button_value").val(),
        class:$("#button_class").val(),
        onclick:$("#button_onclick").val()
    }]
    return _fieldData;
}


//注册属性编辑器
RDCP.registerEditor(new RDCP.ButtonFieldPropertyEditor());