/**
 * @(#)colModelField.js.js 11-9-29 下午1:24
 * CopyRight 2011.  All rights reserved
 *
 * 列表字段属性编辑器插件
 * 依赖于 rdcp.js 和 propertygrid.js
 *
 * 插件的结构是：
 * 左边是一个属性表单项的列表，右边是表格各个列编辑器
 *
 *
 */

/**
 * User: keven
 */

RDCP.colModelEditor = function() {

};

RDCP.colModelEditor.prototype = {
    getCode:function() {
		return "colModel";
    },
    createEditor:function(grid, p) {
        var _html = "<table style='border: none;width: 100%;height: 100%;padding: 0px;border-collapse: collapse;margin: 0px;'>" +
                "<td style='border: none;margin: 0px;padding: 0px;'>" +
                "列表参数" +
                "</td><td style='border:none;width:10px;margin: 0px;padding: 0px;' valign='top'>" +
                "<input type='button' value='设置' onclick='_showColModelFieldEditor(\"" + grid.options["id"] +
                "\",\"" + p.code + "\")' style='height:18px;'>" +
                "</td></tr></table>";
        return _html;
    }
}
var _colModleTypeMap = {
    "true"          :"是",
    "false"         :"否",
    "NaN"           :"",
    "center"        :"居中",
    "left"          :"左对齐",
    "right"         :"右对齐"
};
//目标返回的JSON
var _currentcolModelProperty = null;
//返回JSON的某一个字段
var _currentcolModelJson = null;
//属性编辑器
var _colModelField_plugin_editor = null;

//参数编辑器列表参数
var _colModelPluginEditor = {
  "name":{
      name    : "表头名称",
      code    : "name",
      type    : "text",
      value   : "",
      formatter: function(p){},
      options : ""
  },
  "index":{
      name    : "表头编码",
      code    : "index",
      type    : "text",
      value   : "",
      formatter: function(p){},
      options : ""
  },
  "label":{
      name    : "复合表头Label",
      code    : "label",
      type    : "text",
      value   : "",
      formatter: function(p){},
      options : ""
  },
  "width":{
      name    : "表头宽度",
      code    : "width",
      type    : "text",
      value   : "",
      formatter: function(p){},
      options : ""
  },  
  "percentwidth":{
      name:"宽度是否为百分比",
      code:"percentwidth",
      type:"text",
      value:"",
	  editor  : "bool",
	  formatter: function(p){},
      options : ""
  },
  "align":{
      name    : "布局",
      code    : "align",
      type    : "text",
      value   : "",
      formatter: function(p){},
      editor  : "select",
      options : {"left":"左对齐","center":"居中","right":"右对齐"}
  }, 
  "sortable":{
      name    : "是否排序",
      code    : "sortable",
      type    : "text",
      value   : "",
      formatter: function(p){},
      editor  : "bool"
  }, 
  "hidden":{
      name    : "是否隐藏",
      code    : "hidden",
      type    : "text",
      value   : "",
      editor  : "bool",
      formatter: function(p){}
  },  
  "formatter":{
      name    : "自定义函数",
      code    : "formatter",
      type    : "text",
      value   : "",
      editor  : "formatter",
      formatter: function(p){}
  }
}

/**
 * 打开列表编辑对话框进行编辑
 * 如果已经打开，则只显示，并刷新相关的数据
 * @param property_grid_id 父属性编辑器的ID
 * @param code 表单字段属性编码
 */
function _showColModelFieldEditor(property_grid_id, code) {
    //插件弹出框
    var _dlgOpt = {
        title:"设置列表",
        modal : true,
        width : 1000,
        height: 500,
        buttons : {
            "取消" : function() {
                $("#_colModelField_plugin_dlg").dialog("close");
            },
            "确定" : function() {
                //设置属性
                RDCP.PROPERTY_GRIDS[property_grid_id].setPropertyValue(code,CORE.json2str(_currentcolModelJson));
                $("#_colModelField_plugin_dlg").dialog("close");
            },
            "添加表头" : function() {
				_addColModelField();
            }
        }
    };
    
    _currentcolModelProperty = RDCP.PROPERTY_GRIDS[property_grid_id].getProperties(code);
    if (typeof _currentcolModelProperty["value"] === "string")
        _currentcolModelJson = eval(_currentcolModelProperty["value"] == "" ? "[]" : _currentcolModelProperty["value"]);
    else
        _currentcolModelJson = _currentcolModelProperty["value"];

    
	//获取DOM节点
    if (document.getElementById("_colModelField_plugin_dlg") == null) {
        $.ajax({
            url         :    'scripts/rdcp/plugins/colModelField.html?t=' + new Date().getTime(),
            type        :    "GET",
            dataType    :    'text',//params['dataType'] || 'text',
            data        :    '',
            success     :    function(data, textStatus) {
                $(document.body).append(data);
                //初始化编辑参数的列表
				_colModelField_plugin_editor = new RDCP.PropertyGrid({id:"_colModelField_plugin_field_editor",properties:_colModelPluginEditor});
		    	if(_currentcolModelJson[0]!=undefined)
					_editcolModelFieldEditorTable(_currentcolModelJson[0]["id"]["value"]);
				_refleshColModelTable(_currentcolModelJson);
                $("#_colModelField_plugin_dlg").dialog(_dlgOpt);
            },
            error       :    function(data) {
            }
        });
    } else {
    	if(_currentcolModelJson[0]!=undefined)
			_editcolModelFieldEditorTable(_currentcolModelJson[0]["id"]["value"]);		
		_refleshColModelTable(_currentcolModelJson);
        $("#_colModelField_plugin_dlg").dialog(_dlgOpt);
    }
}

