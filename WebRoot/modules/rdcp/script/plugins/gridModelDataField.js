/**
 * @(#)gridModelDataField.js.js 11-9-29 下午1:24
 * CopyRight 2011.  All rights reserved
 *
 * 表格样例数据编辑器
 * 依赖于 rdcp.js 和 propertygrid.js
 *
 * 插件的结构是：
 * 一个文本框,用户以逗号分隔各列,以分号结束一行
 * 例子 张三,13,XX;李四,34,YY;
 *     
 *
 */

/**
 * User: keven
 */

RDCP.gridModelDataEditor = function() {

};

RDCP.gridModelDataEditor.prototype = {
    getCode:function() {
		return "gridModelData";
    },
    createEditor:function(grid, p) {
        var _html = "<table style='border: none;width: 100%;height: 100%;padding: 0px;border-collapse: collapse;margin: 0px;'>" +
                "<td style='border: none;margin: 0px;padding: 0px;'>" +
                "表格样例数据" +
                "</td><td style='border:none;width:10px;' valign='top'>" +
                "<input type='button' value='设置' onclick='_showGridModelDataFieldEditor(\"" + grid.options["id"] +
                "\",\"" + p.code + "\")' style='height:18px;'>" +
                "</td></tr></table>";
        return _html;
    }
}

//样例数据JSON
var asdf = {
	"header":{
		"code":"0",
		"message":"success",
		"isAlert":"false"
	},
	"body":{
		"page":"1",
		"total":"3",
		"records":"42",
		"rows":[
		{
			"id":"259",
			"cell":["259","2011%2d10%2d11","41","2011%2d10%2d11","05B038FF6974EFB85744E39C8491E7E2","127%2e0%2e0%2e1","260","1"]
		},
		{
			"id":"259",
			"cell":["259","2011%2d10%2d11","41","2011%2d10%2d11","05B038FF6974EFB85744E39C8491E7E2","127%2e0%2e0%2e1","260","1"]
		}]
	}
}

/**
 * 打开列表样例数据编辑框
 * 如果已经打开，则只显示，并刷新相关的数据
 * @param property_grid_id 父属性编辑器的ID
 * @param code 表单字段属性编码
 */
function _showGridModelDataFieldEditor(property_grid_id, code){
   //插件弹出框
    var _dlgOpt = {
        title :"样例数据编辑",
        modal : true,
        width : 500,
        height: 500,
        buttons : {
            "取消" : function() {
                $("#_GridModelDataEditor_dlg").dialog("close");
            },
            "确定" : function() {
            	//生成样例JSON
            	var ___jqgridJson =  _generateGridModelData($("#__GridModelData").val());
            	___jqgridJson = CORE.json2str(___jqgridJson);
                //设置属性
                RDCP.PROPERTY_GRIDS[property_grid_id].setPropertyValue(code,___jqgridJson);
                $("#_GridModelDataEditor_dlg").dialog("close");
            },
            "清空" : function() {
                //设置属性
                RDCP.PROPERTY_GRIDS[property_grid_id].setPropertyValue(code,"");
                $("#_GridModelDataEditor_dlg").dialog("close");
            }
        }
    };
	
	//检测创建弹出框HTML 
    if ($("#_GridModelDataEditor_dlg").length == 0)
        $("body").append("<div id=\"_GridModelDataEditor_dlg\" style='height:97%;display:none;'><textarea id='__GridModelData' style='width:100%;height:100%;'></textarea></div>");
    //加载样例数据
	var modeldata = RDCP.PROPERTY_GRIDS[property_grid_id].getProperties(code);    
    var modeldata_str = modeldata["value"] == "" ? "" : modeldata["value"];
    if(modeldata_str != ""){
    	var data = CORE.str2json(modeldata_str);
    	var rows = data.body.rows;
    	modeldata_str = "";
    	for(var i = 0;i<rows.length;i++)
    	{
    		var row = rows[i].cell;
    		for(var j = 0;j<row.length;j++)
    		{
    			if(j != 0)
    				modeldata_str += ",";
	    		modeldata_str += row[j];
    		}
    		if(i != rows.length-1)
	    		modeldata_str += ";";
    	}
    } 
    $("#__GridModelData").val(modeldata_str);
    //弹出编辑框
    $("#_GridModelDataEditor_dlg").dialog(_dlgOpt);
}

/**
 * 根据用户提供格式转换为JSON
 */
function _generateGridModelData(sourcedata){
	//返回的结果
	var gridJson = {
		"header":{
			"code":"0",
			"message":"success",
			"isAlert":"false"
		},
		"body":{
			"page":"1",
			"total":"0",
			"records":"0",
			"rows":[]
		}			
	}
	//获取各行记录
	var lines = sourcedata.split(";");
	if(lines.length==0)
		return "";
	//组织参数
	var records = lines.length + "";	
	var total = 1;
	if(records.length%15==0)
		total = parseInt(records/15);
	else
		total = parseInt(records/15+1);
	//组织ROW数组
	var rows = new Array();
	for(var i = 0;i<lines.length;i++)
	{
		var row = {"id":"","cell":[]};
		row.id = Date.parse(new Date());
		
		var temp = lines[i].split(",");
		var cell = new Array();
		for(var j = 0;j<temp.length;j++)
		{	
			temp[j] = jQuery.trim(temp[j]);
			cell.push(temp[j]);
		}
		row.cell = cell;
		
		rows.push(row);
	}
	gridJson.body.total = total;
	gridJson.body.records = records;
	gridJson.body.rows = rows;
	return gridJson;
}

//注册属性编辑器
RDCP.registerEditor(new RDCP.gridModelDataEditor());