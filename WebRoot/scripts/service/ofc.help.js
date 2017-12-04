/**
 * 2011-01-08
 * 李嘉伟
 * 
 *
 * 提供OpenFlashChart的初始化,绑定查询表的简化接口,需要加载swfobject.js,CORE.js
 */

var OFC = {
    version:"0.1" //OFC版本
};

//报表返回数据JSON 
var $_chartData = [];
var $_chartForm = [];
var $_chartConfig = [];
/**
 * 绑定报表
 */
OFC.addConfigData = function(id,dataSource,params){	 
    //绑定配置
    var $_chart_config = {}; 
    if (dataSource != undefined)
        $_chart_config.ofcDataSource = dataSource;        
/*    if (params.sysCode != undefined)
        $_chart_config.sysCode = params.sysCode;   
    else if (CORE != undefined)
        $_chart_config.sysCode = CORE.sysCode;  */
    if (params.xaxis_config != undefined)
        $_chart_config.xaxis_config = params.xaxis_config;     
    if (params.yaxis_config != undefined)
        $_chart_config.yaxis_config = params.yaxis_config;   
    if (params.series_config != undefined)
        $_chart_config.series_config = params.series_config;     
    if (params.title != undefined)
        $_chart_config.title = params.title;    
    if (params.bg_colour != undefined)
        $_chart_config.bg_colour = params.bg_colour;       
    $_chartConfig[id] = $_chart_config;        
}

/**
 * 关联表单并请求服务器
 * @param {Object} id 容器ID
 * @param {Object} datasource 数据资源名称
 * @param {Object} params 附加参数
 * @param {Object} formName 表单名称
 * @param {Object} funcObject 获取报表数据
 */
OFC.create = function (id, dataSource, params, formName) {
	//创建表单
     if($("form[name='" + formName + "']").length == 0)
        $("body").append("<form name=\"" + formName + "\"></form>");
    //添加报表必须的数据源
     OFC.addConfigData(id,dataSource,params);
    //绑定表单
     $_chartForm[id] = formName;
    //获取请求数据
     var requestReportData = OFC.getFormData(formName)+OFC.getConfigData(id);
     if(params.data != undefined && params.data != "")
     	requestReportData += "&"+params.data;
     
    //SWF长宽
    var width = params.width;
    var height = params.height;
    if(width == undefined || width == "")
    	width = 800;
    if(height == undefined || height == "")
    	height = 300;
    //请求数据
	 CORE.request(dataSource,{data:requestReportData},function(data){
		 $_chartData[id] = CORE.json2str(data);
	   	 swfobject.embedSWF(  
         	"flash/open-flash-chart.swf?r=" + new Date().getTime(), id,  
         	width, height, "9.0.0", "expressInstall.swf",
            {"get-data":"OFC.getJsonData","id":id},{"wmode":"opaque"}
    	 );  
	 });
}

/**
 * 刷新报表
 * @param {Object} id 容器ID
 * @param {Object} formName 表单名称(可选)
 */
OFC.questload = function(id,params){
	if(params == undefined || params == null)
		params = {};
	if(params.data == undefined || params.data == null)
		params.data = "";
	var dataSource = $_chartConfig[id]["ofcDataSource"];
    var requestReportData = params.data+OFC.getConfigData(id);
	CORE.request(dataSource,{data:requestReportData},
		function(data){
			OFC.findReportSwf(id).load(CORE.json2str(data));			
	});			
}

/**
 * 刷新报表
 * @param {Object} id 容器ID
 * @param {Object} formName 表单名称(可选)
 */
OFC.reload = function(id,formName){
	if(formName == undefined)
		formName = $_chartForm[id]; 
	var dataSource = $_chartConfig[id]["ofcDataSource"];
    var requestReportData = OFC.getFormData(formName)+OFC.getConfigData(id);
	CORE.request(dataSource,{data:requestReportData},
		function(data){
			OFC.findReportSwf(id).load(CORE.json2str(data));			
	});			
}

/**
 * 刷新所有关联报表
 * 
 */
OFC.reloadAll = function(formName){
    for(var key in $_chartForm)
   		if($_chartForm[key] == formName)
    		OFC.reload(key);
}

/**
 * 获取表单请求数据
 * @param {Object} formName 表单名称
 */
OFC.getFormData = function(formName){
	var formDataStr = "";
    var form = eval("document."+formName);
    if (form == null || form == undefined)
        return formDataStr;

    for (var i = 0; i < form.elements.length; i++) {
        var ele = form.elements[i];
        var tagName = ele.nodeName.toLowerCase();
        var type = ele.type.toLowerCase();
        if (tagName == "input") {
            if (type == "checkbox" || type == "radio") {
                if(ele.checked == true)
                	formDataStr += "&"+ele.name+"="+ele.value;
            } else if (type == "text" || type == "hidden") {
            	if(ele.name == "ds")//过滤DS参数
            		continue;
                formDataStr += "&"+ele.name+"="+ele.value;
            }
        } else if (tagName == "select") {
            var options = ele.options;
            for (var j = 0; j < options.length; j++) {
                if (options[j].selected == true) {
                	formDataStr += "&"+ele.name+"="+options[j].value;
                    break;
                }
            }
        } else if (tagName == "textarea") {
            formDataStr += "&"+ele.name+"="+ele.value;
        }
    }
    
    return formDataStr;
}

/**
 * 获取配置请求数据
 * @param {Object} id 容器ID
 */
OFC.getConfigData = function(id){
	var ConfigDataStr = "";
	var $ConfigData = $_chartConfig[id];
/*    if($ConfigData.syscode!=undefined || $ConfigData.syscode!="")
    	ConfigDataStr += "&_sysCode="+$ConfigData.syscode;
 */
    if($ConfigData.xaxis_config!=undefined || $ConfigData.xaxis_config!="")
    	ConfigDataStr += "&xaxis_config="+escape($ConfigData.xaxis_config);
    if($ConfigData.yaxis_config!=undefined || $ConfigData.yaxis_config!="")
    	ConfigDataStr += "&yaxis_config="+escape($ConfigData.yaxis_config);
    if($ConfigData.series_config!=undefined || $ConfigData.series_config!="")
    	ConfigDataStr += "&series_config="+escape($ConfigData.series_config);
    if($ConfigData.title!=undefined || $ConfigData.title!="")
    	ConfigDataStr += "&title="+escape($ConfigData.title);
    if($ConfigData.bg_colour!=undefined || $ConfigData.bg_colour!="")
    	ConfigDataStr += "&bg_colour="+escape($ConfigData.bg_colour);
    return ConfigDataStr;
}

/**
 * 获取报表容器
 * @param {Object} id 容器ID
 */
OFC.findReportSwf = function(id){
	if (navigator.appName.indexOf("Microsoft")!= -1) {  
		return window[id];  
	} else {  
		return document[id];  
	} 
}

/**
 * 获取报表JSON数据
 */
OFC.getJsonData = function(id){
	return $_chartData[id];
}