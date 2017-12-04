/**
 * @(#)datasource.help.js.js 11-9-15 下午3:31
 * CopyRight 2011.  All rights reserved
 *
 * 提供数据源相关的辅助函数
 */
/**
 * User: kinz
 */


$_dsTestDlg = null;

$_dsTestDlgOpts = {
    title:"测试数据源",
    width:"400",
    height:"400",
    modal:false,
    bgiframe:true,
    resizeable:false,
    buttons:{
        "关闭":function () {
            $_dsTestDlg.dialog("close");
        },
        "清空结果":function () {
            $("#_DS_TEST_RESULT_AREA__").val("");
        },
        "测试":function () {
            with (document.Data_Source_Test_Form__) {
                //alert($("#_DS_TEST_TYPE_AJAX__").attr("checked"));
                if ($("#_DS_TEST_TYPE_AJAX__").attr("checked")) {
                    //alert("ajax,"+ds.value);
                    CORE.request(ds.value, {data:"_sysCode=" + _sysCode.value + "&" + _params.value}, function (data) {
                        $("#_DS_TEST_RESULT_AREA__").val(CORE.json2str(data));
                    });
                } else {
                    CORE.goToDS(ds.value, "_sysCode=" + _sysCode.value + "&" + _params.value, null, "_new");
                }
            }
        }
    }
};

/**
 * 测试数据源
 * @param sys_code
 * @param ds_code
 */
function testDataSource(sys_code, ds_code) {
    //如果没有创建对话框，则创建一个新的对话框
    if ($_dsTestDlg == null) {
        _buildTestDlg();
        $_dsTestDlg = $("#_DS_TEST_DLG_DIV_");
    }

    //设置表单的值
    with (document.Data_Source_Test_Form__) {
        reset();

        _sysCode.value = sys_code;
        ds.value = ds_code;
    }

    //显示对话框
    $_dsTestDlg.dialog($_dsTestDlgOpts);
}


function _buildTestDlg() {
    var _html = "<div id='_DS_TEST_DLG_DIV_' style='display: none;'><form name='Data_Source_Test_Form__'>" +
            "<table>" +
            "<tr class='formRow'>" +
            "<td class='formLabel' width='100'>系统编码：</td>" +
            "<td class='formField'><input type='text' name='_sysCode' value='' style='width: 98%;'></td>" +
            "</tr>" +
            "<tr class='formRow'>" +
            "<td class='formLabel' width='100'>数据源编码：</td>" +
            "<td class='formField'><input type='text' name='ds' value='' style='width: 98%;'></td>" +
            "</tr>" +
            "<tr class='formRow'>" +
            "<td class='formLabel' width='100'>参数：</td>" +
            "<td class='formField'><input type='text' name='_params' value='' style='width: 98%;'></td>" +
            "</tr>" +
            "<tr class='formRow'>" +
            "<td class='formLabel' width='100'>提交方式：</td>" +
            "<td class='formField'><label><input id='_DS_TEST_TYPE_AJAX__' type='radio' name='type' value='0' checked>AJAX方式</label><label><input type='radio' name='type' value='1'>传统方式</label></td>" +
            "</tr>" +
            "<tr class='formRow'>" +
            "<td class='formLabel' width='100'>请求结果：</td>" +
            "<td class='formField'><textarea id='_DS_TEST_RESULT_AREA__' style='width:250px;height: 220px;'></textarea></td>" +
            "</tr>" +
            "</table></form>" +
            "</div>";

    $(document.body).append(_html);
}


var $_datasourceSelect_dlg = null;
var $_datasourceSelect_dlgOpts = {
    title:"选择数据源",
    width:"600",
    height:"400",
    modal:false,
    bgiframe:true,
    resizeable:false,
    buttons:{
        "取消":function () {
            $_datasourceSelect_dlg.dialog("close");
        },
        "清空":function () {
        },
        "确定":function () {
        }
    }
};

var $_datasourceSelect_gridOpts = {
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
                return "<input type='button' value='选择' onclick='_dsSelectCallBack(" + options["rowId"] + ");'>";
            }
        }
    ],
    caption:"用户列表",
    width:"380",
    //parentwidth:true,
    multiselect:true,
    pager:"#datasource_select_datasource_pagerdt_",
    beforeSelectRow:function (rowid, e) {
        return true;
    },
    ondblClickRow:function (rowid, iRow, iCol, e) {
        _dsSelectCallBack(rowid);
    }
};

//缓存选择回调函数
var $_datasourceSelect_callback = function (datasources) {
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
function selectDatasource(options) {
    //如果已经存在对话框，重新打开；否则，构建一个新的对话框
    if ($_datasourceSelect_dlg == null) {
        $.ajax({
            url:'scripts/service/datasource.help.html?t=' + new Date().getTime(),
            type:"GET",
            dataType:'text', //params['dataType'] || 'text',
            data:'',
            success:function (data, textStatus) {
                $(document.body).append(data);
                $_datasourceSelect_dlg = $("#datasource_select_div___");

                //创建部门树
                new ZTree("datasource_select_module_tree___", "DS_RDCP_MODULE_TREE",
                        {nodeClicked:function (event, treeId, node) {
                            with (document.DatasourceSelectQueryForm_) {
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
                            GRID.reload("datasource_select_datasource_List_");
                        }});
                //创建用户列表
                GRID.create("#datasource_select_datasource_List_", "DS_DATA_SOURCE_GRID", $_datasourceSelect_gridOpts,
                        "DatasourceSelectQueryForm_");
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
        $_datasourceSelect_callback = options["selected"];


    $_datasourceSelect_dlgOpts["buttons"]["确定"] = function () {
        _dsSelectCallBack();
    };
    $_datasourceSelect_dlgOpts["buttons"]["清空"] = function () {
        $_datasourceSelect_dlg.dialog("close");
        $_datasourceSelect_callback([]);
    };

    var _grid_obj = $("#datasource_select_datasource_List_");
    //清空已有选择
    _grid_obj.resetSelection();

    if (options['multiselect']) {
        _grid_obj.jqGrid('showCol', 'cb');
    } else {
        _grid_obj.jqGrid('hideCol', 'cb');
    }

    //显示对话框
    $_datasourceSelect_dlg.dialog($_datasourceSelect_dlgOpts);
}

/**
 * 组织数据，并调用设定的回调函数
 * @param rowid
 */
function _dsSelectCallBack(rowid) {
    var _grid_obj = $("#datasource_select_datasource_List_");
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
    if (!$_datasourceSelect_callback(datasources))
        return;
    $_datasourceSelect_dlg.dialog("close");
}