/**
 * 提供对系统功能进行操作的辅助功能
 *
 */

/**
 * 构建一个模块功能树以供选择使用
 * @param {Object} name
 * @param {Object} options
 * select : 选中后触发的事件
 * multi : 是否多选
 * rootId : 根节点ID
 */
function selectModuleOrFunction(name, options) {
    return buildSelectTree("DS_MODULE_FUNCTION_TREE", name, options);
}

/**
 * 构建一个菜单树以供选择
 * @param {Object} name
 * @param {Object} options
 * select : 选中后触发的事件
 * multi : 是否多选
 * rootId : 根节点ID
 */
function selectMenu(name, options) {
    return buildSelectTree("DS_MENU_TREE", name, options);
}

/**
 *
 * 选择功能
 * @param selected 选中后的回调函数，fucntion(node){}
 * @param syscode 指定系统编码，如果不指定，则展示所有的模块以供选择
 * @return 一个ZTree对象
 */
function selectFunction(selected, syscode) {
    var otherParam_ = [];
    if (syscode != null && syscode != "") {
        otherParam_.push("sys_code");
        otherParam_.push(syscode);
    }
    return buildSelectTree("DS_RDCP_FUNCTION_TREE", "_function_tree_selector__", {select:function(node) {
        if (node == null || node == undefined || node.type == "2") {
            return selected(node);
        } else {
            return false;
        }
    },otherParam:otherParam_});
}