//添加
function _addColModelField() {
    var _field_add_dlg_opt = {
        title:"添加列表",
        modal : true,
        width : 420,
        height: 390,
        buttons : {
            "确定" : function() {
            	
                with (document._ColModelField_Plugin_Add_Form) {
                    _currentcolModelJson.push(_createEmptycolModelFieldData(name.value,index.value,width.value,percentwidth.checked,
                    														align.value,sortable.checked,hidden.checked,
                    														formatter.value,label.value));
                }
                //kinz 2011-12-22 remove：这里不应当独立设置最外层属性的值，应当调用 propertyGrid的setPropertyValue来设置，该函数存在一些逻辑判断
                //_currentcolModelProperty["value"] = CORE.json2str(_currentcolModelJson);
            	//_refleshColModelTable(_currentcolModelProperty["value"]);
                _refleshColModelTable(_currentcolModelJson);
                $("#_colModelField_plugin_add_dlg").dialog("close");
            }
        }
    };
	document._ColModelField_Plugin_Add_Form.reset();	
    $("#_colModelField_plugin_add_dlg").dialog(_field_add_dlg_opt);
}

/**
 * 创建空的表单字段域数据，不同类型将返回不同的数据
 */
function _createEmptycolModelFieldData(name,index,width,percentwidth,align,sortable,hidden,formatter,label) {
    var item = {
        "id":{
            name:"ID",
            code:"id",
            value:"" + new Date().getTime(),
            type:"hidden",
	        formatter: function(p){},
      		options : ""
        },
        "name":{
            name:"名称",
            code:"name",
            value:name,
            type:"text",
	        formatter: function(p){},
      		options : ""
        },
        "index":{
            name:"编码",
            code:"index",
            value:index,
            type:"text",
	        formatter: function(p){},
      		options : ""
        },
        "label":{
            name:"复合表头Label",
            code:"label",
            value:label,
            type:"text",
	        formatter: function(p){},
      		options : ""
        },
        "width":{
            name:"宽度",
            code:"width",
            value:(width == undefined || width == "")?100:width,
            type:"text",
	        formatter: function(p){},
      		options : ""
        },
        "percentwidth":{
            name:"宽度是否为百分比",
            code:"percentwidth",
            value:percentwidth,
            type:"text",
	        editor  : "bool",
	        formatter: function(p){},
      		options : ""
        },
        "align":{
            name:"布局",
            code:"align",
            value:align,
            type:"text",
	        formatter: function(p){},
	        editor  : "select",
    	    options : {"center":"居中","left":"左对齐","right":"右对齐"}
        },
        "sortable":{
            name:"是否排序",
            code:"sortable",
            value:sortable,
            type:"text",
	        formatter: function(p){},
      		editor  : "bool"
        },
        "hidden":{
            name:"是否隐藏",
            code:"hidden",
            value:hidden,
            type:"text",
	        formatter: function(p){},
      		editor  : "bool"
        },
        "formatter":{
            name:"自定义函数",
            code:"formatter",
            value:formatter,
            type:"text",
      		editor  : "formatter",
	        formatter: function(p){}
        }
    };
    return item;
}

