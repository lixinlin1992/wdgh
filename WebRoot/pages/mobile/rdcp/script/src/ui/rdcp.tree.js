/**
 * 默认树参数
 * @type {{}}
 */
rdcp.treeDefaults = {
    // 动画
    animate: false,
    // 结构线
    lines: true,
    // 是否显示多选框
    checkbox: false,
    // 是否级联选中,checkbox = true时生效
    cascadeCheck: true,
    // 是否只能勾选根节点,checkbox = true时生效
    onlyLeafCheck: false,
    // 是否能拖拽
    dnd: false,
    onBeforeLoad: function (node, param) {
        if (node) {
            param.typeId = node.attributes.typeid;
            param.ptypeId = node.attributes.ptypeid;
        }

    }

};

/**
 * 属性转换器<br />
 * 每个对象都必须有一个对应的转换器,如果不需要转换,则将转换器初始化为空数组
 * @type {Array}
 */
rdcp.treeAdapter = [];

/**
 * 初始化树对象,参数详情参考rdcp.treeDefaults
 * @param p
 */
rdcp.tree = function (id, ds, p) {
    var $tree = rdcp.id(id);

    p = p == undefined ? {} : p;
    p.url = ds.indexOf("!") == 0 ? ds : "framework.do?ds=" + ds;

    var settings = rdcp.extend({}, rdcp.treeDefaults, p);
    settings = rdcp.adapt(settings, rdcp.treeAdapter);
    $tree.tree(settings);
};

/**
 * 展开所有节点
 * @param id 树ID
 * @param p {*}
 */
rdcp.tree.expandAll = function (id, p) {
    var $tree = rdcp.id(id);
    $tree.tree('expandAll');
};

/**
 * 收缩所有节点
 * @param id 树ID
 * @param p {*}
 */
rdcp.tree.collapseAll = function (id, p) {
    var $tree = rdcp.id(id);
    $tree.tree('collapseAll');
};


/**
 * 获取选中的节点
 * @param id 树ID
 * @param p {*}
 * @return Array 选中节点集合[node1, node2]
 */
rdcp.tree.getSelected = function (id, p) {
    var $tree = rdcp.id(id);
    return $tree.tree('getSelected');
};

/**
 * 获取勾选的节点
 * @param id 树ID
 * @param p {*}
 * @return {*} 选中的节点
 */
rdcp.tree.getChecked = function (id, p) {
    var $tree = rdcp.id(id);
    return $tree.tree('getChecked');
};

/**
 * 选中指定节点
 * @param id 树ID
 * @param nodeId 节点ID
 * @param p {*}
 * @return {*} 选中的节点
 */
rdcp.tree.selectNode = function (id, nodeId, p) {
    var $tree = rdcp.id(id);
    var node = $tree.tree('find', nodeId);
    $tree.tree('select', node.target);
    return node;
};

/**
 * 勾选指定节点
 * @param id 树ID
 * @param nodeIds 需要勾选的树节点ID, 可传入数组或以逗号分隔的字符串
 * @param p {*}
 * @return Array 勾选中的节点
 */
rdcp.tree.checkNode = function (id, nodeIds, p) {
    var $tree = rdcp.id(id);
    var ids = [];
    var nodes = [];

    if (rdcp.isArray(nodeIds)) {
        ids = nodeIds;
    } else {
        ids = nodeIds.split(",");
    }

    rdcp.each(ids, function () {
        var node = $tree.tree('find', this);
        $tree.tree('check', node.target);
        nodes.push(node);
    });
    return nodes;
};

/**
 * @param id  树ID
 * @param f  执行onClick后执行的回掉函数
 * @param p 参数
 * @return {*}  执行回调函数
 */
rdcp.tree.onClick = function (id, f) {
    var $tree = rdcp.id(id);
    $tree.tree('onClick', f);
};

