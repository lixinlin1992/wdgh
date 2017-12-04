var $_pageSelect_dlg = null;
var $_pageSelect_dlgOpts = {
    title:"选择页面",
    width:"600",
    height:"400",
    modal:false,
    bgiframe:true,
    resizeable:false,
    buttons:{
        "取消":function () {
            $_pageSelect_dlg.dialog("close");
        },
        "清空":function () {
        },
        "确定":function () {
        }
    }
};

var $_pageSelect_gridOpts = {
    colModel:[
        {
            name:"编码",
            index:"code",
            width:30
        },
        {
            name:"名称",
            index:"name",
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
                return "<input type='button' value='选择' onclick='_pgSelectCallBack(" + options["rowId"] + ");'>";
            }
        }
    ],
    caption:"页面列表",
    width:"380",
    //parentwidth:true,
    multiselect:true,
    pager:"#page_select_page_pagerdt_",
    beforeSelectRow:function (rowid, e) {
        return true;
    },
    ondblClickRow:function (rowid, iRow, iCol, e) {
        _pgSelectCallBack(rowid);
    }
};

//缓存选择回调函数
var $_pageSelect_callback = function (datasources) {
};

/**
 * 选择用户，依赖数据源：
 * 1. DS_RDCP_MODULE_TREE  构建系统模块树
 * 2. DS_DATA_SOURCE_GRID  数据列表来源
 *
 * @param options 选择用户的参数，json对象
 * showModule   是否显示部门机构，暂不实现
 * showQuery    是否显示查询区域，暂不实现
 * conditions   默认的查询条件，暂不实现
 * selected     用户选择事件，如果没有指定，则使用返回值
 *
  * 选择数据源函数使用方法：
  * selectDatasource({selected:function(ds){
  *      alert(CORE.json2str(ds));
  *      return true;
  *  }
  * })
  * 传入回调函数的参数为一个数组，格式如下：[{name:'a',code:'a_c',sys_code:'xt'}...]
 */
function selectPage(options) {
    //如果已经存在对话框，重新打开；否则，构建一个新的对话框
    if ($_pageSelect_dlg == null) {
        $.ajax({
            url:'scripts/rdcp/plugins/pageField.help.html?t=' + new Date().getTime(),
            type:"GET",
            dataType:'text', //params['dataType'] || 'text',
            data:'',
            success:function (data, textStatus) {
                $(document.body).append(data);
                $_pageSelect_dlg = $("#page_select_div___");

                //创建部门树
                new ZTree("page_select_module_tree___", "DS_RDCP_MODULE_TREE",
                        {nodeClicked:function (event, treeId, node) {
                            with (document.PageSelectQueryForm_) {
                                if (node.type == '0') {
                                    //选中的是业务系统
                                    sys.value = node["id"];
                                    mol_id.value = "";
                                } else {
                                    //选中的是模块
                                    sys.value = "";
                                    mol_id.value = node['id'];
                                }
                                //alert(document.DatasourceSelectQueryForm_.dept_id.value);
                            }
                            GRID.reload("page_select_page_List_");
                        }});
                //创建用户列表
                GRID.create("#page_select_page_List_", "DS_PAGE_SELECTER_LIST", $_pageSelect_gridOpts,
                        "PageSelectQueryForm_");
                _updateDSettings(options);
            },
            error:function (data) {
            }
        });
    } else {
        _updateDSettings(options);
    }
}

function _updateDSettings(options) {
    //设置回调函数
    if (typeof options["selected"] === 'function')
        $_pageSelect_callback = options["selected"];


    $_pageSelect_dlgOpts["buttons"]["确定"] = function () {
        _pgSelectCallBack();
    };
    $_pageSelect_dlgOpts["buttons"]["清空"] = function () {
        $_pageSelect_dlg.dialog("close");
        $_pageSelect_callback([]);
    };

    var _grid_obj = $("#page_select_page_List_");
    //清空已有选择
    _grid_obj.resetSelection();

    if (options['multiselect']) {
        _grid_obj.jqGrid('showCol', 'cb');
    } else {
        _grid_obj.jqGrid('hideCol', 'cb');
    }

    //显示对话框
    $_pageSelect_dlg.dialog($_pageSelect_dlgOpts);
}

/**
 * 组织数据，并调用设定的回调函数
 * @param rowid
 */
function _pgSelectCallBack(rowid) {
    var _grid_obj = $("#page_select_page_List_");
    //组装数据，使用json格式的数据
    var datasources = [];
    if (rowid != undefined) {
        var _rd__ = _grid_obj.getRowData(rowid);
        //alert(CORE.json2str(_rd__));
        datasources.push({
            code:_rd__["编码"],
            name:_rd__["名称"],
            sys_code:_rd__["系统编码"]
        });
    } else {
        rowid = _grid_obj.getGridParam("selarrrow");
        for (var i = 0; i < rowid.length; i++) {
            var _rd__ = _grid_obj.getRowData(rowid[i]);
            datasources.push({
                code:_rd__["编码"],
                name:_rd__["名称"],
                sys_code:_rd__["系统编码"]
            });
        }
    }
    //调用回调函数，如果返回false，则不关闭对话框
    if (!$_pageSelect_callback(datasources))
        return;
    $_pageSelect_dlg.dialog("close");
}