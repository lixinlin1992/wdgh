/**
 * @(#)commOrgSecurity.js.js 11-5-12 下午5:01
 * CopyRight 2011.  All rights reserved
 *
 */
/**
 * User: kinz
 */

//表格参数
var _gridParam = {
    colNames:["名称","机构","授权类型","可继承","操作"],
    colModel:[
        {
            name:"名称",
            index:"obj_name",
            width:80
        },
        {
            name:"机构",
            index:"org_name",
            width:80
        },
        {
            name:"授权类型",
            index:"type_id",
            width:80,
            formatter:function(cell, options, row, tr, td) {
                return (cell == 1 ? "用户" : "部门");
            }
        },
        {
            name:"可继承",
            index:"ext_flag",
            width:60,
            formatter:function(cell, options, row, tr, td) {
                return cell == 0 ? "可继承" : "不可继承";
            }
        },
        {
            name:"操作",
            width:60,
            formatter:function(cell, options, row, tr, td) {
                return "<input type='button' class='grid_button' value='删除' onclick=''>";
            }
        }
    ],
    caption : "机构授权列表",
    multiselect:false,
    width:"96%",
    pager: "#pagerdt"
};


var _Org_Tree = null;
var _current_dept_node = null;

//执行初始化
$(function() {
    _Org_Tree = new ZTree("ORG_TREE", "DS_COMMORG_TREE", {multi:true});

    new ZTree("DEPARTMENT_TREE", "DS_FRAMEWORK_SECURITY_DEPARTMENT",
    {otherParam:["loadUser","true"],nodeClicked:function(evt, treeId, node) {
        _current_dept_node = node;
        //选中树后，清空当前选中部门或者用户的机构授权状态，并装载选中的部门或者用户的机构权限设置
        _Org_Tree.checkAllNodes(false);
        var _param = "";
        if (node.type == 1) {
            _param = "dept_id=" + node.id;
            $("#_User_Select_Tip").hide();
            $("#_Dept_Select_Tip").show();
        } else {
            _param = "user_id=" + node.id;
            $("#_Dept_Select_Tip").hide();
            $("#_User_Select_Tip").show();
        }
        //alert(_param);
        CORE.request("DS_DEPT_USER_ORGS", {data:_param}, function(data) {
            //alert(CORE.json2str(data));
            //alert(data.length);
            for (var i = 0; i < data.length; i++) {
                var _n = _Org_Tree.getNodeById(data[i]);
                //alert(CORE.json2str(_n));
                _n.checked = true;
                _Org_Tree.updateNode(_n);
            }
        });
    }});
});


//提交授权设置
function submitChanges() {
    if (_current_dept_node == null) {
        CORE.info("请先选中部门或者用户进行设置后再进行提交");
        return;
    }
    var _param;
    if (_current_dept_node.type == 1) {
        //选中的是部门
        _param = "dept_id=" + _current_dept_node.id;
    } else {
        //选中的是用户
        _param = "user_id=" + _current_dept_node.id;
    }
    //组织选中的机构
    var _checkedNodes = _Org_Tree.getCheckedNodes(true);
    for (var i = 0; i < _checkedNodes.length; i++) {
        _param += "&org_id=" + _checkedNodes[i].id;
    }
    //alert(_param);
    //CORE.info(_param);
    //return;
    CORE.request("DS_DEPT_USER_ORG_ADD", {data:_param}, function(data) {
        
    });
}