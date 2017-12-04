/**
 * @(#)fileimport.help.js.js 11-4-25 下午2:24
 * CopyRight 2011.  All rights reserved
 *
 */

/**
 * User: kinz
 * 提供通用导入功能的一些辅助函数
 *
 * 依赖核心函数 core.js
 */


var _lookCheckOpts = {
    title : "选择导入字段",
    width : "500px",
    height : 380 ,
    modal : true
};

/**
 * 直接下载导入包含所有字段的模板
 * @param mappingFile 映射配置文件，文件是基于 WEB-INF/imports 目录的相对路径
 * @param mappingId 映射配置ID
 * @param options
 * columns: 生成的选择框每行多少个
 * selected: 选中后的回调函数，如：{selected:function(fields){.....}}，fields 参数是一个json数组，包含所有选中的字段的名称和目标字段名
 * templateName: 导入模板名称，如：{templateName:"合同导入模板.xls"}，如果不指定则使用默认的名称
 */
function downloadImportFields(mappingFile, mappingId, options) {
    options["columns"] = options["columns"] || 4;

    CORE.request("DS_FILE_IMPORT_MAPPING_INFO", {data:"mappingFile=" + mappingFile + "&mappingId=" + mappingId},
            function(data) {
            	var exp_cols = "";
            	var exp_names = "";
            	for(var i = 0;i<data.length;i++)
            	{
            		if(i != 0){
            			exp_cols += ",";
            			exp_names += ",";
            		}
            		exp_cols += data[i].code;
            		exp_names += data[i].name; 
            	}
                CORE.goToDS('DS_COMMON_IMPORT_TEMPLATE',
                    'cols=' + exp_cols + '&names=' + exp_names + '&fileName=' + options["templateName"], null, '');
            });
}

var _ExportSelectOpts = {
    title : "选择导出字段",
    width : "500px",
    height : 380 ,
    modal : true
};
/**
 * 选择要导入的字段
 * @param mappingFile 映射配置文件，文件是基于 WEB-INF/imports 目录的相对路径
 * @param mappingId 映射配置ID
 * @param options
 * columns: 生成的选择框每行多少个
 * selected: 选中后的回调函数，如：{selected:function(fields){.....}}，fields 参数是一个json数组，包含所有选中的字段的名称和目标字段名
 * templateName: 导入模板名称，如：{templateName:"合同导入模板.xls"}，如果不指定则使用默认的名称
 */
function selectImportFields(mappingFile, mappingId, options) {
    options["columns"] = options["columns"] || 4;

    CORE.request("DS_FILE_IMPORT_MAPPING_INFO", {data:"mappingFile=" + mappingFile + "&mappingId=" + mappingId},
            function(data) {
                _checkColunm(data, options);
            });
}


/**
 * 根据Json格式的数据来提供导入列的选择，并提供下载导入模板的功能
 * @param {json} modelJson json数据格式,比如[{name:"电表编号",code:"ammeter_id",check:"true",require:"true"},{.....}]
 * @param {Obiect} options 参数
 * columns: 确定要多少列换行,有利于排版,美化
 * selected: 选中后的回调函数
 */
function _checkColunm(modelJson, options) {
    // alert(modelJson.length);
    var columns = options["columns"];
    var id = "_File_import_Select_Div";
    if (!$("#" + id)[0])
        $("body").append('<div id="_File_import_Select_Div" style="display: none;width:100%;z-index:20;">');
    var modeltable;
    for (var i = 0; i < modelJson.length; i++) {
        if (i == 0) {
            modeltable = '<table id="netShow"><tr>';
        }
        if ((i) % columns == 0) {
            modeltable = modeltable + '</tr><tr>';
        }
        ///1:字段必选,不能修改  2:字段默认选中,但是可以修改
        if (modelJson[i].require == "true") {
            modeltable = modeltable +
                    '<td align="right" width="30"><input type="checkbox" disabled="disabled" checked="checked" id="I_File_Import_Field_' +
                    i + '" name="_File_Import_Fields" srcfield="' + modelJson[i].name + '" distfield="' +
                    modelJson[i].code + '"></td>';
            modeltable = modeltable + '<td ><label for="I_File_Import_Field_' + i + '" >' + modelJson[i].name +
                    '</label></td>';
        } else if (modelJson[i].check == "true") {
            modeltable = modeltable +
                    '<td align="right" width="30"><input type="checkbox" checked="checked" id="I_File_Import_Field_' +
                    i + '" name="_File_Import_Fields" srcfield="' + modelJson[i].name + '" distfield="' +
                    modelJson[i].code + '"></td>';
            modeltable = modeltable + '<td ><label for="I_File_Import_Field_' + i + '" >' + modelJson[i].name +
                    '</label></td>';
        } else {
            modeltable = modeltable +
                    '<td align="right" width="30"><input type="checkbox" id="I_File_Import_Field_' + i +
                    '" name="_File_Import_Fields" srcfield="' + modelJson[i].name + '" distfield="' +
                    modelJson[i].code + '"></td>';
            modeltable = modeltable + '<td ><label for="I_File_Import_Field_' + i + '" >' + modelJson[i].name +
                    '</label></td>';
        }
        if (i == (modelJson.length - 1)) {
            modeltable = modeltable + '</tr></table>';
        }
    }
    $("body #"+id).html(modeltable);
    //$("body").append(modeltable);


    _lookCheckOpts.buttons = {
        '取消':function() {
            $("#_File_import_Select_Div").dialog("close");
            //$("body #_File_import_Select_Div").remove();
        },
        '确定':function() {
            if (typeof options["selected"] === "function")
                options["selected"](_getCheckFields());
            $("#_File_import_Select_Div").dialog("close");
            //$("body #_File_import_Select_Div").remove();
        },
        '确定并下载模板':function() {
            var fields = _getCheckFields();
            var exp_cols = "";
            var exp_names = "";
            for (var i = 0; i < fields.length; i++) {
                if (i > 0) {
                    exp_cols += ",";
                    exp_names += ",";
                }
                exp_cols += fields[i].code;
                exp_names += fields[i].name;
            }
            $("#_File_import_Select_Div").dialog("close");
            if (typeof options["selected"] === "function")
                options["selected"](fields);
            CORE.goToDS('DS_COMMON_IMPORT_TEMPLATE',
                    'cols=' + exp_cols + '&names=' + exp_names + '&fileName=' + options["templateName"], null, '');
        }
    };

    $("#"+id).dialog(_lookCheckOpts);
}

