/**
 * @(#)templateList.js 11-6-10 下午9:52
 * CopyRight 2011.  All rights reserved
 *
 */
/**
 * 模板管理js
 * User: kinz
 */

var templateGridParam = {
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
            width:100
        },
        {
            name:"创建者",
            index:"create_user_name",
            width:100
        },
        {
            name:"创建时间",
            index:"create_date",
            width:100
        },
        {
            name:"操作",
            index:"operate",
            width:50,
            sortable:false,
            formatter:function(cell, options, row, tr, td) {
                return GRID.button({className:"btn_edit",onclick:"editTemplate('"+row["id"]+"');",title:"修改模板"})+
                        GRID.button({className:"btn_delete",onclick:"delTemplate('"+row["id"]+"');",title:"删除模板"});
                /*
                return "<input value='修改' type='button' class='grid_button' onclick='editTemplate(\""+row[0]+"\")'>" +
                	   "<input value='删除' type='button' class='grid_button' onclick='delTemplate(\""+row[0]+"\")'>";
                	   */
            }
        }
    ],
    caption : "模板列表",
    multiselect:false,
    width:"98.5%",
    pager: "#pagerdt"
};


$(document).ready(function() {
    GRID.create("#templateList", "DS_TEMPLATE_CONFIG_LIST", templateGridParam, "templateManagerForm");
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
            $("#Template_Edit_Dlg").dialog("close");
        },
        "保存":function() {
            document.getElementById('_EditFrame').contentWindow.saveTemplate();
        }
    }
};

function close(){
    $("#Template_Edit_Dlg").dialog("close");
    GRID.reload("templateList");
}

/**
 * 添加一个新的模板
 */
function addTemplate() {
    $("#Template_Edit_Dlg").dialog(_EditDlgOpt);
    $("#_EditFrame").attr("src", "pages/rdcp/page/templateEdit.jsp");
}

/**
 * 删除模板
 */
function delTemplate(id) {
	CORE.confirm("是否确认删除?", function() {
	 	CORE.request("DS_TEMPLATE_CONFIG_DEL",{data:"id="+id}, function(data) {
             GRID.reload("templateList");
        });
	});
}

/**
 * 编辑模板
 * @param id
 */
function editTemplate(id){
    $("#Template_Edit_Dlg").dialog(_EditDlgOpt);
    $("#_EditFrame").attr("src", "pages/rdcp/page/templateEdit.jsp?id="+id);
}