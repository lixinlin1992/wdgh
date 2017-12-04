/**
 * operTabs.js
 * 继承baseTabs.js
 * 选项卡的页面按钮操作
 *
 * @author Logic
 * @date 2014-1-2
 */

/*
var tabObj = null;
rdcp.ready(function(){
	tabObj = parent.$("#easytabs");
});
*/
//var tabObj = parent.$("#easytabs");

/* 
 * 打开一个选项卡
 * 如果要打开的选项卡已存在，则选择该选项卡，否则在选项卡栏添加一个选项卡
 */
OpenTab = function (tabId, title, url){
	var tabObj = parent.$("#easytabs");
	Logic.OpenTab(tabObj, tabId, title, url);
};

/* 
 * 关闭选项卡
 */
CloseTab = function (tabId, title) {
	var tabObj = parent.$("#easytabs");
	Logic.CloseTab(tabObj, tabId, title);
};

/* 
 * 先关闭再打开选项卡
 */
CloseAndOpenTab = function (tabId, title, url, operId){
	var tabObj = parent.$("#easytabs");
	//先关闭
	Logic.CloseTab(tabObj, tabId + '_' + operId, title);
	//打开
	Logic.OpenTab(tabObj, tabId + '_' + operId, title, url);
};

/* 
 * 先关闭操作选项卡
 */
CloseOperTab = function (tabId, title, operId){
	var tabObj = parent.$("#easytabs");
	//先关闭
	Logic.CloseTab(tabObj, tabId + '_' + operId, title);
};
