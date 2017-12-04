/**
 * @(#)instanceList.js.js 11-6-13 下午4:25
 * CopyRight 2011.  All rights reserved
 *
 */
/**
 * 模板实例管理js
 * User: kinz
 */

var instanceGridParam = {
    colNames:["ID","模板名称","创建者","创建时间","操作"],
    colModel:[
        {
            name:"ID",
            index:"id",
            width:100
        },
        {
            name:"模板名称",
            index:"name",
            width:150
        },
        {
            name:"创建者",
            index:"create_user_name",
            width:100
        },
        {
            name:"创建时间",
            index:"create_date",
            width:120
        },
        {
            name:"操作",
            index:"operate",
            width:100,
            sortable:false,
            formatter:function(cell, options, row, tr, td) {
                return "<input value='修改' type='button' class='grid_button' onclick='editTemplate(\"" + row[0] +
                        "\")'>";
            }
        }
    ],
    caption : "模板列表",
    multiselect:false,
    width:"98%",
    pager: "#pagerdt"
};


$(document).ready(function() {
    GRID.create("#instanceList", "DS_TEMPLATE_INSTANCE_LIST", instanceGridParam, "QueryForm");
});

var _EditDlgOpt = {
    title : "编辑模板",
    width : "700",
    height : "500" ,
    modal : true,
    bgiframe : true,
    resizable:false,
    buttons:{
        "取消":function() {
            $("#Instance_Edit_Dlg").dialog("close");
        },
        "保存":function() {
            document.EditFrame.saveTemplate();
        }
    }
};
/**
 * 添加一个新的模板
 */
function addTemplate() {
    $("#Template_Edit_Dlg").dialog(_EditDlgOpt);
    $("#_EditFrame").attr("src", "pages/rdcp/config/templateEdit.jsp");
}

/**
 * 编辑模板
 * @param id
 */
function editTemplate(id) {
    $("#Template_Edit_Dlg").dialog(_EditDlgOpt);
    $("#_EditFrame").attr("src", "pages/rdcp/config/templateEdit.jsp?id=" + id);
}