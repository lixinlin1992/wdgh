/**
 * @(#)query.help.js.js 11-11-24 上午10:38
 * CopyRight 2011.  All rights reserved
 *
 */
/**
 * 查询管理辅助脚本
 * User: kinz
 */


var $_querySelect_dlg = null;
var $_querySelect_dlgOpts = {
    title:"选择查询",
    width:"600",
    height:"400",
    modal:false,
    bgiframe:true,
    resizeable:false,
    buttons:{
        "取消":function () {
            $_querySelect_dlg.dialog("close");
        },
        "清空":function () {
        },
        "确定":function () {
        }
    }
};

var $_querySelect_gridOpts = {
    colModel:[
        {
            name:"查询编码",
            index:"code",
            width:30
        },
        {
            name:"查询名称",
            index:"queryName",
            width:45
        },
        {
            name:"系统编码",
            index:"sys_code",
            width:45
        },
        {
            name:"备注",
            index:"note",
            width:75
        },
        {
            name:"操作",
            index:"",
            width:30,
            sortable:false,
            formatter:function (cell, options, row) {
                return "<input type='button' value='选择' onclick='_qryCallback(" + options["rowId"] + ");'>";
            }
        }
    ],
    caption:"用户列表",
    width:"100%",
    parentwidth:true,
    multiselect:true,
    pager:"#query_select_query_pagerdt_",
    beforeSelectRow:function (rowid, e) {
        return true;
    },
    ondblClickRow:function (rowid, iRow, iCol, e) {
        _qryCallback(rowid);
    }
};

//缓存选择回调函数
var $_querySelect_callback = function (querys) {
};

/**
 * 选择用户，依赖数据源：
 * 1. DS_RDCP_MODULE_TREE  构建部门树
 * 2. DS_QUERY_MANAGER_LIST  数据列表来源
 *
 * @param options 选择用户的参数，json对象
 * showModule   是否显示部门机构，暂不实现
 * showQuery    是否显示查询区域，暂不实现
 * conditions   默认的查询条件，暂不实现
 * selected     用户选择事件，如果没有指定，则使用返回值
 */
function selectQuery(options) {
    //如果已经存在对话框，重新打开；否则，构建一个新的对话框
    if ($_querySelect_dlg == null) {
        $.ajax({
            url:'scripts/service/query.help.html?t=' + new Date().getTime(),
            type:"GET",
            dataType:'text', //params['dataType'] || 'text',
            data:'',
            success:function (data, textStatus) {
                $(document.body).append(data);
                $_querySelect_dlg = $("#query_select_div___");

                //创建部门树
                new ZTree("query_select_module_tree___", "DS_RDCP_MODULE_TREE",
                        {nodeClicked:function (event, treeId, node) {
                            with (document.QuerySelectQueryForm_) {
                                if (node.type == '0') {
                                    //选中的是业务系统
                                    sys_code.value = node["id"];
                                    moduleId.value = "";
                                } else {
                                    //选中的是模块
                                    sys_code.value = "";
                                    moduleId.value = node['id'];
                                }
                                //alert(document.QuerySelectQueryForm_.dept_id.value);
                            }
                            GRID.reload("query_select_query_List_");
                        }});
                //创建用户列表
                GRID.create("#query_select_query_List_", "DS_QUERY_MANAGER_LIST", $_querySelect_gridOpts,
                        "QuerySelectQueryForm_");
                _updateQryDlgSettings(options);
            },
            error:function (data) {
            }
        });
    } else {
        _updateQryDlgSettings(options);
    }
}

function _updateQryDlgSettings(options) {
    //设置回调函数
    if (typeof options["selected"] === 'function')
        $_querySelect_callback = options["selected"];


    $_querySelect_dlgOpts["buttons"]["确定"] = function () {
        _qryCallback();
    };
    $_querySelect_dlgOpts["buttons"]["清空"] = function () {
        $_querySelect_dlg.dialog("close");
        $_querySelect_qryCallback([]);
    };

    var _grid_obj = $("#query_select_query_List_");
    //清空已有选择
    _grid_obj.resetSelection();

    if (options['multiselect']) {
        _grid_obj.jqGrid('showCol', 'cb');
    } else {
        _grid_obj.jqGrid('hideCol', 'cb');
    }

    //显示对话框
    $_querySelect_dlg.dialog($_querySelect_dlgOpts);
}

/**
 * 组织数据，并调用设定的回调函数
 * @param rowid
 */
function _qryCallback(rowid) {
    var _grid_obj = $("#query_select_query_List_");
    //组装数据，使用json格式的数据
    var querys = [];
    if (rowid != undefined) {
        var _rd__ = _grid_obj.getRowData(rowid);
        //alert(CORE.json2str(_rd__));
        querys.push({
            code:_rd__["查询编码"],
            name:_rd__["查询名称"],
            sys_code:_rd__["系统编码"]
        });
    } else {
        rowid = _grid_obj.getGridParam("selarrrow");
        for (var i = 0; i < rowid.length; i++) {
            var _rd__ = _grid_obj.getRowData(rowid[i]);
            querys.push({
                code:_rd__["查询编码"],
                name:_rd__["查询名称"],
                sys_code:_rd__["系统编码"]
            });
        }
    }
    //调用回调函数，如果返回false，则不关闭对话框
    if (!$_querySelect_callback(querys))
        return;
    $_querySelect_dlg.dialog("close");
}