var _CURRENT_QUERY;//当前查询
var _CURRENT_OBJ;//当前对象
var _CURRENT_OBJ_KEY;//当前对象字段

var userGridParam = {
    sortName: 'ACCOUNT',
    sortOrder: 'ASC',
    idField: 'ID',
    fitColumns: true,
    rownumbers:true,
    columns: [
        [
            {field: 'ACCOUNT', title: '帐号', sortable: true, align: 'left', width: 120},
            {field: 'NAME', title: '名称', sortable: true, align: 'left', width: 300}
        ]
    ],
    onSelect: function (rowIdx, rowData) {
        //先清空已经所有已经选中的授权
        $("._ALL_MODULE").attr("checked", false);
        _CURRENT_OBJ = rowData["ID"];
        //根据选中的用户ID获取该用户的授权
        rdcp.request("!sys/security/~query/Q_GET_USER_RESOURCE", {user_id: rowData["ID"]}, function (data) {
            rdcp.each(data["body"]["rows"], function (idx) {
                rdcp.id(this["ID"]).attr("checked", true);
            });
        }, {mask_msg: "正在加载用户 [" + rowData["NAME"] + "] 的授权信息，请稍候..."});
    }
};

var usergroupGridParam = {
    sortName: 'NAME',
    sortOrder: 'ASC',
    idField: 'CODE',
    fitColumns: true,
    columns: [
        [
            {field: 'CODE', title: '编号', sortable: true, align: 'left', width: 120},
            {field: 'NAME', title: '名称', sortable: true, align: 'left', width: 300}
        ]
    ],
    onSelect: function (rowIdx, rowData) {
        //根据选中的角色获取该用户的授权
        //先清空已经所有已经选中的授权
        $("._ALL_MODULE").attr("checked", false);
        _CURRENT_OBJ = rowData["CODE"];
        //根据选中的用户ID获取该用户的授权
        //根据选中的用户ID获取该用户的授权
        rdcp.request("!sys/security/~query/Q_GET_USERGROUP_RESOURCE", {group_code: rowData["CODE"]}, function (data) {
            rdcp.each(data["body"]["rows"], function (idx) {
                rdcp.id(this["ID"]).attr("checked", true);
            });
        }, {mask_msg: "正在加载角色 [" + rowData["NAME"] + "] 的授权信息，请稍候..."});
    }
};

function loadResources() {
    rdcp.id("resource_container").empty();
    rdcp.request("!sys/security/~query/Q_GET_RESOURCE_LIST", rdcp.id("resourceFormID").serialize(), function (data) {
        if (data["body"]["rows"].length == 0) {
            alert("未搜索到可分配权限的资源");
            return;
        }
        var $resource_container = rdcp.id("resource_container");
        var $module_container;
        var last_module = "";
        var counter = 0;
        rdcp.each(data["body"]["rows"], function (idx) {
            //新的模块
            if (last_module != this["MODULE_PATH"]) {
                $module_container = $("<div id='" + this["MODULE_PATH"] + "' style='padding: 5px;'></div>");
                $resource_container.append($module_container);
                $module_container.panel({
                    width: "auto",
                    title: this["MODULE_NAME"] +
                            '&nbsp;&nbsp;<a href="javascript://" onclick="checkAllResource(' +
                            this["MODULE_ID"] +
                            ',true);">全部授权</a>&nbsp;&nbsp;<a href="javascript://" onclick="checkAllResource(' +
                            this["MODULE_ID"] + ',false);">全部撤销授权</a>'
                });
                counter = 0;
            }
            last_module = this["MODULE_PATH"];
            $module_container.append("<span style='width:125px; display:block; float: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'><label><input type='checkbox' class='_ALL_MODULE  MODULE_" +
                    this["MODULE_ID"] + "' id='" +
                    this["ID"] + "' name='res' module_path='" + this["MODULE_PATH"] +
                    "' value='" +
                    this["RES_PATH"] + "' onclick='resClick(this);'>" +
                    this["RES_NAME"] + "</label></span>");

            //每行最多5个复选框
            if ((counter + 1) % 6 == 0) {
                $module_container.append("<br/>");
                counter = 0;
            } else {
                counter++;
            }
        });
    }, {mask_msg: "正在加载资源信息，请稍候..."});
}