function _getCheckFields() {
    var allFields = document.getElementsByName("_File_Import_Fields");
    if (allFields == undefined)
        return [];
    var fields = [];
    for (var i = 0; i < allFields.length; i++) {
        if (allFields[i].checked) {
            var field = {name:allFields[i].getAttribute("srcfield"),code:allFields[i].getAttribute("distfield")};
            fields.push(field);
        }
    }
    return fields;
}


/**
 * 选择导出字段
 * @param mappingFile 查询文件路径
 * @param queryId 查询文件ID
 * @param options
 * columns: 生成的选择框每行多少个
 * selected: 选中后的回调函数，如：{selected:function(fields){.....}}，
             fields 参数是一个json数组，包含所有选中的字段的名称和目标字段名
               得到的格式为{"expname":"","expcol":""}
 */
function selectExportFields(mappingFile, queryId, options) {	
	//弹出框
    var id = "_File_Export_Select_Div";
    if (!$("#" + id)[0])
        $("body").append('<div id="_File_Export_Select_Div" style="display: none;width:100%;z-index:20;">');
    CORE.request("DS_GET_QUERY_PARAMS", {data:"_file=" + mappingFile + "&_id=" + queryId},
            function(modelJson) {
            	$("#"+id).empty();
            	var columns = options["columns"] || 4;   
    			var modeltable;
    			var expcol;
    			var expname;
    			for(var key in modelJson)
    			{
    				if(key == "exp-cols")
    					expcol = modelJson[key].split(",");
    				else if(key == "exp-names")
    					expname = modelJson[key].split(",");
    			}
                for (var i = 0; i < expcol.length; i++) {
			        if (i == 0) {
			            modeltable = '<table id="netShow"><tr>';
			        }
			        if ((i) % columns == 0) {
			            modeltable = modeltable + '</tr><tr>';
			        }
		            modeltable = modeltable +
		                    '<td align="right" width="30"><input type="checkbox" checked="checked" id="I_File_Export_Field_' +
		                    i + '" name="_File_Export_Fields" expcol="' + expcol[i] + '" expname="' +
		                    expname[i] + '"></td>';
		            modeltable = modeltable + '<td ><label for="I_File_Export_Field_' + i + '" >' + expname[i] +
		                    '</label></td>';
			        
			        if (i == (expcol.length - 1)) {
			            modeltable = modeltable + '</tr></table>';
			        }
			    }
			    $("body #"+id).html(modeltable);			
			
			    _ExportSelectOpts.buttons = {
			        '取消':function() {
			            $("#_File_Export_Select_Div").dialog("close");
			        },
			        '确定':function() {
			            if (typeof options["selected"] === "function")
			                options["selected"](_getExportCheckFields());
			            $("#_File_Export_Select_Div").dialog("close");
			        }
			    };
			
			    $("#"+id).dialog(_ExportSelectOpts);
            
            });
}

function _getExportCheckFields() {
    var allFields = document.getElementsByName("_File_Export_Fields");
    if (allFields == undefined)
        return [];
    var fields = [];
    for (var i = 0; i < allFields.length; i++) {
        if (allFields[i].checked) {
        	if(i == 0){
	        	fields["expname"] = allFields[i].getAttribute("expname");
	        	fields["expcol"] = allFields[i].getAttribute("expcol");
	        }else{
	        	fields["expname"] += "," + allFields[i].getAttribute("expname");
	        	fields["expcol"] += "," + allFields[i].getAttribute("expcol");	        	
	        }
        }
    }
    return fields;
}