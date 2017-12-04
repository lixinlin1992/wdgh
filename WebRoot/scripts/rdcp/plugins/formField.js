/**
 * @(#)formField.js.js 11-9-28 下午3:24
 * CopyRight 2011.  All rights reserved
 *
 * 表单字段属性编辑器插件
 * 依赖于 rdcp.js 和 propertygrid.js
 *
 * 插件的结构是：
 * 左边是一个属性表单项的列表，右边是各个字段的属性编辑器
 *
 *
 */

/**
 * User: kinz
 */


var _FormFieldDialogFlag = false;

var _fieldTypeMap = {
    "text"          :"文本框",
    "select"        :"下拉框",
    "checkbox"      :"复选框",
    "radio"         :"单选框",
    "textarea"      :"文本域(多行)",
    "date"          :"日期选择",
    "hidden"        :"隐藏域",
    "label"         :"标签",
    "custom"        :"自定义",
    "button"        :"按钮",
    "file"          :"上传",
    "password"      :"密码"
};

//当前正在处理的表单字段属性
var _currentFieldProperty = null;
//当前正在处理的表单字段属性的JSON对象
var _currentFieldPropertyJson = null;
//字段的属性编辑
var _fieldPropertyGrid = null;

RDCP.FormFieldPropertyEditor = function() {
};

