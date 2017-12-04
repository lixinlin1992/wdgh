/**
 * Created by dlz on 2017/6/17.
 */
//菜单列表参数--start
var params = {
    fitColumns: true,
    rownumbers:true,
    // onClickRow: getFactorRow,
    columns: [
        [
            {field: 'MENU_ID', title: 'MENU_ID', hidden: true, sortable: false, align: 'center', width: 0},
            {
                field: 'OPT',
                title: '操作',
                sortable: false,
                align: 'center',
                width: 180,
                formatter: function (cell, row, index) {
                    var edit = '<a class="btn_edit" href="javascript:void(0);"  onclick="editMenuItem(\'' + row.MENU_ID + '\',\''+row.MENU_NAME+'\');">修改名称</a>';
                    return  edit;
                }
            },
            {field: 'MENU_NAME', title: '菜单名', sortable: false, align: 'center', width: 420},
            {field: 'MENU_TYPE', title: '菜单级别', sortable: false, align: 'center', width: 80},
            {field: 'P_MENU_NAME', title: '父菜单', sortable: false, align: 'center', width: 80},
            {field: 'MENU_URL', title: 'URL', sortable: false, align: 'center', width: 80}
        ]
    ]
};
//校园文化列表参数--end
/**
 * rdcp.JS框架初始化
 */
rdcp.ready(function () {
    //生成表格rdcp.grid(tableId,url,formName,表格参数)
    rdcp.grid('listdt', '!gh/info/~query/Q_MENU_ITEM_LIST', "searchForm", params);

});
//修改菜单名称
function editMenuItem(menu_id,menu_name) {
    $("#menuid").val(menu_id);
    $("#menuname").val(menu_name);
    rdcp.dialog(dlgOpts);
}
var dlgOpts = {
    title: "修改菜单名称",
    id: "dialog",
    width: "450",
    height: "200",
    parentwidth: true,
    modal: true,
    buttons: [
        {
            text: '确定',
            handler: function () {
                rdcp.form.submit("editmenuform", {url: "!gh/info/~query/Q_UPDATE_MENU_ITEM",
                    success: function (data) {
                        if (data.header.code == 0) {
                            $("#dialog").dialog("close");
                            $.messager.alert('提示', '菜单名称修改成功！', 'info');
                            rdcp.grid.reload("listdt");
                        } else {
                            $.messager.alert('提示', '菜单名称修改失败！', 'error');
                        }
                    }
                });

            }
        },
        {
            text: '取消',
            handler: function () {
                $("#dialog").dialog("close");
            }
        }
    ]
};