function init() {

    loadResources();

    rdcp.tree("tree", "!org/dept/~query/Q_DEPT_TREE", {
        onClick: function (node) {
            //先清空已经所有已经选中的授权
            $("._ALL_MODULE").attr("checked", false);
            _CURRENT_OBJ = node["id"];
            rdcp.request('!sys/security/~query/Q_GET_DEPT_RESOURCE', {dept_id: node["id"]}, function (data) {
                rdcp.each(data["body"]["rows"], function (idx) {
                    rdcp.id(this["ID"]).attr("checked", true);
                });
            }, {mask_msg: "正在加载部门 [" + node["text"] + "] 的资授权信息，请稍后..."});
        }
    });

    //加载用户组（角色）列表
    rdcp.grid('usergroupGrid', '!org/usergroup/~query/Q_USERGROUP_LIST', "usergroupGridFormID", usergroupGridParam);

    //加载用户列表
    rdcp.grid('userGrid', '!org/user/~query/Q_USER_LIST', "userGridFormID", userGridParam);

    //添加TAB事件
    rdcp.id("OBJ_TABS_ID").tabs({
        onSelect: function (title, index) {
            if ("按用户授权" == title) {
                _CURRENT_OBJ_KEY = "user_id";
                _CURRENT_QUERY = "Q_USER_RESOURCE_";
            } else if ("按角色授权" == title) {
                _CURRENT_OBJ_KEY = "group_code";
                _CURRENT_QUERY = "Q_USERGROUP_RESOURCE_";
            } else {
                _CURRENT_OBJ_KEY = "dept_id";
                _CURRENT_QUERY = "Q_DEPT_RESOURCE_";
            }
            _CURRENT_OBJ = "";
        }
    });
}

/**
 * 授权或者取消授权
 * @param ck
 */
function resClick(ck) {
    if (_CURRENT_OBJ == "") {
        alert("请先选择 用户/角色/部门 再进行授权");
        ck.checked = !ck.checked;
        return;
    }
    var _p = {};
    _p[_CURRENT_OBJ_KEY] = _CURRENT_OBJ;
    _p["res_path"] = ck.value;
    _p["module_path"] = ck.getAttribute("module_path");
    if (ck.checked) {
        rdcp.request("!sys/security/~query/" + _CURRENT_QUERY + "ADD", _p, function (data) {
            //alert("Success!");
        }, {mask_msg: "正在授权，请稍候..."});
    } else {
        rdcp.request("!sys/security/~query/" + _CURRENT_QUERY + "DEL", _p, function (data) {
            //alert("Success!");
        }, {mask_msg: "正在撤销授权，请稍候..."});
    }
}

/**
 * 整个模块授权或者取消授权
 * @param module_id
 */
function checkAllResource(module_id, checked) {
    if (_CURRENT_OBJ == "") {
        alert("请先选择 用户/角色/部门 再进行授权");
        return;
    }
    var $allRes = $(".MODULE_" + module_id);
    $allRes.attr("checked", checked);
    var _p = "";
    _p += _CURRENT_OBJ_KEY + "=" + _CURRENT_OBJ;
    rdcp.each($allRes, function (idx) {
        _p += "&res_path=" + this.value;
        _p += "&module_path=" + this.getAttribute("module_path");
    });
    if (checked) {
        rdcp.request("!sys/security/~query/" + _CURRENT_QUERY + "ADD", _p, function (data) {
            //alert("Success!");
        }, {mask_msg: "正在授权，请稍候..."});
    } else {
        rdcp.request("!sys/security/~query/" + _CURRENT_QUERY + "DEL", _p, function (data) {
            //alert("Success!");
        }, {mask_msg: "正在撤销授权，请稍候..."});
    }
}

/**
 * 刷新授权信息
 */
function reloadAccess() {
    rdcp.request("!sys/security/~query/GET_ALL_ACCESS", {}, function (data) {

    }, {mask_msg: "正在刷新授权缓存，请稍候..."});
}