//刷新列表
function _refleshColModelTable(fieldData) {
	//内存的colModels
    if (typeof fieldData === "string")
        fieldData = eval(fieldData == "" ? "[]" : fieldData);
	//展示的字段列表
    var _listTable = $("#_colModelField_plugin_list");
    //先清空原有的属性
    _listTable.find("tr[type='fieldrow']").remove();
	//判断内存是否存在字段
	if(_currentcolModelProperty.length==0)
		return;
	//这次更新的字段数
    var _fieldLength = 0;

    //加入新的属性
    $.each(fieldData, function(i, n) {
        _listTable.append("<tr type='fieldrow' fieldid='" + n["id"]["value"] +
                "' onclick='_editcolModelFieldEditorTable($(this).attr(\"fieldid\"))'>" +
                "<td id='_colModel_name_td_"+ n["id"]["value"] +"'>" +                
                n["name"]["value"] + "</td><td id='_colModel_index_td_" + n["id"]["value"] + "'>" +
                n["index"]["value"] + "</td><td id='_colModel_width_td_"+ n["id"]["value"] +"'>" +
                n["width"]["value"] + "</td><td id='_colModel_align_td_"+ n["id"]["value"] +"'>" +
                _colModleTypeMap[n["align"]["value"]] + "</td><td id='_colModel_sortable_td_"+ n["id"]["value"] +"'>" +
                _colModleTypeMap[n["sortable"]["value"]] + "</td><td id='_colModel_hidden_td_"+ n["id"]["value"] +"'>" +
                _colModleTypeMap[n["hidden"]["value"]] + "</td>"+
                //"<td id='_colModel_formatter_td_"+ n["id"]["value"] +"'>" + n["formatter"]["value"] + "</td>" +
                "<td align='center'>" +
                "<a href='javascript:' onclick='_moveUpGridField(\"" + n["id"]["value"] +
                "\");' title='上移'>↑</a>&nbsp;" +
                "<a href='javascript:' onclick='_moveDownGridField(\"" + n["id"]["value"] +
                "\");' title='下移'>↓</a>&nbsp;" +
                "<a href='javascript:' onclick='_removecolModelField(\"" + n["id"]["value"] + "\");' title='移除'>—</a>" +
                "</td>" +
                "</tr>");
        _fieldLength++;
    });

    //如果没有属性，则显示空行，并显示添加按钮
    if (_fieldLength == 0) {
        _listTable.append("<tr type='fieldrow'><td colspan='8'>没有任何设定，请先添加</td></tr>");
    }
}
//保存当前编辑属性
function _editcolModelFieldEditorTable(id){
	
    var _tmpField = null;
    $.each(_currentcolModelJson, function(i, n) {
        if (id == n["id"]["value"]) {
            _tmpField = n;
        }
    });
    
    if (_tmpField == null)
        return;
        
    _tmpField["name"]["onchange"] = function(p, oldvalue, newvalue) {
        $("#_colModel_name_td_" + _tmpField["id"]["value"]).html(newvalue);
    };
    
    _tmpField["index"]["onchange"] = function(p, oldvalue, newvalue) {
        $("#_colModel_index_td_" + _tmpField["id"]["value"]).html(newvalue);
    };
    
    if(_tmpField["label"] == undefined)
    	_tmpField.label = {
            name:"复合表头Label",
            code:"label",
            value:"",
            type:"text",
	        formatter: function(p){},
      		options : ""
        }
    
    _tmpField["label"]["onchange"] = function(p, oldvalue, newvalue) {
        //$("#_colModel_label_td_" + _tmpField["id"]["value"]).html(newvalue);
    };    
    _tmpField["width"]["onchange"] = function(p, oldvalue, newvalue) {
        $("#_colModel_width_td_" + _tmpField["id"]["value"]).html(newvalue);
    };
    _tmpField["align"]["onchange"] = function(p, oldvalue, newvalue) {
        $("#_colModel_align_td_" + _tmpField["id"]["value"]).html(_colModleTypeMap[newvalue]);
    };
    _tmpField["sortable"]["onchange"] = function(p, oldvalue, newvalue) {
        $("#_colModel_sortable_td_" + _tmpField["id"]["value"]).html(_colModleTypeMap[newvalue]);
    };
    _tmpField["hidden"]["onchange"] = function(p, oldvalue, newvalue) {
        $("#_colModel_hidden_td_" + _tmpField["id"]["value"]).html(_colModleTypeMap[newvalue]);
    };
    _tmpField["formatter"]["onchange"] = function(p, oldvalue, newvalue) {
        //$("#_colModel_formatter_td_" + _tmpField["id"]["value"]).html(newvalue);
    };
	
	_colModelField_plugin_editor.setProperties(_tmpField);    
}
//删除字段设置
function _removecolModelField(id){
    //先不做确认
    for (var i = 0; i < _currentcolModelJson.length; i++) {
        if (id == _currentcolModelJson[i]["id"]["value"]) {
            _currentcolModelJson.splice(i, 1);
            break;
        }
    }

    _refleshColModelTable(_currentcolModelJson);
}

