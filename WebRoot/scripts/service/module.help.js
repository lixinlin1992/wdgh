/**
 * 模块辅助脚本
 * 依赖于 ztree.help.js
 * 依赖数据源：DS_RDCP_MODULE_TREE
 */


/**
 * 选择模块
 * @param selected 选中后的回调函数，fucntion(node){}
 * @param syscode 指定系统编码，如果不指定，则展示所有的模块以供选择
 * @param ismaster 只展示当前登录人才可以看到的模块树
 * @return 一个ZTree对象
 */
function selectModule(selected, syscode,sysselectable,ismaster) {
    var otherParam_ = [];
    if(syscode != null && syscode!=""){
        otherParam_.push("sys_code");
        otherParam_.push(syscode);
    }
    //李嘉伟 2011-09-17 添加master参数 只展示当前登录人才可以看到的模块树
    if(ismaster != null && ismaster!="" && ismaster){
        otherParam_.push("master");
        otherParam_.push(ismaster);
    }
    return buildSelectTree("DS_RDCP_MODULE_TREE", "_module_tree_selector___", {select:function(node) {
        if(sysselectable!= null && !sysselectable && node != null && node.type=="0")
            return false;
        selected(node);
        return true;
    },otherParam:otherParam_});
}