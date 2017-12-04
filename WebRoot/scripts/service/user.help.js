/**
 * 2011-09-08
 * kinz
 *
 * 提供用户相关的简便功能，包括选择用户等
 */

//用户选择对话框对象
var $_userSelect_dlg = null;
var $_userSelect_dlgOpts = {
    title : "选择用户",
    width : "600",
    height : "400" ,
    modal : false,
    bgiframe : true,
    resizeable:false,
    buttons:{
        "取消":function() {
            $_userSelect_dlg.dialog("close");
        },
        "清空":function() {
        },
        "确定":function() {
        }
    }
};

var $_userSelect_gridOpts = {
    colModel:[
        {
            name:"编号",
            index:"id",
            width:30
        },
        {
            name:"工号",
            index:"account",
            width:45
        },
        {
            name:"用户名",
            index:"name",
            width:45
        },
        {
            name:"角色",
            index:"group_name",
            width:75
        },
        {
            name:"操作",
            index:"",
            width:30,
            sortable:false,
            formatter:function(cell, options, row) {
                return "<input type='button' value='选择' onclick='_userSelectCallBack(" + options["rowId"] + ");'>";
            }
        }
    ],
    caption : "用户列表",
    width:"100%",
    parentwidth:true,
    multiselect:true,
    pager: "#user_select_user_pagerdt_",
    beforeSelectRow:function(rowid, e) {
        if (!$_userSelect_multi){
            $(this).jqGrid("resetSelection");
        }
        return true;
    },
    ondblClickRow:function(rowid, iRow, iCol, e) {
        if ($_userSelect_multi)
            return;
        _userSelectCallBack(rowid);
    }
};

//缓存选择回调函数
var $_userSelect_callback = function(users) {
};

//是否多选，默认为多选
var $_userSelect_multi = true;

/**
 * 选择用户，依赖数据源：
 * 1. DS_DEPT_TREE  构建部门树
 * 2. DS_USER_LIST  数据列表来源
 *
 * @param options 选择用户的参数，json对象
 * showDept     是否显示部门机构，暂不实现
 * showQuery    是否显示查询区域，暂不实现
 * conditions   默认的查询条件，暂不实现
 * multiselect  是否多选
 * selected     用户选择事件，如果没有指定，则使用返回值
 */
function selectUser(options) {
    //如果已经存在对话框，重新打开；否则，构建一个新的对话框
    if ($_userSelect_dlg == null) {
        $.ajax({
            url         :    'scripts/service/user.help.html?t=' + new Date().getTime(),
            type        :    "GET",
            dataType    :    'text',//params['dataType'] || 'text',
            data        :    '',
            success     :    function(data, textStatus) {
                $(document.body).append(data);
                $_userSelect_dlg = $("#user_select_div_");

                //创建部门树
                new ZTree("user_select_dept_tree_", "DS_DEPT_TREE", {nodeClicked:function(event, treeId, node) {
                    //设置部门条件
                    document.UserSelectQueryForm_.dept_id.value = node['id'];
                    //alert(document.UserSelectQueryForm_.dept_id.value);
                    GRID.reload("user_select_user_List_");
                }});
                //创建用户列表
                GRID.create("#user_select_user_List_", "DS_USER_LIST", $_userSelect_gridOpts, "UserSelectQueryForm_");
                updateUserDlgSettings(options);
            },
            error       :    function(data) {
            }
        });
    }else{
        updateUserDlgSettings(options);
    }
}

function updateUserDlgSettings(options){
    //设置回调函数
    if (typeof options["selected"] === 'function')
        $_userSelect_callback = options["selected"];

    //alert($_userSelect_callback);
    if (options["multiselect"] != undefined)
        $_userSelect_multi = options["multiselect"];

    $_userSelect_dlgOpts["buttons"]["确定"] = function() {
        _userSelectCallBack();
    };
    $_userSelect_dlgOpts["buttons"]["清空"] = function() {
        $_userSelect_dlg.dialog("close");
        $_userSelect_callback([]);
    };

    var _grid_obj = $("#user_select_user_List_");
    //清空已有选择
    _grid_obj.resetSelection();

    if (options['multiselect']) {
        _grid_obj.jqGrid('showCol', 'cb');
    } else {
        _grid_obj.jqGrid('hideCol', 'cb');
    }

    //显示对话框
    $_userSelect_dlg.dialog($_userSelect_dlgOpts);

    if($_userSelect_multi)
        $("#_single_select_tip").hide();
    else
        $("#_single_select_tip").show();
}

/**
 * 组织数据，并调用设定的回调函数
 * @param rowid
 */
function _userSelectCallBack(rowid) {
    var _grid_obj = $("#user_select_user_List_");
    //组装数据，使用json格式的数据
    var users = [];
    if (rowid != undefined) {
        var _rd__ = _grid_obj.getRowData(rowid);
        //alert(CORE.json2str(_rd__));
        users.push({
            id:_rd__["编号"],
            account:_rd__["工号"],
            name:_rd__["用户名"]
        });
    } else {
        rowid = _grid_obj.getGridParam("selarrrow");
        for (var i = 0; i < rowid.length; i++) {
            var _rd__ = _grid_obj.getRowData(rowid[i]);
            users.push({
                id:_rd__["编号"],
                account:_rd__["工号"],
                name:_rd__["用户名"]
            });
        }
    }
    $_userSelect_dlg.dialog("close");
    //调用回调函数
    $_userSelect_callback(users);
}