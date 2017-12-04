/**
 * @(#)codeList.js.js 11-7-7 下午4:09
 * CopyRight 2011.  All rights reserved
 *
 */
/**
 * User: kinz
 */
var gridParams = {
    colModel : [
        {
            name:'编码',
            index:'code_num',
            align:'center',
            width:50
        },
        {
            name : '编码名称',
            index : 'c.name',
            align : "center",
            width : 60
        },
        {
            name:'类型',
            index:'type_name',
            align:'center',
            width:60
        },
        {
            name : '编码排序',
            index : 'order_id',
            width : 40,
            align : "center"
        },
        {
            name : '业务表',
            index : 'code_table_name',
            width : 60,
            align : "center"
        },
        {
            name:'业务字段',
            index:'code_field_name',
            width:60,
            align:'center'
        },
        {
            name : '编码备注',
            index : 'c.note',
            align : "center",
            width : 100
        },
        {
            name : '操作',
            //index : '_op',
            align : 'center',
            width : 50,
            formatter : function(cell, option, row, tr, td) {
                var _html = GRID.button({className:"btn_edit",title:"修改编码",onclick:"editCode('"+cell.split(",")[0]+"');"});
                if (cell.split(",")[1] == "1") {
                    _html += "&nbsp;&nbsp;" +
                            ((cell.split(",")[2] == "0") ?
                                    GRID.button({className:"btn_restore",title:"恢复编码",onclick:"restoreCode('"+cell.split(",")[0]+"');"}):
                                    GRID.button({className:"btn_delete",title:"删除编码",onclick:"deleteCode('"+cell.split(",")[0]+"');"}));
                }
                return _html;
            },
            sortable : false
        }
    ],
    caption : "基础编码",
    edit : true,
    align : "center",
    width : "98.5%",
    pager: '#pagered',
    editurl:"",
    cellEdit:false
};

$(function() {
    GRID.create("#listtable", "DS_SYS_CODE_LIST", gridParams, "QueryForm");

    CORE.loadSelect("Q_sys_code", "DS_COMMON_SELECT", {data:"tname=SYS_BI_SYSTEM&lcol=NAME&vcol=CODE"});

    CORE.loadSelect("E_sys_code", "DS_COMMON_SELECT", {data:"tname=SYS_BI_SYSTEM&lcol=NAME&vcol=CODE"});

    CORE.loadSelect("edit_code_type_id", "DS_SYS_CODE_TYPE_SELECT", {data:"edit_flag=1"});
});

function sysCodeSelectChanged(syscode,nextid){
    CORE.loadSelect(nextid, 'DS_SYS_CODE_TYPE_SELECT', {data:"sys_code="+syscode,loadComplete:function(){$("#"+nextid).trigger("change");}});
}


var dlgOpts = {
    title : "添加修改编码",
    width : "320",
    height : "350" ,
    modal : true,
    buttons : {
        '取消':function() {
            $("#EditDialog").dialog("close");
        }
    }
};

//添加新的编码
function addCode() {
    document.EditForm.reset();
    dlgOpts["title"] = "添加编码";
    dlgOpts["buttons"]["确定"] = function() {
        CORE.submitForm("DS_SYS_CODE_ADD", "EditForm", {}, function(data) {
            $("#EditDialog").dialog("close");
            GRID.reload("listtable");
        });
    };
    $("#edit_code_type_id option[gen='true']").remove();
    $(document.EditForm.code_type_id).trigger("change");
    //装载校验规则
    CORE.loadRules("EditForm", "SYS_PA_CODE", false, function() {
        CORE.unlockForm("EditForm",{fields:["code_num","code_type_id"]});
        $("#EditDialog").dialog(dlgOpts);
    });
}

//修改编码
function editCode(id) {
    dlgOpts["title"] = "修改编码";
    dlgOpts["buttons"]["确定"] = function() {
        CORE.submitForm("DS_SYS_CODE_UPDATE", "EditForm", {}, function(data) {
            $("#EditDialog").dialog("close");
            CORE.tip("编码修改成功");
            GRID.reload("listtable");
        });
    };
    CORE.loadForm("DS_SYS_CODE_INFO", "EditForm", {data:"id=" + id,ruleId:"SYS_PA_CODE",loadComplete:function() {
        CORE.lockForm("EditForm",{fields:["code_num","code_type_id"]});
        CORE.loadSelect("edit_code_type_id", 'DS_SYS_CODE_TYPE_SELECT', {data:"sys_code="+$("#E_sys_code").val(),loadComplete:function(){
            $("#EditDialog").dialog(dlgOpts);
        }});
    }});
}

//删除编码
function deleteCode(id) {
    CORE.confirm("确定要删除选中的编码吗？编码删除后将不能被其他用户使用。", function() {
        //进行删除
        CORE.request("DS_SYS_CODE_DELETE", {data:"id=" + id}, function(data) {
            CORE.tip("编码已经删除");
            GRID.reload("listtable");
        });
    });
}

//恢复编码
function restoreCode(id) {
    CORE.confirm("确定要恢复选中的编码吗？", function() {
        //进行恢复
        CORE.request("DS_SYS_CODE_RESTORE", {data:"id=" + id}, function(data) {
            CORE.tip("编码已经恢复");
            GRID.reload("listtable");
        });
    });
}