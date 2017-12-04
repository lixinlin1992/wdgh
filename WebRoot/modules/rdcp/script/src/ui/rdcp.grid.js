/**
 * 表格控件
 * User: wensen
 * Date: 2013-4-24
 * Time: 下午16:45
 * 功能：表格控件默认树形
 */
rdcp.gridDefaults = {
    fit: false,
    nowrap: true,
    autoRowHeight: false,
    striped: true,
    collapsible: true,
    sortOrder: 'desc',
    remoteSort: true,
    singleSelect: true,
    fitColumns: true,
    pagination: true,
    rownumbers: false,
    pagePosition: 'bottom',
    pageSize: 13,
    pageList: [13, 20, 25, 30],
    onBeforeLoad: function (param) {
        var $grid = $(this);
        var settings = $grid.datagrid("options");
        var formIds = settings.formIds;

        var formIdArray = rdcp.string2Array(formIds, ",");
        rdcp.each(formIdArray, function (index) {
            var formId = formIdArray[index];
            // 绑定提交事件
//            rdcp.id(formId).submit(function () {
//                rdcp.grid.reload(id);
//                return false;  //需要return false 否则会自动跳转
//            });
            $.extend(param, rdcp.formToMap(formId));
        });
    },
    onLoadError: function () {
        alert("加载失败");
    },
    loadFilter: function (data, parent) {
        var result = rdcp.unescapeJson(data);
        if (result.body != undefined) {
            rdcp.checkResponseCode(result.header);
            return  result.body;
        } else {
            return  result;
        }
    }
};

/**
 * 表格控件
 * @param id jquery的id选择器
 * @param ds 数据服务  （!test/ds/DS_USER_LIST_TEST 数据服务的访问方式）
 * @param formIds  搜索表单
 * @param p 参数
 *
 */
rdcp.grid = function (id, ds, formIds, p) {

    var $grid = rdcp.id(id);
    p.url = ds.indexOf("!") == 0 ? ds : "framework.do?ds=" + ds;
    p.formIds = formIds;

    var settings = rdcp.extend({}, rdcp.gridDefaults, p);
    $grid.datagrid(settings);

};

/**
 *  提交表单查询
 *  @param   gridId    jquery的id选择器
 *  @param   formId  from表单的id
 *
 */
rdcp.grid.reload = function (gridId) {
    var $grid = rdcp.id(gridId);
    $grid.datagrid('reload');
};

/**
 * 获取选中的多行
 * @param id jquery选择器
 * 返回的对象用：分隔
 *
 */
rdcp.getCheckedRow = function (id) {
    var $rows = rdcp.id(id).datagrid('getSelections');
    return $rows;
};

/**
 * 单击行
 * @param id jquery选择器
 * 返回的对象用：分隔
 *
 */
rdcp.clickRow = function (id, rowIndex) {
    var gridObj = rdcp.id(id);
    gridObj.datagrid('clearSelections');
    var i = gridObj.datagrid('selectRow', rowIndex);
    var $rows = gridObj.datagrid('getSelections');
    return $rows;
};

/**
 * 单击表格任意行，返回
 * 首先要监听表格
 * @param id jquery表格选择器
 * @param fn 函数
 * @param index 行索引
 */
rdcp.onRowSelected = function (id, fn, index) {
    var row = rdcp.id(id).datagrid('getSelected', index);
    fn.call(this, row);
};

/**
 * 单击表格行事件
 * 首先要监听表格 :加入onClickRow：函数
 * @param id jquery表格选择器
 * @param fn 函数
 * 调用方法rdcp.grid.onClickRow(表格id,function(data){})
 * */
rdcp.grid.onClickRow = function (id, fn, p) {
    var row = rdcp.id(id).datagrid('getSelected');
    if (row) {
        fn(row);
    }
};
