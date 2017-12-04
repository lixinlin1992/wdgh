/**
 * baseTabs.js<br>
 * 选项卡操作
 *
 * @author Logic
 * @date 2014-1-2
 */
 
var Logic = {

    /**
     * 版本号<br>
     * 尾数为奇数则为测试版,尾数为偶数则为稳定版
     */
    version: 0.1
}

/* 
 * 打开一个选项卡
 * 如果要打开的选项卡已存在，则选择该选项卡，否则在选项卡栏添加一个选项卡
 */
Logic.OpenTab = function (tabObj, tabId, title, url){
	var tt = '<input type="hidden" id="easytab_' + tabId + '" />' + title;
    if(tabObj.tabs('exists', tt)){
        tabObj.tabs('select', tt);
    } else {
    	tabObj.tabs('add',{
            title: tt,
            content: Logic.CreateTabContent(tabId, url),
            closable: true,
            icon: ""
        });
    }
};

/* 
 * 生成选项卡
 */
Logic.CreateTabContent = function (tabId, url){
    return '<iframe name="tab_iframe_' + tabId + '" id="tab_iframe_' + tabId + '" style="width:100%;height:99%;" scrolling="auto" frameborder="0" src="' + url + '"></iframe>';
};

/* 
 * 关闭选项卡
 */
Logic.CloseTab = function (tabObj, tabId, title) {
	var tt = '<input type="hidden" id="easytab_' + tabId + '" />' + title;
	if(tabObj.tabs('exists', tt)){
		tabObj.tabs('close', tt);
    } else {
    	//alert("界面不存在该选项卡");
    }
};