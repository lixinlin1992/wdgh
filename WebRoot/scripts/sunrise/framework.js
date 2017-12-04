
/**
 * 
 * @param {Object} url
 */
function loadScript(url){
	document.write('<script type="text/javascript" src="' + url+ '"><\/script>');
    //appendScript(url);
}

/**
 *
 * @param url
 */
function appendScript(url,callback){
    //如果未加载完，则100毫秒后再执行
    var oHead = document.getElementsByTagName('HEAD').item(0);
    if(oHead == undefined){
        setTimeout("appendScript('"+url+"')",100);
        return;
    }
    //检查是否已经存在要添加的脚本，如果已经存在则不重复添加
    var _scripts = document.getElementsByTagName("script");
    var _break = false;
    for(var i=0;i<_scripts.length;i++){
        if(_scripts[i].src==url){
            _break = true;
            return;
        }
    }
	var oScript= document.createElement("script");			
	oScript.type = "text/javascript";		
	oScript.src=url;
	oHead.appendChild(oScript);
    oScript.onload=function(){
        if(callback)
               callback();
    };
}

function appendCss(url){
    //如果未加载完，则100毫秒后再执行
    var oHead = document.getElementsByTagName('HEAD').item(0);
    if(oHead == undefined){
        setTimeout("appendCss('"+url+"')",100);
        return;
    }
    //检查是否已经存在要添加的脚本，如果已经存在则不重复添加
    var _css = document.getElementsByTagName("LINK");
    for(var i=0;i<_css.length;i++){
        if(_css[i].href==url)
            return;
    }
    var _cssObj = document.createElement("LINK");
    _cssObj.type = "text/css";
    _cssObj.rel = "stylesheet";
    _cssObj.href = url;
	oHead.appendChild(_cssObj);
}

/**
 * 
 * @param {Object} url
 */
function loadCSS(url) {
	document.write('<LINK href="' + url + '" rel="stylesheet" type="text/css">');
    //appendCss(url);
}

/************************** import css  *****************************/	

loadCSS('themes/default/css/framework.css');
loadCSS('themes/default/css/jquery.loading.css');
loadCSS('themes/default/css/jqGridThemes/themes/ui.jqgrid.css');
loadCSS('themes/default/css/jqGridThemes/themes/redmond/jquery-ui-1.7.1.custom.css');
loadCSS('themes/default/css/lhgdialog.css');
	
/************************** import js  *****************************/	
	
//脚本的根目录
var BASE_PATH = "scripts/";

//imoprt's js//
//loadScript(BASE_PATH + 'common/jquery-1.4.2.min.js');
loadScript(BASE_PATH+'common/jquery-1.7.1.min.js');
loadScript(BASE_PATH+'common/jquery.sorted.js');
loadScript(BASE_PATH + 'common/jquery-ui.min.js');
loadScript(BASE_PATH+'common/lhgdialog.min.js');
loadScript(BASE_PATH + 'common/jquery.loading.js');
loadScript(BASE_PATH + 'common/jquery.center.js');
loadScript(BASE_PATH + 'common/json2.js');
loadScript(BASE_PATH + 'sunrise/core.js');
loadScript(BASE_PATH + 'jqgrid/i18n/grid.locale-cn.js');
loadScript(BASE_PATH + 'jqgrid/jquery.jqGrid.min.js');
loadScript(BASE_PATH + 'sunrise/grid.js');