//上移字段
function _moveUpGridField(id) {
    for (var i = 0; i < _currentcolModelJson.length; i++) {
        if (id == _currentcolModelJson[i]["id"]["value"]) {
            if (i == 0)
                return;
            var _tmp = _currentcolModelJson[i];
            _currentcolModelJson[i] = _currentcolModelJson[i - 1];
            _currentcolModelJson[i - 1] = _tmp;
            _refleshColModelTable(_currentcolModelJson);
            break;
        }
    }
}

//下移字段
function _moveDownGridField(id) {
    for (var i = 0; i < _currentcolModelJson.length; i++) {
        if (id == _currentcolModelJson[i]["id"]["value"]) {
            if (i == _currentcolModelJson.length - 1)
                return;
            var _tmp = _currentcolModelJson[i];
            _currentcolModelJson[i] = _currentcolModelJson[i + 1];
            _currentcolModelJson[i + 1] = _tmp;
            _refleshColModelTable(_currentcolModelJson);
            break;
        }
    }
}

//格式化函数说明
function __formatterInfo(){
	$("#__formatterInfoDiv").dialog({
        title:"格式化函数说明",
        modal : true,
        width : 680,
        height: 300,
        buttons : {
            "确定" : function() {
            	$("#__formatterInfoDiv").dialog("close");
            }
        }
	});
}

//格式化函数编辑器

RDCP.formatterEditor = function() {

};

RDCP.formatterEditor.prototype = {
    getCode:function() {
		return "formatter";
    },
    getSyntax:function() {
        return "html";
    },
    createEditor:function(grid, p) {
        var _html = "<table style='border: none;width: 100%;height: 100%;padding: 0px;border-collapse: collapse;margin: 0px;'>" +
                "<td style='border: none;margin: 0px;padding: 0px;'>" +
                "格式化函数" +
                "</td><td style='border:none;width:10px;margin: 0px;padding: 0px;' valign='top'>" +
                "<textarea style='display:none;' id='_formatterField_hidden_"+p.code+"'>"+
                ((p.value == undefined || p.value == null) ? "" : p.value) +
                "</textarea>"+
                "<input type='button' value='设置' onclick='_showFormatterFieldEditor(\"" + grid.options["id"] +
                "\",\"" + p.code + "\",document.getElementById(\"_formatterField_hidden_" + p.code + "\"),\"" + this.getSyntax() +"\")' style='height:18px;'>" +
                "</td></tr></table>";
        return _html;
    }
}

/**
 * 打开列表编辑对话框进行编辑
 * 如果已经打开，则只显示，并刷新相关的数据
 * @param property_grid_id 父属性编辑器的ID
 * @param code 表单字段属性编码
 */
function _showFormatterFieldEditor(property_grid_id, code , ele,syntax) {
    //插件弹出框
    var _formatterDlgOpt = {
        title:"格式化函数",
        modal : true,
        width : 600,
        height: 390,
        buttons : {
            "取消" : function() {
                $("#_formatterField_plugin_dlg").dialog("close");
            },
            "确定" : function() {
            	var formatterContent = editAreaLoader.getValue("__formatterField");
            	formatterContent = formatterContent.replace(/\+/g, "%2B");
            	ele.value = formatterContent;
            	//alert(code);
            	RDCP.PROPERTY_GRIDS[property_grid_id].setPropertyValue(code,ele.value);
            	//alert(property_grid_id);
                $("#_formatterField_plugin_dlg").dialog("close");            	
            }
        }
    };
    
    //初始化编辑器
    editAreaLoader.init({
        id: "__formatterField"    // id of the textarea to transform
        ,start_highlight: true    // if start with highlight
        ,allow_resize: "none"
        ,allow_toggle: false
        ,word_wrap: true
        ,language: "zh"
        ,syntax: syntax
    });
    
	//获取DOM节点
    if (document.getElementById("_formatterField_plugin_dlg") == null) {
        $.ajax({
            url         :    'scripts/rdcp/plugins/formatterField.html?t=' + new Date().getTime(),
            type        :    "GET",
            dataType    :    'text',//params['dataType'] || 'text',
            data        :    '',
            success     :    function(data, textStatus) {
                $(document.body).append(data);
                var formatterContent = unescape(ele.value);                
    			editAreaLoader.setValue("__formatterField", formatterContent);
                //初始化编辑参数的列表
                $("#_formatterField_plugin_dlg").dialog(_formatterDlgOpt);
            },
            error       :    function(data) {
            }
        });
    } else {
        var formatterContent = unescape(ele.value);
    	editAreaLoader.setValue("__formatterField", formatterContent);
        $("#_formatterField_plugin_dlg").dialog(_formatterDlgOpt);
    }
}


//注册属性编辑器
RDCP.registerEditor(new RDCP.colModelEditor());
RDCP.registerEditor(new RDCP.formatterEditor());