RDCP.FormFieldPropertyEditor.prototype = {
    getCode:function() {
        return "form_field";
    },

    createEditor:function(grid, p) {
        var _html = "<table style='border: none;width: 100%;height: 100%;padding: 0px;border-collapse: collapse;margin: 0px;'>" +
                "<td style='border: none;margin: 0px;padding: 0px;'>" +
                "表单字段" +
                "</td><td style='border:none;width:10px;padding: 0px;' valign='top'>" +
                "<input type='button' value='设置' onclick='_showFormFieldEditor(\"" + grid.options["id"] +
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
function _showFormFieldEditor(property_grid_id, code, title) {
    if (_FormFieldDialogFlag) {
        CORE.info("当前已经打开一个表单属性编辑器，请先关闭");
        return;
    }
    _FormFieldDialogFlag = true;
    var _dlgOpt = {
        title:unescape(title),
        modal : true,
        width : 640,
        height: 530,
        buttons : {
            "取消":function() {
                $("#_formField_plugin_dlg").dialog("close");
            },
            "确定" : function() {
                //设置属性
                RDCP.PROPERTY_GRIDS[property_grid_id].setPropertyValue(code, CORE.json2str(_currentFieldPropertyJson));
                $("#_formField_plugin_dlg").dialog("close");
            }
        },
        onclose:function() {
            _FormFieldDialogFlag = false;
        }
    };

    _currentFieldProperty = RDCP.PROPERTY_GRIDS[property_grid_id].getProperties(code);
    if (typeof _currentFieldProperty["value"] === "string")
        _currentFieldPropertyJson = eval(_currentFieldProperty["value"] == "" ? "[]" : _currentFieldProperty["value"]);
    else
        _currentFieldPropertyJson = _currentFieldProperty["value"];

    if (document.getElementById("_formField_plugin_dlg") == null) {
        $.ajax({
            url         :    'scripts/rdcp/plugins/formField.html?t=' + new Date().getTime(),
            type        :    "GET",
            dataType    :    'text',//params['dataType'] || 'text',
            data        :    '',
            success     :    function(data, textStatus) {
                $(document.body).append(data);
                _updateFormFields(_currentFieldPropertyJson);
                $("#_formField_plugin_dlg").dialog(_dlgOpt);
            },
            error       :    function(data) {
            }
        });
    } else {
        _updateFormFields(_currentFieldPropertyJson);
        $("#_formField_plugin_dlg").dialog(_dlgOpt);
    }
}

function _updateFormFields(fieldData) {
    if (typeof fieldData === "string")
        fieldData = eval(fieldData == "" ? "[]" : fieldData);

    var _listTable = $("#_formField_plugin_field_list");
    //先清空原有的属性
    _listTable.find("tr[type='fieldrow']").remove();
    if (_fieldPropertyGrid != null)
        _fieldPropertyGrid.setProperties({});

    var _fieldLength = 0;

    //加入新的属性
    $.each(fieldData, function(i, n) {
        _listTable.append("<tr type='fieldrow' fieldid='" + n["id"]["value"] +
                "' onclick='_editField(\"" + n["id"]["value"] + "\")'><td height='20' id='_name_td_" +
                n["id"]["value"] + "'>" +
                n["name"]["value"] + "</td><td id='_code_td_" + n["id"]["value"] + "'>" +
                n["code"]["value"] +
                "</td><td>" + _fieldTypeMap[n["type"]["value"]] +
                "</td>" +
                "<td align='center'>" +
                "<a href='javascript:' onclick='_moveUpFormField(\"" + n["id"]["value"] +
                "\");' title='上移'>↑</a>&nbsp;" +
                "<a href='javascript:' onclick='_moveDownFormField(\"" + n["id"]["value"] +
                "\");' title='下移'>↓</a>&nbsp;" +
                "<a href='javascript:' onclick='_removeFormField(\"" + n["id"]["value"] + "\");' title='移除'>—</a>" +
                "</td>" +
                "</tr>");
        if (_fieldLength == 0)
            _editField(n["id"]["value"]);
        _fieldLength++;
    });

    //如果没有属性，则显示空行，并显示添加按钮
    if (_fieldLength == 0) {
        _listTable.append("<tr type='fieldrow'><td height='20' colspan='4'>没有表单字段，请先添加</td></tr>");
    }
}


function _addformField() {
    if (_currentFieldPropertyJson == null) {
        return;
    }

    var _field_add_dlg_opt = {
        title:"添加表单字段",
        modal : true,
        width : 300,
        height: 170,
        modal:true,
        buttons : {
            "确定" : function() {
                with (document._FormField_Plugin_Add_Form) {
                    if ($.trim(name.value) == "") {
                        CORE.info("名称不能为空");
                        name.focus();
                        return;
                    }
                    if ($.trim(code.value) == "") {
                        CORE.info("编码不能为空");
                        code.focus();
                        return;
                    }
                    _currentFieldPropertyJson.push(_createEmptyFormFieldData(name.value, code.value, type.value));
                }
                //_currentFieldProperty["value"] = CORE.json2str(_currentFieldPropertyJson);
                _updateFormFields(_currentFieldPropertyJson);
                $("#_formField_plugin_add_dlg").dialog("close");
            }
        }
    };

    document._FormField_Plugin_Add_Form.reset();
    $("#_formField_plugin_add_dlg").dialog(_field_add_dlg_opt);
}

function _editField(id) {
    var _tmpField = null;
    $.each(_currentFieldPropertyJson, function(i, n) {
        if (id == n["id"]["value"]) {
            _tmpField = _updateOldFieldData(n);
            //设置回去
            _currentFieldPropertyJson[i]=_tmpField;
        }
    });
    if (_tmpField == null)
        return;


    //alert(CORE.json2str(_tmpField));

    if (_fieldPropertyGrid == null)
        _fieldPropertyGrid = new RDCP.PropertyGrid({
            id:"_formField_plugin_field_editor",
            group:true,
            properties:{}
        });
    _tmpField["name"]["onchange"] = function(p, oldvalue, newvalue) {
        $("#_name_td_" + _tmpField["id"]["value"]).html(newvalue);
    };
    _tmpField["code"]["onchange"] = function(p, oldvalue, newvalue) {
        $("#_code_td_" + _tmpField["id"]["value"]).html(newvalue);
    };
    _tmpField["type"]["formatter"] = function(p) {
        return _fieldTypeMap[p.value];
    }
    _fieldPropertyGrid.setProperties(_tmpField);
}

function _removeFormField(id) {
    //先不做确认
    for (var i = 0; i < _currentFieldPropertyJson.length; i++) {
        if (id == _currentFieldPropertyJson[i]["id"]["value"]) {
            _currentFieldPropertyJson.splice(i, 1);
            break;
        }
    }

    _updateFormFields(_currentFieldPropertyJson);
}

//上移字段
function _moveUpFormField(id) {
    for (var i = 0; i < _currentFieldPropertyJson.length; i++) {
        if (id == _currentFieldPropertyJson[i]["id"]["value"]) {
            if (i == 0)
                return;
            var _tmp = _currentFieldPropertyJson[i];
            _currentFieldPropertyJson[i] = _currentFieldPropertyJson[i - 1];
            _currentFieldPropertyJson[i - 1] = _tmp;
            _updateFormFields(_currentFieldPropertyJson);
            break;
        }
    }
}

//下移字段
function _moveDownFormField(id) {
    for (var i = 0; i < _currentFieldPropertyJson.length; i++) {
        if (id == _currentFieldPropertyJson[i]["id"]["value"]) {
            if (i == _currentFieldPropertyJson.length - 1)
                return;
            var _tmp = _currentFieldPropertyJson[i];
            _currentFieldPropertyJson[i] = _currentFieldPropertyJson[i + 1];
            _currentFieldPropertyJson[i + 1] = _tmp;
            _updateFormFields(_currentFieldPropertyJson);
            break;
        }
    }
}


/**
 * 更新就的属性数据到新的结构
 * @param old
 */
function _updateOldFieldData(old){
    //先创建一个新的空数据
    var _empty = _createEmptyFormFieldData(old["name"]["value"],old["code"]["value"],old["type"]["value"]);
    //进行赋值
    $.each(_empty,function(i,n){
        if(old[n.code] != undefined)
            _empty[i]["value"]=old[n.code]["value"];
    });
    return _empty;
}

/**
 * 创建空的表单字段域数据，不同类型将返回不同的数据
 */
function _createEmptyFormFieldData(name, code, type) {
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
            required:"true",
            type:"text",
            group:"基础设置"
        },
        "code":{
            name:"编码",
            code:"code",
            value:code,
            required:"true",
            type:"text",
            group:"基础设置"
        },
        "hid":{
            name:"页面ID",
            code:"hid",
            value:"",
            type:"text",
            group:"基础设置",
            description:"HTML的DOM ID.若类型为复选框则生成的ID为\"页面ID_0\",\"页面ID_1\"."
        },
        "fullcol":{
            name:"独占一行",
            code:"fullcol",
            value:"false",
            type:"text",
            editor:"bool",
            description:"独占以后,则表示该表单独占一行colspan"
        },
        "labeltdv":{
            name:"标签TD横向布局",
            code:"labeltdv",
            value:"right",
            type:"text",
            editor:"select",
            options:"left:left,right:right,center:center",
            description:"标签TD的valign"
        },
        "labeltdh":{
            name:"标签TD纵向布局",
            code:"labeltdh",
            type:"text",
            value:"top",
            editor:"select",
            options:"top:top,middle:middle,bottom:bottom",
            description:"标签TD的align"
        },
        "inputtdv":{
            name:"表单TD横向布局",
            code:"inputtdv",
            type:"text",
            value:"left",
            editor:"select",
            options:"left:left,right:right,center:center",
            description:"表单所在TD的valign"
        },
        "inputtdh":{
            name:"表单TD纵向布局",
            code:"inputtdh",
            type:"text",
            value:"top",
            editor:"select",
            options:"top:top,middle:middle,bottom:bottom",
            description:"表单所在TD的align"
        },
        "type":{
            name:"类型",
            code:"type",
            type:"text",
            value:type,
            editor:"select",
            required:"true",
            options:"text:文本框,select:下拉框,checkbox:复选框,radio:单选框,textarea:文本域(多行),date:日期选择,hidden:隐藏域,label:标签,button:按钮,custom:自定义,file:上传,passowrd:密码",
            group:"基础设置",
            description:"更改后需要重新点击左侧列表元素,重新加载编辑器"
        },
        "value":{
            name:"默认值",
            code:"value",
            value:"",
            type:"text",
            group:"基础设置",
            description:"表单的value初始值.当类型为下拉框,单选框时则需要填写其数值,当类型为复选框时则需要用逗号分隔填写默认值:(value1,value2);当类型为标签时,默认值为标签内容."
        },"labelwidth":{
            name:"标签宽度",
            code:"labelwidth",
            value:"",
            type:"text",
            group:"基础设置"
        },"inputwidth":{
            name:"表单宽度",
            code:"inputwidth",
            value:"",
            type:"text",
            group:"基础设置"
        },"style":{
            name:"TD样式",
            code:"style",
            value:"",
            type:"text"
        },"inputStyle":{
            name:"表单样式",
            code:"inputStyle",
            value:"",
            type:"text"
        },
        "query_method":{
            name:"查询方式",
            code:"query_method",
            value:"like",
            type:"text",
            editor:"select",
            options:"like:包含,start:以此开始,end:以此结束,notlike:不包含,equals:等于,larger:大于,less:小于,largerin:大于等于,lessin:小于等于,notequals:不等于,custom:自定义",
            group:"查询设置"
        },
        "query_code":{
            name:"字段编码",
            code:"query_code",
            value:"",
            type:"text",
            description:"查询字段的编码，自动生成查询条件时需要使用。如果不指定则使用上面的编码设置",
            group:"查询设置"
        },
        "custom_query_method":{
            name:"自定义方式",
            code:"custom_query_method",
            value:"",
            type:"text",
            group:"查询设置"
        },
        "query_type":{
            name:"映射类型",
            code:"query_type",
            value:"",
            type:"text",
            editor:"select",
            options:":默认,int:Integer,long:Long,float:Float,double:Double,date:Date",
            group:"查询设置"
        }
    };
    switch (type) {
        case 'select':
            _fieldData["listdata"] = {
                name:"列表数据",
                code:"listdata",
                value:"",
                type:"text",
                group:"数据",
                editor:"html",
            	description:"格式:value:label,value:label"
            };
            _fieldData["dataSource"] = {
                name:"数据源",
                code:"dataSource",
                value:"",
                type:"text",
                group:"数据"
            };
            _fieldData["loadComplete"] = {
                name:"下拉框加载回调事件",
                code:"loadComplete",
                value:"",
                type:"text",
                editor:"html",
            	description:"相当于Core.loadSelct(ds,{loadComplete:function(){}}}中的loadComplete参数,只需要填写函数体即可",
                group:"数据"
            };
            break;
        case 'checkbox':
            _fieldData["listdata"] = {
                name:"选项数据",
                code:"listdata",
                value:"",
                type:"text",
                group:"数据",
                editor:"html",
            	description:"格式:value:label,value:label"
            };
            break;
        case 'radio':
            _fieldData["listdata"] = {
                name:"选项数据",
                code:"listdata",
                value:"",
                type:"text",
                group:"数据",
                editor:"html",
            	description:"格式:value:label,value:label"
            };
            break;
        case 'textarea':
            _fieldData["cols"] = {
                name:"列数",
                code:"cols",
                value:"",
                type:"text",
                group:"文本域配置",
            	description:"textarea标签的cols属性,默认1"
            };
             _fieldData["rows"] = {
                name:"行数",
                code:"rows",
                value:"",
                type:"text",
                group:"文本域配置",
            	description:"textarea标签的rows属性,默认10"
            };
            break;
        case "date":
            _fieldData["dateformat"] = {
                name:"日期格式",
                code:"dateformat",
                value:"yy-mm-dd",
                type:"text",
                editor:"select",
                options:"yy-mm-dd:yyyy-MM-dd,yymmdd:yyyyMMdd,yy/mm/dd:yyyy/MM/dd,yy/mm:yyyy/MM,yymm:yyyyMM",
                group:"数据"
            };
            break;
        case 'file':
        case 'button':
        case 'text':
            _fieldData["readonly"] = {
                name:"只读",
                code:"readonly",
                value:"false",
                type:"text",
                editor:"bool",
                group:"基础设置"
            };
            _fieldData["buttontext"] = {
                name:"按钮文本",
                code:"buttontext",
                value:"",
                type:"text",
                group:"基础设置"
            };
            _fieldData["buttonevent"] = {
                name:"按钮事件",
                code:"buttonevent",
                value:"",
                type:"text",
                editor:"html",
       			description:"只需要填写函数体即可",
                group:"事件"
            };
            break;
        case 'custom':
            _fieldData["custom_content"] = {
                name:"自定义内容",
                code:"custom_content",
                value:"",
                type:"text",
                editor:"html",
       			description:"只需要填写TD内容即可",
                group:"自定义标签"
            };        	
        	break;
        default:
        {

        }
    }

    _fieldData["onchange"] = {
        name:"onchange",
        code:"onchange",
        value:"",
        type:"javascript",
        editor:"html",
       	description:"只需要填写函数体即可",
        group:"事件"
    };
    _fieldData["onfocus"] = {
        name:"onfocus",
        code:"onfocus",
        value:"",
        type:"javascript",
        editor:"html",
       	description:"只需要填写函数体即可",
        group:"事件"
    };
    _fieldData["onblur"] = {
        name:"onblur",
        code:"onblur",
        value:"",
        type:"javascript",
        editor:"html",
       	description:"只需要填写函数体即可",
        group:"事件"
    };
    return _fieldData;
}


//注册属性编辑器
RDCP.registerEditor(new RDCP.FormFieldPropertyEditor());